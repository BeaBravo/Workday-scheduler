// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
  // TODO: Add code to display the current date in the header of the page.
  //Dependencies
  var currentDayEl = $("#currentDay");
  var timeBlocks = $(".time-block");
  var hourBlock = $(".hour");
  var saveButton = $(".saveBtn");

  //global variables
  var todaysDate;

  var todaysEvents = {};

  var eventId;
  var eventText;

  //functions
  function init() {
    setInterval(getTodaysDate, 1000);
    getTodaysDate();
    colorCodeBlocks();
    renderEvents();
  }

  function getTodaysDate() {
    todaysDate = dayjs();
    currentDayEl.text(todaysDate.format("dddd, MMMM D YYYY "));
  }

  function colorCodeBlocks() {
    //this function will grab the time in the block text, convert it to a dayjs date
    //and compare it to the current time

    var currentday = todaysDate.format("YYYY-MM-DD");
    var currentTime = todaysDate.hour();
    var i = 0;
    //check for each hour block time to see if it's in the future
    hourBlock.each(function () {
      var blockHour = $(this).text();
      var newTime =
        currentday +
        " " +
        blockHour.slice(0, -2) +
        ":00 " +
        blockHour.slice(-2);
      var blockTimeDJS = dayjs(newTime);
      var inFuture = todaysDate.isBefore(blockTimeDJS);

      if (blockTimeDJS.hour() === currentTime) {
        $(timeBlocks[i]).addClass("present");
      } else if (inFuture) {
        $(timeBlocks[i]).addClass("future");
      } else {
        $(timeBlocks[i]).addClass("past");
      }
      i++;
    });
  }

  function saveEvent() {
    //this function is triggered by clicking on any of the buttons
    // grab the ID of the parent (which will be the block) and display the message
    var idParent = $(this).parent().attr("id");
    var parentEl = $("#" + idParent);
    var textEl = parentEl.children("textarea");
    eventId = "#" + idParent;
    eventText = textEl.val().trim();

    localStorage.setItem(eventId, eventText);

    // localStorage.setItem("events", JSON.stringify(todaysEvents));
    renderEvents();
    //will grab text and save it to local storage
  }

  function renderEvents() {
    // grab from local storage and place in their specific id
    for (var i = 0; i < localStorage.length; i++) {
      var id = localStorage.key(i);
      $(id).children("textarea").val(localStorage.getItem(id));
    }
  }
  //user interaction
  saveButton.each(function () {
    $(this).on("click", saveEvent);
  });

  //initializations
  init();
});
