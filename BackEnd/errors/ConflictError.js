class ConflictError extends Error {
  constructor(message = "Conflict with existing resource") {
    super(message);
    this.statusCode = 409;
    this.name = "ConflictError";
  }
}
module.exports = ConflictError;
