/** Keep bookmarks to the former inline sections working with the new pages. */
export const initializeNowSections = () => {
  const root = document.querySelector<HTMLElement>("[data-now-page]");
  if (!root || root.dataset.initialized) return;
  root.dataset.initialized = "true";

  const redirectLegacyHash = () => {
    let id: string;
    try { id = decodeURIComponent(window.location.hash.slice(1)); }
    catch { return; }
    if (!id) return;
    const target = document.getElementById(id);
    if (!target || !root.contains(target)) return;
    const link = target.querySelector<HTMLAnchorElement>("[data-now-section-link]");
    if (link) window.location.replace(link.href);
  };

  redirectLegacyHash();
  window.addEventListener("hashchange", redirectLegacyHash);
};
