/* =====================================================
   PREMIUM 3D INTERACTIVE PORTFOLIO — COMPLETE SCRIPT
   Laharika Relangi — Aspiring Full Stack Developer
   ===================================================== */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFine       = window.matchMedia("(pointer: fine)").matches;
  const isMobile     = window.innerWidth < 768;

  /* ================================================
     1. PAGE LOADER
  ================================================ */
  const loader       = document.getElementById("pageLoader");
  const loaderFill   = document.getElementById("loaderBarFill");
  let   loadProgress = 0;

  function runLoader() {
    if (!loader) return;
    const interval = setInterval(() => {
      loadProgress += Math.random() * 20 + 10;
      if (loadProgress >= 100) {
        loadProgress = 100;
        clearInterval(interval);
        if (loaderFill) loaderFill.style.width = "100%";
        setTimeout(() => {
          loader.classList.add("hidden");
          document.body.style.overflow = "";
          initReveal();
        }, 400);
      } else {
        if (loaderFill) loaderFill.style.width = loadProgress + "%";
      }
    }, 50);
  }
  document.body.style.overflow = "hidden";
  runLoader();

  /* ================================================
     2. CUSTOM CURSOR
  ================================================ */
  const dot  = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  const glow = document.getElementById("cursorGlow");

  let mx = -200, my = -200;
  let rx = -200, ry = -200;

  if (dot && ring && isFine && !reduceMotion) {
    document.addEventListener("mousemove", e => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top  = my + "px";
      if (glow) {
        glow.style.left = mx + "px";
        glow.style.top  = my + "px";
      }
    }, { passive: true });

    (function animateRing() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.left = rx + "px";
      ring.style.top  = ry + "px";
      requestAnimationFrame(animateRing);
    })();

    // Hover elements
    const hoverEls = document.querySelectorAll(
      "a, button, .cert-card, .project-card, .skill-chip, .contact-card, .edu-card, .timeline-item, .stat-card, .tl-img-thumb, .hero-social-btn"
    );
    hoverEls.forEach(el => {
      el.addEventListener("mouseenter", () => {
        dot.classList.add("hover");
        ring.classList.add("hover");
      });
      el.addEventListener("mouseleave", () => {
        dot.classList.remove("hover");
        ring.classList.remove("hover");
      });
    });

    document.addEventListener("mousedown", () => dot.classList.add("click"));
    document.addEventListener("mouseup",   () => dot.classList.remove("click"));
  }

  /* ================================================
     3. SCROLL PROGRESS BAR
  ================================================ */
  const progressBar = document.getElementById("scrollProgress");
  function updateProgress() {
    if (!progressBar) return;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const prog = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    progressBar.style.width = prog + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });

  /* ================================================
     4. HEADER SCROLL BEHAVIOUR
  ================================================ */
  const header = document.getElementById("siteHeader");
  function onHeaderScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onHeaderScroll, { passive: true });
  onHeaderScroll();

  /* ================================================
     5. MOBILE NAV TOGGLE
  ================================================ */
  const navToggle = document.getElementById("navToggle");
  const mainNav   = document.getElementById("mainNav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const open = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });

    mainNav.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", e => {
        if (a.hash) {
          e.preventDefault();
          const target = document.querySelector(a.hash);
          if (target) {
            window.scrollTo({
              top: target.offsetTop - 75,
              behavior: "smooth"
            });
          }
        }
        mainNav.classList.remove("open");
        document.body.style.overflow = "";
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", e => {
      if (mainNav.classList.contains("open") &&
          !mainNav.contains(e.target) &&
          !navToggle.contains(e.target)) {
        mainNav.classList.remove("open");
        document.body.style.overflow = "";
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ================================================
     6. ACTIVE NAV INDICATOR
  ================================================ */
  const sections = document.querySelectorAll("section[id], main section[id]");
  const navLinks = document.querySelectorAll(".nav-link[data-section]");

  function updateActiveNav() {
    let current = "";
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 150) {
        current = sec.id;
      }
    });
    navLinks.forEach(l => {
      l.classList.toggle("active", l.dataset.section === current);
    });
  }
  window.addEventListener("scroll", updateActiveNav, { passive: true });

  /* ================================================
     7. THEME TOGGLE CONTROLLER
  ================================================ */
  const themeToggle = document.getElementById("themeToggle");

  function getActiveTheme() {
    return document.documentElement.getAttribute("data-theme") || "dark";
  }

  function updateThemeUI(theme) {
    if (!themeToggle) return;
    const isLight = theme === "light";
    const nextLabel = isLight ? "Switch to Dark Mode" : "Switch to Light Mode";
    themeToggle.setAttribute("aria-label", nextLabel);
    themeToggle.setAttribute("title", nextLabel);
  }

  function setTheme(theme, animate = true) {
    if (animate) {
      document.documentElement.classList.add("theme-transitioning");
    }
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("laharika_theme", theme);
    } catch (e) {}

    updateThemeUI(theme);

    if (animate) {
      setTimeout(() => {
        document.documentElement.classList.remove("theme-transitioning");
      }, 400);
    }
  }

  if (themeToggle) {
    const initialTheme = getActiveTheme();
    updateThemeUI(initialTheme);

    themeToggle.addEventListener("click", (e) => {
      e.preventDefault();
      const current = getActiveTheme();
      const next = current === "light" ? "dark" : "light";
      setTheme(next, true);
    });
  }

  /* ================================================
     8. HERO CANVAS PARTICLES
  ================================================ */
  const canvas = document.getElementById("heroCanvas");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let W, H, particles = [];

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const COUNT = isMobile ? 35 : 75;
    const COLORS_DARK  = ["rgba(108,92,231,", "rgba(0,206,201,", "rgba(253,203,110,", "rgba(255,255,255,"];
    const COLORS_LIGHT = ["rgba(81,66,230,",  "rgba(0,180,176,", "rgba(212,136,6,",  "rgba(22,24,40,"];

    for (let i = 0; i < COUNT; i++) {
      const colorIndex = Math.floor(Math.random() * 4);
      particles.push({
        x: Math.random() * 1200,
        y: Math.random() * 800,
        r: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.5 + 0.15,
        colorIndex: colorIndex
      });
    }

    let heroMouseX = 0.5, heroMouseY = 0.5;
    canvas.addEventListener("mousemove", e => {
      const r = canvas.getBoundingClientRect();
      heroMouseX = (e.clientX - r.left) / r.width;
      heroMouseY = (e.clientY - r.top)  / r.height;
    }, { passive: true });

    function drawCanvas() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      const currentColors = isLight ? COLORS_LIGHT : COLORS_DARK;
      const lineColor = isLight ? "rgba(81,66,230," : "rgba(108,92,231,";

      particles.forEach(p => {
        const dx = heroMouseX * W - p.x;
        const dy = heroMouseY * H - p.y;
        p.vx += dx * 0.00003;
        p.vy += dy * 0.00003;
        p.vx *= 0.99;
        p.vy *= 0.99;

        p.x = (p.x + p.vx + W) % W;
        p.y = (p.y + p.vy + H) % H;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = currentColors[p.colorIndex] + p.alpha + ")";
        ctx.fill();
      });

      // Draw connective lines
      if (!isMobile) {
        ctx.lineWidth = 0.45;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 110) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = lineColor + ((1 - dist / 110) * 0.1) + ")";
              ctx.stroke();
            }
          }
        }
      }
      requestAnimationFrame(drawCanvas);
    }
    drawCanvas();
  }

  /* ================================================
     9. HERO SCROLL NARRATIVE
  ================================================ */
  const heroSection  = document.querySelector(".hero");
  const scenes       = Array.from(document.querySelectorAll(".scene"));
  const heroPortrait = document.getElementById("heroPortrait");
  const scrollCue    = document.getElementById("scrollCue");
  const orbs         = document.querySelectorAll(".orb");

  let heroTicking = false;

  function updateHero() {
    heroTicking = false;
    if (!heroSection) return;

    const rect       = heroSection.getBoundingClientRect();
    const scrollable = heroSection.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;

    const progress  = Math.max(0, Math.min(1, -rect.top / scrollable));
    const n         = scenes.length;
    const activeIdx = Math.min(n - 1, Math.floor(progress * n));

    scenes.forEach((scene, i) => {
      scene.classList.toggle("active", i === activeIdx);
    });

    if (heroPortrait) {
      const t = Math.min(1, progress * 2.5) * (1 - Math.max(0, progress - 0.75) * 4);
      heroPortrait.style.opacity = Math.max(0, Math.min(0.65, t)).toFixed(2);
    }

    if (scrollCue) {
      scrollCue.style.opacity = progress > 0.05 ? "0" : "1";
    }

    // Parallax on ambient orbs
    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 20;
      orb.style.transform = `translateY(${progress * factor}px)`;
    });

    const sticky = heroSection.querySelector(".hero-sticky");
    if (sticky) {
      const fadeStart = 0.92;
      sticky.style.opacity = progress > fadeStart
        ? (1 - (progress - fadeStart) / (1 - fadeStart)).toFixed(2)
        : "1";
    }
  }

  function scheduleHeroUpdate() {
    if (!heroTicking) {
      heroTicking = true;
      requestAnimationFrame(updateHero);
    }
  }
  window.addEventListener("scroll", scheduleHeroUpdate, { passive: true });
  window.addEventListener("resize", scheduleHeroUpdate, { passive: true });

  // Mouse parallax on hero portrait
  if (!reduceMotion && !isMobile) {
    document.addEventListener("mousemove", e => {
      const px = (e.clientX / window.innerWidth  - 0.5) * 24;
      const py = (e.clientY / window.innerHeight - 0.5) * 24;
      if (heroPortrait) {
        heroPortrait.style.transform = `translate(calc(-50% + ${px * 0.5}px), calc(-50% + ${py * 0.5}px))`;
      }
    }, { passive: true });
  }

  /* ================================================
     10. SCROLL REVEAL (IntersectionObserver)
  ================================================ */
  function initReveal() {
    const revealEls = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      revealEls.forEach(el => el.classList.add("in-view"));
      return;
    }

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add("in-view");
        io.unobserve(el);

        // Trigger counters
        el.querySelectorAll(".stat-num[data-count]").forEach(n => {
          if (!reduceMotion) animateCount(n);
        });
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -5% 0px" });

    // Stagger items
    const staggerContainers = document.querySelectorAll(
      ".skill-groups, .project-grid, .cert-gallery, .edu-list, .about-stats, .contact-cards, .timeline"
    );
    staggerContainers.forEach(container => {
      container.querySelectorAll(".reveal").forEach((child, i) => {
        if (!reduceMotion) child.style.transitionDelay = (i * 0.08) + "s";
      });
    });

    revealEls.forEach(el => io.observe(el));
  }

  /* ================================================
     11. ANIMATED COUNTERS
  ================================================ */
  function animateCount(el) {
    const target   = parseFloat(el.dataset.count);
    const isFloat  = el.dataset.decimal || (target % 1 !== 0);
    const decimals = parseInt(el.dataset.decimal || 0);
    const duration = 1800;
    let start = null;

    function step(ts) {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      const val  = ease * target;
      el.textContent = isFloat ? val.toFixed(decimals || 1) : Math.floor(val);
      if (prog < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = isFloat ? target.toFixed(decimals || 1) : target;
      }
    }
    requestAnimationFrame(step);
  }

  /* ================================================
     12. 3D CARD TILT
  ================================================ */
  function initTilt() {
    if (reduceMotion || !isFine) return;

    const tiltEls = document.querySelectorAll(
      ".project-card, .cert-card, .skill-group-card, .stat-card, .edu-card, .contact-card, .achievement-card, .tl-img-thumb"
    );

    tiltEls.forEach(el => {
      el.addEventListener("mousemove", e => {
        const rect  = el.getBoundingClientRect();
        const x     = e.clientX - rect.left;
        const y     = e.clientY - rect.top;
        const cx    = rect.width  / 2;
        const cy    = rect.height / 2;
        const rotX  = ((y - cy) / cy) * -5;
        const rotY  = ((x - cx) / cx) *  5;
        el.style.transform =
          `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale(1.01)`;
        el.style.transition = "transform 0.12s ease, box-shadow 0.12s ease";

        const gPercX = (x / rect.width)  * 100;
        const gPercY = (y / rect.height) * 100;
        el.style.background = `radial-gradient(circle at ${gPercX}% ${gPercY}%, rgba(108,92,231,0.08), transparent 65%), var(--glass-2)`;
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform  = "";
        el.style.transition = "transform 0.5s var(--ease), box-shadow 0.5s var(--ease), border-color 0.5s var(--ease), background 0.5s var(--ease)";
        el.style.background = "";
      });
    });
  }
  initTilt();

  /* ================================================
     13. MAGNETIC BUTTONS
  ================================================ */
  function initMagnetic() {
    if (reduceMotion || !isFine || isMobile) return;

    document.querySelectorAll(".magnetic").forEach(el => {
      el.addEventListener("mousemove", e => {
        const rect = el.getBoundingClientRect();
        const dx   = e.clientX - (rect.left + rect.width  / 2);
        const dy   = e.clientY - (rect.top  + rect.height / 2);
        el.style.transform  = `translate(${dx * 0.2}px, ${dy * 0.2}px)`;
        el.style.transition = "transform 0.2s ease";
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform  = "";
        el.style.transition = "transform 0.4s var(--ease)";
      });
    });
  }
  initMagnetic();

  /* ================================================
     14. CERTIFICATION LIGHTBOX & PDF.JS VIEWER (3D ANIMATIONS)
  ================================================ */
  if (typeof pdfjsLib !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }

  const certLightbox        = document.getElementById("certLightbox");
  const certBackdrop        = document.getElementById("certBackdrop");
  const certPanel           = document.getElementById("certPanel");
  const certClose           = document.getElementById("certClose");
  const certLbOrg           = document.getElementById("certLbOrg");
  const certLbName          = document.getElementById("certLbName");
  const certLbDate          = document.getElementById("certLbDate");

  const certZoomGroup       = document.getElementById("certZoomGroup");
  const certZoomIn          = document.getElementById("certZoomIn");
  const certZoomOut         = document.getElementById("certZoomOut");
  const certZoomReset       = document.getElementById("certZoomReset");
  const certZoomLevel       = document.getElementById("certZoomLevel");

  const certPageGroup       = document.getElementById("certPageGroup");
  const certPrevPage        = document.getElementById("certPrevPage");
  const certNextPage        = document.getElementById("certNextPage");
  const certPageInfo        = document.getElementById("certPageInfo");

  const certOpenNewTab      = document.getElementById("certOpenNewTab");
  const certDownload        = document.getElementById("certDownload");
  const certFooterOpenBtn   = document.getElementById("certFooterOpenBtn");
  const certFooterOpenText  = document.getElementById("certFooterOpenText");

  const certLoader          = document.getElementById("certLoader");
  const certErrorState      = document.getElementById("certErrorState");
  const certErrorOpenBtn    = document.getElementById("certErrorOpenBtn");
  const certErrorDownloadBtn= document.getElementById("certErrorDownloadBtn");

  const certPdfViewport     = document.getElementById("certPdfViewport");
  const certPdfCanvas       = document.getElementById("certPdfCanvas");
  const certImgViewport     = document.getElementById("certImgViewport");
  const certLbImg           = document.getElementById("certLbImg");

  // Lightbox State
  let currentDocSrc   = "";
  let currentDocType  = "pdf"; // "pdf" | "image"
  let currentZoom     = 1.0;
  let currentPdfDoc   = null;
  let currentPageNum  = 1;
  let totalPdfPages   = 1;
  let pdfRenderTask   = null;
  let isClosing       = false;

  function showCertLoader(show) {
    if (certLoader) {
      if (show) certLoader.classList.remove("hidden");
      else certLoader.classList.add("hidden");
    }
  }

  function showCertError(show, src) {
    if (certErrorState) {
      certErrorState.style.display = show ? "flex" : "none";
      if (show && src) {
        if (certErrorOpenBtn) certErrorOpenBtn.href = src;
        if (certErrorDownloadBtn) {
          certErrorDownloadBtn.href = src;
          certErrorDownloadBtn.setAttribute("download", src.split("/").pop());
        }
      }
    }
  }

  function updateZoomUI() {
    if (certZoomLevel) {
      certZoomLevel.textContent = Math.round(currentZoom * 100) + "%";
    }
    if (certZoomOut) certZoomOut.disabled = currentZoom <= 0.5;
    if (certZoomIn)  certZoomIn.disabled  = currentZoom >= 3.0;
  }

  function applyZoom() {
    updateZoomUI();
    if (currentDocType === "image" && certLbImg) {
      certLbImg.style.transform = `scale(${currentZoom})`;
    } else if (currentDocType === "pdf" && currentPdfDoc) {
      renderPdfPage(currentPageNum);
    }
  }

  function updatePageUI() {
    if (certPageInfo) {
      certPageInfo.textContent = `${currentPageNum} / ${totalPdfPages}`;
    }
    if (certPrevPage) certPrevPage.disabled = currentPageNum <= 1;
    if (certNextPage) certNextPage.disabled = currentPageNum >= totalPdfPages;
  }

  function renderPdfPage(num) {
    if (!currentPdfDoc || !certPdfCanvas) return;

    if (pdfRenderTask) {
      pdfRenderTask.cancel();
      pdfRenderTask = null;
    }

    showCertLoader(true);

    currentPdfDoc.getPage(num).then(page => {
      const unscaledViewport = page.getViewport({ scale: 1 });
      const containerWidth   = certPdfViewport ? (certPdfViewport.clientWidth || 800) : 800;
      const targetWidth      = Math.max(280, Math.min(containerWidth - 24, 940));
      const baseScale        = targetWidth / unscaledViewport.width;
      const finalScale       = baseScale * currentZoom * (window.devicePixelRatio || 1);

      const viewport = page.getViewport({ scale: finalScale });
      certPdfCanvas.width  = viewport.width;
      certPdfCanvas.height = viewport.height;
      certPdfCanvas.style.width  = `${viewport.width / (window.devicePixelRatio || 1)}px`;
      certPdfCanvas.style.height = `${viewport.height / (window.devicePixelRatio || 1)}px`;

      const ctx = certPdfCanvas.getContext("2d");
      ctx.clearRect(0, 0, certPdfCanvas.width, certPdfCanvas.height);

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };

      pdfRenderTask = page.render(renderContext);
      pdfRenderTask.promise.then(() => {
        pdfRenderTask = null;
        showCertLoader(false);
      }).catch(err => {
        if (err && err.name !== "RenderingCancelledException") {
          console.warn("PDF render warning:", err);
          showCertLoader(false);
        }
      });
    }).catch(err => {
      console.error("Error loading PDF page:", err);
      showCertLoader(false);
      showCertError(true, currentDocSrc);
    });
  }

  function openCertViewer(src, org, name, date) {
    if (!certLightbox || !src) return;

    isClosing = false;
    currentDocSrc  = src;
    currentZoom    = 1.0;
    currentPageNum = 1;
    totalPdfPages  = 1;
    currentPdfDoc  = null;

    const ext = src.split(".").pop().toLowerCase();
    currentDocType = (ext === "pdf") ? "pdf" : "image";

    // Set meta
    if (certLbOrg)  certLbOrg.textContent  = org || "Credential";
    if (certLbName) certLbName.textContent = name || "Certificate Document";
    if (certLbDate) certLbDate.textContent = date || "";

    // Action links
    if (certOpenNewTab)    certOpenNewTab.href = src;
    if (certDownload) {
      certDownload.href = src;
      certDownload.setAttribute("download", src.split("/").pop());
    }
    if (certFooterOpenBtn) certFooterOpenBtn.href = src;
    if (certFooterOpenText) {
      certFooterOpenText.textContent = (currentDocType === "pdf") ? "Open PDF in New Tab" : "Open Image in New Tab";
    }

    // Reset controls
    updateZoomUI();
    showCertError(false);

    if (currentDocType === "pdf") {
      if (certPageGroup)   certPageGroup.style.display   = "none";
      if (certImgViewport) certImgViewport.style.display = "none";
      if (certPdfViewport) certPdfViewport.style.display = "flex";

      showCertLoader(true);

      if (typeof pdfjsLib === "undefined") {
        showCertLoader(false);
        showCertError(true, src);
      } else {
        pdfjsLib.getDocument(src).promise.then(pdf => {
          currentPdfDoc = pdf;
          totalPdfPages = pdf.numPages;

          if (certPageGroup) {
            certPageGroup.style.display = totalPdfPages > 1 ? "flex" : "none";
          }
          updatePageUI();
          renderPdfPage(1);
        }).catch(err => {
          console.warn("PDF load error, falling back to direct open:", err);
          showCertLoader(false);
          showCertError(true, src);
        });
      }
    } else {
      // Image mode
      if (certPageGroup)   certPageGroup.style.display   = "none";
      if (certPdfViewport) certPdfViewport.style.display = "none";
      if (certImgViewport) certImgViewport.style.display = "flex";

      showCertLoader(true);
      if (certLbImg) {
        certLbImg.style.transform = "scale(1)";
        certLbImg.onload = () => showCertLoader(false);
        certLbImg.onerror = () => {
          showCertLoader(false);
          showCertError(true, src);
        };
        certLbImg.src = src;
        certLbImg.alt = name || "Certificate";
      }
    }

    // Smooth 3D open animation trigger
    certLightbox.classList.remove("closing");
    certLightbox.classList.add("open");
    certLightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeCertViewer() {
    if (!certLightbox || isClosing || !certLightbox.classList.contains("open")) return;
    isClosing = true;

    // Smooth 3D close animation trigger
    certLightbox.classList.add("closing");
    certLightbox.classList.remove("open");
    certLightbox.setAttribute("aria-hidden", "true");

    setTimeout(() => {
      certLightbox.classList.remove("closing");
      document.body.style.overflow = "";

      if (pdfRenderTask) {
        pdfRenderTask.cancel();
        pdfRenderTask = null;
      }
      currentPdfDoc = null;
      if (certLbImg) certLbImg.src = "";
      isClosing = false;
    }, 360);
  }

  // Lightbox event listeners
  if (certClose)    certClose.addEventListener("click", closeCertViewer);
  if (certBackdrop) certBackdrop.addEventListener("click", closeCertViewer);

  if (certZoomIn) {
    certZoomIn.addEventListener("click", () => {
      if (currentZoom < 3.0) {
        currentZoom = Math.min(3.0, currentZoom + 0.25);
        applyZoom();
      }
    });
  }

  if (certZoomOut) {
    certZoomOut.addEventListener("click", () => {
      if (currentZoom > 0.5) {
        currentZoom = Math.max(0.5, currentZoom - 0.25);
        applyZoom();
      }
    });
  }

  if (certZoomReset) {
    certZoomReset.addEventListener("click", () => {
      currentZoom = 1.0;
      applyZoom();
    });
  }

  if (certPrevPage) {
    certPrevPage.addEventListener("click", () => {
      if (currentPageNum > 1) {
        currentPageNum--;
        updatePageUI();
        renderPdfPage(currentPageNum);
      }
    });
  }

  if (certNextPage) {
    certNextPage.addEventListener("click", () => {
      if (currentPageNum < totalPdfPages) {
        currentPageNum++;
        updatePageUI();
        renderPdfPage(currentPageNum);
      }
    });
  }

  // Keyboard navigation
  document.addEventListener("keydown", e => {
    if (!certLightbox || !certLightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeCertViewer();
    if (e.key === "+" || e.key === "=") {
      if (currentZoom < 3.0) { currentZoom += 0.25; applyZoom(); }
    }
    if (e.key === "-") {
      if (currentZoom > 0.5) { currentZoom -= 0.25; applyZoom(); }
    }
    if (currentDocType === "pdf" && totalPdfPages > 1) {
      if (e.key === "ArrowLeft" && currentPageNum > 1) {
        currentPageNum--; updatePageUI(); renderPdfPage(currentPageNum);
      }
      if (e.key === "ArrowRight" && currentPageNum < totalPdfPages) {
        currentPageNum++; updatePageUI(); renderPdfPage(currentPageNum);
      }
    }
  });

  // Attach to cert cards
  document.querySelectorAll(".cert-card[data-file]").forEach(card => {
    card.addEventListener("click", () => {
      const file = card.getAttribute("data-file");
      const name = card.getAttribute("data-name") || "Certificate";
      const org  = card.getAttribute("data-org")  || "Certification";
      const date = card.getAttribute("data-date") || "";
      openCertViewer(file, org, name, date);
    });
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Global window handler for button triggers
  window.openCertDocument = function (file, org, name, date) {
    openCertViewer(file, org, name, date);
  };

  /* ================================================
     15. CONTACT FORM INTERACTION
  ================================================ */
  const contactForm = document.getElementById("contactForm");
  const formStatus  = document.getElementById("formStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", e => {
      e.preventDefault();
      const submitBtn = document.getElementById("formSubmitBtn");
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        if (formStatus) {
          formStatus.style.display = "block";
          formStatus.className = "form-status success";
          formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been prepared. Opening your email client...';
        }

        const name    = encodeURIComponent(document.getElementById("formName")?.value || "");
        const email   = encodeURIComponent(document.getElementById("formEmail")?.value || "");
        const subject = encodeURIComponent(document.getElementById("formSubject")?.value || "Portfolio Contact");
        const msg     = encodeURIComponent(document.getElementById("formMessage")?.value || "");

        const mailtoUri = `mailto:relangilaharika@gmail.com?subject=${subject}&body=From:%20${name}%20(${email})%0A%0A${msg}`;
        window.location.href = mailtoUri;

        if (submitBtn) {
          submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Message Ready';
          setTimeout(() => {
            submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
            submitBtn.disabled = false;
          }, 3000);
        }
      }, 700);
    });
  }

})();
