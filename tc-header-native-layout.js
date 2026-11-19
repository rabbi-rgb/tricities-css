/* ==== script block 1 ==== */
document.addEventListener("DOMContentLoaded", function () {
  var targetPath = "/tools/events/register_cdo/eventid/23102";

  if (window.location.pathname === targetPath) {
    var style = document.createElement("style");
    style.innerHTML =
      ".master-content-wrapper.g960 header.article-header { display: none !important; }";
    document.head.appendChild(style);
  }
});

/* ==== script block 2 ==== */
(function () {
  var path = window.location.pathname;
  var search = window.location.search;

  var highHolidayAids = [
    "6560420",
    "7431739",
    "6560419",
    "6560421",
    "6567327",
    "6583317",
    /* Tashlich & Shofar */
    "7452107",
  ];

  var isHighHolidaysPage = highHolidayAids.some(function (aid) {
    return (
      path.indexOf("/aid/" + aid + "/") !== -1 ||
      search.indexOf("aid=" + aid) !== -1
    );
  });

  if (isHighHolidaysPage) {
    document.documentElement.classList.add("tc-high-holidays-minisite");
  }
  if (!isHighHolidaysPage) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://rabbi-rgb.github.io/tricities-css/site-theme.css?v=43";
    document.head.appendChild(link);
  }
})();

/* ==== script block 3 ==== */
(function () {
  if (window.location.pathname === "/tools/feedback.htm") {
    document.documentElement.classList.add("tc-contact-modern-page");
  }
})();

/* ==== tc-hh-reservations-page-scope ==== */
(function () {
  var path = window.location.pathname || "";
  var search = window.location.search || "";
  var isReservationsPage =
    /\/aid\/7431739(?:\/|$)/.test(path) ||
    /(?:^|[?&])aid=7431739(?:&|$)/.test(search);

  if (isReservationsPage) {
    document.documentElement.classList.add("tc-hh-reservations-final");
  }
})();

/* ==== tc-tashlich-page-scope ==== */
(function () {
  var path = window.location.pathname || "";
  var search = window.location.search || "";
  var isTashlichPage =
    /\/aid\/7452107(?:\/|$)/.test(path) ||
    /(?:^|[?&])aid=7452107(?:&|$)/.test(search);

  if (isTashlichPage) {
    document.documentElement.classList.add("tc-hh-tashlich-final");
  }
})();

