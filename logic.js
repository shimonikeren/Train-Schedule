//------------moment JS display current time in html--------------
$("#currentTime").html("Current Time: " + moment().format("LT"));

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

//-----------------------submit onclick--------------------------
//require input,grab info,make object var,push to db,clear form
$(document).on("click", "#submit", function() {
  var name = $("#trainName")
    .val()
    .trim();
  var destination = $("#destination")
    .val()
    .trim();
  var firstTrain = $("#firstTrain")
    .val()
    .trim();
  var frequency = $("#frequency")
    .val()
    .trim();
  //require user input to move forward with function
  if (name === "") {
    alert("Please Input Train Name.");
    return false;
  }
  if (destination === "") {
    alert("Please Input Train Destination.");
    return false;
  }
  if (firstTrain === "") {
    alert("Please Input First Train Time.");
    return false;
  }
  if (frequency === "") {
    alert("Please Input Frequency (Minutes) of Train.");
    return false;
  }
  //object var to push to db
  var newTrain = {
    name: name,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency,
    dateEntered: firebase.database.ServerValue.TIMESTAMP,
  };
  //push data to database
  DATA.ref().push(newTrain);
  //clear form
  $("#trainName").val("");
  $("#destination").val("");
  $("#firstTrain").val("");
  $("#frequency").val("");

  return false;
});

//-----db storage, calculate trains, append to page on table-----
DATA.ref()
  .orderByChild("dateEntered")
  .on("child_added", function(snapshot) {
    //variables
    var name = snapshot.val().name;
    var destination = snapshot.val().destination;
    var frequency = snapshot.val().frequency;
    var firstTrain = snapshot.val().firstTrain;
    //calculations using moment.js methods
    var firstTimeConverted = moment(firstTrain, "LT").subtract(1, "years"); //to make train be in the PAST
    var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
    var timeApart = timeDiff % frequency;
    var minNextTrain = frequency - timeApart;
    var nextTrain = moment().add(minNextTrain, "minutes");
    var nextArriving = moment(nextTrain).format("LT");
    //add table row and table datas to table body
    var tableRow = $("<tr>");
    tableRow.append(`<td>${name}</td>`);
    tableRow.append(`<td>${destination}</td>`);
    tableRow.append(`<td>${frequency}</td>`);
    tableRow.append(`<td>${nextArriving}</td>`);
    tableRow.append(`<td>${minNextTrain}</td>`);
    $(".tableBody").append(tableRow);
  });
