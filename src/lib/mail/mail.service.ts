import nodemailer from 'nodemailer';
import { getEnv } from '../../projects/config/env';

const transporter = nodemailer.createTransport({
  host: getEnv('SMTP_HOST'),
  port: Number(getEnv('SMTP_PORT')),
  secure: false,
  auth: {
    user: getEnv('SMTP_USER'),
    pass: getEnv('SMTP_PASS'),
  },
});

export async function sendMail(payload: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  if (!payload.to) {
    throw new Error('Mail recipient is required');
  }

  return transporter.sendMail({
    from: getEnv('MAIL_FROM'),
    to: payload.to,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  });
}