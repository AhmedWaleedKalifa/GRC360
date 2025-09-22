const db = require("../db/queries/users");
const { ConflictError, BadRequestError, NotFoundError } = require("../errors/errors");

async function createUser(req, res, next) {
  try {
    const { role, user_name, email, password, job_title, phone } = req.body;

    if (!user_name || !email || !password) {
      throw new BadRequestError("User name, password, and email are required");
    }

    const existing = await db.getUserByEmail(email);
    if (existing) {
      throw new ConflictError("Email already exists");
    }

    const newUser = await db.addUser({role,user_name,email,password,job_title,phone,});

    res.status(201).json(newUser);
  } catch (err) {
    if (err.code === "23505") {
      return next(new ConflictError("Email already exists (DB check)"));
    }
    next(err);
  }
}

async function getUsers(req, res, next) {
  try {
    const users = await db.getAllUsers();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  try {
    const { id } = req.params;
    const user = await db.getUserById(parseInt(id));

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const fields = req.body;

    if (Object.keys(fields).length === 0) {
      throw new BadRequestError("No fields to update");
    }

    const updatedUser = await db.updateUser(parseInt(id), fields);

    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    const deletedUser = await db.removeUser(parseInt(id));

    if (!deletedUser) {
      throw new NotFoundError("User not found");
    }

    res.status(200).json({ message: "User deleted successfully", user: deletedUser });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};