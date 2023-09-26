import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

import { env } from "#root/config/index.js";

const { EMAIL_HOST, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PASSWORD } = env;


const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: false,
    auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD
    }
});

const sendEmail = async ( options ) => {
    const { email, subject, message, template, context } = options;

    const templatePath = path.join(process.cwd(), 'src', 'resource', 'views', 'utils', 'email', `${ template }.ejs`);
    const html = await ejs.renderFile(templatePath, context);

    const mailOptions = {
        from: EMAIL_USERNAME,
        to: email,
        subject,
        html
    }

    await transporter.sendMail(mailOptions);
}

export { sendEmail }
