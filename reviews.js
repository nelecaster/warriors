
var userName = "";
var pubID = 0;
var response = "";
var html_s;

var database;

var map; // needed for google maps
var InfoWindow; // needed for google maps
var marker; // needed for google maps

var useEdit = true; // turn the editor on or off
var debug = true;  // set pub to a "constant" for testing!
var doMap = true; //debug type 2, don't hammer maps!
console.log("edit is:" + useEdit);

/* todo:
Monday:
- get admin and main to work with group
- Make pages look better,  style and consistent font
- counter is:  
- integrate with github
- tommodal.html/modal.css -- validates input 


After class:
- get name of user from usertable, add to posts
- do address lookup for missing lat/long (or skip missing ones?)
- pretty print address and phone number
- stars
-admin delete

*/

// Initialize Firebase
var config = {
   apiKey: "AIzaSyAzGg64gHxEiXXBu09jlQEl97bg-kRhZ_I",
   authDomain: "beer-review-2.firebaseapp.com",
   databaseURL: "https://beer-review-2.firebaseio.com",
   projectId: "beer-review-2",
   storageBucket: "beer-review-2.appspot.com",
   messagingSenderId: "756701042097" 


};
firebase.initializeApp(config);



database = firebase.database();


if (false ) { // testing only
    localStorage.setItem("userName", "tom");
    localStorage.setItem("pubID", "3850");  // use 3846 or 3785 or 3850 gull dam it!
}

userName = localStorage.getItem('userName');
pubID = localStorage.getItem('pubID');

//put this error in to warn a programmer that conditions were not made to run this
//don't mark me for using alert, this is only to warn programmers

$(document).ready(function () {
    $("#post").click(function () {
        var tempMessage;
        console.log("rutville edit is:" + useEdit)
        if (useEdit)
            nicEditors.findEditor('textarea').saveContent();
        tempMessage = $("#textarea").val();
        console.log("lenny=" + tempMessage.length);
        // known bug: "blank" messages are sometimes 4 in length. work on later
        if (tempMessage.length == 0 || tempMessage.length == 4)
            alert("you can't save an empty message");
        else if (userName.length < 2)
            {
                alert("You must be logged in to post a message!");
            }
        else {
            var tmpMessage = {
                message: tempMessage,
                pubID: pubID,
                userName: userName,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            };
            database.ref("/posts").push(tmpMessage)
        $("#textarea").val('');
        console.log("edit debugh:" + useEdit);
        if (useEdit)
            nicEditors.findEditor('textarea').setContent("");
        }

    });
});
function show_addr(pubin) {
    // needs to have a prettty csz and phone function call 
    var address1 =  pubin.street;
    var address2 = pubin.city + ",    " +  pubin.state + " " + pubin.postal_code;
    html_s = `<h2>${pubin.name}</h2>
              <h4>${address1}</h4>
              <h4>${address2}</h4>
              <h4>${formatPhoneNumber(pubin.phone)}</h4>`;

    /*html_s = `<h2>${pubin.name}</h2>
              <h4>${pubin.street}</h4>
              <h4>${pubin.city}</h4>
              <h4>${pubin.state}</h4>
              <h4>${pubin.postal_code}</h4>
              <h4>${formatPhoneNumber(pubin.phone)}</h4>`; */




    $("#reviewHeader").append(html_s);
}
function get_latlong(pubin) {
}

function initMap() {
    console.log("initmap");
    if (doMap) {
        console.log("domap1");
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 44.8263804, lng: -93.395601599 },
            //center: {lat: mapLat, lng: mapLong},
            zoom: 12
        });
        infoWindow = new google.maps.InfoWindow;
        marker = new google.maps.Marker({
            position: { lat: 44.8263804, lng: -93.395601599 }, // myLatLng,
            //position: { lat: mapLat, lng: mapLong }, // myLatLng,
            map: map,
            title: 'Get your beer here!'
        });

    }
    else {
        console.log("nomap1");
        html_s = `<img src="assets/mapScreenShot.png">`;
        $("#map").append(htlm_s);
    }
    console.log('initmap ended');
}


//get the info for THIS establishment
let queryURL = "https://api.openbrewerydb.org/breweries/" + pubID;
let useLong = 0;
let useLat = 0;
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {
    console.log("resp:");
    console.log(response);
    show_addr(response);
    console.log("show_addr done?");
    if (response.latitude == null) {
        console.log("call get_latlog");
        latlong = get_latlog();
    }
    else {
        useLat = parseFloat(response.latitude);
        useLong = parseFloat(response.longitude);
    }

    var pos = {
        lat: useLat,
        lng: useLong
    };
    console.log("trying to show lat=" + pos.lat + "  long: " + pos.lng);
    let html_s = `
                    <div class="card-content white-text center-align">
                        <span class="card-title">
                            <h1 id="reviewHeader">${response.name}</h1>
                        </span>
                    </div>
                    <div class="card-action">
                         <div id="mapnew" >
                            <p class="yellow-text lighten-5">brewery info: <span id="type">brewery type, </span><span id="address">address, </span><a href="#" id="link">url</a></p>
                     </div>
                        
                    </div>`;

    if (doMap) {
        console.log('domaptrue2' + pos.lat + map.mapUrl);
        infoWindow.open(map);
        map.setCenter(pos);
        marker.setPosition(pos);
    }
    else {
        // i made a preliminary attempt to get either a png or the map to show up
        // but gave up as there was too much other stuff to do.  i encourage one of you to do this
        // and share it (after this is submitted!)

        /* does this interferre?
        console.log("nomap2");
        html_s = `<img src="assets/mapScreenShot.png">`;
        $("#map").append(html_s); */
    }

});
console.log("end of ajax");

//show posts
database.ref("/posts").on("child_added", function (childSnapshot) {
    postedName = childSnapshot.val().userName;
    postedMessage = childSnapshot.val().message;
    postedPubID = childSnapshot.val().pubID;
    if (postedPubID == pubID) {
        html_s =
            `
             <hr>
             <blockquote>
             <h3>${postedName}<h3>
             <h4>${postedMessage}<h4>
             </blockquote>
             `;
        $("#comments").append(html_s);
    }

});

//i got formatted phone function rom slashdot!
function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      var intlCode = (match[1] ? '+1 ' : '')
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
    }
    return phoneNumberString // fail caise
  }