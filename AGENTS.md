# Website change and release safeguards

These assets style https://www.jewishtricities.com on ChabadOne. The content editor and GitHub are separate sources of change. A successful GitHub Pages deployment does not prove the website renders correctly.

For every website styling or script change:

1. Read the affected page's current DOM and the existing page-specific styles/scripts. Do not infer correctness from a working homepage or stylesheet loading successfully.
2. Preserve native form nodes, names, IDs, action, validation handlers, and the visitor's choices. Move existing nodes rather than cloning or replacing payment/contact controls. Never submit a test donation.
3. Keep shared rules scoped. Check exclusions for Chai (`.tc-chai`), High Holidays (`.tc-high-holidays-minisite`), and syndicated pages before adding global overrides.
4. Run `pnpm install --frozen-lockfile` and `pnpm test`. Add a regression case for the actual failure being fixed. Export the freshly loaded public Chai DOM using approved browser tools, then run `pnpm check:markup /absolute/path/to/chai-dom.html` to check current markup compatibility; this is structural, not a visual check. Direct automated requests may be blocked by ChabadOne, so CI uses the saved fixture rather than pretending to verify the live site.
5. Before publishing, independently review the code. For this user's work, use another agent when available and resolve its actionable findings.
6. Visually inspect the affected pages in a preview, then on the freshly loaded public website after publishing. Include the homepage, Chai, and any other page families touched by shared CSS. Check at phone (320/390), tablet (768/820/1024), and desktop (1280) widths. Check overflow, headings, navigation, gift controls, and FAQ/partners disclosures. Record screenshots. Tests using a DOM simulator cannot approve layout.
7. For Chai, check Bronze/Silver/Gold selection exclusivity, custom amount enabling/clearing, recurring opt-out persistence beyond the initialization retries, FAQ expand/collapse, and the hero jump. Inspect console errors. Do not enter card details or submit payment.
8. Save exact before/after assets and ChabadOne header/footer, and a rollback instruction. Change only the intended loaders. Wait for successful asset deployment before activating a new cache version. Each asset has its own version: Chai JS is loaded in the ChabadOne header; refinement CSS is loaded inside `chai-club.js`. Bump the relevant loader whenever that asset changes.
9. Verify the public page uses the intended version and repeats initialization without duplicate sections. Report precisely what was checked, what was not, and whether an independent review occurred. Never claim all pages are verified from representative samples.

The CI workflow detects regressions on pushes/PRs. It is not a deployment gate: the existing GitHub Pages publishing workflow runs independently. Do not claim deployments are blocked by these checks or that CMS-only changes trigger them.
