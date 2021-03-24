const Mailgen = require('mailgen');
const sgMail = require('@sendgrid/mail');
const config = require('../config/email.json');
require('dotenv').config();

class EmailService {
  #GenerationTamplate = Mailgen;
  #sender = sgMail;
  constructor(env) {
    switch (env) {
      case 'development':
        this.link = config.dev;
        break;
      case 'stage':
        this.link = config.stage;
        break;
      case 'production':
        this.link = config.prod;
        break;
      default:
        this.link = config.dev;
        break;
    }
  }
  #createTamplate(verifyToken, name = 'Guest') {
    const mailGenerator = new this.#GenerationTamplate({
      theme: 'cerberus',
      product: {
        name: 'My Contacts',
        link: this.link,
      },
    });
    const template = {
      body: {
        name,
        intro: 'Welcome to our site!',
        action: {
          instructions: 'To get started, please click here:',
          button: {
            color: '#22BC66',
            text: 'Confirm your account',
            link: `${this.link}/auth/verify/${verifyToken}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };
    return mailGenerator.generate(template);
  }

  async sendEmail(verifyToken, email, name) {
    const emailBody = this.#createTamplate(verifyToken, name);
    this.#sender.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: 'kruchandriy@gmail.com', // Use the email address or domain you verified above
      subject: 'Підтвердження реєстрації',
      html: emailBody,
    };
    await this.#sender.send(msg);
  }
}

module.exports = EmailService;
