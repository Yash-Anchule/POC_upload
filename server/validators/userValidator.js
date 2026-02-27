const { z } = require('zod');

const createUserSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .max(100, 'Name cannot exceed 100 characters')
        .trim(),
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address')
        .trim()
        .toLowerCase(),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(128, 'Password cannot exceed 128 characters'),
    role: z.enum(['admin', 'developer', 'viewer']).default('viewer'),
});

const updateUserSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .max(100, 'Name cannot exceed 100 characters')
        .trim()
        .optional(),
    email: z
        .string()
        .email('Invalid email address')
        .trim()
        .toLowerCase()
        .optional(),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(128, 'Password cannot exceed 128 characters')
        .optional(),
    role: z.enum(['admin', 'developer', 'viewer']).optional(),
});

module.exports = { createUserSchema, updateUserSchema };
