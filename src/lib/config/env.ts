/**
 * Environment variable validation utilities
 * Ensures required environment variables are present at runtime
 */

export const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const;

export type RequiredEnvVar = (typeof REQUIRED_ENV_VARS)[number];

/**
 * Validates that all required environment variables are present
 * @throws {Error} If any required environment variables are missing
 */
export const validateEnv = (): void => {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env.local file and ensure all required variables are set.'
    );
  }
};

/**
 * Gets a required environment variable with runtime validation
 * @param key - The environment variable key
 * @returns The environment variable value
 * @throws {Error} If the environment variable is not set
 */
export const getRequiredEnvVar = (key: RequiredEnvVar): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
};
