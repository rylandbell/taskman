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
    $('#auth-waiting').hide();
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
    var formDataObject = {}; 
    var newEvent = {};
    var $form = $('#calendar-form');
    var formDataArray = $form.serializeArray();
    for (var i = 0; i<formDataArray.length; i++){
      formDataObject[formDataArray[i].name]=formDataArray[i].value;
    }

    // Translate the form data into the event format to be sent to Google
    newEvent.summary = formDataObject.name;
    newEvent.start = {
      timeZone: 'America/Los_Angeles',
      dateTime: setTimes(formDataObject,0) 
    };
    newEvent.end = {
      timeZone: 'America/Los_Angeles',
      dateTime: setTimes(formDataObject,parseInt(formDataObject.duration))
    };
    function setTimes(formDate,duration){
      if(parseInt(formDate.hour)===12){
        formDate.hour=0;
      }
      if(Modernizr.inputtypes.date){
        var year = formDate.date.slice(0,4);
        var month = formDate.date.slice(5,7)-1;
        var date = formDate.date.slice(8,10);
      } else {
        var year = formDate.year;
        var month = formDate.month-1;
        var date = formDate.datenumber;
      }
      var targetTime = new Date(year,month,date,formDate.hour,formDate.min);
      if(formDate['am-pm']==='pm'){
        targetTime.setHours(targetTime.getHours()+12);
      };
      targetTime.setMinutes(targetTime.getMinutes()+duration);
      return targetTime.toISOString();
    }
    return newEvent;
  }

  function successfulAdd(e){
    $('.add-view').hide();
    $('.success-view').show();
    $('#event-link').attr('href',e.htmlLink);
  }

  function failedAdd(e){
    $('#fail-message').removeClass('invisible');
    $('#error-message').text('\"'+e.message+'\"');
    console.log(e);
  }

  //check authorization when user initiates calendar add process
  $('#cal-init').on('click',function(){
    $('#auth-waiting').show();
    goog.checkAuth(true);
  });

  $('#auth-init').on('click',function(){
    goog.checkAuth(false);
  });

  //send data to google calendar when user submits calendar form
  $('#send-btn').on('click',function(e){
    $('#fail-message').addClass('invisible');
    e.preventDefault();   
    var myEvent = prepEventObject();
    goog.addEvent(myEvent, successfulAdd, failedAdd);
  });

  //mark task completed at user request
  $('#mark-completed').on('click',function(){
    $('#completed').prop('checked',true);
    $('#gotolist').prop('checked',true);
    $('#update-form').submit();
  })
});


