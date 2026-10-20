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
    refinementStyles.href = "https://rabbi-rgb.github.io/tricities-css/chai-club-refinement.css?v=17";
    document.head.appendChild(refinementStyles);
  }

  function polishChaiForm() {
    var form = document.getElementById("5995797");
    if (!form) return;
    document.documentElement.classList.add("tc-chai-refined");

    // Some published form content lacks the structural wrappers expected by
    // the Chai stylesheet. Restore only these presentation containers while
    // keeping the original content, controls, and event listeners intact.
    var introSystem = form.querySelector("#id_12 .chai-inline-system");
    if (introSystem && !form.querySelector("#id_12 .chai-intro")) {
      var introCopyBlock = introSystem.querySelector(".chai-intro-copy");
      var impactList = introSystem.querySelector(".chai-impact-list");
      if (introCopyBlock && impactList &&
          introCopyBlock.parentNode === introSystem &&
          impactList.parentNode === introSystem) {
        introSystem.classList.add("chai-intro");
      }
    }

    var faqHeading = form.querySelector("#id_25 .chai-faq-head");
    var faqList = form.querySelector("#id_25 .chai-faq-list");
    if (faqHeading && faqList &&
        faqHeading.parentNode === faqList.parentNode &&
        faqHeading.nextElementSibling === faqList &&
        !faqHeading.closest(".chai-faq")) {
      var faqSection = document.createElement("div");
      faqSection.className = "chai-faq";
      faqSection.setAttribute("aria-labelledby", "chai-faq-title");
      faqHeading.parentNode.insertBefore(faqSection, faqHeading);
      faqSection.appendChild(faqHeading);
      faqSection.appendChild(faqList);
    }

    var firstField = form.querySelector("#id_3");
    if (firstField && !form.querySelector("#tc-chai-head")) {
      var welcome = document.createElement("li");
      welcome.id = "tc-chai-head";
      welcome.className = "form-line";
      welcome.innerHTML =
        "<b>Become a monthly partner</b>" +
        "<h2>Join the Chai Club</h2>" +
        "<p>Choose your monthly gift. Every amount helps sustain our community.</p>";
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
    var action = hero && hero.querySelector(".tc-chai-hero-action");
    if (hero && !action) {
      action = document.createElement("div");
      action.className = "tc-chai-hero-action";
      hero.appendChild(action);
    }
    if (action && !action.dataset.chaiEditorialHero) {
      action.innerHTML =
        '<p>Monthly partners sustaining Jewish life in the Tri-Cities.</p>' +
        '<div class="tc-chai-hero-actions">' +
          '<a class="tc-chai-hero-primary" href="#tc-chai-head">Join the Chai Club <span aria-hidden="true">&#8594;</span></a>' +
          '<a class="tc-chai-hero-secondary" href="#chai-intro-title">See what your gift sustains</a>' +
        '</div>';
      action.dataset.chaiEditorialHero = "true";
      hero.classList.add("tc-chai-hero-ready");
    }

    // Build one art-directed hero composition from images already hosted in
    // the Tri-Cities Chabad media library. The images remain decorative while
    // the adjacent copy carries the page's meaning and accessible name.
    var heroShell = hero && hero.closest(".master-content-wrapper");
    if (hero && heroShell && !heroShell.querySelector(".tc-chai-hero-grid")) {
      var heroGrid = document.createElement("div");
      heroGrid.className = "tc-chai-hero-grid";
      hero.parentNode.insertBefore(heroGrid, hero);
      heroGrid.appendChild(hero);

      var heroArt = document.createElement("div");
      heroArt.className = "tc-chai-hero-art";
      heroArt.setAttribute("aria-hidden", "true");
      heroArt.innerHTML =
        '<span class="tc-chai-art-shape tc-chai-art-shape--gold"></span>' +
        '<span class="tc-chai-art-shape tc-chai-art-shape--sage"></span>' +
        '<span class="tc-chai-art-orbit"></span>' +
        '<figure class="tc-chai-art-photo tc-chai-art-photo--main">' +
          '<img src="https://w2.chabad.org/media/images/1324/sOqZ13243323.jpg" alt="" width="1000" height="667" decoding="async" fetchpriority="high">' +
        '</figure>' +
        '<figure class="tc-chai-art-photo tc-chai-art-photo--detail">' +
          '<img src="https://w2.chabad.org/media/images/1270/yPnp12706783.jpg" alt="" width="1000" height="750" decoding="async">' +
        '</figure>' +
        '<figure class="tc-chai-art-photo tc-chai-art-photo--table">' +
          '<img src="https://w2.chabad.org/media/images/1324/bSEH13243362.jpg" alt="" width="1000" height="667" decoding="async">' +
        '</figure>' +
        '<span class="tc-chai-art-mark" lang="he">חי</span>' +
        '<span class="tc-chai-art-caption">Gather · Learn · Belong</span>';
      heroGrid.appendChild(heroArt);
    }

    // Bring the giving section directly into view.
    var heroJoin = hero && hero.querySelector('.tc-chai-hero-action a[href="#tc-chai-head"]');
    if (heroJoin && !heroJoin.dataset.chaiJumpReady) {
      heroJoin.dataset.chaiJumpReady = "true";
      heroJoin.addEventListener("click", function (event) {
        var target = form.querySelector("#tc-chai-head");
        if (!target) return;
        event.preventDefault();
        target.setAttribute("tabindex", "-1");
        target.scrollIntoView({ block: "start", behavior: "instant" });
        target.focus({ preventScroll: true });
      });
    }

    // Repair a duplicated Instagram URL in this page's inherited footer.
    document.querySelectorAll('a[href*="instagram.com/https://"]').forEach(function (link) {
      var match = link.href.match(/^https:\/\/(?:www\.)?instagram\.com\/(https:\/\/(?:www\.)?instagram\.com\/.+)$/);
      if (match) link.href = match[1];
    });

    // Use real text nodes so the visible copy and accessible names agree.
    if (!form.dataset.chaiEditorialReady) {
      var introHeading = form.querySelector("#chai-intro-title");
      if (introHeading) introHeading.innerHTML = "A community supported<br>by its people.";
      var introCopy = form.querySelectorAll(".chai-intro-copy > p:not(.chai-kicker)");
      if (introCopy[0]) introCopy[0].innerHTML = "In Hebrew, <strong>chai</strong> means life. The Chai Club is a circle of monthly donors who help sustain Jewish life in Coquitlam, Port Coquitlam, and Port Moody.";
      if (introCopy[1]) introCopy[1].textContent = "Your support makes room for Shabbat dinners, holiday celebrations, Hebrew School, Torah learning, and care when someone needs it.";
      var impacts = [
        ["A place to gather", "Shabbat meals, holidays, and community events that bring people together."],
        ["A place to learn", "Jewish learning for children, teens, and adults, throughout the year."],
        ["A place to turn", "Hospital visits, personal support, and a listening ear when it matters."]
      ];
      form.querySelectorAll(".chai-impact-item").forEach(function (item, index) {
        if (!impacts[index]) return;
        item.querySelector("h3").textContent = impacts[index][0];
        item.querySelector("p").textContent = impacts[index][1];
      });
      var amountCopy = form.querySelector("#id_28 .form-html");
      if (amountCopy) amountCopy.innerHTML = '<p class="tc-chai-amount-note">All gifts below are monthly, in Canadian dollars.</p>';
      var currencyCopy = form.querySelector(".tc-chai-currency");
      if (currencyCopy) currencyCopy.remove();
      ["8", "18", "19"].forEach(function (tier) {
        var label = form.querySelector("#label_" + tier + " > label:first-child");
        if (label) label.textContent = tier === "8" ? "Bronze" : tier === "18" ? "Silver" : "Gold";
        var group = form.querySelector("#cid_" + tier);
        if (group && label) {
          group.setAttribute("role", "group");
          group.setAttribute("aria-label", label.textContent + " monthly gift options in CAD");
        }
      });
      var customAmount = form.querySelector("#input_8");
      if (customAmount) {
        customAmount.setAttribute("aria-label", "Your monthly gift in Canadian dollars");
        customAmount.setAttribute("inputmode", "decimal");
      }
      var minimumAnswer = form.querySelector(".chai-faq .chai-answer");
      if (minimumAnswer) minimumAnswer.textContent = "We welcome gifts of every size. The suggested amounts are a starting point; every monthly gift makes a difference.";
      var faqTitle = form.querySelector("#chai-faq-title");
      if (faqTitle) faqTitle.textContent = "About your monthly gift";
      var detailsFields = { first_3: "given-name", last_3: "family-name", input_4: "email", input_6_full: "tel" };
      Object.keys(detailsFields).forEach(function (id) {
        var field = form.querySelector("#" + id);
        if (field) field.setAttribute("autocomplete", detailsFields[id]);
      });
      form.dataset.chaiEditorialReady = "true";
    }

    // Add curated community-event crops even when the editorial copy was
    // initialized during an earlier asset version. This keeps the enhancement
    // safe and idempotent across cache updates.
    var impactImages = [
      ["https://w2.chabad.org/media/images/1270/yPnp12706783.jpg", "1000", "750"],
      ["https://w2.chabad.org/media/images/1324/sOqZ13243323.jpg", "1000", "667"],
      ["https://w2.chabad.org/media/images/1324/bSEH13243362.jpg", "1000", "667"]
    ];
    form.querySelectorAll(".chai-impact-item").forEach(function (item, index) {
      if (!impactImages[index] || item.querySelector(".tc-chai-impact-art")) return;
      var impactArt = document.createElement("span");
      impactArt.className = "tc-chai-impact-art";
      impactArt.setAttribute("aria-hidden", "true");
      impactArt.innerHTML = '<img src="' + impactImages[index][0] + '" alt="" width="' + impactImages[index][1] + '" height="' + impactImages[index][2] + '" loading="lazy" decoding="async">';
      item.appendChild(impactArt);
    });

    // A brief tonal pause separates the community story from the giving form.
    // It adds narrative rhythm without making an unverifiable claim.
    var joinPanel = form.querySelector("#tc-chai-join-panel");
    if (joinPanel && !form.querySelector("#tc-chai-continuity")) {
      var continuity = document.createElement("li");
      continuity.id = "tc-chai-continuity";
      continuity.className = "form-line";
      continuity.innerHTML =
        '<section aria-labelledby="tc-chai-continuity-title">' +
          '<div>' +
            '<p class="tc-chai-continuity-kicker">The strength of steady support</p>' +
            '<h2 id="tc-chai-continuity-title">Monthly giving turns generosity into continuity.</h2>' +
          '</div>' +
          '<p>It helps Chabad plan ahead, keep the doors open, and be ready for the celebrations, learning, and care that bring Jewish life into focus.</p>' +
        '</section>';
      joinPanel.parentNode.insertBefore(continuity, joinPanel);
    }

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
