import type { Theme } from "../types";
import { plainCss } from "./plain";
import { reportCss } from "./report";

export function themeCss(theme: Theme): string {
  return theme === "plain" ? plainCss : reportCss;
}
