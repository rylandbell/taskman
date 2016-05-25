var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
	secret: process.env.JWT_SECRET,
	userProperty: 'payload',
	getToken: function (req){
		if(req.body.token){
			console.log("Attempting to use token= "+req.body.token)
			return req.body.token;
		} else {
			console.log("Couldn't find a cookie token");
			console.log(req.body.token);
			return null;
		}
	}
});

var ctrlTasks = require('../controllers/tasks');
var ctrlAuth = require('../controllers/authentication');

// routes for calls to tasks folder:
router.get('/tasks', auth, ctrlTasks.tasksList);
router.get('/tasks/:taskid', auth, ctrlTasks.tasksReadOne);
router.post('/tasks', auth, ctrlTasks.tasksCreate);
router.put('/tasks/:taskid', auth, ctrlTasks.tasksUpdateOne);
router.delete('/tasks/', auth, ctrlTasks.tasksDeleteCompleted);
// router.delete('/tasks/:taskid', auth, ctrlTasks.tasksDeleteOne);

// routes for authentication requests:
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;