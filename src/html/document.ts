import { assets } from "../assets/generated";
import { escapeHtml } from "./escape";
import { themeCss } from "../themes";
import { runtimeScript } from "../extensions/runtime";
import type { Renderer, Theme } from "../types";
import type { ReportChartData } from "../extensions/reportCharts";

interface DocumentOptions {
  bodyHtml: string;
  title: string;
  renderer: Renderer;
  theme: Theme;
  standalone: boolean;
  reportCharts: boolean;
  chartData: ReportChartData | null;
}

export function buildDocumentHtml(options: DocumentOptions): string {
  const standaloneHead = options.standalone ? `
    <style>${assets.katexCss}</style>
    <script>${assets.echartsJs}</script>
    <script>${assets.mermaidJs}</script>
    <script>${assets.katexJs}</script>
  ` : "";

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(options.title)}</title>
  <style>${assets.cherryCss}</style>
  <style>${themeCss(options.theme)}</style>
  ${standaloneHead}
</head>
<body>
  <main class="page-shell">
    <article class="report-document cherry-markdown">${options.bodyHtml}</article>
  </main>
  ${runtimeScript({
    renderer: options.renderer,
    reportCharts: options.reportCharts,
    chartData: options.chartData,
    standalone: options.standalone,
  })}
</body>
</html>
`;
}
