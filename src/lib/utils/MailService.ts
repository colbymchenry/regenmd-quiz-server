import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import {config} from "dotenv";

config();

function createService() {
    // create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST, // replace with your email provider's SMTP server
        port: parseInt(process.env.MAIL_PORT || "465"),
        secure: process.env.MAIL_SECURE == '1', // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USER, // your SMTP username
            pass: process.env.MAIL_PASS, // your SMTP password
        },
    });

    async function send(config: {
        from: string;
        to: string;
        subject: string;
        text?: string;
        html?: string;
    }) {
        // send mail with defined transport object
        return await transporter.sendMail(config);
    }

    async function getEmailTemplate(fileName: string) {
        // determine the path to the template file
        const templatePath = path.resolve('src/lib/assets/EmailTemplates/' + fileName + '.html');

        // read the file
        const template = fs.readFileSync(templatePath, 'utf8');
        return template;
    }

    return { send, getEmailTemplate };
}

export const MailService = createService();