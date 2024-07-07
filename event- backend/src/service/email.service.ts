import * as nodemailer from 'nodemailer';

// Create a transporter using your SMTP settings
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'nandanvarbharat@gmail.com',
        pass: 'Bharat@123%'
    }
});

export async function sendEmail(emailOptions: nodemailer.SendMailOptions) {
    try {
        const info = await transporter.sendMail(emailOptions);
        console.log('Email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
