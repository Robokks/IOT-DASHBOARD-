
//Disable async to allow for sequential behavior
async: false;
//Execute the following code once page is fully loaded
$(document).ready(function()
{
$( "#EXIT" ).click(exitwindow);
//checkuser();
importdata();
//setInterval(importdata, 500);

}
)
function exitwindow()
{

URL = document.URL;
URL = URL.replace("testconfig.html", "") + "login.html";
window.location = URL
}

//update gets the data from the URL
function checkuser()
{

if (typeof(window.Storage) !== "undefined")
 {
var user = sessionStorage.user;

URL = document.URL;
URL1 = document.URL;
	URL = URL.replace("testconfig.html", "login/asscess_detail");
		if(sessionStorage.ghf6576chgczavu7 == undefined)
	{
		
		URL = URL + "?token=" + sessionStorage.ghf6576chgczavu7;
	}
	else{
	
	URL = URL + "?token=" + sessionStorage.ghf6576chgczavu7.replace(/\+/g, '12fgh');
	}

$.getJSON(URL, function(data)
{
var a =data["key 1"];
var b =data["key 2"];
var c =data["key 3"];
var d =data["key 4"];
var data1=Aes.Ctr.decrypt(a,sessionStorage.ghf6576chgczavu7, 256);
var data2= Aes.Ctr.decrypt(c,sessionStorage.ghf6576chgczavu7, 256);
var data3= Aes.Ctr.decrypt(b, data2, 256);

var data6="8";
if (sessionStorage.token =="undefined")
{
	var r=  Math.random().toString(36).substring(2);
	sessionStorage.setItem("token", r);
}
if (( Aes.Ctr.decrypt(a,sessionStorage.ghf6576chgczavu7, 256) == Aes.Ctr.decrypt(b, Aes.Ctr.decrypt(c,sessionStorage.ghf6576chgczavu7, 256), 256)) && (Aes.Ctr.decrypt(d ,sessionStorage.ghf6576chgczavu7,256)==(Aes.Ctr.decrypt(sessionStorage.token,sessionStorage.user, 256))))
{

if (typeof(window.Storage) !== "undefined")
{
//sessionStorage.setItem("ghf6576chgczavu7", unikey);

}
 else {
// Sorry! No Web Storage support..
URL = document.URL;
URL = URL.replace("testconfig.html", "login.html");
window.location = URL;
}
}
else
{
alert("inValid user!!!");
URL = document.URL;
URL = URL.replace("testconfig.html", "login.html");
window.location = URL;
}

});

}


}
function validate()
{

var trtye = document.getElementById("usrname").value;
var ohgvnj = document.getElementById("pass").value;
  var gfqwszzfs = Aes.Ctr.encrypt($('#pass').val(), trtye, 256);
var r=  Math.random().toString(36).substring(2);
var unikey = Aes.Ctr.encrypt(ohgvnj,r, 256);
var unikey1 = unikey.replace(/\+/g, '12fgh');
var gfqwszzfs1 = gfqwszzfs.replace(/\+/g, '12fgh');
URL = document.URL;
URL1 = document.URL;
	URL = URL.replace("testconfig.html", "") + "login/userdt";
	URL = URL + "?user=" + trtye  + "&pas=" + gfqwszzfs1 + "&unky=" + unikey1 + "&id="+ ohgvnj +"&vi=hft6f";

$.getJSON(URL, function(data)
{
var nmxgfgyhg =data["edrtgdwhjgjg"];
var ghjhfhgh =data["fgdgdhjgjgjh"];
var sghjvchgva =data["jhfhjfhgfghfgc"];

if ( Aes.Ctr.decrypt(nmxgfgyhg,gfqwszzfs, 256) == Aes.Ctr.decrypt(ghjhfhgh,trtye, 256))
{
save();
alert("master saved sucessfully!!");
if (typeof(window.Storage) !== "undefined")
{
}
 else {
// Sorry! No Web Storage support..
}
}
else {
alert("user or password incorrect!!!");
}

});

}

