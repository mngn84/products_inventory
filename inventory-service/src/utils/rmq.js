import amqp from 'amqplib';

let ch;
const queue = 'inventory_events';

export async function connectToRMQ() {
    const conn = await amqp.connect('amqp://localhost');
    ch = await conn.createChannel();
    await ch.assertQueue(queue);
}

export function publishEvent(event) {
    ch.sendToQueue(queue, Buffer.from(JSON.stringify(event)));
}