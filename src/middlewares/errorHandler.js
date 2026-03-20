const { ZodError } = require('zod')

// Centralized error handler so controllers/services can throw.
module.exports = function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: err.errors.map((e) => e.message).join(', '),
    })
  }

  const statusCode = err.statusCode || err.status || 500
  const message = err.message || 'Internal server error'

  return res.status(statusCode).json({ message })
}

