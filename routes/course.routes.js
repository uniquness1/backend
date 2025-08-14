import { Router } from "express";
import {
  getCourses,
  getCourse,
  createCourse,
} from "../controllers/course.controller.js";
import authorize from "../middlewares/auth.middleware.js";
const courseRouter = Router();
import instructorAuthorize from "../middlewares/instructor.middleware.js";

courseRouter.post("/create-course", instructorAuthorize, createCourse);
courseRouter.get("/", getCourses);
courseRouter.get("/:id", getCourse);

export default courseRouter;
