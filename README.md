# Mailer MCP

A Model Context Protocol (MCP) server for sending emails. This server is designed to be completely SMTP provider agnostic, allowing you to use any SMTP relay service of your choice (Gmail, SendGrid, Mailgun, SMTP2Go, etc.) by simply configuring the appropriate environment variables. The server provides tools for sending emails through SMTP using environment variables for configuration.

## Features

- Send emails to specified recipients
- Test email functionality
- Environment variable configuration
- Proper error handling and logging
- TypeScript implementation for type safety

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mailer-mcp.git
cd mailer-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Configuration

The server requires the following environment variables to be set in the MCP configuration:

| Variable | Description | Example |
|----------|-------------|---------|
| `SMTP_HOST` | SMTP server hostname | smtp.example.com |
| `SMTP_PORT` | SMTP server port | 587 |
| `SMTP_USER` | SMTP username | user@example.com |
| `SMTP_PASSWORD` | SMTP password | password123 |
| `EMAIL_FROM` | Sender email address | sender@example.com |

Optional environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `SMTP_SECURE` | Use secure connection (TLS) | false |
| `SMTP_REJECT_UNAUTHORIZED` | Reject unauthorized TLS certificates | true |
| `SMTP_TIMEOUT` | Connection timeout in milliseconds | 10000 |

## MCP Configuration

Add the following to your Cline MCP settings configuration file:

```json
"email-server": {
  "autoApprove": [],
  "disabled": false,
  "timeout": 60,
  "command": "node",
  "args": [
    "path/to/mailer-mcp/dist/index.js"
  ],
  "env": {
    "SMTP_HOST": "smtp.example.com",
    "SMTP_PORT": "587",
    "SMTP_USER": "user@example.com",
    "SMTP_PASSWORD": "password123",
    "EMAIL_FROM": "sender@example.com"
  },
  "transportType": "stdio"
}
```

## Available Tools

### send_email

Sends an email to a specified recipient.

**Parameters:**
- `recipient` (string, required): Email address of the recipient
- `body` (string, required): Email body content

**Example:**
```json
{
  "recipient": "recipient@example.com",
  "body": "Hello, this is a test email from the MCP server."
}
```

### test_email

Sends a test email to verify the configuration.

**Parameters:** None

## Development

1. Start the TypeScript compiler in watch mode:
```bash
npm run dev
```

2. Make your changes to the source files in the `src` directory.

3. The TypeScript compiler will automatically recompile the files when changes are detected.

## License

[MIT](LICENSE)
