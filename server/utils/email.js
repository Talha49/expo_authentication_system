const nodemailer = require('nodemailer');
require('dotenv').config(); // Ensure .env is loaded here

// Log credentials for debugging
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Simplified Gmail service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Verification Error:', error.message);
  } else {
    console.log('SMTP Server is ready to send emails');
  }
});

const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log('Email sent successfully to:', to, 'Message ID:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending error:', error.message);
    throw error;
  }
};

module.exports = { sendEmail };