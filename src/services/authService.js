const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const prisma = require('../prisma/client')
const AppError = require('../utils/AppError')

function signToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new AppError('JWT_SECRET is not configured', 500)
  }

  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  }
}

async function register({ name, email, password }) {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw new AppError('Email is already registered', 409)
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
    },
  })

  const token = signToken(user.id)
  return { token, user: toPublicUser(user) }
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw new AppError('Invalid email or password', 401)
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    throw new AppError('Invalid email or password', 401)
  }

  const token = signToken(user.id)
  return { token, user: toPublicUser(user) }
}

module.exports = {
  register,
  login,
}

