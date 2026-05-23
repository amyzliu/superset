# test(e2e): port url_params dashboard test from Cypress to Playwright

## Context

`CLAUDE.md` documents the Cypress → Playwright migration:

> **Use Playwright for E2E tests** — Migrating from Cypress
> **Cypress is deprecated** — Will be removed once migration is completed

`superset-frontend/cypress-base/cypress/e2e/dashboard/_skip.url_params.test.ts` is one of the smaller disabled (`_skip.`-prefixed) Cypress tests — 45 LOC, single scenario, single dashboard. Because it is already disabled, porting it carries zero regression risk while moving the migration forward by one file.

## Scope (single Devin session)

**In scope:**
- Create `superset-frontend/playwright/tests/dashboard/url_params.spec.ts` (or place it under whatever the established Playwright test path is — discover by reading existing Playwright tests in the repo)
- Port the scenario: visit the World Health dashboard with `?param1=123&param2=abc` and verify those values appear in the `chart/data` request payload as `url_params`
- Use Playwright equivalents for `cy.intercept` (`page.route`/`page.waitForRequest`) and Cypress utils
- Once ported, delete the original `_skip.url_params.test.ts` Cypress file

**Out of scope:**
- Porting other Cypress tests
- Adding new test coverage beyond the original scenario
- Restructuring Playwright test infrastructure / fixtures

## Acceptance criteria

- [ ] New Playwright spec exists under the project's established Playwright test directory
- [ ] Original Cypress file `_skip.url_params.test.ts` is deleted
- [ ] `npm run playwright:test -- url_params` passes locally **OR** if data setup proves non-trivial, the spec is committed with `test.skip` and the PR clearly documents the follow-up needed (honest scoping is acceptable; silently dropping coverage is not)
- [ ] No other Cypress or Playwright tests are affected
- [ ] `pre-commit run --all-files` passes
- [ ] PR description shows the scenario coverage map (old → new) and links Devin session URL

## Reproduction / self-verify commands

```bash
cd superset-frontend
# Find existing Playwright test layout to match conventions
find playwright -type d 2>/dev/null | head
ls playwright/tests/ 2>/dev/null
# After porting:
npm run playwright:test -- url_params
# Confirm Cypress file is gone
test ! -f cypress-base/cypress/e2e/dashboard/_skip.url_params.test.ts && echo "cypress file removed ✓"
cd .. && pre-commit run --all-files
```

## Notes for the agent

- The Cypress test uses `cy.intercept` on both `**/api/v1/chart/data?*` and `**/superset/explore_json/*`. Playwright equivalent is `page.route(url, route => { ... })` or `page.waitForRequest(predicate)` for assertions on request bodies.
- `WORLD_HEALTH_DASHBOARD` and `WORLD_HEALTH_CHARTS` constants live in `cypress/utils/urls` and `./utils` — find the Playwright equivalents (likely under `playwright/fixtures/` or similar) or port the constants alongside.
- If the World Health dashboard isn't seeded in the Playwright test environment, document that gap in the PR and skip the test rather than fabricating assertions.

## Suggested labels

`devin-eligible`, `category:test-migration`, `est:30m`
