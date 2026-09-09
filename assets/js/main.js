(function () {
  "use strict";

  var PHONE = "5521981383284";
  var ADDRESS = "Nael Jr Barber Studio, Av. das Américas, 8585, Sala 553, Barra da Tijuca, Rio de Janeiro - RJ, 22793-081";

  // --- WhatsApp links: build href from data-wa-msg so the number lives in one place ---
  document.querySelectorAll("[data-wa-msg]").forEach(function (el) {
    el.href = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(el.getAttribute("data-wa-msg"));
    el.target = "_blank";
    el.rel = "noopener";
  });

  // --- "Como chegar" -> Google Maps directions ---
  var directions = document.getElementById("directions-link");
  if (directions) {
    directions.href = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(ADDRESS);
    directions.target = "_blank";
    directions.rel = "noopener";
  }

  // --- header background on scroll ---
  var header = document.getElementById("site-header");
  var onScroll = function () {
    if (window.scrollY > 24) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // --- whatsapp floating button visibility ---
  var floatBtn = document.getElementById("whatsapp-float");
  var heroEl = document.getElementById("hero");
  if (floatBtn && heroEl) {
    var heroObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          floatBtn.classList.toggle("is-visible", !entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );
    heroObserver.observe(heroEl);
  }

  // --- mobile menu ---
  var toggle = document.getElementById("menu-toggle");
  var nav = document.getElementById("main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  // --- scroll reveal ---
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // --- media placeholder fallback: real photos/video simply drop into assets/img
  //     and assets/video with the expected filenames; if a file is missing the
  //     slot shows its editorial placeholder instead of a broken image icon.
  document.querySelectorAll(".media-slot img").forEach(function (img) {
    var markPlaceholder = function () {
      var slot = img.closest(".media-slot");
      if (slot) slot.classList.add("is-placeholder");
    };
    if (img.complete && img.naturalWidth === 0) markPlaceholder();
    img.addEventListener("error", markPlaceholder);
  });

  document.querySelectorAll(".media-slot video").forEach(function (video) {
    var markPlaceholder = function () {
      var slot = video.closest(".media-slot");
      if (slot) slot.classList.add("is-placeholder");
    };
    var source = video.querySelector("source");
    if (source) source.addEventListener("error", markPlaceholder);
    video.addEventListener("error", markPlaceholder);
  });
})();
