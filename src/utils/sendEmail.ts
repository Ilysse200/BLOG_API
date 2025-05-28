import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { AuthService } from "../service/Auth.service";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS, 
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: process.env.AUTH_EMAIL,
    to,
    subject,
    html,
  });
};

// Optional: Verify the connection
transporter.verify((err, success) => {
  if (err) {
    console.error("SMTP error:", err);
  } else {
    console.log("SMTP ready for Gmail:", success);
  }
});
