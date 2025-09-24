// routes/users.js
const express = require("express");
const userController = require("../controllers/usersController");
const userRouter = express.Router();

userRouter.get("/", userController.getUsers);
userRouter.get("/search", userController.searchUsers); // Add search route FIRST
userRouter.get("/:id", userController.getUserById);
userRouter.post("/", userController.createUser);
userRouter.put("/:id", userController.updateUser);
userRouter.delete("/:id", userController.deleteUser);

module.exports = userRouter;