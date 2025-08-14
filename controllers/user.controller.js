import mongoose from "mongoose";
import User from "../models/user.model.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error("Invalid user ID");
      error.status = 400;
      throw error;
    }
    const allowedUpdates = [
      "dateOfBirth",
      "address",
      "bio",
      "middleName",
      // Add other fields here that you want to allow updates for later
    ];

    const filteredUpdates = {};
    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    if (Object.keys(filteredUpdates).length === 0) {
      const error = new Error("No valid fields provided for update");
      error.status = 400;
      throw error;
    }

    if (
      filteredUpdates.firstName &&
      (filteredUpdates.firstName.trim().length < 2 ||
        filteredUpdates.firstName.trim().length > 50)
    ) {
      const error = new Error("First name must be between 2 and 50 characters");
      error.status = 400;
      throw error;
    }

    if (
      filteredUpdates.lastName &&
      (filteredUpdates.lastName.trim().length < 2 ||
        filteredUpdates.lastName.trim().length > 50)
    ) {
      const error = new Error("Last name must be between 2 and 50 characters");
      error.status = 400;
      throw error;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      error.status = 400;
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      error.message = `${field} already exists`;
      error.status = 400;
    }
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error("Invalid user ID");
      error.status = 400;
      throw error;
    }
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
