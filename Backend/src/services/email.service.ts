import nodemailer from "nodemailer";

export const sendOtpEmail = async (
  email: string,
  otp: string,
  purpose: "register" | "reset" = "register"
): Promise<boolean> => {
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT || "587");
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const from = process.env.EMAIL_FROM || '"GangaYatra Support" <no-reply@gangayatra.com>';

  console.log(`[EMAIL SERVICE] Attempting to send ${purpose} OTP to ${email}...`);

  // Fallback if env vars are missing
  if (!user || !pass) {
    console.log("=========================================");
    console.log(`🔑 DEV MODE OTP: ${otp} for ${email} (Purpose: ${purpose})`);
    console.log("To send real emails, configure EMAIL_USER and EMAIL_PASS in your .env file.");
    console.log("=========================================");
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: host || "smtp.gmail.com",
      port: port,
      secure: port === 465,
      auth: {
        user: user,
        pass: pass,
      },
    });

    const subject = purpose === "register" 
      ? "GangaYatra - Verify Your Account Email" 
      : "GangaYatra - Reset Your Password";

    const titleText = purpose === "register"
      ? "Welcome to GangaYatra!"
      : "Password Reset Request";

    const bodyText = purpose === "register"
      ? "Thank you for registering. Please verify your email using the OTP below to activate your account."
      : "We received a request to reset your password. Use the OTP below to complete the reset process.";

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e1e8ed; border-radius: 12px; background-color: #fcfdfe;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #071b4d; margin: 0; font-size: 26px;">🚤 GangaYatra</h2>
          <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Premium GangaYatra Platform</p>
        </div>
        <div style="background-color: #ffffff; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.02); border: 1px solid #edf2f7;">
          <h3 style="color: #1e293b; margin-top: 0; margin-bottom: 12px; font-size: 20px;">${titleText}</h3>
          <p style="color: #475569; font-size: 15px; line-height: 1.5; margin-bottom: 24px;">${bodyText}</p>
          <div style="text-align: center; margin: 25px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #f97316; background-color: #fff7ed; padding: 12px 24px; border-radius: 8px; border: 1px dashed #fdba74; display: inline-block;">${otp}</span>
          </div>
          <p style="color: #94a3b8; font-size: 13px; text-align: center; margin-top: 20px;">This OTP is valid for 5 minutes. Do not share this OTP with anyone.</p>
        </div>
        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #94a3b8;">
          <p>&copy; ${new Date().getFullYear()} GangaYatra. All rights reserved.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: from,
      to: email,
      subject: subject,
      html: htmlContent,
      text: `${subject}\n\n${bodyText}\n\nOTP Code: ${otp}\n\nThis OTP is valid for 5 minutes.`,
    });

    console.log(`[EMAIL SERVICE] OTP successfully sent to ${email}`);
    return true;
  } catch (error) {
    console.error("[EMAIL SERVICE] Error sending email:", error);
    throw new Error("Failed to send verification email. Please check SMTP configuration.");
  }
};
