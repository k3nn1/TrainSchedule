        // var nextArrival = "";
        // var minutesAway = 0;

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDpyiz4uDP2bOZ0DozQ4M9-ONkFC1TpH3c",
        authDomain: "train-time-26a4d.firebaseapp.com",
        databaseURL: "https://train-time-26a4d.firebaseio.com",
        projectId: "train-time-26a4d",
        storageBucket: "",
        messagingSenderId: "37699450316"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    // --- button to add train ---
    $("#submit").on("click", function() {
        event.preventDefault();

        var trainName = $("#train-name-input").val().trim();
        var trainDestination = $("#destination-input").val().trim();
        var firstTrainTime = moment($("#first-train-input").val().trim(), "HH:mm").format("X");
        var trainFrequency = $("#frequency-input").val().trim();
        
        // console.log(trainName);
        // console.log(trainDestination);
        console.log(firstTrainTime)
        var test = moment($("#first-train-input").val().trim(), "HH:mm").format("X");
        // console.log(test);
        // console.log(trainFrequency);

        // Creates a temp object for holding train data
        var trainSchedule = {
            name: trainName, 
            destination: trainDestination, 
            frequency: trainFrequency,
            // nextArrival: nextArrival,
            // minutesAway: minutesAway,
            firstTrainTime: firstTrainTime,
        };

        // --- Push to firebase ---
        database.ref().push(trainSchedule);
        console.log("Train Name: " + trainSchedule.name);
        console.log("Destination: " + trainSchedule.destination);
        console.log("Frequency: " + trainSchedule.frequency);
        // console.log("Next Arrival: " + trainSchedule.nextArrival);
        // console.log("Minutes Away: " + trainSchedule.minutesAway);
        console.log("First Train Time: " + trainSchedule.firstTrainTime);
        
        alert("New Train Added succesfully!");

    //     // clear inputs
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#first-train-input").val("");
        $("#frequency-input").val("");

    });

    // firebase event for adding train to the database and a row in the html when a user adds an entry
    database.ref().on("child_added", function(childSnapshot) {
        console.log(childSnapshot);
        console.log(childSnapshot.val());

        var trainName = childSnapshot.val().name;
        var trainDestination = childSnapshot.val().destination;
        var firstTrainTime = childSnapshot.val().firstTrainTime;
        var trainFrequency = childSnapshot.val().frequency;

        console.log("Train Name: " + trainName);
        console.log("Destination: " + trainDestination);
        console.log("First Train Time: " + firstTrainTime);
        console.log("Frequency: " + trainFrequency);

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTrainTimeConvert = moment(firstTrainTime, "HH:mm").subtract(1, "years");
        console.log(firstTrainTimeConvert)
        
        // Getting Current Time
        var currentTime = moment();
        console.log(currentTime);
        console.log("current time: " + moment(currentTime).format("hh:mm a"));
        
        // Difference in Times
        var diffTime = moment().diff(moment(firstTrainTimeConvert), "minutes");
        console.log("Difference in Time: " + diffTime);
        
        // Time Remainder
        var tRemainder = diffTime % trainFrequency;
        console.log(tRemainder);
        
        // Minutes away till next Train
        var minutesAway = trainFrequency - tRemainder;
        console.log("Minutes Away: " + minutesAway);
        
        // Time of Next Train
        var tnextArrival = moment().add(minutesAway, "minutes");
        console.log("Date and Time: " + moment(tnextArrival).format("LLLL"));
        console.log("Arrival Time: "+ moment(tnextArrival).format("hh:mm a"));
        var nextArrival = moment(tnextArrival).format("hh:mm a");
        
        // append the data to the table
        $("#trainSchedule").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
    });