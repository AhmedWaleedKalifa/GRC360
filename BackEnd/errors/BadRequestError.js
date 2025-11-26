class BadRequestError extends Error {
  constructor(message = "Invalid request") {
    super(message);
    this.statusCode = 400;
    this.name = "BadRequestError";
  }
}
module.exports = BadRequestError;
