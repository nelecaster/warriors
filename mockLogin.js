var login = false;
var fullName;


// $("#loginButton").on('click', function () {
//     login = true;
//     console.log(login)
//     fullName = $('#user_name_inline').val().trim();
//     localStorage.setItem("userName", fullName);

//     $(".card-action").empty(this).append("Welcom Back " + fullName);
//     console.log(localStorage)
// });

// if(login = true){
//     //$(".card-action").text(localStorage.getItem("userName"));
// };


$("#loginButton").on("click", function(event) {
    login=true;

    event.preventDefault();
    $("#user_name_inline").html("");
    var username = $("#user_name_inline").val().trim();
    localStorage.clear();
    localStorage.setItem("userName", username);
    $(".card-action").html('Welcome Back, ' + localStorage.getItem("userName")+'      <a href="#" id="logoutButton2">LogOut</a>');
  });

  // By default (upon load) show the name stored in localStorage using "localStorage.getItem"
if (localStorage.getItem("userName") !== null) {
    //...
    $(".card-action").html('Welcome Back, ' + localStorage.getItem("userName")+' <a href="#" id="logoutButton2">LogOut</a>');
};

$(document).on('click', '#logoutButton2', function() {
    event.preventDefault();
    localStorage.clear();
    location.reload();

})
