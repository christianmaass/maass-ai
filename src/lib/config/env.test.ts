import { z } from 'zod';

const TestSchema = z.object({
  CI: z.string().optional(),
});

export const testEnv = TestSchema.parse({
  CI: process.env.CI,
});
