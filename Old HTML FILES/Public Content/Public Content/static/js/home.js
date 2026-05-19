//Disable async to allow for sequential behavior
async: false;
//Execute the following code once page is fully loaded

var stat = [0,0,0,0,0];

 
$(document).ready(function()
{
	checkuser();
//$( "#submitButton" ).click(update);
setInterval(update, 500);


}
)
//update gets the data from the URL
function update()


{
URL = document.URL;

URL = URL.replace("live_status.html", "") + "dashboard/update" +"?live=1"+"&token=" + sessionStorage.ghf6576chgczavu7.replace(/\+/g, '12fgh')+"&stat1="+stat[0]+"&stat2="+stat[1]+"&stat3="+stat[2]+"&stat4="+stat[3]+"&stat5="+stat[4];
stat[0]=0;
stat[1]=0;
stat[2]=0;
stat[3]=0;
stat[4]=0;
$.getJSON(URL, function(data)

{
			//We use JQuery to update the text inside of the field with id=result with the sum.
/**$('#temparature').text(data.temparature);
$('#temparature').text(data.temparature);
$('#driving_speed').text(data.driving_speed);
$('#loading_torque').text(data.loading_torque);
$('#loading_current').text(data.loading_current);

*/
var status = data["status"]
var speed = data["speed"]
var torque = data["torque"]
var voltage = data["voltage"]
var current = data["current"]
var no_cycle = data["no_cycle"]
var part_count = data["part_count"]
var runsts = data["run_sts"]
var modelno = data["model_no"]
var s_no = data["serial_no"]
var seq = data["seq_on"]
var cycle_time = data["cycle_time"]
var SEQID= []
var i;
var j=1 ;
for (i=0;i<5;i++)
{ 

var sts ="status" + j;
var spd ="speed" + j;
var trq ="torque" + j;
var volt ="voltage" + j;
var cur ="current" + j;
var no_cyle ="no_cycle" + j;
var par_cnt ="part_count" + j;
var run_sts ="runsts" + j;
var model_no ="model" + j
var ser_no ="SNO" + j;
var startrem ="start" + j;
var cyc_time ="cycletime" + j;
var popup_id = "popupid" + j;
var temp1 = "id0" + j;

document.getElementById(sts).value = status[i];
if( status[i]=="AUTO MODE")
{
document.getElementById(startrem).disabled=false;
document.getElementById(sts).style.color ="green";
}
else
if( status[i]=="MAN MODE")

{
document.getElementById(startrem).disabled=true;
document.getElementById(sts).style.color ="blue";
}
else
{
document.getElementById(sts).style.color ="red";
document.getElementById(startrem).disabled=true;
}
document.getElementById(spd).value = speed[i];
document.getElementById(trq).value = torque[i];
document.getElementById(volt).value = voltage[i];
document.getElementById(cur).value = current[i];
document.getElementById(no_cyle).value = no_cycle[i];
document.getElementById(par_cnt).value = part_count[i];
document.getElementById(run_sts).innerHTML = runsts[i];
document.getElementById(model_no).innerHTML = modelno[i];
document.getElementById(ser_no).innerHTML= s_no[i];
document.getElementById(cyc_time).innerHTML= cycle_time[i];
if( seq[i]!="0")

{
document.getElementById(startrem).style.backgroundColor ="green";
document.getElementById(startrem).innerHTML="STOP";
document.getElementById(startrem).innerHTML="STOP";

if( seq[i]!="5")
{
document.getElementById(temp1).style.display='none';
}



else{
	
var temp = popup_id;
if(sessionStorage.getItem(temp) == undefined)
{
	//alert("ok");
}
else
{
	//sessionStorage=SEQID.seq[i];
if(sessionStorage.getItem(temp) == 5)
	
{
	
document.getElementById(temp1).style.display='block';	
}


else{
	document.getElementById(temp1).style.display='none';
}


}

}
}
else{
document.getElementById(startrem).style.backgroundColor ="red";
document.getElementById(startrem).innerHTML="START";
//document.getElementById('id01').style.display='none';

}


j++;
}


		}
	);
}




function checkuser()
{
var x1 = document.getElementById("start1");
var x2 = document.getElementById("start2");
var x3 = document.getElementById("start3");
var x4 = document.getElementById("start4");
var x5 = document.getElementById("start5");

if (typeof(window.Storage) !== "undefined")
 {
var user = sessionStorage.user;

URL = document.URL;
URL1 = document.URL;
	URL = URL.replace("live_status.html", "login/asscess_detail");
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
if ( Aes.Ctr.decrypt(a,sessionStorage.ghf6576chgczavu7, 256) == Aes.Ctr.decrypt(b, Aes.Ctr.decrypt(c,sessionStorage.ghf6576chgczavu7, 256), 256))
{

x1.style.display = Aes.Ctr.decrypt(c,sessionStorage.ghf6576chgczavu7, 256);
x2.style.display = Aes.Ctr.decrypt(c,sessionStorage.ghf6576chgczavu7, 256);
x3.style.display = Aes.Ctr.decrypt(c,sessionStorage.ghf6576chgczavu7, 256);
x4.style.display = Aes.Ctr.decrypt(c,sessionStorage.ghf6576chgczavu7, 256);
x5.style.display = Aes.Ctr.decrypt(c,sessionStorage.ghf6576chgczavu7, 256);
if (typeof(window.Storage) !== "undefined")
{
//sessionStorage.setItem("ghf6576chgczavu7", unikey);

}
 else {
// Sorry! No Web Storage support..
URL = document.URL;
URL1 = URL1.replace("index.html", "login.html");
window.location = URL1;
}
}
else
{
alert("inValid user!!!");
URL = document.URL;
URL1 = URL1.replace("live_status.html", "login.html");
window.location = URL1;
}

});

}


}
function start1byrem()
{
	var test=5;
	sessionStorage.setItem("popupid1", test);
	

stat[0]=1;
}
function start2byrem()
{
	sessionStorage.setItem("popupid2", 5);
stat[1]=1;
}
function start3byrem()
{
	sessionStorage.setItem("popupid3", 5);
stat[2]=1;
}
function start4byrem()
{
	sessionStorage.setItem("popupid4", 5);
stat[3]=1;
}
function start5byrem()
{
	sessionStorage.setItem("popupid5", 5);
stat[4]=1;
}
function fresh()
{
	var j=1;
	for (i=0;i<5;i++)
	{
		var station="popupid"+j;
		if(sessionStorage.getItem(station)==5)
		
	    {
		
		if(5==5)
		{
			
		stat[i]=2;
		sessionStorage.removeItem(station);
		}
		else
		{
		}
	}
		else
		{
		}
		j++;
	}
	
	
	}
	
	function conti()
{
	var j=1;
	for (i=0;i<5;i++)
	{
		var station="popupid"+j;
		if(sessionStorage.getItem(station)==5)
		{
		if(5==5)
		{
			
		stat[i]=3;
		sessionStorage.removeItem(station);
		}
		else
		{
		}
	}
		else
		{
		}
		j++;
	}
	
	
	}
	
	
	