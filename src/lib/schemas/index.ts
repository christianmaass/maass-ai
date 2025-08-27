import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(['user', 'admin']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const TrackSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  duration: z.number().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export type User = z.infer<typeof UserSchema>;
export type Track = z.infer<typeof TrackSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
