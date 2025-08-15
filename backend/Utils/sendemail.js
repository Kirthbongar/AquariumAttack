const nodemailer = requrie("nodemailer");
require("dotenv").config();

async function sendEmail({ to, subject, text, html}) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const info = await transporter.sendMail({
        from:`"Game App" <$(process.env.EMAIL_USER)>`,
        to,
        subject,
        text,
        html,
    });

console.log("Message sent: %s", info.messageId);

}

module.exports =sendEmail;
