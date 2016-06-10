//setting up the request module to use appropriate URLs for API calls (use apiOptions.server variable)
var request = require('request');
var apiOptions = {
  server: 'http://localhost:3000'
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = 'https://immense-dusk-59566.herokuapp.com';
}

// generate error page in browser:
var _showError = function (req, res, apiResponse) {
  var title;
  var content;
  if (apiResponse.statusCode === 404) {
    title = '404, content not found';
    content = 'Wuh-oh, we can\'t find your page. Maybe try again?';
  } else if (apiResponse.statusCode === 401) {
    title = '401, Authorization Error';
    content = 'You are not authorized to access that page.';
  } else {
    title = apiResponse.statusCode + ' error';
    content = 'Something\'s gone wrong with this request. I wonder what it could be...';
  }

  res.render('generic-text', {
    message: apiResponse.body.message,
    title: title,
    content: content
  });
};

//--------Instructions to handle HTTP calls-------:

/* GET task list page*/
var renderListView = function (req, res, responseBody, completedBool) {
  var message;
  var userName;
  if (responseBody.owner) {
    userName = responseBody.owner.name;
  }

  if (!(responseBody.tasks instanceof Array)) {
    message = 'API lookup error';
    responseBody = [];
  } else {
    if (responseBody.tasks.length === 0) {
      message = 'No tasks found.';
    }
  }

  res.render('list', {
    title: 'List View',
    tasks: responseBody.tasks,
    show_completed: completedBool,
    message: message,
    error: req.query.err,
    userName: userName
  });
};

module.exports.list = function (req, res, next) {
  var path = '/api/tasks';

  //get show_completed value from form, transform to Boolean
  var completedBool = Boolean(parseInt(req.query.show_completed));
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: req.cookies,

    //qs transmits values as a string, so sending the raw 0-or-1-as-string value of show_completed
    qs: { show_completed: req.query.show_completed }
  };
  request(requestOptions, function (err, apiResponse, body) {
    if (body.message) {
      console.log('message= ' + body.message);
      res.redirect('/login');
    }

    //sends show_completed to render function, which displays correct buttons (Show vs Hide Completed):
    //renderListView has its own error handling, so I call it regardless:
    renderListView(req, res, body, completedBool);
  });
};

/* GET task details */
var renderDetailsView = function (req, res, body) {
  var userName;
  if (body.owner) {
    userName = body.owner.name;
  }

  body.task.dateAdded = body.task.dateAdded.substring(0, 10);
  if (body.task.dateDue) {
    body.task.dateDue = body.task.dateDue.substring(0, 10);
  }

  var message;
  res.render('details', {
    title: 'Details View',
    task: body.task,
    message: message,
    error: req.query.err,
    userName: userName
  });
};

module.exports.details = function (req, res, next) {
  var path = '/api/tasks/' + req.params.taskid;
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: req.cookies,
    qs: {}
  };
  request(requestOptions, function (err, apiResponse, body) {

    // get YYYY-MM-DD formatted dates from ISO format:
    console.log('MESSAGE: ' + apiResponse.body.message);
    if (apiResponse.statusCode === 200) {
      if (body.dateAdded) {
        body.dateAdded = body.dateAdded.substring(0, 10);
      }

      if (body.dateDue) {
        body.dateDue = body.dateDue.substring(0, 10);
      }

      renderDetailsView(req, res, body);
    } else {
      _showError(req, res, apiResponse);
    }
  });
};

// POST new task from list view
module.exports.newTask = function (req, res, next) {
  var apiRequestBody = req.cookies;
  apiRequestBody.name = req.body.name;
  var path = '/api/tasks';
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'POST',
    json: apiRequestBody,
    qs: {}
  };
  if (!req.body.name) {
    res.redirect('/?err=validation');
  } else {
    request(requestOptions, function (err, apiResponse, body) {
      if (apiResponse.statusCode === 400) {
        res.redirect('/?err=validation');
      } else if (apiResponse.statusCode === 201) {

        //use this for Ajax calls:
        res.send(apiResponse);

        //use this to reload page with new task added:
        //res.redirect('/');
      } else {
        _showError(req, res, apiResponse);
      }
    });
  }
};