function save()
{



let xhr =new XMLHttpRequest();

///URL = document.URL;
//URL = URL.replace("testconfig.html", "") + "selection/master"+"?token=" + sessionStorage.ghf6576chgczavu7.replace(/\+/g, '12fgh');
URL = document.URL;
URL1 = document.URL;
	URL = URL.replace("testconfig.html","");
		if(sessionStorage.ghf6576chgczavu7 == undefined)
	{
		
		URL = URL + "selection/master"+"?token=" + "12545";
	}
	else{
	
	URL = URL +  "selection/master"+"?token=" + sessionStorage.ghf6576chgczavu7.replace(/\+/g, '12fgh');
	}

xhr.open ("POST",URL,true);

xhr.setRequestHeader("content-Type","application/json")
xhr.onreadystatechange=function(){
if(xhr.readyState === 4 && xhr.status === 200)
{
}
};

var i;
var j=1 ;

var stas =[];
var high_set_volt =[];
var low_set_volt =[];
var high_sp_ramp_time =[];
var low_sp_ramp_time =[];
var high_spd_cy =[];
var low_spd_cy =[];
var high_spd_load = [];
var low_spd_load = [];
var high_spd_load_rmp = [];
var low_spd_load_rmp = [];

var low_on_time = [];
var high_on_time =[];
var low_off_time = [];
var high_off_time =[];
var pause_time =[];
var set_counts=[];
for (i=0;i<5;i++)
{


var sts ="act" + j;
var hgh_set_v="high_speedvolt"+j
var low_set_v="low_speedvolt"+j
var hgh_rmp_tm="high_speedvoltramp"+j
var low_rmp_tm="low_speedvoltramp"+j
var hspd ="high_speedcy" + j;
var lspd ="low_speedcy" + j;
var hload ="high_speedload" + j;
var lload ="low_speedload" + j;
var hloadrmp ="high_loadramp" + j;
var lloadrmp ="low_loadramp" + j;
var h_ont ="high_on_time" + j;
var l_ont ="low_on_time" + j;
var h_offt ="high_off_time" + j;
var l_offt ="low_off_time" + j;
var p_tm="pause_int"+j
var set_cnts="set_count"+j



var y = document.getElementById(sts).checked;
stas[i]= y
high_set_volt[i] = document.getElementById(hgh_set_v).value;
low_set_volt[i]=document.getElementById(low_set_v).value;
//high_sp_ramp_time[i]=document.getElementById(hgh_rmp_tm).value;
//low_sp_ramp_time[i]=document.getElementById(low_rmp_tm).value;
high_spd_cy[i]=document.getElementById(hspd).value;
low_spd_cy[i] =document.getElementById(lspd).value;
high_spd_load[i] =document.getElementById(hload).value;
low_spd_load[i]=document.getElementById(lload).value;
//high_spd_load_rmp[i]=document.getElementById(hloadrmp).value;
//low_spd_load_rmp[i]=document.getElementById(lloadrmp).value;
high_on_time[i]=document.getElementById(h_ont).value;
low_on_time[i]=document.getElementById(l_ont).value;
high_off_time[i]=document.getElementById(h_offt).value;
low_off_time[i]=document.getElementById(l_offt).value;
pause_time[i]=document.getElementById(p_tm).value;
set_counts[i]=document.getElementById(set_cnts).value;



j++;
}


var data = JSON.stringify( {
status:stas,high_set_v:high_set_volt,low_set_v:low_set_volt,high_speed_ramp_time:high_sp_ramp_time,low_speed_ramp_time:low_sp_ramp_time,high_speed_cycle:high_spd_cy,low_speed_cycle:low_spd_cy,high_speed_load:high_spd_load,low_speed_load:low_spd_load,high_loadramp_time:high_spd_load_rmp,low_loadramp_time:low_spd_load_rmp ,low_on_time:low_on_time,high_on_time:high_on_time,low_off_time:low_off_time,high_off_time:high_off_time,pause_time:pause_time,set_counts:set_counts,

});
data.replace(/"/g,'');
xhr.send(data);
return 0 ;

}


function importdata()
{




if (typeof(window.Storage) !== "undefined") {
var user = sessionStorage.access_level;
if("admin" == "admin")
{
}
else
{
alert("login failed")
window.close();
 var URL = document.URL;
URL = URL.replace("testconfig.html", "") + "login.html";
window.location = URL

}
}

URL = document.URL;
//URL = URL.replace("testconfig.html", " ") + "selection/import" +"?import="+"1" +"&token=" + sessionStorage.ghf6576chgczavu7.replace(/\+/g, '12fgh');
URL = URL.replace("testconfig.html", "selection/import");
		if(sessionStorage.ghf6576chgczavu7 == undefined)
	{
		
		URL = URL +"?import="+"1" +"&token="+ sessionStorage.ghf6576chgczavu7;
	}
	else{
	
	URL = URL +"?import="+"1" +"&token=" + sessionStorage.ghf6576chgczavu7.replace(/\+/g, '12fgh');

	}
$.getJSON(URL, function(data)

{
			//We use JQuery to update the text inside of the field with id=result with the sum.
/**$('#setpos').text(data.set_position);
$('#setvel').text(data.set_velocity);
$('#settorque').text(data.set_torque);
$('#setrpm').text(data.set_rpm);

var set_pos = data["set_postion"]
var set_vel = data["set_velocity"]
document.getElementById("setpos").value = set_pos;
document.getElementById("setvel").value = set_vel;
*/
var status = data["status"];
var high_set_volt = data["high_set_v"];
var low_set_volt = data["low_set_v"];
var high_sp_ramp_time = data["high_speed_ramp_time"];
var low_sp_ramp_time = data["low_speed_ramp_time"];
var high_spd_cy = data["high_speed_cycle"];
var low_spd_cy = data["low_speed_cycle"];
var high_spd_load = data["high_speed_load"];
var low_spd_load = data["low_speed_load"];
var high_spd_load_rmp = data["high_loadramp_time"];
var low_spd_load_rmp = data["low_loadramp_time"];

var low_on_time = data["low_on_time"];
var high_on_time = data["high_on_time"];
var low_off_time = data["low_off_time"]
var high_off_time = data["high_off_time"];
var pause_time = data["pause_time"];
var set_counts=data["set_counts"] 
var i;
var j=1 ;
for (i=0;i<status.length;i++)
{

var sts ="act" + j;
var hgh_set_v="high_speedvolt"+j
var lw_set_v="low_speedvolt"+j
var hgh_rmp_tm="high_speedvoltramp"+j
var low_rmp_tm="low_speedvoltramp"+j
var hspd ="high_speedcy" + j;
var lspd ="low_speedcy" + j;
var hload ="high_speedload" + j;
var lload ="low_speedload" + j;
var hloadrmp ="high_loadramp" + j;
var lloadrmp ="low_loadramp" + j;
var h_ont ="high_on_time" + j;
var l_ont ="low_on_time" + j;
var h_offt ="high_off_time" + j;
var l_offt ="low_off_time" + j;
var p_tm="pause_int"+j
var set_cnts="set_count"+j


var x= document.getElementById(sts);
x.checked =  status[i];
document.getElementById(hgh_set_v).value = high_set_volt[i];
document.getElementById(lw_set_v).value = low_set_volt[i];
//document.getElementById(hgh_rmp_tm).value = high_sp_ramp_time[i];
//document.getElementById(low_rmp_tm).value = low_sp_ramp_time[i];
document.getElementById(hspd).value = high_spd_cy[i];
document.getElementById(lspd).value = low_spd_cy[i];
document.getElementById(hload).value = high_spd_load[i];
document.getElementById(lload).value = low_spd_load[i];
//document.getElementById(hloadrmp).value = high_spd_load_rmp[i];
//document.getElementById(lloadrmp).value = low_spd_load_rmp[i];
document.getElementById(h_ont).value = high_on_time[i];
document.getElementById(l_ont).value = low_on_time[i];
document.getElementById(h_offt).value = high_off_time[i];
document.getElementById(l_offt).value = low_off_time[i];
document.getElementById(p_tm).value = pause_time[i];
document.getElementById(set_cnts).value = set_counts[i];

j++;
}
		}
	);

}
