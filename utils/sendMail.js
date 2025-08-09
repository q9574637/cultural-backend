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
    from: `"Varnave'25 Team" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Code - Varnave'25 Volunteer Registration",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6fb; padding: 32px 0;">
        <div style="max-width: 420px; margin: 0 auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); overflow: hidden;">
          <div style="background: #ff7f50; color: #fff; padding: 24px 0; text-align: center;">
            <h2 style="margin: 0; font-size: 1.6rem; letter-spacing: 1px;">Varnave'25</h2>
            <p style="margin: 4px 0 0 0; font-size: 0.9rem;">Cultural Fest • Sep 12 & 13</p>
          </div>
          <div style="padding: 32px 28px 24px 28px; text-align: center;">
            <h3 style="margin: 0 0 18px 0; color: #222; font-size: 1.2rem;">Your One-Time Password (OTP)</h3>
            <div style="font-size: 2.5rem; font-weight: bold; letter-spacing: 8px; color:#ff7f50; margin-bottom: 18px;">${otp}</div>
            <p style="color: #444; font-size: 1rem; margin: 0 0 16px 0;">
              Enter this code in the <b>Varnave'25 Volunteer Registration</b> page to continue.<br/>
              This code is valid for <b>5 minutes</b>.
            </p>
            <p style="color: #888; font-size: 0.95rem; margin: 0;">If you did not request this, please ignore this email.</p>
          </div>
          <div style="background: #f4f6fb; color: #aaa; text-align: center; padding: 14px 0 10px 0; font-size: 0.93rem;">
            &copy; ${new Date().getFullYear()} Varnave'25 Organizing Committee
          </div>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}

export async function sendApplicationReceivedEmail(to, name) {
  const mailOptions = {
    from: `"Varnave'25 Team" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Volunteer Application Has Been Received",
    text: `Hi ${name},\n\nThank you for applying as a volunteer for Varnave'25. Our team will review your application and contact you soon.\n\nRegards,\nVarnave'25 Organizing Team`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6fb; padding: 32px 0;">
        <div style="max-width: 500px; margin: 0 auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); overflow: hidden;">
          <div style="background: #ff7f50; color: #fff; padding: 24px 0; text-align: center;">
            <h2 style="margin: 0; font-size: 1.6rem; letter-spacing: 1px;">Varnave'25</h2>
          </div>
          <div style="padding: 32px 28px; text-align: left;">
            <h3 style="margin: 0 0 18px 0; color: #222;">Hello ${name},</h3>
            <p style="color: #444; font-size: 1rem;">Thank you for applying as a <b>volunteer</b> for <b>Varnave'25</b> scheduled on <b>September 12 & 13</b>.</p>
            <p style="color: #444; font-size: 1rem;">Our team has received your application successfully. We will review it and contact you with further details.</p>
            <p style="color: #444; font-size: 1rem;">We appreciate your willingness to be part of our cultural event!</p>
            <p style="color: #888; font-size: 0.95rem;">If you have any queries, feel free to reply to this email.</p>
          </div>
          <div style="background: #f4f6fb; color: #aaa; text-align: center; padding: 14px 0; font-size: 0.93rem;">
            &copy; ${new Date().getFullYear()} Varnave'25 Organizing Committee
          </div>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}

export async function sendApplicationAcceptedEmail(to, name) {
  const mailOptions = {
    from: `"Varnave'25 Team" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Volunteer Application Has Been Accepted 🎉",
    text: `Hi ${name},\n\nCongratulations! Your volunteer application for Varnave'25 has been accepted. Our team will contact you with further instructions.\n\nWe are excited to have you onboard!\n\nRegards,\nVarnave'25 Organizing Team`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6fb; padding: 32px 0;">
        <div style="max-width: 500px; margin: 0 auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); overflow: hidden;">
          <div style="background: #28a745; color: #fff; padding: 24px 0; text-align: center;">
            <h2 style="margin: 0; font-size: 1.6rem; letter-spacing: 1px;">Varnave'25</h2>
          </div>
          <div style="padding: 32px 28px; text-align: left;">
            <h3 style="margin: 0 0 18px 0; color: #222;">Hello ${name},</h3>
            <p style="color: #444; font-size: 1rem;">🎉 Congratulations! We are thrilled to inform you that your application to be a <b>volunteer</b> for <b>Varnave'25</b> has been <b>accepted</b>.</p>
            <p style="color: #444; font-size: 1rem;">Our team will be in touch soon with your assigned role, schedule, and briefing details.</p>
            <p style="color: #444; font-size: 1rem;">Get ready to be part of an amazing cultural event happening on <b>September 12 & 13</b>!</p>
            <p style="color: #888; font-size: 0.95rem;">If you have any queries before the event, feel free to reply to this email.</p>
          </div>
          <div style="background: #f4f6fb; color: #aaa; text-align: center; padding: 14px 0; font-size: 0.93rem;">
            &copy; ${new Date().getFullYear()} Varnave'25 Organizing Committee
          </div>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}
export async function sendApplicationAcceptedWithCredentialsEmail(to, name, email, password) {
    const mailOptions = {
      from: `"Varnave'25 Team" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your Volunteer Application Has Been Accepted 🎉",
      text: `Hi ${name},\n\nCongratulations! Your volunteer application for Varnave'25 has been accepted.\n\nYou can now log in to the Volunteer Portal with the following credentials:\n\nEmail: ${email}\nPassword: ${password}\n\nPlease change your password after logging in.\n\nWe are excited to have you onboard!\n\nRegards,\nVarnave'25 Organizing Team`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6fb; padding: 32px 0;">
          <div style="max-width: 500px; margin: 0 auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); overflow: hidden;">
            <div style="background: #28a745; color: #fff; padding: 24px 0; text-align: center;">
              <h2 style="margin: 0; font-size: 1.6rem; letter-spacing: 1px;">Varnave'25</h2>
            </div>
            <div style="padding: 32px 28px; text-align: left;">
              <h3 style="margin: 0 0 18px 0; color: #222;">Hello ${name},</h3>
              <p style="color: #444; font-size: 1rem;">🎉 Congratulations! We are thrilled to inform you that your application to be a <b>volunteer</b> for <b>Varnave'25</b> has been <b>accepted</b>.</p>
              <p style="color: #444; font-size: 1rem;">You can now log in to the Volunteer Portal using the following credentials:</p>
              <div style="background: #f9f9f9; padding: 12px; border-radius: 6px; font-size: 0.95rem;">
                <p><b>Email:</b> ${email}</p>
                <p><b>Password:</b> ${password}</p>
              </div>
              <p style="color: #ff0000; font-size: 0.9rem;">Please change your password after logging in for security purposes.</p>
              <p style="color: #444; font-size: 1rem;">Get ready to be part of an amazing cultural event happening on <b>September 12 & 13</b>!</p>
              <p style="color: #888; font-size: 0.95rem;">If you have any queries before the event, feel free to reply to this email.</p>
            </div>
            <div style="background: #f4f6fb; color: #aaa; text-align: center; padding: 14px 0; font-size: 0.93rem;">
              &copy; ${new Date().getFullYear()} Varnave'25 Organizing Committee
            </div>
          </div>
        </div>
      `
    };
  
    await transporter.sendMail(mailOptions);
  }