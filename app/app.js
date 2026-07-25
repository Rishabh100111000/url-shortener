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
app.use(helmet());

// Serve frontend
app.use(express.static(path.join(__dirname, "../public")));

// Default route
app.get("/", (req, res) => {
    res.redirect("/login.html");
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.use("/user", userRoutes);
app.use("/url", urlRoutes);

module.exports = app;