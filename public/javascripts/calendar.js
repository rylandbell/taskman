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
    var newEvent = {};

    // Build a data object from the event form:
    var formDataObject = {}; 
    var $form = $('#calendar-form');
    var formDataArray = $form.serializeArray();
    for (var i = 0; i<formDataArray.length; i++){
      formDataObject[formDataArray[i].name]=formDataArray[i].value;
    }

    // Translate the form data into the event format to be sent to Google
    newEvent.summary = formDataObject.name;
    newEvent.description = formDataObject.description;
    newEvent.start = {
      timeZone: 'America/Los_Angeles',
      dateTime: setTimes(formDataObject,0) 
    };
    newEvent.end = {
      timeZone: 'America/Los_Angeles',
      dateTime: setTimes(formDataObject,parseInt(formDataObject.duration))
    };

    // Translates form time data into date object, then ISO string:
    function setTimes(formDate,duration){
      var year, month, date;
      if(parseInt(formDate.hour)===12){
        formDate.hour=0;
      }
      if(Modernizr.inputtypes.date){
        year = formDate.date.slice(0,4);
        month = formDate.date.slice(5,7)-1;
        date = formDate.date.slice(8,10);
      } else {
        year = formDate.year;
        month = formDate.month-1;
        date = formDate.datenumber;
      }
      var targetTime = new Date(year,month,date,formDate.hour,formDate.min);
      if(formDate['am-pm']==='pm'){
        targetTime.setHours(targetTime.getHours()+12);
      }
      targetTime.setMinutes(targetTime.getMinutes()+duration);
      return targetTime.toISOString();
    }
    return newEvent;
  }

  //callbacks for goog.addEvent:
  function successfulAdd(e){
    $('.add-view').hide();
    $('.success-view').show();
    $('#event-link').attr('href',e.htmlLink);
  }

  function failedAdd(e){
    $('#fail-message').removeClass('invisible');
    $('#error-message').text('\"'+e.message+'\"');
  }

  //check authorization when user initiates calendar add process
  $('#cal-init').on('click',function(){
    $('#auth-waiting').show();
    goog.checkAuth(true);
  });

  //send-to-google modal should reflect adds/updates to due date elsewhere on the page
  $('#due-date-picker').on('change', function(){
    var dueDate = $(this).val();
    $('#event-date').val(dueDate);
  });

  $('#due-date-polyfill').on('change', function(){
    $('#event-month').val($('#due-month').val());
    $('#event-date-number').val($('#due-date-number').val());
    $('#event-year').val($('#due-year').val());
  });

  //take an unauthorized user to the Google auth page
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

  //mark task completed after sending to Google, at user request
  $('#mark-completed').on('click',function(){
    $('#completed').prop('checked',true);
    $('#gotolist').prop('checked',true);
    $('#update-form').submit();
  });

  //~~~~~~~~~~~~Polyfill for datepicker input:~~~~~~~~~~~~~
  if(Modernizr.inputtypes.date){
    $('.datepicker-yes').show();
  } else {
    $('.datepicker-no').show();
    $('#update-form').on('submit',function(e){
      e.preventDefault();
      var month=this.month.value;
      var datenumber=this.datenumber.value;
      var year=this.year.value;
      var fullDate = year+'-'+month+'-'+datenumber;
      this.dateDue.value = fullDate;
      this.submit();
    });
    $('.datepicker-no input').on('click',function(){
      this.select();
    });
  }
  //Disallow invalid date inputs, like February 31
  function updateMaxDate(month){
    var maxDates = [null,31,28,31,30,31,30,31,31,30,31,30,31];
    $('.date-number').each(function(){
      $(this).attr('max',maxDates[month]);
      if($(this).val()>maxDates[month]){
        $(this).val(maxDates[month]);
      }
    });
  }

  $('.month-picker').on('change',function(){
    updateMaxDate(this.value);
  });
});


