/**
 * Robert Cygan · Dossier 2026
 * main.js – Animations & Interactions
 * Palette: Black / Gold / Cream
 */

"use strict";

// ─────────────────────────────────────────────────────────────
// 1. SCROLL PROGRESS BAR
// ─────────────────────────────────────────────────────────────
(function initProgressBar() {
  const bar = document.getElementById("progress-bar");
  if (!bar) return;

  window.addEventListener(
    "scroll",
    () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
      bar.style.width = Math.min(progress, 100) + "%";
    },
    { passive: true }
  );
})();

// ─────────────────────────────────────────────────────────────
// 2. NAVBAR – SCROLL STATE + ACTIVE LINK
// ─────────────────────────────────────────────────────────────
(function initNavbar() {
  const nav = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("section[id]");
  if (!nav) return;

  window.addEventListener(
    "scroll",
    () => {
      nav.classList.toggle("scrolled", window.scrollY > 60);

      let current = "";
      sections.forEach((s) => {
        if (window.scrollY >= s.offsetTop - 130) current = s.id;
      });
      navLinks.forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === "#" + current);
      });
    },
    { passive: true }
  );
})();

// ─────────────────────────────────────────────────────────────
// 3. SMOOTH SCROLL
// ─────────────────────────────────────────────────────────────
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;
      e.preventDefault();

      const mobileMenu = document.getElementById("mobile-menu");
      const hamburger = document.getElementById("hamburger");
      if (mobileMenu?.classList.contains("open")) {
        mobileMenu.classList.remove("open");
        hamburger?.classList.remove("open");
        hamburger?.setAttribute("aria-expanded", "false");
      }

      const top = target.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
})();

// ─────────────────────────────────────────────────────────────
// 4. REVEAL ON SCROLL (IntersectionObserver)
// ─────────────────────────────────────────────────────────────
(function initReveal() {
  document.documentElement.classList.add("js-ready");

  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  const fallback = setTimeout(() => {
    els.forEach((el) => el.classList.add("visible"));
  }, 3500);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const siblings = [
          ...entry.target.parentElement.querySelectorAll(
            ".reveal:not(.visible)"
          ),
        ];
        const idx = siblings.indexOf(entry.target);
        const delay = idx * 90;

        setTimeout(
          () => entry.target.classList.add("visible"),
          Math.max(delay, 0)
        );
        observer.unobserve(entry.target);
      });

      if (document.querySelectorAll(".reveal:not(.visible)").length === 0) {
        clearTimeout(fallback);
      }
    },
    { threshold: 0.06, rootMargin: "0px 0px -40px 0px" }
  );

  els.forEach((el) => observer.observe(el));
})();

// ─────────────────────────────────────────────────────────────
// 5. COUNTER ANIMATION (stats bar)
// ─────────────────────────────────────────────────────────────
(function initCounters() {
  const counterEls = document.querySelectorAll("[data-target]");
  if (!counterEls.length) return;

  function animateCounter(el, target, duration) {
    const start = performance.now();
    (function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target + (el.dataset.suffix || "");
    })(start);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = parseInt(entry.target.dataset.target, 10);
        const duration = target > 50 ? 1800 : 1200;
        animateCounter(entry.target, target, duration);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  counterEls.forEach((el) => observer.observe(el));
})();

// ─────────────────────────────────────────────────────────────
// 6. Q&A ACCORDION
// ─────────────────────────────────────────────────────────────
(function initAccordion() {
  document.querySelectorAll(".qa-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.parentElement;
      const isOpen = item.classList.contains("open");

      document.querySelectorAll(".qa-item").forEach((i) => {
        i.classList.remove("open");
        i.querySelector(".qa-trigger")?.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });
})();

// ─────────────────────────────────────────────────────────────
// 7. MOBILE HAMBURGER MENU
// ─────────────────────────────────────────────────────────────
(function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    }
  });
})();

// ─────────────────────────────────────────────────────────────
// 8. HERO PARALLAX (subtle)
// ─────────────────────────────────────────────────────────────
(function initParallax() {
  const glow = document.querySelector(".hero-glow");
  const grid = document.querySelector(".hero-grid-bg");
  if (!glow || !grid) return;

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        glow.style.transform = `translateY(${y * 0.28}px)`;
        grid.style.transform = `translateY(${y * 0.14}px)`;
        ticking = false;
      });
      ticking = true;
    },
    { passive: true }
  );
})();

