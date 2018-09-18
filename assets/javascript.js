$(document).ready(function(){
  var config = {
    apiKey: "AIzaSyCjNqRvX94YBUK5tJqv_UmU0-qD1Pn3ekU",
    authDomain: "but-why-a8128.firebaseapp.com",
    databaseURL: "https://but-why-a8128.firebaseio.com",
    storageBucket: "but-why-a8128.appspot.com"
  };

  firebase.initializeApp(config);
  var database = firebase.database();

  $("#submitButton").on("click",function(event){
    
    console.log("submit successful")
    event.preventDefault();
    var train = $("#train").val().trim();
    var destination = $("#destination").val().trim();
    var firstArrival = $("#first").val().trim();
    var frequency = $("#frequency").val().trim();  
    
    $("#train").val("");
    $("#destination").val("");
    $("#time").val("");
    $("#frequency").val("");

    
    database.ref("Trains").push({
        train: train,
        destination: destination,
        firstArrival: firstArrival,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

})

database.ref("Trains").orderByChild("dateAdded").on("child_added", function(snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();

    var now = moment()
    var frequency = sv.frequency
    var firstArrival = sv.firstArrival
    var firstMoment = moment(firstArrival,"HH:mm")
    var dif = moment().diff(moment(firstMoment),"minutes")
    var partial = dif%frequency
    var minutesRemaining = frequency - partial
    var nextArrival = ""

    var firstRemaining = Math.ceil(moment(firstMoment).diff(now,"minutes"))

    if(now.isBefore(firstMoment)){
      nextArrival = firstArrival
      minutesRemaining = firstRemaining
    }
    else{
      nextArrival = moment().add(minutesRemaining,"minutes").format("HH:mm")
      minutesRemaining = frequency - partial
    }

    var row = $("<tr>")
    var train = $("<td>").text(sv.train)
    var destination = $("<td>").text(sv.destination)
    var frequency = $("<td>").text(sv.frequency)
    var arrival = $("<td>").text(nextArrival)
    var minutes = $("<td>").text(minutesRemaining)
    
    row.append(train).append(destination).append(frequency).append(arrival).append(minutes)
    $("#dataDisplay").append(row)

    // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });

})