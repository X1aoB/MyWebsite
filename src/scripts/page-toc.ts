/**
 * Highlights the page-TOC link of the section under the reading line, for hand-built
 * pages whose rail lists section headings (article pages use article-reading.ts).
 */
export const initializePageToc = () => {
  const links = [...document.querySelectorAll<HTMLAnchorElement>("[data-page-toc] [data-reading-section]")];
  const targets = links
    .map((link) => document.getElementById(link.dataset.readingSection ?? ""))
    .filter((target): target is HTMLElement => target instanceof HTMLElement);
  if (!targets.length) return;

  let frame = 0;
  let currentId = "";
  const update = () => {
    frame = 0;
    const line = (Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0) + 8;
    let active = targets[0];
    for (const target of targets) {
      if (target.getBoundingClientRect().top <= line) active = target;
      else break;
    }
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) active = targets[targets.length - 1];
    if (active.id === currentId) return;
    currentId = active.id;
    links.forEach((link) => {
      if (link.dataset.readingSection === currentId) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };
  const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
  update();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
};