/* ==== tc-tashlich-page-behavior ==== */
(function () {
  var path = window.location.pathname || "";
  var search = window.location.search || "";
  var isTashlichPage =
    /\/aid\/7452107(?:\/|$)/.test(path) ||
    /(?:^|[?&])aid=7452107(?:&|$)/.test(search);

  if (!isTashlichPage) return;

  function emitFormEvents(input) {
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function prepareCounters(form) {
    ["50", "48"].forEach(function (id) {
      var field = form.querySelector("#id_" + id);
      if (!field) return;

      var wrapper = field.querySelector(".custom-number-wrapper");
      var input = field.querySelector("input[type='number']");
      if (!wrapper || !input) return;

      var minus = wrapper.querySelector(".qty-btn.minus");
      var plus = wrapper.querySelector(".qty-btn.plus");
      if (!minus || !plus) return;

      input.min = input.min || "0";
      input.setAttribute("inputmode", "numeric");

      function bindButton(button, direction) {
        if (button.getAttribute("data-tc-tashlich-counter") === "true") return;
        button.setAttribute("data-tc-tashlich-counter", "true");
        button.removeAttribute("style");

        button.addEventListener(
          "click",
          function (event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            var current = Number(input.value);
            if (!Number.isFinite(current)) current = 0;

            var step = Number(input.step);
            if (!Number.isFinite(step) || step <= 0) step = 1;

            var minimum = Number(input.min);
            if (!Number.isFinite(minimum)) minimum = 0;

            var maximumAttribute = input.getAttribute("max");
            var maximum =
              maximumAttribute === null || maximumAttribute === ""
                ? Infinity
                : Number(maximumAttribute);
            var next = current + direction * step;
            next = Math.max(minimum, next);
            if (Number.isFinite(maximum)) next = Math.min(maximum, next);

            input.value = String(next);
            emitFormEvents(input);
          },
          true
        );
      }

      bindButton(minus, -1);
      bindButton(plus, 1);
    });
  }

  function prepareAddress(form) {
    var row = form.querySelector("#id_7");
    if (!row) return;

    var toggle = row.querySelector(".tc-tashlich-address-toggle");
    var fields = row.querySelector(".form-input");

    if (!toggle) {
      toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "tc-tashlich-address-toggle";
      toggle.textContent = "Add mailing address (optional)";
      toggle.setAttribute("aria-controls", "cid_7");
      row.insertBefore(toggle, fields || row.firstChild);
    }

    var hasSavedValue = Array.prototype.some.call(
      row.querySelectorAll("input, select"),
      function (field) {
        return Boolean(field.value && field.value.trim());
      }
    );

    if (!row.hasAttribute("data-tc-address-ready")) {
      row.classList.toggle("tc-address-collapsed", !hasSavedValue);
      row.setAttribute("data-tc-address-ready", "true");
    }

    function syncAddressState() {
      var collapsed = row.classList.contains("tc-address-collapsed");
      var label = collapsed
        ? "Add mailing address (optional)"
        : "Hide mailing address";
      toggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
      if (toggle.textContent.trim() !== label) {
        toggle.textContent = label;
      }
      if (fields)
        fields.setAttribute("aria-hidden", collapsed ? "true" : "false");
    }

    if (toggle.getAttribute("data-tc-address-toggle") !== "true") {
      toggle.setAttribute("data-tc-address-toggle", "true");
      toggle.addEventListener("click", function () {
        row.classList.toggle("tc-address-collapsed");
        syncAddressState();
      });
    }

    syncAddressState();
  }

  function prepareSponsorship(form) {
    var group = form.querySelector("#id_37");
    var total = form.querySelector("#total_amount");
    if (!group) return;

    function sponsorshipSelected() {
      return Boolean(group.querySelector("input[type='checkbox']:checked"));
    }

    function syncSponsorship() {
      var totalHasValue = false;
      if (total) {
        var amount = Number((total.textContent || "").replace(/[^0-9.]/g, ""));
        totalHasValue = Number.isFinite(amount) && amount > 0;
      }
      form.classList.toggle(
        "tc-has-sponsorship",
        sponsorshipSelected() || totalHasValue
      );
    }

    if (group.getAttribute("data-tc-sponsorship-ready") !== "true") {
      group.setAttribute("data-tc-sponsorship-ready", "true");
      group.addEventListener("change", function () {
        syncSponsorship();
        window.setTimeout(syncSponsorship, 60);
        window.setTimeout(syncSponsorship, 350);
      });
      group.addEventListener("input", function () {
        window.setTimeout(syncSponsorship, 30);
      });
    }

    if (total && total.getAttribute("data-tc-total-watch") !== "true") {
      total.setAttribute("data-tc-total-watch", "true");
      new MutationObserver(syncSponsorship).observe(total, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    }

    syncSponsorship();
  }

  function prepareSubmit(form) {
    var button = form.querySelector("#input_2");
    var wrapper = form.querySelector("#id_2 .form-buttons-wrapper");
    if (!button || !wrapper) return;

    if (button.textContent.trim() !== "Reserve My Spot") {
      button.textContent = "Reserve My Spot";
    }

    if (!wrapper.querySelector(".tc-tashlich-submit-note")) {
      var note = document.createElement("div");
      note.className = "tc-tashlich-submit-note";
      note.textContent =
        "Your reservation is free. The exact meeting location will be emailed after RSVP.";
      wrapper.insertBefore(note, button);
    }
  }

  function polishPrivacyPill() {
    var pill = document.getElementById("echo-cmp-pill");
    if (!pill) return;

    pill.style.setProperty("bottom", "12px", "important");
    pill.style.setProperty("left", "12px", "important");
    pill.style.setProperty("gap", "6px", "important");
    pill.style.setProperty("padding", "7px 12px", "important");
    pill.style.setProperty("border-radius", "999px", "important");
    pill.style.setProperty("background", "rgba(39, 83, 78, 0.94)", "important");
    pill.style.setProperty(
      "border",
      "1px solid rgba(255, 255, 255, 0.26)",
      "important"
    );
    pill.style.setProperty(
      "box-shadow",
      "0 4px 14px rgba(31, 57, 52, 0.16)",
      "important"
    );
    pill.style.setProperty("font-size", "11px", "important");
    pill.style.setProperty("font-weight", "600", "important");

    var icon = pill.querySelector("svg");
    if (icon) icon.setAttribute("stroke", "#ffffff");
  }

  function repairInstagramLink() {
    var broken = document.querySelector(
      "a[href*='instagram.com/https://www.instagram.com/']"
    );
    if (broken) {
      broken.href = "https://www.instagram.com/tricities_rabbi/";
      broken.rel = "noopener noreferrer";
    }
  }

  function initialize() {
    var form = document.getElementById("7452107");
    if (!form) return false;

    prepareCounters(form);
    prepareAddress(form);
    prepareSponsorship(form);
    prepareSubmit(form);
    polishPrivacyPill();
    repairInstagramLink();
    return true;
  }

  function start() {
    initialize();

    var attempts = 0;
    var timer = window.setInterval(function () {
      initialize();
      attempts += 1;
      if (attempts >= 12) window.clearInterval(timer);
    }, 350);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();

/* ==== tc-tashlich-submit-size-hotfix-script ==== */
(function () {
  var path = window.location.pathname || "";
  var search = window.location.search || "";
  var isTashlichPage =
    /\/aid\/7452107(?:\/|$)/.test(path) ||
    /(?:^|[?&])aid=7452107(?:&|$)/.test(search);

  if (!isTashlichPage) return;

  function fixButtonSize() {
    var button = document.querySelector(
      '#formContainer form[id="7452107"] #input_2'
    );
    if (!button) return;

    button.style.setProperty("display", "inline-flex", "important");
    button.style.setProperty("flex", "0 0 56px", "important");
    button.style.setProperty("align-items", "center", "important");
    button.style.setProperty("justify-content", "center", "important");
    button.style.setProperty("width", "350px", "important");
    button.style.setProperty("max-width", "100%", "important");
    button.style.setProperty("height", "56px", "important");
    button.style.setProperty("min-height", "56px", "important");
    button.style.setProperty("max-height", "56px", "important");
    button.style.setProperty("padding", "14px 24px", "important");
    button.style.setProperty("line-height", "1.2", "important");
    button.style.setProperty("box-sizing", "border-box", "important");
  }

  function start() {
    fixButtonSize();
    window.setTimeout(fixButtonSize, 250);
    window.setTimeout(fixButtonSize, 750);
    window.setTimeout(fixButtonSize, 1500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();

/* ==== chai-subtle-polish-copy ==== */
(function () {
  function polish() {
    var form = document.querySelector('form[id="5995797"]');
    if (!form) return;
    [8, 18, 19].forEach(function (n) {
      var radio = form.querySelector("#other_" + n),
        input = form.querySelector("#input_" + n);
      if (radio) radio.setAttribute("aria-label", "Other monthly amount");
      if (input)
        input.setAttribute(
          "aria-label",
          "Custom monthly amount in Canadian dollars"
        );
    });
    var amount = form.querySelector('label[for="input_19_2"] span');
    if (amount && amount.textContent.trim() === "$1000")
      amount.textContent = "$1,000";
    var answer = form.querySelector(".chai-faq-list .chai-answer");
    if (answer)
      answer.textContent = answer.textContent.replace(
        "simply a helpful starting points, every",
        "simply helpful starting points. Every"
      );
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", polish);
  else polish();
})();

/* ==== tc-donate-us-partner-link ==== */
(function () {
  var path = window.location.pathname || "";
  var search = window.location.search || "";
  var isDonatePage =
    /\/aid\/4970020(?:\/|$)/i.test(path) ||
    /(?:^|[?&])aid=4970020(?:&|$)/i.test(search) ||
    /^\/4970020\/?$/.test(path);

  if (!isDonatePage) return;

  function inject() {
    if (document.getElementById("tc-us-donate-note")) return true;

    var form = document.getElementById("js-donate-form");
    if (!form) return false;

    // Under the "Other Amount" field, above the Next button
    var customCol = form.querySelector(".custom-amount-wrapper");
    var anchor = customCol ? customCol.closest(".col") : null;
    if (!anchor) return false;

    var note = document.createElement("div");
    note.id = "tc-us-donate-note";
    note.innerHTML =
      "To donate in U.S. dollars and receive a U.S. tax receipt, " +
      '<a href="https://www.jewishtricities.com/partner">click here</a>.';

    anchor.insertAdjacentElement("afterend", note);
    return true;
  }

  function start() {
    if (inject()) return;
    var attempts = 0;
    var timer = window.setInterval(function () {
      attempts += 1;
      if (inject() || attempts >= 10) window.clearInterval(timer);
    }, 300);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
