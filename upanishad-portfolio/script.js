/* Upanishad Sharma — Editorial Portfolio interactions */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Hero line reveal on load ---------- */
  window.addEventListener("load", () => document.body.classList.add("is-loaded"));
  // Fallback in case load already fired or hangs on slow font fetch
  setTimeout(() => document.body.classList.add("is-loaded"), 600);

  /* ---------- Masthead scroll state + reading progress ---------- */
  const masthead = document.querySelector(".masthead");
  const progressBar = document.querySelector(".progress-bar");

  function onScroll() {
    masthead.classList.toggle("is-scrolled", window.scrollY > 24);
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  const revealables = document.querySelectorAll(".reveal, .reveal-group");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  revealables.forEach((el) => revealObserver.observe(el));

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    if (prefersReducedMotion) {
      el.textContent = target + suffix;
      return;
    }
    const duration = 1600;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4); // ease-out-quart
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const stats = document.getElementById("stats");
  if (stats) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            stats.querySelectorAll(".stat-num").forEach(animateCount);
            statsObserver.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    statsObserver.observe(stats);
  }

  /* ---------- Feature card spotlight follows cursor ---------- */
  const feature = document.querySelector(".feature-link");
  if (feature && !prefersReducedMotion) {
    feature.addEventListener("pointermove", (e) => {
      const rect = feature.getBoundingClientRect();
      feature.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      feature.style.setProperty("--my", `${e.clientY - rect.top}px`);
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".magnetic").forEach((el) => {
      const strength = 0.25;
      el.addEventListener("pointermove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
        el.style.transform = "translate(0, 0)";
        setTimeout(() => (el.style.transition = ""), 500);
      });
    });
  }

  /* ---------- Active nav link highlighting ---------- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) =>
            link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`)
          );
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      menu.hidden = open;
      document.body.style.overflow = open ? "" : "hidden";
    });
    menu.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        menu.hidden = true;
        document.body.style.overflow = "";
      })
    );
  }

  /* ---------- Footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Split-character titles ---------- */
  function splitChars(el) {
    let i = 0;
    function walk(node) {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          for (const ch of child.textContent) {
            if (ch.trim() === "") {
              frag.appendChild(document.createTextNode(ch));
            } else {
              const span = document.createElement("span");
              span.className = "char";
              span.style.setProperty("--i", i++);
              span.textContent = ch;
              frag.appendChild(span);
            }
          }
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== "BR") {
          walk(child);
        }
      });
    }
    walk(el);
    el.classList.add("split");
  }

  const splitTargets = document.querySelectorAll(".section-title, .contact-title");
  if (!prefersReducedMotion) {
    splitTargets.forEach(splitChars);
    const splitObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            splitObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    splitTargets.forEach((el) => splitObserver.observe(el));
  }

  /* ---------- Pull quote word reveal ---------- */
  const pullquote = document.querySelector(".pullquote");
  if (pullquote) {
    const quoteText = pullquote.querySelector(".quote-text");
    if (quoteText && !prefersReducedMotion) {
      quoteText.innerHTML = quoteText.textContent
        .split(/\s+/)
        .filter(Boolean)
        .map((w, i) => `<span class="word" style="--i:${i}">${w}</span>`)
        .join(" ");
    }
    const quoteObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            pullquote.classList.add("is-visible");
            quoteObserver.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    quoteObserver.observe(pullquote);
  }

  /* ---------- Custom cursor ---------- */
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorRing = document.querySelector(".cursor-ring");
  const cursorLabel = document.querySelector(".cursor-label");
  if (cursorDot && cursorRing && !prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    let mx = -100, my = -100, rx = -100, ry = -100;
    let cursorActive = false;

    document.addEventListener("pointermove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!cursorActive) {
        cursorActive = true;
        document.body.classList.add("has-cursor");
        rx = mx; ry = my;
      }
    });
    document.addEventListener("pointerleave", () => {
      cursorActive = false;
      document.body.classList.remove("has-cursor");
    });

    (function cursorLoop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      cursorDot.style.transform = `translate(${mx}px, ${my}px)`;
      cursorRing.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(cursorLoop);
    })();

    // grow over interactive elements; show a label over article cards
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("pointerenter", () => {
        const labelled = el.closest(".work-card") || el.classList.contains("feature-link");
        if (el.hasAttribute("download")) {
          cursorLabel.textContent = "PDF ↓";
          cursorRing.classList.add("has-label");
        } else if (labelled) {
          cursorLabel.textContent = "Read ↗";
          cursorRing.classList.add("has-label");
        } else {
          cursorRing.classList.add("is-hover");
        }
      });
      el.addEventListener("pointerleave", () => {
        cursorRing.classList.remove("is-hover", "has-label");
      });
    });
  }

  /* ---------- Hero glyph parallax ---------- */
  const glyphs = document.querySelectorAll(".glyph");
  if (glyphs.length && !prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener("pointermove", (e) => {
      const dx = e.clientX / window.innerWidth - 0.5;
      const dy = e.clientY / window.innerHeight - 0.5;
      glyphs.forEach((g) => {
        const depth = parseFloat(g.dataset.depth || 0.5);
        g.style.setProperty("--px", `${dx * depth * -60}px`);
        g.style.setProperty("--py", `${dy * depth * -40}px`);
      });
    }, { passive: true });
  }

  /* ---------- Scroll-driven mega marquee ---------- */
  const megaRows = document.querySelectorAll(".mega-row");
  if (megaRows.length && !prefersReducedMotion) {
    megaRows.forEach((row) => {
      // duplicate content so the row never runs out while sliding
      row.appendChild(row.querySelector("span").cloneNode(true));
    });
    let marqueeTicking = false;
    function moveMarquee() {
      megaRows.forEach((row) => {
        const speed = parseFloat(row.dataset.speed || 0.2);
        const x = window.scrollY * speed;
        const span = row.querySelector("span");
        const w = span.offsetWidth;
        // wrap into [-w, 0] so the strip is always covered
        row.style.transform = `translateX(${((x % w) - w) % w}px)`;
      });
      marqueeTicking = false;
    }
    window.addEventListener("scroll", () => {
      if (!marqueeTicking) {
        marqueeTicking = true;
        requestAnimationFrame(moveMarquee);
      }
    }, { passive: true });
    moveMarquee();
  }

  /* ---------- Timeline spine progress ---------- */
  const timeline = document.querySelector(".timeline");
  if (timeline) {
    const spine = document.createElement("div");
    spine.className = "timeline-progress";
    timeline.appendChild(spine);
    let spineTicking = false;
    function drawSpine() {
      const rect = timeline.getBoundingClientRect();
      const anchor = window.innerHeight * 0.72;
      const progress = Math.min(Math.max((anchor - rect.top) / rect.height, 0), 1);
      spine.style.height = `${progress * 100}%`;
      spineTicking = false;
    }
    window.addEventListener("scroll", () => {
      if (!spineTicking) {
        spineTicking = true;
        requestAnimationFrame(drawSpine);
      }
    }, { passive: true });
    drawSpine();
  }

  /* ---------- 3D tilt on work cards ---------- */
  if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".work-card").forEach((card) => {
      const maxTilt = 5;
      card.addEventListener("pointermove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `rotateY(${px * maxTilt}deg) rotateX(${-py * maxTilt}deg)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transition = "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)";
        card.style.transform = "rotateY(0) rotateX(0)";
        setTimeout(() => (card.style.transition = ""), 600);
      });
    });
  }

  /* ---------- Back-to-top FAB with progress ring ---------- */
  const fab = document.querySelector(".fab-top");
  if (fab) {
    fab.hidden = false;
    const ring = fab.querySelector(".fab-progress");
    const CIRC = 131.9; // 2πr, r = 21
    let fabTicking = false;
    function updateFab() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      ring.style.strokeDashoffset = CIRC * (1 - p);
      fab.classList.toggle("is-shown", window.scrollY > window.innerHeight * 0.8);
      fabTicking = false;
    }
    window.addEventListener("scroll", () => {
      if (!fabTicking) {
        fabTicking = true;
        requestAnimationFrame(updateFab);
      }
    }, { passive: true });
    updateFab();
    fab.addEventListener("click", () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" }));
  }
})();
