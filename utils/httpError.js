class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

class BadRequestError extends AppError {
  constructor(message) {
    super(400, message);
  }
}

class ForbiddenError extends AppError {
  constructor(message) {
    super(403, message);
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(404, message);
  }
}

module.exports = {
  AppError,
  BadRequestError,
  ForbiddenError,
  NotFoundError
};
