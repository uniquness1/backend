import { Router } from "express";
const categoryRouter = Router();
import {
  getCategories,
  getCategory,
  createCourse,
} from "../controllers/category.controller.js";

categoryRouter.get("/", getCategories);
categoryRouter.post("/", createCourse);
categoryRouter.get("/:id", getCategory);

export default categoryRouter;
