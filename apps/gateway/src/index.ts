import { loadConfig } from './config.js';
import { buildServer } from './server.js';

async function main() {
  const config = loadConfig();
  const app = buildServer(config);

  try {
    await app.listen({ host: config.GATEWAY_HOST, port: config.GATEWAY_PORT });
    console.log(`Gateway listening on ${config.GATEWAY_HOST}:${config.GATEWAY_PORT}`);
  } catch (err) {
    console.error('Failed to start gateway:', err);
    process.exit(1);
  }

  const shutdown = async () => {
    console.log('Shutting down gracefully...');
    await app.close();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main();
