import nodemailer from 'nodemailer';

// Validate email credentials at startup
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error('❌ Missing EMAIL_USER or EMAIL_PASS in environment variables');
}

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

// Verify transporter connection on startup — catches wrong credentials early
transporter.verify((error) => {
  if (error) {
    console.error('❌ Email transporter failed:', error.message);
  } else {
    console.log('✅ Email transporter ready');
  }
});

/**
 * Send a 6-digit OTP to the user's email for password reset
 * @param {string} email - recipient email
 * @param {string} otp   - plain 6-digit OTP (NOT hashed — this is what user sees)
 */
export const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: `"SendBox" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your SendBox Password Reset Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p style="color: #555;">You requested to reset your SendBox password. Use the code below:</p>
        <div style="text-align: center; margin: 32px 0;">
          <span style="font-size: 40px; font-weight: bold; letter-spacing: 12px; color: #111;">${otp}</span>
        </div>
        <p style="color: #555;">This code expires in <strong>10 minutes</strong>.</p>
        <p style="color: #888; font-size: 13px;">If you did not request this, please ignore this email. Your password will not change.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};