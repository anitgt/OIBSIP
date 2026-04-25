const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // We'll use a mocked transport or wait for the user to provide EMAIL_USER / EMAIL_PASS
      auth: {
        user: process.env.EMAIL_USER || 'test@example.com',
        pass: process.env.EMAIL_PASS || 'password'
      }
    });

    const mailOptions = {
      from: `"Pizzeria" <${process.env.EMAIL_USER || 'test@example.com'}>`,
      to,
      subject,
      html
    };

    // For testing purposes when EMAIL_USER is not provided, we can just log
    if(!process.env.EMAIL_USER) {
       console.log('Sending mock email to:', to);
       console.log('Subject:', subject);
       console.log('Body:', html);
       return true;
    }

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = sendEmail;
