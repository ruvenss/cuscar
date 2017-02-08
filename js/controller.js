function getSelectedText(elementId) {
    var elt = document.getElementById(elementId);

    if (elt.selectedIndex == -1)
        return null;

    return elt.options[elt.selectedIndex].text;
}
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
function cuscar_string(str) {
		return str.replace(/[.'+?^${}()|[\]\\]/g, "\\$&");
}
function cleandata1(str){
	return str.replace(/[:€™°]/g, ' ');
}
function export_data(arr_rows) {
	var dialog = document.querySelector('#dialog2');
	var cuscar_body="";
	var departure_date=$("#departure").val();
	var cuscar_vessel=$("#vessel_code").val().toUpperCase();
	var vessel_name=$("#vessel_name").val().toUpperCase();
	var carrier_name=$("#carrier_name").val().toUpperCase();
	var vessel_code_flag=$("#vessel_code_flag").val();
	var pol_code=$("#pol").val();
	var podv_code=$("#pod").val();
	var voyage=$("#voyage").val().toUpperCase();
	var carrier_code_name=$("#carrier_code_name").val().toUpperCase();
	csc_agent=$("#carrier_code_name").val();
	dialog.showModal();
	var pol_desc=getSelectedText("pol");
	if (arr_rows.length>0) {
		console.log("pol_desc: "+pol_desc);
		var subcargo=0;
		var departure_arr=departure_date.split("-");
		var departure_year=departure_arr[0];
		var departure_month=departure_arr[1];
		var departure_day=departure_arr[2];
		var departure_year_cuscar=departure_year.substr(departure_year.length - 2);
		var cuscar_departure=departure_year_cuscar+departure_month+departure_day;
		departure_date=departure_date.replace(/-/g, "");
		cuscar_vessel=cuscar_vessel.replace(/ /g, "+");
		carrier_name=carrier_name.replace(/ /g, "+");
		var cuscar_line=0;
		var cuscar_line_tr=6;
		for (var i = 0; i < arr_rows.length; i++) {
			var current_row = arr_rows[i];
			manifest_arrcols=current_row.split("\t");
			if (manifest_arrcols.length>=21) {
				/* Skip rows */
				var bookingid=manifest_arrcols[0];
				if (bookingid>0) {
					var blnumber=manifest_arrcols[1];
					var pod=manifest_arrcols[2];
					//var unpod=manifest_arrcols[1].substring(5, 5);
					var unpod="SNDKR";
					//var unpodcountry=manifest_arrcols[1].substring(5, 1);
					var unpodcountry="SN";
					var unpodcountry_desc="SENEGAL";
					var onblnumber=manifest_arrcols[3].trim();
					var shipper=manifest_arrcols[5];
					var consignee_address=removeDiacritics(manifest_arrcols[6].trim());
					var consignee=removeDiacritics(cuscar_string(manifest_arrcols[7]));
					var transit=manifest_arrcols[8].trim();
					var notify=removeDiacritics(cuscar_string(manifest_arrcols[9]));
					var condition=manifest_arrcols[10];
					var goods=manifest_arrcols[11];
					var vin=cuscar_string(manifest_arrcols[12]);
					var category=manifest_arrcols[13];
					var blinstructions=removeDiacritics(manifest_arrcols[14]);
					var weight=manifest_arrcols[15]+"0";
					var volume=manifest_arrcols[16]+"0";
					var goods_length=manifest_arrcols[17];
					var goods_width=manifest_arrcols[18];
					var goods_height=manifest_arrcols[19];
					/* Only process master bookings */
					if (!onblnumber.length>0) {
						consignee_address=consignee_address.replace(/:/g, " ");
						if (consignee_address.length===0) {
							consignee_address="DAKAR";
						}
						if (category=="CAR" || category=="MINI VAN" || category=="TRUCK" || category=="VAN"){
							category="VH";
						}
						console.log("Exporting booking id [" + bookingid + "]");
						cuscar_line=cuscar_line+1;
						cuscar_body=cuscar_body+csc_bl+cuscar_line+"+"+blnumber+csc_eof;
						cuscar_body=cuscar_body+csc_blrff+blnumber+csc_eof;
						cuscar_body=cuscar_body+csc_pol+pol_code+"::6:"+pol_desc+csc_eof;
						cuscar_body=cuscar_body+csc_pol3+pol_code+"::6:"+pol_desc+csc_eof;
						cuscar_body=cuscar_body+csc_pod+unpod+"::6:"+pod+csc_eof;
						var pot_code="";
						if (transit.length>0) {
							/* Irregular Magic to guess the COD*/
							if (transit.includes("BAMAKO")===true || transit.includes("MALI")===true) {
								/*pot_code="MLBKO";*/
								unpodcountry="ML";
								unpodcountry_desc="MALI";
							}
							if (transit.includes("BISSAU")===true ) {
								/*pot_code="GWOXB";*/
								unpodcountry="GW";
								unpodcountry_desc="Guinea-Bissau";
							}
							if (transit.includes("BANJUL")===true ) {
								/*pot_code="GMBJL";*/
								unpodcountry="GM";
								unpodcountry_desc="BANJUL";
							}
							if (transit.includes("BANJUL")===true ) {
								/*pot_code="GMBJL";*/
								unpodcountry="GM";
								unpodcountry_desc="BANJUL";
							}
							if (transit.includes("NOUAKCHOTT")===true ) {
								/*pot_code="MRNKC";*/
								unpodcountry="MR";
								unpodcountry_desc="MAURITANIA";
							}
							/*
							cuscar_body=cuscar_body+csc_pot+pot_code+"::6:"+transit+csc_eof;
							cuscar_line_tr=cuscar_line_tr+1;
							*/
							cuscar_body=cuscar_body+csc_pot+unpod+"::6:"+pod+csc_eof;
							cuscar_line_tr=cuscar_line_tr+1;
						} else {
							cuscar_body=cuscar_body+csc_pot+unpod+"::6:"+pod+csc_eof;
							cuscar_line_tr=cuscar_line_tr+1;
						}
						cuscar_body=cuscar_body+csc_cofd+unpodcountry+":::"+unpodcountry_desc+csc_eof;
						/*cuscar_body=cuscar_body+csc_pol+pol_code+"::6:ANTWERP"+csc_eof;*/
						cuscar_body=cuscar_body+csc_packtypecode+csc_eof;
						cuscar_body=cuscar_body+csc_ship+shipper+":"+shipper+"::"+csc_eof;
						cuscar_body=cuscar_body+csc_cons+consignee+":"+consignee_address+" "+transit+"::"+csc_eof;
						cuscar_body=cuscar_body+csc_con1+notify+csc_eof;
						cuscar_body=cuscar_body+csc_packtype+category+csc_eof;
						cuscar_body=cuscar_body+csc_goods+condition+" "+goods+csc_eof;
						cuscar_body=cuscar_body+csc_vol+volume+csc_eof;
						cuscar_body=cuscar_body+csc_weight+weight+csc_eof;
						cuscar_body=cuscar_body+csc_vin+"CHASSIS "+vin+csc_eof;
						cuscar_body=cuscar_body+csc_vin2+"CHASSIS "+vin+csc_eof;
						cuscar_body=cuscar_body+csc_packnumb+csc_eof;
						cuscar_line_tr=cuscar_line_tr+24;
						/* Check for ON BL Bookings*/
						subcargo=1;
						for (var o = 0; o < arr_rows.length; o++) {
							var onblcurrent_row = arr_rows[o];
							onblmanifest_arrcols=onblcurrent_row.split("\t");
							if (onblmanifest_arrcols.length>=21) {
								/* Skip rows */
								var onblbookingid=onblmanifest_arrcols[0].trim();
								if (onblbookingid.length>0) {
									/* Search for the same Parent ID */
									if (bookingid==onblmanifest_arrcols[3]) {
										console.log("-BL Sub Cargo found, as ID "+onblmanifest_arrcols[0]);
										subcargo=subcargo+1;
										/* Add Sub Cargo to the EDI BL */
										console.log("-Adding BL Data to booking ID "+bookingid);
										cuscar_body=cuscar_body+"GID+"+subcargo+"+1:"+category+csc_eof;
										cuscar_body=cuscar_body+csc_goods+onblmanifest_arrcols[10]+" "+onblmanifest_arrcols[11]+csc_eof;
										cuscar_body=cuscar_body+csc_vol+onblmanifest_arrcols[16]+csc_eof;
										cuscar_body=cuscar_body+csc_weight+onblmanifest_arrcols[15]+csc_eof;
										cuscar_body=cuscar_body+csc_vin+"CHASSIS "+onblmanifest_arrcols[12]+csc_eof;
										cuscar_body=cuscar_body+csc_vin2+"CHASSIS "+onblmanifest_arrcols[12]+csc_eof;
										cuscar_body=cuscar_body+csc_packnumb+csc_eof;
										cuscar_line_tr=cuscar_line_tr+6;
									}
								}
							}
						}
						//cuscar_body=cuscar_body+"\n";
					} else {
						console.log("Skip line "+i+" its value is ON BL "+onblnumber );
					}
				} else {
					console.log("Skip line "+i+" its value is "+bookingid );
				}
			} else {
				console.log("Skip line "+i+" Columns are not enought" );
			}
		}

		//var cuscar_header="UNA:+,? '\nUNB+UNOA:1+"+carrier_code_name+":ZZ+310029:ZZ+"+cuscar_departure+":0854+733'\nUNH+73300001+CUSCAR:D:95B:UN'\nBGM+85+P34+9'\nDTM+137:"+departure_date+":102'\nNAD+MS+"+cuscar_vessel+":172:166'\nTDT+20+0521+1++"+carrier_code_name+":172:166+++MSTG9:103::"+carrier_name+":BE'\nDTM+132:20050701:102'\n\n\nEQD+CN+CAXU9971839+45G1:102:5++3+5'\nEQD+CN+CMBU4067719+42G1:102:5++3+5'";
		var cuscar_trailer=cuscar_body.split("\n");
		var cuscar_trailer_lines=cuscar_trailer.length+5;
		var cuscar_header="UNA:+.?"+csc_eof+"UNB+UNOA:1+"+csc_agent+":ZZ+SNDKR:ZZ+150624:1917+"+UnixTime+csc_eof+"UNH+"+UnixTime+"0001+CUSCAR:D:95B:UN"+csc_eof+"BGM+85+"+UnixTime+"0001+9"+csc_eof+"DTM+137:20"+cuscar_departure+":102"+csc_eof+"NAD+MS+"+vessel_name+":172:166"+csc_eof+"TDT+20+"+voyage+"+1++"+cuscar_vessel+":172:166+++9075711:146::"+vessel_name+":"+vessel_code_flag+csc_eof+csc_podv+podv_code + ":139" + csc_eof + "DTM+132:20"+cuscar_departure+":102"+csc_eof;
		var cuscar_footer="UNT+"+cuscar_trailer_lines+"+"+UnixTime+"0001"+csc_eof+"UNZ+1+"+UnixTime+csc_eof;
		cuscar_manifest=cuscar_header+cuscar_body+cuscar_footer;
		chrome.fileSystem.chooseEntry({type: 'saveFile', suggestedName: 'cuscar_manifest_'+departure_date+'_v'+UnixTime+'.edi'}, function(writableFileEntry) {
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
			} else {
				error_front_end(9);
				return(false);
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
	if (code==9) { errmsg="Proteus manifest is fake, please use a the correct Proteus Manifest"; }
	dialog.showModal();
	$("#msgtext").text(errmsg);
}
