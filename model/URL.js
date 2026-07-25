const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortCode: {
        type: String,
        unique: true,
        required: true
    }
});
console.log(urlSchema.obj);

const Url = mongoose.model("Url", urlSchema);

console.log("MODEL LOADED");

module.exports = Url;