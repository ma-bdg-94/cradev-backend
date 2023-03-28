import nodemailer from 'nodemailer'
import smtpTransport from 'nodemailer-smtp-transport'
const { NODEMAILER_AUTH_MAIL, NODEMAILER_AUTH_PASSWORD, NODEMAILER_PORT, NODEMAILER_HOST } = process.env

async function sendPasswordMail(email: any, token: any, name: any) {
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
      subject: 'Password Recovery',
      html: `<div style="font-family: Arial, sans-serif; font-size: 16px; text-align: center;">
      <p style="font-weight: bold; margin-bottom: 10px">Greetings ${name},</p>
      <p>We regret that you have forgotten your password.<br /> Unfortunately due to our security policies that prohibits storing customer passwords in our databases, <br /> regret to inform you that your password can <span style="font-weight: bold;">never</span> be recovered.</p>
      <p>Alternatively, by clicking in the link below, you can generate a new password.</p>
      <p style="margin-bottom: 20px">
        <a
          style="color: #007bff"
          href="http://localhost:3001/reset-password/${token}"
          >Click Here to Generate New Password</a
        >
      </p>
      <p>Best Regards,</p>
      <p><span style="font-weight: bold;">Cradev</span> Team</p>
    </div>`
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
