var goog = talkToGoogleApi();

//All communication with Google servers should be in this module:
function talkToGoogleApi(){
  var exports = {};
  // Your Client ID can be retrieved from your project in the Google
  // Developer Console, https://console.developers.google.com
  var CLIENT_ID = '634607653489-3duvkicl6nstmfktt3v0f1ecqbi34e54.apps.googleusercontent.com';
  var SCOPES = ["https://www.googleapis.com/auth/calendar"];

  // Ask server if app is authorized to modify calendar
  exports.checkAuth = function(immediate) {
    var context = this;
    gapi.auth.authorize(
      {
        'client_id': CLIENT_ID,
        'scope': SCOPES.join(' '),
        'immediate': immediate
      }, function(token){
        context.handleAuthResult.apply(context,[token]);
      });
  };

  // Handle response from authorization server
  exports.handleAuthResult = function(authResult) {
    if (authResult && !authResult.error) {
      this.loadCalendarApi();
      updateAuthDisplay(true);
    } else {
      updateAuthDisplay(false);
    }
  };

  //Load Google Calendar client library.
  exports.loadCalendarApi = function() {
    gapi.client.load('calendar', 'v3');
  };

  //Add event to calendar
  exports.addEvent = function(event){
    var request = gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': event
    });

    request.execute(function(event) {
      // appendPre('Event created: ' + event.htmlLink);
    });
  }

  return exports;
}

// All DOM manipulation and event listeners go here:
$('document').ready(function(){
  //Show appropriate UI elements, depending on authorized status
  function updateAuthDisplay(authorized){
    var authorizePanel = document.getElementById('auth-panel');
    var calPanel = document.getElementById('cal-panel');
    if (authorized) {
      authorizePanel.style.display = 'none';
      calPanel.style.display = 'block';
    } else {
      authorizePanel.style.display = 'block';
      calPanel.style.display = 'none';
    }
  }

  $('#cal-init').on('click',function(){
    goog.checkAuth(false);
  });

  $('#send-btn').on('click',function(e){
    e.preventDefault();
    // get info from form, assemble into event object:
    // var newEvent = 
    goog.addEvent(newEvent);
  });

  var sampleEvent = {
    'summary': 'Google I/O 2015',
    'description': 'A chance to hear more about Google\'s developer products.',
    'start': {
      'dateTime': '2016-05-28T09:00:00-07:00',
      'timeZone': 'America/Los_Angeles'
    },
    'end': {
      'dateTime': '2016-05-28T17:00:00-07:00',
      'timeZone': 'America/Los_Angeles'
    }
  };
});


