import { Router } from "express";
import {
  getCourses,
  getCourse,
  createCourse,
  deleteCourse,
  updateCourse,
  getUserCourses,
} from "../controllers/course.controller.js";
import authorize from "../middlewares/auth.middleware.js";
import instructorAuthorize from "../middlewares/instructor.middleware.js";

const courseRouter = Router();

courseRouter.post("/create-course", instructorAuthorize, createCourse);
courseRouter.get("/", getCourses);
courseRouter.get("/:id", getCourse);
courseRouter.get("/user/:id", authorize, getUserCourses);
courseRouter.put("/:id", instructorAuthorize, updateCourse);
courseRouter.delete("/:id", instructorAuthorize, deleteCourse);

export default courseRouter;
