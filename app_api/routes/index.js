var express = require('express');
var router = express.Router();
var ctrlTasks = require('../controllers/tasks');

// routes for calls to tasks folder:
router.get('/tasks', ctrlTasks.tasksList);
router.get('/tasks/:taskid', ctrlTasks.tasksReadOne);
router.post('/tasks', ctrlTasks.tasksCreate);
router.put('/tasks/:taskid', ctrlTasks.tasksUpdateOne);
router.delete('/tasks/', ctrlTasks.tasksDeleteCompleted);
router.delete('/tasks/:taskid', ctrlTasks.tasksDeleteOne);

module.exports = router;