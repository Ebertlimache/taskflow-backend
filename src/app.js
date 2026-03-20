require('dotenv').config()

const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const taskRoutes = require('./routes/taskRoutes')
const errorHandler = require('./middlewares/errorHandler')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  return res.status(200).json({ ok: true })
})

app.use('/auth', authRoutes)
app.use('/tasks', taskRoutes)

// Centralized error handling must be last.
app.use(errorHandler)

const port = process.env.PORT || 3000

if (require.main === module) {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`[TaskFlow] API listening on port ${port}`)
  })
}

module.exports = app

