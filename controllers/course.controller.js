import mongoose from "mongoose";
import Course from "../models/course-model.js";

export const createCourse = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      courseName,
      description,
      shortDescription,
      instructor,
      category,
      price,
    } = req.body;
    const newCourse = await Course.create(
      [
        {
          courseName,
          description,
          shortDescription,
          instructor,
          category,
          price,
        },
      ],
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: {
        course: {
          courseId: newCourse[0]._id,
          courseName: newCourse[0].courseName,
          courseDescription: newCourse[0].description,
          price: newCourse[0].price,
          instructor: newCourse[0].instructor,
          category: newCourse[0].category,
        },
      },
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};
export const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ success: true, data: courses });
  } catch (err) {
    next(err);
  }
};
export const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      const error = new Error("course not found");
      error.status = 404;
      throw error;
    }
    res.status(200).json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};
export const updateCourse = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
export const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error("Invalid course ID");
      error.status = 400;
      throw error;
    }
    const deletedCourse = await Course.findByIdAndDelete(id);
    if (!deletedCourse) {
      const error = new Error("Course not found");
      error.status = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
export const getUserCourses = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
