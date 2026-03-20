const router = require('express').Router()
const authMiddleware = require('../middlewares/authMiddleware')
const taskController = require('../controllers/taskController')

router.use(authMiddleware)

router.get('/', taskController.getTasks)
router.post('/', taskController.createTask)
router.put('/:id', taskController.updateTask)
router.delete('/:id', taskController.deleteTask)

module.exports = router

