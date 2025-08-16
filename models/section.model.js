import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Section title is required"],
      trim: true,
    },
    description: String,
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: [true, "Course is required"],
    },
    order: {
      type: Number,
      required: true,
    },
    lessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "lesson",
      },
    ],
  },
  {
    timestamps: true,
  }
);
const section = mongoose.model("section", sectionSchema);

export default section;
