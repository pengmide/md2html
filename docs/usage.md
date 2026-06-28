# Usage

```sh
md2html <input.md> [options]
md2html render <input.md> [options]
```

The `render` subcommand is accepted for compatibility with the prototype CLI. Without `-o`, output is written to `./<input-basename>.html` in the current execution directory.

Defaults:

- `--renderer svg`
- `--theme report`
- standalone output enabled
- table data bars enabled

Examples:

```sh
bun run dev -- fixtures/full.md
bun run dev -- fixtures/profit-report.md --report-charts --renderer canvas
bun run dev -- fixtures/basic.md --theme plain --no-standalone
```
