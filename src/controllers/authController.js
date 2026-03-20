const asyncHandler = require('../utils/asyncHandler')
const {
  loginSchema,
  registerSchema,
} = require('../utils/validation')
const authService = require('../services/authService')

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = registerSchema.parse(req.body)
  const result = await authService.register({ name, email, password })
  res.status(201).json(result)
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body)
  const result = await authService.login({ email, password })
  res.status(200).json(result)
})

module.exports = {
  register,
  login,
}

