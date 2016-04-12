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
module.exports.tasksCreate = function (req, res) {
	sendJsonResponse(res, 200, {'status': 'success'});
};
module.exports.tasksUpdateOne = function (req, res) {
	sendJsonResponse(res, 200, {'status': 'success'});
};
module.exports.tasksDeleteOne = function (req, res) {
	sendJsonResponse(res, 200, {'status': 'success'});
};


