const { z } = require('zod')

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(200),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(200),
})

const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
})

const updateTaskSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    completed: z.boolean().optional(),
  })
  .refine((data) => data.title !== undefined || data.completed !== undefined, {
    message: 'Provide at least one field to update: title or completed',
  })

const taskIdSchema = z.object({
  id: z.string().uuid(),
})

module.exports = {
  registerSchema,
  loginSchema,
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
}

