function export_data(arr_rows) {
	var dialog = document.querySelector('#dialog2');
	dialog.showModal();
	if (arr_rows.length>0) {
		console.log("Export for : "+ arr_rows.length + " Rows Has begun...");
		for (var i = arr_rows.length - 1; i >= 0; i--) {
			var current_row = arr_rows[i];
			manifest_arrcols=current_row.split("\t");
			if (manifest_arrcols.length>=21) {
				/* Skip rows */
				var bookingid=manifest_arrcols[0];
				if (bookingid>0) {
					console.log("Exporting booking id ["+bookingid+"]");
					var blnumber=manifest_arrcols[1];
					var pod=manifest_arrcols[2];
					var onblnumber=manifest_arrcols[3];
					var shipper=manifest_arrcols[5];
					var consignee_address=manifest_arrcols[6];
					var consignee=manifest_arrcols[7];
					var transit=manifest_arrcols[8];
					var notify=manifest_arrcols[9];
					var condition=manifest_arrcols[10];
					var goods=manifest_arrcols[11];
					var vin=manifest_arrcols[12];
					var category=manifest_arrcols[13];
					var blinstructions=manifest_arrcols[14];
					var weight=manifest_arrcols[15];
					var volume=manifest_arrcols[16];
					var goods_length=manifest_arrcols[17];
					var goods_width=manifest_arrcols[18];
					var goods_height=manifest_arrcols[19];

				} else {
					console.log("Skip line "+i+" its value is "+bookingid );
				}
			} else {
				console.log("Skip line "+i+" Columns are not enought" );
			}
		}

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
				/* Headers check up */
				if ($("#carrier_code_name").val().length==4) {
					return(true);
				} else {
					error_front_end(3);
					return(false);
				}
				
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
	if (code==3) { errmsg="Manifest Carrier Code missing"; }
	dialog.showModal();
	$("#msgtext").text(errmsg);
}