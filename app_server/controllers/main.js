//setting up the request module to use appropriate URLs for API calls (use apiOptions.server variable)
var request = require('request');
var apiOptions = {
  server: 'http://localhost:3000'
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = 'https://immense-dusk-59566.herokuapp.com/';
}

// generate error message page in browser:
var _showError = function (req, res, statusCode){
  var title, content;
  if (statusCode===404){
    title= "404, content not found";
    content= "Wuh-oh, we can't find your page. Maybe try again?";
  } else {
    title= statusCode+" error";
    content= "Something's gone wrong with this request. I wonder what it could be...";
  }
  res.render('generic-text', {
    title: title,
    content: content
  })
}

//--------Instructions to handle HTTP calls-------:

/* GET task list page*/
var renderListView = function (req, res, responseBody, completedBool){ 
  var message;
  if(!(responseBody instanceof Array)){
    message = "API lookup error";
    responseBody = [];
  } else {
    if (responseBody.length===0) {
      message = "No tasks found.";
    }
  }
  res.render('list', {
    title: 'List View',
    tasks: responseBody,
    show_completed: completedBool,
    message: message
  });
};

module.exports.list = function(req, res, next) {
  var path = '/api/tasks';
  //get show_completed value from form, transform to Boolean
  var completedBool = Boolean(parseInt(req.query.show_completed));
  var requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {},
    //qs transmits values as a string, so sending the raw 0-or-1-as-string value of show_completed
    qs: {'show_completed': req.query.show_completed}
  };
  request(requestOptions, function (err, response, body){
    if(err){
      console.log('AN ERROR WAS RETURNED: '+err);
    } else if (response.statusCode !== 200){
       console.log ('I GOT AN UNEXPECTED RESPONSE CODE: '+response.statusCode);
    }
    //sends show_completed to render function, which displays correct buttons (Show vs Hide Completed):
    //renderListView has its own error handling, so I call it regardless:
    renderListView(req,res,body,completedBool);
  })
};
	
/* GET task details */
var renderDetailsView = function (req, res, body){
  var message;
  res.render('details', {
    title: 'Details View',
    task: body,
    message: message
  });
}

module.exports.details = function(req, res, next) {
  var path = '/api/tasks/'+req.params.taskid;
  var requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {},
    qs: {}
  };
  request(requestOptions, function (err, response, body){
    // get YYYY-MM-DD formatted dates from ISO format:
    if(response.statusCode===200){
      if(body.dateAdded){
        body.dateAdded = body.dateAdded.substring(0,10);
      }
      if(body.dateDue){
        body.dateDue = body.dateDue.substring(0,10);
      }
      renderDetailsView(req,res,body);
    } else {
      _showError(req, res, response.statusCode);
    }
  })
};

// POST new task from list view format
module.exports.newTask = function(req, res, next) {
  var path = '/api/tasks';
  var requestOptions = {
    url: apiOptions.server + path,
    method: "POST",
    json: {name: req.body.name},
    qs: {}
  };
  request(requestOptions, function (err, response, body){
    res.redirect('/');
  });
};

// POST call to update task info from Details View (PUT in API)
module.exports.updateTask = function(req, res, next){
  var path = '/api/tasks/'+req.params.taskid;
  var requestOptions = {
    url: apiOptions.server + path,
    method: "PUT",
    json: req.body,
    qs: {}
  };
    request(requestOptions, function (err, response, body){
      res.redirect('/details/'+req.params.taskid);
    });
}

// POST call to mark a task completed from List View (PUT in API)
module.exports.updateCompleted = function (req, res, next){
  var taskId = req.body.box_name;
  var path = '/api/tasks/'+taskId;
  var requestOptions = {
    url: apiOptions.server + path,
    method: "PUT",
    json: {'completed': true},
    qs: {}
  };
  request(requestOptions, function (err, response, body){
    res.redirect('/');
  });
};

// POST call to DELETE all completed tasks
module.exports.deleteCompleted = function (req, res, next){
  var path = '/api/tasks/';
  var requestOptions = {
    url: apiOptions.server + path,
    method: "DELETE",
    json: {},
    qs: {}
  };
    request(requestOptions, function (err, response, body){
      //Re-load list view:
      res.redirect('/');
    });
};