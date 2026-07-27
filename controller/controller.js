const crypto = require("crypto");
const Url = require("../model/URL");

const createShortUrl = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("USER FROM AUTH:", req.user);

        let url = req.body ? req.body.url : null;

        if (!url) {
            return res.status(400).json({ error: "URL is required" });
        }

        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = `https://${url}`;
        }

        const shortCode = crypto.randomBytes(3).toString("hex");

        // Safely extract user ID whether auth middleware set _id or id
        const userId = req.user ? (req.user._id || req.user.id) : null;

        const newUrl = await Url.create({
            originalUrl: url,
            shortCode: shortCode,
            ...(userId && { user: userId, userId: userId }) // Covers both 'user' and 'userId' schema field names
        });

        console.log("Created URL successfully:", newUrl);
        return res.status(201).json(newUrl);

    } catch (err) {
        console.error("Create Short URL Error:", err);
        return res.status(500).json({ error: err.message || "Internal Server Error" });
    }
};

const redirectToOriginalUrl = async (req, res) => {
    try {
        const shortCode = req.params.shortCode;
        const url = await Url.findOne({ shortCode });

        if (!url) {
            return res.status(404).json({ error: "URL not found" });
        }

        return res.redirect(url.originalUrl);
    } catch (err) {
        console.error("Redirect Error:", err);
        return res.status(500).json({ error: err.message || "Internal Server Error" });
    }
};

module.exports = {
    createShortUrl,
    redirectToOriginalUrl
};