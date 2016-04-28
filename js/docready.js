/* Cuscar Application
Author: Ruvenss G. Wilches (me@ruvenss.com)
Creation Date : 27-04-2016
*/
/* Vars Declaration : */
var importdata = "";
var cuscar_manifest="";
var manifest_cols=0;
var manifest_arrrows=[];
var manifest_arrcols=[];
var manifest_rows=0;
var today = new Date();
var tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
var hh = today.getHours();
var mmm = today.getMinutes();
var tdd = tomorrowDate.getDate();
var tmm = tomorrowDate.getMonth()+1; //January is 0!
var tyyyy = tomorrowDate.getFullYear();
var thh = tomorrowDate.getHours();
var tmmm = tomorrowDate.getMinutes();
/* Variables conditions */
if(dd<10) {
    dd='0'+dd;
} 
if(mm<10) {
    mm='0'+mm;
} 
if(tdd<10) {
    tdd='0'+tdd;
} 
if(tmm<10) {
    tmm='0'+tmm;
} 
today = yyyy+'-'+mm+'-'+dd;
var tomorrow = tyyyy+'-'+tmm+'-'+tdd+' '+thh+':'+tmmm;
/*  CUSCAR's Variables for initial code line */
var csc_bl  ="CNI+1+";
var csc_dod ="DTM+342:"; /* Date of Departure */
var csc_pol ="LOC+76+"; /* Port of loading */
var csc_pod ="LOC+11+"; /* Port of discharge */
var csc_pofd="LOC+20+"; /* Port of final discharge */
var csc_cofd="LOC+28+"; /* Country of final discharge */
var csc_poc ="LOC+26+"; /* Final City  */
var csc_cons="NAD+CN++"; /* Consignee Data  */
var csc_con1="NAD+N1++"; /* Consignee Data BIS  */
var csc_noti="NAD+CZ++"; /* Notify Data  */
var csc_vol = "MEA+AAE+AAW+MTQ:"; /* Volume Data  */
var csc_weight="MEA+AAE+G+KGM:"; /* Weight Data  */
var csc_weight="GIS+TX:"; /* Package Number  */
var csc_packtype="GID+1+1:"; /* Packaging type  */
var csc_goods="FTX+AAA+++"; /* Goods Desc  */
var csc_vin="PCI+24+"; /* VIN or CIN */
/*system variables */
var fileEntry;
var gotWritable = false;
var modeDescription = '';
$(document).ready(function () {
	$("#export-btn").click(function(e) {
		console.log("export button clicked");
		if (analise_data($("#dataimport").val())) {
			export_data(manifest_arrrows);
		}
	});
});
