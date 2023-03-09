import nodemailer from 'nodemailer'
import smtpTransport from 'nodemailer-smtp-transport'
const { NODEMAILER_AUTH_MAIL, NODEMAILER_AUTH_PASSWORD, NODEMAILER_PORT, NODEMAILER_HOST } = process.env

async function sendPasswordMail(email: any, token: any) {
  try {


    const transporter = nodemailer.createTransport(smtpTransport({
      host: NODEMAILER_HOST,
      port: parseInt(NODEMAILER_PORT!),
      secure: true,
      auth: {
        user: NODEMAILER_AUTH_MAIL!,
        pass: NODEMAILER_AUTH_PASSWORD!
      }
    }));

    var mailOptions = {
      from: NODEMAILER_AUTH_MAIL!,
      to: email,
      subject: 'message de test ',
      html: "<b> salut</b>" +
        `<br> votre lien de recuperation <a href="http://localhost:3001/reset-password/${token}"> http://localhost:3001/reset-password/${token}</a>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  } catch (error: any) {
    console.log(error)
  }
}

export default sendPasswordMail
