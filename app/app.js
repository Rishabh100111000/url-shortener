const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();

const userRoutes = require("../routes/userroutes");
const urlRoutes = require("../routes/routes");

const app = express();

app.use(cors());
app.use(express.json());

// Configure Helmet to allow frontend assets and cross-origin requests
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);

// Serve frontend static assets from public directory
app.use(express.static(path.join(__dirname, "../public")));

// API Routes
app.use("/user", userRoutes);
app.use("/url", urlRoutes);

// Default Root Route -> Redirect to login page
app.get("/", (req, res) => {
    res.redirect("/login.html");
});

// Database Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

module.exports = app;