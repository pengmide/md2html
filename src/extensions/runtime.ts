import type { Renderer } from "../types";
import type { ReportChartData } from "./reportCharts";

interface RuntimeOptions {
  renderer: Renderer;
  reportCharts: boolean;
  chartData: ReportChartData | null;
  standalone: boolean;
}

export function runtimeScript(options: RuntimeOptions): string {
  const dataScript = options.reportCharts ? `window.__REPORT_CHART_DATA__ = ${JSON.stringify(options.chartData)};` : "";
  const reportScript = options.reportCharts ? reportChartsRuntime(options.renderer) : "";
  const genericRuntime = options.standalone ? genericRuntimeScript(options.renderer) : "";
  return `<script>${dataScript}
${reportScript}
${genericRuntime}
</script>`;
}

function genericRuntimeScript(renderer: Renderer): string {
  return `
function plainCodeText(codeEl) {
  return Array.from(codeEl.querySelectorAll('.code-line')).map((line) => line.textContent).join('\\n') || codeEl.textContent;
}
document.querySelectorAll('div[data-lang="mermaid"]').forEach((block) => {
  const code = block.querySelector('code');
  if (!code) return;
  const source = plainCodeText(code);
  const mermaidEl = document.createElement('div');
  mermaidEl.className = 'mermaid';
  mermaidEl.textContent = source;
  block.replaceWith(mermaidEl);
});
if (window.mermaid) {
  mermaid.initialize({ startOnLoad: false, securityLevel: 'strict' });
  mermaid.run({ querySelector: '.mermaid' });
}
document.querySelectorAll('.cherry-mathjax-need-render').forEach((el) => {
  if (!window.katex) return;
  const formula = decodeURIComponent(el.getAttribute('data-content') || el.getAttribute('data-formula-source') || '');
  const displayMode = el.classList.contains('Cherry-Math');
  katex.render(formula, el, { displayMode, throwOnError: false });
});
document.querySelectorAll('div[data-lang="echarts"]').forEach((block) => {
  if (!window.echarts) return;
  const code = block.querySelector('code');
  if (!code) return;
  const source = plainCodeText(code).trim();
  try {
    const option = JSON.parse(source);
    const chartEl = document.createElement('div');
    chartEl.className = 'chart-box';
    block.replaceWith(chartEl);
    const chart = echarts.init(chartEl, null, { renderer: ${JSON.stringify(renderer)} });
    chart.setOption(option);
  } catch (error) {
    block.insertAdjacentHTML('beforeend', '<div style="color:#b42318">ECharts JSON render error: ' + String(error.message).replace(/[<>]/g, '') + '</div>');
  }
});
`;
}

function reportChartsRuntime(renderer: Renderer): string {
  return `
const reportData = window.__REPORT_CHART_DATA__ || { overview: [], subsidy: [], discount: [], conversion: [] };
const palette = {
  red: '#b42318',
  blue: '#175cd3',
  teal: '#087443',
  amber: '#b54708',
  paleAmber: '#f7b27a'
};
const percentAxis = { type: 'value', axisLabel: { formatter: '{value}%' }, splitLine: { lineStyle: { color: '#e8edf3' } } };
function makeChart(id, option) {
  const el = document.getElementById(id);
  if (!el || !window.echarts) return null;
  const chart = echarts.init(el, null, { renderer: ${JSON.stringify(renderer)} });
  chart.setOption(option);
  return chart;
}
window.__REPORT_CHARTS__ = [
  makeChart('chart-profit-yoy', {
    tooltip: { trigger: 'axis' },
    legend: { top: 0 },
    grid: { top: 48, right: 44, bottom: 86, left: 74 },
    xAxis: { type: 'category', data: reportData.overview.map((item) => item.area), axisLabel: { rotate: 40, interval: 0 } },
    yAxis: [
      { type: 'value', name: '门店毛利额', splitLine: { lineStyle: { color: '#e8edf3' } } },
      { ...percentAxis, name: '同比' }
    ],
    series: [
      { name: '门店毛利额', type: 'bar', data: reportData.overview.map((item) => item.storeGrossProfit), itemStyle: { color: palette.blue } },
      { name: '门店毛利额同比', type: 'line', yAxisIndex: 1, data: reportData.overview.map((item) => item.yoy), symbolSize: 7, itemStyle: { color: palette.red }, lineStyle: { width: 2 } }
    ]
  }),
  makeChart('chart-subsidy-risk', {
    tooltip: { trigger: 'axis' },
    legend: { top: 0 },
    grid: { top: 48, right: 42, bottom: 58, left: 58 },
    xAxis: { type: 'category', data: reportData.subsidy.map((item) => item.area), axisLabel: { rotate: 28, interval: 0 } },
    yAxis: [
      { type: 'value', name: '补贴额', splitLine: { lineStyle: { color: '#e8edf3' } } },
      { ...percentAxis, name: '同比' }
    ],
    series: [
      { name: '补贴额', type: 'bar', data: reportData.subsidy.map((item) => item.subsidy), itemStyle: { color: palette.amber } },
      { name: '门店毛利同比', type: 'line', yAxisIndex: 1, data: reportData.subsidy.map((item) => item.grossProfitYoy), itemStyle: { color: palette.red } }
    ]
  }),
  makeChart('chart-discount', {
    tooltip: { trigger: 'axis' },
    legend: { top: 0 },
    grid: { top: 48, right: 24, bottom: 58, left: 50 },
    xAxis: { type: 'category', data: reportData.discount.map((item) => item.area), axisLabel: { rotate: 28, interval: 0 } },
    yAxis: percentAxis,
    series: [
      { name: '时段折扣率', type: 'bar', data: reportData.discount.map((item) => item.timeDiscount), itemStyle: { color: palette.blue } },
      { name: '促销折扣率', type: 'bar', data: reportData.discount.map((item) => item.promoDiscount), itemStyle: { color: palette.paleAmber } },
      { name: '门店毛利同比', type: 'line', data: reportData.discount.map((item) => item.grossProfitYoy), itemStyle: { color: palette.red } }
    ]
  }),
  makeChart('chart-conversion', {
    tooltip: { trigger: 'axis' },
    legend: { top: 0 },
    grid: { top: 48, right: 28, bottom: 72, left: 56 },
    xAxis: { type: 'category', data: reportData.conversion.map((item) => item.area), axisLabel: { rotate: 28, interval: 0 } },
    yAxis: percentAxis,
    series: [
      { name: '客单价同比', type: 'bar', data: reportData.conversion.map((item) => item.ticketYoy), itemStyle: { color: palette.red } },
      { name: '19点前客数同比', type: 'bar', data: reportData.conversion.map((item) => item.before19CustomerYoy), itemStyle: { color: palette.teal } },
      { name: '19点前销售额同比', type: 'line', data: reportData.conversion.map((item) => item.before19SalesYoy), itemStyle: { color: palette.blue } }
    ]
  })
];
window.addEventListener('resize', () => window.__REPORT_CHARTS__.forEach((chart) => chart && chart.resize()));
`;
}
