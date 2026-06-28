# md2html

`md2html` renders local Markdown files with Cherry Markdown and writes a browser-ready HTML document. The v0.1 target is report-oriented standalone output with Mermaid, KaTeX, ECharts, and optional business report charts.

## Usage

```sh
bun run dev -- report.md --report-charts
bun run dev -- note.md -o note.html --theme plain
```

After building:

```sh
../bin/md2html report.md --renderer svg
../bin/md2html render report.md --renderer canvas
```

Options:

```text
md2html <input.md> [options]

Options:
  -o, --output <file>      Output HTML file (default: ./<input-basename>.html)
  --title <title>          HTML title; defaults to the first markdown heading
  --renderer <svg|canvas>  ECharts renderer for report and echarts code blocks (default: svg)
  --theme <report|plain>   HTML theme (default: report)
  --report-charts          Inject the supported profit-report dashboard
  --no-table-bars          Disable metric bars inside numeric table cells
  --no-standalone          Omit runtime JS assets; keep Cherry and theme CSS
  -h, --help               Show help
  -v, --version            Show version
```

## Development

```sh
bun install
bun run assets
bun test
bun run test:e2e
bun run build
```

`bun run assets` reads pinned npm dependencies from `node_modules` and regenerates `src/assets/generated.ts`. The build command writes the current platform binary to `../bin/md2html`; multi-platform release scripts write into `dist/`.

## Scope

v0.1 treats Markdown as trusted local input. Standalone output inlines ECharts, Mermaid, KaTeX, KaTeX fonts, Cherry CSS, and the selected theme CSS. `--no-standalone` keeps Cherry/theme CSS but omits runtime JavaScript assets so a later resource pipeline can provide them.

`--report-charts` supports the current profit-analysis report structure. If matching tables are absent or incomplete, the command still writes HTML and warns that chart data is incomplete.
