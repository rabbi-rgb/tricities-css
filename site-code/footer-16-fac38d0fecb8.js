(function(){if(!(location.pathname.includes("/tools/events/register_cdo/eventid/23993")||(location.pathname==="/tools/events/register.asp"&&new URLSearchParams(location.search).get("eventid")==="23993")))return;var scheduled=false,mode='suggested',lastCount=-1;function txt(el,v){if(el&&el.textContent!==v)el.textContent=v;}function write(n){var native=document.getElementById('TotalDonation');if(!native)return;var v=Number(n).toFixed(2);if(native.value!==v){native.value=v;native.dispatchEvent(new Event('input',{bubbles:true}));native.dispatchEvent(new Event('change',{bubbles:true}));}}function run(){scheduled=false;document.body.classList.add('tc-ente-event');var page=document.getElementById('RegisterSinglePage');if(page&&!document.getElementById('tcEntebbeIntro')){var intro=document.createElement('section');intro.id='tcEntebbeIntro';intro.setAttribute('aria-label','Entebbe event invitation');intro.innerHTML="<div class=\"tc-hero-main\"><div class=\"tc-ente-hero-copy\"><div class=\"tc-kicker\">Tri-Cities Chabad presents</div><h1>The Raid on Entebbe</h1><div class=\"tc-rule\"></div><p class=\"tc-copy\">A firsthand account of Operation Thunderbolt, the legendary 1976 hostage rescue.</p><div class=\"tc-ente-speaker\"><strong>Sasson “Sassy” Reuven</strong><span>IDF Special Forces veteran and participant in the rescue behind enemy lines.</span></div></div><img class=\"tc-ente-portrait\" src=\"https://raidonentebbe.com/wp-content/uploads/2021/05/Sassy-Reuven.png\" alt=\"Sasson Sassy Reuven\"></div><div class=\"tc-detail-row\"><div class=\"tc-detail\"><span class=\"tc-detail-label\">When</span><span class=\"tc-detail-main\">Tuesday, October 20, 2026<br>7:00 PM</span></div><div class=\"tc-detail\"><span class=\"tc-detail-label\">Where</span><span class=\"tc-detail-main\">Coquitlam<br>Address shared upon RSVP</span></div><div class=\"tc-detail\"><span class=\"tc-detail-label\">Suggested contribution</span><span class=\"tc-detail-main\">$18 per person</span></div></div><div class=\"tc-ente-story\"><h2>The Raid on Entebbe, firsthand</h2><p>In July 1976, Sassy Reuven participated in the legendary Entebbe hostage-rescue mission, flying thousands of miles over enemy territory to Uganda.</p><p>A veteran of the IDF's elite Red Beret paratrooper unit, Sassy will take us through his personal experience from the moment he was called to duty, through the preparation for the mission, the landing in Uganda, and the completion of the rescue behind enemy lines.</p><p class=\"tc-ente-refreshments\">Light refreshments will be served.</p></div>";page.prepend(intro);}var select=document.getElementById('performance_32472_priceCategory');if(select){select.setAttribute('aria-label','Guest type');Array.from(select.options).forEach(function(o){if(!o.disabled)txt(o,'Event Attendee');});}if(select)txt(select.parentNode.querySelector('div'),'Guest type');var qty=document.getElementById('performance_32472_quantityOfAttendees');if(qty){qty.setAttribute('aria-label','Number of guests');txt(qty.parentNode.querySelector('div'),'Number of guests');}var help=document.querySelector('#Performances > .regular');txt(help,'Choose the number of guests joining you. Suggested contribution: $18 per person.');document.querySelectorAll('#RegisterBody .reservation').forEach(function(row){txt(row.querySelector('.g100'),'Event Attendee');var inputs=row.querySelectorAll('input:not([type]),input[type=text]');if(inputs[0]){inputs[0].placeholder='First name';inputs[0].setAttribute('aria-label','Attendee first name');}if(inputs[1]){inputs[1].placeholder='Last name';inputs[1].setAttribute('aria-label','Attendee last name');}});var native=document.getElementById('TotalDonation'),summary=document.getElementById('Summary');if(!native||!summary)return;var nativeRow=native.closest('.large_top_margin.medium_bottom_margin');if(nativeRow)nativeRow.classList.add('tc-ente-native-amount');var card=document.getElementById('tcEntebbeContribution');if(!card){card=document.createElement('section');card.id='tcEntebbeContribution';card.innerHTML='<h2>Your contribution</h2><p>This event is made possible by community contributions. Select a suggestion or enter your own amount.</p><div class="tc-ente-choices"><label><input type="radio" name="tc_ente_choice" value="suggested" checked><span id="tcEntebbeSuggested">Suggested contribution</span></label><label><input type="radio" name="tc_ente_choice" value="sponsor"><span><strong>Sponsor another attendee</strong><small id="tcEntebbeSponsor"></small></span></label><label><input type="radio" name="tc_ente_choice" value="360"><span>Become an Event Supporter · $360</span></label><label><input type="radio" name="tc_ente_choice" value="770"><span>Become an Event Partner · $770</span></label><label><input type="radio" name="tc_ente_choice" value="1800"><span>Become an Event Underwriter · $1,800</span></label><label><input type="radio" name="tc_ente_choice" value="custom"><span>My own amount</span></label></div><label class="tc-ente-amount-label" for="tcEntebbeAmount">Your contribution amount (CAD)</label><div class="tc-ente-amount"><span aria-hidden="true">$</span><input type="number" id="tcEntebbeAmount" min="0" step="0.01" inputmode="decimal" aria-label="Your contribution amount in CAD"></div><p id="tcEntebbeError" hidden>Please enter an amount of $0 or more.</p>';summary.prepend(card);card.querySelectorAll('input[type=radio]').forEach(function(r){r.addEventListener('change',function(){mode=r.value;var input=document.getElementById('tcEntebbeAmount');if(mode==='custom'){input.focus();return;}var count=document.querySelectorAll('#RegisterBody .reservation').length;var value=mode==='suggested'?18*count:mode==='sponsor'?18*(count+1):Number(mode);input.value=Number(value).toFixed(2);input.setCustomValidity('');document.getElementById('tcEntebbeError').hidden=true;write(value);});});var amount=card.querySelector('#tcEntebbeAmount');amount.addEventListener('input',function(){mode='custom';card.querySelector('input[value=custom]').checked=true;var valid=amount.value!==''&&Number.isFinite(Number(amount.value))&&Number(amount.value)>=0;amount.setCustomValidity(valid?'':'Please enter an amount of $0 or more.');document.getElementById('tcEntebbeError').hidden=valid;if(valid)write(Number(amount.value));});document.addEventListener('click',function(e){if(e.target.closest('#SubmitButton')&&!amount.checkValidity()){e.preventDefault();e.stopImmediatePropagation();amount.reportValidity();}},true);}var count=document.querySelectorAll('#RegisterBody .reservation').length;txt(document.getElementById('tcEntebbeSuggested'),'Suggested contribution · $'+(18*count).toFixed(2)+' ('+count+' guest'+(count===1?'':'s')+')');txt(document.getElementById('tcEntebbeSponsor'),'Add $18 · $'+(18*(count+1)).toFixed(2)+' total');if((mode==='suggested'||mode==='sponsor')&&count!==lastCount){var selectedTotal=18*(count+(mode==='sponsor'?1:0));document.getElementById('tcEntebbeAmount').value=selectedTotal.toFixed(2);write(selectedTotal);}lastCount=count;document.querySelectorAll('#Totals > .clearfix').forEach(function(row){var label=row.querySelector('.float_left');if(!label)return;var t=label.textContent.trim();if(t.indexOf('Subtotal for ')===0)row.style.display='none';else if(t.indexOf('Donation:')===0)txt(label,'Your contribution:');else if(t.indexOf('Total:')===0)txt(label,'Total contribution:');});txt(document.querySelector('#SubmitButton span'),'Reserve my seats');}function schedule(){if(!scheduled){scheduled=true;setTimeout(run,80);}}function start(){run();var body=document.getElementById('RegisterBody');if(body){new MutationObserver(schedule).observe(body,{childList:true,subtree:true});body.addEventListener('change',schedule);body.addEventListener('click',schedule);}}if(document.readyState==='complete')start();else window.addEventListener('load',start);})();

