const crypto = require("crypto");
const Url = require("../model/URL");

const createShortUrl = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("USER FROM AUTH:", req.user); // Log verified user

        let url = req.body ? req.body.url : null;

        if (!url) {
            return res.status(400).json({
                error: "URL is required"
            });
        }

        // Auto-prefix URL if http/https is missing
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = `https://${url}`;
        }

        // Safe 6-character random code generator using built-in Node crypto
        const shortCode = crypto.randomBytes(3).toString("hex");

        // Create short URL document
        const newUrl = await Url.create({
            originalUrl: url,
            shortCode: shortCode,
            // If your Url model references the logged-in user, attach it safely:
            ...(req.user && req.user.id ? { userId: req.user.id } : {})
        });

        return res.status(201).json(newUrl);

    } catch (err) {
        console.error("Create Short URL Error:", err);

        return res.status(500).json({
            error: err.message || "Internal Server Error"
        });
    }
};

const redirectToOriginalUrl = async (req, res) => {
    try {
        const shortCode = req.params.shortCode;

        const url = await Url.findOne({ shortCode });

        if (!url) {
            return res.status(404).json({
                error: "URL not found"
            });
        }

        return res.redirect(url.originalUrl);

    } catch (err) {
        console.error("Redirect Error:", err);

        return res.status(500).json({
            error: err.message || "Internal Server Error"
        });
    }
};

module.exports = {
    createShortUrl,
    redirectToOriginalUrl
};