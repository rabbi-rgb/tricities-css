# Tri-Cities website assets

## Checks before releases

Use Node 22 and pnpm 10.18.3:

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm check:markup /absolute/path/to/fresh-chai-dom.html
```

Tests cover the Chai missing-wrapper incident, repeated initialization, existing/malformed markup, form control identity/handlers, unrelated pages, and gift choice behaviour. The read-only markup check exercises a fresh public Chai DOM exported through the browser against the repository script without executing external scripts or submitting a form.

GitHub runs the fixture regression tests on pushes and pull requests; they can also be run manually under Actions. They detect problems but do not block the separate GitHub Pages deployment. CMS-only edits do not automatically run these checks.

Follow [AGENTS.md](AGENTS.md) for the required desktop/mobile visual checks, independent review, cache versions and rollback evidence. Passing structural tests is not approval of the page's appearance or payment processing.

## Shared design stylesheet bundle

`site-polish-bundle.json` records the 11 existing header stylesheets in their original order and their SHA-256 hashes. The generated, content-named CSS preserves every original byte; no declarations are removed or minified. Original source files remain available.

After changing one of those source files, run `node scripts/build-polish-bundle.cjs`, then `pnpm test`. Review responsive previews and update the header to the newly generated filename only after successful deployment. Keep old bundle files available for rollback. Do not change a content-named file in place.

Rollback uses the exact pre-change ChabadOne header saved with the release backup. If other work has updated that header since, restore only the 11 original stylesheet tags in their recorded positions; preserve newer unrelated edits. Footer code, scripts, site-shell, site-theme and Chai-specific files are not changed by this optimization.
