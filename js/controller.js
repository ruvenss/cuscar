function export_data(arr_rows) {
	if (arr_rows.length>0) {
		console.log("Export for : "+ arr_rows.length + " Rows Has begun...");
		
	}
}
function analise_data(data) {
	if (data.length>0) {
		console.log("Data lenght: "+ data.length);
		manifest_arrrows=data.split("\n");
		console.log("Rows : "+ manifest_arrrows.length);
		if (manifest_arrrows.length>1) {
			/* Manifest analisys by number of columns */
			manifest_arrcols=manifest_arrrows[0].split("\t");
			console.log("Columns : "+ manifest_arrcols.length);
			if (manifest_arrcols.length==21) {
				/* Manifest TYPE PROTEUS */
				console.log("Manifest type : PROTEUS");
				return(true);
			}
		} else {
			error_front_end(2);
			return(false);
		}
	} else {
		error_front_end(1);
		return(false);
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