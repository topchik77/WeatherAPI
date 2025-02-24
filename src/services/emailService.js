const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = (userEmail, verificationToken) => {
  const verificationLink = `https://weatherapi-production-9109.up.railway.app/api/users/verify/${verificationToken}`; 


  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Verify your registration on Meteorix',
    html: `<h2>Thanks for registration!</h2>
           <p>To activate your account, click below:</p>
           <a href="${verificationLink}">Verify Email</a>`, 
  };

  return transporter.sendMail(mailOptions);
};


module.exports = { sendVerificationEmail };
