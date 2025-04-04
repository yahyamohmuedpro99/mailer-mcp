#!/usr/bin/env node
/**
 * MCP server for sending emails
 * Main entry point
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { McpError } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { getEmailConfig } from './config.js';
import { createTransporter, sendEmail, verifyTransporter } from './mailer.js';

// Create an MCP server
const server = new McpServer({ name: 'email-server', version: '1.0.0' });

// Handle process termination
process.on('SIGINT', async () => {
  await server.close();
  process.exit(0);
});

async function main() {
  try {
    // Get email configuration from environment variables
    const config = getEmailConfig();
    
    // Create and verify the transporter
    const transporter = createTransporter(config);
    await verifyTransporter(transporter);
    
    // Define the send_email tool
    server.tool('send_email', {
      recipient: z.string().email(),
      body: z.string()
    }, async ({ recipient, body }) => {
      try {
        console.log('Attempting to send email to:', recipient);
        
        await sendEmail(
          transporter,
          {
            to: recipient,
            subject: 'Email from MCP Server',
            text: body
          },
          config.from
        );
        
        return { 
          content: [
            { 
              type: 'text', 
              text: `Email sent successfully to ${recipient}` 
            }
          ] 
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Email sending failed:', errorMessage);
        
        return { 
          content: [
            { 
              type: 'text', 
              text: `Failed to send email: ${errorMessage}` 
            }
          ],
          isError: true
        };
      }
    });
    
    // Define the test_email tool
    server.tool('test_email', {}, async () => {
      try {
        await sendEmail(
          transporter,
          {
            to: 'test@example.com', // This should be a configurable test email
            subject: 'Test from MCP Server',
            text: 'This is a test email from the MCP server'
          },
          config.from
        );
        
        return { 
          content: [
            { 
              type: 'text', 
              text: 'Test email sent successfully' 
            }
          ] 
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        return { 
          content: [
            { 
              type: 'text', 
              text: `Test failed: ${errorMessage}` 
            }
          ],
          isError: true
        };
      }
    });
    
    // Start the server
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log('Email MCP server running on stdio');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main().catch(console.error);
