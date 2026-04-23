import 'dotenv/config';
import { connectDB } from './db';
import { createApp } from './app';

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/medical_demo';

async function start(): Promise<void> {
  try {
    await connectDB(MONGO_URI);
    const app = createApp();
    app.listen(PORT, () => console.log(`API em http://localhost:${PORT}`));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Falha ao arrancar servidor:', message);
    process.exit(1);
  }
}

start();
