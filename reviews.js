
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
    apiKey: "redact",
    authDomain: "test-ed6f8.firebaseapp.com",
    databaseURL: "https://test-ed6f8.firebaseio.com",
    projectId: "test-ed6f8",
    storageBucket: "test-ed6f8.appspot.com",
    messagingSenderId: "609445629844"
};
firebase.initializeApp(config);



database = firebase.database();


if (debug) {
    localStorage.setItem("userName", "tom");
    localStorage.setItem("pubID", "3846");  // use 3846 or 3785
}

// alert the value to check if we got it
userName = localStorage.getItem('userName');
pubID = localStorage.getItem('pubID');

//put this error in to warn a programmer that conditions were not made to run this
//don't mark me for using alert, this is only to warn programmers
if (pubID == null || userName == null)
    alert("review.js rejected this because either pubid or username were null");

$(document).ready(function () {
    $("#post").click(function () {
        var tmpm;
        console.log("rutville edit is:" + useEdit)
        if (useEdit)
            nicEditors.findEditor('textarea').saveContent();
        tmpm = $("#textarea").val();
        if (tmpm.length == 0)
            alert("you can't save an empty message");
        else {
            var tmpMessage = {
                message: tmpm,
                pubID: pubID,
                userName: userName,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            };
            database.ref().push(tmpMessage)
        }
        $("#textarea").val('');
        console.log("edit debugh:" + useEdit);
        if (useEdit)
            nicEditors.findEditor('textarea').setContent("");

    });
});
function show_addr(pubin) {
    // needs to have a prettty csz and phone function call 
    html_s = `<h2>${pubin.name}</h2>
              <h2>${pubin.street}<h2>
              <h2>${pubin.city}<h2>
              <h2>${pubin.state}<h2>
              <h2>${pubin.postal_code}<h2>
              <h2>${pubin.phone}<h2>`;

    $("#address").append(html_s);
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
database.ref().on("child_added", function (childSnapshot) {
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

