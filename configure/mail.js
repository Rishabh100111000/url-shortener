const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
    try {
        const data = await resend.emails.send({
            // Updated to root domain instead of send. subdomain
            from: "URL Shortener <verify@11010101101.me>",
            to: to,
            subject: subject,
            html: html,
        });
        return data;
    } catch (error) {
        console.error("Resend Email Error:", error);
        throw error;
    }
};

module.exports = { sendEmail };