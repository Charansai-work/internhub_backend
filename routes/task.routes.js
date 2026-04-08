const express = require('express');
const router = express.Router();
const {
  createTask,
  getMyTasks,
  getAdminTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/task.controller');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin'), createTask);
router.get('/my', protect, authorize('student'), getMyTasks);
router.get('/admin', protect, authorize('admin'), getAdminTasks);
router.put('/:id', protect, authorize('admin'), updateTask);
router.put('/:id/status', protect, authorize('student'), updateTaskStatus);
router.delete('/:id', protect, authorize('admin'), deleteTask);

module.exports = router;
