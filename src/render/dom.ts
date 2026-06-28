import { JSDOM } from "jsdom";

export function setupDom(): void {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "https://local.report/",
  });

  globalThis.window = dom.window as unknown as Window & typeof globalThis;
  globalThis.document = dom.window.document;
  Object.defineProperty(globalThis, "navigator", {
    value: dom.window.navigator,
    configurable: true,
  });
  globalThis.HTMLElement = dom.window.HTMLElement;
  globalThis.Node = dom.window.Node;
  globalThis.DOMParser = dom.window.DOMParser;
  Object.defineProperty(globalThis, "localStorage", {
    value: {
      getItem() {
        return null;
      },
      setItem() {},
      removeItem() {},
    },
    configurable: true,
  });
}
