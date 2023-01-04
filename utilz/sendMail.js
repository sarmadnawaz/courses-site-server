import nodemailer from "nodemailer";

export default async function ({ email, subject, message }) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: "Hello <hello@gmail.com>",
      to: email,
      subject: subject,
      text: message,
    };
    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw Error("Can't send Email" + err.message);
  }
}
