#!/usr/bin/env bun
import { parseArgs, helpText } from "./cli/args";
import { renderFile } from "./render/file";
import { VERSION } from "./version";

try {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(helpText());
  } else if (args.version) {
    console.log(VERSION);
  } else {
    await renderFile({
      input: args.input,
      output: args.output || undefined,
      title: args.title || undefined,
      renderer: args.renderer,
      theme: args.theme,
      reportCharts: args.reportCharts,
      tableBars: args.tableBars,
      standalone: args.standalone,
    });
  }
} catch (error) {
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
