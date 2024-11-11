const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const nodemailer = require("nodemailer");
const config = require("../config/config");

const transporter = nodemailer.createTransport(config.email.smtp);

const generateHTML = (hbsFile, hbsFileData) => {
  try {
    const templatePath = path.join(__dirname, "..", "templates", hbsFile);
    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const template = Handlebars.compile(templateSource);
    const htmlToSend = template(hbsFileData);

    return htmlToSend;
  } catch (error) {
    console.log("Error-Service-generateHTML", error);
  }
};

const sendMail = async (to, subject, html, text = "") => {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: config.email.smtp.auth.user, // sender address
    to, // list of receivers
    subject,
    text,
    html,
  });

  console.log("Message sent: %s", info.messageId);
};

module.exports = {
  generateHTML,
  sendMail,
};
