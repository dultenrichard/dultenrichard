(() => {
  "use strict";
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".navigation");
  const emit = (name, params = {}) => {
    if (window.umami && typeof window.umami.track === "function") {
      window.umami.track(name, params);
    }
  };

  if (menu && nav) {
    const closeMenu = () => {
      menu.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-label", "Open navigation");
      nav.classList.remove("is-open");
    };
    menu.addEventListener("click", () => {
      const open = menu.getAttribute("aria-expanded") !== "true";
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      nav.classList.toggle("is-open", open);
      emit("navigation_toggle", { open });
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeMenu();
        menu.focus();
      }
    });
    document.addEventListener("click", event => {
      if (!nav.contains(event.target) && !menu.contains(event.target)) closeMenu();
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const query = new URLSearchParams(location.search);
  const campaign = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(key => {
    if (query.has(key)) campaign[key] = query.get(key).slice(0, 200);
  });
  if (Object.keys(campaign).length) emit("campaign_landing", campaign);

  document.querySelectorAll("[data-track]").forEach(link => {
    link.addEventListener("click", () => {
      const params = { interaction: link.dataset.track, label: (link.textContent || "").trim().slice(0, 80) };
      if (link.href) {
        try {
          const destination = new URL(link.href);
          params.destination = destination.origin + destination.pathname;
        } catch (_) {}
      }
      emit("site_interaction", params);
    });
  });

  const sections = [...document.querySelectorAll("main section[id]")];
  if ("IntersectionObserver" in window) {
    const seen = new Set();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !seen.has(entry.target.id)) {
          seen.add(entry.target.id);
          emit("section_view", { section_id: entry.target.id });
        }
      });
    }, { threshold: 0.35 });
    sections.forEach(section => observer.observe(section));
  }

  if (location.hash) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) emit("deep_link_view", { section_id: target.id });
  }
  window.addEventListener("hashchange", () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id) emit("route_view", { section_id: id });
  });

  let maxScroll = 0;
  const milestones = new Set();
  let exitSent = false;
  const started = Date.now();
  window.addEventListener("scroll", () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const percent = Math.min(100, Math.round(window.scrollY / scrollable * 100));
    maxScroll = Math.max(maxScroll, percent);
    [25, 50, 75, 90].forEach(point => {
      if (percent >= point && !milestones.has(point)) {
        milestones.add(point);
        emit("scroll_depth", { percent: point });
      }
    });
  }, { passive: true });
  const reportExit = () => {
    if (exitSent) return;
    exitSent = true;
    emit("page_exit", { max_scroll_percent: maxScroll, session_duration_seconds: Math.round((Date.now() - started) / 1000) });
  };
  window.addEventListener("pagehide", reportExit);
})();