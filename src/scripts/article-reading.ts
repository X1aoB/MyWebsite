export const initializeArticleReading = () => {
  const article = document.querySelector<HTMLElement>("[data-article-reading]");
  if (!article || article.dataset.readingReady) return;
  article.dataset.readingReady = "true";
  const english = () => document.documentElement.dataset.locale === "en";
  const text = (zh: string, en: string) => english() ? en : zh;
  const headings = [...article.querySelectorAll<HTMLElement>("h2[id], h3[id]")];
  const sectionLinks = [...document.querySelectorAll<HTMLAnchorElement>("[data-reading-section]")];
  const codeButtons: HTMLButtonElement[] = [];
  const anchorLinks: HTMLAnchorElement[] = [];

  headings.forEach((heading) => {
    heading.tabIndex = -1;
    const anchor = document.createElement("a");
    anchor.className = "reading-heading-anchor";
    anchor.href = `#${heading.id}`;
    anchor.textContent = "#";
    anchor.dataset.headingText = heading.textContent ?? "";
    heading.append(anchor);
    anchorLinks.push(anchor);
  });

  article.querySelectorAll<HTMLPreElement>("pre").forEach((pre) => {
    const code = pre.querySelector("code");
    if (!code) return;
    const wrapper = document.createElement("div");
    wrapper.className = "reading-code-block";
    pre.before(wrapper);
    wrapper.append(pre);
    pre.tabIndex = 0;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "reading-copy-code";
    const feedback = document.createElement("span");
    feedback.className = "reading-copy-feedback";
    feedback.setAttribute("role", "status");
    feedback.setAttribute("aria-live", "polite");
    wrapper.append(button, feedback);
    codeButtons.push(button);
    let copyPending = false;
    button.addEventListener("click", async () => {
      if (copyPending) return;
      copyPending = true;
      button.setAttribute("aria-disabled", "true");
      button.setAttribute("aria-busy", "true");
      feedback.textContent = "";
      try {
        await navigator.clipboard.writeText(code.textContent ?? "");
        feedback.textContent = text("代码已复制", "Code copied");
      } catch {
        const range = document.createRange();
        range.selectNodeContents(code);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        feedback.textContent = text("无法自动复制，已选中代码，请手动复制。", "Automatic copy is unavailable. Code selected; copy it manually.");
      } finally {
        copyPending = false;
        button.setAttribute("aria-disabled", "false");
        button.removeAttribute("aria-busy");
      }
    });
  });

  const updateLabels = () => {
    anchorLinks.forEach((anchor) => {
      anchor.setAttribute("aria-label", text(`链接到：${anchor.dataset.headingText}`, `Link to section: ${anchor.dataset.headingText}`));
    });
    codeButtons.forEach((button) => { button.textContent = text("复制代码", "Copy code"); });
    document.querySelectorAll<HTMLElement>(".reading-toc nav").forEach((nav) => {
      nav.setAttribute("aria-label", text("本文目录", "On this page"));
    });
    document.querySelector("[data-reading-neighbors]")?.setAttribute("aria-label", text("连续阅读", "Continue reading"));
  };
  updateLabels();
  window.addEventListener("site-locale-change", updateLabels);

  // Keep browser-native hashes/history while moving keyboard focus into the section.
  document.querySelectorAll<HTMLAnchorElement>("[data-reading-section], .reading-heading-anchor, [href='#article-title']").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
      if (target instanceof HTMLElement) target.focus({ preventScroll: true });
    });
  });

  if (sectionLinks.length && headings.length) {
    let frame = 0;
    let currentId = "";
    let activationTop = 0;
    const measureActivationTop = () => {
      // Native anchor scrolling adds these two offsets; use the same boundary.
      const padding = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const margin = Number.parseFloat(getComputedStyle(headings[0]).scrollMarginTop) || 0;
      activationTop = padding + margin + 4;
    };
    measureActivationTop();
    const updateCurrentSection = () => {
      frame = 0;
      let active = headings[0];
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= activationTop) active = heading;
        else break;
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) active = headings[headings.length - 1];
      if (active.id === currentId) return;
      currentId = active.id;
      sectionLinks.forEach((link) => {
        if (link.dataset.readingSection === currentId) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };
    const scheduleUpdate = () => { if (!frame) frame = window.requestAnimationFrame(updateCurrentSection); };
    updateCurrentSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", () => { measureActivationTop(); scheduleUpdate(); });
  }
};
