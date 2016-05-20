var $completed=$('.completed-box');
var $newtaskform = $('#newtaskform');


//Selecting .completed-box this way allows the listener to 'hear' clicks from dynamically added elements
$('table').on('click','.completed-box',function(){
	markComplete(this.value,this.checked);
})

$newtaskform.submit(function(e){
	e.preventDefault();
	var taskName = $('#newtask').val();
	addNew(taskName);
})

var markComplete = function (taskId, isChecked){
	var bodyString = 'box_name='+taskId+'&is_checked='+isChecked;

	var req = new XMLHttpRequest();
	req.open('POST','/updatecompleted/',true);
	req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	req.send(bodyString);

	$('html').addClass('waiting');
	req.addEventListener('load', function(){
		$('html').removeClass('waiting');
		var targetRow = $('#'+taskId);
		if(isChecked){
			if(document.getElementById('hide-completed')){
				targetRow.addClass('finished');
			} else {
				targetRow.fadeOut(500);
			}
		} else {
			targetRow.removeClass('finished');
		}
	});
};

var addNew = function (taskName){
	var newRowHtml1 = '<tr id="'
	var newRowHtml2 = '"><td><form action="/updatecompleted/" method="post" role="form"><input type="checkbox" name="box_name" value="'
	var newRowHtml3 = '" class="completed-box"></form></td><td>'
	var newRowHtml4 = '</td><td><a href="/details/'
	var newRowHtml5 = '"><div class="pull-right">View/Edit Details</div></a></td></tr>'
	var bodyString = 'name='+taskName;

	var req = new XMLHttpRequest();
	req.open('POST','/create',true);
	req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

	req.send(bodyString);
	req.addEventListener('load', function(){
		var newTaskId = JSON.parse(req.response).body._id;
		var newTaskName = JSON.parse(req.response).body.name;
		var $newRow = newRowHtml1+newTaskId+newRowHtml2+newTaskId+newRowHtml3+newTaskName+newRowHtml4+newTaskId+newRowHtml5;
		$newtaskform.parent().before($newRow);
		$completed=$('.completed-box');
		$('#newtask').val('').focus();
	});
}

