const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        const token = authHeader.split(" ")[1];

        // Fail safely if JWT_SECRET environment variable is missing
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error("CRITICAL: JWT_SECRET environment variable is not defined!");
            return res.status(500).json({ error: "Internal server configuration error" });
        }

        // Verify token
        const decoded = jwt.verify(token, secret);
        
        // Attach user payload to request object
        req.user = decoded; 
        
        next();

    } catch (err) {
        console.error("Auth Middleware Error:", err.message);
        return res.status(401).json({ error: "Invalid or expired token." });
    }
};

module.exports = auth;