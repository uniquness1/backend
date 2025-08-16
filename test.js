import mongoose from "mongoose";

// Review/Rating Model
const reviewSchema = new mongoose.Schema(
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
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 1000,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Quiz Model
const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Quiz title is required"],
      trim: true,
    },
    description: String,
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: [true, "Course is required"],
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "lesson",
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "question",
      },
    ],
    timeLimit: Number, // in minutes
    passingScore: {
      type: Number,
      default: 70,
      min: 0,
      max: 100,
    },
    attempts: {
      type: Number,
      default: 1,
    },
    isRandomized: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Question Model
const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question text is required"],
    },
    type: {
      type: String,
      enum: ["multiple-choice", "true-false", "short-answer", "essay"],
      default: "multiple-choice",
    },
    options: [
      {
        text: String,
        isCorrect: Boolean,
      },
    ],
    correctAnswer: String, // for non-multiple choice questions
    explanation: String,
    points: {
      type: Number,
      default: 1,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
  },
  {
    timestamps: true,
  }
);

// Quiz Attempt Model
const quizAttemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"],
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: [true, "Quiz is required"],
    },
    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },
        selectedAnswer: String,
        isCorrect: Boolean,
        points: Number,
      },
    ],
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    isPassed: {
      type: Boolean,
      default: false,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: Date,
    timeSpent: Number, // in seconds
  },
  {
    timestamps: true,
  }
);

// Assignment Model
const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Assignment title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Assignment description is required"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
    dueDate: Date,
    maxScore: {
      type: Number,
      default: 100,
    },
    instructions: String,
    attachments: [
      {
        name: String,
        url: String,
        public_id: String,
      },
    ],
    submissionType: {
      type: String,
      enum: ["file", "text", "url"],
      default: "file",
    },
  },
  {
    timestamps: true,
  }
);

// Assignment Submission Model
const submissionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"],
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: [true, "Assignment is required"],
    },
    content: {
      text: String,
      url: String,
      files: [
        {
          name: String,
          url: String,
          public_id: String,
        },
      ],
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    grade: {
      score: Number,
      feedback: String,
      gradedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      gradedAt: Date,
    },
    isLate: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Discussion Forum Model
const discussionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Discussion title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Discussion content is required"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
    replies: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        content: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isPinned: {
      type: Boolean,
      default: false,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Certificate Model
const certificateSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    certificateId: {
      type: String,
      unique: true,
      required: [true, "Certificate ID is required"],
    },
    issuedDate: {
      type: Date,
      default: Date.now,
    },
    completionDate: Date,
    grade: Number,
    certificateUrl: String,
  },
  {
    timestamps: true,
  }
);

// Notification Model
const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recipient is required"],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: [
        "course_update",
        "assignment",
        "quiz",
        "message",
        "system",
        "reminder",
      ],
      required: [true, "Notification type is required"],
    },
    title: {
      type: String,
      required: [true, "Notification title is required"],
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
    },
    relatedEntity: {
      entityType: {
        type: String,
        enum: ["course", "lesson", "quiz", "assignment", "discussion"],
      },
      entityId: mongoose.Schema.Types.ObjectId,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
  },
  {
    timestamps: true,
  }
);

// Payment/Transaction Model
const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "paypal", "bank_transfer", "wallet"],
      required: [true, "Payment method is required"],
    },
    transactionId: {
      type: String,
      unique: true,
      required: [true, "Transaction ID is required"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentGateway: String,
    gatewayTransactionId: String,
    paymentDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Progress Tracking Model
const progressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: [true, "Lesson is required"],
    },
    watchTime: {
      type: Number,
      default: 0, // in seconds
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: Date,
    lastWatchedPosition: {
      type: Number,
      default: 0, // video position in seconds
    },
  },
  {
    timestamps: true,
  }
);

// Create and export models
const User = mongoose.model("User", userSchema);
const Course = mongoose.model("Course", courseSchema);
const Category = mongoose.model("Category", categorySchema);
const Lesson = mongoose.model("Lesson", lessonSchema);
const Section = mongoose.model("Section", sectionSchema);
const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
const Review = mongoose.model("Review", reviewSchema);
const Quiz = mongoose.model("Quiz", quizSchema);
const Question = mongoose.model("Question", questionSchema);
const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);
const Assignment = mongoose.model("Assignment", assignmentSchema);
const Submission = mongoose.model("Submission", submissionSchema);
const Discussion = mongoose.model("Discussion", discussionSchema);
const Certificate = mongoose.model("Certificate", certificateSchema);
const Notification = mongoose.model("Notification", notificationSchema);
const Payment = mongoose.model("Payment", paymentSchema);
const Progress = mongoose.model("Progress", progressSchema);

export {
  User,
  Course,
  Category,
  Lesson,
  Section,
  Enrollment,
  Review,
  Quiz,
  Question,
  QuizAttempt,
  Assignment,
  Submission,
  Discussion,
  Certificate,
  Notification,
  Payment,
  Progress,
};
