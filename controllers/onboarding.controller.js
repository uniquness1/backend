import User from "../models/user.model.js";

export const updateOnboarding = async (req, res, next) => {
  try {
    if (!req.user) {
      const error = new Error("No user in request");
      error.statusCode = 401;
      return next(error);
    }

    const userId = req.user._id;
    const { role, field_of_study, reason_for_joining } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    // Update user onboarding fields
    const updateData = {
      isOnboarded: true,
    };

    // Add optional fields if provided
    if (role) updateData.role = role;
    if (field_of_study) updateData.fieldOfStudy = field_of_study;
    if (reason_for_joining) updateData.reasonForJoining = reason_for_joining;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Onboarding completed successfully",
      data: {
        user: {
          id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber,
          isVerified: updatedUser.isVerified,
          isOnboarded: updatedUser.isOnboarded,
          role: updatedUser.role,
          fieldOfStudy: updatedUser.fieldOfStudy,
          reasonForJoining: updatedUser.reasonForJoining,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
