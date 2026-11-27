(() => {
  "use strict";
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  const track = (name, params = {}) => {
    if (window.umami && typeof window.umami.track === "function") window.umami.track(name, params);
  };
  if (menu && nav) {
    const close = () => {
      menu.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-label", "Open navigation");
      nav.classList.remove("is-open");
    };
    menu.addEventListener("click", () => {
      const open = menu.getAttribute("aria-expanded") !== "true";
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      nav.classList.toggle("is-open", open);
      track("navigation_toggle", { open });
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
        close();
        menu.focus();
      }
    });
    document.addEventListener("click", event => {
      if (!nav.contains(event.target) && !menu.contains(event.target)) close();
    });
  }
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
  document.querySelectorAll("[data-track]").forEach(link => {
    link.addEventListener("click", () => track("site_interaction", {
      interaction: link.dataset.track,
      label: (link.textContent || "").trim().slice(0, 80)
    }));
  });
  if ("IntersectionObserver" in window) {
    const seen = new Set();
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting && !seen.has(entry.target.id)) {
        seen.add(entry.target.id);
        track("section_view", { section_id: entry.target.id });
      }
    }), { threshold: 0.35 });
    document.querySelectorAll("main section[id]").forEach(section => observer.observe(section));
  }
})();