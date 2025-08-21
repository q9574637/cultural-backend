import transporter from "../Config/mailer";

const sendMail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Event Tickets" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("✅ Email sent: %s", info.messageId);
  } catch (err) {
    console.error("❌ Error sending email:", err.message);
  }
};

export default sendMail;

