import { Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export const sendVerificationEmail = async (
  email: string,
  verificationCode: string,
  logger: Logger,
): Promise<void> => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT),
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
    secure: false,
    requireTLS: true,
  } as nodemailer.TransportOptions);

  const mailOptions = {
    from: 'taxi.tails.support@gmail.com',
    to: email,
    subject: 'Verify Your Email',
    text: `Your verification code is: ${verificationCode}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.log(`Verification email sent to ${email}`);
  } catch (error) {
    logger.error(`Error sending verification email: ${error.message}`);
    throw error;
  }
};
