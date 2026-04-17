import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Define the email options
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USERNAME,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html, // Optional HTML format
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
