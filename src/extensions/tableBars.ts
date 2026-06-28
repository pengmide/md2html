import { JSDOM } from "jsdom";
import { escapeHtml } from "../html/escape";

export function parseCellMetric(text: string): number | null {
  const normalized = text.replace(/,/g, "").trim();
  if (!normalized || normalized === "null" || normalized.includes("…")) return null;
  const match = normalized.match(/^[+-]?\d+(?:\.\d+)?%?$/);
  if (!match) return null;
  const value = Number(normalized.replace("%", ""));
  return Number.isFinite(value) ? value : null;
}

export function enhanceTables(htmlText: string, enabled: boolean): string {
  if (!enabled) return htmlText;
  const tableDom = new JSDOM(`<main>${htmlText}</main>`);
  const tables = [...tableDom.window.document.querySelectorAll("table")];
  for (const table of tables) {
    table.classList.add("metric-table");
    const rows = [...table.querySelectorAll("tr")];
    const headers = [...(rows[0]?.querySelectorAll("th") || [])].map((cell) => cell.textContent?.trim() || "");
    const bodyRows = rows.filter((row) => row.querySelectorAll("td").length);
    const columnMax: number[] = [];

    for (const row of bodyRows) {
      [...row.children].forEach((cell, index) => {
        if (headers[index] === "#") return;
        const value = parseCellMetric(cell.textContent || "");
        if (value === null) return;
        columnMax[index] = Math.max(columnMax[index] || 0, Math.abs(value));
      });
    }

    for (const row of bodyRows) {
      [...row.children].forEach((cell, index) => {
        if (headers[index] === "#") return;
        const originalText = cell.textContent?.trim() || "";
        const value = parseCellMetric(originalText);
        if (value === null || !columnMax[index]) return;
        const width = Math.max(4, Math.min(100, (Math.abs(value) / columnMax[index]) * 100));
        cell.classList.add("metric-cell", value < 0 ? "metric-negative" : "metric-positive");
        (cell as HTMLElement).style.setProperty("--bar-width", `${width.toFixed(2)}%`);
        cell.innerHTML = `<span class="metric-bar" aria-hidden="true"></span><span class="metric-value">${escapeHtml(originalText)}</span>`;
      });
    }
  }
  return tableDom.window.document.querySelector("main")?.innerHTML || htmlText;
}
