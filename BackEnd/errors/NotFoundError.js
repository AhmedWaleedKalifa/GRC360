class NotFoundError extends Error {
  constructor(message = "Resource not found") {
    super(message);
    this.statusCode = 404;
    this.name = "NotFoundError";
  }
}
module.exports = NotFoundError;
