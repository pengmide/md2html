import fs from "node:fs";
import path from "node:path";
import { defaultOutputPath } from "../cli/args";
import { renderMarkdown } from "./markdown";
import type { RenderFileOptions } from "../types";

export async function renderFile(options: RenderFileOptions): Promise<string> {
  const inputPath = path.resolve(options.input);
  if (!fs.existsSync(inputPath)) throw new Error(`Input file does not exist: ${inputPath}`);
  if (!fs.statSync(inputPath).isFile()) throw new Error(`Input path is not a file: ${inputPath}`);

  const outputPath = options.output ? path.resolve(options.output) : defaultOutputPath(inputPath);
  const markdown = fs.readFileSync(inputPath, "utf8");
  const html = await renderMarkdown(markdown, {
    title: options.title,
    inputPath,
    renderer: options.renderer,
    theme: options.theme,
    reportCharts: options.reportCharts,
    tableBars: options.tableBars,
    standalone: options.standalone,
  });

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html);
  console.log(`Wrote ${outputPath}`);
  return outputPath;
}