// ─────────────────────────────────────────────────────────────
// 9. TYPED EFFECT – HERO SUBTITLE
// ─────────────────────────────────────────────────────────────
(function initTyped() {
  const el = document.getElementById("typed-subtitle");
  if (!el) return;

  const texts = [
		"Mastergrad · Finans & Regnskap · Bedriftsfinans og skatt",
		"ACCA (BT,FA,MA,LW,TX,FR,PM,FM,AA) · ISO/IEC 27001 Lead Auditor",
		"Tableau · Power BI · Excel · Python · SQL · NumPy · Pandas",
		"N8N · DOCKER · Fast API · VSC · Visma E+ · Kapital Kontroll 2",
	];
  let ti = 0,
    ci = 0,
    deleting = false,
    paused = false;

  el.textContent = "";

  function type() {
    if (paused) return;
    const current = texts[ti];

    if (deleting) {
      ci--;
      el.textContent = current.slice(0, ci);
      if (ci === 0) {
        deleting = false;
        ti = (ti + 1) % texts.length;
        setTimeout(type, 450);
        return;
      }
    } else {
      ci++;
      el.textContent = current.slice(0, ci);
      if (ci === current.length) {
        paused = true;
        setTimeout(() => {
          paused = false;
          deleting = true;
          type();
        }, 3000);
        return;
      }
    }

    setTimeout(type, deleting ? 22 : 40);
  }

  setTimeout(type, 900);
})();

// ─────────────────────────────────────────────────────────────
// 10. PARTICLE NETWORK CANVAS (gold palette)
// ─────────────────────────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById("hero-particles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // Gold / cream palette
  const COLORS = [
    "rgba(212,175,55,",  // gold bright
    "rgba(201,168,106,", // gold
    "rgba(216,207,185,", // cream-soft
  ];
  const COUNT = 72;
  const MAX_DIST = 150;
  let W = 0,
    H = 0;

  const particles = [];
  let mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  canvas.addEventListener(
    "mousemove",
    (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    },
    { passive: true }
  );
  canvas.addEventListener(
    "mouseleave",
    () => {
      mouse.x = -9999;
      mouse.y = -9999;
    },
    { passive: true }
  );

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Gentle repulsion from cursor
      const dxm = p.x - mouse.x;
      const dym = p.y - mouse.y;
      const dm = Math.sqrt(dxm * dxm + dym * dym);
      if (dm < 100) {
        p.x += (dxm / dm) * 0.8;
        p.y += (dym / dm) * 0.8;
      }
    });

    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > MAX_DIST) continue;

        const alpha = (1 - dist / MAX_DIST) * 0.28;
        ctx.strokeStyle = `${a.color}${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    // Dots
    particles.forEach((p) => {
      ctx.fillStyle = `${p.color}0.8)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
})();

