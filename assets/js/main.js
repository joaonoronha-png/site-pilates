(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     WhatsApp — número oficial + mensagem pré-preenchida
  --------------------------------------------------------- */
  const WHATSAPP_NUMBER = "5521974601698"; // (21) 97460-1698
  const WHATSAPP_MESSAGE = "Olá! Conheci a Dona Help Rio Barra pelo site e gostaria de solicitar um orçamento.";
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  document.querySelectorAll(".js-whatsapp, #ctaHeader, #ctaMobile").forEach((el) => {
    el.setAttribute("href", waLink);
  });

  /* ---------------------------------------------------------
     Acessibilidade dos placeholders de foto: o rótulo visual
     (data-label) também fica disponível para leitores de tela.
  --------------------------------------------------------- */
  document.querySelectorAll(".photo[data-label]").forEach((el) => {
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", el.getAttribute("data-label"));
  });
  document.querySelectorAll(".photo .mono").forEach((el) => el.setAttribute("aria-hidden", "true"));

  /* ---------------------------------------------------------
     Header: encolhe e ganha fundo ao rolar
  --------------------------------------------------------- */
  const header = document.getElementById("siteHeader");
  const setHeaderState = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  /* ---------------------------------------------------------
     Menu mobile
  --------------------------------------------------------- */
  const navToggle = document.getElementById("navToggle");
  const navMobile = document.getElementById("navMobile");
  const closeMenu = () => {
    navMobile.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };
  navToggle.addEventListener("click", () => {
    const isOpen = navMobile.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });
  navMobile.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  /* ---------------------------------------------------------
     Reveal on scroll (IntersectionObserver)
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else if ("IntersectionObserver" in window) {
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
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------------------------------------------------------
     Before / After slider — mouse, touch, teclado, acessível
  --------------------------------------------------------- */
  document.querySelectorAll("[data-ba]").forEach((ba) => {
    const before = ba.querySelector(".ba-before");
    const handle = ba.querySelector(".ba-handle");
    const range = ba.querySelector(".ba-range");

    const setPosition = (percent) => {
      const clamped = Math.min(100, Math.max(0, percent));
      before.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
      handle.style.left = `${clamped}%`;
      range.value = clamped;
    };

    setPosition(50);

    range.addEventListener("input", (e) => setPosition(Number(e.target.value)));

    let dragging = false;
    const updateFromClientX = (clientX) => {
      const rect = ba.getBoundingClientRect();
      const percent = ((clientX - rect.left) / rect.width) * 100;
      setPosition(percent);
    };

    ba.addEventListener("pointerdown", (e) => {
      dragging = true;
      ba.setPointerCapture(e.pointerId);
      updateFromClientX(e.clientX);
      e.preventDefault();
    });
    ba.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      updateFromClientX(e.clientX);
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach((evt) =>
      ba.addEventListener(evt, () => { dragging = false; })
    );
  });

  /* ---------------------------------------------------------
     Como funciona — progressão ativa conforme o scroll
  --------------------------------------------------------- */
  const steps = document.querySelectorAll("[data-step]");
  const progress = document.querySelector(".steps-progress");
  if (steps.length && "IntersectionObserver" in window) {
    const stepIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-active");
          }
        });
        const activeCount = document.querySelectorAll(".step.is-active").length;
        if (progress) {
          const pct = (activeCount / steps.length) * 80; // 80% = largura útil da linha
          progress.style.width = `${pct}%`;
        }
      },
      { threshold: 0.6 }
    );
    steps.forEach((s) => stepIO.observe(s));
  }

  /* ---------------------------------------------------------
     Rodapé — ano corrente
  --------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
