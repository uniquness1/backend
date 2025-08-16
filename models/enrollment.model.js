import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Student is required"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: [true, "Course is required"],
    },
    totalEnrollment: { type: Number, default: 0, min: 0, max: 100 },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    completionDate: Date,
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedLessons: [
      {
        lesson: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lesson",
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lastAccessedLesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    certificateIssued: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const enrollment = mongoose.model("enrollment", enrollmentSchema);

export default enrollment;
