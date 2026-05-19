//Disable async to allow for sequential behavior
async: false;
//Execute the following code once page is fully loaded
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
URL = URL.replace("live_status.html", "") + "dashboard/update" +"?live=1"+"&token=" + sessionStorage.ghf6576chgczavu7.replace(/\+/g, '12fgh');
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

document.getElementById(sts).value = status[i];
if( status[i]=="AUTO MODE")
{

document.getElementById(sts).style.color ="green";
}else
if( status[i]=="MAN MODE")
{document.getElementById(sts).style.color ="blue";
}
else
{
document.getElementById(sts).style.color ="red";
}
document.getElementById(spd).value = speed[i];
document.getElementById(trq).value = torque[i];
document.getElementById(volt).value = voltage[i];
document.getElementById(cur).value = current[i];
document.getElementById(no_cyle).value = no_cycle[i];
document.getElementById(par_cnt).value = part_count[i];
document.getElementById(run_sts).value = runsts[i];

j++;
}

		}
	);
}




function checkuser()
{

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