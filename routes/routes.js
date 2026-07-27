const express = require("express");
const router = express.Router();

const urlController = require("../controller/controller");
const auth = require("../middleware/auth");
const {
    shortenLimiter,
    loginLimiter,
    registerLimiter
} = require("../middleware/rateLimiter");

// CREATE SHORT URL (Protected by Auth & Rate Limiter)
router.post(
    "/shorten",
    auth,
    shortenLimiter,
    urlController.createShortUrl
);

// REDIRECT
router.get("/:shortCode", urlController.redirectToOriginalUrl);

module.exports = router;