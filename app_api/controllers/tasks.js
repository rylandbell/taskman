var mongoose = require('mongoose');
var taskModel = mongoose.model('Task');

//helper function for composing responses as status codes (e.g. 404) with JSON files
var sendJsonResponse = function (res, status, content){
	res.status(status);
	res.json(content);
}


//Response functions for CDUD operations on tasks

/* GET list of tasks (no filtering/limits yet) */
module.exports.tasksList = function (req, res) {
	taskModel
	  .find()
	  .exec(function(err, task) {
	    if (err) {
	      console.log(err);
	      sendJsonResponse(res, 404, err);
	      return;
	    }
	    console.log(task);
	    sendJsonResponse(res, 200, task);
	  });
};

/* GET one task by taskid */
module.exports.tasksReadOne = function (req, res) {
	console.log('Finding task details', req.params);
	if (req.params && req.params.taskid) {
	  taskModel
	    .findById(req.params.taskid)
	    .exec(function(err, task) {
	      if (!task) {
	        sendJsonResponse(res, 404, {
	          "message": "taskid not found"
	        });
	        return;
	      } else if (err) {
	        console.log(err);
	        sendJsonResponse(res, 404, err);
	        return;
	      }
	      console.log(task);
	      sendJsonResponse(res, 200, task);
	    });
	} else {
	  console.log('No taskid specified');
	  sendJsonResponse(res, 404, {
	    "message": "No taskid in request"
	  });
	}
};

/* POST a new task */
module.exports.tasksCreate = function (req, res) {
	console.log(req.body);
	taskModel.create({
	  name: req.body.name,
	  flagged: req.body.flagged,
	  details: req.body.details,
	  dateDue: req.body.dateDue,
	  completed: req.body.completed
	}, function(err, task) {
	  if (err) {
	    console.log(err);
	    sendJsonResponse(res, 400, err);
	  } else {
	    console.log(task);
	    sendJsonResponse(res, 201, task);
	  }
	});
};

// PUT update one task
module.exports.tasksUpdateOne = function (req, res) {
	if (!req.params.taskid) {
	  sendJsonResponse(res, 404, {
	    "message": "Not found, taskid is required"
	  });
	  return;
	}
	taskModel
	  .findById(req.params.taskid)
	  .exec(
	    function(err, task) {
	      if (!task) {
	        sendJsonResponse(res, 404, {
	          "message": "taskid not found"
	        });
	        return;
	      } else if (err) {
	        sendJsonResponse(res, 400, err);
	        return;
	      }
	      for (key in req.body){
	      	task[key] = req.body[key];
	      	// console.log('Key: '+key);
	      	// console.log('Old value: '+task[key]);
	      	// console.log('New Value: '+req.body[key]);
	      }
	      // task.name = req.body.name;
	      // task.flagged = req.body.flagged;
	      // task.details = req.body.details;
	      // task.dateDue = req.body.dateDue;
	      task.save(function(err, task) {
	        if (err) {
	          sendJsonResponse(res, 404, err);
	        } else {
	          sendJsonResponse(res, 200, task);
	        }
	      });
	    }
	);
};

// DELETE one task
module.exports.tasksDeleteOne = function (req, res) {
	var taskid = req.params.taskid;
	if (taskid) {
	  taskModel
	    .findByIdAndRemove(taskid)
	    .exec(
	      function(err, task) {
	        if (err) {
	          sendJsonResponse(res, 404, err);
	          return;
	        }
	        console.log("Task id " + taskid + " deleted");
	        sendJsonResponse(res, 204, null);
	      }
	  );
	} else {
	  sendJsonResponse(res, 404, {
	    "message": "No taskid"
	  });
	}
};


