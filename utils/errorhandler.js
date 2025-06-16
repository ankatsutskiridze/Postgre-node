export class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // მხოლოდ message-ს გადავცემთ
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (err, req, res, next) => {
  console.error("Error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (!err.isOperational) {
    return res.status(statusCode).json({
      status: "error",
      message: "Something went wrong!",
    });
  }

  // Error details for development and production environments
  const response = {
    status: err.status,
    message: message,
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
    response.error = err;
  }

  res.status(statusCode).json(response);
};
