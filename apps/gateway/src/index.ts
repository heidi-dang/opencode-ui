import { parseConfig, ConfigValidationError } from './config.js';
import { buildServer } from './server.js';

async function main() {
  let config;
  try {
    config = parseConfig();
  } catch (err) {
    if (err instanceof ConfigValidationError) {
      console.error('Configuration validation failed:', err.message);
    } else {
      console.error('Unexpected error during configuration:', err);
    }
    process.exit(1);
  }

  const app = buildServer(config);

  try {
    await app.listen({ host: config.host, port: config.port });
    console.log(`Gateway listening on ${config.host}:${config.port}`);
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
