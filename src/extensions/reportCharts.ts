export interface ReportChartData {
  overview: Record<string, number | string | null>[];
  subsidy: Record<string, number | string | null>[];
  discount: Record<string, number | string | null>[];
  conversion: Record<string, number | string | null>[];
}

export interface ReportChartParseResult {
  data: ReportChartData;
  complete: boolean;
}

function parsePercent(value: string): number | null {
  if (!value || value === "null" || value.includes("…")) return null;
  const parsed = Number(value.replace("%", "").replace("+", "").trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function parseNumber(value: string): number | null {
  if (!value || value === "null" || value.includes("…")) return null;
  const parsed = Number(value.replace("%", "").replace("+", "").trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function extractSection(markdown: string, startHeading: string, nextHeading: string): string {
  const start = markdown.indexOf(startHeading);
  if (start === -1) return "";
  const end = markdown.indexOf(nextHeading, start + startHeading.length);
  return markdown.slice(start, end === -1 ? markdown.length : end);
}

export function parseMarkdownTable(section: string): string[][] {
  return section
    .split("\n")
    .filter((line) => line.trim().startsWith("|") && !line.includes("---"))
    .slice(1)
    .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()))
    .filter((cells) => cells.length > 1 && !cells.some((cell) => cell.includes("…")));
}

export function buildReportChartData(markdown: string): ReportChartParseResult {
  const overviewRows = parseMarkdownTable(extractSection(markdown, "## 2. 区域盈利概览与同比变化", "## 3."));
  const overview = overviewRows.map((cells) => ({
    area: cells[1],
    storeGrossProfit: parseNumber(cells[2]),
    yoy: parsePercent(cells[3]),
    mom: parsePercent(cells[4]),
    subsidizedGrossProfit: parseNumber(cells[5]),
    expectedMargin: parsePercent(cells[8]),
    pricingMargin: parsePercent(cells[9]),
  }));

  const subsidyRows = parseMarkdownTable(extractSection(markdown, "## 4. 毛利与补贴", "## 5."));
  const subsidy = subsidyRows.map((cells) => ({
    area: cells[0],
    subsidy: parseNumber(cells[1]),
    subsidyYoy: parsePercent(cells[2]),
    storeGrossProfit: parseNumber(cells[7]),
    grossProfitYoy: parsePercent(cells[8]),
  }));

  const discountRows = parseMarkdownTable(extractSection(markdown, "## 5. 定价与折扣", "## 6."));
  const discount = discountRows.map((cells) => ({
    area: cells[0],
    pricingMargin: parsePercent(cells[1]),
    expectedMargin: parsePercent(cells[2]),
    timeDiscount: parsePercent(cells[3]),
    promoDiscount: parsePercent(cells[4]),
    grossProfitYoy: parsePercent(cells[5]),
  }));

  const conversionRows = parseMarkdownTable(extractSection(markdown, "## 7. 客单与时段质量", "## 8."));
  const conversion = conversionRows.map((cells) => ({
    area: cells[0],
    ticketYoy: parsePercent(cells[2]),
    before19CustomerYoy: parsePercent(cells[6]),
    before19SalesYoy: parsePercent(cells[8]),
  }));

  const complete = [overview, subsidy, discount, conversion].every((rows) => rows.length > 0);
  return { data: { overview, subsidy, discount, conversion }, complete };
}

function reportChartBlock(): string {
  return `
## 数据图概览

<div class="report-visuals" data-report-visuals>
  <section class="visual-panel visual-panel-wide">
    <h3>区域门店毛利额与同比</h3>
    <div id="chart-profit-yoy" class="chart-box"></div>
  </section>
  <section class="visual-panel">
    <h3>补贴额与门店毛利同比</h3>
    <div id="chart-subsidy-risk" class="chart-box"></div>
  </section>
  <section class="visual-panel">
    <h3>折扣水平对比</h3>
    <div id="chart-discount" class="chart-box"></div>
  </section>
  <section class="visual-panel visual-panel-wide">
    <h3>客数、客单与 19 点前销售同比</h3>
    <div id="chart-conversion" class="chart-box"></div>
  </section>
</div>
`;
}

export function injectReportCharts(markdown: string): string {
  const anchor = "---\n\n## 1.";
  if (markdown.includes(anchor)) {
    return markdown.replace(anchor, `---\n${reportChartBlock()}\n## 1.`);
  }
  return `${reportChartBlock()}\n\n${markdown}`;
}
