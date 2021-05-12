const nodemailer = require("nodemailer");
const {
  NODEMAILER_SMTP_HOST,
  NODEMAILER_SMTP_PORT,
  NODEMAILER_USER,
  NODEMAILER_PASS,
} = process.env;

// async..await is not allowed in global scope, must use a wrapper
const sendOTP = async (receiver, plainMessage, htmlMessage) => {
  try {
    if (!receiver) return;
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: NODEMAILER_SMTP_HOST,
      port: NODEMAILER_SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: NODEMAILER_USER, // generated ethereal user
        pass: NODEMAILER_PASS, // generated ethereal password
      },
      tls: {
        ciphers: "SSLv3",
      },
    });

    // send mail with defined transport object
    // let info = await transporter.sendMail({
    //   from: "'BelajarSip' <no-reply-belajarsip@sipamungkas.com>", // sender address
    //   to: receiver, // list of receivers
    //   subject: "Belajarsip - Reset Password OTP", // Subject line
    //   text: plainMessage, // plain text body
    //   html: htmlMessage, // html body
    // });
    await transporter.sendMail({
      from: "'BelajarSip' <no-reply-belajarsip@sipamungkas.com>", // sender address
      to: receiver, // list of receivers
      subject: "Belajarsip - Reset Password OTP", // Subject line
      text: plainMessage, // plain text body
      html: htmlMessage, // html body
    });
    // console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  } catch (error) {
    console.log(error);
  }
};
module.exports = { sendOTP };
