const { z } = require('zod');

const registerSchema = z.object({
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
});

const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address')
        .trim()
        .toLowerCase(),
    password: z.string().min(1, 'Password is required'),
});

const refreshSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
});

module.exports = { registerSchema, loginSchema, refreshSchema };
