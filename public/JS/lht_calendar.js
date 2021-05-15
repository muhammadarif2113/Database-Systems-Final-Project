//js code for events tab
"use strict";

var thisDay = new Date();


document.getElementById("calendar").innerHTML = createCalendar(thisDay);


function createCalendar(calDate) {
    var calendarHTML = "<table id='calendar_table'>";
    calendarHTML += calCaption(calDate);
    calendarHTML += calWeekdayRow();
    calendarHTML += calDays(calDate);
    calendarHTML += "</table>";
    return calendarHTML;
}

function calCaption(calDate) {
    // monthName arry contains the list of month names 
    var monthName = ["January", "February", "March", "April", "May", "June" , "July", "August", "September", "October", "November", "December"];

    //Determine the current month
    var thisMonth = calDate.getMonth();

    //Determine the current year
    var thisYear = calDate.getFullYear();

    //Write the caption 
    return "<caption>" + monthName[thisMonth] + " " + thisYear + "</caption>";
}

// Function to wirte a table row if weekday abbreviations
function calWeekdayRow() {
    //Array of weekday abbreviations
    var dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var rowHTML = "<tr>";
    
    //Loop Through the dayName array
    for (var i = 0; i < dayName.length; i++) {
        rowHTML += "<th class='calender_weekdays'>" + dayName[i] +"</th>";
    }//for loop close

    //Closing Table Row tag
    rowHTML += "</tr>";
    return rowHTML;
}//function close

//Function to calculate the number of days in the month
function daysInMonth(calDate) {
    //Array of days in each month
    var dayCount = [31,28,31,30,31,30,31,31,30,31,30,31];

    //Extract the four digit year and month value
    var thisYear = calDate.getFullYear();
    var thisMonth = calDate.getMonth();
    
    //Revise the day in February for leap years
    if (thisYear % 4 === 0) {
        dayCount[1] = 29;
        if ((thisYear % 100 != 0) || (thisYear % 400 ===0)) {
            dayCount[1] = 29;
        }//Nested if
    }//Main if

    //Return the number of days for the  current month
    return dayCount[thisMonth];
}//end main function

//Function to write table rows for each day of the month
function calDays(calDate) {
    //Determine the staring day of the month
    var day = new Date(calDate.getFullYear(), calDate.getMonth(), 1);
    var weekDay = day.getDay(); 
    //Write blank cells preceding the staring day
    var htmlCode = "<tr>";
    for (var i = 0; i < weekDay; i++) {
        htmlCode += "<td></td>"
    }
    //Write cells for each day of the month
    var totalDays = daysInMonth(calDate);
    var highlighDay = calDate.getDate();
    for (var i = 1; i <= totalDays; i++) {
        day.setDate(i);
        weekDay = day.getDay();

        if (weekDay === 0) htmlCode += "<tr>";
        if (i === highlighDay) {
            htmlCode += "<td class='calendar_dates' id='calendar_today'>" + i + dayEvent[i] +  "</td>";
        } else {
            htmlCode += "<td class='calendar_dates'>" + i + dayEvent[i] + "</td>";
        }
        if (weekDay === 6) htmlCode += "</tr>";
    }
    //Return table rows and table data to make a calendar
    return htmlCode;
}