// Small progressive-enhancement script: no dependencies, no build step.
// Content is visible without JavaScript; this only adds niceties.

// Current year in the footer.
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Highlight the section currently in view in the nav.
const navLinks = Array.from(document.querySelectorAll("[data-nav]"));
const sections = navLinks
  .map((link) => document.getElementById(link.dataset.nav))
  .filter(Boolean);

if (sections.length) {
  const setActive = () => {
    const line = window.innerHeight * 0.42;
    let active = null;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= line && rect.bottom > line) active = section.id;
    });

    navLinks.forEach((link) => {
      const isActive = link.dataset.nav === active;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };

  window.addEventListener("scroll", setActive, { passive: true });
  window.addEventListener("resize", setActive);
  setActive();
}
