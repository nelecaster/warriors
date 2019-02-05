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
$(document).ready(function () {
var fullName = $('#full_name').val().trim();

var userName = $('#user_name').val().trim();

var email = $('#email').val().trim();

var password = $('#password').val().trim();


$("#button").on('click', function() {
console.log(fullName);
console.log(userName);
console.log(email);
console.log(password);
      
           var tmpUser = {
               fullName: fullName,
               userName: userName,
               email: email,
               password: password,
               createdAt: firebase.database.ServerValue.TIMESTAMP
           };
           database.ref("/messages").push(tmpUser);
       
})

})