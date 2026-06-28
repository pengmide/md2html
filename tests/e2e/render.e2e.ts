import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright";
import { renderFile } from "../../src/render/file";

async function main() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "md2html-e2e-"));
  const fullOutput = path.join(tmpDir, "full.html");
  const reportOutput = path.join(tmpDir, "report.html");

  await renderFile({
    input: path.resolve(import.meta.dir, "../../fixtures/full.md"),
    output: fullOutput,
    renderer: "svg",
    theme: "report",
    reportCharts: false,
    tableBars: true,
    standalone: true,
  });
  await renderFile({
    input: path.resolve(import.meta.dir, "../../fixtures/profit-report.md"),
    output: reportOutput,
    renderer: "canvas",
    theme: "report",
    reportCharts: true,
    tableBars: true,
    standalone: true,
  });

  const browser = await launchBrowser();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto(`file://${fullOutput}`);
  await page.waitForSelector(".metric-bar");
  await page.waitForFunction(() => document.querySelectorAll(".chart-box canvas, .chart-box svg").length >= 1, null, { timeout: 10000 });
  await page.waitForFunction(() => document.querySelectorAll(".mermaid svg").length >= 1, null, { timeout: 10000 });
  await page.waitForSelector(".katex", { timeout: 10000 });

  await page.goto(`file://${reportOutput}`);
  await page.waitForFunction(() => Array.isArray((window as any).__REPORT_CHARTS__) && (window as any).__REPORT_CHARTS__.filter(Boolean).length === 4, null, { timeout: 10000 });
  await page.waitForSelector("#chart-profit-yoy canvas, #chart-profit-yoy svg", { timeout: 10000 });
  await page.waitForSelector(".cherry-markdown th");
  await page.waitForSelector(".metric-bar");

  await browser.close();
  if (errors.length) throw new Error(`Browser errors:\n${errors.join("\n")}`);
  console.log("E2E passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function launchBrowser() {
  const macChrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  try {
    return await chromium.launch();
  } catch (error) {
    if (process.platform === "darwin" && fs.existsSync(macChrome)) {
      return await chromium.launch({ executablePath: macChrome });
    }
    throw error;
  }
}
