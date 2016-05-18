$('.checkforname').submit(function(e){
	$('.alert').hide();
	if (!$('input[name="name"]').val()){
		if($('.alert').length){
			$('alert').show();
		} else {
			console.log($(this));
			$('.panel-body').append('<br /><div class="alert alert-danger">Please enter a name for this task</div>');
		}
		return false;
	}
})