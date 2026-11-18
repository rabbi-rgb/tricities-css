(function () {
  'use strict';
  function start() {
    var forms = Array.from(document.querySelectorAll('#co_content_container form[name="asktherabbi"], #co_content_container form[name="subscribe"], #co_content_container form[name="feedback"]'));
    forms.forEach(function (form) {
      if (form.dataset.tcFormReady) return;
      form.dataset.tcFormReady = 'true';
      form.querySelectorAll('textarea').forEach(function (textarea) {
        textarea.style.removeProperty('height');
      });
      Array.from(form.querySelectorAll('input:not([type="hidden"])')).forEach(function (input) {
        var name = (input.name || '').toLowerCase();
        if (/^(firstname|fname)$/.test(name)) input.setAttribute('autocomplete', 'given-name');
        if (/^(lastname|lname)$/.test(name)) input.setAttribute('autocomplete', 'family-name');
        if (/^(email|middlename|middlename2)$/.test(name)) {
          input.setAttribute('autocomplete', 'email');
          input.setAttribute('inputmode', 'email');
        }
      });
      if (form.name === 'subscribe') {
        form.querySelectorAll('.subscribe_form tr').forEach(function (row, index) {
          var input = row.querySelector('input');
          var cell = row.querySelector('td');
          if (!input || !cell || cell.querySelector('label')) return;
          if (!input.id) input.id = 'tc-subscribe-field-' + index;
          var label = document.createElement('label');
          label.htmlFor = input.id;
          label.textContent = cell.textContent.trim();
          cell.replaceChildren(label);
        });
      }
      if (form.name === 'asktherabbi') {
        form.querySelectorAll('[tabindex]').forEach(function (el) {
          if (Number(el.getAttribute('tabindex')) > 0) el.removeAttribute('tabindex');
        });
        var optin = form.querySelector('.co_optin');
        if (optin && optin.parentElement.parentElement.querySelector('.co_global_button')) {
          var optinBox = optin.parentElement;
          var actions = optinBox.parentElement;
          actions.insertBefore(optinBox, actions.firstChild);
          actions.classList.add('tc-form-actions');
        }
      }
      var submitLabel = form.querySelector('button[type="submit"] > span');
      if (submitLabel && form.name === 'asktherabbi') submitLabel.textContent = 'Send Question';
      if (submitLabel && form.name === 'feedback') submitLabel.textContent = 'Send Message';
      if (form.name === 'feedback') {
        var location = document.querySelector('#MosadInformation a[href*="maps.google.com"]');
        if (location) location.textContent = 'Located in Coquitlam';
      }
      var guidance = document.createElement('p');
      guidance.className = 'tc-form-guidance';
      guidance.textContent = form.name === 'subscribe'
        ? 'Name and email are required. Choose at least one newsletter.'
        : 'All fields below are required. Email updates are optional.';
      form.insertBefore(guidance, form.firstChild);
      form.querySelectorAll('a').forEach(function (link) {
        if (form.name === 'subscribe' && link.textContent.trim() === 'Details') {
          link.classList.add('tc-newsletter-details');
        }
      });
      var optinLabel = form.querySelector('.co_optin label');
      if (optinLabel) {
        var optional = document.createElement('span');
        optional.className = 'tc-optional-label';
        optional.textContent = ' (optional)';
        optinLabel.appendChild(optional);
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

/* Light Up event 24229 address-flow workaround.
   Scoped to this event because ChabadOne's custom-code publisher is currently unavailable. */
(function () {
  'use strict';

  var path = window.location.pathname || '';
  var search = window.location.search || '';
  var isLightUp =
    /\/tools\/events\/register(?:_cdo|\.asp)?\/eventid\/24229(?:\/|$)/i.test(path) ||
    /(?:^|[?&])eventid=24229(?:&|$)/i.test(search);
  if (!isLightUp) return;

  var scheduled = false;

  function setText(element, value) {
    if (element && element.textContent !== value) element.textContent = value;
  }

  function fieldRow(id) {
    var field = document.getElementById(id);
    return field && field.closest('.clearfix.small_vertical_padding');
  }

  function relabel(id, labelText, ariaLabel) {
    var field = document.getElementById(id);
    var row = fieldRow(id);
    if (row) setText(row.querySelector('.label'), labelText);
    if (field && ariaLabel) field.setAttribute('aria-label', ariaLabel);
  }

  function refine() {
    scheduled = false;
    document.documentElement.classList.add('tc-lightup-2026');

    var section = document.getElementById('ReserversInformation');
    if (!section) return;

    setText(section.querySelector('.title.large'), 'Contact details');

    Array.prototype.forEach.call(section.querySelectorAll('.regular'), function (element) {
      var value = element.textContent || '';
      if (/review the number of adults and children|sponsorship selection before submitting/i.test(value)) {
        setText(element, 'We’ll use these details to send your confirmation and any important event updates.');
      }
    });

    relabel('ReserversBillingAddress1', 'Street address', 'Street address');
    relabel('ReserversBillingPostCode', 'Postal code', 'Postal code');

    var firstNameRow = fieldRow('ReserversFirstName');
    var phoneRow = fieldRow('ReserversPhone');
    var addressRow = fieldRow('ReserversBillingAddress1');
    var container = firstNameRow && firstNameRow.parentNode;
    if (!container || !addressRow) return;

    var addressIntro = document.getElementById('tc-lightup-address-intro');
    if (!addressIntro) {
      addressIntro = document.createElement('div');
      addressIntro.id = 'tc-lightup-address-intro';
      addressIntro.className = 'tc-lightup-address-intro';
      addressIntro.innerHTML =
        '<h3>Address</h3>' +
        '<p>Kept with your registration and used to securely process an optional donation.</p>';
    }

    if (addressIntro.parentNode !== container || addressIntro.nextElementSibling !== addressRow) {
      container.insertBefore(addressIntro, addressRow);
    }
    if (phoneRow && phoneRow.nextElementSibling !== addressIntro) {
      container.insertBefore(phoneRow, addressIntro);
    }
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    window.setTimeout(refine, 40);
  }

  function start() {
    refine();
    var body = document.getElementById('RegisterBody');
    if (body) new MutationObserver(schedule).observe(body, { childList: true, subtree: true });
    window.setTimeout(refine, 400);
    window.setTimeout(refine, 1200);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();


/* Light Up Maple Ridge 2026 registration experience.
   Loads only for event 24377 and receipt pages, using a pinned event asset. */
(function () {
  'use strict';

  var path = window.location.pathname || '';
  var search = window.location.search || '';
  var isMapleRidge =
    /\/tools\/events\/register(?:_cdo|\.asp)?\/eventid\/24377(?:\/|$)/i.test(path) ||
    /(?:^|[?&])eventid=24377(?:&|$)/i.test(search);
  var isReceiptPath = /\/tools\/events\/register(?:_cdo|\.asp)?\/code\//i.test(path);
  if (!isMapleRidge && !isReceiptPath) return;
  if (document.querySelector('script[data-tc-maple-ridge-2026]')) return;

  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/gh/rabbi-rgb/jewishtricities-web-assets@398aaff91366a67081cc5673256490896831f388/light-up-maple-ridge-2026.js';
  script.defer = true;
  script.setAttribute('data-tc-maple-ridge-2026', 'true');
  document.head.appendChild(script);
})();
