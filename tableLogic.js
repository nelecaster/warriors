$(document).ready(function() {

    var State = "Minnesota";
    var queryURL = "https://api.openbrewerydb.org/breweries?by_state=" + State + "&per_page=50";
    
    

    $.ajax({
        url: queryURL,
        method: "GET"


    }).then(function(response) {
        
        var results = response;
        
         
        for (var i = 0; i<results.length; i++) {
            
            var pubID = results[i].id;
            
            console.log("pubid is " + pubID);
            
            var breweryType = results[i].brewery_type;
            var breweryName = results[i].name;
            var breweryPhone = results[i].phone;
            
            var city = results[i].city;
            
             

            var address = results[i].street + " " + results[i].city + " " + results[i].state; 
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
                $("<td>").text(breweryPhone));
            $("#breweryTable > tbody").append(newRow);
               

        }
    })
})

