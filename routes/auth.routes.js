import { Router } from "express";
import {
  signIn,
  signOut,
  signUp,
  resetPassword,
  verifyResetToken,
  updatePassword,
  refreshToken,
  verifyEmail,
  resendVerificationEmail,
  changePassword,
} from "../controllers/auth.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/sign-out", signOut);
authRouter.post("/reset-password", resetPassword);
authRouter.get("/verify-reset-token/:token", verifyResetToken);
authRouter.put("/update-password", authorize, changePassword);
authRouter.post("/refresh-token", refreshToken);
authRouter.get("/verify-email/:token", verifyEmail);
authRouter.post("/resend-verification", resendVerificationEmail);

export default authRouter;
