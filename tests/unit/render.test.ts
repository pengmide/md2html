import { describe, expect, test } from "bun:test";
import { inferTitle } from "../../src/render/markdown";
import { enhanceTables, parseCellMetric } from "../../src/extensions/tableBars";
import { buildReportChartData, parseMarkdownTable } from "../../src/extensions/reportCharts";

describe("render helpers", () => {
  test("infers title from heading or file name", () => {
    expect(inferTitle("# My Title\n\nBody", "x.md")).toBe("My Title");
    expect(inferTitle("Body", "/tmp/fallback.md")).toBe("fallback");
  });

  test("parses table metric values", () => {
    expect(parseCellMetric("+12.4%")).toBe(12.4);
    expect(parseCellMetric("-1,200")).toBe(-1200);
    expect(parseCellMetric("null")).toBeNull();
  });

  test("adds metric bars to numeric table cells", () => {
    const html = enhanceTables("<table><thead><tr><th>Name</th><th>YoY</th></tr></thead><tbody><tr><td>A</td><td>10%</td></tr><tr><td>B</td><td>-5%</td></tr></tbody></table>", true);
    expect(html).toContain("metric-table");
    expect(html).toContain("metric-positive");
    expect(html).toContain("metric-negative");
    expect(html).toContain("--bar-width");
  });

  test("parses markdown table rows", () => {
    const rows = parseMarkdownTable("| A | B |\n|---|---|\n| x | 1 |\n");
    expect(rows).toEqual([["x", "1"]]);
  });

  test("reports incomplete chart data when sections are absent", () => {
    const result = buildReportChartData("# Report\n\nNo tables");
    expect(result.complete).toBe(false);
    expect(result.data.overview).toHaveLength(0);
  });
});
