import http from 'node:http';
import { env } from './config/env.js';
import { connectDb } from './config/db.js';
import { createApp } from './app.js';
import { seedAdmin } from './scripts/seedAdmin.js';
import { seedDemoCustomer } from './scripts/seedDemoCustomer.js';
import { seedProducts } from './scripts/seedProducts.js';
import { seedDeliveredOrder } from './scripts/seedDeliveredOrder.js';
import { attachChat } from './realtime/chat.js';

const app = createApp();
const server = http.createServer(app);
attachChat(server);

async function start() {
  await connectDb();
  await seedAdmin();
  await seedDemoCustomer();
  await seedProducts();
  await seedDeliveredOrder();

  server.listen(env.port, () => {
    console.info(`ShewaCraft API listening on http://localhost:${env.port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
