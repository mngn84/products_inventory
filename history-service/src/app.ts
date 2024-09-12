import 'dotenv/config';
import express from "express";
import routes from "./routes/historyRoutes";
import { connectToRMQ, consumeEvents } from "./utils/rmq";

const app = express();
const port = process.env.PORT;

async function startServer() {
  try {
    const ch = await connectToRMQ();
    consumeEvents(ch);

    app.use(express.json());
    app.use('/api', routes);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
}

startServer();