import nodemailer from "nodemailer";
import { EMAIL_NAME, EMAIL_PASSWORD } from "./env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_NAME,
    pass: EMAIL_PASSWORD,
  },
  secure: true,
  port: 465,
});

export default transporter;
