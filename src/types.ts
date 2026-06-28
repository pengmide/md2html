export type Renderer = "svg" | "canvas";
export type Theme = "report" | "plain";

export interface CliArgs {
  command: "render";
  input: string;
  output: string;
  title: string;
  renderer: Renderer;
  theme: Theme;
  reportCharts: boolean;
  tableBars: boolean;
  standalone: boolean;
  help?: boolean;
  version?: boolean;
}

export interface RenderFileOptions {
  input: string;
  output?: string;
  title?: string;
  renderer: Renderer;
  theme: Theme;
  reportCharts: boolean;
  tableBars: boolean;
  standalone: boolean;
}

export interface RenderMarkdownOptions {
  title?: string;
  inputPath?: string;
  renderer: Renderer;
  theme: Theme;
  reportCharts: boolean;
  tableBars: boolean;
  standalone: boolean;
}
