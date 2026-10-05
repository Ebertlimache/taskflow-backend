const { ZodError } = require('zod')

// Centralized error handler so controllers/services can throw.
module.exports = function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }

  if (err instanceof ZodError) {
    // Zod 4 exposes issues on `.issues` (`.errors` is undefined).
    const issues = err.issues ?? err.errors ?? []
    const message = issues
      .map((e) => e.message)
      .filter(Boolean)
      .join(', ')

    return res.status(400).json({
      message: message || 'Validation failed',
    })
  }

  const statusCode = err.statusCode || err.status || 500
  const message = err.message || 'Internal server error'

  return res.status(statusCode).json({ message })
}

