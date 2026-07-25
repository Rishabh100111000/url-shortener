const nodemailer = require("nodemailer");

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS length:", process.env.EMAIL_PASS?.length);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
   
   
   
transporter.verify((error, success) => {
    if (error) {
        console.log("SMTP Error:", error);
    } else {
        console.log("SMTP Server is ready to send emails");
    }
});

module.exports = transporter;