(() => {
  const player = document.querySelector("[data-feature-player]");
  if (!player) return;

  const tabs = [...player.querySelectorAll("[data-feature-tab]")];
  const panels = [...player.querySelectorAll("[data-feature-panel]")];
  const scenes = [...player.querySelectorAll("[data-feature-scene]")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const interval = 4800;
  let activeIndex = 0;
  let timer = null;
  let paused = false;

  const restartProgress = () => {
    player.classList.remove("is-playing");
    void player.offsetWidth;
    if (!paused && !reduceMotion.matches) player.classList.add("is-playing");
  };

  const select = (index, moveFocus = false) => {
    activeIndex = (index + tabs.length) % tabs.length;
    tabs.forEach((tab, i) => {
      const selected = i === activeIndex;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && moveFocus) tab.focus();
    });
    panels.forEach((panel, i) => {
      const selected = i === activeIndex;
      panel.hidden = !selected;
      panel.classList.toggle("is-active", selected);
    });
    scenes.forEach((scene, i) => {
      const selected = i === activeIndex;
      scene.classList.toggle("is-active", selected);
      scene.setAttribute("aria-hidden", String(!selected));
    });
    restartProgress();
  };

  const stop = () => {
    window.clearInterval(timer);
    timer = null;
    player.classList.remove("is-playing");
  };

  const start = () => {
    stop();
    if (paused || reduceMotion.matches) return;
    restartProgress();
    timer = window.setInterval(() => select(activeIndex + 1), interval);
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      select(index);
      start();
    });
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : activeIndex + (event.key === "ArrowRight" ? 1 : -1);
      select(next, true);
      start();
    });
  });

  player.addEventListener("pointerenter", () => { paused = true; stop(); });
  player.addEventListener("pointerleave", () => { paused = false; start(); });
  player.addEventListener("focusin", () => { paused = true; stop(); });
  player.addEventListener("focusout", (event) => {
    if (player.contains(event.relatedTarget)) return;
    paused = false;
    start();
  });
  document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());
  reduceMotion.addEventListener?.("change", start);

  select(0);
  start();
})();
