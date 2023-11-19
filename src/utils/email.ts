import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export default class MailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor(config: { user: string; pass: string }) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: config,
    });
  }

  public async sendMail(config: { username: string; userEmail: string; genUrl: string }) {
    await this.transporter.sendMail({
      from: "Qresher.com",
      to: config.userEmail,
      subject: "Authentication",
      html: this.createEmailTemplate({
        verificationUrl: config.genUrl,
        username: config.username,
      }),
    });
  }

  private createEmailTemplate(option: { verificationUrl: string; username: string }) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Email Verification</title>
      <style>
        /* CSS styles for the email template */
        body {
          font-family: Arial, sans-serif;
          background-color: #f7f7f7;
          margin: 0;
          padding: 20px;
          text-align: center;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 40px;
        }
        h1 {
          color: #333333;
          margin-bottom: 20px;
        }
        p {
          color: #666666;
          margin-bottom: 20px;
        }
        .card {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease-in-out;
          display: inline-block;
        }
        .card:hover {
          transform: scale(1.05);
          box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3);
        }
        .btn {
          display: inline-block;
          padding: 15px 30px;
          background-color: #4caf50;
          color: #ffffff;
          text-decoration: none;
          border-radius: 25px;
          transition: background-color 0.3s ease-in-out;
        }
        .btn:hover {
          background-color: #388e3c;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Email Verification</h1>
        <p>Dear ${option.username},</p>
        <div class="card">
          <p>Click the button below to verify your email:</p>
          <a href="${option.verificationUrl}">
          <button class="btn">Verify Email</button>
          </a>
        </div>
        <p>If you did not request this verification, please ignore this email.</p>
      </div>
    </body>
    </html>
  `;
  }
}
