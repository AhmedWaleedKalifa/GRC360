class DatabaseError extends Error {
    constructor(message = "Database operation failed") {
      super(message);
      this.statusCode = 500;
      this.name = "DatabaseError";
    }
  }
  module.exports = DatabaseError;
  