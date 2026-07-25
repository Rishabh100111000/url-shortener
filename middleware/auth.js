const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        console.log(req.headers);

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "No token provided",
            });
        }

        console.log("AUTH HEADER =", authHeader);

        const token = authHeader.replace(/^Bearer\s+/i, "");

        console.log("TOKEN =", token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (err) {
        console.log(err);

        return res.status(401).json({
            message: err.message,
        });
    }
};

module.exports = auth;