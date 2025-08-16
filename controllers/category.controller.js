import mongoose from "mongoose";
import category from "../models/category-model.js";

export const createCourse = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name } = req.body;
    const existingCategory = await category.findOne({ name });
    if (existingCategory) {
      const error = new Error("Category already exists");
      error.statusCode = 409;
      return next(error);
    }
    const newCategory = await category.create(
      [
        {
          name,
        },
      ],
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    res.status(201).json({
      success: true,
      message: "Category Created Successfully",
      data: {
        category: {
          categoryId: newCategory[0]._id,
          name: newCategory[0].name,
        },
      },
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};
export const getCategories = async (req, res, next) => {
  try {
    const categories = await category.find();
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};
export const getCategory = async (req, res, next) => {
  try {
    const Category = await category.findById(req.params.id);
    if (!Category) {
      const error = new Error("category not found");
      error.status = 404;
      throw error;
    }
    res.status(200).json({ success: true, data: Category });
  } catch (err) {
    next(err);
  }
};
