import { Router } from "express";
import {
  getUsers,
  getUser,
  getMyProfile,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";
import adminAuthorize from "../middlewares/admin.middleware.js";

const userRouter = Router();

userRouter.get("/", adminAuthorize, getUsers);
userRouter.get("/profile", authorize, getMyProfile);
userRouter.get("/:id", authorize, getUser);
userRouter.put("/:id", authorize, updateUser);
userRouter.delete("/:id", adminAuthorize, deleteUser);

export default userRouter;
