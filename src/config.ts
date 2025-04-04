#!/usr/bin/env node
/**
 * Configuration module for the MCP email server
 * Handles environment variables and validation
 */

// Required environment variables
const requiredEnvVars = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASSWORD',
  'EMAIL_FROM'
];

// Interface for email configuration
export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  tls: {
    rejectUnauthorized: boolean;
  };
  connectionTimeout: number;
  from: string;
}

/**
 * Validates that all required environment variables are present
 * @throws Error if any required environment variable is missing
 */
function validateEnvVars(): void {
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

/**
 * Gets the email configuration from environment variables
 * @returns EmailConfig object with SMTP settings
 */
export function getEmailConfig(): EmailConfig {
  validateEnvVars();
  
  return {
    host: process.env.SMTP_HOST!,
    port: parseInt(process.env.SMTP_PORT!, 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASSWORD!
    },
    tls: {
      rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== 'false'
    },
    connectionTimeout: parseInt(process.env.SMTP_TIMEOUT || '10000', 10),
    from: process.env.EMAIL_FROM!
  };
}
