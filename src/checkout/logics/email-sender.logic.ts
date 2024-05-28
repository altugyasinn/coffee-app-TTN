import * as amqp from 'amqplib';
import nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';




export class EmailSenderLogic {
    private transporter: Transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp-mail.outlook.com',
            port: 587,
            secure: false,
            auth: {
                user: 'altug_durmus@outlook.com',
                pass: 'Heyihaveamail',
              },
            });
          }

async sendEmail(email: string) {
    const info = await this.transporter.sendMail({
        from: '"Altug Yasin Durmus" <altug_durmus@outlook.com>',
        to: email,
        subject: 'Kahve Siparisiniz',
        text: 'Bizi tercih ettiginiz icin tesekkurler.'
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}
}

