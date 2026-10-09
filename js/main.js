/* raakthh portfolio: rendering and interactions (vanilla JS) */
(function () {
  "use strict";

  var D = window.PORTFOLIO;
  var doc = document;
  doc.documentElement.classList.add("js");

  function $(sel, root) { return (root || doc).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); }
  function el(tag, props, children) {
    var node = doc.createElement(tag);
    props = props || {};
    Object.keys(props).forEach(function (k) {
      if (k === "class") node.className = props[k];
      else if (k === "text") node.textContent = props[k];
      else node.setAttribute(k, props[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }
  function linkEl(link, cls) {
    return el("a", {
      "class": cls || "btn btn-secondary",
      href: link.url,
      target: "_blank",
      rel: "noopener noreferrer",
      text: link.label
    });
  }
  function placeholder(title) {
    return el("div", { "class": "ph" }, [
      el("strong", { text: title }),
      el("span", { text: "Screenshot coming soon" })
    ]);
  }
  function media(p) {
    if (p.image) {
      var img = el("img", { src: p.image, alt: p.title + " screenshot", loading: "lazy" });
      img.addEventListener("error", function () {
        img.replaceWith(placeholder(p.title));
      });
      return img;
    }
    return placeholder(p.title);
  }

  /* ----- Hero / about ----- */
  $("#tagline").textContent = D.tagline;
  $("#intro").textContent = D.intro;
  var aboutBody = $("#aboutBody");
  D.about.forEach(function (t) { aboutBody.appendChild(el("p", { text: t })); });
  $("#year").textContent = new Date().getFullYear();

  /* Profile image: show only if the file loads, otherwise keep the placeholder */
  (function () {
    var img = $("#profileImg");
    var probe = new Image();
    probe.onload = function () {
      img.src = D.profileImage;
      img.hidden = false;
      $("#avatarFallback").hidden = true;
    };
    probe.src = D.profileImage;
  })();

  /* CV button: reveal only when a real PDF exists */
  (function () {
    var btn = $("#cvButton");
    btn.setAttribute("href", D.cv.path);
    if (!window.fetch) return;
    fetch(D.cv.path, { method: "HEAD" })
      .then(function (r) {
        var type = r.headers.get("content-type") || "";
        if (r.ok && type.indexOf("pdf") !== -1) btn.hidden = false;
      })
      .catch(function () { /* stays hidden */ });
  })();

  /* ----- Projects ----- */
  var grid = $("#projectGrid");
  var filters = $("#filters");
  var activeFilter = "All";
  var lastFocus = null;

  function renderProjects() {
    grid.textContent = "";
    D.projects.forEach(function (p) {
      var actions = el("div", { "class": "card-actions" });
      var details = el("button", { "class": "btn btn-primary", type: "button", "data-id": p.id, text: "Details" });
      details.setAttribute("aria-label", "View details for " + p.title);
      actions.appendChild(details);
      p.links.forEach(function (l) { actions.appendChild(linkEl(l)); });

      var tags = el("ul", { "class": "tags", "aria-label": "Project topics" });
      p.tags.forEach(function (t) { tags.appendChild(el("li", { text: t })); });

      var card = el("article", { "class": "card reveal", "data-categories": p.categories.join("|") }, [
        el("div", { "class": "card-media" }, [media(p)]),
        el("div", { "class": "card-body" }, [
          el("h3", { text: p.title }),
          el("p", { "class": "card-subtitle", text: p.subtitle }),
          el("p", { "class": "card-summary", text: p.summary }),
          tags,
          actions
        ])
      ]);
      grid.appendChild(card);
    });
    observeReveals();
  }

  function renderFilters() {
    D.categories.forEach(function (c) {
      var b = el("button", { "class": "filter-btn", type: "button", "data-filter": c, "aria-pressed": c === "All" ? "true" : "false", text: c });
      filters.appendChild(b);
    });
    filters.addEventListener("click", function (e) {
      var b = e.target.closest(".filter-btn");
      if (!b) return;
      activeFilter = b.getAttribute("data-filter");
      $all(".filter-btn", filters).forEach(function (x) {
        x.setAttribute("aria-pressed", x === b ? "true" : "false");
      });
      applyFilter();
    });
  }

  function applyFilter() {
    var shown = 0;
    $all(".card", grid).forEach(function (card) {
      var cats = card.getAttribute("data-categories").split("|");
      var match = activeFilter === "All" || cats.indexOf(activeFilter) !== -1;
      card.hidden = !match;
      if (match) {
        card.style.setProperty("--fd", shown * 60 + "ms");
        card.classList.remove("fx-in"); void card.offsetWidth; card.classList.add("fx-in");
        shown++; card.classList.add("visible");
      }
    });
    var msg = $("#emptyMsg");
    if (!shown && !msg) {
      grid.parentNode.appendChild(el("p", { id: "emptyMsg", "class": "empty", text: "No projects in this category yet." }));
    } else if (shown && msg) {
      msg.remove();
    }
  }

  /* ----- Modal ----- */
  var modal = $("#projectModal");
  var modalCard = $(".modal-card", modal);

  function openModal(id, trigger) {
    var p = D.projects.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    lastFocus = trigger || doc.activeElement;
    $("#modalTitle").textContent = p.title;
    $("#modalSubtitle").textContent = p.subtitle;
    $("#modalSummary").textContent = p.summary;
    var mm = $("#modalMedia"); mm.textContent = "";
    if (p.image) mm.appendChild(media(p));
    var dl = $("#modalDetails"); dl.textContent = "";
    p.details.forEach(function (d) { dl.appendChild(el("li", { text: d })); });
    var tg = $("#modalTags"); tg.textContent = "";
    p.tags.forEach(function (t) { tg.appendChild(el("li", { text: t })); });
    var ml = $("#modalLinks"); ml.textContent = "";
    p.links.forEach(function (l, i) { ml.appendChild(linkEl(l, i === 0 ? "btn btn-primary" : "btn btn-secondary")); });
    modal.hidden = false;
    doc.body.classList.add("modal-open");
    modalCard.focus();
  }
  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    doc.body.classList.remove("modal-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  grid.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-id]");
    if (b) openModal(b.getAttribute("data-id"), b);
  });
  modal.addEventListener("click", function (e) {
    if (e.target.hasAttribute("data-close")) closeModal();
  });
  doc.addEventListener("keydown", function (e) {
    if (modal.hidden) return;
    if (e.key === "Escape") { closeModal(); return; }
    if (e.key === "Tab") { /* keep focus inside the dialog */
      var f = $all("a[href], button:not([disabled])", modal).filter(function (n) { return n.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (doc.activeElement === first || doc.activeElement === modalCard)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ----- Experience ----- */
  var tl = $("#timeline");
  D.experience.forEach(function (x) {
    tl.appendChild(el("li", { "class": "reveal" }, [
      el("h3", { text: x.role }),
      el("p", { "class": "org", text: x.org }),
      el("p", { text: x.description })
    ]));
  });

  /* ----- Skills ----- */
  var sg = $("#skillsGrid");
  D.skills.forEach(function (g) {
    var list = el("ul", { "class": "tags" });
    g.items.forEach(function (i) { list.appendChild(el("li", { text: i })); });
    sg.appendChild(el("div", { "class": "skill-card reveal" }, [el("h3", { text: g.group }), list]));
  });

  /* ----- Contact ----- */
  var cg = $("#contactGrid");
  D.contacts.forEach(function (c) {
    var props = { "class": "contact-card reveal", href: c.url };
    if (c.external) { props.target = "_blank"; props.rel = "noopener noreferrer"; }
    props["aria-label"] = c.label + ": " + c.value;
    cg.appendChild(el("a", props, [
      el("span", { "class": "label", text: c.label }),
      el("span", { "class": "value", text: c.value })
    ]));
  });

  /* ----- Theme toggle ----- */
  var root = doc.documentElement;
  var themeBtn = $("#themeToggle");
  function syncThemeLabel() {
    var dark = root.getAttribute("data-theme") === "dark";
    themeBtn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  }
  themeBtn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("raakthh-theme", next); } catch (e) {}
    syncThemeLabel();
  });
  syncThemeLabel();

  /* ----- Mobile menu ----- */
  var toggle = $("#navToggle");
  var menu = $("#navMenu");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  toggle.addEventListener("click", function () { setMenu(!menu.classList.contains("open")); });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("open")) { setMenu(false); toggle.focus(); }
  });

  /* ----- Active nav state ----- */
  var links = $all(".nav-link");
  var sections = links.map(function (a) { return $(a.getAttribute("href")); }).filter(Boolean);
  function updateActive() {
    var y = window.scrollY + 120;
    var current = sections[0];
    sections.forEach(function (s) { if (s.offsetTop <= y) current = s; });
    if (window.innerHeight + window.scrollY >= doc.body.scrollHeight - 4) current = sections[sections.length - 1];
    links.forEach(function (a) {
      var on = current && a.getAttribute("href") === "#" + current.id;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }

  /* ----- Back to top ----- */
  var topBtn = $("#backToTop");
  topBtn.addEventListener("click", function () {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });
  function onScroll() {
    topBtn.hidden = window.scrollY < 500;
    updateActive();
    updateChrome();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateActive);

  /* ----- Reveal on scroll ----- */
  var io = null;
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver(function (entries) {
      var n = 0; /* stagger elements that enter together */
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var t = en.target, d = Math.min(n++, 8) * 90;
        t.style.transitionDelay = d + "ms";
        t.classList.add("visible");
        io.unobserve(t);
        setTimeout(function () { t.style.transitionDelay = ""; }, d + 900);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  }
  function observeReveals() {
    $all(".reveal:not(.visible)").forEach(function (n) {
      if (io) io.observe(n); else n.classList.add("visible");
    });
  }

  /* ===== FX: premium animation layer (additive) ===== */
  var reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var finePointer = !!(window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  var fxBar = null, fxHeader = null;

  function updateChrome() {
    if (fxHeader) fxHeader.classList.toggle("scrolled", window.scrollY > 12);
    if (fxBar) {
      var max = doc.documentElement.scrollHeight - window.innerHeight;
      fxBar.style.setProperty("--p", max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : 0);
    }
  }

  function initBackground() {
    var bg = el("div", { "class": "fx-bg", "aria-hidden": "true" }, [
      el("div", { "class": "fx-grid" }), el("div", { "class": "fx-glow g1" }), el("div", { "class": "fx-glow g2" }),
      el("div", { "class": "fx-spot" }), el("canvas", { "class": "fx-canvas" })
    ]);
    doc.body.insertBefore(bg, doc.body.firstChild);
    var spot = $(".fx-spot", bg), cv = $(".fx-canvas", bg);
    var ctx = cv.getContext && cv.getContext("2d");
    if (!ctx) return;
    var W = 0, H = 0, P = [], rgb = "34,211,238";
    var tx = 0.5, ty = 0.3, cx = 0.5, cy = 0.3;

    function readColor() {
      var c = getComputedStyle(root).getPropertyValue("--accent").trim().replace("#", "");
      if (c.length === 3) c = c.replace(/./g, "$&$&");
      var n = parseInt(c, 16);
      if (!isNaN(n)) rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(",");
    }
    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.min(70, Math.round(W * H / 20000));
      P = [];
      for (var i = 0; i < count; i++) {
        P.push({ x: Math.random() * W, y: Math.random() * H, r: 0.8 + Math.random() * 1.6,
          vx: (Math.random() - 0.5) * 0.3, vy: -0.08 - Math.random() * 0.32, a: 0.25 + Math.random() * 0.6 });
      }
    }
    function draw(move) {
      ctx.clearRect(0, 0, W, H);
      var i, j, p, q, d;
      for (i = 0; i < P.length; i++) {
        p = P[i];
        if (move) {
          p.x += p.vx; p.y += p.vy;
          if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
          if (p.x < -5) p.x = W + 5; else if (p.x > W + 5) p.x = -5;
        }
        ctx.fillStyle = "rgba(" + rgb + "," + p.a * 0.75 + ")";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
        for (j = i + 1; j < P.length; j++) {
          q = P[j]; d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 110) {
            ctx.strokeStyle = "rgba(" + rgb + "," + (1 - d / 110) * 0.18 + ")";
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }
    }
    function tick() {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      spot.style.setProperty("--mx", (cx * 100).toFixed(1) + "%");
      spot.style.setProperty("--my", (cy * 100).toFixed(1) + "%");
      draw(true);
      requestAnimationFrame(tick);
    }
    readColor(); resize();
    window.addEventListener("resize", function () { resize(); if (reduceMotion) draw(false); });
    if (window.MutationObserver) {
      new MutationObserver(function () { readColor(); if (reduceMotion) draw(false); })
        .observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    }
    if (reduceMotion) { draw(false); return; }
    window.addEventListener("pointermove", function (e) { tx = e.clientX / W; ty = e.clientY / H; }, { passive: true });
    requestAnimationFrame(tick);
  }

  function splitHeroTitle() {
    var h = $(".hero h1");
    if (!h) return;
    h.setAttribute("aria-label", h.textContent.replace(/\s+/g, " ").trim());
    var i = 0;
    (function walk(n) {
      Array.prototype.slice.call(n.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = doc.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(doc.createTextNode(" ")); return; }
            var w = el("span", { "class": "fx-word", "aria-hidden": "true" });
            part.split("").forEach(function (ch) {
              var s = el("span", { "class": "fx-char", text: ch });
              s.style.setProperty("--i", i++);
              w.appendChild(s);
            });
            frag.appendChild(w);
          });
          n.replaceChild(frag, c);
        } else if (c.nodeType === 1) walk(c);
      });
    })(h);
  }

  function tilt(node, max) {
    node.addEventListener("pointermove", function (e) {
      var r = node.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      node.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
      node.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
      if (!reduceMotion) {
        node.style.setProperty("--ry", ((px - 0.5) * 2 * max).toFixed(2) + "deg");
        node.style.setProperty("--rx", ((0.5 - py) * 2 * max).toFixed(2) + "deg");
      }
    });
    node.addEventListener("pointerleave", function () {
      node.style.setProperty("--rx", "0deg"); node.style.setProperty("--ry", "0deg");
    });
  }

  function initAvatar() {
    var av = $(".hero .avatar");
    if (!av) return;
    var wrap = el("div", { "class": "fx-avatar" });
    av.parentNode.insertBefore(wrap, av);
    wrap.appendChild(av);
    wrap.appendChild(el("span", { "class": "fx-ring", "aria-hidden": "true" }));
    wrap.appendChild(el("span", { "class": "fx-chip c1", "aria-hidden": "true", text: "</>" }));
    wrap.appendChild(el("span", { "class": "fx-chip c2", "aria-hidden": "true", text: "{ }" }));
    wrap.appendChild(el("span", { "class": "fx-chip c3", "aria-hidden": "true" }, [el("i"), el("i"), el("i"), el("i")]));
    if (finePointer) tilt(wrap, 10);
  }

  function initDecor() {
    var hero = $(".hero");
    if (hero) {
      var d = doc.createElement("div");
      d.innerHTML = '<svg class="fx-spark" viewBox="0 0 1200 90" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path pathLength="1" d="M0 70 C80 60 120 30 200 45 S320 80 400 55 S520 10 620 35 S760 75 840 50 S1000 15 1100 30 L1200 20"/></svg>';
      hero.appendChild(d.firstChild);
    }
    var hs = [40, 70, 55, 95, 60, 100, 45];
    $all(".section-head").forEach(function (h) {
      var deco = el("span", { "class": "fx-deco", "aria-hidden": "true" });
      hs.forEach(function (v, i) {
        var b = el("i"); b.style.height = v + "%"; b.style.setProperty("--i", i); deco.appendChild(b);
      });
      h.appendChild(deco);
    });
  }

  function initFX() {
    fxHeader = $(".site-header");
    fxBar = el("div", { "class": "fx-progress", "aria-hidden": "true" });
    doc.body.appendChild(fxBar);
    [initBackground, splitHeroTitle, initAvatar, initDecor].forEach(function (fn) {
      try { fn(); } catch (err) { /* never break the portfolio */ }
    });
    $all(".section-head, .filters, .about-body").forEach(function (n) { n.classList.add("reveal"); });
    $all(".tags").forEach(function (ul) {
      $all("li", ul).forEach(function (li, i) { li.style.setProperty("--i", i); });
    });
    if (finePointer) $all(".card", grid).forEach(function (c) { tilt(c, 6); });
    updateChrome();
  }

  renderFilters();
  renderProjects();
  initFX();
  observeReveals();
  onScroll();
})();
