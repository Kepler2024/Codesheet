# Instructions for AI agents

For work on the website, read the [frontend specification](docs/frontend.md) before designing or editing pages, content loading, routing, or deployment. Use its acceptance checks when reviewing the frontend.

This repository is a set of programming-language cheat sheets (`sheets/<id>.md`). If you were asked to write or improve a sheet:

1. Read `CONTRIBUTING.md` completely and follow it exactly. Start a new sheet from `TEMPLATE.md`.
2. Read `sheets/python.md`. It is the model for coverage, density and tone, **not** code to translate. Write what an experienced programmer in the target language would write.
3. Change only `sheets/<id>.md`. Do not modify `tools/`, `CONTRIBUTING.md`, `TEMPLATE.md`, `AGENTS.md`, other sheets or CI to make a check pass.
4. Run `python3 tools/check.py sheets/<id>.md` and fix the sheet until it passes. It needs Docker running. Don't claim the sheet is done before the checker passes, and report its final output.
5. Every printed value needs a `=>` comment that the checker verifies. Use `norun` / `nocheck` only in the rare cases CONTRIBUTING.md allows, and give the reason.
6. Verify every pitfall you write down by running it. Don't state behavior you haven't checked.
7. If the skeleton or a rule doesn't fit the language, don't bend the rules yourself: finish what you can and report the problem, with the section and a concrete example.
