import express from "express";
import cors from "cors";
import { PORT } from "./config/env.js";
import connectToDatabase from "./database/database.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import courseRouter from "./routes/course.routes.js";
import categoryRouter from "./routes/category.routes.js";
import onboardingRouter from "./routes/onboarding.routes.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://pixelanchor.vercel.app",
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("combined"));
app.use(arcjetMiddleware);

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/onboarding", onboardingRouter);
app.use("/api/v1/categories", categoryRouter);

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorMiddleware);

// listening
app.listen(PORT, async () => {
  console.log(`Server running on port http://localhost:${PORT}`);
  await connectToDatabase();
});

export default app;
