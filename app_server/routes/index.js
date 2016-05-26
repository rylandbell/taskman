var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');

/* GET list of all tasks */
router.get('/', ctrlMain.list);
// router.get('/show-completed', ctrlMain.list);

/* GET task details page */
router.get('/details/:taskid', ctrlMain.details);

// GET login page
router.get('/login', ctrlMain.login);

// POST credentials from login page
router.post('/login', ctrlMain.submitCredentials)

// POST new task (from list view)
router.post('/create', ctrlMain.newTask);

// POST update completed task status from checkboxes (PUT in back-end)
router.post('/updatecompleted/', ctrlMain.updateCompleted);

// POST delete completed tasks (DELETE in back-end)
router.post('/deletecompleted/', ctrlMain.deleteCompleted);

// POST update task from details form (POST in browser, PUT in back-end)
router.post('/:taskid', ctrlMain.updateTask);

module.exports = router;
