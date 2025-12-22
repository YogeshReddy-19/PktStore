import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", 
  port: 587,            
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
        rejectUnauthorized: false
  },
  family:4,
});

export const subscribeNewsletter = async (req, res) => {
  const { email } = req.body;

  console.log("1. User variable exists?", !!process.env.EMAIL_USER);
  console.log("2. Pass variable exists?", !!process.env.EMAIL_PASS);
  console.log("3. Target Email:", email);

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const mailOptions = {
    from: `PktStore <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to Our Community!",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h1 style="color: #27bcd3;">Thank You for Registering!</h1>
        <p>Hi there,</p>
        <p>We are thrilled to have you join our community.</p>
        <p>Stay tuned for the latest products, exclusive offers, andnews.</p>
        <br/>
        <p>Best Regards,</p>
        <p><strong>PktStore</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Newsletter email sent to:", email);
    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};