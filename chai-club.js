(function () {
  "use strict";

  var pageAddress = window.location.pathname + window.location.search;
  if (!/5995797/.test(pageAddress)) return;

  document.documentElement.classList.add("tc-chai");

  function polishChaiForm() {
    var form = document.getElementById("5995797");
    if (!form) return;

    var firstField = form.querySelector("#id_3");
    if (firstField && !form.querySelector("#tc-chai-head")) {
      var welcome = document.createElement("li");
      welcome.id = "tc-chai-head";
      welcome.className = "form-line";
      welcome.innerHTML =
        "<b>Become a monthly partner</b>" +
        "<h2>Join the Chai Club</h2>" +
        "<p>Choose the giving level that feels right, then complete your details and secure payment information.</p>";
      firstField.parentNode.insertBefore(welcome, firstField);
    }

    var submit = form.querySelector("#id_2 .form-submit-button");
    if (submit) {
      if (submit.tagName === "INPUT") submit.value = "Complete My Gift";
      else submit.textContent = "Complete My Gift";
      submit.setAttribute("aria-label", "Complete my Chai Club gift");
    }

    var recurring = form.querySelector("#input_24");
    if (recurring) {
      if (!recurring.dataset.chaiChoiceMade) {
        recurring.checked = true;
        recurring.defaultChecked = true;
        recurring.setAttribute("checked", "checked");
      }

      if (!recurring.dataset.chaiListenerAdded) {
        recurring.dataset.chaiListenerAdded = "true";
        recurring.addEventListener("change", function (event) {
          if (event.isTrusted) recurring.dataset.chaiChoiceMade = "true";
        });
      }
    }
  }

  function start() {
    polishChaiForm();

    var attempts = 0;
    var timer = window.setInterval(function () {
      polishChaiForm();
      attempts += 1;
      if (attempts > 40) window.clearInterval(timer);
    }, 250);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
