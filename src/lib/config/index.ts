// Environment Configuration Exports
export { clientEnv } from './env.client';
export { serverEnv } from './env.server';
export { testEnv } from './env.test';

// Re-export commonly used environment variables
import { clientEnv } from './env.client';
import { serverEnv } from './env.server';
import { testEnv } from './env.test';

export const env = {
  client: clientEnv,
  server: serverEnv,
  test: testEnv,
} as const;
