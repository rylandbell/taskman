var mongoose = require('mongoose');
var taskModel = mongoose.model('Task');
var userModel = mongoose.model('User');

//helper function for composing responses as status codes (e.g. 404) with JSON files
var sendJsonResponse = function (res, status, content){
	res.status(status);
	res.json(content);
}

//helper function for getting author data from JWT
var getAuthorId = function(req, res, callback) {
  console.log("Finding author with database ID " + req.payload._id);
  if (req.payload._id) {
    userModel
      .findOne({ _id : req.payload._id })
      .exec(function(err, user) {
        if (!user) {
          sendJSONresponse(res, 404, {
            "message": "User not found"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }
        console.log(user);
        callback(req, res, user._id);
      });

  } else {
    sendJSONresponse(res, 404, {
      "message": "User not found"
    });
    return;
  }

};

//Response functions for CRUD operations on tasks

/* GET list of tasks (optionally filters completed tasks) */
module.exports.tasksList = function (req, res) {
	getAuthorId(req, res, function (req, res, userId) {
	  	//query.show_completed is 0 or 1 as a string, so convert to Boolean:
	  	var completedBool = Boolean(parseInt(req.query.show_completed));
	  	//Unless told to show completed tasks, only return items with a completed value of false:
		var filter={ownerId: userId};
		if(!completedBool){
			filter.completed=false;
		}

		taskModel
		  .find(filter)
		  .exec(function(err, task) {
		    if (err) {
		      console.log(err);
		      sendJsonResponse(res, 404, err);
		      return;
		    }
		    sendJsonResponse(res, 200, task, userId);
		  });
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
	getAuthorId(req, res, function (req, res, userId) {
		taskModel.create({
		  name: req.body.name,
		  flagged: req.body.flagged,
		  details: req.body.details,
		  dateDue: req.body.dateDue,
		  completed: req.body.completed,
		  ownerId: userId
		}, function(err, task) {
		  if (err) {
		    console.log(err);
		    sendJsonResponse(res, 400, err);
		  } else {
		    console.log(task);
		    sendJsonResponse(res, 201, task);
		  }
		});
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
		  }
	      task.save(function(err, task) {
	        if (err) {
	          sendJsonResponse(res, 400, err);
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

// DELETE all tasks marked completed
module.exports.tasksDeleteCompleted = function (req, res) {
	var filter={
		'completed': true
		}
	taskModel
	  .find(filter)
	  .remove(function(err) {
	    if (err) {
	      console.log(err);
	      sendJsonResponse(res, 404, err);
	      return;
	    }
	    sendJsonResponse(res, 204, null);
	  });
};
