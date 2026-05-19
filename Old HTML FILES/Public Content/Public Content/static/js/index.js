
//Disable async to allow for sequential behavior
async: false;
//Execute the following code once page is fully loaded
$(document).ready(function()
{
//$( "#submitButton" ).click(update);
setInterval(update, 500);
//document.body.style.backgroundColor= "WHITE";
checkuser();
}
)
//update gets the data from the URL
function checkuser()
{

if (typeof(window.Storage) !== "undefined")
 {
var user = sessionStorage.user;

var x = document.getElementById("links");
document.getElementById("usr").innerHTML=user;


URL = document.URL;
URL1 = document.URL;
	URL = URL.replace("index.html", "login/asscess_detail");
	if(sessionStorage.ghf6576chgczavu7 == undefined)
	{
		
		URL = URL + "?token=" + sessionStorage.ghf6576chgczavu7;
	}
	else{
	
	URL = URL + "?token=" + sessionStorage.ghf6576chgczavu7.replace(/\+/g, '12fgh');
	}
URL = encodeURI(URL);
$.getJSON(URL, function(data)
{
var a =data["key 1"];
var b =data["key 2"];
var c =data["key 3"];
var no_user =data["key 5"];
if ( Aes.Ctr.decrypt(a,sessionStorage.ghf6576chgczavu7, 256) == Aes.Ctr.decrypt(b, Aes.Ctr.decrypt(c,sessionStorage.ghf6576chgczavu7, 256), 256))
{

alert(sessionStorage.user);
x.style.display = Aes.Ctr.decrypt(c,sessionStorage.ghf6576chgczavu7, 256);
if (typeof(window.Storage) !== "undefined")
{
//sessionStorage.setItem("ghf6576chgczavu7", unikey);
}
 else {
// Sorry! No Web Storage support..
}
}
else
{
alert("inValid user!!!");
URL = document.URL;
URL1 = URL1.replace("index.html", "login.html");
window.location = URL1;
}

});

}


}

function update()
{
URL = document.URL;
URL = URL.replace("index.html", "") + "dashboard/update" +"?live="+"1"+"&token=" + sessionStorage.ghf6576chgczavu7.replace(/\+/g, '12fgh');
$.getJSON(URL, function(data)

{	//We use JQuery to update the text inside of the field with id=result with the sum
var status =data["status"];
var no_user =data["key_5"];
var n = no_user.toString();
document.getElementById("noofuser").innerHTML =n;
var i;
var j=1 ;
for (i=0;i<5;i++)
{
var sts ="sts" + j;
//document.getElementById(sts).value = status[i];
  var x = document.getElementById("tbl").rows[i].cells;
  x[1].innerHTML =status[i];
if( status[i]=="AUTO MODE")
{
document.getElementById(sts).style.color ="green";
}else if ( status[i]=="MAN MODE"){
document.getElementById(sts).style.color ="blue";
}
else
{document.getElementById(sts).style.color ="red";
}
j++;
}
	}
	);
}
