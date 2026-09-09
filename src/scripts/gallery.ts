import { adjacentPhotoIndex, parsePhotoSetHash, photoSwipeDirection } from "../lib/gallery-navigation";

export const initializeGallery = () => {
  const triggers = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-photo-set-open]"));
  const dialogs = Array.from(document.querySelectorAll<HTMLDialogElement>("[data-photo-set-dialog]"));
  const lightbox = document.querySelector<HTMLDialogElement>("[data-photo-lightbox]");
  const image = lightbox?.querySelector<HTMLImageElement>("[data-photo-lightbox-image]");
  const zoom = lightbox?.querySelector<HTMLButtonElement>("[data-photo-lightbox-zoom]");
  const previous = lightbox?.querySelector<HTMLButtonElement>("[data-photo-previous]");
  const next = lightbox?.querySelector<HTMLButtonElement>("[data-photo-next]");
  const count = lightbox?.querySelector<HTMLOutputElement>("[data-photo-count]");
  const feedback = lightbox?.querySelector<HTMLElement>("[data-photo-feedback]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const observers = new WeakMap<HTMLDialogElement, IntersectionObserver>();
  const triggerByDialog = new WeakMap<HTMLDialogElement, HTMLButtonElement>();
  let activePhotos: HTMLButtonElement[] = [];
  let activeIndex = -1;
  let activeDialog: HTMLDialogElement | null = null;
  let gesture: { id: number; x: number; y: number } | undefined;
  let suppressClickUntil = 0;

  const english = () => document.documentElement.dataset.locale === "en";
  const copy = (zh: string, en: string) => english() ? en : zh;
  const resetZoom = () => {
    zoom?.setAttribute("aria-pressed", "false");
    zoom?.style.removeProperty("--photo-zoom-x");
    zoom?.style.removeProperty("--photo-zoom-y");
    gesture = undefined;
  };
  const syncCopy = () => {
    lightbox?.querySelector("[data-photo-previous-label]")?.replaceChildren(copy("上一张", "Previous"));
    lightbox?.querySelector("[data-photo-next-label]")?.replaceChildren(copy("下一张", "Next"));
    previous?.setAttribute("aria-label", copy("上一张照片", "Previous photo"));
    next?.setAttribute("aria-label", copy("下一张照片", "Next photo"));
    zoom?.setAttribute("aria-label", copy("切换图片放大状态", "Toggle photo zoom"));
    lightbox?.querySelector("[data-photo-lightbox-close]")?.setAttribute("aria-label", copy("关闭大图预览", "Close photo preview"));
    lightbox?.querySelector("[data-photo-navigation]")?.setAttribute("aria-label", copy("照片导航", "Photo navigation"));
    lightbox?.querySelector("#photo-lightbox-title")?.replaceChildren(copy("大图预览", "Photo preview"));
    if (count && activeIndex >= 0) {
      count.value = `${activeIndex + 1} / ${activePhotos.length}`;
      count.setAttribute("aria-label", copy(`第 ${activeIndex + 1} 张，共 ${activePhotos.length} 张`, `Photo ${activeIndex + 1} of ${activePhotos.length}`));
    }
    if (feedback && !feedback.hidden) feedback.textContent = copy("图片暂时无法加载，可继续浏览其他照片。", "This photo could not load. You can continue browsing.");
  };

  const activateImage = (preview: HTMLImageElement) => {
    // Set the responsive candidates before the fallback URL to avoid requesting
    // two variants. Closed sets never expose either attribute to the browser.
    if (preview.dataset.photoSrcset) preview.srcset = preview.dataset.photoSrcset;
    if (preview.dataset.photoSrc) preview.src = preview.dataset.photoSrc;
    delete preview.dataset.photoSrcset;
    delete preview.dataset.photoSrc;
  };

  const revealDialog = (dialog: HTMLDialogElement) => {
    observers.get(dialog)?.disconnect();
    const frames = Array.from(dialog.querySelectorAll<HTMLElement>("[data-dialog-reveal]"));
    const reveal = (frame: HTMLElement) => {
      frame.classList.add("is-visible");
      const preview = frame.querySelector<HTMLImageElement>("img[data-photo-src]");
      if (preview) activateImage(preview);
    };
    if (!("IntersectionObserver" in window)) {
      frames.forEach(reveal);
      return;
    }
    if (reducedMotion.matches) frames.forEach((frame) => frame.classList.add("is-visible"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || !dialog.open) return;
        reveal(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      });
    }, { root: dialog, rootMargin: "240px 0px", threshold: 0 });
    frames.forEach((frame) => observer.observe(frame));
    observers.set(dialog, observer);
  };

  const showPhoto = (index: number) => {
    const trigger = activePhotos[index];
    if (!trigger || !image || !zoom) return;
    const source = trigger.dataset.photoLightboxSrc;
    if (!source) return;
    activeIndex = index;
    resetZoom();
    if (feedback) feedback.hidden = true;
    image.alt = trigger.dataset.photoLightboxAlt || "";
    image.width = Number(trigger.dataset.photoWidth) || 1600;
    image.height = Number(trigger.dataset.photoHeight) || 1200;
    image.src = source;
    if (previous) previous.disabled = index === 0;
    if (next) next.disabled = index === activePhotos.length - 1;
    syncCopy();
  };

  const move = (direction: -1 | 1) => {
    const index = adjacentPhotoIndex(activeIndex, activePhotos.length, direction);
    if (index < 0 || index === activeIndex) return;
    const focusedStep = document.activeElement === previous ? previous : document.activeElement === next ? next : null;
    showPhoto(index);
    // Disabled end controls cannot retain keyboard focus reliably.
    if (focusedStep?.disabled) zoom?.focus({ preventScroll: true });
  };

  const closeLightbox = () => {
    if (lightbox?.open) lightbox.close();
  };

  const openDialog = (trigger: HTMLButtonElement, syncHash = true) => {
    const dialog = document.getElementById(trigger.dataset.dialogId || "");
    if (!(dialog instanceof HTMLDialogElement) || typeof dialog.showModal !== "function") return;
    if (dialog.open) return;
    closeLightbox();
    dialogs.forEach((other) => { if (other !== dialog && other.open) other.close(); });
    triggerByDialog.set(dialog, trigger);
    dialog.showModal();
    revealDialog(dialog);
    if (syncHash && trigger.dataset.photoSetHash) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${trigger.dataset.photoSetHash}`);
    }
  };

  triggers.forEach((trigger) => trigger.addEventListener("click", () => openDialog(trigger)));
  dialogs.forEach((dialog) => {
    dialog.querySelector("[data-photo-set-close]")?.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener("cancel", (event) => {
      if (lightbox?.open) { event.preventDefault(); closeLightbox(); }
    });
    dialog.addEventListener("close", () => {
      observers.get(dialog)?.disconnect();
      if (activeDialog === dialog) closeLightbox();
      if (parsePhotoSetHash(window.location.hash) === dialog.dataset.photoSetHash) {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      }
      if (!dialogs.some((other) => other.open)) triggerByDialog.get(dialog)?.focus({ preventScroll: true });
    });
    const photos = Array.from(dialog.querySelectorAll<HTMLButtonElement>("[data-photo-lightbox-open]"));
    photos.forEach((trigger, index) => trigger.addEventListener("click", () => {
      if (!lightbox || typeof lightbox.showModal !== "function") return;
      activeDialog = dialog;
      activePhotos = photos;
      showPhoto(index);
      if (!lightbox.open) lightbox.showModal();
    }));
  });

  previous?.addEventListener("click", () => move(-1));
  next?.addEventListener("click", () => move(1));
  lightbox?.querySelector("[data-photo-lightbox-close]")?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => { if (event.target === lightbox) closeLightbox(); });
  lightbox?.addEventListener("cancel", (event) => { event.preventDefault(); event.stopPropagation(); closeLightbox(); });
  lightbox?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeLightbox();
    } else if (!event.altKey && !event.ctrlKey && !event.metaKey && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
      event.preventDefault();
      move(event.key === "ArrowLeft" ? -1 : 1);
    }
  });
  lightbox?.addEventListener("close", () => {
    resetZoom();
    image?.removeAttribute("src");
    if (image) image.alt = "";
    if (activeDialog?.open) activePhotos[activeIndex]?.focus({ preventScroll: true });
  });
  image?.addEventListener("error", () => {
    if (!lightbox?.open || !feedback) return;
    feedback.hidden = false;
    syncCopy();
  });
  image?.addEventListener("load", () => { if (feedback) feedback.hidden = true; });

  zoom?.addEventListener("click", (event) => {
    if (performance.now() < suppressClickUntil) { event.preventDefault(); return; }
    const shouldZoom = zoom.getAttribute("aria-pressed") !== "true";
    if (shouldZoom) {
      const rect = zoom.getBoundingClientRect();
      const pointer = event.detail > 0 && rect.width > 0 && rect.height > 0;
      const x = pointer ? (event.clientX - rect.left) / rect.width * 100 : 50;
      const y = pointer ? (event.clientY - rect.top) / rect.height * 100 : 50;
      zoom.style.setProperty("--photo-zoom-x", `${Math.max(0, Math.min(100, x))}%`);
      zoom.style.setProperty("--photo-zoom-y", `${Math.max(0, Math.min(100, y))}%`);
    }
    zoom.setAttribute("aria-pressed", String(shouldZoom));
  });
  zoom?.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "touch") return;
    if (!event.isPrimary || zoom.getAttribute("aria-pressed") === "true") { gesture = undefined; return; }
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY };
    zoom.setPointerCapture(event.pointerId);
  });
  zoom?.addEventListener("pointerup", (event) => {
    if (!gesture || gesture.id !== event.pointerId) return;
    const direction = photoSwipeDirection(event.clientX - gesture.x, event.clientY - gesture.y);
    gesture = undefined;
    if (direction) {
      suppressClickUntil = performance.now() + 500;
      move(direction);
    }
  });
  zoom?.addEventListener("pointercancel", () => { gesture = undefined; });
  zoom?.addEventListener("lostpointercapture", () => { gesture = undefined; });
  window.addEventListener("site-locale-change", syncCopy);
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) dialogs.forEach((dialog) => dialog.querySelectorAll("[data-dialog-reveal]").forEach((frame) => frame.classList.add("is-visible")));
  });

  const openFromHash = () => {
    const hash = parsePhotoSetHash(window.location.hash);
    if (!hash) return;
    const trigger = triggers.find((candidate) => candidate.dataset.photoSetHash === hash);
    if (trigger) openDialog(trigger, false);
  };
  syncCopy();
  openFromHash();
  window.addEventListener("hashchange", openFromHash);
};
