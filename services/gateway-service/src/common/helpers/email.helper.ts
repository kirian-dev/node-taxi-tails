import { Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { config } from 'src/configs/config';

export const sendVerificationEmail = async (
  email: string,
  verificationCode: string,
  logger: Logger,
): Promise<void> => {
  const { smtpUser, smtpPassword, smtpHost, smtpPort } = config();

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort),
    auth: {
      user: smtpUser,
      pass: smtpPassword,
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
