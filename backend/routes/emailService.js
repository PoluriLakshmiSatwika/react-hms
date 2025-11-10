
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

// ✅ Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

/* ✅ Send Reset Password Email */
export const sendResetEmail = async (email, name, resetLink) => {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #2E86C1; padding: 20px; text-align: center; color: white;">
            <h1>🏥 Hospital Management System</h1>
          </div>
          <div style="padding: 25px;">
            <p>Hi <strong>${name || "User"}</strong>,</p>
            <p>You requested to reset your password.</p>
            <div style="text-align: center; margin: 25px 0;">
              <a href="${resetLink}" target="_blank"
                style="background-color: #2E86C1; color: white; padding: 12px 24px; text-decoration: none;
                border-radius: 6px; font-weight: bold;">Reset Password</a>
            </div>
            <p>This link expires in <strong>30 minutes</strong>.</p>
          </div>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: process.env.EMAIL_FROM,     // ✅ no Gmail needed
      to: email,
      subject: "Password Reset Request – Hospital Management System",
      html: htmlContent,
    });

    console.log(`✅ Reset email sent to ${email}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
};


/* ✅ Optional — Welcome Email */
export const sendWelcomeEmail = async (email, name, role) => {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Welcome to HMS, ${name}!`,
      html: `<p>Hello ${name}, your ${role.toUpperCase()} account is now active.</p>`,
    });

    console.log(`✅ Welcome email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
  }
};

