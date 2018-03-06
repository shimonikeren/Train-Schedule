//--------------------moment JS display current time--------------
$("#currentTime").html("Current Time: " + moment().format("hh:mm"));

//-----------------initialize firebase----------------------------
var config = {
  apiKey: "AIzaSyDfgw6c2-2n39tTs_BDdc4Z-Z78A3k6E6o",
  authDomain: "train-schedule-ff82d.firebaseapp.com",
  databaseURL: "https://train-schedule-ff82d.firebaseio.com",
  projectId: "train-schedule-ff82d",
  storageBucket: "train-schedule-ff82d.appspot.com",
  messagingSenderId: "2074976478",
};
firebase.initializeApp(config);

//------------------global variables-----------------------------
var DATA = firebase.database();
var now = moment();

//-------onclick event for submit button, grab input-------------
$(document).on("click", "#submit", function() {
  //requireInput(); //this isn't working right now
  var name = $("#trainName")
    .val()
    .trim();
  var destination = $("#destination")
    .val()
    .trim();
  var firstTrain = $("#firstTrain")
    .val()
    .trim();
  var frequency = $("#frequeny")
    .val()
    .trim();
  trainFunction(name, destination, firstTrain, frequency);
});

//-------function: push object to firebase database--------------
//----------------------include TIMESTAMP------------------------
function trainFunction(someName, dest, first, freq) {
  DATA.ref().push({
    name: someName,
    destination: dest,
    firstTrain: first,
    frequency: freq,
    dateEntered: firebase.database.ServerValue.TIMESTAMP,
  });
}

//---sort data by dateEntered, limit number of inputs, onclick, append to page---
DATA.ref()
  .orderByChild("dateEntered")
  .limitToLast(1)
  .on("child_added", function(snapshot) {
    var tableRow = $("<tr>");
    tableRow.append(`<td>${snapshot.val().name}</td>`);
    tableRow.append(`<td>${snapshot.val().destination}</td>`);
    tableRow.append(`<td>${snapshot.val().frequency}</td>`);
    tableRow.append(`<td>${" "}</td>`);
    tableRow.append(`<td>${" "}</td>`);
    $(".output").append(tableRow);
  });

//---------------------------require user input----------------------------
// function requireInput() {
//   if ((trainName = "")) {
//     alert("Please input train name.");
//     return false;
//   }
//   if ((destination = "")) {
//     alert("Please input Destination.");
//     return false;
//   }
//   if ((firstTrain = "")) {
//     alert("Please input first train time.");
//     return false;
//   }
//   if ((freq = "")) {
//     alert("Please input frequency.");
//     return false;
//   }
// }
