import path from "node:path";
import { VERSION } from "../version";
import type { CliArgs, Renderer, Theme } from "../types";

export function helpText(): string {
  return `md2html ${VERSION}

Usage:
  md2html <input.md> [options]

Options:
  -o, --output <file>      Output HTML file (default: ./<input-basename>.html)
  --title <title>          HTML title; defaults to the first markdown heading
  --renderer <svg|canvas>  ECharts renderer for report and echarts code blocks (default: svg)
  --theme <report|plain>   HTML theme (default: report)
  --report-charts          Inject the supported profit-report dashboard
  --no-table-bars          Disable metric bars inside numeric table cells
  --no-standalone          Do not inline ECharts/Mermaid/KaTeX scripts
  -h, --help               Show help
  -v, --version            Show version

Examples:
  md2html report.md --report-charts
  md2html note.md --renderer canvas --no-table-bars

Compatibility:
  md2html render <input.md> [options] still works.
`;
}

export function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    command: "render",
    input: "",
    output: "",
    title: "",
    renderer: "svg",
    theme: "report",
    reportCharts: false,
    tableBars: true,
    standalone: true,
  };

  const items = [...argv];
  if (items[0] === "render") items.shift();
  if (items.includes("-h") || items.includes("--help")) {
    args.help = true;
    return args;
  }
  if (items.includes("-v") || items.includes("--version")) {
    args.version = true;
    return args;
  }

  while (items.length) {
    const item = items.shift();
    switch (item) {
      case "-o":
      case "--output":
        args.output = readValue(items, item);
        break;
      case "--title":
        args.title = readValue(items, item);
        break;
      case "--renderer":
        args.renderer = readValue(items, item) as Renderer;
        break;
      case "--theme":
        args.theme = readValue(items, item) as Theme;
        break;
      case "--report-charts":
        args.reportCharts = true;
        break;
      case "--no-table-bars":
        args.tableBars = false;
        break;
      case "--no-standalone":
        args.standalone = false;
        break;
      default:
        if (!item) break;
        if (item.startsWith("-")) throw new Error(`Unknown option: ${item}`);
        if (!args.input) args.input = item;
        else throw new Error(`Unexpected argument: ${item}`);
    }
  }

  if (!["svg", "canvas"].includes(args.renderer)) {
    throw new Error("--renderer must be svg or canvas");
  }
  if (!["report", "plain"].includes(args.theme)) {
    throw new Error("--theme must be report or plain");
  }
  if (!args.input) throw new Error("Missing input markdown file");
  return args;
}

function readValue(items: string[], option: string): string {
  const value = items.shift();
  if (!value || value.startsWith("-")) throw new Error(`${option} requires a value`);
  return value;
}

export function defaultOutputPath(inputPath: string): string {
  const parsed = path.parse(inputPath);
  const base = parsed.ext ? parsed.name : parsed.base;
  return path.join(process.cwd(), `${base}.html`);
}
