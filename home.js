(() => {
  const filters = [...document.querySelectorAll("[data-filter]")];
  const projects = [...document.querySelectorAll(".project-card[data-category]")];

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const selected = filter.dataset.filter;

      filters.forEach((item) => item.classList.toggle("is-active", item === filter));
      projects.forEach((project) => {
        const categories = project.dataset.category.split(/\s+/);
        project.hidden = selected !== "all" && !categories.includes(selected);
      });

      window.gtag?.("event", "project_filter", { filter_name: selected });
    });
  });
})();
