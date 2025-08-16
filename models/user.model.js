import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      match: [/\S+@\S+\.\S+/, "Please fill a valid email address."],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: 8,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
    // Onboarding fields
    fieldOfStudy: {
      type: String,
      trim: true,
    },
    reasonForJoining: {
      type: String,
      trim: true,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    website: String,
    twitter_url: String,
    facebook_url: String,
    linkedin_url: String,
    youtube_url: String,
    github_url: String,
  },
  { timestamps: true }
);

const user = mongoose.model("User", userSchema);

export default user;