// ─────────────────────────────────────────────────────────────
// 11. CARD 3D TILT
// ─────────────────────────────────────────────────────────────
(function initTilt() {
  const INTENSITY = 6;
  const isCoarse =
    window.matchMedia &&
    window.matchMedia("(pointer: coarse)").matches;
  if (isCoarse) return;

  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotX = -dy * INTENSITY;
      const rotY = dx * INTENSITY;

      this.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.015)`;
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform =
        "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
    });
  });
})();

// ─────────────────────────────────────────────────────────────
// 12. SKILL TAG RIPPLE (click effect)
// ─────────────────────────────────────────────────────────────
(function initTagRipple() {
  const style = document.createElement("style");
  style.textContent =
    "@keyframes ripple { to { transform:scale(2.5); opacity:0; } }";
  document.head.appendChild(style);

  document.querySelectorAll(".skill-tag").forEach((tag) => {
    tag.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const ripple = document.createElement("span");

      ripple.style.cssText = `
        position:absolute; border-radius:50%; pointer-events:none;
        width:${size}px; height:${size}px;
        top:${y}px; left:${x}px;
        background:rgba(212,175,55,0.28);
        transform:scale(0);
        animation:ripple 0.55s ease-out forwards;
      `;
      this.style.position = "relative";
      this.style.overflow = "hidden";
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 560);
    });
  });
})();

// ─────────────────────────────────────────────────────────────
// 13. FOOTER NAME – PARALLAX
// ─────────────────────────────────────────────────────────────
(function initFooterParallax() {
  const el = document.getElementById("footer-name");
  if (!el) return;

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const ratio = (vh - rect.top) / (vh + rect.height);
        const shift = (ratio - 0.5) * 60;
        el.style.transform = `translateX(${shift}px)`;
        ticking = false;
      });
      ticking = true;
    },
    { passive: true }
  );
})();

// ─────────────────────────────────────────────────────────────
// 14. HERO TICKER – live data feed
// ─────────────────────────────────────────────────────────────
(function initHeroTicker() {
  const track = document.getElementById("hero-ticker-track");
  if (!track) return;

  const items = [
		{
			icon: "fas fa-chart-line",
			text: "Bedriftsfinans og skatt",
			strong: "ACCA (BT,FA,MA,LW,TX,FR,PM,FM,AA)",
		},
		{
			icon: "fas fa-shield-halved",
			text: "Informasjonssikkerhet",
			strong: "ISO 27001 Lead Auditor",
		},
		{
			icon: "fas fa-chart-pie",
			text: "Analyseverktøy",
			strong: "NumPy · Pandas · Power BI · Excel · Tableau",
		},

		{
			icon: "fas fa-calculator",
			text: "Automatisasjon",
			strong: "N8N · DOCKER · Fast API · VSC · Zapier",
		},
		{
			icon: "fas fa-graduation-cap",
			text: "Master",
			strong: "Finans & Regnskap · 2026",
		},
		{ icon: "fas fa-globe", text: "Språk", strong: "NO · PL · EN" },
	];

  const buildItem = (it) =>
    `<span class="ticker-item"><i class="${it.icon}"></i>${it.text} · <strong>${it.strong}</strong></span><span class="ticker-sep"></span>`;

  // Duplicate for seamless loop
  const html = items.map(buildItem).join("");
  track.innerHTML = html + html;
})();

// ─────────────────────────────────────────────────────────────
// 15. MAGNETIC BUTTONS
// ─────────────────────────────────────────────────────────────
(function initMagneticButtons() {
  const isCoarse =
    window.matchMedia &&
    window.matchMedia("(pointer: coarse)").matches;
  if (isCoarse) return;

  const STRENGTH = 0.28;
  document.querySelectorAll(".btn--primary, .btn--outline, .nav-cv-btn").forEach((btn) => {
    btn.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * STRENGTH;
      const dy = (e.clientY - cy) * STRENGTH;
      this.style.transform = `translate(${dx}px, ${dy - 2}px)`;
    });
    btn.addEventListener("mouseleave", function () {
      this.style.transform = "";
    });
  });
})();

// ─────────────────────────────────────────────────────────────
// 16. TIMELINE ENTRY PROGRESSIVE REVEAL (edu)
// ─────────────────────────────────────────────────────────────
(function initTimelineReveal() {
  const entries = document.querySelectorAll(".timeline-entry");
  if (!entries.length) return;

  const observer = new IntersectionObserver(
    (items) => {
      items.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );

  entries.forEach((e) => observer.observe(e));
})();

// ─────────────────────────────────────────────────────────────
// 17. EDU BANNER MOUSE TILT (subtle)
// ─────────────────────────────────────────────────────────────
(function initEduBannerTilt() {
  const banner = document.querySelector(".edu-banner");
  if (!banner) return;
  const isCoarse =
    window.matchMedia &&
    window.matchMedia("(pointer: coarse)").matches;
  if (isCoarse) return;

  const yearL = banner.querySelector(".edu-banner-year--left");
  const yearR = banner.querySelector(".edu-banner-year--right");
  const slash = banner.querySelector(".edu-banner-slash");

  banner.addEventListener("mousemove", (e) => {
    const rect = banner.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    if (yearL) yearL.style.transform = `translateY(${-14 + dy * 8}px) translateX(${dx * -10}px)`;
    if (yearR) yearR.style.transform = `translateY(${14 + dy * 8}px) translateX(${dx * 10}px)`;
    if (slash) slash.style.transform = `translate(${dx * 6}px, ${dy * 6}px)`;
  });

  banner.addEventListener("mouseleave", () => {
    if (yearL) yearL.style.transform = "translateY(-14px)";
    if (yearR) yearR.style.transform = "translateY(14px)";
    if (slash) slash.style.transform = "";
  });
})();

// ─────────────────────────────────────────────────────────────
// 18. SECTION-TITLE WORD-SPLIT REVEAL (optional enhancement)
// ─────────────────────────────────────────────────────────────
(function initTitleReveal() {
  const titles = document.querySelectorAll(".section-title");
  if (!titles.length) return;

  titles.forEach((title) => {
    // Only wrap once
    if (title.dataset.split) return;
    const text = title.textContent;
    title.textContent = "";
    const words = text.split(" ");
    words.forEach((w, idx) => {
      const span = document.createElement("span");
      span.className = "title-word";
      span.textContent = w;
      span.style.display = "inline-block";
      span.style.transitionDelay = idx * 50 + "ms";
      title.appendChild(span);
      if (idx < words.length - 1) title.appendChild(document.createTextNode(" "));
    });
    title.dataset.split = "1";
  });
})();

// ─────────────────────────────────────────────────────────────
// 19. CERTIFICATE PDF MODAL
// ─────────────────────────────────────────────────────────────
(function initCertModal() {
  const modal = document.getElementById("cert-modal");
  if (!modal) return;
  const titleEl = document.getElementById("cert-modal-title");
  const frameEl = document.getElementById("cert-modal-frame");
  const downloadEl = document.getElementById("cert-modal-download");
  const closers = modal.querySelectorAll("[data-cert-close]");

  function open(pdf, title) {
    if (!pdf) return;
    titleEl.textContent = title || "Sertifikat";
    frameEl.src = `${pdf}#toolbar=1&navpanes=0&view=FitH`;
    downloadEl.href = pdf;
    downloadEl.setAttribute("download", "");
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("cert-modal-open");
  }

  function close() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    frameEl.src = "about:blank";
    document.body.classList.remove("cert-modal-open");
  }

  document.querySelectorAll(".cert-card[data-pdf]").forEach((card) => {
    const pdf = card.getAttribute("data-pdf");
    if (!pdf) return;
    card.addEventListener("click", () => {
      open(pdf, card.getAttribute("data-cert-title") || card.querySelector(".cert-title")?.textContent);
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(pdf, card.getAttribute("data-cert-title") || card.querySelector(".cert-title")?.textContent);
      }
    });
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
  });

  document.querySelectorAll("a[data-download-files]").forEach((link) => {
    const files = link
      .getAttribute("data-download-files")
      .split(",")
      .map((file) => file.trim())
      .filter(Boolean);

    if (!files.length) return;

    link.addEventListener("click", (e) => {
      e.preventDefault();
      files.forEach((file, index) => {
        setTimeout(() => {
          const downloadLink = document.createElement("a");
          downloadLink.href = file;
          downloadLink.download = file.split("/").pop();
          document.body.appendChild(downloadLink);
          downloadLink.click();
          downloadLink.remove();
        }, index * 120);
      });
    });
  });

  document.querySelectorAll("a[data-pdf]").forEach((link) => {
    const pdf = link.getAttribute("data-pdf") || link.getAttribute("href");
    if (!pdf) return;
    link.addEventListener("click", (e) => {
      e.preventDefault();
      open(pdf, link.getAttribute("data-cert-title") || link.textContent.trim());
    });
  });

  closers.forEach((el) => el.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) close();
  });
})();

