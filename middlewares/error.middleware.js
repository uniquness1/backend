const errorMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (err.name === "CastError") {
    const message = "Resource not found";
    error.message = message;
    error.statusCode = 404;
  }

  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error.message = message;
    error.statusCode = 400;
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((e) => e.message);
    error.message = message.join(", ");
    error.statusCode = 400;
  }

  if (err.name === "JsonWebTokenError") {
    error.message = "Invalid token";
    error.statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    error.message = "Token expired";
    error.statusCode = 401;
  }
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
    ...(error.needsVerification && {
      needsVerification: error.needsVerification,
    }),
    ...(error.userId && { userId: error.userId }),
  });
};

export default errorMiddleware;
