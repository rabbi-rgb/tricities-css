(function () {
  "use strict";

  var pageAddress = (window.location.pathname + window.location.search).toLowerCase();
  var isChaiAddress = /5995797/.test(pageAddress) || /^\/chai(?:\/|\?|$)/.test(pageAddress);
  var hasChaiForm = !!document.getElementById("5995797");

  if (!isChaiAddress && !hasChaiForm) return;

  document.documentElement.classList.add("tc-chai");

  // Load this page's small stylesheet independently of cached site headers.
  if (!document.getElementById("tc-chai-refinement-styles")) {
    var refinementStyles = document.createElement("link");
    refinementStyles.id = "tc-chai-refinement-styles";
    refinementStyles.rel = "stylesheet";
    refinementStyles.href = "https://rabbi-rgb.github.io/tricities-css/chai-club-refinement.css?v=9";
    document.head.appendChild(refinementStyles);
  }

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

    // Move the native fields themselves so reading and keyboard order agree.
    if (firstField && !form.dataset.chaiFlowReady) {
      ["id_28", "id_8", "id_18", "id_19", "id_24"].forEach(function (id) {
        var field = form.querySelector("#" + id);
        if (field) firstField.parentNode.insertBefore(field, firstField);
      });

      var other = form.querySelector("#other_8");
      var membership = form.querySelector("#id_24");
      if (other && membership) {
        var custom = document.createElement("li");
        custom.id = "tc-chai-custom";
        custom.className = "form-line";
        custom.innerHTML = '<div class="tc-chai-custom-copy"><label for="other_8">Prefer another amount?</label><p>Every monthly gift makes a difference.</p></div><div class="tc-chai-custom-input"></div>';
        custom.querySelector(".tc-chai-custom-input").appendChild(other.closest(".form-radio-item"));
        membership.parentNode.insertBefore(custom, membership);
        form.querySelector("#input_8").setAttribute("placeholder", "Amount in CAD");
        form.querySelector("#input_8").setAttribute("data-otherhint", "Amount in CAD");
      }

      var amountHeading = form.querySelector("#id_28");
      if (amountHeading) {
        var currency = document.createElement("p");
        currency.className = "tc-chai-currency";
        currency.textContent = "All amounts in CAD per month";
        amountHeading.appendChild(currency);
      }

      var contactHeading = document.createElement("li");
      contactHeading.className = "form-line";
      contactHeading.id = "tc-chai-details";
      contactHeading.innerHTML = "<h3>Your details</h3>";
      firstField.parentNode.insertBefore(contactHeading, firstField);
      form.dataset.chaiFlowReady = "true";
    }

    // One continuous giving panel, inspired by the course page's calm sections.
    // Move existing rows intact; keep all field IDs, names and native handlers.
    var joinStart = form.querySelector("#tc-chai-head");
    var joinEnd = form.querySelector("#id_2");
    if (joinStart && joinEnd && joinStart.parentNode === joinEnd.parentNode && !form.querySelector("#tc-chai-join-panel")) {
      var panel = document.createElement("li");
      panel.id = "tc-chai-join-panel";
      panel.className = "form-line";
      panel.innerHTML = '<section aria-labelledby="tc-chai-join-title"><ul class="tc-chai-join-fields"></ul></section>';
      joinStart.querySelector("h2").id = "tc-chai-join-title";
      joinStart.parentNode.insertBefore(panel, joinStart);
      var row = joinStart;
      while (row) {
        var nextRow = row.nextSibling;
        panel.querySelector(".tc-chai-join-fields").appendChild(row);
        if (row === joinEnd) break;
        row = nextRow;
      }
    }

    if (!form.dataset.chaiAmountListener) {
      form.dataset.chaiAmountListener = "true";
      form.addEventListener("change", function (event) {
        var selected = event.target;
        if (!selected.matches('#input_8_0, #input_8_1, #input_8_2, #other_8, #input_18_0, #input_18_1, #input_18_2, #other_18, #input_19_0, #input_19_1, #input_19_2, #other_19') || !selected.checked) return;
        ["8", "18", "19"].forEach(function (tier) {
          form.querySelectorAll('#id_' + tier + ' input[type="radio"], #tc-chai-custom input[name="q' + tier + '_monthlyContribution"]').forEach(function (radio) {
            if (radio !== selected && radio.checked) {
              radio.checked = false;
              radio.dispatchEvent(new Event("change", { bubbles: true }));
            }
          });
          var customInput = form.querySelector("#input_" + tier);
          if (customInput && selected.id !== "other_" + tier) {
            customInput.value = "";
            customInput.disabled = true;
          }
        });
        if (selected.id === "other_8") form.querySelector("#input_8").disabled = false;
      });
    }

    var hero = document.querySelector(".article-header");
    if (hero && !hero.querySelector(".tc-chai-hero-action")) {
      var action = document.createElement("div");
      action.className = "tc-chai-hero-action";
      action.innerHTML = '<p>Monthly partners sustaining Jewish life in the Tri-Cities</p><a href="#tc-chai-head">Join the Chai Club <span aria-hidden="true">&#8594;</span></a>';
      hero.appendChild(action);
      hero.classList.add("tc-chai-hero-ready");
    }

    // Bring the giving section directly into view.
    var heroJoin = hero && hero.querySelector(".tc-chai-hero-action a");
    if (heroJoin && !heroJoin.dataset.chaiJumpReady) {
      heroJoin.dataset.chaiJumpReady = "true";
      heroJoin.addEventListener("click", function (event) {
        var target = form.querySelector("#tc-chai-head");
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ block: "start", behavior: "instant" });
      });
    }

    // Repair a duplicated Instagram URL in this page's inherited footer.
    document.querySelectorAll('a[href*="instagram.com/https://"]').forEach(function (link) {
      var match = link.href.match(/^https:\/\/(?:www\.)?instagram\.com\/(https:\/\/(?:www\.)?instagram\.com\/.+)$/);
      if (match) link.href = match[1];
    });

    var submitRow = form.querySelector("#id_2");
    if (submitRow && !submitRow.querySelector(".tc-chai-reassurance")) {
      var reassurance = document.createElement("p");
      reassurance.className = "tc-chai-reassurance";
      reassurance.textContent = "Secure payment · Change or cancel your monthly gift anytime";
      submitRow.appendChild(reassurance);
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
