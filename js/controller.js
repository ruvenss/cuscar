function analise_data(data) {
	if (data.length>0) {
		console.log("Data lenght: "+ data.length);
		manifest_arrrows=data.split("\n");
		console.log("Rows : "+ manifest_arrrows.length);
		if (manifest_arrrows.length>0) {

		} else {
			error_front_end(2);
		}
	} else {
		error_front_end(1);
	}
}
function error_front_end(code) {
	var dialog = document.querySelector('#dialog1');
	var errmsg="Error";
	console.log("Logical Error Detected: code "+code);
	if (code==1) { errmsg="Please paste some manifest data first"; }
	if (code==2) { errmsg="Insufficient number of rows in the manifest"; }
	dialog.showModal();
	$("#msgtext").text(errmsg);
}