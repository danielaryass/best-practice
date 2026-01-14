import { z } from 'zod'

export const createUserSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters'),
    email: z
      .string()
      .email('Invalid email address')
      .toLowerCase(),
    role: z.enum(['admin', 'user']),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .optional(),
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .optional(),
  role: z.enum(['admin', 'user']).optional(),
})

export const userFilterSchema = z.object({
  search: z.string().optional(),
  role: z.enum(['admin', 'user']).optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(10).max(100).default(10),
})
