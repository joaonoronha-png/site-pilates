(() => {
  const WA_NUMBER = "5521995457197";

  // build WhatsApp links from data-message
  document.querySelectorAll("[data-wa]").forEach((el) => {
    const msg = el.getAttribute("data-message") || "";
    el.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    el.target = "_blank";
    el.rel = "noopener";
  });

  // footer year
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // header solid-on-scroll
  const header = document.querySelector("[data-header]");
  const waFloat = document.querySelector("[data-wa-float]");
  const heroHeight = () => document.querySelector(".hero")?.offsetHeight || 600;

  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle("is-scrolled", y > 40);
    waFloat?.classList.toggle("is-visible", y > heroHeight() * 0.6);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // mobile nav toggle
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  navToggle?.addEventListener("click", () => {
    const open = nav.getAttribute("data-open") === "true";
    nav.setAttribute("data-open", String(!open));
    navToggle.setAttribute("aria-expanded", String(!open));
    document.body.style.overflow = open ? "" : "hidden";
  });
  nav?.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.setAttribute("data-open", "false");
      navToggle?.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    })
  );

  // staggered reveal delay within each section
  document.querySelectorAll("main > section, .site-header").forEach((section) => {
    const items = section.querySelectorAll("[data-reveal]");
    items.forEach((el, i) => {
      el.style.setProperty("--reveal-delay", `${Math.min(i * 0.08, 0.4)}s`);
    });
  });

  // scroll reveal via IntersectionObserver
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
  }

  // subtle parallax drift on gallery items while scrolling (disabled if reduced motion)
  if (!reduceMotion) {
    const galleryItems = document.querySelectorAll(".g-item .ph");
    let ticking = false;
    const updateParallax = () => {
      const vh = window.innerHeight;
      galleryItems.forEach((el) => {
        const rect = el.parentElement.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - vh / 2;
        const shift = Math.max(-14, Math.min(14, center * -0.02));
        el.style.transform = `translateY(${shift}px) scale(1.06)`;
      });
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
  }
})();
