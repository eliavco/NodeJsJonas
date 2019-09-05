const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport'); // this is important

const serverC = process => {
    return {
        host:
            process.env.EMAIL_TRAP === 'T'
                ? process.env.EMAIL_HOST_DEV
                : process.env.EMAIL_HOST_PROD,
        port:
            process.env.EMAIL_TRAP === 'T'
                ? process.env.EMAIL_PORT_DEV * 1
                : process.env.EMAIL_PORT_PROD * 1,
        auth: {
            user:
                process.env.EMAIL_TRAP === 'T'
                    ? process.env.EMAIL_USERNAME_DEV
                    : process.env.EMAIL_USERNAME_PROD,
            pass:
                process.env.EMAIL_TRAP === 'T'
                    ? process.env.EMAIL_PASSWORD_DEV
                    : process.env.EMAIL_PASSWORD_PROD
        }
    };
};

const sendEmail = async options => {
    // If EMAIL_TRAP set to T the emails will be trapped in mailtrap inbox
    const serverConnect = serverC(process);

    const transporter = nodemailer.createTransport(
        smtpTransport(serverConnect)
    );

    const mailOptions = {
        from: 'Eliav Cohen <eliav.co@eliavco.com>',
        to: options.email,
        subject: options.subject,
        // html: options.html,
        text: options.message
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
