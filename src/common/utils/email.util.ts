import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

// Configure the SMTP transport for Resend
const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com',
  port: 465,
  secure: true,
  auth: {
    user: 'resend', // Resend always uses 'resend' as the username
    pass: env.RESEND_API_KEY,
  },
});

export class EmailUtil {
  public static async sendVerificationEmail(to: string, token: string) {
    const verifyLink = `http://localhost:3000/verify?token=${token}`;

    await transporter.sendMail({
      from: 'TechReborn <onboarding@resend.dev>', // MUST use this on free tier
      to,
      subject: 'Verify your TechReborn Account',
      html: `
        <h2>Welcome to TechReborn!</h2>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verifyLink}" style="padding: 10px 20px; background: #000; color: #fff; text-decoration: none; border-radius: 5px;">Verify Email</a>
      `,
    });
  }

  public static async sendPasswordResetEmail(to: string, token: string) {
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    await transporter.sendMail({
      from: 'TechReborn <onboarding@resend.dev>', // MUST use this on free tier
      to,
      subject: 'Reset your TechReborn Password',
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password. This link is valid for 1 hour.</p>
        <a href="${resetLink}" style="padding: 10px 20px; background: #000; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });
  }
}
