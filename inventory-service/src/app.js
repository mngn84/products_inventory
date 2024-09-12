import 'dotenv/config';
import express from 'express';
import routes from './routes/routes.js';
import { connectToRMQ } from './utils/rmq.js';

const app = express();
const PORT = process.env.PORT;

async function startServer() {
    try {
        await connectToRMQ();

        app.use(express.json());
        app.use('/api', routes);

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
    }
}

startServer();