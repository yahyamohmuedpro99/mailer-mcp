/**
 * Mailer module for the MCP email server
 * Handles email sending functionality
 */

import nodemailer from 'nodemailer';
import { EmailConfig } from './config.js';

// Interface for email options
export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Creates a nodemailer transporter with the provided configuration
 * @param config Email configuration
 * @returns Nodemailer transporter
 */
export function createTransporter(config: EmailConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.auth.user,
      pass: config.auth.pass
    },
    tls: {
      rejectUnauthorized: config.tls.rejectUnauthorized
    },
    connectionTimeout: config.connectionTimeout
  });
}

/**
 * Verifies the transporter connection
 * @param transporter Nodemailer transporter
 * @returns Promise that resolves when verification is successful
 */
export async function verifyTransporter(transporter: nodemailer.Transporter) {
  try {
    await transporter.verify();
    console.log('SMTP connection verified successfully');
  } catch (error) {
    console.error('SMTP connection failed:', error);
    throw error;
  }
}

/**
 * Sends an email
 * @param transporter Nodemailer transporter
 * @param options Email options
 * @param from Sender email address
 * @returns Promise that resolves with the send info
 */
export async function sendEmail(
  transporter: nodemailer.Transporter,
  options: EmailOptions,
  from: string
) {
  try {
    console.log(`Attempting to send email to: ${options.to}`);
    
    const mailOptions = {
      from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully, ID:', info.messageId);
    
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}
