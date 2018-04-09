$(document).ready(() => {
  //change timer
  //brown timer starts active
  $("#timer-brown-button").click(function(event) {
    event.preventDefault();
    $("#timer-other-form").addClass("non-active-timer");
    $("#timer-brown-form").removeClass("non-active-timer");
  });

  $("#timer-other-button").click(function(event) {
    event.preventDefault();
    $("#timer-brown-form").addClass("non-active-timer");
    $("#timer-other-form").removeClass("non-active-timer");
  });


  //header motion
  var headerHeight = $("header").height();
  console.log(headerHeight);
  $(document).on("scroll",function() {
    if ($(document).scrollTop() > headerHeight) {
      $("header").addClass("header-scroll");
    } else {
      $("header").removeClass("header-scroll");
    }
  });


  //form adding
  //$("#join-queue-form").submit()

});
