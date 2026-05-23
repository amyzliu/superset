# refactor(components): route Splitter through @superset-ui/core instead of direct antd import

## Context

`superset-frontend/src/components/Splitter/index.tsx` re-exports `Splitter` and `SplitterProps` directly from `antd` / `antd/es/splitter`. `CLAUDE.md` explicitly directs:

> **Use @superset-ui/core** — Don't import Ant Design directly, prefer Ant Design component wrappers from @superset-ui/core/components

The Splitter wrapper is 21 lines with only 2 importers, making it a textbook contained refactor.

## Scope (single Devin session)

**In scope:**
- `superset-frontend/src/components/Splitter/index.tsx` — route through `@superset-ui/core/components` (or add a thin wrapper there if one doesn't already exist)
- The 2 importing files (find via `grep -rln "from 'src/components/Splitter'" superset-frontend/src` or equivalent path) — update their imports if necessary
- If `@superset-ui/core/components` does not yet export Splitter, add the export there following the established pattern of existing wrapper components in that package (`packages/superset-ui-core/src/components/`)

**Out of scope:**
- Refactoring other direct antd imports (separate issues)
- Changing Splitter behavior or styling
- Renaming `Splitter` or `SplitterProps`

## Acceptance criteria

- [ ] `grep -n "from 'antd'" superset-frontend/src/components/Splitter/index.tsx` returns 0 hits
- [ ] `grep -n "from 'antd/" superset-frontend/src/components/Splitter/index.tsx` returns 0 hits
- [ ] Splitter is exported from `@superset-ui/core/components` (verified by `grep -r "Splitter" superset-frontend/packages/superset-ui-core/src/components/index*`)
- [ ] All previous consumers of `src/components/Splitter` still compile and work
- [ ] `npm run type` passes with no new errors
- [ ] `npm test -- Splitter` passes (Storybook story still renders if one exists)
- [ ] `pre-commit run --all-files` passes
- [ ] PR description links the CLAUDE.md guidance and Devin session URL

## Reproduction / self-verify commands

```bash
cd superset-frontend
# Find consumers
grep -rln "components/Splitter" src/
# After edit, verify no direct antd imports remain in the wrapper
grep -n "antd" src/components/Splitter/index.tsx
# Build + test
npx tsc --noEmit
npm test -- Splitter
cd .. && pre-commit run --all-files
```

## Notes for the agent

Look at an existing wrapper like `superset-frontend/packages/superset-ui-core/src/components/<existing wrapped antd component>` to match the wrapping pattern (re-export + type re-export + any common defaultProps).

## Suggested labels

`devin-eligible`, `category:ui-hygiene`, `est:15m`
