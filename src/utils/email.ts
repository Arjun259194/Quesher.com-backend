import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_TOKEN,
  },
});
