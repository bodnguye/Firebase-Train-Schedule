
        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyCeq5HkuNsoSADfrC2bjtBOVbPQTqVWFLk",
            authDomain: "train-station-express.firebaseapp.com",
            databaseURL: "https://train-station-express.firebaseio.com",
            projectId: "train-station-express",
            storageBucket: "train-station-express.appspot.com",
            messagingSenderId: "637353964726"
          };

          firebase.initializeApp(config);

          var database = firebase.database();


        // 2. Button for adding Train

        // Capture Button Click
        $("#add-train").on("click", function (event) {
            
            event.preventDefault();

            // Get user inputs
            var trainName = $("#inputName").val().trim();
            var destination = $("#inputDestination").val().trim();
            var firstTrainTime = $("#inputTime").val().trim(); 
            var frequency = $("#inputFrequency").val().trim();

            // First Train Time (pushed back 1 year to make sure it comes before current time)
            var firstTrainTimeConverted = moment(moment(firstTrainTime,"hh:mm A").subtract(1, "years"),"hh:mm").format("hh:mm");


            
            // Creates local "temporary" object for holding train data
            var newTrain = {
                name: trainName,
                destination: destination,
                start: firstTrainTimeConverted,
                frequency: frequency
            }

            // Uploads train data to the database
            database.ref().push(newTrain);

            // Logs everything to console
            console.log(newTrain.name);
            console.log(newTrain.destination);
            console.log(newTrain.start);
            console.log(newTrain.frequency);

            alert("You're waiting for a train. A train that will take you far away. You know where you hope the train will take you, but you can't know for sure. Yet it doesn't matter.");

            // Clears all of the text boxes
            $("#inputName").val("");
            $("#inputDestination").val("");
            $("#inputTime").val(""); 
            $("#inputFrequency").val("");
        });


        //3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
        database.ref().on("child_added", function (childSnapshot) {

            // Print the initial data to the console.
            console.log(childSnapshot.val());

            // Strore everything into a variable.
            var trainName = childSnapshot.val().name;
            var destination = childSnapshot.val().destination;
            var startTime = childSnapshot.val().start;
            var frequency = childSnapshot.val().frequency;

            // Log the value of the various properties
            console.log(trainName);
            console.log(destination);
            console.log(startTime);
            console.log(frequency);

            // Calculating minutes away for next Arrival
            var diffTime = moment().diff(moment(startTime,"hh:mm"),'m');
            var timeRemainder = diffTime % frequency;
            console.log("timeRemainder: " + timeRemainder);
            var minutesAway = frequency - timeRemainder;

            var nextTrain = moment().add(minutesAway, "minutes");
            var nextArrival = moment(nextTrain).format("hh:mm A")

            // Create the new row.
            var newRow =$("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(destination),
            $("<td>").text(frequency),
            $("<td>").text(nextArrival),
            $("<td>").text(minutesAway)
            );

            // Append the new row to the table
                $("#employee-table > tbody").append(newRow);

            // Create Error Handling            
            // If any errors are experienced, log them to console.
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });

        $("#clear-button").on("click", function (event) { 
            event.preventDefault();
             // Clears all of the text boxes
             $("#inputName").val("");
             $("#inputDestination").val("");
             $("#inputTime").val(""); 
             $("#inputFrequency").val("");
        });
