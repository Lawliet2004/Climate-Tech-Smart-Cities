/**
 * Main application logic handles dark mode, collapsible sections, smooth scrolling, and mobile menu.
 */

document.addEventListener("DOMContentLoaded", () => {
  initDarkMode();
  initSmoothScroll();
  initMobileMenu();
  initCopyButtons();
});

/**
 * Dark Mode Implementation
 * Saves preference to localStorage
 */
function initDarkMode() {
  const toggleBtn = document.getElementById("dark-mode-toggle");
  if (!toggleBtn) return;

  // Check local storage or system preference
  let currentTheme = localStorage.getItem("theme");
  if (!currentTheme) {
    currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  setTheme(currentTheme);

  toggleBtn.addEventListener("click", () => {
    const theme =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark";
    setTheme(theme);
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  // Update icon
  const icon = document.getElementById("dark-mode-icon");
  if (icon) {
    if (theme === "dark") {
      // Sun icon for dark mode (Switch to light)
      icon.innerHTML =
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />';
    } else {
      // Moon icon for light mode (Switch to dark)
      icon.innerHTML =
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />';
    }
  }
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        // Account for sticky header
        const offset = document.querySelector(".top-nav")?.offsetHeight || 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = target.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset - 20; // 20px padding

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        // Update history without jumping
        history.pushState(null, null, targetId);
      }
    });
  });
}

/**
 * Mobile Hamburger Menu toggling
 */
function initMobileMenu() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const sidebar = document.querySelector(".left-sidebar");

  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => {
      const isExpanded = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", !isExpanded);

      if (isExpanded) {
        sidebar.style.display = "none";
      } else {
        sidebar.style.display = "block";
        // Simple positioning for mobile overlay
        sidebar.style.position = "fixed";
        sidebar.style.top = "60px"; // below nav
        sidebar.style.left = "0";
        sidebar.style.width = "100%";
        sidebar.style.height = "calc(100vh - 60px)";
        sidebar.style.backgroundColor = "var(--color-bg-light)";
        sidebar.style.zIndex = "90";
        sidebar.style.padding = "2rem";
      }
    });
  }
}

/**
 * Copy to Clipboard for code blocks
 */
function initCopyButtons() {
  const codeBlocks = document.querySelectorAll("pre");

  codeBlocks.forEach((block) => {
    // Create button
    const btn = document.createElement("button");
    btn.textContent = "Copy";
    btn.className = "copy-btn";
    btn.style.position = "absolute";
    btn.style.top = "0.5rem";
    btn.style.right = "0.5rem";
    btn.style.padding = "0.25rem 0.5rem";
    btn.style.fontSize = "0.8rem";
    btn.style.cursor = "pointer";
    btn.style.border = "1px solid #4a5568";
    btn.style.backgroundColor = "#2d3748";
    btn.style.color = "#e2e8f0";
    btn.style.borderRadius = "0.25rem";
    btn.setAttribute("aria-label", "Copy code to clipboard");

    // Setup wrapper for relative positioning
    if (
      block.style.position !== "relative" &&
      block.style.position !== "absolute"
    ) {
      block.style.position = "relative";
    }

    block.appendChild(btn);

    btn.addEventListener("click", () => {
      const code = block.querySelector("code");
      if (!code) return;

      navigator.clipboard
        .writeText(code.innerText)
        .then(() => {
          btn.textContent = "Copied!";
          btn.style.backgroundColor = "var(--color-primary-forest)";

          setTimeout(() => {
            btn.textContent = "Copy";
            btn.style.backgroundColor = "#2d3748";
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    });
  });
}
