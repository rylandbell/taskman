$('document').ready(function () {

  //~~~~~Handle data submission from list view via Ajax:~~~~~~
  var myAjax = listViewAjax();
  function listViewAjax() {
    var exports = {};
    var $newtaskform = $('#newtaskform');
    var $completed = $('.completed-box');

    exports.addNew = function (taskName) {
      if (!checkForTaskName()) {
        return;
      }

      var newRowHtml1 = '<tr id="';
      var newRowHtml2 = '" class="table-link"><td><form action="/updatecompleted/" method="post" role="form"><input type="checkbox" name="box_name" value="';
      var newRowHtml3 = '" class="completed-box"></form></td><td>';
      var newRowHtml4 = '</td><td><a href="/details/';
      var newRowHtml5 = '"><div class="pull-right"></div></a></td></tr>';
      var bodyString = 'name=' + taskName;

      var req = new XMLHttpRequest();
      req.open('POST', '/create', true);
      req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      req.send(bodyString);

      $('html').addClass('waiting');
      req.addEventListener('load', function () {
        $('html').removeClass('waiting');
        var newTaskId = JSON.parse(req.response).body._id;
        var newTaskName = JSON.parse(req.response).body.name;
        var $newRow = newRowHtml1 + newTaskId + newRowHtml2 + newTaskId + newRowHtml3 + newTaskName + newRowHtml4 + newTaskId + newRowHtml5;
        $newtaskform.parent().before($newRow);
        $completed = $('.completed-box');
        $('#newtask').val('').focus();
      });
    };

    exports.markComplete = function (taskId, isChecked) {
      var bodyString = 'box_name=' + taskId + '&is_checked=' + isChecked;

      var req = new XMLHttpRequest();
      req.open('POST', '/updatecompleted/', true);
      req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      req.send(bodyString);

      $('html').addClass('waiting');
      req.addEventListener('load', function () {
        $('html').removeClass('waiting');
        var $targetRow = $('#' + taskId);
        if (isChecked) {
          if (document.getElementById('hide-completed')) {
            $targetRow.addClass('finished');
          } else {
            $targetRow.fadeOut(500);
          }
        } else {
          $targetRow.removeClass('finished');
        }
      });
    };

    function checkForTaskName() {
      $('.alert').hide();
      if (!$('input[name="name"]').val()) {
        $('html').removeClass('waiting');
        if ($('.alert').length) {
          $('alert').show();
        } else {
          $('.panel-body').append('<br /><div class="alert alert-danger">Please enter a name for this task</div>');
        }

        return false;
      }

      return true;
    }

    return exports;
  }

  //~~~~~~~Event handlers:~~~~~~
  $('#newtaskform').submit(function (e) {
    e.preventDefault();
    var taskName = $('#newtask').val();
    myAjax.addNew(taskName);
  });

  $('table').on('click', '.table-link', function (e) {
    var taskId = $(this).attr('id');
    window.document.location = '/details/' + taskId;
  });

  //Selecting .completed-box this way allows the listener to 'hear' clicks from dynamically added elements
  $('table').on('click', '.completed-box', function (e) {
    myAjax.markComplete(this.value, this.checked);
    e.stopPropagation();
  });

});
