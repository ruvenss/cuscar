function analise_data(data) {
	if (data.length>0) {
		console.log("Data lenght: "+ data.length);
	} else {
		error_front_end(1);
	}
}
function error_front_end(code) {
	console.log("Logical Error Detected: code "+code);
	if (code==1) {
		window.alert("Please paste some manifest data first");
	}
}