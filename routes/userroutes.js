const express = require("express");

const {
    registerUser,
    loginUser,
    verifyEmail
} = require("../controller/usercontroller");

const {
    loginLimiter,
    registerLimiter
} = require("../middleware/rateLimiter");

const router = express.Router();

// Test Route
router.get("/test", (req, res) => {
    res.send("User route works");
});

// Register
router.post("/register", registerLimiter, registerUser);

// Login
router.post("/login", loginLimiter, loginUser);

// Verify Email
router.get("/verify/:token", verifyEmail);

module.exports = router;