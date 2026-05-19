/**
File: addTwoWithSubmit.html
Author: Tanner Blair - National Instruments
Project: Web Services Example 1 - Add Two With Submit
Date: 01/15/2015
Description: This file is the JavaScript file that accompanies
addTwoWithSubmit.js. This file is analogous to the controller element 
of a traditional Model, View, Controller application architecture.
*/
//Disable async to allow for sequential behavior
async: false;
//Execute the following code once page is fully loaded
$(document).ready(function()
	{
		//$( "#submitButton" ).click(update);
 //use strict prevents the use of undeclared variables
    "use strict";
    
    //setInterval calls updateFPimage every 200 ms
    setInterval(update, 500);

	}
)
//update gets the data from the URL
function update()
{
var data;
	URL = document.URL;
	URL = URL.replace("add.html", "") + "dashboard/update";
	URL = URL + "?live="
	$.getJSON(URL, function(data)
		{
			//We use JQuery to update the text inside of the field with id=result with the sum.
			$('#result').text(data.temp);
		}
	);
}