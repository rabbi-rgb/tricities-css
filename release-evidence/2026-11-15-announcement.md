# Campaign announcement styling

CSS changes: bede6afcb2345fe07e098e6d03a96eb3478bf7cd and a0fad7d8936109e89e4d30fcb8e45a301950a20e.

Published loader: https://cdn.jsdelivr.net/gh/rabbi-rgb/tricities-css@a0fad7d8936109e89e4d30fcb8e45a301950a20e/site-shell.css

Verified public desktop and 390px phone. Phone alert bottom and navigation top both 137px. Also inspected 320px preview. Independent agent review found no actionable issues. All 56 repository tests passed. Other page families and full breakpoint matrix were not retested.

Rollback: change only the site-shell loader to https://cdn.jsdelivr.net/gh/rabbi-rgb/tricities-css@bede6afcb2345fe07e098e6d03a96eb3478bf7cd~1/site-shell.css using a resolved parent commit, or remove the Campaign announcement block and following mobile/desktop header offsets from site-shell.css and deploy with a new version. Preserve unrelated newer CMS edits. Do not restore the entire old CMS header if newer edits exist.

## Exact original header

```html
<link href="https://webmk.co/sites/general/cdo-normalize.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">

<link rel="stylesheet" href="https://rabbi-rgb.github.io/tricities-css/site-shell.css?v=20261019-theme-repair-4">
<script src="https://vocal-narwhal-02ad02.netlify.app/script.js?v=2"></script>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap" rel="stylesheet">
<script>(function(){var p=(location.pathname+location.search).toLowerCase();if(/5995797/.test(p)||/^\/chai(?:\/|\?|$)/.test(p)){document.documentElement.classList.add('tc-chai','tc-chai-loading');}})();</script>
<style id="tc-chai-boot-styles">html.tc-chai-loading body.cco_body #co_content_container{visibility:hidden!important}</style>
<link id="tc-chai-refinement-styles" rel="stylesheet" href="https://rabbi-rgb.github.io/tricities-css/chai-club-refinement.css?v=24">
<script src="https://rabbi-rgb.github.io/tricities-css/chai-club.js?v=24" defer></script>

<!-- Hosted page code (was inline). Bump ?v= after every change. -->
<script src="https://vocal-narwhal-02ad02.netlify.app/tc-header.js?v=3"></script>
<link rel="stylesheet" href="https://vocal-narwhal-02ad02.netlify.app/tc-header.css?v=3">

<!-- Existing design rules preserved in original order; original files retained for rollback. -->
<link rel="stylesheet" href="https://rabbi-rgb.github.io/tricities-css/site-polish-bundle.4e48c0370e624e0d.css?v=817d844">

<!-- homepage-polish.css is preserved in the shared design bundle. -->
<script src="https://rabbi-rgb.github.io/tricities-css/homepage-polish.js?v=20261015-2" defer></script>

<!-- homepage-finish.css is preserved in the shared design bundle. -->
<!-- forms-refresh-v2.css is preserved in the shared design bundle. -->
<script src="https://rabbi-rgb.github.io/tricities-css/forms-refresh-v2.js?v=20261015-3" defer></script>

<!-- homepage-cleanup.css is preserved in the shared design bundle. -->
<!-- homepage-signup-simple.css is preserved in the shared design bundle. -->
<script src="https://rabbi-rgb.github.io/tricities-css/homepage-signup-simple.js?v=20261015-1" defer></script>
<!-- forms-alignment.css is preserved in the shared design bundle. -->
<script src="https://rabbi-rgb.github.io/tricities-css/forms-alignment.js?v=20261015-1" defer></script>
<!-- learning-image-fix.css is preserved in the shared design bundle. -->
<!-- homepage-radius.css is preserved in the shared design bundle. -->
<!-- homepage-blue-outline.css is preserved in the shared design bundle. -->
<!-- homepage-header-align.css is preserved in the shared design bundle. -->

<!-- Light Up the Tri-Cities event 24229; remove this link to roll back the styles. -->
<link rel="stylesheet" id="tc-light-up-2026-style" href="https://cdn.jsdelivr.net/gh/rabbi-rgb/jewishtricities-web-assets@3368a68a623401668e271203fc60425d2158d6e1/light-up-2026.css">
```

## Exact original footer (unchanged)

