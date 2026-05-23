# refactor(filters): eliminate `any` types in Select filter type definitions

## Context

`superset-frontend/src/filters/components/Select/types.ts` declares two `RefObject<any>` props that defeat TypeScript's type checking at the boundary of the Select filter plugin. These are the only `any` uses in this small (90 LOC) type file.

Advances the **"Frontend Modernization → NO `any` types — Use proper TypeScript types"** refactor explicitly called out in `CLAUDE.md`.

## Scope (single Devin session)

**In scope:**
- `superset-frontend/src/filters/components/Select/types.ts` (the two `RefObject<any>` props on `PluginFilterSelectProps`)
- Direct call-sites that consume `parentRef` / `inputRef` from `PluginFilterSelectProps` — update their ref creation if needed to match the narrowed type

**Out of scope:**
- Eliminating `any` elsewhere in the codebase
- Restructuring the type hierarchy or renaming exported types
- Behavioral changes — this is a typing-only refactor

## Acceptance criteria

- [ ] `grep -n ": any" superset-frontend/src/filters/components/Select/types.ts` returns 0 hits
- [ ] `grep -n "RefObject<any>" superset-frontend/src/filters/components/Select/types.ts` returns 0 hits
- [ ] Refs are typed to the concrete DOM/component instance type they reference (e.g., `RefObject<HTMLDivElement>` — inspect the consumer to determine the right type)
- [ ] `npm run type` (or `tsc --noEmit` in `superset-frontend/`) passes with no new errors
- [ ] `npm test -- src/filters/components/Select` passes
- [ ] `pre-commit run --all-files` passes
- [ ] PR description shows before/after snippets of the two changed type signatures and links Devin session URL

## Reproduction / self-verify commands

```bash
cd superset-frontend
grep -n "RefObject<any>" src/filters/components/Select/types.ts
# After edit:
npx tsc --noEmit
npm test -- src/filters/components/Select
cd .. && pre-commit run --all-files
```

## Notes for the agent

The proper types for `parentRef` and `inputRef` should be inferred by reading where they're attached in the Select filter components (most likely a `div` for parentRef and an antd `Select`/`Input` ref type for inputRef). Use `@superset-ui/core`-exported component types where available; do not import directly from antd.

## Suggested labels

`devin-eligible`, `category:type-safety`, `est:20m`
