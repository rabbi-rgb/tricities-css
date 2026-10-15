
(function () {
  function addReservationPlaceholders() {
    if (window.location.href.indexOf("/tools/events/register_cdo/eventid/23975") === -1) {
      return;
    }

    var reservations = document.querySelectorAll("#RegisterBody .reservation");

    reservations.forEach(function (reservation) {
      var inputs = reservation.querySelectorAll("input.co_form_input, input[type='text']");

      if (inputs[0]) {
        inputs[0].setAttribute("placeholder", "First name");
        inputs[0].setAttribute("aria-label", "Attendee first name");
      }

      if (inputs[1]) {
        inputs[1].setAttribute("placeholder", "Last name");
        inputs[1].setAttribute("aria-label", "Attendee last name");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addReservationPlaceholders);
  } else {
    addReservationPlaceholders();
  }

  var registrationBody = document.querySelector("#RegisterBody");
  if (registrationBody) {
    new MutationObserver(addReservationPlaceholders).observe(registrationBody, {childList:true, subtree:true});
  }
  setTimeout(addReservationPlaceholders, 500);
  setTimeout(addReservationPlaceholders, 1500);
  setTimeout(addReservationPlaceholders, 3000);
})();
