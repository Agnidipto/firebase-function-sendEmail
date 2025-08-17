# Firebase Email Function

A Firebase Cloud Function that sends emails using Gmail SMTP via Nodemailer.

## Overview

This function provides an HTTP endpoint to send emails through Gmail's SMTP service. It supports both local development with environment variables and production deployment with Firebase parameters.

## Function: `sendEmail`

**Endpoint:** `/sendEmail`  
**Method:** POST  
**Content-Type:** application/json

### Request Body

```json
{
  "subject": "Email subject line",
  "text": "Plain text email body (optional if html is provided)",
  "html": "<p>HTML email body (optional if text is provided)</p>"
}
```

### Response

**Success (200):**
```json
{
  "success": true,
  "messageId": "unique-message-id",
  "message": "Email sent successfully"
}
```

**Error (400/500):**
```json
{
  "success": false,
  "error": "Error message"
}
```

## Configuration

### Local Development

Create a `.env` file in the functions directory:

```env
EMAIL=your-gmail@gmail.com
APP_PASSWORD=your-app-password
RECIPIENT=recipient@example.com
```

### Production Deployment

Set Firebase parameters:

```bash
firebase functions:config:set email.user="your-gmail@gmail.com"
firebase functions:config:set email.password="your-app-password"
firebase functions:config:set email.recipient="recipient@example.com"
```

## Gmail Setup

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password for this application
3. Use the App Password (not your regular password) in the configuration

## CORS

The function includes CORS support with:
- Origin: All origins allowed (`true`)
- Credentials: Enabled

## Dependencies

- `firebase-functions`: Firebase Cloud Functions runtime
- `nodemailer`: Email sending library
- `cors`: Cross-origin resource sharing middleware
- `dotenv`: Environment variable loading (dev only)

## Error Handling

- Validates required fields (`subject` and either `text` or `html`)
- Returns appropriate HTTP status codes
- Logs errors for debugging
- Graceful error responses with JSON format