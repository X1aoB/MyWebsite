import { describe, expect, it } from "vitest";
import { installAnalytics } from "../../public/statistics/bootstrap.mjs";

/** Just enough DOM for the consent notice: elements, events, a footer and storage. */
class FakeElement {
  tagName: string;
  children: FakeElement[] = [];
  attributes = new Map<string, string>();
  listeners = new Map<string, ((event: unknown) => void)[]>();
  textContent = "";
  hidden = false;
  disabled = false;
  id = "";
  className = "";
  type = "";
  href = "";
  focused = false;
  constructor(tagName: string) { this.tagName = tagName.toUpperCase(); }
  append(...nodes: FakeElement[]) { this.children.push(...nodes); }
  setAttribute(name: string, value: string) { this.attributes.set(name, value); }
  getAttribute(name: string) { return this.attributes.get(name) ?? null; }
  addEventListener(type: string, listener: (event: unknown) => void) {
    this.listeners.set(type, [...(this.listeners.get(type) ?? []), listener]);
  }
  click() { this.listeners.get("click")?.forEach((listener) => listener({})); }
  focus() { this.focused = true; }
  find(tagName: string): FakeElement[] {
    return this.children.flatMap((child) => [...(child.tagName === tagName.toUpperCase() ? [child] : []), ...child.find(tagName)]);
  }
}

const environment = (stored: Record<string, string> = {}) => {
  const storage = new Map(Object.entries(stored));
  const body = new FakeElement("body");
  const footer = new FakeElement("footer");
  const document = {
    body,
    documentElement: { lang: "zh-CN" },
    getElementById: () => null,
    createElement: (tag: string) => new FakeElement(tag),
    querySelector: (selector: string) => (selector === "footer" ? footer : null)
  };
  const env = {
    document,
    navigator: {},
    location: { hash: "", pathname: "/", search: "", href: "https://example.test/" },
    history: { state: null, replaceState() {} },
    Date: { now: () => 1_000_000 },
    localStorage: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => { storage.set(key, value); },
      removeItem: (key: string) => { storage.delete(key); }
    },
    addEventListener() {}
  };
  return { env, body, footer, storage };
};

// The adapter types its environment as the browser global; the fake only has what it reads.
const install = (settings: object, env: object) => installAnalytics(settings, env as unknown as typeof globalThis);

const config = { enabled: true, app: "mywebsite", endpoint: "https://stats.example/events", paths: ["/"] };
const consentKey = "snow.statistics.v1.mywebsite.consent";

describe("consent notice", () => {
  it("shows a short first layer and keeps quality and retention in a collapsed details block", () => {
    const { env, body } = environment();
    install(config, env);
    const panel = body.children.find((node) => node.id === "snow-statistics-notice")!;
    expect(panel.hidden).toBe(false);
    const copy = panel.children.find((node) => node.className === "snow-statistics-copy")!;
    const [description] = copy.children;
    expect(description.tagName).toBe("P");
    expect(description.textContent).toContain("允许后");
    const details = copy.find("details");
    expect(details).toHaveLength(1);
    expect(details[0].attributes.has("open")).toBe(false);
    expect(details[0].children.map((node) => node.tagName)).toEqual(["SUMMARY", "P", "P"]);
    expect(details[0].children[0].textContent).toBe("展开说明");
    expect(details[0].children[1].textContent).toContain("服务质量统计");
    expect(details[0].children[2].textContent).toContain("30天");
    expect(copy.find("a")[0].href).toBe("/privacy/");
    expect(panel.find("button").map((button) => button.textContent)).toEqual(["允许访问统计", "暂不允许", "稍后再说"]);
  });

  it("defers without storing a choice, and labels the same button 完成 once a choice exists", () => {
    const { env, body, footer, storage } = environment();
    install(config, env);
    const panel = body.children.find((node) => node.id === "snow-statistics-notice")!;
    const settings = footer.children.find((node) => node.id === "snow-statistics-settings")!;
    const [, decline, later] = panel.find("button");
    later.click();
    expect(panel.hidden).toBe(true);
    expect(storage.has(consentKey)).toBe(false);
    expect(settings.focused).toBe(true);
    settings.click();
    expect(later.textContent).toBe("稍后再说");
    decline.click();
    settings.click();
    expect(panel.hidden).toBe(false);
    expect(later.textContent).toBe("完成");
  });

  it("keeps the storage key, the 30-day expiry and the footer withdrawal entry unchanged", () => {
    const { env, body, footer, storage } = environment();
    install(config, env);
    const panel = body.children.find((node) => node.id === "snow-statistics-notice")!;
    const [, decline] = panel.find("button");
    decline.click();
    expect(storage.get(consentKey)).toBe(String(-(1_000_000 + 30 * 86_400_000)));
    expect(panel.hidden).toBe(true);
    const settings = footer.children.find((node) => node.id === "snow-statistics-settings")!;
    expect(settings.textContent).toBe("访问统计设置 · 访问统计已关闭");
    settings.click();
    expect(panel.hidden).toBe(false);
  });

  it("stays hidden for a stored choice and does nothing while the build switch is off", () => {
    const remembered = environment({ [consentKey]: String(-(1_000_000 + 1000)) });
    install(config, remembered.env);
    expect(remembered.body.children.find((node) => node.id === "snow-statistics-notice")!.hidden).toBe(true);

    const off = environment();
    install({ ...config, enabled: false }, off.env);
    expect(off.body.children).toHaveLength(0);
    expect(off.footer.children).toHaveLength(0);
  });
});
