(() => {
  const previews = [...document.querySelectorAll("[data-translation-preview]")];
  if (!previews.length) return;

  const hint = document.createElement("div");
  hint.className = "cursor-translation-hint";
  hint.setAttribute("aria-hidden", "true");
  document.body.appendChild(hint);

  const moveHint = (event) => {
    const gap = 16;
    const edge = 8;
    const width = hint.offsetWidth;
    const height = hint.offsetHeight;
    const left = event.clientX + gap + width > window.innerWidth - edge
      ? event.clientX - width - gap
      : event.clientX + gap;
    const top = event.clientY + gap + height > window.innerHeight - edge
      ? event.clientY - height - gap
      : event.clientY + gap;

    hint.style.left = `${Math.max(edge, left)}px`;
    hint.style.top = `${Math.max(edge, top)}px`;
  };

  previews.forEach((preview) => {
    preview.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "touch") return;
      preview.classList.add("is-translating");
      hint.textContent = preview.dataset.cursorHint || "Hover to view in English";
      hint.classList.add("is-visible");
      moveHint(event);
    });
    preview.addEventListener("pointermove", moveHint);
    preview.addEventListener("pointerleave", () => {
      preview.classList.remove("is-translating");
      hint.classList.remove("is-visible");
    });
  });
})();
