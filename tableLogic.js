var postCount = []; // this looks like an array but actually has a string in it
var numtest = 0;
var html_s = "";
var userName = "";
var config = {
  apiKey: "AIzaSyAzGg64gHxEiXXBu09jlQEl97bg-kRhZ_I",
  authDomain: "beer-review-2.firebaseapp.com",
  databaseURL: "https://beer-review-2.firebaseio.com",
  projectId: "beer-review-2",
  storageBucket: "beer-review-2.appspot.com",
  messagingSenderId: "756701042097"
};

firebase.initializeApp(config);
var database = firebase.database();

getCounts();

setTimeout(function () {
  // this is cheating, it should be a "promise" but Shawn said
  //we would not get marked down for doing this this cheesy way
  // I spent over a half hour trying to get promise to work and there was too much other
  // stuff to do....
  getPublist();
}, 2000); //works with 1400 or less  at home, see how low I can get it at class

function getCounts() {
  console.log("reachgetcounts");
  database.ref().on("child_added", function (childSnapshot) {
  thisPub = childSnapshot.val().pubID;
    console.log("ingettcounts" + postCount[thisPub] + thisPub);
    if (typeof( postCount[thisPub]) == "undefined") 
        postCount[thisPub] = 0;
    postCount[thisPub] = postCount[thisPub] + 1;
  });
}

$(document).ready(function () {
  $(document).on("click", ".fa-flask", function () {
    // userName = $("#user_name_inline").val().trim();
    // console.log(userName);
    // localStorage.setItem("userName", userName);
    console.log("fa-flask click");
    $(this).attr('id')
    // set pub id so that reviews knows which pub we clicked
    localStorage.setItem("pubID", $(this).attr('id'));
    location.href = "reviews.html";
  });
});

function getPublist() {
  var State = "Minnesota";
  var queryURL =
    "https://api.openbrewerydb.org/breweries?by_state=" +
    State +
    //change to 50 when done
    "&per_page=50";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    var results = response;

    for (var i = 0; i < results.length; i++) {
      var pubID = results[i].id;

      console.log("pubid is " + pubID);

      var breweryType = results[i].brewery_type;
      var breweryName = results[i].name;
      var breweryPhone = formatPhoneNumber(results[i].phone);
      //  var breweryPhone = formatPhoneNumber(results[i].phone);

      var city = results[i].city;

      var GoButton = $("<button>");
      $(GoButton).attr("type", "button");
      $(GoButton).text("Go!");
      $(GoButton).attr("id", pubID);
      $(GoButton).attr(
        "class",
        "waves-effect z-depth-5 btn-floating btn-large cyan fas fa-flask"
      );
      $(GoButton).attr("type", "submit");
      $(GoButton).attr("href", "reviews.html");

      var address =
        results[i].street + ", " + results[i].city + " " + results[i].state;
      console.log("Address is " + address);
      if (breweryType === "planning") {
        continue;
      }
      if (city === "") {
        address = results[i].street + " " + results[i].state;
      }
      if (typeof (postCount[pubID]) == "undefined")
        postCount[pubID] = 0;

      var newRow = $("<tr>").append(
        $("<td>").text(breweryName),
        $("<td>").text(breweryType),
        $("<td>").text(address),
        //$("<td>").text(breweryPhone),
        $("<td>").text(breweryPhone),
        //$("<td>").html("0 posts"),
        //$('<td id="postsfor' + pubID + '">').text("-")
        $("<td>").text(postCount[pubID])
      );

      //newRow.append("<br>");
      //var reviews = newRow.append($("<td>").append("" + pubID + " reviews"));

      newRow.append($('<td id="' + pubID + '">').append(GoButton));

      //html_s = '$(<td id="' + pubID + '">).append(GoButton)'      );
      //newRow.append  (     '$(<td id="' + pubID + '">).append(GoButton)'      );

      //reviews.attr("id", "postsfor" + pubID);
      $("#breweryTable").attr("class", "responsive-table highlight");
      $("#breweryTable > tbody").append(newRow);

    }
  });
  //i got formatted phone function rom slashdot!, would not run when in global scope?
  function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      var intlCode = (match[1] ? '+1 ' : '')
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
    }
    return phoneNumberString // fail caise
  }


}