import nodemailer from 'nodemailer';

export const sendEmail = async (
    email: string,
    subject: string,
    text: string,
) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com',
        port: 587,
        secure: false,
        auth: {
            user: 'dev@arrivo.app',
            pass: 'Dev@0618',
        },
    });

    await transporter.sendMail({
        from: 'dev@arrivo.app',
        to: email,
        subject,
        text,
    });
};
