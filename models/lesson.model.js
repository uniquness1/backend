import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Lesson title is required"],
      trim: true,
    },
    description: String,
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
    order: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["video", "text", "quiz", "assignment", "live"],
      default: "video",
    },
    content: {
      video: {
        public_id: String,
        url: String,
        duration: Number, //  seconds
      },
      text: String,
      attachments: [
        {
          name: String,
          url: String,
          public_id: String,
          fileType: String,
        },
      ],
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
const lesson = mongoose.model("lesson", lessonSchema);

export default lesson;
