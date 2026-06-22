/* ═══════════════════════════════════════════════════════════
   SIDEBAR PROGRESS — Left-edge progress indicator per scene
   ═══════════════════════════════════════════════════════════ */
(() => {
  const sections = document.querySelectorAll(".bpt-scene, .bpt-sm-panel");
  if (!sections.length) return;

  /** Inject a sidebar progress element if not already present */
  function ensureSidebarIndicator(section) {
    if (section.querySelector(".sidebar-progress")) return;

    const indicator = document.createElement("div");
    indicator.className = "sidebar-progress";
    section.appendChild(indicator);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const sidebar = entry.target.querySelector(".sidebar-progress");
        if (!sidebar) return;

        if (entry.isIntersecting) {
          sidebar.classList.add("sidebar-in");
          sidebar.classList.remove("sidebar-out");
        } else {
          sidebar.classList.remove("sidebar-in");
          sidebar.classList.add("sidebar-out");
        }
      });
    },
    { threshold: 0.1, rootMargin: "-5% 0px" }
  );

  sections.forEach((section) => {
    ensureSidebarIndicator(section);
    observer.observe(section);
  });
})();
