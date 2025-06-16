export class AppError extends Error {
  constructor(message, statusCode) {
    super(message, statusCode); // Call the parent constructor with the error message
    this.message = message;
    this.statusCode = statusCode;
    this.status = statusCode.startsWith("4") || statusCode.startsWith("5");
    this.isOperational = true; // Indicates that this is an operational error
    this.errorMessage = message; // Custom error message
  }
}

export const handleError = (err, req, res, next) => {
  // Log the error for debugging purposes
  console.error(err);

  // Set the response status code and message
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Send the error response
  res.status(statusCode).json({
    status: err.status,
    message: message,
    error: err,
    stack: err.stack, // Include stack trace for debugging
    error: process.env.NODE_ENV === "development" ? err : {}, // Show full error in development mode
  });
};
