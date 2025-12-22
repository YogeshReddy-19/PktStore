import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com", 
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
  family: 4,
});

export const subscribeNewsletter = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const mailOptions = {
    from: `Pktstore <pktstorehelp@gmail.com>`, 
    to: email,
    subject: "Welcome to PktStore Community!",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h1 style="color: #27bcd3;">Welcome!</h1>
        <p>Hi there,</p>
        <p>Thanks for subscribing to our newsletter. We are glad to have you!</p>
        <br/>
        <p>Best Regards,</p>
        <p><strong>PktStore Team</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email Sent Successfully via Brevo to:", email);
    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("❌ Brevo Email Error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};