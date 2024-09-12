import amqp, { Channel, Connection, ConsumeMessage } from 'amqplib';
import { handleEvent } from '../controllers/historyController';

let ch: Channel;
const queue = 'inventory_events';

export async function connectToRMQ() {
    const conn: Connection = await amqp.connect('amqp://localhost');
    const ch = await conn.createChannel();
    await ch.assertQueue(queue);
    return ch;
}

export function consumeEvents(ch: Channel) {
    ch.consume(queue, (msg: ConsumeMessage | null) => {
        if (msg) {
            const event = JSON.parse(msg.content.toString());
            handleEvent(event);
            ch.ack(msg);
        } else {
            console.log('Consumer cancelled by server');
        }

    });
}