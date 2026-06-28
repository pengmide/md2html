export const reportCss = `
:root {
  --page-bg: #f4f6f8;
  --paper-bg: #ffffff;
  --ink: #1f2937;
  --muted: #667085;
  --line: #d8e0ea;
  --accent: #b42318;
  --accent-soft: #fff4f2;
  --table-head: #b42318;
  --table-head-border: #7a271a;
  --positive: #087443;
  --negative: #b42318;
}
body {
  margin: 0;
  background: var(--page-bg);
  color: var(--ink);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  line-height: 1.72;
}
.page-shell {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 22px 56px;
}
.report-document {
  background: var(--paper-bg);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 14px 36px rgba(31, 41, 55, 0.09);
}
.cherry-markdown {
  word-break: break-word;
  color: var(--ink);
  background: transparent;
}
.cherry-markdown a.anchor {
  display: none;
}
.cherry-markdown h1,
.cherry-markdown h2,
.cherry-markdown h3 {
  color: var(--ink);
  line-height: 1.28;
  letter-spacing: 0;
}
.cherry-markdown h1 {
  margin-top: 0;
  padding-bottom: 16px;
  border-bottom: 3px solid var(--accent);
}
.cherry-markdown h2 {
  margin-top: 36px;
  padding-top: 12px;
  border-top: 1px solid var(--line);
  color: #24364b;
}
.cherry-markdown blockquote {
  border-left: 6px solid var(--accent);
  background: var(--accent-soft);
  color: #3b2a28;
  border-radius: 0 6px 6px 0;
}
.cherry-markdown ul,
.cherry-markdown ol {
  margin: 12px 0 18px;
  padding-left: 0;
}
.cherry-markdown li {
  margin: 7px 0;
  color: var(--ink);
}
.cherry-markdown li p {
  margin: 0;
}
.cherry-markdown ul > li {
  position: relative;
  list-style: none;
  padding-left: 20px;
}
.cherry-markdown ul > li::before {
  content: "";
  position: absolute;
  left: 2px;
  top: 0.78em;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
}
.cherry-markdown ol {
  counter-reset: report-list;
}
.cherry-markdown ol > li {
  counter-increment: report-list;
  list-style: none;
  position: relative;
  padding-left: 34px;
}
.cherry-markdown ol > li::before {
  content: counter(report-list);
  position: absolute;
  left: 0;
  top: 0.18em;
  min-width: 22px;
  height: 22px;
  padding: 0 5px;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  line-height: 22px;
  text-align: center;
  box-sizing: border-box;
}
.cherry-markdown li li::before {
  background: #d0a24a;
}
.cherry-markdown table {
  border-collapse: separate;
  border-spacing: 0;
  width: max-content;
  min-width: 100%;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}
.cherry-markdown th,
.cherry-markdown .cherry-table-container .cherry-table th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: var(--table-head);
  background-color: var(--table-head);
  color: #fff;
  white-space: nowrap;
  border-color: var(--table-head-border);
  font-weight: 700;
}
.cherry-markdown td,
.cherry-markdown th {
  padding: 8px 10px;
}
.cherry-markdown td,
.cherry-markdown .cherry-table-container .cherry-table td {
  background: #fff;
  border-color: #e6ecf2;
}
.cherry-markdown tbody tr:nth-child(even) td {
  background: #f8fafc;
}
.cherry-markdown tbody tr:hover td {
  background: #fff7ed;
}
.cherry-markdown .metric-cell {
  position: relative;
  min-width: 112px;
  overflow: hidden;
  text-align: right;
}
.cherry-markdown .metric-cell .metric-bar {
  position: absolute;
  top: 20%;
  bottom: 20%;
  left: 8px;
  width: var(--bar-width);
  max-width: calc(100% - 16px);
  border-radius: 999px;
  background: rgba(8, 116, 67, 0.16);
  pointer-events: none;
}
.cherry-markdown .metric-cell.metric-negative .metric-bar {
  background: rgba(180, 35, 24, 0.16);
}
.cherry-markdown .metric-cell .metric-value {
  position: relative;
  z-index: 1;
  font-weight: 650;
}
.cherry-markdown .metric-cell.metric-positive .metric-value {
  color: var(--positive);
}
.cherry-markdown .metric-cell.metric-negative .metric-value {
  color: var(--negative);
}
.cherry-markdown .cherry-table-container,
.cherry-markdown figure {
  overflow-x: auto;
  border: 1px solid var(--line);
  border-radius: 6px;
  margin: 16px 0 24px;
  background: #fff;
  box-shadow: 0 8px 22px rgba(31, 41, 55, 0.06);
}
.report-visuals {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin: 16px 0 28px;
}
.visual-panel {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 14px 14px 8px;
  background: #fbfcfe;
}
.visual-panel-wide {
  grid-column: 1 / -1;
}
.visual-panel h3 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 700;
  color: #24364b;
}
.chart-box {
  height: 360px;
  width: 100%;
}
.visual-panel-wide .chart-box {
  height: 420px;
}
.mermaid {
  overflow-x: auto;
  margin: 16px 0 24px;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: #fff;
}
@media (max-width: 760px) {
  .page-shell { padding: 12px; }
  .report-document { padding: 18px; }
  .report-visuals { grid-template-columns: 1fr; }
  .visual-panel-wide { grid-column: auto; }
  .chart-box, .visual-panel-wide .chart-box { height: 340px; }
}
`;