// ─────────────────────────────────────────────────────────────
// 20. GITHUB PROJECT CARDS
// ─────────────────────────────────────────────────────────────
(function initGithubProjects() {
  const grid = document.getElementById("gh-grid");
  if (!grid) return;

  const REPOS = [
    {
      slug: "RobertCygan/crypto_ticker",
      desc: "Sanntids kryptovaluta-ticker for Windows. Henter prisdata fra børs-API og viser kontinuerlig oppdaterte kurser i et alltid-synlig overlay. Designet for tradere som trenger rask prisoversikt uten å forlate arbeidsskjermen.",
    },
    {
      slug: "RobertCygan/ofi_bybit",
      desc: "Order-flow imbalance-indikator for Bybit-børsen. Analyserer fullførte ordrer og beregner kjøps-/salgstrykk i sanntid – informasjon som typisk vises 2–3 sekunder før kursutslag på TradingView.",
    },
    {
      slug: "RobertCygan/Buy_Sell_Bybit_Scanner",
      desc: "Markedsscanner for Bybit som overvåker kjøps- og salgssignaler på tvers av kryptovalutapar. Varsler automatisk ved statistiske avvik i ordreboken og gir tradere et operativt forsprang.",
    },
  ];

  const LANG_COLORS = {
    Python: "#3572A5", JavaScript: "#f1e05a", TypeScript: "#3178c6",
    "Jupyter Notebook": "#DA5B0B", Shell: "#89e051",
  };

  function buildCard(repo, data) {
    const name = data ? data.name : repo.slug.split("/")[1];
    const desc = repo.desc;
    const lang = (data && data.language) ? data.language : "Python";
    const stars = data ? data.stargazers_count : 0;
    const forks = data ? data.forks_count : 0;
    const url = data ? data.html_url : `https://github.com/${repo.slug}`;
    const langColor = LANG_COLORS[lang] || "#C9A86A";

    const card = document.createElement("div");
    card.className = "gh-card tilt-card reveal";
    card.innerHTML = `
      <div class="gh-card-header">
        <i class="fab fa-github gh-card-icon"></i>
        <span class="gh-card-lang" style="background:${langColor};color:${lang === 'JavaScript' ? '#111' : '#fff'}">${lang}</span>
      </div>
      <h3 class="gh-card-name">${name}</h3>
      <p class="gh-card-desc">${desc}</p>
      <div class="gh-card-meta">
        <span><i class="fas fa-star"></i> ${stars}</span>
        <span><i class="fas fa-code-fork"></i> ${forks}</span>
      </div>
      <a href="${url}" target="_blank" rel="noopener" class="gh-card-link">
        <i class="fas fa-arrow-up-right-from-square"></i> Åpne på GitHub
      </a>`;

    card.addEventListener("click", (e) => {
      if (!e.target.closest(".gh-card-link")) {
        window.open(url, "_blank", "noopener");
      }
    });

    return card;
  }

  REPOS.forEach((repo) => {
    const placeholder = document.createElement("div");
    placeholder.className = "gh-card gh-card--loading";
    placeholder.innerHTML = `
      <div class="gh-card-header">
        <i class="fab fa-github gh-card-icon"></i>
      </div>
      <h3 class="gh-card-name">${repo.slug.split("/")[1]}</h3>
      <p class="gh-card-desc"> </p>`;
    grid.appendChild(placeholder);
  });

  REPOS.forEach((repo, idx) => {
    fetch(`https://api.github.com/repos/${repo.slug}`)
      .then((r) => r.ok ? r.json() : null)
      .catch(() => null)
      .then((data) => {
        const card = buildCard(repo, data);
        const skeleton = grid.children[idx];
        if (skeleton) grid.replaceChild(card, skeleton);
        else grid.appendChild(card);

        const isCoarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
        if (!isCoarse) {
          const INTENSITY = 6;
          card.addEventListener("mousemove", function (e) {
            const rect = this.getBoundingClientRect();
            const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
            const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
            this.style.transform = `perspective(800px) rotateX(${-dy * INTENSITY}deg) rotateY(${dx * INTENSITY}deg) scale(1.015)`;
          });
          card.addEventListener("mouseleave", function () {
            this.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
          });
        }

        requestAnimationFrame(() => {
          card.classList.add("visible");
          card.classList.add("in-view");
        });
      });
  });
})();

