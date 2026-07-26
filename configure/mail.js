const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
    try {
        const data = await resend.emails.send({
            // 'onboarding@resend.dev' allows sending test emails immediately
            from: "URL Shortener <onboarding@resend.dev>",
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