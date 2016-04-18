var $completed=$('.completed-box')

$completed.on('click',function(){
	//only submit on check, not un-check (eventually, un-check should do something too)
	if(this.checked){
		var parentForm = this.parentNode;
		parentForm.submit();
	}
})