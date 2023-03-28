import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
const {
  NODEMAILER_AUTH_MAIL,
  NODEMAILER_AUTH_PASSWORD,
  NODEMAILER_PORT,
  NODEMAILER_HOST,
} = process.env;

async function sendAssignmentMail(
  email: any,
  token: any,
  name: any,
  projectId: any,
  projectName: any,
  client: any
) {
  try {
    const transporter = nodemailer.createTransport(
      smtpTransport({
        host: NODEMAILER_HOST,
        port: parseInt(NODEMAILER_PORT!),
        secure: true,
        auth: {
          user: NODEMAILER_AUTH_MAIL!,
          pass: NODEMAILER_AUTH_PASSWORD!,
        },
      })
    );

    var mailOptions = {
      from: NODEMAILER_AUTH_MAIL!,
      to: email,
      subject: "message de test ",
      html: `<div style="font-family: Arial, sans-serif; font-size: 16px; text-align: center;">
      <p style="font-weight: bold; margin-bottom: 10px">A new mission for you, ${name}</p>
      <p>A new project called ${projectName} for our client ${client} is on the queue.</p>
      <p>We decided that you will be part of this project</p>
      <p>Click on the link below to confirm your assignment</p>
      <p style="margin-bottom: 20px">
        <a
          style="color: #007bff"
          href="http://localhost:3001/assign/${projectId}/${token}"
          >Click Here to Confirm Assignment</a
        >
      </p>
      <p>Best Regards!</p>
    </div>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error: any) {
    console.log(error);
  }
}

export default sendAssignmentMail;
