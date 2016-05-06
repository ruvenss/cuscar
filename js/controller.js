function saveToEntry(data) {
	console.log("data: "+data);
	fileEntry.createWriter(function(fileWriter) {
		fileWriter.onwriteend = function(e) {
		  if (this.error)
		    console.log( 'Error during write: ' + this.error.toString());
		  else
		    clearError();
		};
		console.log("blob: "+data);
		var blob = new Blob(data, {type: 'text/plain'});
		fileWriter.write(blob);
	});
}

function setEntry(anEntry, isWritable, name) {
  fileEntry = anEntry;
  gotWritable = isWritable;
  if (fileEntry) {
    updateModeForBaseName(fileEntry.name);
  } else if (name) {
    updateModeForBaseName(name);
  }
  updatePath();
}

// Create a new document. This just wipes the old document.
function createNew() {
  replaceDocContentsFromString();
  setEntry(null, false);
}

function openFile() {
  chrome.fileSystem.chooseEntry(function (entry) {
    if (chrome.runtime.lastError) {
      showError(chrome.runtime.lastError.message);
      return;
    }
    clearError();
    setEntry(entry, false);
    replaceDocContentsFromFileEntry();
  });
}

function saveFile() {
	console.log("cuscar_manifest: "+cuscar_manifest);
  if (gotWritable) {
  	console.log("gotWritable");
    saveToEntry(cuscar_manifest);
  } else if (fileEntry) {
    chrome.fileSystem.getWritableEntry(fileEntry, function(entry) {
    	console.log("getWritableEntry");
      if (chrome.runtime.lastError) {
        showError(chrome.runtime.lastError.message);
        return;
      }
      clearError();
      setEntry(entry, true);
      console.log("cuscar_manifest2: "+cuscar_manifest);
      saveToEntry(cuscar_manifest);
    });
  } else {
    saveAs();
  }
}
function saveAs() {
  chrome.fileSystem.chooseEntry({type: 'saveFile', suggestedName: 'manifest.edi', accepts: [ { description: 'Cuscar Manifest files (*.edi)', extensions: ['edi']} ]}, function(entry) {
    if (chrome.runtime.lastError) {
      showError(chrome.runtime.lastError.message);
      return;
    }
    console.log("saveAS OK "+cuscar_manifest);
    clearError();
    //setEntry("entry", true);
    saveToEntry(cuscar_manifest);
  });
}
function clearError() {
	console.log("clearError");
}
function showError(anError) {
  console.log("Err: "+anError);
}
function export_data(arr_rows) {
	var dialog = document.querySelector('#dialog2');
	var cuscar_body="";
	var departure_date=$("#departure").val();
	var cuscar_vessel=$("#vessel_name").val();
	var carrier_name=$("#carrier_name").val();
	var carrier_code_name=$("#carrier_code_name").val();
	dialog.showModal();
	if (arr_rows.length>0) {
		departure_date=departure_date.replace(/-/g, "");
		cuscar_vessel=cuscar_vessel.replace(/ /g, "+");
		carrier_name=carrier_name.replace(/ /g, "+");
		console.log("Export for : "+ arr_rows.length + " Rows Has begun...");
		var cuscar_line=0;
		for (var i = 0; i < arr_rows.length; i++) {
			var current_row = arr_rows[i];
			manifest_arrcols=current_row.split("\t");
			if (manifest_arrcols.length>=21) {
				/* Skip rows */
				var bookingid=manifest_arrcols[0];
				if (bookingid>0) {
					console.log("Exporting booking id ["+bookingid+"]");
					var blnumber=manifest_arrcols[1];
					var pod=manifest_arrcols[2];
					var unpod=manifest_arrcols[1].substring(0, 5);
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
					cuscar_line=cuscar_line+1;
					cuscar_body=cuscar_body+"CNI+"+cuscar_line+"+"+blnumber+"\n";
					cuscar_body=cuscar_body+"DTM+342:"+departure_date+":102'\n";
					cuscar_body=cuscar_body+"\n";
				} else {
					console.log("Skip line "+i+" its value is "+bookingid );
				}
			} else {
				console.log("Skip line "+i+" Columns are not enought" );
			}
		}
		var cuscar_header="UNA:+,? '\nUNB+UNOA:1+"+carrier_code_name+":ZZ+310029:ZZ+050706:0854+733'\nUNH+73300001+CUSCAR:D:95B:UN'\nBGM+85+P34+9'\nDTM+137:"+departure_date+":102'\nNAD+MS+"+cuscar_vessel+":172:166'\nTDT+20+0521+1++SAFM:172:166+++MSTG9:103::SAFMARINE COTONOU:GB'\nDTM+132:20050701:102'\n\n\nEQD+CN+CAXU9971839+45G1:102:5++3+5'\nEQD+CN+CMBU4067719+42G1:102:5++3+5'";
		var cuscar_footer="UNT+699+73300001'\nUNZ+1+733'";
		cuscar_manifest=cuscar_header+"\n\n"+cuscar_body+cuscar_footer;
		chrome.fileSystem.chooseEntry({type: 'saveFile', suggestedName: 'cuscar_manifest_'+departure_date+'.edi'}, function(writableFileEntry) {
			console.log("Saving..."+cuscar_manifest);
			writableFileEntry.createWriter(function(writer) {
		      //writer.onerror = errorHandler;
		      writer.onwriteend = function(e) {
		        console.log('write complete');
		      };
		      writer.write(new Blob([cuscar_manifest], {type: 'text/plain'}));
		    });
		});
		dialog.close();
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
						if ($("#carrier_name").val().length>1) {
							if ($("#vessel_name").val().length>1) {
								if ($("#vessel_code").val().length>1) {
									if ($("#departure").val().length==10) {
										if ($("#pol").val().length==5) {
											return(true);
										} else {
											error_front_end(8);
											return(false);
										}
									} else {
										error_front_end(7);
										return(false);
									}
								} else {
									error_front_end(6);
									return(false);
								}
							} else {
								error_front_end(5);
								return(false);
							}
						} else {
							error_front_end(4);
							return(false);
						}
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
	if (code==3) { errmsg="Manifest Carrier Code is missing or incorrect"; }
	if (code==4) { errmsg="Manifest Carrier Name is missing"; }
	if (code==5) { errmsg="Vessel Name is missing"; }
	if (code==6) { errmsg="Vessel Code is missing"; }
	if (code==7) { errmsg="Departure date format is incorrect, please use YYYY-MM-DD"; }
	if (code==8) { errmsg="Port of loading must be an UNLOCODE of 5 characters length"; }

	dialog.showModal();
	$("#msgtext").text(errmsg);
}