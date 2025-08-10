import { z } from 'zod';

/**
 * Admin User Management Schemas
 *
 * SICHERHEITSSTRATEGIE:
 * - Phase 1: Additive Validation (non-breaking)
 * - Phase 2: Feature Flag für strenge Validation
 * - Phase 3: Graduelle Migration
 */

// ✅ SICHER: Test User Creation Schema (Phase 1)
export const CreateTestUserSchemaV1 = z.object({
  email: z.string().min(1, 'Email ist erforderlich'),
  first_name: z.string().min(1, 'Vorname ist erforderlich'),
  last_name: z.string().min(1, 'Nachname ist erforderlich'),
  duration: z.number().min(1, 'Duration muss mindestens 1 Stunde sein'),
});

// ✅ ZUKUNFT: Strenge Test User Validation (Phase 2)
export const CreateTestUserSchemaV2 = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  first_name: z
    .string()
    .min(2, 'Vorname muss mindestens 2 Zeichen haben')
    .max(50, 'Vorname zu lang'),
  last_name: z
    .string()
    .min(2, 'Nachname muss mindestens 2 Zeichen haben')
    .max(50, 'Nachname zu lang'),
  duration: z.number().min(1, 'Mindestens 1 Stunde').max(168, 'Maximal 7 Tage (168 Stunden)'),
});

// ✅ Admin Authorization Schema
export const AdminAuthSchema = z.object({
  authorization: z.string().startsWith('Bearer ', "Authorization Header muss 'Bearer ' enthalten"),
  user_id: z.string().uuid('Ungültige User ID').optional(),
  role: z.enum(['admin', 'user', 'test_user']).optional(),
});

// ✅ User Profile Update Schema
export const UserProfileUpdateSchema = z.object({
  user_id: z.string().uuid('Ungültige User ID'),
  updates: z.object({
    first_name: z.string().min(1).max(50).optional(),
    last_name: z.string().min(1).max(50).optional(),
    role: z.enum(['admin', 'user', 'test_user']).optional(),
    expires_at: z.string().datetime().optional(),
  }),
});

// ✅ User Deletion Schema
export const UserDeletionSchema = z.object({
  user_id: z.string().uuid('Ungültige User ID'),
  confirmation: z.literal(true),
  reason: z.string().min(10, 'Grund muss mindestens 10 Zeichen haben').optional(),
});

// ✅ Admin Users List Response Schema
export const AdminUsersResponseSchema = z.object({
  users: z.array(
    z.object({
      id: z.string().uuid(),
      email: z.string().email(),
      first_name: z.string().nullable(),
      last_name: z.string().nullable(),
      role: z.enum(['admin', 'user', 'test_user']),
      created_at: z.string(),
      expires_at: z.string().nullable(),
    }),
  ),
  total_count: z.number().optional(),
  admin_count: z.number().optional(),
  test_user_count: z.number().optional(),
});

// ✅ Admin Error Schema
export const AdminErrorSchema = z.object({
  error: z.string(),
  details: z.any().optional(),
  admin_action: z.string().optional(),
  user_id: z.string().optional(),
});

// Type Exports für TypeScript
export type CreateTestUserV1 = z.infer<typeof CreateTestUserSchemaV1>;
export type CreateTestUserV2 = z.infer<typeof CreateTestUserSchemaV2>;
export type AdminAuth = z.infer<typeof AdminAuthSchema>;
export type UserProfileUpdate = z.infer<typeof UserProfileUpdateSchema>;
export type UserDeletion = z.infer<typeof UserDeletionSchema>;
export type AdminUsersResponse = z.infer<typeof AdminUsersResponseSchema>;
export type AdminError = z.infer<typeof AdminErrorSchema>;

// ✅ Validation Helper Functions
export const validateAdmin = {
  // Test User Creation (sichere Validation)
  createTestUserSafe: (data: unknown) => CreateTestUserSchemaV1.safeParse(data),

  // Test User Creation (strenge Validation)
  createTestUserStrict: (data: unknown) => CreateTestUserSchemaV2.safeParse(data),

  // Admin Authorization
  authorization: (headers: unknown) => AdminAuthSchema.safeParse(headers),

  // User Profile Updates
  profileUpdate: (data: unknown) => UserProfileUpdateSchema.safeParse(data),

  // User Deletion
  userDeletion: (data: unknown) => UserDeletionSchema.safeParse(data),

  // Users List Response
  usersResponse: (data: unknown) => AdminUsersResponseSchema.safeParse(data),
};

// ✅ Admin Security Constants
export const ADMIN_SECURITY = {
  MAX_TEST_USER_DURATION: 168, // 7 days in hours
  MIN_TEST_USER_DURATION: 1, // 1 hour
  REQUIRED_ADMIN_ROLE: 'admin',
  MAX_NAME_LENGTH: 100,
  MIN_NAME_LENGTH: 2,
} as const;
