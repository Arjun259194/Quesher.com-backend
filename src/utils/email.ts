import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

type DefaultMailConfig = { username: string; email: string };

type OtpMailConfig = { type: 'OTP'; code: number } & DefaultMailConfig;

type NotificationMailConfig = {
  type: 'Notification';
  message: string[];
} & DefaultMailConfig;

type DebugMailConfig = {
  type: 'Debug';
  message: string[];
} & DefaultMailConfig;

type MailConfig = OtpMailConfig | NotificationMailConfig | DebugMailConfig;

export default class MailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor(config: { user: string; pass: string }) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: config,
    });
  }

  public async sendMail(config: MailConfig) {
    switch (config.type) {
      case 'OTP':
        await this.transporter.sendMail({
          from: 'Qresher.com',
          to: config.email,
          subject: 'Authentication',
          html: this.OPTMailHTML({
            username: config.username,
            code: config.code,
          }),
        });
        break;
      case 'Notification':
        // TODO: creating a mail template for notification
        break;

      case 'Debug':
        const { formattedTime, isoTime } = this.getCurrentTime();

        await this.transporter.sendMail({
          from: 'Qresher.com',
          to: config.email,
          subject: 'Debugging Purposes',
          html: this.debugMailHTML({
            messages: config.message,
            time: { formatted: formattedTime, isoFormat: isoTime },
            userEmail: config.email,
          }),
        });
    }
  }

  getCurrentTime(): { formattedTime: string; isoTime: string } {
    const now = new Date();

    // Formatting options for the desired format
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC', // Modify this based on your timezone requirements
    };

    // Formatted time string
    const formattedTime = now.toLocaleString('en-US', options);

    // ISO formatted time string
    const isoTime = now.toISOString();

    return { formattedTime, isoTime };
  }

  private debugMailHTML(debugInfo: {
    userEmail: string;
    messages: string[];
    time: {
      isoFormat: string;
      formatted: string;
    };
  }) {
    const {
      messages,
      userEmail,
      time: { formatted, isoFormat },
    } = debugInfo;

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Debug Email</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">

      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="text-align: center; color: #333;">Debug Email Template</h2>
        <p style="text-align: center; color: #666; margin-bottom: 20px;">This is a sample email for checking and debugging purposes.</p>
        
        <h3 style="color: #333;">Debugging Information:</h3>
        <p><strong>App Name:</strong> Qresher.com</p>
        <p><strong>User's Email:</strong> ${userEmail}</p>
        <p><strong>Time of Sending (ISO Format):</strong> ${isoFormat}</p>
        <p><strong>Time of Sending (Formatted):</strong> ${formatted}</p>
        <p><strong>Additional Messages:</strong> ${messages.map(
          (message) => `<p>${message}</p>`,
        )}</p>
        

        <p style="text-align: center; color: #666; margin-top: 20px;">Feel free to modify and use this template for testing your Nodemailer setup.</p>
        
        <p style="text-align: center; color: #999; margin-top: 30px;">Thank you!</p>
      </div>
    </body>
    </html>
  `;
  }

  private OPTMailHTML(option: { username: string; code: number }) {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>One-Time Password Email</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">

  <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    <h2 style="text-align: center; color: #333;">Hi ${option.username},</h2>
    <p style="text-align: center; color: #666; margin-bottom: 20px;">Your One-Time Password (OTP) is below:</p>
    
    <div style="text-align: center; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
      <h1 style="font-size: 36px; margin: 0; color: #333;">${option.code}</h1>
    </div>

    <p style="text-align: center; color: #666; margin-top: 20px;">This OTP is valid for a single use and should not be shared with anyone. It will expire in a certain period of time.</p>
    
    <p style="text-align: center; color: #999; margin-top: 30px;">Thank you for using our services!</p>
  </div>
</body>
</html>
  `;
  }
}
