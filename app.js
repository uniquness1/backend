import express from "express";
import { PORT } from "./config/env.js";
import connectToDatabase from "./database/database.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import courseRouter from "./routes/course.routes.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(errorMiddleware);
app.use(morgan("combined"));
app.use(arcjetMiddleware);

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/courses", courseRouter);

// listening
app.listen(PORT, async () => {
  console.log(`Server running on port https://localhost:${PORT}`);
  await connectToDatabase();
});

export default app;
