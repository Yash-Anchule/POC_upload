const { z } = require('zod');

const createPocSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(200, 'Title cannot exceed 200 characters')
        .trim(),
    description: z
        .string()
        .min(1, 'Description is required')
        .max(5000, 'Description cannot exceed 5000 characters'),
    techStack: z.array(z.string().trim()).default([]),
    demoLink: z.string().url('Invalid demo URL').or(z.literal('')).default(''),
    repoLink: z.string().url('Invalid repo URL').or(z.literal('')).default(''),
    status: z.enum(['draft', 'published']).default('draft'),
});

const updatePocSchema = createPocSchema.partial();

module.exports = { createPocSchema, updatePocSchema };
