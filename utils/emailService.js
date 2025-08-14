import transporter from "../config/nodemailer.js";
import { generateEmailTemplate } from "./resetPassword-template.js";

export const sendPasswordResetEmail = async ({
  email,
  firstName,
  resetURL,
}) => {
  const htmlContent = generateEmailTemplate.passwordReset(firstName, resetURL);

  await transporter.sendMail({
    from: `"Express App" <aajijola3@gmail.com>`,
    to: email,
    subject: "Password Reset Request",
    html: htmlContent,
  });
};

export const sendVerificationEmail = async ({
  email,
  firstName,
  verificationURL,
}) => {
  const htmlContent = generateEmailTemplate.emailVerification(
    firstName,
    verificationURL
  );

  await transporter.sendMail({
    from: `"Express App" <aajijola3@gmail.com>`,
    to: email,
    subject: "Verify Your Email Address - Express App",
    html: htmlContent,
  });
};
