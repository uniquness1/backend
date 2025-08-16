import { Router } from "express";
import {
  updateOnboarding,
  // getOnboardingStatus,
} from "../controllers/onboarding.controller.js";
import authorize from "../middlewares/auth.middleware.js";
const onboardingRouter = Router();
// onboardingRouter.get("/", authorize, getOnboardingStatus);
onboardingRouter.put("/", authorize, updateOnboarding);

export default onboardingRouter;
