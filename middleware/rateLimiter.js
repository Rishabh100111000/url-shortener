const rateLimit = require("express-rate-limit");

// Login Limiter
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        console.log("🚫 Login rate limit triggered!");
        res.status(429).json({
            message: "Too many login attempts. Please try again after 15 minutes."
        });
    }
});
// Register Limiter
const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        message: "Too many registrations. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});

// URL Shortener Limiter
const shortenLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        message: "Too many URL requests. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = {
    loginLimiter,
    registerLimiter,
    shortenLimiter
};