// POST call to update task info from Details View (PUT in API)
module.exports.updateTask = function (req, res, next) {
  var apiRequestBody = req.body;
  apiRequestBody.token = req.cookies.token;
  var path = '/api/tasks/' + req.params.taskid;
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'PUT',
    json: apiRequestBody,
    qs: {}
  };
  if (!req.body.name) {
    res.redirect('/details/' + req.params.taskid + '?err=validation');
  } else {
    request(requestOptions, function (err, apiResponse, body) {
      if (apiResponse.statusCode === 400 && body.name === 'ValidationError') {
        res.redirect('/details/' + req.params.taskid + '?err=validation');
      } else if (apiResponse.statusCode === 200) {
        if (req.body.gotolist) {
          res.redirect('/');
        } else {
          res.redirect('/details/' + req.params.taskid);
        }
      } else {
        _showError(req, res, apiResponse);
      }
    });
  }
};

// POST call to mark a task completed from List View (PUT in API)
module.exports.updateCompleted = function (req, res, next) {
  var taskId = req.body.box_name;
  var isChecked = req.body.is_checked;
  var path = '/api/tasks/' + taskId;
  var apiRequestBody = req.cookies;
  apiRequestBody.completed = isChecked;
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'PUT',
    json: apiRequestBody,
    qs: {}
  };
  request(requestOptions, function (err, apiResponse, body) {
    if (apiResponse.statusCode === 200) {
      res.redirect('/');
    } else {
      _showError(req, res, apiResponse);
    }
  });
};

// POST call to DELETE all completed tasks
module.exports.deleteCompleted = function (req, res, next) {
  var path = '/api/tasks';
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'DELETE',
    json: req.cookies,
    qs: {}
  };
  request(requestOptions, function (err, apiResponse, body) {
    if (apiResponse.statusCode === 204) {
      res.redirect('/');
    } else {
      _showError(req, res, apiResponse);
    }
  });
};

// GET login page
var renderLoginView = function (req, res, body) {
  var message;
  if (body) {
    message = body.message;
  }

  res
    .clearCookie('token')
    .render('login', {
      title: 'Login Page',
      message: message
    });
};

module.exports.login = function (req, res, next) {
  renderLoginView(req, res);
};

// POST credentials from login page
module.exports.submitCredentials = function (req, res, next) {
  var path = '/api/login';
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'POST',
    json: req.body,
    qs: {}
  };
  request(requestOptions, function (err, apiResponse, body) {
    var cookieOptions = {};
    cookieOptions.maxAge = 1000 * 3600 * 24 * 7;
    if (apiResponse.statusCode === 200) {
      res.cookie('token', apiResponse.body.token, cookieOptions);
      res.redirect('/');
    } else if (apiResponse.statusCode === 400 || apiResponse.statusCode === 401) {
      renderLoginView(req, res, apiResponse.body);
    } else {
      _showError(req, res, apiResponse);
    }
  });
};

// POST register new user
module.exports.registerNew = function (req, res, next) {
  var path = '/api/register';
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'POST',
    json: req.body,
    qs: {}
  };
  request(requestOptions, function (err, apiResponse, body) {
    var cookieOptions = {};
    cookieOptions.maxAge = 1000 * 3600 * 24;
    if (apiResponse.statusCode === 200) {
      res.cookie('token', apiResponse.body.token, cookieOptions);
      res.redirect('/');
    } else if (apiResponse.statusCode === 400 || apiResponse.statusCode === 401) {
      renderLoginView(req, res, apiResponse.body);
    } else {
      _showError(req, res, apiResponse);
    }
  });
};