// ─────────────────────────────────────────────────────────────
// 20. APP TILES — demo expand modal
// ─────────────────────────────────────────────────────────────
(function initAppTiles() {
  const modal = document.getElementById("demo-modal");
  const iframe = document.getElementById("demo-modal-iframe");
  const titleEl = document.getElementById("demo-modal-title");
  if (!modal || !iframe) return;

  function openDemo(src, title) {
    titleEl.textContent = title || "Demo";
    iframe.src = src;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeDemo() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    iframe.src = "about:blank";
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".app-tile-media").forEach((media) => {
    const tile = media.closest(".app-tile");
    if (!tile) return;
    const handler = (e) => {
      e.preventDefault();
      const src = tile.dataset.demo;
      const title = tile.dataset.demoTitle || "Demo";
      if (src) openDemo(src, title);
    };
    media.addEventListener("click", handler);
    media.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") handler(e);
    });
  });

  modal.querySelectorAll("[data-demo-close]").forEach((el) => {
    el.addEventListener("click", closeDemo);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeDemo();
  });
})();

// ─────────────────────────────────────────────────────────────
// 20b. DOWNLOAD PASSWORD GATE (samme logikk som Steigen)
// ─────────────────────────────────────────────────────────────
(function initDownloadGate() {
  const EXPECTED = "$teigen2026";
  const SESSION_KEY = "eskatt-download-auth";

  const trigger = document.getElementById("dl-eiendomsskatt");
  const modal = document.getElementById("gate-modal");
  if (!trigger || !modal) return;

  const form = document.getElementById("gate-form");
  const input = document.getElementById("gate-pw");
  const error = document.getElementById("gate-error");
  const toggle = document.getElementById("gate-toggle");
  const frame = modal.querySelector(".gate-modal-frame");

  function startDownload() {
    const a = document.createElement("a");
    a.href = trigger.getAttribute("href");
    a.download = trigger.getAttribute("download") || "";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function openGate() {
    error.classList.remove("show");
    input.value = "";
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => input.focus(), 50);
  }
  function closeGate() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  trigger.addEventListener("click", (e) => {
    if (sessionStorage.getItem(SESSION_KEY) === "ok") return;
    e.preventDefault();
    openGate();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value === EXPECTED) {
      sessionStorage.setItem(SESSION_KEY, "ok");
      closeGate();
      startDownload();
    } else {
      error.classList.add("show");
      input.value = "";
      input.focus();
      frame.classList.remove("gate-shake");
      void frame.offsetWidth;
      frame.classList.add("gate-shake");
    }
  });

  toggle.addEventListener("click", () => {
    const isPw = input.type === "password";
    input.type = isPw ? "text" : "password";
    toggle.innerHTML = isPw ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    toggle.setAttribute("aria-label", isPw ? "Skjul passord" : "Vis passord");
  });

  modal.querySelectorAll("[data-gate-close]").forEach((el) => {
    el.addEventListener("click", closeGate);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeGate();
  });
})();

