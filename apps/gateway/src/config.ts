export interface GatewayConfig {
  GATEWAY_HOST: string;
  GATEWAY_PORT: number;
  NODE_ENV: string;
}

export function loadConfig(overrides?: Partial<GatewayConfig>): GatewayConfig {
  const portRaw = process.env.GATEWAY_PORT ?? '3001';
  const port = Number(portRaw);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(
      `Invalid GATEWAY_PORT: must be a positive integer between 1 and 65535, got "${portRaw}"`,
    );
  }

  const config: GatewayConfig = {
    GATEWAY_HOST: process.env.GATEWAY_HOST ?? '127.0.0.1',
    GATEWAY_PORT: port,
    NODE_ENV: process.env.NODE_ENV ?? 'development',
  };

  return { ...config, ...overrides };
}
