var postCount = []; // this looks like an array but actually has a string in it
var numtest = 0;
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
setTimeout(function() {
  // this is cheating, it shoudl be a promise but Shawn said
  //we would not get marked down for doing this this cheasy way
  showCounts();
}, 1500); // how low can this safely go?  TEST on their network to see
function getCounts() {
  database.ref().on("child_added", function(childSnapshot) {
    thisPub = childSnapshot.val().pubID;
    if (typeof postCount[thisPub] == "undefined") postCount[thisPub] = 0;
    postCount[thisPub] = postCount[thisPub] + 1;
  });
}
function showCounts() {
  var postIDX;
  var txt;
  var numPosts = 0;
  // put jquery stuff in here to show number of posts
  //  we loop thru (for each) all h1's filtering out
  // only those beggining with "postsfor"  the ^ means begins with in JS regular expressions
  $("h1")
    .filter(function() {
      return /^postsfor/.test(this.id);
    })
    .each(function() {
      // set txt to an array consisting of each \d (numbers) in the string
      txt = this.id.match(/\d/g);
      postIDX = txt.join("");
      numPosts = postCount[postIDX];
      // pubs with no posts returns undefined
      // because the associative array was enver defined for them
      if (typeof numPosts == "undefined") numPosts = 0;
      $("#postsfor" + postIDX).html(numPosts);
    });


    
  $(document).ready(function() {
    var State = "Minnesota";
    var queryURL =
      "https://api.openbrewerydb.org/breweries?by_state=" +
      State +
      "&per_page=50";

    $(document).on("click", ".fa-flask", function() {
      console.log("fa-flask click");
      location.href = "reviews.html";
    });

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      var results = response;

      for (var i = 0; i < results.length; i++) {
        var pubID = results[i].id;

        console.log("pubid is " + pubID);

        var breweryType = results[i].brewery_type;
        var breweryName = results[i].name;
        var breweryPhone = results[i].phone;

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
          results[i].street + " " + results[i].city + " " + results[i].state;
        console.log("Address is " + address);
        if (breweryType === "planning") {
          continue;
        }
        if (city === "") {
          address = results[i].street + " " + results[i].state;
        }

        var newRow = $("<tr>").append(
          $("<td>").text(breweryName),
          $("<td>").text(breweryType),
          $("<td>").text(address),
          $("<td>").text(breweryPhone)
        );

        //newRow.append("<br>");
        var reviews = newRow.append($("<td>").append("" + pubID + " reviews"));
        newRow.append($("<td>").append(GoButton));

        reviews.attr("id", "postsfor" + pubID);
        $("#breweryTable").attr("class", "responsive-table highlight");
        $("#breweryTable > tbody").append(newRow);

        localStorage.setItem("userName", "tom");
        localStorage.setItem("pubID", pubID);
      }
    });
  });
}
