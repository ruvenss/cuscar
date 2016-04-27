window.addEventListener("load", function(e) {
	var dialog = document.querySelector('#dialog1');
	document.querySelector('#close').addEventListener("click", function(evt) {
	  	dialog.close("thanks!");
	});
});