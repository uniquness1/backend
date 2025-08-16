import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.model.js";
import {
  JWT_EXPIRE_TIME,
  JWT_SECRET,
  REFRESH_TOKEN_SECRET,
  FRONTEND_URL,
} from "../config/env.js";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../utils/emailService.js";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE_TIME,
  });

  const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const existingUserByEmail = await User.findOne({ email }).session(session);
    if (existingUserByEmail) {
      const error = new Error("User with this email already exists");
      error.statusCode = 409;
      return next(error);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    const hashedVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    const newUser = await User.create(
      [
        {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          role: role || "student",
          emailVerificationToken: hashedVerificationToken,
          emailVerificationExpires: verificationTokenExpiry,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    const verificationURL = `${FRONTEND_URL}/auth/verify-email?token=${verificationToken}`;
    await sendVerificationEmail({
      email: newUser[0].email,
      firstName: newUser[0].firstName,
      verificationURL,
    });

    res.status(201).json({
      success: true,
      message:
        "User registered successfully. Please check your email to verify your account.",
      data: {
        user: {
          id: newUser[0]._id,
          firstName: newUser[0].firstName,
          lastName: newUser[0].lastName,
          email: newUser[0].email,
          phoneNumber: newUser[0].phoneNumber,
          isVerified: newUser[0].isVerified,
          isOnboarded: newUser[0].isOnboarded,
        },
      },
    });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("Invalid Password");
      error.statusCode = 401;
      return next(error);
    }

    if (!user.isVerified) {
      const error = new Error(
        "Please verify your email address before signing in. Check your email for verification link."
      );
      error.statusCode = 403;
      error.needsVerification = true;
      error.userId = user._id;
      return next(error);
    }

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          isVerified: user.isVerified,
          isOnboarded: user.isOnboarded,
          role: user.role,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    if (!token) {
      const error = new Error("Verification token is required");
      error.statusCode = 400;
      return next(error);
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    }).select("+emailVerificationToken +emailVerificationExpires");

    if (!user) {
      const error = new Error("Invalid or expired verification token");
      error.statusCode = 400;
      return next(error);
    }
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    res.status(200).json({
      success: true,
      message:
        "Email verified successfully! You can now sign in to your account.",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

export const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      const error = new Error("Email is required");
      error.statusCode = 400;
      return next(error);
    }
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }
    if (user.isVerified) {
      const error = new Error("Email is already verified");
      error.statusCode = 400;
      return next(error);
    }
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const hashedVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    user.emailVerificationToken = hashedVerificationToken;
    user.emailVerificationExpires = verificationTokenExpiry;
    await user.save();
    const verificationURL = `${FRONTEND_URL}/auth/verify-email?token=${verificationToken}`;
    await sendVerificationEmail({
      email: user.email,
      firstName: user.firstName,
      verificationURL,
    });

    res.status(200).json({
      success: true,
      message: "Verification email sent successfully. Please check your email.",
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      const error = new Error("Email is required");
      error.statusCode = 400;
      return next(error);
    }
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetToken = hashedResetToken;
    user.passwordResetExpires = resetTokenExpiry;
    await user.save();
    const resetURL = `${FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
    await sendPasswordResetEmail({
      email: user.email,
      firstName: user.firstName,
      resetURL,
    });
    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const verifyResetToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    if (!token) {
      const error = new Error("Reset token is required");
      error.statusCode = 400;
      return next(error);
    }
    // Hash the provided token to compare with stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+passwordResetToken +passwordResetExpires");
    if (!user) {
      const error = new Error("Invalid or expired reset token");
      error.statusCode = 400;
      return next(error);
    }
    res.status(200).json({
      success: true,
      message: "Reset token is valid",
      data: {
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      const error = new Error(
        "Token, new password, and confirm password are required"
      );
      error.statusCode = 400;
      return next(error);
    }

    if (newPassword !== confirmPassword) {
      const error = new Error("Passwords do not match");
      error.statusCode = 400;
      return next(error);
    }

    if (newPassword.length < 6) {
      const error = new Error("Password must be at least 6 characters long");
      error.statusCode = 400;
      return next(error);
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      const error = new Error("Invalid or expired reset token");
      error.statusCode = 400;
      return next(error);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshToken = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmPassword) {
      const error = new Error(
        "Current password, new password, and confirm password are required"
      );
      error.statusCode = 400;
      return next(error);
    }
    if (newPassword !== confirmPassword) {
      const error = new Error("Passwords do not match");
      error.statusCode = 400;
      return next(error);
    }
    if (newPassword.length < 8) {
      const error = new Error(
        "New password must be at least 8 characters long"
      );
      error.statusCode = 400;
      return next(error);
    }
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      const error = new Error("Current password is incorrect");
      error.statusCode = 400;
      return next(error);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.refreshToken = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    next(err);
  }
};
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      const error = new Error("Refresh token is required");
      error.statusCode = 401;
      return next(error);
    }
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const user = await User.findOne({ _id: decoded.userId }).select(
      "+refreshToken"
    );

    if (!user || user.refreshToken !== refreshToken) {
      const error = new Error("Invalid refresh token");
      error.statusCode = 401;
      return next(error);
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user._id
    );
    user.refreshToken = newRefreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Tokens refreshed successfully",
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      const error = new Error("Invalid refresh token");
      error.statusCode = 401;
      return next(error);
    }
    next(err);
  }
};

export const signOut = async (req, res, next) => {
  try {
    const { userId } = req.user; // Assuming you have auth middleware that sets req.user
    await User.findByIdAndUpdate(userId, {
      $unset: { refreshToken: 1 },
    });

    res.status(200).json({
      success: true,
      message: "User signed out successfully",
    });
  } catch (err) {
    next(err);
  }
};
