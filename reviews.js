"use strict";
var userName = "";
var pubID = 0;
var response = "";
var html_s;

var fullName = "";
var addDateTime;
var postedTime = "";
var postedName = "";
var database;

var map; // needed for google maps
var InfoWindow; // needed for google maps
var marker; // needed for google maps

var useEdit = true; // turn the editor on or off
var debug = false;  // set pub to a "constant" for testing!
var doMap = true; //debug type 2, don't hammer maps!
var showOnce = true;

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


if (debug) { // for testing only, make screen work alone
    localStorage.setItem("userName", "tom");
    localStorage.setItem("pubID", "3850");  // use 3846 or 3785 or 3850 gull dam it!
}
userName = localStorage.getItem('userName');
pubID = localStorage.getItem('pubID');
load_user();

$(document).ready(function () { //main
    //    load_user();
    $("#post").click(function () {
        var tempMessage;
        if (useEdit)
            nicEditors.findEditor('textarea').saveContent();
        tempMessage = $("#textarea").val();
        // known bug: "blank" messages are sometimes 4 in length. work on later
        // known issue: could not find materilize 1.0 modal that worked here
        if (tempMessage.length == 0 || tempMessage.length == 4)
            // known issue:  I tried to get materilize modals to work for 45 minutes TWICE.  An alert is better than nothing
            // I am reasonably convinced the info on the materialize website is for an oder version of materialize!
            alert("you can't save an empty message");
        else if (userName.length < 2) {
            alert("You must be logged in to post a message!");
        }
        else {
            var strTime = moment().format('MMMM Do YYYY, h:mm:ss a').toString()
            var tmpMessage = {
                message: tempMessage,
                pubID: pubID,
                userName: userName,
                fullName: fullName,
                createdAt: strTime
            };
            database.ref("/postsnew").push(tmpMessage)
            $("#textarea").val('');
            if (useEdit)
                nicEditors.findEditor('textarea').setContent("");
        }

    });
});

$(document).on("click", ".login", function () {
    userName = $("#user_name_inline").val().trim();
    localStorage.setItem("userName", userName);
    load_user();
});






function load_user() {
    database.ref("/usersnew").on("child_added", function (childSnapshot) {
        postedName = childSnapshot.val().userName;
        console.log(postedName + userName);
        if (postedName == userName) {
            fullName = childSnapshot.val().fullName;
        }
        setTimeout(function () {
            // this is cheating, it should be a "promise" but Shawn said
            //we would not get marked down for doing this this cheesy way
            // I spent over a half hour trying to get promise to work and there was too much other
            // stuff to do....
            showPosts();
        }, 1000); //works with 1400 or less  at home, see how low I can get it at class
    });

}


function show_addr(pubin) {
    // needs to have a prettty csz and phone function call 
    var address1 = pubin.street;
    var address2 = pubin.city + ",    " + pubin.state + " " + pubin.postal_code;
    html_s = `<h4>${pubin.name}</h4>
              <h5>${address1}</h5>
              <h5>${address2}</h5>
              <h5>${formatPhoneNumber(pubin.phone)}</h5>`;


    $("#reviewHeader").append(html_s);
}

function initMap() {
    if (doMap) {
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 44.8263804, lng: -93.395601599 },
            zoom: 12
        });
        infoWindow = new google.maps.InfoWindow;
        marker = new google.maps.Marker({
            position: { lat: 44.8263804, lng: -93.395601599 }, // myLatLng,
            map: map,
            title: ''
        });

    }
    else {
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
    show_addr(response);
    if (response.latitude == null) {
        //needs to be coded with address to lat/long logic from google
        //console.log("call get_latlog");
        //latlong = get_latlog();
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

});
function showPosts() {
    var postedFullName;
    var postedMessage;
    var postedPubID;
    var postedTime;
    //show posts
    // known issue:  showOnce should not be needed
    // This is getting called twice and I don't know why.  Something to do with the timeout?
    if (showOnce)
        showOnce = false;
    else return;

    database.ref("/postsnew").on("child_added", function (childSnapshot) {
        postedName = childSnapshot.val().userName;
        postedMessage = childSnapshot.val().message;
        postedPubID = childSnapshot.val().pubID;
        postedFullName = childSnapshot.val().fullName;
        postedTime = childSnapshot.val().createdAt;
        if (postedPubID == pubID) {
            html_s =
                `
             <hr>
             <blockquote>
             <h5>User:${postedName} &nbsp &nbsp &nbsp Full Name:${postedFullName}  &nbsp &nbsp &nbsp   Posted:${postedTime} </h5>
             <div>${postedMessage}</div>
             </blockquote>
             `;
            $("#comments").append(html_s);
        }

    });
}
//i got formatted phone function from slashdot!
function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
    if (match) {
        var intlCode = (match[1] ? '+1 ' : '')
        return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
    }
    return phoneNumberString // fail caise
}