/* Light Up event 24229 compatibility while Site Control serves the old footer pin. */
(function () {
  var path = location.pathname;
  var isLightUp = /\/tools\/events\/register(?:_cdo|\.asp)?\/eventid\/24229(?:\/|$)/i.test(path) ||
    (/^\/tools\/events\/register\.asp$/i.test(path) && new URLSearchParams(location.search).get('eventid') === '24229');
  if (!isLightUp) return;

  // Keep the registration styling independent of the donation script version.
  var styles = document.createElement('style');
  styles.id = 'tc-lightup-registration-polish';
  styles.textContent = `
    html.tc-lightup-2026 #Performances > .regular {
      max-width: 60ch;
      margin-bottom: 16px !important;
    }

    html.tc-lightup-2026 #Performances .performance {
      overflow: hidden;
      border-radius: 14px !important;
      background: #f3f8f9 !important;
    }

    html.tc-lightup-2026 #Performances .toggle_message {
      padding: 12px 16px !important;
    }

    html.tc-lightup-2026 #RegisterSinglePage :is(
      #tc-lightup-donation, #AdditionalInformation.tc-lightup-survey,
      #Summary, #ReserversInformation, #Payment
    ) {
      margin-top: 16px !important;
      padding: clamp(16px, 3vw, 24px) !important;
      border-radius: 14px !important;
      box-shadow: none !important;
    }

    html.tc-lightup-2026 #RegisterSinglePage #tc-lightup-donation {
      background: #f3f8f9 !important;
    }

    html.tc-lightup-2026 #tc-lightup-donation:has(#tc-lightup-donation-opt-in) .tc-lightup-section-kicker {
      display: none;
    }

    html.tc-lightup-2026 #tc-lightup-donation-title label {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 36px;
      margin: 0;
      color: var(--lu-night);
      font: 700 clamp(17px, 2.4vw, 21px)/1.35 Arial, sans-serif;
      cursor: pointer;
    }

    html.tc-lightup-2026 #RegisterSinglePage #tc-lightup-donation-opt-in {
      appearance: auto !important;
      flex: 0 0 20px;
      width: 20px !important;
      height: 20px !important;
      min-height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      accent-color: #087a8c;
      box-shadow: none !important;
    }

    html.tc-lightup-2026 #tc-lightup-donation .tc-lightup-donation__intro {
      margin: 1px 0 0 30px;
    }

    html.tc-lightup-2026 #tc-lightup-donation-options:not([hidden]) {
      margin-top: 14px;
      padding-top: 14px;
      border-top: 1px solid var(--lu-line);
    }

    html.tc-lightup-2026 #tc-lightup-donation-options[hidden] {
      display: none !important;
    }

    html.tc-lightup-2026 #tc-lightup-donation .tc-lightup-donation__choice {
      min-height: 64px;
      border-radius: 10px;
    }

    html.tc-lightup-2026 #AdditionalInformation.tc-lightup-survey .form-radio-item {
      padding-block: 8px !important;
      border-radius: 10px !important;
      background: #f7fafb !important;
    }

    html.tc-lightup-2026 #AdditionalInformation.tc-lightup-survey .form-radio-item:has(input:checked) {
      background: #e9f4f6 !important;
    }

    html.tc-lightup-2026 #RegisterSinglePage #Summary {
      background: #f7fafb !important;
    }

    @media (max-width: 600px) {
      html.tc-lightup-2026 #tc-lightup-donation .tc-lightup-donation__intro {
        margin-left: 0;
      }

      html.tc-lightup-2026 #RegisterSinglePage :is(input[type="text"], input[type="email"], input[type="tel"], select) {
        font-size: 16px !important;
      }
    }
`;
  styles.textContent += `
    html.tc-lightup-2026 #RegisterSinglePage:has(#Performances) {
      background: #fff !important;
      box-shadow: 0 12px 36px rgba(17, 63, 88, .06) !important;
    }

    html.tc-lightup-2026 #RegisterBody:has(#Performances) {
      max-width: 820px;
      margin-inline: auto !important;
      box-sizing: border-box;
    }

    html.tc-lightup-2026 #SecondaryFormItems:not([style*="display: none"]) {
      display: flex;
      flex-direction: column;
      border: 0 !important;
    }

    html.tc-lightup-2026 #RegisterSinglePage :is(#AdditionalInformation.tc-lightup-survey, #ReserversInformation, #Payment) {
      margin-top: 22px !important;
      padding: 20px 0 0 !important;
      border: 0 !important;
      border-top: 1px solid var(--lu-line) !important;
      border-radius: 0 !important;
      background: transparent !important;
    }

    html.tc-lightup-2026 #RegisterSinglePage #tc-lightup-donation {
      margin-top: 20px !important;
      padding: 14px clamp(14px, 3vw, 20px) !important;
    }

    html.tc-lightup-2026 #RegisterSinglePage #AdditionalInformation.tc-lightup-survey .form-radio-item {
      margin: 0 !important;
      padding: 8px 0 !important;
      border: 0 !important;
      border-radius: 0 !important;
      background: transparent !important;
    }

    html.tc-lightup-2026 #RegisterSinglePage #AdditionalInformation.tc-lightup-survey .form-radio-item label {
      cursor: pointer;
    }

    html.tc-lightup-2026 #ReserversInformation div:has(> .small_vertical_padding #ReserversFirstName) {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: 16px;
      row-gap: 12px;
    }

    html.tc-lightup-2026 #ReserversInformation div:has(> .small_vertical_padding #ReserversFirstName)::before,
    html.tc-lightup-2026 #ReserversInformation div:has(> .small_vertical_padding #ReserversFirstName)::after {
      display: none !important;
    }

    html.tc-lightup-2026 #ReserversInformation div:has(> .small_vertical_padding #ReserversFirstName) > div {
      min-width: 0;
      grid-column: 1 / -1;
      margin: 0 !important;
      padding: 0 !important;
    }

    html.tc-lightup-2026 #ReserversInformation .small_vertical_padding:has(
      :is(#ReserversFirstName, #ReserversLastName, #ReserversBillingCity,
          #ReserversBillingState, #ReserversBillingPostCode, #ReserversCountry)
    ) {
      grid-column: auto !important;
    }

    html.tc-lightup-2026 #ReserversInformation .small_vertical_padding:has(> .label + .float_left) > :is(.label, .float_left) {
      display: block;
      float: none !important;
      width: auto !important;
      margin: 0 !important;
    }

    html.tc-lightup-2026 #ReserversInformation .small_vertical_padding > .label {
      padding-bottom: 4px;
    }

    html.tc-lightup-2026 #ReserversInformation .small_vertical_padding > .float_left > :is(input, select) {
      width: 100% !important;
      max-width: 100% !important;
    }

    html.tc-lightup-2026 #SecondaryFormItems > #Summary {
      order: 1;
      margin-top: 22px !important;
      padding: 14px 16px !important;
      background: #f3f8f9 !important;
    }

    html.tc-lightup-2026 #SecondaryFormItems > #Buttons {
      order: 2;
    }

    @media (max-width: 600px) {
      html.tc-lightup-2026 #ReserversInformation div:has(> .small_vertical_padding #ReserversFirstName) {
        grid-template-columns: minmax(0, 1fr);
      }

      html.tc-lightup-2026 #Buttons #SubmitButton {
        width: 100% !important;
      }
    }
`;
  styles.textContent += `
    html.tc-lightup-2026 #Summary #Totals.tc-lightup-free-rsvp > :not(.tc-lightup-free-admission),
    html.tc-lightup-2026 #Summary .tc-lightup-free-admission[hidden] {
      display: none !important;
    }
    html.tc-lightup-2026 #Summary .tc-lightup-free-admission {
      color: var(--lu-night);
      font-weight: 700;
    }
  `;
  document.head.appendChild(styles);

  function improveRsvp(body) {
    var fields = {
      ReserversFirstName: ['First name', 'given-name'],
      ReserversLastName: ['Last name', 'family-name'],
      ReserversEmailAddress: ['Email address', 'email'],
      ReserversBillingAddress1: ['Billing address', 'address-line1'],
      ReserversBillingCity: ['City', 'address-level2'],
      ReserversBillingState: ['Province or state', 'address-level1'],
      ReserversBillingPostCode: ['Postal code', 'postal-code'],
      ReserversCountry: ['Country', 'country-name'],
      ReserversPhone: ['Phone number', 'tel']
    };

    function update() {
      Object.keys(fields).forEach(function (id) {
        var input = document.getElementById(id);
        if (!input) return;
        if (!input.labels?.length && !input.hasAttribute('aria-labelledby')) {
          input.setAttribute('aria-label', fields[id][0]);
        }
        input.setAttribute('autocomplete', fields[id][1]);
      });

      var guests = body.querySelectorAll('#performance_32755_reservations .reservation');
      guests.forEach(function (row, index) {
        ['firstName', 'lastName'].forEach(function (suffix) {
          var input = row.querySelector('input[id$="_' + suffix + '"]');
          if (input) input.setAttribute('aria-label', 'Guest ' + (index + 1) + (suffix === 'firstName' ? ' first name' : ' last name'));
        });
      });

      var buttonText = body.querySelector('#SubmitButton span');
      var totals = body.querySelector('#Summary #Totals');
      var amountCell = totals && totals.lastElementChild && totals.lastElementChild.lastElementChild;
      if (!guests.length || !buttonText || !amountCell) return;
      var total = Number(amountCell.textContent.replace(/[^0-9.-]/g, ''));
      if (!Number.isFinite(total)) return;
      var buttonLabel = total === 0 ? 'Confirm free RSVP' : 'Confirm RSVP and donate ' + amountCell.textContent.trim();
      if (buttonText.textContent !== buttonLabel) buttonText.textContent = buttonLabel;

      totals.classList.toggle('tc-lightup-free-rsvp', total === 0);
      var freeLabel = totals.querySelector('.tc-lightup-free-admission');
      if (!freeLabel) {
        freeLabel = document.createElement('div');
        freeLabel.className = 'tc-lightup-free-admission';
        freeLabel.textContent = 'Free admission';
        totals.prepend(freeLabel);
      }
      freeLabel.hidden = total !== 0;
    }

    update();
    new MutationObserver(update).observe(body, { childList: true, subtree: true, characterData: true });
  }

  function start() {
    var body = document.getElementById('RegisterBody');
    if (!body) return;
    improveRsvp(body);

    var script = document.getElementById('tc-light-up-2026-script');
    if (!script || !script.src.includes('@3368a68a623401668e271203fc60425d2158d6e1/')) return;
    function apply() {
      var card = document.getElementById('tc-lightup-donation');
      if (!card || card.querySelector('input[type="checkbox"]')) return;
      var title = card.querySelector('#tc-lightup-donation-title');
      var choices = card.querySelector('.tc-lightup-donation__choices');
      var custom = card.querySelector('#tc-lightup-custom-donation');
      var zero = choices && choices.querySelector('input[value="0"]');
      if (!title || !choices || !custom || !zero) return;

      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = 'tc-lightup-donation-opt-in';
      checkbox.setAttribute('aria-controls', 'tc-lightup-donation-options');
      checkbox.checked = !zero.checked;
      var label = document.createElement('label');
      label.append(checkbox, ' Would you consider making an optional donation?');
      title.replaceChildren(label);

      var options = document.createElement('div');
      options.id = 'tc-lightup-donation-options';
      options.hidden = !checkbox.checked;
      choices.before(options);
      options.append(choices, custom);

      checkbox.addEventListener('change', function () {
        options.hidden = !checkbox.checked;
        if (!checkbox.checked && !zero.checked) zero.click();
      });
    }

    apply();
    new MutationObserver(apply).observe(body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
