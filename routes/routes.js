const express = require("express");
const { shortenLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

const urlController = require("../controller/controller");
const auth = require("../middleware/auth");
const {
    loginLimiter,
    registerLimiter
} = require("../middleware/rateLimiter");

// CREATE SHORT URL

router.post(
    "/shorten",
    auth,
    shortenLimiter,
    urlController.createShortUrl
);

// REDIRECT
router.get("/:shortCode", urlController.redirectToOriginalUrl);


module.exports = router; 