var nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP,
  port: 587,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendMail = async (post, authors) => {
  try {
    authors.forEach((author) => {
      const MESSAGE_TEMPLATE = `Hello ${author.name}, There's a new post on the blog titled ${post.title} written by ${post.author.name}`;
      const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: `${author.name} <${author.email}>`,
        subject: "New Post Published on the Blog!",
        text: MESSAGE_TEMPLATE,
      };
      transporter.sendMail(mailOptions, (err) => {
        if (err) console.log("Error sending email : ", err);
        else if (data) console.log("Email successfully sent!");
      });
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { sendMail };
