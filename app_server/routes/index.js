var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');

/* GET list of all tasks */
router.get('/', ctrlMain.list);

/* GET task details page */
router.get('/details/:taskid', ctrlMain.details);

// POST new task (from list view)
router.post('/', ctrlMain.newTask);

// POST update task (POST in browser, PUT in back-end	)
router.post('/:taskid', ctrlMain.updateTask);
// router.post('/checkedupdate', ctrlMain.updateChecks);

module.exports = router;
