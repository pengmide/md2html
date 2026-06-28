import path from "node:path";
import { setupDom } from "./dom";
import { buildDocumentHtml } from "../html/document";
import { enhanceTables } from "../extensions/tableBars";
import { buildReportChartData, injectReportCharts } from "../extensions/reportCharts";
import type { RenderMarkdownOptions } from "../types";

type CherryEngineCtor = new () => { makeHtml(markdown: string): string };

export async function renderMarkdown(markdown: string, options: RenderMarkdownOptions): Promise<string> {
  setupDom();
  const originalMarkdown = markdown;
  const effectiveMarkdown = options.reportCharts ? injectReportCharts(originalMarkdown) : originalMarkdown;
  const title = options.title || inferTitle(originalMarkdown, options.inputPath);
  const chartData = options.reportCharts ? buildReportChartData(originalMarkdown) : null;
  if (options.reportCharts && !chartData.complete) {
    console.warn("Warning: --report-charts could not find all expected report tables; charts may be incomplete.");
  }

  const { default: CherryEngine } = await import("cherry-markdown/dist/cherry-markdown.engine.core.esm.js") as {
    default: CherryEngineCtor;
  };
  const cherryEngine = new CherryEngine();
  const bodyHtml = enhanceTables(cherryEngine.makeHtml(effectiveMarkdown), options.tableBars);

  return buildDocumentHtml({
    bodyHtml,
    title,
    renderer: options.renderer,
    theme: options.theme,
    standalone: options.standalone,
    reportCharts: options.reportCharts,
    chartData: chartData?.data ?? null,
  });
}

export function inferTitle(markdown: string, filePath = ""): string {
  const heading = markdown.match(/^#\s+(.+)$/m);
  if (heading) return heading[1].trim();
  return filePath ? path.basename(filePath).replace(/\.md$/i, "") : "Document";
}
