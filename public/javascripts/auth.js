$(document).ready(function(){
	$('#logout').click(function(e){
		e.preventDefault();
		document.cookie="token" + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		window.location.replace('/login');
	});

});