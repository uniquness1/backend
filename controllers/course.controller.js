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
      level,
      discountPrice,
      thumbnail,
      demoVideo,
      tags,
      prerequisites,
      learningOutcomes,
      duration,
      language,
      isPublished,
      maxStudents,
      totalLectures,
      totalVideoDuration,
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
          level,
          discountPrice,
          thumbnail,
          demoVideo,
          tags,
          prerequisites,
          learningOutcomes,
          duration,
          language,
          isPublished,
          maxStudents,
          totalLectures,
          totalVideoDuration,
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
        course: newCourse[0],
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
    // Extract query parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Extract filter parameters
    const {
      search,
      category,
      level,
      instructor,
      isPublished,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
    } = req.query;
    const filter = {};

    // Build filter object
    if (search) {
      filter.$or = [
        { courseName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    }

    if (level) {
      filter.level = level;
    }

    if (instructor && mongoose.Types.ObjectId.isValid(instructor)) {
      filter.instructor = instructor;
    }

    if (isPublished !== undefined) {
      filter.isPublished = isPublished === "true";
    }

    // Price range filtering
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Build sort object
    const sortOptions = {};
    if (sortBy) {
      const validSortFields = [
        "createdAt",
        "updatedAt",
        "courseName",
        "price",
        "averageRating",
        "totalReviews",
        "enrolledStudents",
      ];
      if (validSortFields.includes(sortBy)) {
        sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
      }
    } else {
      sortOptions.createdAt = -1; // Default sort by newest first
    }

    // Special handling for enrolledStudents count sorting
    if (sortBy === "enrolledStudents") {
      sortOptions["enrolledStudents"] = sortOrder === "asc" ? 1 : -1;
    }

    // Get courses with pagination and population
    const courses = await Course.find(filter)
      .populate("instructor", "name email avatar") // Populate instructor details
      .populate("category", "name description") // Populate category details
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for better performance

    // Get total count for pagination info
    const totalCourses = await Course.countDocuments(filter);
    const totalPages = Math.ceil(totalCourses / limit);

    // Calculate additional pagination info
    const startIndex = skip + 1;
    const endIndex = Math.min(skip + limit, totalCourses);

    res.status(200).json({
      success: true,
      data: {
        courses,
        pagination: {
          currentPage: page,
          totalPages,
          totalCourses,
          limit,
          startIndex,
          endIndex,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          nextPage: page < totalPages ? page + 1 : null,
          prevPage: page > 1 ? page - 1 : null,
        },
        filters: {
          search: search || null,
          category: category || null,
          level: level || null,
          instructor: instructor || null,
          isPublished: isPublished || null,
          priceRange: {
            min: minPrice || null,
            max: maxPrice || null,
          },
        },
        sorting: {
          sortBy: sortBy || "createdAt",
          sortOrder: sortOrder || "desc",
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email avatar bio")
      .populate("category", "name description")
      .populate("enrolledStudents", "name email");

    if (!course) {
      const error = new Error("Course not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (err) {
    next(err);
  }
};

export const updateCourse = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error("Invalid course ID");
      error.status = 400;
      throw error;
    }

    // Extract updateable fields from request body
    const updateFields = {};
    const allowedFields = [
      "courseName",
      "description",
      "shortDescription",
      "category",
      "level",
      "price",
      "discountPrice",
      "thumbnail",
      "demoVideo",
      "tags",
      "prerequisites",
      "learningOutcomes",
      "duration",
      "language",
      "isPublished",
      "maxStudents",
      "totalLectures",
      "totalVideoDuration",
    ];

    // Only include fields that are present in the request body
    allowedFields.forEach((field) => {
      if (req.body.hasOwnProperty(field)) {
        updateFields[field] = req.body[field];
      }
    });

    const updatedCourse = await Course.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
      session,
    });

    if (!updatedCourse) {
      const error = new Error("Course not found");
      error.status = 404;
      throw error;
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: {
        course: updatedCourse,
      },
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
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
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const error = new Error("Invalid user ID");
      error.status = 400;
      throw error;
    }

    // Find courses where user is the instructor
    const courses = await Course.find({ instructor: userId })
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCourses = await Course.countDocuments({ instructor: userId });
    const totalPages = Math.ceil(totalCourses / limit);

    res.status(200).json({
      success: true,
      data: {
        courses,
        pagination: {
          currentPage: page,
          totalPages,
          totalCourses,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
