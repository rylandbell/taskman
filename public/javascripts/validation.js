$(document).ready(function(){
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

	//Date picker polyfill (uses three number inputs instead of a date input)
	if(Modernizr.inputtypes.date){
		$('.datepicker-no').hide();
	} else {
		$('.datepicker-yes').hide();
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
		})
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
	
})