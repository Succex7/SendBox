// email.service.js — using Resend instead of Gmail SMTP
import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('❌ Missing RESEND_API_KEY in environment variables');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async (email, otp) => {
  try {
    await resend.emails.send({
      from: 'SendBox <onboarding@resend.dev>', // use this until you have a custom domain
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
    });
  } catch (error) {
    console.error('📧 Resend error:', error.message);
    throw new Error('Failed to send reset email. Please try again later.');
  }
};