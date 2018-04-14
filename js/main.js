$(document).ready(() => {

  var activeTimer = "Brown";
  //change timer
  //brown timer starts active
  $("#timer-brown-button").click(function(event) {
    event.preventDefault();
    $("#timer-other-form").addClass("non-active-timer");
    $("#timer-brown-form").removeClass("non-active-timer");
    activeTimer = "Brown";
  });

  $("#timer-other-button").click(function(event) {
    event.preventDefault();
    $("#timer-brown-form").addClass("non-active-timer");
    $("#timer-other-form").removeClass("non-active-timer");
    activeTimer = "Other";
  });


  //header motion
  var headerHeight = $("header").height();
  $(document).on("scroll",function() {
    if ($(document).scrollTop() > headerHeight) {
      $("header").addClass("header-scroll");
    } else {
      $("header").removeClass("header-scroll");
    }
  });


  //form adding
  $("#join-queue-button").click(function() {
    $(".home-content").removeClass("stack-behind");
     $("#form-page").removeClass("hidden");
  })

  //form disappear

  $(".form-background").click(function() {
     $("#form-page").addClass("hidden");
     $(".home-content").addClass("stack-behind");
  });

  $("#form-exit-button").click(function() {
    $("#form-page").addClass("hidden");
    $(".home-content").addClass("stack-behind");
  });

  //hidden messages

  $("#bdw-logo").hover(function () {
    $("#bdw-logo-hidden-message").removeClass("hidden");
    $(document).bind('mousemove', function(e){
      $('#bdw-logo-hidden-message').css({
         left:  e.pageX - 40,
         top:   e.pageY - 30
      });
    });
  }, function () {
    $(document).unbind();
    $("#bdw-logo-hidden-message").addClass("hidden");
  });


  $(".time-background-block").hover(function () {
    //find which timer is active
    var hiddenMessage = null;
    if(activeTimer === "Brown") {
      hiddenMessage = $("#timer-brown-hidden-message");
      hiddenMessage.removeClass("hidden");
      $(document).bind('mousemove', function(e){
        hiddenMessage.css({
           left:  e.pageX - 170,
           top:   e.pageY - 40
        });
      });
    } else {
      hiddenMessage = $("#timer-other-hidden-message");
      hiddenMessage.removeClass("hidden");
      $(document).bind('mousemove', function(e){
        hiddenMessage.css({
           left:  e.pageX - 220,
           top:   e.pageY - 40
        });
      });
    }




  }, function () {
    $(document).unbind();

    var hiddenMessage = null;
    if(activeTimer === "Brown") {
      hiddenMessage = $("#timer-brown-hidden-message");
    } else {
      hiddenMessage = $("#timer-other-hidden-message");
    }

    hiddenMessage.addClass("hidden");
  });



});
