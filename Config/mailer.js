import nodemailer from "nodemailer";

// ✅ Create reusable transporter object
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",   // e.g. Gmail SMTP
  port: 465,                // 587 for TLS, 465 for SSL
  secure: true,             // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,  // Your email
    pass: process.env.EMAIL_PASS,  // App password or SMTP password
  },
});

export default transporter;
