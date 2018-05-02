$(document).ready(() => {
  var socket = io.connect();

  /******************** HTML/Webpage Interactions  ********************/

  /* Header Scroll Motion Interaction */
  var headerHeight = $("header").height();
  $(document).on("scroll",function() {
    if ($(document).scrollTop() > headerHeight) {
      $("header").addClass("header-scroll");
    } else {
      $("header").removeClass("header-scroll");
    }
  });

  /* ---------------------------------------------------*/

  /* Join Queue Form Appear Interaction */
  $("#join-queue-button").click(function() {
    $(".home-content").removeClass("stack-behind");
     $(".form-page").removeClass("hidden");
  });



  /* Join Queue Form Disappear */
  //When outside the form is clicked
  $(".form-background").click(function() {
     formDisappear();
  });
  //When the "X" button is clicked
  $("#form-exit-button").click(function() {
    formDisappear();
  });


/* ---------------------------------------------------*/

  /* Hidden Messages Hover Interactions */
  // Monitor Sign in Message Hover
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

  //Timer Message Hover
  $(".time-background-block").hover(function () {
    var hiddenMessage = $("#timer-brown-hidden-message");
    hiddenMessage.removeClass("hidden");
    $(document).bind('mousemove', function(e){
      hiddenMessage.css({
         left:  e.pageX - 170,
         top:   e.pageY - 40
      });
    });

  }, function () {
    $(document).unbind();
    var hiddenMessage = $("#timer-brown-hidden-message");
    hiddenMessage.addClass("hidden");
  });


  /* --------------------------------------------------- */

  /* Join Queue Form Submission */
  $("#form-submit-button").click(submitForm);

  function submitForm () {
    //check that necessary parts of form are filled in
    var validForm = false;
    var selectedTime = $("select option:selected").val();
    var selectTimeDefault = "Select Approx Time";

    if (selectedTime != selectTimeDefault) {
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


  // Server emits this on connection to give initial state of the queue
  socket.on('handshake', function(queue) {
    renderQ(queue);
  });

  // Server emits this whenever new client connects
  socket.on('joined', function(queue) {
    renderQ(queue);
  });

  socket.on('deleted', function(username, queue) {
    renderQ(queue);
    if (username == getMeta('username')) {
        //TODO This client has been removed from queue.
    }
  });














//TODO This is a function that will take care of rendering the new state of the queue
function renderQ(queue) {
  var thisname = getMeta('username');

}

function addToQueue(name,lasercutter,cutLength) {
  var newQueueElem = "<tr class='queue-elem-container selected'>"+
                        "<td class='queue-elem'>"+name+"</td>"+
                        "<td class='queue-elem'>"+cutLength+"</td>"+
                    "</tr>"


    $(".queue-table").append(newQueueElem);
}

function validateEmail(email) {
  //placeholder Function
  return (email != "")


}

function getMeta(name) {
  var tag = document.querySelector('meta[name=' + name + ']');
  if (tag != null)
    return tag.content;
  return '';
}

function formDisappear() {
  $(".home-content").addClass("stack-behind");
  $(".form-page").addClass("hidden");
}


//phone number checkbox clicked
$("#phone-notification-checkbox input").click(function () {
  //make phone number appear if checked
  //make disappear if unchecked
  if($("#phone-notification-checkbox input")[0].checked) {
    $(".phone-number-module").removeClass("hidden");
    $(".form-content-box").css("height", "400px");
  } else {
    $(".phone-number-module").addClass("hidden");
    $(".form-content-box").css("height", "320px");
  }
});


/*******************************************/
/*         Client Time Logic              */
/******************************************/





var userId = -1;

var ticking = null;

var currHour = 0;
var currMin = 0;


changeTimer(60);
//each queue element has the following attributes
// userid
//time
//length
//phone number
//email

socket.on("joined", function(queue) { // what is the type of the list
  //first element in list is current user on laser1
  //second element in list is current user on laser2

  //make ticking timer with total time in list
  var timeRemaining = 0;

  for(var i = 0; i < queue.length; i++) {
    if(queue[i].userid != userId) {
      timeRemaining += queue[i].cut_length;
    } else {
      break;
    }

  }

  updateTimer(timeRemaining);

  //print rest of list
  //mark our current user in the list


});
// updates the current time on the timer
//timeRemaining : time remaining until user can sign up
function updateTimer(timeRemaining) {
  //change the current timer time remaining to new timeRemaining
  changeTimer(timeRemaining);

}

function changeTimer(newTime) {
  var timer = $(".timer-time")[0];
  //stop old timer
  stopTickingTimer();


  var minutes = 0;
  var hours = 0;
  //newTime is in minutes
  //find out if hours units are required
  if(newTime >= 60) {
    hours = Math.floor(newTime / 60);
    minutes = newTime - (hours * 60);

  } else {
    minutes = newTime;
  }

  //print out new timer
  printTimer(hours,minutes);

  //set global variables
  currMin = minutes;
  currHour = hours;

  //start ticking timer
  ticking = setInterval(function () {tickingTimer();}, 60000);



}


function printTimer(hours, minutes) {
  var timer = $(".timer-time");
  //remove current time
  while (timer[0].hasChildNodes()) {
    timer[0].removeChild(timer[0].lastChild);
  }

  var hourUnits = "";
  var minuteUnits = "";

  if(minutes > 1) {
    minuteUnits = " mins";
  } else {
    minuteUnits = " min";
  }

  if (hours > 0) {

    if(hours > 1) {
      hourUnits  = " hrs";
    } else {
      hourUnits = " hr";
    }
    var printHours = "<div class='timer-time-hours'>" + hours + hourUnits + "</div>";

    if (minutes > 0) {
      var printMinutes = "<div class='timer-time-hours'>" + minutes + minuteUnits + "</div>";
      timer.append(printMinutes);
    }

    timer.append(printHours);

  } else {

    var printMinutes = "<div class='timer-time-hours'>" + minutes + " mins" + "</div>";
    timer.append(printMinutes);

  }
}

function tickingTimer() {

  if(currMin > 0) {
    currMin--;
  } else if (currHour > 0) {
    currHour--;
    currMin = 59;
  } else {
    stopTickingTimer();
    printEmptyQueuePage();
    return;
  }


  printTimer(currHour, currMin);
}

function stopTickingTimer() {
  if(ticking != null) {
    clearInterval(ticking);
  }
}

function printEmptyQueuePage() {
  console.log("TBD");
}


//make timeremaingin function
//make lasercutter assignment fucntion
//every client is updated with who currently at the


});
