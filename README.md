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
