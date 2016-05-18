$('document').ready(function(){
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
    exports.addEvent = function(event,successCallback,failureCallback){
      var request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event
      });
      request.execute(function(e) {
        if(e && e.status==='confirmed'){
          successCallback(e);
        } else {
          failureCallback(e);
        }
      });
    };
    return exports;
  }

  //Show appropriate UI elements, depending on authorized status
  function updateAuthDisplay(authorized){
    if (authorized) {
      $('.auth-view').hide();
      $('.add-view').show();
    } else {
      $('.auth-view').show();
      $('.add-view').hide();
    }
  }

  function prepEventObject(){
    // Build a data object from the event form:
    var formDataObject = {}, newEvent = {};
    var $form = $('#calendar-form');
    var formDataArray = $form.serializeArray();
    for (var i = 0; i<formDataArray.length; i++){
      formDataObject[formDataArray[i].name]=formDataArray[i].value;
    }

    // Translate the form data into the event format to be sent to Google
    newEvent.summary = formDataObject.name;
    newEvent.start = {
      timeZone: 'America/Los_Angeles',
      dateTime: setTimes(formDataObject.date,0) 
    };
    newEvent.end = {
      timeZone: 'America/Los_Angeles',
      dateTime: setTimes(formDataObject.date,formDataObject.duration)
    };
    function setTimes(date,duration){
      var targetTime = new Date(date);
      targetTime.setMinutes(targetTime.getMinutes()+duration);
      return targetTime.toISOString();
    }
    return newEvent;
  }

  function successfulAdd(e){
    console.log('holla back? '+e.htmlLink);
    console.log(e);
    $('.add-view').hide();
    $('.success-view').show();
    $('#event-link').attr('href',e.htmlLink);
  }

  function failedAdd(e){
    console.log('failure?');
    console.log(e);
  }

  //check authorization when user initiates calendar add process
  $('#cal-init').on('click',function(){
    goog.checkAuth(true);
  });

  $('#auth-init').on('click',function(){
    goog.checkAuth(false);
  });

  //send data to google calendar when user submits calendar form
  $('#send-btn').on('click',function(e){
    e.preventDefault();   
    var myEvent = prepEventObject();
    goog.addEvent(myEvent, successfulAdd, failedAdd);
  });

  //mark task completed at user request
  $('#mark-completed').on('click',function(){
    $('#completed').prop('checked',true);
  })
});


