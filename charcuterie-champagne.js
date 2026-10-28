(function () {
  'use strict';

  var EVENT_ID = '24151';
  var PERFORMANCE_ID = '32663';
  var REGISTER_PATH = '/tools/events/register_cdo/eventid/' + EVENT_ID;

  function isEventPage() {
    var params = new URLSearchParams(window.location.search);
    return window.location.pathname.indexOf(REGISTER_PATH) !== -1 ||
      (window.location.pathname === '/tools/events/register.asp' && params.get('eventid') === EVENT_ID);
  }

  function isReceiptPage() {
    return window.location.pathname.indexOf('/tools/events/register_cdo/code/') !== -1;
  }

  function setText(node, value) {
    if (node && node.textContent !== value) node.textContent = value;
  }

  function setNativeDonation(value) {
    var nativeInput = document.getElementById('TotalDonation');
    if (!nativeInput) return;
    var formatted = Number(value).toFixed(2);
    if (nativeInput.value === formatted) return;
    nativeInput.value = formatted;
    nativeInput.dispatchEvent(new Event('input', { bubbles: true }));
    nativeInput.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function heroMarkup() {
    return '<section id="tcCharcuterieIntro" aria-labelledby="tcCharcuterieTitle">' +
      '<div class="tc-cnc-hero">' +
        '<div class="tc-cnc-copy">' +
          '<div class="tc-cnc-kicker">Chabad of the Tri-Cities · Women’s Circle</div>' +
          '<h1 id="tcCharcuterieTitle">Charcuterie <span>&amp;</span> Champagne</h1>' +
          '<p class="tc-cnc-lede">An evening for women to create, taste, and connect.</p>' +
          '<p class="tc-cnc-description">Personalize your own wooden serving board, then arrange a beautiful charcuterie spread to take home.</p>' +
          '<a class="tc-cnc-cta" href="#Performances">Reserve your place <span aria-hidden="true">→</span></a>' +
        '</div>' +
        '<div class="tc-cnc-art" aria-hidden="true">' +
          '<div class="tc-cnc-bubbles"><i></i><i></i><i></i><i></i><i></i></div>' +
          '<div class="tc-cnc-glass"><span></span></div>' +
          '<div class="tc-cnc-board">' +
            '<div class="tc-cnc-grapes"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>' +
            '<div class="tc-cnc-cheese"></div><div class="tc-cnc-brie"></div>' +
            '<div class="tc-cnc-crackers"><i></i><i></i><i></i><i></i></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="tc-cnc-details">' +
        '<div><span>When</span><strong>Thursday, November 19<br>6:30 PM</strong></div>' +
        '<div><span>Where</span><strong>Coquitlam<br>Address after RSVP</strong></div>' +
        '<div><span>Admission</span><strong>$25 per person<br>All materials included</strong></div>' +
      '</div>' +
    '</section>';
  }

  function supportMarkup() {
    return '<section id="tcCharcuterieSupport" aria-labelledby="tcCharcuterieSupportTitle">' +
      '<div class="tc-cnc-support-head"><div><span class="tc-cnc-eyebrow">Optional</span>' +
      '<h2 id="tcCharcuterieSupportTitle">Help another woman join us</h2></div>' +
      '<p>Your gift helps make the evening possible and can sponsor a place for someone who would love to attend.</p></div>' +
      '<div class="tc-cnc-support-options">' +
        '<label><input type="radio" name="tc_cnc_support" value="0" checked><span><strong>No additional gift</strong><small>Your ticket remains $25</small></span></label>' +
        '<label><input type="radio" name="tc_cnc_support" value="25"><span><strong>Sponsor another woman</strong><small>Add $25</small></span></label>' +
        '<label><input type="radio" name="tc_cnc_support" value="50"><span><strong>Help with materials</strong><small>Add $50</small></span></label>' +
        '<label><input type="radio" name="tc_cnc_support" value="100"><span><strong>Support the evening</strong><small>Add $100</small></span></label>' +
        '<label><input type="radio" name="tc_cnc_support" value="custom"><span><strong>Choose my own gift</strong><small>Any amount</small></span></label>' +
      '</div>' +
      '<label class="tc-cnc-custom-label" for="tcCharcuterieGift">Your sponsorship gift (CAD)</label>' +
      '<div class="tc-cnc-custom"><span aria-hidden="true">$</span><input id="tcCharcuterieGift" type="number" min="0" step="0.01" inputmode="decimal" disabled aria-describedby="tcCharcuterieGiftNote"></div>' +
      '<p id="tcCharcuterieGiftNote">This gift is added to your registration total.</p>' +
      '<p id="tcCharcuterieGiftError" role="alert" hidden>Please enter an amount of $0 or more.</p>' +
    '</section>';
  }

  function enhanceSupport() {
    var nativeInput = document.getElementById('TotalDonation');
    var summary = document.getElementById('Summary');
    if (!nativeInput || !summary) return;

    var nativeRow = nativeInput.closest('.large_top_margin.medium_bottom_margin');
    if (nativeRow) nativeRow.classList.add('tc-cnc-native-donation');

    var card = document.getElementById('tcCharcuterieSupport');
    if (!card) {
      var holder = document.createElement('div');
      holder.innerHTML = supportMarkup();
      card = holder.firstElementChild;
      summary.prepend(card);

      var custom = card.querySelector('#tcCharcuterieGift');
      var error = card.querySelector('#tcCharcuterieGiftError');
      card.querySelectorAll('input[name="tc_cnc_support"]').forEach(function (radio) {
        radio.addEventListener('change', function () {
          var isCustom = radio.value === 'custom';
          custom.disabled = !isCustom;
          if (isCustom) {
            custom.focus();
            return;
          }
          custom.value = radio.value;
          custom.setCustomValidity('');
          error.hidden = true;
          setNativeDonation(radio.value);
        });
      });
      custom.addEventListener('input', function () {
        var valid = custom.value !== '' && Number.isFinite(Number(custom.value)) && Number(custom.value) >= 0;
        custom.setCustomValidity(valid ? '' : 'Please enter an amount of $0 or more.');
        error.hidden = valid;
        if (valid) setNativeDonation(custom.value);
      });
      custom.addEventListener('change', function () {
        if (custom.value !== '') custom.value = Number(custom.value).toFixed(2);
      });
    }

    if (!card.dataset.synced) {
      var existing = Number(nativeInput.value || 0);
      if (existing > 0) {
        var exact = card.querySelector('input[name="tc_cnc_support"][value="' + existing + '"]');
        var selected = exact || card.querySelector('input[name="tc_cnc_support"][value="custom"]');
        selected.checked = true;
        var customInput = card.querySelector('#tcCharcuterieGift');
        customInput.value = existing.toFixed(2);
        customInput.disabled = Boolean(exact);
      } else {
        setNativeDonation(0);
      }
      card.dataset.synced = 'true';
    }
  }

  function enhanceAttendeeRows() {
    document.querySelectorAll('#RegisterBody .reservation').forEach(function (row) {
      setText(row.querySelector('.g100'), 'Guest');
      var inputs = row.querySelectorAll('input:not([type]), input[type="text"]');
      if (inputs[0]) {
        inputs[0].placeholder = 'First name';
        inputs[0].setAttribute('aria-label', 'Guest first name');
      }
      if (inputs[1]) {
        inputs[1].placeholder = 'Last name';
        inputs[1].setAttribute('aria-label', 'Guest last name');
      }
    });
  }

  function enhanceEvent() {
    document.body.classList.add('tc-charcuterie-event');
    var page = document.getElementById('RegisterSinglePage');
    if (!page) return;

    if (!document.getElementById('tcCharcuterieIntro')) {
      var holder = document.createElement('div');
      holder.innerHTML = heroMarkup();
      page.prepend(holder.firstElementChild);
    }

    var category = document.getElementById('performance_' + PERFORMANCE_ID + '_priceCategory');
    if (category) {
      category.setAttribute('aria-label', 'Ticket type');
      setText(category.parentNode.querySelector('div'), 'Ticket');
    }
    var quantity = document.getElementById('performance_' + PERFORMANCE_ID + '_quantityOfAttendees');
    if (quantity) {
      quantity.setAttribute('aria-label', 'Number of guests');
      setText(quantity.parentNode.querySelector('div'), 'Number of guests');
    }
    var helper = document.querySelector('#Performances > .regular');
    setText(helper, 'Reserve one or more places. Each $25 ticket includes the workshop materials and your take-home charcuterie spread.');
    var addButton = document.querySelector('#performance_' + PERFORMANCE_ID + '_addAttendeeButton span');
    if (addButton && !document.querySelector('#performance_' + PERFORMANCE_ID + '_reservations .reservation')) setText(addButton, 'Continue');

    enhanceAttendeeRows();
    enhanceSupport();
    setText(document.querySelector('#SubmitButton span'), 'Complete my reservation');
  }

  function enhanceReceipt() {
    var page = document.querySelector('#RegisterSinglePage.view_receipt');
    var body = document.getElementById('RegisterBody');
    if (!page || !body || !page.querySelector('a[href*="eventid=' + EVENT_ID + '"]')) return;
    document.body.classList.add('tc-charcuterie-receipt');
    if (!document.getElementById('tcCharcuterieConfirmed')) {
      var holder = document.createElement('div');
      holder.innerHTML = '<section id="tcCharcuterieConfirmed"><div class="tc-cnc-receipt-kicker">Reservation received</div><h1>You’re on the guest list.</h1><p>We can’t wait to welcome you to Charcuterie &amp; Champagne.</p><div class="tc-cnc-receipt-details"><div><span>When</span><strong>Thursday, November 19, 2026<br>6:30 PM</strong></div><div><span>Where</span><strong>Coquitlam<br>Address provided before the event</strong></div></div><p class="tc-cnc-receipt-note">Your wooden serving board, workshop materials, and charcuterie ingredients are included.</p></section>';
      page.insertBefore(holder.firstElementChild, body);
    }
    var thanks = body.querySelector('.thank_you');
    if (thanks && thanks.parentElement) thanks.parentElement.classList.add('tc-cnc-old-intro');
    var summary = document.getElementById('ReservationSummary');
    if (summary && summary.firstElementChild) setText(summary.firstElementChild, 'Your reservation');
    var button = document.getElementById('AnotherReservationButton');
    setText(button, 'Reserve another place');
    if (!body.querySelector('.tc-cnc-receipt-contact')) {
      var help = document.createElement('p');
      help.className = 'tc-cnc-receipt-contact';
      help.innerHTML = 'Questions? <a href="mailto:info@jewishtricities.com">info@jewishtricities.com</a>';
      body.appendChild(help);
    }
  }

  function run() {
    if (isEventPage()) enhanceEvent();
    else if (isReceiptPage()) enhanceReceipt();
  }

  if (window.__tcCharcuterieEventV1) {
    window.__tcCharcuterieEventV1.run();
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

  window.__tcCharcuterieEventV1 = { run: run, schedule: schedule };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
  window.addEventListener('load', run);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
})();
