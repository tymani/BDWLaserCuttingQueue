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

  var socket = io.connect();

  //form appear
  $("#join-queue-button").click(function() {
    $(".home-content").removeClass("stack-behind");
     $("#form-page").removeClass("hidden");
  })

  //form disappear

  $(".form-background").click(function() {
     formDisappear();
  });

  $("#form-exit-button").click(function() {
    formDisappear();
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

//checkbox logic on form
$("label#brown-school-checkbox").click(function (){
  if($("#brown-school-checkbox input")[0].checked) {
    $("#other-checkbox input")[0].checked = false;
  }

});
$("label#other-checkbox").click(function (){
  if($("#other-checkbox input")[0].checked) {
    $("#brown-school-checkbox input")[0].checked = false;
  }
});

//form submission
$("#form-submit-button").click(submitForm);

function submitForm () {
  //check that necessary parts of form are filled in
  var validForm = false;
  var brownCheckbox = $("#brown-school-checkbox input")[0].checked;
  var otherCheckbox = $("#other-checkbox input")[0].checked;
  var emailInput = $("#form-email-form input").val();
  var selectedTime = $("select option:selected").val();
  var selectTimeDefault = "Select Approx Time";
  var nameInput = $("#form-name-form input").val();

  if ((brownCheckbox || otherCheckbox) && validateEmail(emailInput) && selectedTime != selectTimeDefault && nameInput != "") {
    //a checkbox is marked
    //check that email is valid
    //check that dropdown is chosen
    //THIS FUNCTION SHOULD CALL TIMING FUNCTIONS TO DECIDE WHICH LASERCUTTER TO GO TO
    if(brownCheckbox) {
      //add to queue
      addToQueue(nameInput, "Lasercutter 2", selectedTime, true);
    } else {
      //add to queue
      addToQueue(nameInput, "Lasercutter 2", selectedTime, false);
    }

    validForm = true;

  }

  if(!validForm) {
    //show necessary false stuff
    alert("Please fill out all of form");
  }
  //run notification functions

  //close form
  formDisappear();


}

function addToQueue(name,lasercutter,cutLength,isBrown) {
  var newQueueElem = "<tr class='queue-elem-container selected'>"+
                        "<td class='queue-elem'>"+name+"</td>"+
                        "<td class='queue-elem'>"+lasercutter+"</td>"+
                        "<td class='queue-elem'>"+cutLength+"</td>"+
                    "</tr>"

  if(isBrown) {
    $(".queue-table tbody.brown-queue-elems-container").append(newQueueElem);
  } else {
    $(".queue-table tbody.other-queue-elems-container").append(newQueueElem);
  }
}

function validateEmail(email) {
  //placeholder Function
  return (email != "")


}

function formDisappear() {
  $(".home-content").addClass("stack-behind");
  $("#form-page").addClass("hidden");
}

});
