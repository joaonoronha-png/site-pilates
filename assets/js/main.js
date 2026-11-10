/* JD Car Detailing — interactions */
(() => {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const PHONE = "+17277464419";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  document.body.classList.add("is-loading");

  /* ---------- Preloader (percent counter + split-curtain reveal) ---------- */
  const pre = $("#preloader");
  let loaded = false, finished = false;
  window.addEventListener("load", () => (loaded = true));
  const finishLoad = () => {
    if (finished) return; finished = true;
    pre.classList.add("is-opening");
    setTimeout(() => {
      pre.classList.add("is-done");
      document.body.classList.remove("is-loading");
      document.body.classList.add("is-ready");
    }, reduceMotion ? 0 : 350);
    setTimeout(() => pre.classList.add("is-gone"), reduceMotion ? 50 : 1600);
  };
  (() => {
    if (reduceMotion) { finishLoad(); return; }
    const bar = $("#preBar"), pct = $("#prePct"), step = $("#preStep");
    const steps = ["Foaming", "Washing", "Polishing", "Protecting", "Ready"];
    const t0 = performance.now(), minDur = 900;
    let last = 0;
    const tick = (t) => {
      const elapsed = t - t0;
      // climb to 90% on a timer, then finish once the page has loaded (or after 4s max)
      let p = Math.min(elapsed / minDur, 1) * 0.9;
      if ((loaded || elapsed > 2500) && elapsed > minDur) p = Math.min(0.9 + (elapsed - minDur) / 300, 1);
      p = Math.max(p, last); last = p;
      const v = Math.round(p * 100);
      pct.textContent = v; bar.style.width = v + "%";
      step.textContent = steps[Math.min(Math.floor(p * (steps.length - 1) + 0.001), steps.length - 1)];
      if (v < 100) requestAnimationFrame(tick); else setTimeout(finishLoad, 250);
    };
    requestAnimationFrame(tick);
  })();

  /* ---------- Hero word rotator ---------- */
  (() => {
    const items = $$("#rotator .rotator__item"); if (items.length < 2 || reduceMotion) return;
    let i = 0;
    setInterval(() => {
      const cur = items[i]; i = (i + 1) % items.length; const nxt = items[i];
      cur.classList.remove("is-active"); cur.classList.add("is-out");
      nxt.classList.remove("is-out"); nxt.classList.add("is-active");
      setTimeout(() => cur.classList.remove("is-out"), 900);
    }, 2800);
  })();

  /* ---------- Hero glow follows pointer ---------- */
  (() => {
    const glow = $("#heroGlow"), hero = $("#hero"); if (!glow || !finePointer || reduceMotion) return;
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      glow.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px)`;
    });
  })();

  /* faqCollapse: start FAQ closed on phones */
  if (matchMedia("(max-width: 640px)").matches) $$(".acc[open]").forEach((d) => { d.open = false; });

  /* ---------- Year ---------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Header: scrolled / hide on scroll down ---------- */
  const header = $("#header");
  const progress = $("#scrollProgress");
  const fab = $("#fabBar");
  const waFloat = $("#waFloat");
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 30);
    header.classList.toggle("is-hidden", y > lastY && y > 500 && !$("#nav").classList.contains("is-open"));
    lastY = y;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    fab && fab.classList.toggle("is-show", y > innerHeight * 0.6);
    waFloat && waFloat.classList.toggle("is-show", y > innerHeight * 0.5);
    const lf = document.getElementById("locFloat"); lf && lf.classList.toggle("is-show", y > innerHeight * 0.6);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  const burger = $("#burger"), nav = $("#nav");
  const toggleNav = (open) => {
    nav.classList.toggle("is-open", open);
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
  };
  burger.addEventListener("click", () => toggleNav(!nav.classList.contains("is-open")));
  $$("a", nav).forEach((a) => a.addEventListener("click", () => toggleNav(false)));

  /* ---------- Active nav link ---------- */
  const navLinks = $$('.nav a[href^="#"]');
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  navLinks.forEach((l) => { const s = $(l.getAttribute("href")); s && sectionObs.observe(s); });

  /* ---------- Reveal on scroll (with stagger) ---------- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      revealObs.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    const i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty("--d", `${Math.min(i * 0.08, 0.5)}s`);
    revealObs.observe(el);
  });

  /* ---------- Counters ---------- */
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target, end = parseFloat(el.dataset.count), dec = +el.dataset.decimals || 0, suf = el.dataset.suffix || "";
      const t0 = performance.now(), dur = 1800;
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1), ease = 1 - Math.pow(1 - p, 4);
        el.textContent = (end * ease).toFixed(dec) + suf;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObs.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach((el) => countObs.observe(el));

  /* ---------- Open now badge + next slot (Clearwater time) ---------- */
  (() => {
    const badge = $("#openBadge"), slot = $("#nextSlot");
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t)?.value;
    const day = get("weekday"); const hour = +get("hour") % 24; const min = +get("minute");
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const di = days.indexOf(day);
    const open = di >= 1 && di <= 6 && hour >= 7 && hour < 18;
    badge.classList.add(open ? "is-open" : "is-closed");
    $("b", badge).innerHTML = open ? 'Open now<span class="ob-extra"> · until 6PM</span>' : 'Closed<span class="ob-extra"> · opens 7AM</span>';
    // next slot: if open and before 3PM -> today later; else next working day 7AM
    let label;
    if (open && hour < 15) {
      const h = hour + (min > 0 ? 2 : 1);
      label = `Today · ${h > 12 ? h - 12 : h}:00 ${h >= 12 ? "PM" : "AM"}`;
    } else if (di >= 1 && di <= 6 && hour < 7) {
      label = "Today · 7:00 AM";
    } else {
      let n = (di + 1) % 7; if (n === 0) n = 1;
      label = `${n === (di + 1) % 7 ? "Tomorrow" : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][n]} · 7:00 AM`;
    }
    slot.textContent = label;
  })();

  /* ---------- Hero bubbles (foam) ---------- */
  (() => {
    const c = $("#bubbles"); if (!c || reduceMotion) return;
    const ctx = c.getContext("2d");
    let w, h, dpr, bubbles = [], running = true;
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = c.width = c.offsetWidth * dpr; h = c.height = c.offsetHeight * dpr;
    };
    const make = (initial) => ({
      x: Math.random() * w, y: initial ? Math.random() * h : h + 20 * dpr,
      r: (Math.random() * 6 + 1.5) * dpr, s: (Math.random() * 0.5 + 0.2) * dpr,
      drift: Math.random() * Math.PI * 2, a: Math.random() * 0.35 + 0.1,
    });
    resize(); addEventListener("resize", resize);
    const count = innerWidth < 700 ? 26 : 55;
    for (let i = 0; i < count; i++) bubbles.push(make(true));
    const heroObs = new IntersectionObserver(([e]) => { running = e.isIntersecting; if (running) loop(); });
    heroObs.observe(c);
    function loop() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      bubbles.forEach((b, i) => {
        b.y -= b.s; b.drift += 0.01; b.x += Math.sin(b.drift) * 0.3 * dpr;
        if (b.y < -20) bubbles[i] = make(false);
        const g = ctx.createRadialGradient(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.1, b.x, b.y, b.r);
        g.addColorStop(0, `rgba(255,255,255,${b.a + 0.25})`);
        g.addColorStop(0.6, `rgba(255,224,170,${b.a * 0.4})`);
        g.addColorStop(1, `rgba(255,165,31,${b.a * 0.15})`);
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
        ctx.lineWidth = 0.6 * dpr; ctx.strokeStyle = `rgba(255,255,255,${b.a})`; ctx.stroke();
      });
      requestAnimationFrame(loop);
    }
    loop();
  })();

  /* ---------- Parallax ---------- */
  if (!reduceMotion) {
    const heroImg = $("#heroImg");
    const pEls = $$(".parallax");
    let ticking = false;
    const run = () => {
      const y = scrollY;
      if (heroImg && y < innerHeight * 1.2) heroImg.style.translate = `0 ${y * 0.25}px`;
      pEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > innerHeight + 200) return;
        const off = (r.top + r.height / 2 - innerHeight / 2) * parseFloat(el.dataset.speed || 0.05);
        el.style.translate = `0 ${off}px`;
      });
      // process line fill
      const pl = $("#processFill");
      if (pl) {
        const r = pl.parentElement.getBoundingClientRect();
        const p = Math.min(Math.max((innerHeight * 0.85 - r.top) / (innerHeight * 0.6), 0), 1);
        pl.style.transform = `scaleX(${p})`;
      }
      ticking = false;
    };
    addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(run); ticking = true; } }, { passive: true });
    run();
  }

  /* ---------- Custom cursor + magnetic buttons + tilt ---------- */
  if (finePointer && !reduceMotion) {
    const cur = $("#cursor"), dot = $("#cursorDot");
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px)`; if (!document.body.classList.contains("has-cursor")) { cx = mx; cy = my; document.body.classList.add("has-cursor"); } });
    const follow = () => { cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18; cur.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(follow); };
    follow();
    $$("a, button, .m-item, .chip, input, summary").forEach((el) => {
      el.addEventListener("mouseenter", () => cur.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => cur.classList.remove("is-hover"));
    });

    $$(".magnetic").forEach((b) => {
      b.addEventListener("mousemove", (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      });
      b.addEventListener("mouseleave", () => (b.style.transform = ""));
    });

    $$("[data-tilt]").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 6}deg) rotateY(${(px - 0.5) * 8}deg) translateY(-4px)`;
        card.style.setProperty("--mx", `${px * 100}%`); card.style.setProperty("--my", `${py * 100}%`);
      });
      card.addEventListener("mouseleave", () => (card.style.transform = ""));
    });
  }

  /* ---------- Pricing data ---------- */
  const PRICES = {
    express: { sedan: 90, suv: 110, truck: 130, label: "Express Refresh" },
    interior: { sedan: 150, suv: 170, truck: 190, label: "Interior Deep Clean" },
    full: { sedan: 240, suv: 250, truck: 280, label: "Full Detail" },
    signature: { sedan: 420, suv: 480, truck: 540, label: "Showroom Signature" },
  };
  const ADDONS = {
    pet: { price: 40, label: "Pet hair removal" },
    headlights: { price: 60, label: "Headlight restoration" },
    engine: { price: 50, label: "Engine bay" },
    odor: { price: 45, label: "Odor treatment" },
    sealant: { price: 80, label: "Paint sealant" },
    stain: { price: 35, label: "Stain treatment" },
  };
  const SIZES = { sedan: "Sedan / Coupe", suv: "SUV / Minivan", truck: "Truck / 3-Row" };

  /* ---------- Package size toggle ---------- */
  const toggleBtns = $$(".toggle__btn"), glider = $(".toggle__glider");
  const moveGlider = (btn) => {
    glider.style.width = btn.offsetWidth + "px";
    glider.style.transform = `translateX(${btn.offsetLeft - 6}px)`;
  };
  const setSize = (size) => {
    toggleBtns.forEach((b) => {
      const on = b.dataset.size === size;
      b.classList.toggle("is-active", on); b.setAttribute("aria-selected", on);
      if (on) moveGlider(b);
    });
    $$(".pkg__price b").forEach((b) => {
      const v = JSON.parse(b.dataset.prices)[size];
      b.classList.add("is-swap");
      setTimeout(() => { b.textContent = v; b.classList.remove("is-swap"); }, 200);
    });
  };
  toggleBtns.forEach((b) => b.addEventListener("click", () => {
    setSize(b.dataset.size);
    const r = $(`#quoteForm input[name="size"][value="${b.dataset.size}"]`); if (r) { r.checked = true; calc(); }
  }));
  addEventListener("resize", () => moveGlider($(".toggle__btn.is-active")));
  requestAnimationFrame(() => moveGlider($(".toggle__btn.is-active")));
  document.fonts && document.fonts.ready.then(() => moveGlider($(".toggle__btn.is-active")));

  /* ---------- Quote builder ---------- */
  const form = $("#quoteForm"), totalEl = $("#qTotal");
  let shown = 240;
  const readQuote = () => {
    const size = $('input[name="size"]:checked', form).value;
    const pkg = $('input[name="package"]:checked', form).value;
    const addons = $$('input[name="addon"]:checked', form).map((i) => i.value);
    const total = PRICES[pkg][size] + addons.reduce((s, a) => s + ADDONS[a].price, 0);
    return { size, pkg, addons, total };
  };
  function calc() {
    const { total } = readQuote();
    const from = shown, t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / 500, 1);
      totalEl.textContent = Math.round(from + (total - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    shown = total;
  }
  form.addEventListener("change", calc);

  // Min date = today
  const dateIn = $("#qDate");
  dateIn.min = new Date().toISOString().split("T")[0];

  // ---- Everything a visitor picks goes to the business's WhatsApp ----
  const WA_NUM = PHONE.replace("+", "");
  const openWA = (text) => {
    const url = `https://wa.me/${WA_NUM}?text=${encodeURIComponent(text)}`;
    // Phones/tablets: navigate in the same tab so iOS/Android hand the link straight to the WhatsApp app
    if (matchMedia("(hover: none) and (pointer: coarse)").matches) { location.href = url; return; }
    const w = window.open(url, "_blank");
    if (w) w.opener = null; else location.href = url; // popup blocked -> same tab
  };
  const currentSize = () => ($(".toggle__btn.is-active")?.dataset.size) || "sedan";

  // Service cards
  $$("[data-wa-service]").forEach((a) => {
    const msg = () => `Hi JD Car Detailing! I'm interested in your ${a.dataset.waService} service. Could you send me a quote and your availability?`;
    a.href = `https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg())}`;
    a.addEventListener("click", (e) => { e.preventDefault(); openWA(msg()); });
  });

  // Package buttons (uses the vehicle size selected in the toggle)
  $$("[data-wa-package]").forEach((a) => {
    const msg = () => {
      const p = a.dataset.waPackage, size = currentSize();
      if (p === "membership") return `Hi JD Car Detailing! I'm interested in the Maintenance Club (bi-weekly / monthly washes) for my ${SIZES[size]}. What are the member rates?`;
      return [
        `Hi JD Car Detailing! I'd like to book the ${PRICES[p].label} package.`,
        `Vehicle: ${SIZES[size]}`,
        `Price on website: from $${PRICES[p][size]}`,
        `When is your next availability?`,
      ].join("\n");
    };
    a.addEventListener("click", (e) => { e.preventDefault(); openWA(msg()); });
  });

  const quoteMessage = () => {
    const q = readQuote();
    const name = $("#qName").value.trim(), car = $("#qCar").value.trim(), date = dateIn.value, zip = $("#qZip").value.trim();
    return [
      `Hi JD Car Detailing! I'd like to book a detail${name ? ` — this is ${name}` : ""}.`,
      `Vehicle: ${SIZES[q.size]}${car ? ` (${car})` : ""}`,
      `Package: ${PRICES[q.pkg].label} (from $${PRICES[q.pkg][q.size]})`,
      q.addons.length ? `Add-ons: ${q.addons.map((a) => `${ADDONS[a].label} (+$${ADDONS[a].price})`).join(", ")}` : `Add-ons: none`,
      date ? `Preferred date: ${new Date(date + "T12:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}` : null,
      zip ? `ZIP: ${zip}` : null,
      `Website estimate: $${q.total}+`,
    ].filter(Boolean).join("\n");
  };

  // Quote builder -> WhatsApp with every selection
  form.addEventListener("submit", (e) => { e.preventDefault(); openWA(quoteMessage()); });

  /* ---------- ZIP checker ---------- */
  const ZIPS = {
    "33755": "Clearwater", "33756": "Clearwater / Belleair", "33757": "Clearwater", "33758": "Clearwater", "33759": "Clearwater", "33760": "Clearwater",
    "33761": "Clearwater", "33762": "Clearwater", "33763": "Clearwater", "33764": "Clearwater", "33765": "Clearwater", "33767": "Clearwater Beach",
    "33770": "Largo", "33771": "Largo", "33773": "Largo", "33774": "Largo", "33778": "Largo", "33772": "Seminole", "33776": "Seminole", "33777": "Seminole",
    "34698": "Dunedin", "34695": "Safety Harbor", "34683": "Palm Harbor", "34684": "Palm Harbor", "34685": "Palm Harbor", "34677": "Oldsmar",
    "33785": "Indian Rocks Beach", "33786": "Belleair Beach", "33781": "Pinellas Park", "33782": "Pinellas Park",
  };
  const zipIn = $("#zipCheck"), zipOut = $("#zipResult");
  const checkZip = () => {
    const z = zipIn.value.trim();
    zipOut.className = "zip__result";
    if (!/^\d{5}$/.test(z)) { zipOut.textContent = "Please enter a 5-digit ZIP code."; zipOut.classList.add("maybe"); return; }
    if (ZIPS[z]) { zipOut.textContent = `✓ Great news — we serve ${ZIPS[z]}!`; zipOut.classList.add("ok"); }
    else { zipOut.innerHTML = `Outside our usual area — <a href="https://wa.me/${PHONE.replace("+", "")}?text=${encodeURIComponent("Hi JD Car Detailing! Do you cover ZIP " + z + "?")}" target="_blank" rel="noopener" style="text-decoration:underline">message us on WhatsApp</a>, we may still come to you.`; zipOut.classList.add("maybe"); }
  };
  $("#zipBtn").addEventListener("click", checkZip);
  zipIn.addEventListener("keydown", (e) => { if (e.key === "Enter") checkZip(); });
  zipIn.addEventListener("input", () => (zipIn.value = zipIn.value.replace(/\D/g, "")));
  $("#qZip").addEventListener("input", (e) => (e.target.value = e.target.value.replace(/\D/g, "")));

  /* ---------- Before / After ---------- */
  $$("[data-ba]").forEach((ba) => {
    const input = $("input", ba);
    const set = (v) => ba.style.setProperty("--pos", v + "%");
    input.addEventListener("input", () => set(input.value));
    // intro sweep when visible
    const o = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || reduceMotion) return;
      o.disconnect();
      const t0 = performance.now();
      const anim = (t) => {
        const p = Math.min((t - t0) / 1800, 1);
        const v = 50 + Math.sin(p * Math.PI * 2) * 30 * (1 - p);
        set(v); input.value = v;
        if (p < 1) requestAnimationFrame(anim);
      };
      requestAnimationFrame(anim);
    }, { threshold: 0.6 });
    o.observe(ba);
  });

  /* ---------- Gallery filter + lightbox ---------- */
  const items = $$(".m-item");
  $$(".filter").forEach((f) => f.addEventListener("click", () => {
    $$(".filter").forEach((x) => x.classList.toggle("is-active", x === f));
    const cat = f.dataset.filter;
    items.forEach((it) => it.classList.add("is-fading"));
    setTimeout(() => {
      items.forEach((it) => it.classList.toggle("is-hidden", cat !== "all" && it.dataset.cat !== cat));
      requestAnimationFrame(() => items.forEach((it) => it.classList.remove("is-fading")));
    }, 300);
  }));

  const lb = $("#lightbox"), lbImg = $("img", lb), lbCap = $(".lightbox__cap", lb);
  let lbIndex = 0;
  const visible = () => items.filter((i) => !i.classList.contains("is-hidden"));
  const showLb = (i) => {
    const list = visible(); lbIndex = (i + list.length) % list.length;
    const it = list[lbIndex]; const img = $("img", it);
    lbImg.src = img.src; lbImg.alt = img.alt; lbCap.textContent = $("figcaption", it).textContent;
  };
  items.forEach((it) => it.addEventListener("click", () => {
    showLb(visible().indexOf(it)); lb.classList.add("is-open"); lb.setAttribute("aria-hidden", "false");
  }));
  const closeLb = () => { lb.classList.remove("is-open"); lb.setAttribute("aria-hidden", "true"); };
  $(".lightbox__close", lb).addEventListener("click", closeLb);
  $(".lightbox__prev", lb).addEventListener("click", () => showLb(lbIndex - 1));
  $(".lightbox__next", lb).addEventListener("click", () => showLb(lbIndex + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") showLb(lbIndex - 1);
    if (e.key === "ArrowRight") showLb(lbIndex + 1);
  });

  /* ---------- Reviews slider ---------- */
  (() => {
    const slider = $("#reviewSlider"), track = $(".slider__track", slider), cards = $$(".review", track), dotsWrap = $("#sliderDots");
    let idx = 0, timer;
    const perView = () => (innerWidth <= 640 ? 1 : innerWidth <= 1100 ? 2 : 3);
    const maxIdx = () => Math.max(cards.length - perView(), 0);
    const buildDots = () => {
      dotsWrap.innerHTML = "";
      for (let i = 0; i <= maxIdx(); i++) {
        const d = document.createElement("button");
        d.setAttribute("aria-label", `Go to review ${i + 1}`);
        d.addEventListener("click", () => { go(i); restart(); });
        dotsWrap.appendChild(d);
      }
    };
    const go = (i) => {
      idx = i > maxIdx() ? 0 : i < 0 ? maxIdx() : i;
      const step = cards[0].offsetWidth + 22;
      track.style.transform = `translateX(${-idx * step}px)`;
      $$("button", dotsWrap).forEach((d, j) => d.classList.toggle("is-active", j === idx));
    };
    const restart = () => { clearInterval(timer); if (!reduceMotion) timer = setInterval(() => go(idx + 1), 5500); };
    $$(".slider__btn", slider).forEach((b) => b.addEventListener("click", () => { go(idx + +b.dataset.dir); restart(); }));
    // swipe
    let sx = null;
    track.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
    track.addEventListener("touchend", (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) { go(idx + (dx < 0 ? 1 : -1)); restart(); }
      sx = null;
    });
    slider.addEventListener("mouseenter", () => clearInterval(timer));
    slider.addEventListener("mouseleave", restart);
    addEventListener("resize", () => { buildDots(); go(Math.min(idx, maxIdx())); });
    buildDots(); go(0); restart();
  })();

  /* ---------- Toast ---------- */
  let toastT;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("is-show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("is-show"), 4200);
  }

  /* ---------- Directions sheet (Google Maps / Waze / Apple Maps) ---------- */
  (() => {
    const sheet = $("#dirSheet"); if (!sheet) return;
    let lastFocus = null;
    const open = () => {
      lastFocus = document.activeElement;
      sheet.classList.add("is-open"); sheet.setAttribute("aria-hidden", "false");
      setTimeout(() => $(".dir-opt", sheet)?.focus(), 200);
    };
    const close = () => {
      sheet.classList.remove("is-open"); sheet.setAttribute("aria-hidden", "true");
      lastFocus && lastFocus.focus && lastFocus.focus();
    };
    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-directions]")) { e.preventDefault(); open(); }
    });
    $$("[data-close]", sheet).forEach((el) => el.addEventListener("click", close));
    $$(".dir-opt", sheet).forEach((a) => a.addEventListener("click", () => setTimeout(close, 300)));
    addEventListener("keydown", (e) => { if (e.key === "Escape" && sheet.classList.contains("is-open")) close(); });
    // swipe down to close on mobile
    const panel = $(".dir-sheet__panel", sheet); let sy = null;
    panel.addEventListener("touchstart", (e) => (sy = e.touches[0].clientY), { passive: true });
    panel.addEventListener("touchend", (e) => { if (sy !== null && e.changedTouches[0].clientY - sy > 70) close(); sy = null; });
  })();

  /* ---------- 3D satellite map (self-hosted aerial imagery + real 3D buildings) ---------- */
  (() => {
    const el = $("#map3d"), tools = $("#mapTools");
    if (!el || !window.maplibregl) { el && el.remove(); return; }
    const CENTER = [-82.7245288, 27.9162765];
    const VIEW = { center: CENTER, zoom: 16.4, pitch: 66, bearing: -32 };
    // Image footprints in [top-left, top-right, bottom-right, bottom-left] order (Web Mercator exports)
    const DETAIL = [[-82.73441026812533, 27.925007735482044], [-82.7146473318747, 27.925007735482044], [-82.7146473318747, 27.907544559490994], [-82.73441026812533, 27.907544559490994]];
    const CONTEXT = [[-82.77842771704718, 27.963892851797947], [-82.67062988295284, 27.963892851797947], [-82.67062988295284, 27.86863917219888], [-82.77842771704718, 27.86863917219888]];
    let started = false;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) { started = true; io.disconnect(); build(); }
    }, { rootMargin: "400px" });
    io.observe(el);

    function build() {
      let map;
      const fail = () => { el.remove(); };
      const timer = setTimeout(() => { if (!el.classList.contains("is-ready")) { try { map && map.remove(); } catch {} fail(); } }, 15000);
      try {
        map = new maplibregl.Map({
          container: el,
          style: {
            version: 8,
            sources: {
              ctx: { type: "image", url: "assets/map/sat-context.jpg", coordinates: CONTEXT },
              det: { type: "image", url: "assets/map/sat-detail.jpg", coordinates: DETAIL },
              bld: { type: "geojson", data: "assets/map/buildings.geojson" },
            },
            layers: [
              { id: "bg", type: "background", paint: { "background-color": "#0a0a0b" } },
              { id: "ctx", type: "raster", source: "ctx", paint: { "raster-fade-duration": 0, "raster-saturation": 0.1, "raster-contrast": 0.08 } },
              { id: "det", type: "raster", source: "det", paint: { "raster-fade-duration": 0, "raster-saturation": 0.12, "raster-contrast": 0.1 } },
              { id: "bld", type: "fill-extrusion", source: "bld", minzoom: 14.5, paint: {
                "fill-extrusion-color": ["interpolate", ["linear"], ["get", "h"], 3, "#f3f1ec", 20, "#ebe6dc", 40, "#f2d9b0"],
                "fill-extrusion-height": ["interpolate", ["linear"], ["zoom"], 14.5, 0, 15.5, ["get", "h"]],
                "fill-extrusion-base": ["get", "b"],
                "fill-extrusion-opacity": 0.42,
                "fill-extrusion-vertical-gradient": true,
              } },
            ],
          },
          center: CENTER, zoom: 12.6, pitch: 0, bearing: 0,
          minZoom: 12, maxZoom: 18.5, maxPitch: 72,
          maxBounds: [[-82.79, 27.86], [-82.66, 27.972]],
          attributionControl: false,
          cooperativeGestures: true,
        });
      } catch (e) { clearTimeout(timer); fail(); return; }
      map.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: "Imagery: USGS / USDA NAIP · Buildings © OpenStreetMap contributors" }));
      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "bottom-left");
      map.on("error", () => { if (!el.classList.contains("is-ready")) { clearTimeout(timer); fail(); } });

      map.on("load", () => {
        clearTimeout(timer);
        // Marker with real logo
        const m = document.createElement("div");
        m.className = "jd-marker-root";
        m.innerHTML = '<div class="jd-marker"><span class="jd-marker__badge"><img src="assets/img/jd-logo.png" alt="JD Car Detailing"></span><span class="jd-marker__stem"></span></div>';
        const popup = new maplibregl.Popup({ offset: 46, closeButton: false, className: "jd-popup" })
          .setHTML('<b>JD Car Detailing</b><br><small>Mobile detailing · Clearwater, FL</small><br><button type="button" data-directions class="jd-popup__btn">Get directions →</button>');
        new maplibregl.Marker({ element: m, anchor: "bottom", offset: [0, -20] }).setLngLat(CENTER).setPopup(popup).addTo(map);

        el.classList.add("is-ready");
        if (tools) tools.hidden = false;
        // cinematic fly-in
        map.flyTo({ ...VIEW, duration: reduceMotion ? 0 : 4500, essential: true, curve: 1.6 });

        // slow orbit until the user interacts
        let spinning = !reduceMotion, last = 0;
        const spinBtn = tools && $('[data-map="spin"]', tools);
        const setSpin = (v) => { spinning = v; spinBtn && spinBtn.classList.toggle("is-on", v); if (v) requestAnimationFrame(orbit); };
        function orbit(t) {
          if (!spinning) return;
          if (!map.isMoving() && t - last > 30) { map.setBearing(map.getBearing() + 0.06); last = t; }
          requestAnimationFrame(orbit);
        }
        map.once("moveend", () => setSpin(spinning));
        ["mousedown", "touchstart", "wheel", "dragstart"].forEach((ev) => map.on(ev, () => setSpin(false)));

        if (tools) {
          const tiltBtn = $('[data-map="tilt"]', tools);
          tiltBtn.classList.add("is-on");
          tiltBtn.addEventListener("click", () => {
            const flat = map.getPitch() > 10;
            map.easeTo({ pitch: flat ? 0 : VIEW.pitch, bearing: flat ? 0 : VIEW.bearing, duration: 1200 });
            tiltBtn.classList.toggle("is-on", !flat);
          });
          spinBtn.addEventListener("click", () => setSpin(!spinning));
          $('[data-map="home"]', tools).addEventListener("click", () => { map.flyTo({ ...VIEW, duration: 2000 }); tiltBtn.classList.add("is-on"); });
        }
      });
    }
  })();
})();
