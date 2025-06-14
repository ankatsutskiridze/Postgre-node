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
