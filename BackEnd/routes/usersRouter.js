// routes/usersRouter.js
const express = require("express");
const userController = require("../controllers/usersController");
const { authenticate, authorize } = require("../middleware/auth");
const userRouter = express.Router();

// All user routes require authentication and admin privileges
userRouter.use(authenticate);
userRouter.use(authorize('admin'));

userRouter.get("/", userController.getUsers);
userRouter.get("/search", userController.searchUsers);
userRouter.get("/:id", userController.getUserById);
userRouter.post("/", userController.createUser);
userRouter.put("/:id", userController.updateUser);
userRouter.delete("/:id", userController.deleteUser);

module.exports = userRouter;