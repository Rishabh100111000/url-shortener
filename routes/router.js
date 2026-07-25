const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");
const auth = require("../middleware/auth");

// ---------- Public Routes ----------

// Register User
router.post("/register", userController.createUser);

// Login User
router.post("/login", userController.login);

// ---------- Protected Routes ----------

// Get All Users
router.get("/users", auth, userController.getUsers);

// Get User By ID
router.get("/users/:id", auth, userController.getUserById);

// Update User
router.put("/users/:id", auth, userController.updateUser);

// Delete User
router.delete("/users/:id", auth, userController.deleteUser);

module.exports = router;