import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
      minlength: 2,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      minlength: 10,
    },
    shortDescription: {
      type: String,
      maxlength: 200,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Instructor is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: [true, "Category is required"],
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    price: {
      type: Number,
      required: [true, "Course price is required"],
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
    },
    thumbnail: {
      public_id: String,
      url: String,
    },
    demoVideo: {
      public_id: String,
      url: String,
    },
    tags: [String],
    prerequisites: [String],
    learningOutcomes: [String],
    duration: Number, // in hours
    language: {
      type: String,
      default: "English",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    maxStudents: {
      type: Number,
      default: 0,
    },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    totalLectures: {
      type: Number,
      default: 0,
    },
    totalVideoDuration: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
const course = mongoose.model("course", courseSchema);

export default course;
