const jwt = require('jsonwebtoken')
const AppError = require('../utils/AppError')

module.exports = function authMiddleware(req, res, next) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return next(new AppError('Missing or invalid Authorization header', 401))
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const userId = payload.userId || payload.sub

    if (!userId) {
      return next(new AppError('Invalid token payload', 401))
    }

    req.userId = userId
    return next()
  } catch (err) {
    return next(new AppError('Invalid or expired token', 401))
  }
}

