import { Router } from "express";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";
import adminAuthorize from "../middlewares/admin.middleware.js";
const userRouter = Router();
userRouter.get("/", adminAuthorize, getUsers);
userRouter.get("/:id", authorize, getUser);
userRouter.put("/:id", authorize, updateUser);
userRouter.delete("/:id", authorize, deleteUser);

export default userRouter;
