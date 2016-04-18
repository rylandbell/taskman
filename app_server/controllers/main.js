//setting up the request module to use appropriate URLs for API calls (use apiOptions.server variable)
var request = require('request');
var apiOptions = {
  server: 'http://localhost:3000'
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = 'https://immense-dusk-59566.herokuapp.com/';
}

//--------Instructions to handle HTTP calls-------:

/* GET task list page*/
var renderListView = function (req, res, body, completedBool){ 
    res.render('list', {
    title: 'List View',
    tasks: body,
    show_completed: completedBool
  });
};

module.exports.list = function(req, res, next) {
  var path = '/api/tasks';
  //get show_completed value from form, transform to Boolean
  var completedBool = Boolean(parseInt(req.query.show_completed));
  var requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    //sends show_completed to API, which returns more results
    json: {'show_completed': completedBool},
    qs: {}
  };
  request(requestOptions, function (err, response, body){
    //sends show_completed to render function, which displays correct buttons (Show vs Hide Completed)
    renderListView(req,res,body,completedBool);
  })
};
	
/* GET task details */
var renderDetailsView = function (req, res, body){
    res.render('details', {
    title: 'Details View',
    task: body
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
    body.dateAdded = body.dateAdded.substring(0,10);
    if(body.dateDue){
      body.dateDue = body.dateDue.substring(0,10);
    }
    renderDetailsView(req,res,body);
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