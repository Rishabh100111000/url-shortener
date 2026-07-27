const crypto = require("crypto");
const Url = require("../model/URL");

const createShortUrl = async (req, res) => {
    try {
        console.log("BODY:", req.body);

        let url = req.body.url;

        if (!url) {
            return res.status(400).json({
                error: "URL is required"
            });
        }

        // Auto-fix URL prefix if missing http:// or https://
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = `https://${url}`;
        }

        // Generate a 6-character random hex string using built-in Node crypto
        const shortCode = crypto.randomBytes(3).toString("hex");

        const newUrl = await Url.create({
            originalUrl: url,
            shortCode: shortCode
        });

        return res.status(201).json(newUrl);

    } catch (err) {
        console.log("Create Short URL Error:", err);

        return res.status(500).json({
            error: err.message || "Internal Server Error"
        });
    }
};

const redirectToOriginalUrl = async (req, res) => {
    try {
        const shortCode = req.params.shortCode;

        const url = await Url.findOne({
            shortCode: shortCode
        });

        if (!url) {
            return res.status(404).json({
                error: "URL not found"
            });
        }

        return res.redirect(url.originalUrl);

    } catch (err) {
        console.log("Redirect Error:", err);

        return res.status(500).json({
            error: err.message || "Internal Server Error"
        });
    }
};

module.exports = {
    createShortUrl,
    redirectToOriginalUrl
};