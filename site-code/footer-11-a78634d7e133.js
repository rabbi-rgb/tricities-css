
(function () {
  var EVENT_PATH = "/tools/events/register_cdo/eventid/23975";

  function isThisEventPage() {
    return window.location.href.indexOf(EVENT_PATH) !== -1;
  }

  /* Safety: this code exits immediately on every other page. */
  if (!isThisEventPage()) {
    if (document.body) {
      document.body.classList.remove("tc-shabbat-night-page-v5");
      document.body.classList.remove("tc-shabbat-night-page-v4");
      document.body.classList.remove("tc-shabbat-night-page-v3");
      document.body.classList.remove("tc-shabbat-night-page-v2");
      document.body.classList.remove("shabbat-dinner-page");
    }
    return;
  }

  function cleanText(value) {
    return (value || "").toString().toLowerCase().replace(/\s+/g, " ").trim();
  }

  function setBodyClass() {
    document.body.classList.add("tc-shabbat-night-page-v5");

    /* Remove older testing classes so older CSS stops applying */
    document.body.classList.remove("tc-shabbat-night-page-v4");
      document.body.classList.remove("tc-shabbat-night-page-v3");
    document.body.classList.remove("tc-shabbat-night-page-v2");
    document.body.classList.remove("shabbat-dinner-page");
  }

  function hideExtraArticleHeader() {
    var wrappers = document.querySelectorAll(".master-content-wrapper.g960");

    for (var i = 0; i < wrappers.length; i++) {
      var title = wrappers[i].querySelector(".article-header__title, header.article-header h1");

      if (title && cleanText(title.innerText).indexOf("shabbat") !== -1) {
        wrappers[i].style.setProperty("display", "none", "important");
        wrappers[i].style.setProperty("height", "0", "important");
        wrappers[i].style.setProperty("overflow", "hidden", "important");
        wrappers[i].style.setProperty("margin", "0", "important");
        wrappers[i].style.setProperty("padding", "0", "important");
        wrappers[i].style.setProperty("border", "0", "important");
      }
    }
  }

  function removeOldIntros() {
    var oldIds = ["tcShabbatIntro", "tcShabbatNightIntro", "tcShabbatNightIntroV3", "tcShabbatNightIntroV4"];

    for (var i = 0; i < oldIds.length; i++) {
      var old = document.getElementById(oldIds[i]);
      if (old) old.parentNode.removeChild(old);
    }
  }

  function addIntro() {
    var page = document.querySelector("#RegisterSinglePage");
    if (!page || document.querySelector("#tcShabbatNightIntroV5")) return;

    page.insertAdjacentHTML("afterbegin", `
      <section id="tcShabbatNightIntroV5" aria-label="Shabbat dinner invitation">
        <div class="tc-hero-main">
          <div class="tc-kicker">Friday Night at Chabad</div>

          <h1>Cozy Fall Shabbat</h1>

          <div class="tc-rule"></div>

          <div class="tc-copy">
            Join us for a community Shabbat dinner at Tri-Cities Chabad in Coquitlam. We’ll begin with Kabbalat Shabbat, then sit down for a lively, fall-inspired dinner with friends and neighbours. Come with your family, bring a friend, or join us on your own.
          </div>
        </div>

        <div class="tc-detail-row">
          <div class="tc-detail">
            <span class="tc-detail-label">When</span>
            <span class="tc-detail-main">Friday, October 30, 2026<br>5:30 PM</span>
          </div>

          <div class="tc-detail">
            <span class="tc-detail-label">Where</span>
            <span class="tc-detail-main">Tri-Cities Chabad · Coquitlam<br>Address shared upon RSVP</span>
          </div>

          <div class="tc-detail">
            <span class="tc-detail-label">Cost</span>
            <span class="tc-detail-main">Adults: $24<br>Children: $15</span>
          </div>
        </div>

        <div class="tc-help-note">
          Sponsorship opportunities are available. No one is turned away due to lack of funds.
          If cost is a challenge, please email <strong>info@jewishtricities.com</strong>.
        </div>
      </section>
    `);
  }

  function disableAutocomplete() {
    var inputs = document.querySelectorAll("input, textarea");
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].setAttribute("autocomplete", "off");
    }
  }

  function getPaymentSection() {
    return document.querySelector("body.tc-shabbat-night-page-v5 #Payment") || document.querySelector("#Payment");
  }

  function getSelectedPaymentText() {
    var payment = getPaymentSection();
    if (!payment) return "";

    var select = payment.querySelector("select");
    if (select) {
      var option = select.options[select.selectedIndex];
      if (option) return cleanText((option.text || "") + " " + (option.value || ""));
    }

    var checked = payment.querySelector("input[type='radio']:checked, input[type='checkbox']:checked");
    if (!checked) return "";

    var pieces = [];
    pieces.push(checked.value || "");
    pieces.push(checked.name || "");
    pieces.push(checked.id || "");

    if (checked.id) {
      var label = payment.querySelector("label[for='" + checked.id + "']");
      if (label) pieces.push(label.innerText || "");
    }

    var wrapper = checked.closest("label, .form-radio-item, .form-checkbox-item, .payment-option, .payment_method, .clearfix, .form-line");
    if (wrapper) pieces.push(wrapper.innerText || "");

    return cleanText(pieces.join(" "));
  }

  function isBankTransferSelected() {
    var selectedText = getSelectedPaymentText();

    return (
      selectedText.indexOf("bank transfer") !== -1 ||
      selectedText.indexOf("e-transfer") !== -1 ||
      selectedText.indexOf("etransfer") !== -1 ||
      selectedText.indexOf("interac") !== -1
    );
  }

  function hideBuiltInTransferNotes() {
    var payment = getPaymentSection();
    if (!payment) return;

    var all = payment.querySelectorAll("div, p, span, table, tr, td");

    for (var i = 0; i < all.length; i++) {
      var el = all[i];

      if (el.id === "tcBankTransferInfo" || el.closest("#tcBankTransferInfo")) continue;

      var text = cleanText(el.innerText || "");
      var hasControls = el.querySelector && el.querySelector("input, select, textarea, button");

      if (!hasControls && (
        text.indexOf("for e-transfer send") !== -1 ||
        text.indexOf("for etransfer send") !== -1 ||
        text.indexOf("info@jewishtricities.com") !== -1
      )) {
        el.classList.add("tc-hide-original-transfer-note");
      }
    }
  }

  function updateBankTransferBox() {
    var payment = getPaymentSection();
    if (!payment) return;

    hideBuiltInTransferNotes();

    var box = document.querySelector("#tcBankTransferInfo");
    if (!box) {
      box = document.createElement("div");
      box.id = "tcBankTransferInfo";
      payment.appendChild(box);
    }

    box.innerHTML =
      'Please send your e-transfer to <strong>info@jewishtricities.com</strong><br>' +
      'In the memo, please write <strong>Shabbat Dinner</strong> and your name.';

    if (isBankTransferSelected()) {
      box.style.setProperty("display", "block", "important");
    } else {
      box.style.setProperty("display", "none", "important");
    }
  }

  function attachPaymentListener() {
    var payment = getPaymentSection();
    if (!payment || payment.getAttribute("data-tc-payment-listener") === "yes") return;

    payment.setAttribute("data-tc-payment-listener", "yes");

    payment.addEventListener("change", function () {
      setTimeout(updateBankTransferBox, 50);
    });

    payment.addEventListener("click", function () {
      setTimeout(updateBankTransferBox, 100);
    });
  }

  function runPage() {
    if (!isThisEventPage() || !document.body) return;

    setBodyClass();
    hideExtraArticleHeader();
    removeOldIntros();
    addIntro();
    var ticketSelect = document.querySelector('#performance_32450_priceCategory');
    var quantitySelect = document.querySelector('#performance_32450_quantityOfAttendees');
    if (ticketSelect) {ticketSelect.setAttribute('aria-label','Ticket type'); var ticketLabel=ticketSelect.parentNode.querySelector('div'); if(ticketLabel) ticketLabel.textContent='Ticket type';}
    if (quantitySelect) {quantitySelect.setAttribute('aria-label','Number of guests'); var quantityLabel=quantitySelect.parentNode.querySelector('div'); if(quantityLabel) quantityLabel.textContent='Number of guests';}
    var ticketHelp=document.querySelector('#Performances > .regular'); if(ticketHelp) ticketHelp.textContent='Choose tickets for everyone joining you.';
    disableAutocomplete();
    attachPaymentListener();
    updateBankTransferBox();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runPage);
  } else {
    runPage();
  }

  var registrationBody = document.querySelector("#RegisterBody");
  if (registrationBody) {
    new MutationObserver(function(records) {
      var needsUpdate = records.some(function(record) {
        return Array.from(record.addedNodes).some(function(node) {
          return node.nodeType === 1 && (node.matches(".reservation, #Payment, #SecondaryFormItems") || node.querySelector(".reservation, #Payment"));
        });
      });
      if (needsUpdate) runPage();
    }).observe(registrationBody, {childList:true, subtree:true});
  }
  setTimeout(runPage, 300);
  setTimeout(runPage, 900);
  setTimeout(runPage, 1800);
  setTimeout(runPage, 3000);
})();
