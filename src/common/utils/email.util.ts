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

  public static async sendOrderConfirmationEmail(
    to: string,
    customerName: string,
    orderId: string,
    totalAmount: string,
    shippingAddress: any,
    items: any[]
  ) {
    const formatInr = (amount: number) => {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(amount);
    };

    const shortOrderId = orderId?.split('-')[0]?.toUpperCase() || 'UNKNOWN';

    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <div style="font-weight: bold; color: #333;">${item.productName}</div>
          ${item.variantName ? `<div style="font-size: 12px; color: #666;">Variant: ${item.variantName}</div>` : ''}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatInr(Number(item.price))}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${formatInr(Number(item.price) * item.quantity)}</td>
      </tr>
    `).join('');

    const html = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #10b981; margin-bottom: 5px;">Order Confirmed!</h1>
          <p style="color: #666; font-size: 16px;">Thank you for your purchase, ${customerName}.</p>
        </div>

        <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <div>
              <div style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Order ID</div>
              <div style="font-weight: bold; font-size: 16px;">#${shortOrderId}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Total Amount</div>
              <div style="font-weight: bold; font-size: 16px; color: #10b981;">${formatInr(Number(totalAmount))}</div>
            </div>
          </div>
        </div>

        <h3 style="margin-bottom: 15px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background-color: #f8fafc;">
              <th style="padding: 10px; text-align: left; font-size: 13px; color: #666;">Item</th>
              <th style="padding: 10px; text-align: center; font-size: 13px; color: #666;">Qty</th>
              <th style="padding: 10px; text-align: right; font-size: 13px; color: #666;">Price</th>
              <th style="padding: 10px; text-align: right; font-size: 13px; color: #666;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 15px 12px; text-align: right; font-weight: bold;">Grand Total:</td>
              <td style="padding: 15px 12px; text-align: right; font-weight: bold; font-size: 18px; color: #10b981;">${formatInr(Number(totalAmount))}</td>
            </tr>
          </tfoot>
        </table>

        <h3 style="margin-bottom: 15px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">Shipping Details</h3>
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px;">
          <p style="margin: 0 0 5px 0; font-weight: bold;">${shippingAddress.fullName}</p>
          <p style="margin: 0 0 5px 0; color: #666;">${shippingAddress.address}</p>
          <p style="margin: 0 0 5px 0; color: #666;">${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}</p>
          <p style="margin: 0; color: #666;">Phone: ${shippingAddress.phone}</p>
        </div>

        <div style="text-align: center; margin-top: 40px; color: #999; font-size: 12px;">
          <p>We'll send you another email when your order ships.</p>
          <p>&copy; ${new Date().getFullYear()} TechReborn. All rights reserved.</p>
        </div>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: 'TechReborn <onboarding@resend.dev>', // MUST use this on free tier
        to,
        subject: `Order Confirmation - #${shortOrderId}`,
        html,
      });
    } catch (error) {
      console.error("Failed to send order confirmation email:", error);
      // We don't throw here to avoid failing the checkout if email fails
    }
  }
}