```html
<link rel="stylesheet" href="https://rabbi-rgb.github.io/tricities-css/site-code/footer-01-ddefc112e453.css">
<link rel="stylesheet" href="https://rabbi-rgb.github.io/tricities-css/site-code/footer-02-880f8663c552.css">
<link rel="stylesheet" href="https://w2.Chabad.org/images/Shluchim/minisites/themes/form-redesign/form-style.css?v=7/17/2026">
<link rel="stylesheet" href="https://rabbi-rgb.github.io/tricities-css/site-code/footer-03-fb51d203f6b0.css">
<link rel="stylesheet" id="tc-fall-clean-form" href="https://rabbi-rgb.github.io/tricities-css/site-code/footer-04-24a6da190494.css">
<link rel="stylesheet" id="tc-flexible-contribution-style" href="https://rabbi-rgb.github.io/tricities-css/site-code/footer-05-a5b8779e8032.css">
<link rel="stylesheet" id="tc-fall-expiry-row" href="https://rabbi-rgb.github.io/tricities-css/site-code/footer-06-eaf16ca3cd3f.css">
<link rel="stylesheet" id="tc-ente-event-style" href="https://rabbi-rgb.github.io/tricities-css/site-code/footer-07-1167682953d0.css">
<link rel="stylesheet" id="tc-ente-receipt-style" href="https://rabbi-rgb.github.io/tricities-css/site-code/footer-08-6c8ca0a92d77.css">
<script src="https://rabbi-rgb.github.io/tricities-css/site-code/footer-09-8b9c7b211476.js"></script>
<script src="https://rabbi-rgb.github.io/tricities-css/site-code/footer-10-acda200d9c56.js"></script>
<script type="text/javascript" src="https://w2.Chabad.org/images/Shluchim/minisites/themes/form-redesign/form-script.js?v=7/17/2026"></script>

<script src="https://rabbi-rgb.github.io/tricities-css/site-code/footer-11-a78634d7e133.js"></script>
<script src="https://rabbi-rgb.github.io/tricities-css/site-code/footer-12-d510064376dd.js"></script>

<script id="tc-hh-reservations-interactions-v11" src="https://cdn.jsdelivr.net/gh/rabbi-rgb/jewishtricities-web-assets@fdf688ac9cf07255c10614d3bc7a034937405dcc/reservations-v11.js" defer=""></script>
<script src="https://rabbi-rgb.github.io/tricities-css/jli-kabbalah-location.js?v=1"></script>
<script src="https://rabbi-rgb.github.io/tricities-css/site-code/footer-13-b65b8b0c5495.js"></script>
<script id="tc-flexible-contribution" src="https://rabbi-rgb.github.io/tricities-css/site-code/footer-14-2d79b5d761e9.js"></script>
<script id="tc-fall-labels" src="https://rabbi-rgb.github.io/tricities-css/site-code/footer-15-81696745f8ae.js"></script>
<script id="tc-ente-event-contribution" src="https://rabbi-rgb.github.io/tricities-css/site-code/footer-16-fac38d0fecb8.js"></script>
<script id="tc-ente-receipt-script" src="https://rabbi-rgb.github.io/tricities-css/site-code/footer-17-366d742d0b4b.js"></script>
<link rel="stylesheet" id="tc-album-cover-fix" href="https://rabbi-rgb.github.io/tricities-css/site-code/footer-18-a56ff37a517e.css">

<link rel="stylesheet" id="tc-gallery-header-fix" href="https://rabbi-rgb.github.io/tricities-css/site-code/footer-19-d8f311f7f2f3.css">

<!-- Cozy Fall Shabbat photo refresh; remove this one link to roll back. -->
<link rel="stylesheet" id="tc-fall-shabbat-photo" href="https://cdn.jsdelivr.net/gh/rabbi-rgb/tricities-css@819ab4dd982336511ad27655f4d21307fb626f48/site-code/footer-20-9edaba2cee18.css">

<!-- Cozy Fall Shabbat copy cleanup; remove these two tags to roll back. -->
<script id="tc-fall-welcome-note" src="https://cdn.jsdelivr.net/gh/rabbi-rgb/tricities-css@898ce06c8bd5adfb95d1a56f8114a8fbf66f1e5e/site-code/footer-21-81351837868a.js"></script>
<link rel="stylesheet" id="tc-fall-kicker-cleanup" href="https://cdn.jsdelivr.net/gh/rabbi-rgb/tricities-css@898ce06c8bd5adfb95d1a56f8114a8fbf66f1e5e/site-code/footer-22-300e977e0dd1.css">

<!-- Cozy Fall Shabbat quantity-label alignment; remove this one link to roll back. -->
<link rel="stylesheet" id="tc-fall-quantity-label-center" href="https://cdn.jsdelivr.net/gh/rabbi-rgb/tricities-css@68950f4ea552983302bfdb6f574230cd79a96fdb/site-code/footer-23-be9674432d27.css">


<!-- Charcuterie & Champagne event 24151; remove these two tags to roll back. -->
<link rel="stylesheet" id="tc-charcuterie-event-style" href="https://cdn.jsdelivr.net/gh/rabbi-rgb/tricities-css@05161776337d985f6e148d34857e314e19ca16af/charcuterie-champagne.css">
<script id="tc-charcuterie-event-script" src="https://cdn.jsdelivr.net/gh/rabbi-rgb/tricities-css@3a31a4f852c7d9681b60afd2ff5a1491f7a12eb9/charcuterie-champagne.js" defer></script>

<!-- Chanukah LIT! event 24173; remove these two tags to roll back the design. -->
<link rel="stylesheet" id="tc-chanukah-lit-event-style" href="https://cdn.jsdelivr.net/gh/rabbi-rgb/tricities-css@c62f76fc8b2e6594e054b557dfef4345a920731c/chanukah-lit.css">
<script id="tc-chanukah-lit-event-script" src="https://cdn.jsdelivr.net/gh/rabbi-rgb/tricities-css@c62f76fc8b2e6594e054b557dfef4345a920731c/chanukah-lit.js" defer></script>

<!-- Light Up the Tri-Cities event 24229; remove this script to roll back the enhancements. -->
<script id="tc-light-up-2026-script" src="https://cdn.jsdelivr.net/gh/rabbi-rgb/jewishtricities-web-assets@3368a68a623401668e271203fc60425d2158d6e1/light-up-2026.js" defer></script>

<!-- Light Up 24229 date correction: Dec 29 to Dec 8; remove this one script to roll back. -->
<script id="tc-light-up-2026-date-fix">(function(){function fix(r){if(!r)return;var w=document.createTreeWalker(r,NodeFilter.SHOW_TEXT,null),n;while((n=w.nextNode())){if(n.nodeValue.indexOf("December 29")!==-1)n.nodeValue=n.nodeValue.split("December 29").join("December 8");}}function run(){fix(document.getElementById("tc-lightup-hero"));var t=document.getElementById("tc-lightup-receipt-title");if(t&&t.parentNode)fix(t.parentNode);}if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",run);}else{run();}new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});})();</script>

<!-- Candle-lighting presentation; remove this script to roll back. -->
<script id="tc-candlelighting-page" src="https://cdn.jsdelivr.net/gh/rabbi-rgb/tricities-css@dc5db8b4ffcae85d76f718ab1673274964c2ee82/candlelighting-page.js"></script>

<!-- Homepage layout and accessibility; remove this script to roll back page fixes. -->
<script id="tc-homepage-repairs" src="https://cdn.jsdelivr.net/gh/rabbi-rgb/tricities-css@d16860f48f3d57f4087b04083ddf37b92424e52d/homepage-repairs.js"></script>

<!-- Donation page 4970020 colours; remove this link to roll back. -->
<link rel="stylesheet" id="tc-donation-palette" href="https://cdn.jsdelivr.net/gh/rabbi-rgb/tricities-css@bfb098c68e6eedb4684fd5d703e229b479053858/donation-palette.css" />
<!-- U.S. donation page 6406028 layout; restore prior CSS pin and remove tc-us-donation-layout to roll back. -->
<link rel="stylesheet" id="tc-us-donation-palette" href="https://cdn.jsdelivr.net/gh/rabbi-rgb/tricities-css@044accaef6a084a71d4f0f74b32bab08d55e7652/us-donation-palette.css" />

<script id="tc-us-donation-layout" src="https://cdn.jsdelivr.net/gh/rabbi-rgb/tricities-css@044accaef6a084a71d4f0f74b32bab08d55e7652/us-donation-layout.js" defer="defer"></script>

```
