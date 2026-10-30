(function () {
  'use strict';

  var EVENT_ID = '24173';
  var PERFORMANCE_ID = '32687';
  var REGISTER_PATH = '/tools/events/register_cdo/eventid/' + EVENT_ID;
  var scriptSource = document.currentScript && document.currentScript.src;
  var assetBase = scriptSource ? scriptSource.replace(/[^/?#]+(?:[?#].*)?$/, '') :
    'https://cdn.jsdelivr.net/gh/rabbi-rgb/tricities-css@main/';
  var BANNER_URL = assetBase + 'chanukah-lit-banner.png';

  function isEventPage() {
    var params = new URLSearchParams(window.location.search);
    var path = window.location.pathname.replace(/\/+$/, '');
    return path === REGISTER_PATH ||
      (path === '/tools/events/register.asp' && params.get('eventid') === EVENT_ID);
  }

  function isReceiptPage() {
    return window.location.pathname.indexOf('/tools/events/register_cdo/code/') !== -1;
  }

  function setText(node, value) {
    if (node && node.textContent !== value) node.textContent = value;
  }

  function heroMarkup() {
    return '<section id="tcChanukahLitIntro" aria-labelledby="tcChanukahLitTitle">' +
      '<div class="tc-lit-banner-wrap">' +
        '<img class="tc-lit-banner" src="' + BANNER_URL + '" alt="Chanukah LIT! Light, Impact, Together.">' +
      '</div>' +
      '<div class="tc-lit-welcome">' +
        '<div class="tc-lit-copy">' +
          '<span class="tc-lit-kicker">CKids Club · Coquitlam</span>' +
          '<h1 id="tcChanukahLitTitle">Let your light shine on and on!</h1>' +
          '<p>Build an epic chain-reaction machine, gift a decorated Chanukah donut, and create your own Infinity Mirror Menorah.</p>' +
          '<a class="tc-lit-cta" href="#Performances">Register your child</a>' +
        '</div>' +
        '<div class="tc-lit-spark" aria-hidden="true"><span>✦</span><strong>LIT!</strong><small>Light · Impact · Together</small></div>' +
      '</div>' +
      '<div class="tc-lit-details" aria-label="Event details">' +
        '<div><span>When</span><strong>Sunday, November 29<br>3:30–4:00 PM</strong></div>' +
        '<div><span>Where</span><strong>Coquitlam</strong></div>' +
        '<div><span>Who</span><strong>Children ages 7–12</strong></div>' +
        '<div><span>Cost</span><strong>$12 per child<br>Hebrew School students free</strong></div>' +
      '</div>' +
    '</section>';
  }

  function updateCategoryLabel(category) {
    if (!category) return;
    category.setAttribute('aria-label', 'Ticket type');
    Array.prototype.forEach.call(category.options, function (option) {
      if (/Children\s*\(3\s*[-–]\s*12\)/i.test(option.textContent)) {
        option.textContent = option.textContent.replace(/Children\s*\(3\s*[-–]\s*12\)/i, 'Children (7–12)');
      }
    });
    var label = category.previousElementSibling;
    if (label) setText(label, 'Ticket type');
  }

  function limitQuantity(quantity) {
    if (!quantity) return;
    var existingChildren = document.querySelectorAll('#performance_' + PERFORMANCE_ID + '_reservations .reservation').length;
    var remainingCapacity = Math.max(0, 15 - existingChildren);
    Array.prototype.forEach.call(quantity.options, function (option) {
      var count = parseInt(option.value || option.textContent, 10);
      var overCapacity = Number.isFinite(count) && count > remainingCapacity;
      option.hidden = overCapacity;
      option.disabled = overCapacity;
    });
    if (remainingCapacity === 0) {
      if (!quantity.hasAttribute('data-tc-capacity-full')) {
        quantity.setAttribute('data-tc-capacity-full', quantity.disabled ? 'native' : 'capacity');
      }
      quantity.selectedIndex = -1;
      quantity.disabled = true;
    } else {
      if (quantity.getAttribute('data-tc-capacity-full') === 'capacity') quantity.disabled = false;
      quantity.removeAttribute('data-tc-capacity-full');
      if (!quantity.value || parseInt(quantity.value, 10) > remainingCapacity) quantity.value = '1';
    }

    var addButton = document.getElementById('performance_' + PERFORMANCE_ID + '_addAttendeeButton');
    if (!addButton) return;
    if (remainingCapacity === 0) {
      if (!addButton.hasAttribute('data-tc-capacity-full')) {
        addButton.setAttribute('data-tc-capacity-full', addButton.disabled ? 'native' : 'capacity');
      }
      addButton.disabled = true;
    } else {
      if (addButton.getAttribute('data-tc-capacity-full') === 'capacity') addButton.disabled = false;
      addButton.removeAttribute('data-tc-capacity-full');
    }
  }

  function enhanceAttendeeRows() {
    document.querySelectorAll('#performance_' + PERFORMANCE_ID + '_reservations .reservation').forEach(function (row, index) {
      var number = row.querySelector('.g100');
      if (number) setText(number, 'Child ' + (index + 1));
      var inputs = row.querySelectorAll('input:not([type]), input[type="text"]');
      if (inputs[0]) {
        inputs[0].placeholder = 'Child first name';
        inputs[0].setAttribute('aria-label', 'Child ' + (index + 1) + ' first name');
      }
      if (inputs[1]) {
        inputs[1].placeholder = 'Child last name';
        inputs[1].setAttribute('aria-label', 'Child ' + (index + 1) + ' last name');
      }
      var embedded = row.querySelector('.embedded_form');
      if (embedded) {
        embedded.querySelectorAll('select').forEach(function (select) {
          if (!select.getAttribute('aria-label')) select.setAttribute('aria-label', 'Child ' + (index + 1) + ' grade');
        });
      }
    });
  }

  function enhanceEvent() {
    document.body.classList.add('tc-chanukah-lit-event');
    var page = document.getElementById('RegisterSinglePage');
    if (!page) return;

    if (!document.getElementById('tcChanukahLitIntro')) {
      var holder = document.createElement('div');
      holder.innerHTML = heroMarkup();
      page.prepend(holder.firstElementChild);
    }

    var category = document.getElementById('performance_' + PERFORMANCE_ID + '_priceCategory');
    updateCategoryLabel(category);

    var quantity = document.getElementById('performance_' + PERFORMANCE_ID + '_quantityOfAttendees');
    if (quantity) {
      quantity.setAttribute('aria-label', 'Number of children');
      if (quantity.previousElementSibling) setText(quantity.previousElementSibling, 'Number of children');
      limitQuantity(quantity);
    }

    setText(document.querySelector('#Performances > .regular'), 'Choose one ticket for each child. Hebrew School students register free. Space is limited to 15 children.');
    var addButton = document.querySelector('#performance_' + PERFORMANCE_ID + '_addAttendeeButton span');
    if (addButton) setText(addButton, document.querySelector('#performance_' + PERFORMANCE_ID + '_reservations .reservation') ? 'Add child' : 'Continue');
    setText(document.querySelector('#performance_' + PERFORMANCE_ID + '_additionalsToggle .toggle_message'), 'Add another child');
    setText(document.querySelector('#SubmitButton span'), 'Complete registration');
    enhanceAttendeeRows();
  }

  function enhanceReceipt() {
    var page = document.querySelector('#RegisterSinglePage.view_receipt');
    var body = document.getElementById('RegisterBody');
    if (!page || !body || !page.querySelector('a[href*="eventid=' + EVENT_ID + '"]')) return;
    document.body.classList.add('tc-chanukah-lit-receipt');
    if (!document.getElementById('tcChanukahLitConfirmed')) {
      var holder = document.createElement('div');
      holder.innerHTML = '<section id="tcChanukahLitConfirmed"><span>Registration received</span><h1>Your child is ready to get LIT!</h1><p>We look forward to an afternoon of creativity, kindness, and Chanukah fun.</p><div><strong>Sunday, November 29, 2026</strong><strong>3:30–4:00 PM · Coquitlam</strong></div></section>';
      page.insertBefore(holder.firstElementChild, body);
    }
    var thanks = body.querySelector('.thank_you');
    if (thanks && thanks.parentElement) thanks.parentElement.classList.add('tc-lit-old-intro');
    setText(document.getElementById('AnotherReservationButton'), 'Register another child');
  }

  function run() {
    if (isEventPage()) enhanceEvent();
    else if (isReceiptPage()) enhanceReceipt();
  }

  if (window.__tcChanukahLitV1) {
    window.__tcChanukahLitV1.run();
    return;
  }

  var scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    window.setTimeout(function () {
      scheduled = false;
      run();
    }, 60);
  }

  window.__tcChanukahLitV1 = { run: run, schedule: schedule };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
  window.addEventListener('load', run);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
})();
