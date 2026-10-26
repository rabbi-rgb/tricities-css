(function () {
  "use strict";

  var pageAddress = (window.location.pathname + window.location.search).toLowerCase();
  var isChaiAddress = /5995797/.test(pageAddress) || /^\/chai(?:\/|\?|$)/.test(pageAddress);
  var hasChaiForm = !!document.getElementById("5995797");

  if (!isChaiAddress && !hasChaiForm) return;

  document.documentElement.classList.add("tc-chai", "tc-chai-loading");

  // Prevent the native form from painting before the one final layout is ready.
  // This tiny guard is removed as soon as both the DOM enhancement and the
  // consolidated stylesheet are available.
  var bootStyles = document.getElementById("tc-chai-boot-styles");
  if (!bootStyles) {
    bootStyles = document.createElement("style");
    bootStyles.id = "tc-chai-boot-styles";
    bootStyles.textContent = "html.tc-chai-loading body.cco_body #co_content_container{visibility:hidden!important}";
    document.head.appendChild(bootStyles);
  }

  var enhancementReady = false;
  var stylesheetReady = false;
  var formObserver = null;
  var loadingGuardRemoved = false;
  var revealObservationStarter = null;

  function startQueuedRevealObservation() {
    if (!revealObservationStarter) return;
    var startObservation = revealObservationStarter;
    revealObservationStarter = null;
    if (window.requestAnimationFrame) window.requestAnimationFrame(startObservation);
    else window.setTimeout(startObservation, 0);
  }

  function removeLoadingGuard() {
    document.documentElement.classList.remove("tc-chai-loading");
    if (bootStyles && bootStyles.parentNode) bootStyles.parentNode.removeChild(bootStyles);
    loadingGuardRemoved = true;
    startQueuedRevealObservation();
  }

  function revealChaiPage() {
    if (!enhancementReady || !stylesheetReady) return;
    window.clearTimeout(failOpenTimer);
    if (formObserver) formObserver.disconnect();
    removeLoadingGuard();
  }

  // Network or CMS markup failures must never strand the public page hidden.
  var failOpenTimer = window.setTimeout(function () {
    if (formObserver) formObserver.disconnect();
    removeLoadingGuard();
  }, 3000);

  // Load this page's small stylesheet independently of cached site headers.
  var refinementStyles = document.getElementById("tc-chai-refinement-styles");
  if (!refinementStyles) {
    refinementStyles = document.createElement("link");
    refinementStyles.id = "tc-chai-refinement-styles";
    refinementStyles.rel = "stylesheet";
    refinementStyles.href = "https://rabbi-rgb.github.io/tricities-css/chai-club-refinement.css?v=26";
    document.head.appendChild(refinementStyles);
  }

  refinementStyles.addEventListener("load", function () {
    stylesheetReady = true;
    revealChaiPage();
  }, { once: true });
  refinementStyles.addEventListener("error", function () {
    stylesheetReady = true;
    revealChaiPage();
  }, { once: true });
  if (refinementStyles.sheet) stylesheetReady = true;

  function polishChaiForm() {
    var form = document.getElementById("5995797");
    if (!form) return false;

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

    // Keep the partner names visible as a genuine thank-you, then place the
    // FAQ beneath them. Only the individual questions remain disclosures.
    var faq = form.querySelector("#id_25 .chai-faq");
    var oldFaqDisclosure = form.querySelector("#id_25 .tc-chai-faq-disclosure");
    if (faq && oldFaqDisclosure) {
      oldFaqDisclosure.parentNode.insertBefore(faq, oldFaqDisclosure);
      oldFaqDisclosure.remove();
    }

    var partners = form.querySelector("#id_25 details.chai-partners");
    if (partners) {
      var staticPartners = document.createElement("section");
      staticPartners.className = "chai-partners tc-chai-partners-static";
      staticPartners.setAttribute("aria-labelledby", "tc-chai-partners-title");
      staticPartners.innerHTML =
        '<header class="tc-chai-partners-head">' +
          '<span class="chai-kicker">With gratitude to our</span>' +
          '<h2 id="tc-chai-partners-title">Chai Club partners</h2>' +
        '</header>';
      Array.from(partners.children).forEach(function (child) {
        if (child.tagName !== "SUMMARY") staticPartners.appendChild(child);
      });
      partners.parentNode.replaceChild(staticPartners, partners);
      partners = staticPartners;
    } else {
      partners = form.querySelector("#id_25 .tc-chai-partners-static");
    }

    var partnerList = partners && partners.querySelector(".chai-partners-list");
    if (partnerList && !partnerList.querySelector(".tc-chai-partner-name")) {
      var partnerNames = partnerList.textContent.split("·").map(function (name) {
        return name.trim();
      }).filter(Boolean);
      partnerList.textContent = "";
      partnerNames.forEach(function (name) {
        var partnerName = document.createElement("span");
        partnerName.className = "tc-chai-partner-name";
        partnerName.textContent = name;
        partnerList.appendChild(partnerName);
      });
    }

    // Derive the public count from the names that are actually rendered so it
    // cannot drift when the ChabadOne content is updated. Anonymous entries
    // remain distinct because each one represents a separate listed partner.
    if (partners && partnerList) {
      var partnerCount = partnerList.querySelectorAll(".tc-chai-partner-name").length;
      var partnerCountCopy = partners.querySelector(".tc-chai-partner-count");
      if (!partnerCountCopy) {
        partnerCountCopy = document.createElement("p");
        partnerCountCopy.className = "tc-chai-partner-count";
        partners.querySelector(".tc-chai-partners-head").appendChild(partnerCountCopy);
      }
      partnerCountCopy.textContent = partnerCount + " active Chai Club " + (partnerCount === 1 ? "partner" : "partners") + "—and growing.";
    }

    if (partners && faq && partners.nextElementSibling !== faq) {
      partners.parentNode.insertBefore(faq, partners.nextSibling);
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
        custom.innerHTML = '<div class="tc-chai-custom-copy"><label for="other_8">Choose a different amount</label><p>Enter any monthly gift that works for you.</p></div><div class="tc-chai-custom-input"></div>';
        custom.querySelector(".tc-chai-custom-input").appendChild(other.closest(".form-radio-item"));
        membership.parentNode.insertBefore(custom, membership);
        form.querySelector("#input_8").setAttribute("placeholder", "Enter amount");
        form.querySelector("#input_8").setAttribute("data-otherhint", "Enter amount");
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

    var amountSelector = '#input_8_0, #input_8_1, #input_8_2, #other_8, #input_18_0, #input_18_1, #input_18_2, #other_18, #input_19_0, #input_19_1, #input_19_2, #other_19';

    function selectedGift() {
      var selected = form.querySelector(amountSelector.split(", ").map(function (selector) {
        return selector + ":checked";
      }).join(", "));
      if (!selected) return null;

      var amount = selected.value;
      if (/^other_/i.test(selected.id)) {
        var customField = form.querySelector("#input_" + selected.id.replace("other_", ""));
        amount = customField && customField.value;
      }
      var rawAmount = String(amount || "").trim();
      if (!/^(?:\d+|\d*\.\d+)$/.test(rawAmount)) return { amount: null };
      amount = Number(rawAmount);
      if (!Number.isFinite(amount) || amount < 1) return { amount: null };
      return { amount: amount };
    }

    function formatCad(amount) {
      try {
        return new Intl.NumberFormat("en-CA", {
          style: "currency",
          currency: "CAD",
          minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
          maximumFractionDigits: 2
        }).format(amount);
      } catch (error) {
        return "$" + amount.toFixed(Number.isInteger(amount) ? 0 : 2);
      }
    }

    function updateGiftSummary() {
      var summary = form.querySelector(".tc-chai-gift-summary");
      if (!summary) return;
      var gift = selectedGift();
      var recurringChoice = form.querySelector("#input_24");
      var value = summary.querySelector(".tc-chai-gift-summary-value");
      var reassurance = form.querySelector(".tc-chai-reassurance");
      if (!gift) {
        value.textContent = "Select an amount above";
      } else if (!gift.amount) {
        value.textContent = "Enter your gift amount above";
      } else {
        value.textContent = formatCad(gift.amount) + " CAD" + (recurringChoice && recurringChoice.checked ? "/month" : " one-time");
      }
      if (reassurance) {
        reassurance.textContent = recurringChoice && recurringChoice.checked
          ? "Secure payment · Change or cancel your monthly gift anytime"
          : "Secure payment · One-time gift";
      }
    }

    if (!form.dataset.chaiAmountListener) {
      form.dataset.chaiAmountListener = "true";
      form.addEventListener("change", function (event) {
        var selected = event.target;
        if (!selected.matches(amountSelector) || !selected.checked) {
          if (selected.id === "input_24" || selected.matches('[id^="input_"][type="number"]')) updateGiftSummary();
          return;
        }
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
        updateGiftSummary();
      });
    }

    var customGift = form.querySelector("#input_8");
    if (customGift && !customGift.dataset.chaiSummaryListener) {
      customGift.dataset.chaiSummaryListener = "true";
      customGift.addEventListener("input", function () {
        updateGiftSummary();
      });
    }

    // The native form disables the custom input until its small radio is
    // selected. Treat the whole custom row as the target so the field never
    // feels unresponsive when a donor clicks directly into it.
    var customRow = form.querySelector("#tc-chai-custom");
    if (customRow && customGift && !customRow.dataset.chaiActivationListener) {
      customRow.dataset.chaiActivationListener = "true";
      customRow.addEventListener("click", function (event) {
        var customChoice = form.querySelector("#other_8");
        if (!customChoice) return;
        if (!customChoice.checked) {
          customChoice.checked = true;
          customChoice.dispatchEvent(new Event("change", { bubbles: true }));
        }
        if (event.target !== customGift) {
          window.setTimeout(function () { customGift.focus(); }, 0);
        }
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
        '<figure class="tc-chai-art-photo tc-chai-art-photo--main">' +
          '<img src="https://w2.chabad.org/media/images/1324/sOqZ13243323.jpg" alt="" width="1000" height="667" decoding="async" fetchpriority="high">' +
        '</figure>' +
        '<span class="tc-chai-art-mark" lang="he">חי</span>' +
        '<span class="tc-chai-art-caption">Jewish life, together</span>';
      heroGrid.appendChild(heroArt);
    }

    // A small page-specific landmark keeps the long fundraising journey easy
    // to scan without competing with the site's primary navigation.
    if (heroShell && !heroShell.querySelector(".tc-chai-section-nav")) {
      var sectionNav = document.createElement("nav");
      sectionNav.className = "tc-chai-section-nav";
      sectionNav.setAttribute("aria-label", "Chai Club sections");
      sectionNav.innerHTML =
        '<a href="#chai-intro-title">Why it matters</a>' +
        '<a href="#tc-chai-partners-title">Our partners</a>' +
        '<a class="tc-chai-section-nav-join" href="#tc-chai-join-title">Join</a>';
      heroShell.appendChild(sectionNav);
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

    var heroExplore = hero && hero.querySelector('.tc-chai-hero-action a[href="#chai-intro-title"]');
    if (heroExplore && !heroExplore.dataset.chaiJumpReady) {
      heroExplore.dataset.chaiJumpReady = "true";
      heroExplore.addEventListener("click", function (event) {
        var target = form.querySelector("#chai-intro-title");
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
      ["8", "18", "19"].forEach(function (tier) {
        var label = form.querySelector("#label_" + tier + " > label:first-child");
        if (label) label.textContent = tier === "8" ? "Bronze" : tier === "18" ? "Silver" : "Gold";
        var group = form.querySelector("#cid_" + tier);
        if (group && label) {
          group.setAttribute("role", "group");
          group.setAttribute("aria-label", label.textContent + " monthly gift options");
        }
      });
      var customAmount = form.querySelector("#input_8");
      if (customAmount) {
        customAmount.setAttribute("aria-label", "Your monthly gift amount");
        customAmount.setAttribute("inputmode", "decimal");
      }
      var minimumAnswer = form.querySelector(".chai-faq .chai-answer");
      if (minimumAnswer) minimumAnswer.textContent = "We welcome gifts of every size. The suggested amounts are a starting point; every monthly gift makes a difference.";
      var detailsFields = { first_3: "given-name", last_3: "family-name", input_4: "email", input_6_full: "tel" };
      Object.keys(detailsFields).forEach(function (id) {
        var field = form.querySelector("#" + id);
        if (field) field.setAttribute("autocomplete", detailsFields[id]);
      });
      form.dataset.chaiEditorialReady = "true";
    }

    // Versioned editorial updates run even on a preview or cached DOM that
    // was enhanced by an earlier release.
    var impacts = [
      ["A place to gather", "Shabbat meals, holidays, and community events that bring people together."],
      ["A place to learn", "Jewish learning and thoughtful conversation for every stage of life."],
      ["A place to belong", "Friendship, connection, and a Jewish community that is here for you."]
    ];
    form.querySelectorAll(".chai-impact-item").forEach(function (item, index) {
      if (!impacts[index]) return;
      item.querySelector("h3").textContent = impacts[index][0];
      item.querySelector("p").textContent = impacts[index][1];
    });
    var amountCopy = form.querySelector("#id_28 .form-html");
    if (amountCopy) amountCopy.textContent = "";
    var currencyCopy = form.querySelector(".tc-chai-currency");
    if (currencyCopy) currencyCopy.remove();
    var customLabel = form.querySelector("#tc-chai-custom .tc-chai-custom-copy label");
    var customHelp = form.querySelector("#tc-chai-custom .tc-chai-custom-copy p");
    if (customLabel) customLabel.textContent = "Choose a different amount";
    if (customHelp) customHelp.textContent = "Enter any monthly gift that works for you.";
    var customAmount = form.querySelector("#input_8");
    if (customAmount) {
      customAmount.setAttribute("placeholder", "Enter amount");
      customAmount.setAttribute("data-otherhint", "Enter amount");
      customAmount.setAttribute("aria-label", "Your monthly gift amount");
    }
    var faqTitle = form.querySelector("#chai-faq-title");
    if (faqTitle) faqTitle.textContent = "Questions about monthly giving";

    // Add curated community-event crops even when the editorial copy was
    // initialized during an earlier asset version. This keeps the enhancement
    // safe and idempotent across cache updates.
    var impactImages = [
      ["https://w2.chabad.org/media/images/1389/Qhze13899668.jpeg", "1000", "750"],
      ["https://w2.chabad.org/media/images/1389/pPdT13899572.jpg", "562", "750"],
      ["https://w2.chabad.org/media/images/1389/YXBy13899570.jpeg", "931", "750"]
    ];
    form.querySelectorAll(".chai-impact-item").forEach(function (item, index) {
      if (!impactImages[index]) return;
      var impactArt = item.querySelector(".tc-chai-impact-art");
      if (!impactArt) {
        impactArt = document.createElement("span");
        impactArt.className = "tc-chai-impact-art";
        impactArt.setAttribute("aria-hidden", "true");
        item.appendChild(impactArt);
      }
      impactArt.innerHTML = '<img src="' + impactImages[index][0] + '" alt="" width="' + impactImages[index][1] + '" height="' + impactImages[index][2] + '" loading="lazy" decoding="async">';
    });

    // Remove the former full-width interstitial if this upgrade runs over an
    // already-enhanced DOM. The story now flows directly into the giving form.
    var oldContinuity = form.querySelector("#tc-chai-continuity");
    if (oldContinuity) oldContinuity.remove();

    var submitRow = form.querySelector("#id_2");
    if (submitRow && !submitRow.querySelector(".tc-chai-gift-summary")) {
      var giftSummary = document.createElement("div");
      giftSummary.className = "tc-chai-gift-summary";
      giftSummary.setAttribute("role", "status");
      giftSummary.setAttribute("aria-live", "polite");
      giftSummary.setAttribute("aria-atomic", "true");
      giftSummary.innerHTML =
        '<span class="tc-chai-gift-summary-label">Your gift</span>' +
        '<strong class="tc-chai-gift-summary-value">Select an amount above</strong>';
      submitRow.insertBefore(giftSummary, submitRow.firstChild);
    }
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
          updateGiftSummary();
        });
      }
    }

    updateGiftSummary();

    // Offer a compact mobile return-to-form action after the hero CTA leaves
    // view. It retires before the form begins, so it never covers payment or
    // confirmation controls.
    var joinPanel = form.querySelector("#tc-chai-join-panel");
    var mobileJoin = document.querySelector(".tc-chai-mobile-join");
    if (!mobileJoin) {
      mobileJoin = document.createElement("a");
      mobileJoin.className = "tc-chai-mobile-join";
      mobileJoin.href = "#tc-chai-join-title";
      mobileJoin.setAttribute("aria-label", "Join the Chai Club — go to the donation form");
      mobileJoin.setAttribute("aria-hidden", "true");
      mobileJoin.tabIndex = -1;
      mobileJoin.innerHTML = 'Join the Chai Club <span aria-hidden="true">&#8594;</span>';
      document.body.appendChild(mobileJoin);
    }

    var setMobileJoinVisible = function (show) {
      mobileJoin.classList.toggle("is-visible", show);
      mobileJoin.setAttribute("aria-hidden", show ? "false" : "true");
      mobileJoin.tabIndex = show ? 0 : -1;
    };

    if (mobileJoin && !mobileJoin.dataset.chaiClickReady) {
      mobileJoin.dataset.chaiClickReady = "true";
      mobileJoin.addEventListener("click", function (event) {
        var target = form.querySelector("#tc-chai-join-title");
        if (!target) return;
        event.preventDefault();
        setMobileJoinVisible(false);
        target.setAttribute("tabindex", "-1");
        if (target.scrollIntoView) target.scrollIntoView({ block: "start", behavior: "instant" });
        if (target.focus) target.focus({ preventScroll: true });
      });
    }

    if (mobileJoin && heroJoin && joinPanel && !mobileJoin.dataset.chaiObserved && "IntersectionObserver" in window) {
      mobileJoin.dataset.chaiObserved = "true";
      var heroActionVisible = true;
      var formReached = false;
      var updateMobileJoin = function () {
        setMobileJoinVisible(!heroActionVisible && !formReached);
      };
      var heroActionObserver = new IntersectionObserver(function (entries) {
        heroActionVisible = entries[0].isIntersecting;
        updateMobileJoin();
      }, { threshold: 0.01 });
      var joinPanelObserver = new IntersectionObserver(function (entries) {
        var entry = entries[0];
        formReached = entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight * 0.82;
        updateMobileJoin();
      }, { threshold: 0, rootMargin: "0px 0px -18% 0px" });
      heroActionObserver.observe(heroJoin);
      joinPanelObserver.observe(joinPanel);
    }

    document.documentElement.classList.add("tc-chai-refined");

    // Progressive, one-time reveals. Content is visible by default and only
    // receives the hidden starting state after this enhancement is ready.
    if (!document.documentElement.dataset.chaiRevealReady) {
      document.documentElement.dataset.chaiRevealReady = "true";
      var revealTargets = [
        hero,
        heroShell && heroShell.querySelector(".tc-chai-hero-art"),
        form.querySelector("#id_12 .chai-intro-copy"),
        form.querySelector("#tc-chai-head"),
        partners,
        form.querySelector(".chai-faq-head")
      ].filter(Boolean).concat(Array.from(form.querySelectorAll(".chai-impact-item")));

      revealTargets.forEach(function (target, index) {
        target.classList.add("tc-chai-reveal");
        if (target.matches(".chai-impact-item")) {
          target.style.setProperty("--tc-chai-reveal-delay", ((index % 3) * 80) + "ms");
        }
      });

      var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion || !("IntersectionObserver" in window)) {
        revealTargets.forEach(function (target) { target.classList.add("is-revealed"); });
      } else {
        document.documentElement.classList.add("tc-chai-motion-ready");
        var revealObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-revealed");
            revealObserver.unobserve(entry.target);
          });
        // Start just before the section enters the viewport. Waiting until a
        // large portion is visible creates a blank-looking block while a user
        // scrolls, especially on shorter laptop and mobile screens.
        }, { threshold: 0.01, rootMargin: "0px 0px 12% 0px" });
        var beginRevealObservation = function () {
          revealTargets.forEach(function (target) { revealObserver.observe(target); });
        };
        revealObservationStarter = beginRevealObservation;
        if (loadingGuardRemoved) startQueuedRevealObservation();
      }
    }

    enhancementReady = true;
    revealChaiPage();
    return true;
  }


  function start() {
    if (polishChaiForm()) return;

    // Only observe when ChabadOne has not inserted the native form yet.
    // Disconnect immediately after the single successful enhancement.
    formObserver = new MutationObserver(function () {
      if (!polishChaiForm()) return;
      formObserver.disconnect();
    });
    formObserver.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
