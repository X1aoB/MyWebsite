/** Progressive motion: content is always readable before JavaScript initializes. */
export const initializePageMotion = () => {
  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const progress = document.querySelector<HTMLElement>("[data-scroll-progress]");
  const targets = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
  let scrollRange = 0;
  let scrollFrame = 0;
  let lastProgress = -1;

  const updateProgress = () => {
    scrollFrame = 0;
    const value = scrollRange > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollRange)) : 0;
    if (progress && value !== lastProgress) progress.style.transform = `scaleX(${value})`;
    lastProgress = value;
  };
  const scheduleProgress = () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateProgress);
  };
  const measure = () => {
    scrollRange = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    scheduleProgress();
  };
  measure();
  window.addEventListener("scroll", scheduleProgress, { passive: true });
  window.addEventListener("resize", measure, { passive: true });
  if ("ResizeObserver" in window) new ResizeObserver(measure).observe(document.body);

  const reveal = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        reveal.unobserve(entry.target);
      }
    }
  }, { threshold: 0.04 });
  targets.forEach((target, index) => {
    // Never hide above-the-fold content or content restored by browser history.
    if (target.getBoundingClientRect().top < window.innerHeight) target.classList.add("is-visible");
    else {
      target.style.setProperty("--reveal-delay", `${index % 3 * 55}ms`);
      reveal.observe(target);
    }
  });
  const updateMotion = () => {
    root.dataset.motion = reduced.matches ? "reduced" : "enabled";
    if (reduced.matches) {
      targets.forEach((target) => target.classList.add("is-visible"));
      reveal.disconnect();
    }
  };
  updateMotion();
  reduced.addEventListener("change", updateMotion);
  const updateVisibility = () => root.classList.toggle("is-motion-paused", document.hidden);
  document.addEventListener("visibilitychange", updateVisibility);
  updateVisibility();
  const ambientObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle("is-in-view", entry.isIntersecting));
  });
  document.querySelectorAll("[data-ambient-region]").forEach((region) => ambientObserver.observe(region));

  const artwork = document.querySelector<HTMLElement>("[data-art-parallax]");
  if (!artwork) return;
  let bounds: DOMRect;
  let pointerFrame = 0;
  let tiltX = 0;
  let tiltY = 0;
  const resetArtwork = () => {
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    artwork.style.setProperty("--art-x", "0deg");
    artwork.style.setProperty("--art-y", "0deg");
  };
  artwork.addEventListener("pointerenter", () => { bounds = artwork.getBoundingClientRect(); });
  artwork.addEventListener("pointermove", (event) => {
    if (!finePointer.matches || reduced.matches || !bounds) return;
    tiltY = Math.max(-4, Math.min(4, ((event.clientX - bounds.left) / bounds.width - 0.5) * 8));
    tiltX = Math.max(-4, Math.min(4, ((event.clientY - bounds.top) / bounds.height - 0.5) * -8));
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      artwork.style.setProperty("--art-x", `${tiltX}deg`);
      artwork.style.setProperty("--art-y", `${tiltY}deg`);
      pointerFrame = 0;
    });
  });
  artwork.addEventListener("pointerleave", resetArtwork);
  reduced.addEventListener("change", resetArtwork);
  finePointer.addEventListener("change", resetArtwork);
};
