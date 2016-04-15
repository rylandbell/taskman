// Handles date format conversion to YYYY-MM-DD
function simplifyDate(date){
  var year = date.getYear()+1900;
  var month = date.getMonth()+1;
  var day = date.getDate();
  if (month<10){
  	month='0'+month;
  }
  if (day<10){
  	day='0'+month;
  }
  var outputDate = year+'-'+month+'-'+day;
  return outputDate;
}

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
var renderListView = function (req, res, body){
  res.render('list', {
    title: 'List View',
    tasks: body
  });
};

module.exports.list = function(req, res, next) {
  var path = '/api/tasks';
  var requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {},
    qs: {}
  };
  request(requestOptions, function (err, response, body){
    renderListView(req,res,body);
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

// PUT update task info (checkbox only for now)
module.exports.updateTask = function(req, res, next){
  var path = '/api/tasks/'+req.params.taskid;
  var requestOptions = {
    url: apiOptions.server + path,
    method: "PUT",
    json: req.body,
    qs: {}
  };
    request(requestOptions, function (err, response, body){
      res.redirect('/');
    });

}

