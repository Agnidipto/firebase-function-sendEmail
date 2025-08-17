const {onRequest} = require("firebase-functions/v2/https");
const {defineString} = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const nodemailer = require("nodemailer");
const cors = require("cors")({
  origin: true,
  credentials: true,
});

// Load environment variables for local development
if (process.env.FUNCTIONS_EMULATOR) {
  require("dotenv").config();
}

// Define environment variables for production
const emailUser = defineString("EMAIL_USER", {default: ""});
const emailPassword = defineString("EMAIL_PASSWORD", {default: ""});
const emailRecipient = defineString("EMAIL_RECIPIENT", {default: ""});

exports.sendEmail = onRequest({
  secrets: [],
}, async (request, response) => {
  return cors(request, response, async () => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.FUNCTIONS_EMULATOR ?
      process.env.EMAIL : emailUser.value(),
        pass: process.env.FUNCTIONS_EMULATOR ?
      process.env.APP_PASSWORD : emailPassword.value(),
      },
    });

    try {
      const {subject, text, html} = request.body;

      if (!subject || (!text && !html)) {
        response.status(400).send(
            "Missing required fields: subject, and text or html",
        );
        return;
      }

      const recipientEmail = process.env.FUNCTIONS_EMULATOR ?
    process.env.RECIPIENT : emailRecipient.value();

      const mailOptions = {
        from: process.env.FUNCTIONS_EMULATOR ?
      process.env.EMAIL : emailUser.value(),
        to: recipientEmail,
        subject: subject,
        text: text,
        html: html,
      };

      const result = await transporter.sendMail(mailOptions);
      logger.info("Email sent successfully", {messageId: result.messageId});
      response.status(200).json({
        success: true,
        messageId: result.messageId,
        message: "Email sent successfully",
      });
    } catch (error) {
      logger.error("Error sending email", error);
      response.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });
});
