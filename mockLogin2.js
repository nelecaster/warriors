if (localStorage.getItem("userName") !== null) {
  $(".nav-name").text("Logged in as: "+localStorage.getItem("userName"));
}