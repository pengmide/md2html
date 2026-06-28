import { describe, expect, test } from "bun:test";
import path from "node:path";
import { defaultOutputPath, parseArgs } from "../../src/cli/args";

describe("parseArgs", () => {
  test("parses defaults", () => {
    expect(parseArgs(["input.md"])).toMatchObject({
      input: "input.md",
      renderer: "svg",
      theme: "report",
      reportCharts: false,
      tableBars: true,
      standalone: true,
    });
  });

  test("accepts render compatibility subcommand", () => {
    expect(parseArgs(["render", "input.md", "--renderer", "canvas"]).input).toBe("input.md");
  });

  test("parses output, title, theme, and flags", () => {
    expect(parseArgs(["input.md", "-o", "out.html", "--title", "T", "--theme", "plain", "--report-charts", "--no-table-bars", "--no-standalone"])).toMatchObject({
      output: "out.html",
      title: "T",
      theme: "plain",
      reportCharts: true,
      tableBars: false,
      standalone: false,
    });
  });

  test("validates renderer and theme", () => {
    expect(() => parseArgs(["input.md", "--renderer", "webgl"])).toThrow("--renderer must be svg or canvas");
    expect(() => parseArgs(["input.md", "--theme", "dark"])).toThrow("--theme must be report or plain");
  });

  test("computes default output in cwd", () => {
    expect(defaultOutputPath("/tmp/report.md")).toBe(path.join(process.cwd(), "report.html"));
  });
});