// ─────────────────────────────────────────────────────────────
// 21. QR MODAL — iOS / Android codes for downloadable apps
// ─────────────────────────────────────────────────────────────
(function initQrModal() {
  const modal = document.getElementById("qr-modal");
  const img = document.getElementById("qr-modal-img");
  const titleEl = document.getElementById("qr-modal-title");
  const urlEl = document.getElementById("qr-modal-url");
  const hintEl = document.getElementById("qr-modal-hint");
  if (!modal || !img) return;

  const QR_TARGETS = {
    ios: {
      url: window.location.origin + window.location.pathname + "#prosjekter",
      hint: "Skann med iPhone-kameraet — apent prosjektkort på robertcygan.no. iOS-build kommer snart.",
      label: "iOS"
    },
    android: {
      url: window.location.origin + window.location.pathname + "#prosjekter",
      hint: "Skann med Android-kameraet — apent prosjektkort på robertcygan.no. APK kommer snart.",
      label: "Android"
    }
  };

  function buildQrUrl(target) {
    const encoded = encodeURIComponent(target);
    return `https://api.qrserver.com/v1/create-qr-code/?size=560x560&margin=8&color=0A0A0A&bgcolor=FFFFFF&data=${encoded}`;
  }

  function openQr(kind) {
    const cfg = QR_TARGETS[kind];
    if (!cfg) return;
    titleEl.textContent = `${cfg.label} · QR`;
    img.src = buildQrUrl(cfg.url);
    img.alt = `QR-kode for ${cfg.label}`;
    urlEl.textContent = cfg.url;
    hintEl.textContent = cfg.hint;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeQr() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-qr]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openQr(btn.dataset.qr);
    });
  });
  modal.querySelectorAll("[data-qr-close]").forEach((el) => {
    el.addEventListener("click", closeQr);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeQr();
  });
})();

// ─────────────────────────────────────────────────────────────
// CONSOLE SIGNATURE
// ─────────────────────────────────────────────────────────────
console.log(
  "%c  Robert Cygan · Dossier 2026  ",
  "background:#0A0A0A;color:#D4AF37;font-family:Georgia,serif;font-size:14px;" +
    "padding:10px 24px;border-left:3px solid #D4AF37;letter-spacing:.14em;font-style:italic;"
);
console.log(
  "%cFinans · Regnskap · Dataanalyse · ACCA · ISO/IEC 27001",
  "color:#C9A86A;font-family:monospace;font-size:11px;letter-spacing:.2em;padding:4px 24px;"
);
