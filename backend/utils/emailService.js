const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendEmail = async (to, subject, text, html = null) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html: html || text
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

module.exports = { sendEmail };