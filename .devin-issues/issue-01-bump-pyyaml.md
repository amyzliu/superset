# chore(deps): bump pyyaml to latest stable

## Context

`requirements/base.txt` and `requirements/development.txt` both pin `pyyaml==6.0.2`. PyYAML is a foundational dep across the Python ecosystem and historically a source of CVEs; routinely keeping it on the latest stable release is low-cost hygiene.

Advances the **"Backend Type Safety / dependency hygiene"** posture documented in `CLAUDE.md`.

## Scope (single Devin session)

**In scope:**
- `requirements/base.txt`
- `requirements/development.txt`
- Any pip-compile lockfile regeneration these two changes trigger (the files are pip-compile outputs — regenerate from the corresponding `.in` files if applicable)

**Out of scope:**
- Bumping any other dependency
- Touching `setup.py` / `pyproject.toml` constraints unless required for the bump to apply
- Code changes to `superset/` (none should be needed for a patch/minor bump)

## Acceptance criteria

- [ ] `pyyaml` is pinned to the latest stable on PyPI (verify with `pip index versions pyyaml` inside the Devin VM and pick the newest non-pre-release)
- [ ] Both `base.txt` and `development.txt` reflect the new pin
- [ ] If `requirements/*.in` files exist for these, regenerate via the project's documented pip-compile flow
- [ ] `pre-commit run --all-files` passes
- [ ] `pytest tests/unit_tests/` passes (full integration suite is overkill for this bump)
- [ ] PR description quotes the previous and new versions and links Devin session URL

## Reproduction / self-verify commands

```bash
# Confirm latest version
pip index versions pyyaml | head -3

# After edit, verify pins match
grep "^pyyaml==" requirements/base.txt requirements/development.txt

# Quality gates
pre-commit run --all-files
pytest tests/unit_tests/ -x -q
```

## Suggested labels

`devin-eligible`, `category:deps`, `est:15m`
