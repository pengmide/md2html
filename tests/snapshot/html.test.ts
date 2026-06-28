import { describe, expect, test } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import { renderMarkdown } from "../../src/render/markdown";

const fixtureDir = path.resolve(import.meta.dir, "../../fixtures");

function normalize(html: string): string {
  return html
    .replace(/<style>[\s\S]*?cherry-markdown[\s\S]*?<\/style>/, "<style>__CHERRY_AND_THEME_CSS__</style>")
    .replace(/<style>[\s\S]*?@font-face[\s\S]*?<\/style>/, "<style>__KATEX_CSS__</style>")
    .replace(/<script>[\s\S]*?<\/script>/g, "<script>__SCRIPT__</script>");
}

describe("HTML snapshots", () => {
  test("basic fixture", async () => {
    const markdown = fs.readFileSync(path.join(fixtureDir, "basic.md"), "utf8");
    const html = await renderMarkdown(markdown, {
      inputPath: "basic.md",
      renderer: "svg",
      theme: "report",
      reportCharts: false,
      tableBars: true,
      standalone: true,
    });
    expect(normalize(html)).toMatchSnapshot();
  });

  test("full fixture", async () => {
    const markdown = fs.readFileSync(path.join(fixtureDir, "full.md"), "utf8");
    const html = await renderMarkdown(markdown, {
      inputPath: "full.md",
      renderer: "canvas",
      theme: "plain",
      reportCharts: false,
      tableBars: false,
      standalone: true,
    });
    expect(normalize(html)).toMatchSnapshot();
  });

  test("profit report fixture with charts", async () => {
    const markdown = fs.readFileSync(path.join(fixtureDir, "profit-report.md"), "utf8");
    const html = await renderMarkdown(markdown, {
      inputPath: "profit-report.md",
      renderer: "svg",
      theme: "report",
      reportCharts: true,
      tableBars: true,
      standalone: false,
    });
    expect(normalize(html)).toMatchSnapshot();
  });
});
