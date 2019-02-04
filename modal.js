
//this stuff all needs to get moved to the main JS program for
// the "admin.html" (newuser.html?) file. assuming there is a document ready section
// just the lines in the block need to be added..


$(document).ready(function() {
    $('select').material_select();

    // for HTML5 "required" attribute
    $("select[required]").css({
      display: "inline",
      height: 0,
      padding: 0,
      width: 0
    });
  });