(() => {
  "use strict";
  const SITE = "Dulten Richard";
  const GA4_MEASUREMENT_ID = ""; // Add your real G-XXXXXXXXXX ID only after creating a GA4 web stream.
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  const emit = (name, params = {}) => {
    const detail = { event: name, ...params, page_location: location.href, page_title: document.title };
    window.dispatchEvent(new CustomEvent("site:analytics", { detail }));
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(detail);
  };

  if (menu && nav) {
    menu.addEventListener("click", () => {
      const open = menu.getAttribute("aria-expanded") !== "true";
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      nav.classList.toggle("open", open);
      emit("navigation_toggle", { open });
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("open");
      menu.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-label", "Open navigation");
    }));
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Preserve campaign attribution for the current browsing session.
  const query = new URLSearchParams(location.search);
  const campaign = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(key => {
    if (query.has(key)) campaign[key] = query.get(key).slice(0, 200);
  });
  try {
    if (Object.keys(campaign).length) sessionStorage.setItem("site_campaign", JSON.stringify(campaign));
    Object.assign(campaign, JSON.parse(sessionStorage.getItem("site_campaign") || "{}"));
  } catch (_) {}
  // Analytics provider adapter: once a real GA4 ID is supplied, send events to GA4.
  if (GA4_MEASUREMENT_ID && /^G-[A-Z0-9]+$/.test(GA4_MEASUREMENT_ID)) {
    const ga = document.createElement("script");
    ga.async = true;
    ga.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA4_MEASUREMENT_ID);
    document.head.appendChild(ga);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA4_MEASUREMENT_ID, { send_page_view: false });
    window.addEventListener("site:analytics", event => {
      const { event: eventName, ...params } = event.detail;
      window.gtag("event", eventName, params);
    });
  }

  emit("page_view", {
    site_name: SITE,
    page_path: location.pathname + location.hash,
    page_referrer: document.referrer || "direct",
    ...campaign
  });

  document.querySelectorAll("[data-track]").forEach(el => {
    el.addEventListener("click", () => emit("site_interaction", {
      interaction: el.dataset.track,
      label: (el.textContent || "").trim().slice(0, 100),
      destination: el.href || ""
    }));
  });

  const sections = [...document.querySelectorAll("main section[id]")];
  const seenSections = new Set();
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting && !seenSections.has(entry.target.id)) {
        seenSections.add(entry.target.id);
        emit("section_view", { section_id: entry.target.id, section_name: entry.target.querySelector("h1,h2")?.innerText?.replace(/\s+/g, " ").slice(0, 100) || entry.target.id });
      }
    }), { threshold: 0.35 });
    sections.forEach(section => sectionObserver.observe(section));

    const revealTargets = document.querySelectorAll(".section-label,.display-copy,.body-copy,.interlude blockquote,.work-card,.timeline-item,.recognition,.ideas-copy,.speaking-content,.contact-inner");
    revealTargets.forEach(el => el.classList.add("reveal"));
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); revealObserver.unobserve(entry.target); }
    }), { threshold: 0.12 });
    revealTargets.forEach(el => revealObserver.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
  }

  const milestones = [25, 50, 75, 90];
  const recorded = new Set();
  let maxScroll = 0;
  const sessionStartedAt = Date.now();
  window.addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    const percent = Math.min(100, Math.round((window.scrollY / max) * 100));
    maxScroll = Math.max(maxScroll, percent);
    milestones.forEach(point => {
      if (percent >= point && !recorded.has(point)) {
        recorded.add(point);
        emit("scroll_depth", { percent: point });
      }
    });
  }, { passive: true });

  let sentExit = false;
  const reportExit = () => {
    if (sentExit) return;
    sentExit = true;
    emit("page_exit", { max_scroll_percent: maxScroll, session_duration_seconds: Math.round((Date.now() - sessionStartedAt) / 1000) });
  };
  window.addEventListener("pagehide", reportExit);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") reportExit(); });

  if (location.hash) {
    const target = document.querySelector(location.hash);
    if (target) emit("deep_link_view", { section_id: target.id });
  }
})();