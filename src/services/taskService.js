const prisma = require('../prisma/client')
const AppError = require('../utils/AppError')

async function getTasks(userId) {
  return prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

async function createTask(userId, { title }) {
  return prisma.task.create({
    data: {
      title,
      userId,
    },
  })
}

async function updateTask(userId, id, { title, completed }) {
  const existing = await prisma.task.findFirst({
    where: { id, userId },
  })

  if (!existing) {
    throw new AppError('Task not found', 404)
  }

  const data = {}
  if (title !== undefined) data.title = title
  if (completed !== undefined) data.completed = completed

  return prisma.task.update({
    where: { id },
    data,
  })
}

async function deleteTask(userId, id) {
  const existing = await prisma.task.findFirst({
    where: { id, userId },
  })

  if (!existing) {
    throw new AppError('Task not found', 404)
  }

  await prisma.task.delete({ where: { id } })
  return { deleted: true }
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
}

