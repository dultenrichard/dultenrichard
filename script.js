(() => {
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  const track = (name, data) => window.umami?.track?.(name, data);
  if (menu && nav) {
    const setOpen = open => {
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      nav.classList.toggle("is-open", open);
    };
    menu.addEventListener("click", () => {
      const open = menu.getAttribute("aria-expanded") !== "true";
      setOpen(open);
      track("navigation_toggle", { open });
    });
    nav.addEventListener("click", event => {
      if (event.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        menu.focus();
      }
    });
    document.addEventListener("click", event => {
      if (!nav.contains(event.target) && !menu.contains(event.target)) setOpen(false);
    });
  }
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
  document.querySelectorAll("[data-track]").forEach(link => {
    link.addEventListener("click", () => track("site_interaction", {
      interaction: link.dataset.track,
      label: link.textContent.trim().slice(0, 80)
    }));
  });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        track("section_view", { section_id: entry.target.id });
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.35 });
    document.querySelectorAll("main section[id]").forEach(section => observer.observe(section));
  }
})();
