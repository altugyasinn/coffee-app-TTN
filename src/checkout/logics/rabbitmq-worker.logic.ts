import * as amqp from 'amqplib';
import { EmailSenderLogic } from './email-sender.logic';

export class RabbitMqWorkerLogic {
    private emailSenderLogic: EmailSenderLogic;

    constructor(emailSenderLogic: EmailSenderLogic) {
        this.emailSenderLogic = emailSenderLogic;
    }

    async emailWorker() {
        try {
            const connection = await amqp.connect('amqp://rabbitmq:5672');
            const channel = await connection.createChannel();
            const queueName = 'emailQueue';

            await channel.assertQueue(queueName, { durable: false });

            console.log(" [*] Waiting for emails in %s. To exit press CTRL+C", queueName);

            channel.consume(queueName, async (msg) => {
                if (msg !== null) {
                    const email = msg.content.toString();
                    await this.emailSenderLogic.sendEmail(email);
                    channel.ack(msg);
                }
            }, { noAck: false });
        } catch (error) {
            console.error('Error connecting to RabbitMQ:', error);
        }
    }

}

