# Architecture

`src/cli.ts` is the executable entrypoint. It delegates argument parsing and validation to `src/cli/args.ts`, then calls the file-oriented renderer.

Rendering is split into small modules:

- `src/render/markdown.ts` owns JSDOM setup and Cherry Engine rendering.
- `src/html/document.ts` assembles the final HTML document.
- `src/themes/` provides report/plain CSS and shared table styling.
- `src/extensions/` contains table metric bars, generic Mermaid/KaTeX/ECharts runtime, and the profit-report chart extension.
- `src/assets/generated.ts` is generated from pinned npm packages.

Cherry Markdown is consumed as an npm dependency; this project does not fork or patch Cherry itself.

## Security Boundary

v0.1 is for trusted local Markdown. It does not sanitize HTML, strip scripts, or sandbox embedded content. Standalone output intentionally includes runtime JavaScript for Mermaid, KaTeX, ECharts, and report charts.
