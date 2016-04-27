/* Cuscar Application
Author: Ruvenss G. Wilches (me@ruvenss.com)
Creation Date : 27-04-2016
*/
/* Vars Declaration : */
var importdata = "";
var manifest_cols=0;
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
$(document).ready(function () {
	
});
