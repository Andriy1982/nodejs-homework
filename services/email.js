const Mailgen = require('mailgen');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

class EmailServices {
    #sender = sgMail
    #GenerationTamplate = Mailgen
    constructor(env) {}
    #createTamplate(verifyToken, name = 'Guest') {}

    sendEmail(verifyToken, email, name) {}
}