// Initialize Firebase
var config = {
  apiKey: "AIzaSyBp0s18TUbVk_y-HM2hSl-fHEfFzDm3-q8",
  authDomain: "project1-team3-add85.firebaseapp.com",
  databaseURL: "https://project1-team3-add85.firebaseio.com",
  projectId: "project1-team3-add85",
  storageBucket: "project1-team3-add85.appspot.com",
  messagingSenderId: "325148478422"
};
firebase.initializeApp(config);
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
  console.log(user)
  } else {
    // User is signed out.
    // ...
  }
});
// Create a variable to reference the database.
var database = firebase.database();


// -----------------------------
email =(localStorage.getItem('email'));
password =(localStorage.getItem('pass'));
firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});

// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated
// every time the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function(snap) {

  // If they are connected..
  if (snap.val()) {

    // Add user to the connections list.
    var con = connectionsRef.push(true);
    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snap) {

  // Display the viewer count in the html.
  // The number of online users is the number of children in the connections list.
  $("#connected-viewers").text(snap.numChildren());
});

// ------------------------------------
// Initial Values
var initialBid = 0;
var initialBidder = "No one :-(";
var highPrice = initialBid;
var highBidder = initialBidder;
var itemName = "";
var ownerName = "";
var auctionPrice = "";
var expirationDate = "";

// --------------------------------------------------------------
// At the page load and subsequent value changes, get a snapshot of the local data.
// This function allows you to update your page in real-time when the values within the firebase node bidderData changes
database.ref("/bidderData").on("value", function(snapshot) {

  // If Firebase has a highPrice and highBidder stored (first case)
  if (snapshot.child("highBidder").exists() && snapshot.child("highPrice").exists()) {

    // Set the local variables for highBidder equal to the stored values in firebase.
    highBidder = snapshot.val().highBidder;
    highPrice = parseInt(snapshot.val().highPrice);
    itemName = snapshot.val().itemName;
    ownerName = snapshot.val().ownerName;
    auctionPrice = snapshot.val(),auctionPrice;
    expirationDate = snapshot.val().expirationDate;

    // change the HTML to reflect the newly updated local values (most recent information from firebase)
    $("#highest-bidder").text(snapshot.val().highBidder);
    $("#highest-price").text("$" + snapshot.val().highPrice);
    $("#itemName").text(snapshot.val().itemName);
    $("#item-key").attr('value', snapshot.key);
    console.log('key', snapshot.key);

    // Print the local data to the console.
    console.log(snapshot.val().highBidder);
    console.log(snapshot.val().highPrice);
  }

  // Else Firebase doesn't have a highPrice/highBidder, so use the initial local values.
  else {

    // Change the HTML to reflect the local value in firebase
    $("#highest-bidder").text(highBidder);
    $("#highest-price").text("$" + highPrice);

    // Print the local data to the console.
    console.log("local High Price");
    console.log(highBidder);
    console.log(highPrice);
  }

  // If any errors are experienced, log them to console.
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

// --------------------------------------------------------------
// Whenever a user clicks the  button
$("#submit-bid").on("click", function(event) {
  event.preventDefault();

  // Get the input values
  var bidderName = $("#bidder-name").val().trim();
  var bidderPrice = parseInt($("#bidder-price").val().trim());
  var highPrice = $("#item-high-price").val()
  var itemKey = $("#item-key").val();

  // Log the Bidder and Price (Even if not the highest)
  if (bidderPrice <= highPrice) {
    // Alert
    swal({
      type: 'error',
      title: 'Sorry, ' + bidderName + '',
      text: 'Your bid must be higher than ' + highPrice
    });
    return false;
  }

  if (bidderPrice > highPrice) {

    // Alert
    swal({
      type: 'success',
      title: 'Congratulations ' + bidderName + '!',
      text: 'At $' + bidderPrice + ' You are now the high bidder!'
    });

    // Save the new price in Firebase
    database.ref("/auctionItems/"+itemKey).update({
      highBidder: bidderName,
      highPrice: bidderPrice
    });
    $("#"+itemKey).find('.high-bidder').text(bidderName);
    $("#"+itemKey).find('.high-price').text('$' +bidderPrice);
    $("#highest-bidder").text(bidderName);
    $("#highest-price").text(bidderPrice);
    $("#"+itemKey).attr('data-high-price', bidderPrice);
    $("#"+itemKey).attr('data-high-bidder-name', bidderName);


    // Log the new High Price

    // Store the new high price and bidder name as a local variable (could have also used the Firebase variable)
    highBidder = bidderName;
    highPrice = parseInt(bidderPrice);

    // Change the HTML to reflect the new high price and bidder
    $("#highest-bidder").text(bidderName);
    $("#highest-price").text("$" + bidderPrice);
  } else {

    // Alert
    alert("Sorry that bid is too low. Try again.");
  }
});

if (bidderName = null) {
  $(bidderPrice).text("$" +auctionPrice);
} else {
  $(bidderPrice).text("$" +bidderPrice);
}