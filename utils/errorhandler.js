export class AppError extends Error {
  constructor(message, statusCode) {
    this.message = message;
    this.statusCode = statusCode;
    this.status = statusCode.startsWith("4") || statusCode.startsWith("5");
    this.isOperational = true; // Indicates that this is an operational error
  }
}
