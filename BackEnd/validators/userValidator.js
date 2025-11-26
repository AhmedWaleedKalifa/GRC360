const { body } = require("express-validator");

const validateUser = [
  body("user_name")
    .trim()
    .matches(/^[a-zA-Z0-9_ ]+$/)
    .withMessage(
      "Username must be alphanumeric with spaces or underscores only"
    )
    .isLength({ min: 1, max: 100 })
    .withMessage("Username must be between 1 and 100 characters"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Must be a valid email address")
    .isLength({ max: 100 })
    .withMessage("Email must not exceed 100 characters"),

  body("role")
    .optional()
    .isIn(["admin", "moderator", "user", "guest"])
    .withMessage("Role must be one of: admin, moderator, user, guest"),

  body("job_title")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Job title must not exceed 100 characters"),

  body("phone")
    .optional()
    .trim()
    .matches(/^[0-9+\-() ]*$/)
    .withMessage("Phone number must contain only digits, spaces, +, -, or ()")
    .isLength({ max: 20 })
    .withMessage("Phone number must not exceed 20 characters"),
];

module.exports = { validateUser };
