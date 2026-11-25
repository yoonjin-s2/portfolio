(() => {
  const measurementId = "G-1KFNY2LYZ7";

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  const tag = document.createElement("script");
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(tag);

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    page_title: document.title,
    page_path: `${window.location.pathname}${window.location.search}`,
  });

  const track = (eventName, parameters = {}) => {
    window.gtag("event", eventName, parameters);
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href") || "";
    const linkText = link.textContent.replace(/\s+/g, " ").trim();
    const commonParameters = {
      link_text: linkText,
      link_url: link.href,
    };

    if (link.classList.contains("project-card")) {
      track("select_content", {
        ...commonParameters,
        content_type: "project",
        item_id: link.querySelector("h2")?.textContent.trim() || linkText,
      });
      return;
    }

    if (link.dataset.analyticsEvent) {
      track(link.dataset.analyticsEvent, {
        ...commonParameters,
        project_name: link.dataset.projectName || document.title,
      });
      return;
    }

    if (/detail/i.test(linkText)) {
      track("detail_click", {
        ...commonParameters,
        project_name: link.dataset.projectName || document.title,
      });
      return;
    }

    if (href.includes("#resume")) {
      track("resume_click", commonParameters);
      return;
    }

    if (link.closest("nav") || link.classList.contains("site-logo")) {
      track("navigation_click", commonParameters);
    }
  });

  const reportedDepths = new Set();
  const depthThresholds = [25, 50, 75, 100];

  const trackScrollDepth = () => {
    const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
    const depth = pageHeight <= 0 ? 100 : Math.min(100, Math.round((window.scrollY / pageHeight) * 100));

    depthThresholds.forEach((threshold) => {
      if (depth >= threshold && !reportedDepths.has(threshold)) {
        reportedDepths.add(threshold);
        track("scroll_depth", { percent_scrolled: threshold });
      }
    });
  };

  window.addEventListener("scroll", trackScrollDepth, { passive: true });
  trackScrollDepth();
})();
