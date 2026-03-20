const asyncHandler = require('../utils/asyncHandler')
const {
  createTaskSchema,
  taskIdSchema,
  updateTaskSchema,
} = require('../utils/validation')
const taskService = require('../services/taskService')

const getTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getTasks(req.userId)
  return res.status(200).json(tasks)
})

const createTask = asyncHandler(async (req, res) => {
  const { title } = createTaskSchema.parse(req.body)
  const task = await taskService.createTask(req.userId, { title })
  return res.status(201).json(task)
})

const updateTask = asyncHandler(async (req, res) => {
  const { id } = taskIdSchema.parse(req.params)
  const payload = updateTaskSchema.parse(req.body)
  const updated = await taskService.updateTask(req.userId, id, payload)
  return res.status(200).json(updated)
})

const deleteTask = asyncHandler(async (req, res) => {
  const { id } = taskIdSchema.parse(req.params)
  await taskService.deleteTask(req.userId, id)
  return res.status(200).json({ deleted: true })
})

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
}

