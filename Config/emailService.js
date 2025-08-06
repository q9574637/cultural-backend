// utils/emailService.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOtpEmail(to, otp) {
  const mailOptions = {
    from: `"Alkarahm Trading" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6fb; padding: 32px 0;">
        <div style="max-width: 420px; margin: 0 auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); overflow: hidden;">
          <div style="background: #4f8cff; color: #fff; padding: 24px 0; text-align: center;">
            <h2 style="margin: 0; font-size: 1.6rem; letter-spacing: 1px;">Alkarahm Trading</h2>
          </div>
          <div style="padding: 32px 28px 24px 28px; text-align: center;">
            <h3 style="margin: 0 0 18px 0; color: #222; font-size: 1.2rem;">Your One-Time Password (OTP)</h3>
            <div style="font-size: 2.5rem; font-weight: bold; letter-spacing: 8px; color:#4f8cff; margin-bottom: 18px;">${otp}</div>
            <p style="color: #444; font-size: 1rem; margin: 0 0 16px 0;">Enter this code in the Alkarahm App to continue.<br/>This code is valid for <b>5 minutes</b>.</p>
            <p style="color: #888; font-size: 0.95rem; margin: 0;">If you did not request this, you can safely ignore this email.</p>
          </div>
          <div style="background: #f4f6fb; color: #aaa; text-align: center; padding: 14px 0 10px 0; font-size: 0.93rem;">
            &copy; ${new Date().getFullYear()} Alkarahm Trading
          </div>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

