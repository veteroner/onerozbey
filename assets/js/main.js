(() => {
  const DATA_URL = "data/cv.json";

  // Resolve a dotted path like "personal.fullName" or "education.0.school" against an object.
  const resolve = (obj, path) =>
    path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);

  // Theme handling — persisted in localStorage.
  const initTheme = () => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = stored || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
    const btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.addEventListener("click", () => {
        const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
      });
    }
  };

  // Active-link highlighting based on the current pathname.
  const markActiveLink = () => {
    const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll(".nav-links a").forEach((a) => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      if (href === here || (here === "" && href === "index.html")) a.classList.add("is-active");
    });
  };

  // Wire print buttons (works on both pages where they exist).
  const wirePrint = () => {
    document.querySelectorAll("#print-btn, #print-btn-secondary").forEach((b) =>
      b.addEventListener("click", () => window.print())
    );
  };

  // ----- Renderers per data-bind target -----
  const renderers = {
    nav: (el, data) => {
      el.innerHTML = "";
      (data.site?.navItems || []).forEach((item) => {
        const a = document.createElement("a");
        a.href = item.href;
        a.textContent = item.label;
        el.appendChild(a);
      });
    },

    summary: (el, data) => {
      el.innerHTML = "";
      (data.summary || []).forEach((p) => {
        const node = document.createElement("p");
        node.textContent = p;
        el.appendChild(node);
      });
    },

    highlights: (el, data) => {
      el.innerHTML = "";
      (data.highlights || []).forEach((h) => {
        const li = document.createElement("li");
        li.innerHTML = `<span class="stat-value"></span><span class="stat-label"></span>`;
        li.querySelector(".stat-value").textContent = h.value;
        li.querySelector(".stat-label").textContent = h.label;
        el.appendChild(li);
      });
    },

    experienceShort: (el, data) => {
      el.innerHTML = "";
      (data.experience || []).forEach((job) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <div class="tl-period"></div>
          <div class="tl-title"></div>
        `;
        li.querySelector(".tl-period").textContent = job.period;
        const t = li.querySelector(".tl-title");
        t.textContent = job.title;
        if (job.current) {
          t.classList.add("is-current");
          t.textContent += " — Şu an";
        }
        el.appendChild(li);
      });
    },

    experience: (el, data) => {
      el.innerHTML = "";
      (data.experience || []).forEach((job) => {
        const li = document.createElement("li");
        if (job.current) li.classList.add("is-current");
        const head = document.createElement("div");
        head.className = "tl-head";
        const title = document.createElement("h3");
        title.className = "tl-title";
        title.textContent = job.title;
        head.appendChild(title);
        if (job.current) {
          const pill = document.createElement("span");
          pill.className = "current-pill";
          pill.textContent = "Güncel";
          head.appendChild(pill);
        }
        const period = document.createElement("span");
        period.className = "tl-period";
        period.textContent = job.period;
        head.appendChild(period);
        li.appendChild(head);

        if (job.details && job.details.length) {
          const ul = document.createElement("ul");
          ul.className = "tl-details";
          job.details.forEach((d) => {
            const i = document.createElement("li");
            i.textContent = d;
            ul.appendChild(i);
          });
          li.appendChild(ul);
        }
        el.appendChild(li);
      });
    },

    education: (el, data) => {
      el.innerHTML = "";
      (data.education || []).forEach((e) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <div class="edu-school"></div>
          <div class="edu-meta"></div>
          <div class="edu-degree"></div>
        `;
        li.querySelector(".edu-school").textContent = e.school;
        li.querySelector(".edu-meta").textContent = [e.location, e.period].filter(Boolean).join(" · ");
        li.querySelector(".edu-degree").textContent = e.degree;
        el.appendChild(li);
      });
    },

    languages: (el, data) => {
      el.innerHTML = "";
      (data.languages || []).forEach((l) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <div class="lang-head">
            <span class="lang-name"></span>
            <span class="lang-level"></span>
          </div>
          <div class="lang-bar"><span></span></div>
        `;
        li.querySelector(".lang-name").textContent = l.name;
        li.querySelector(".lang-level").textContent = l.level;
        const fill = li.querySelector(".lang-bar > span");
        const pct = Math.max(0, Math.min(100, Number(l.percent) || 0));
        fill.style.width = pct + "%";
        el.appendChild(li);
      });
    },

    skills: (el, data) => {
      el.innerHTML = "";
      (data.skills || []).forEach((s) => {
        const card = document.createElement("div");
        card.className = "skill-card";
        const h = document.createElement("h3");
        h.textContent = s.group;
        card.appendChild(h);
        const ul = document.createElement("ul");
        (s.items || []).forEach((it) => {
          const li = document.createElement("li");
          li.textContent = it;
          ul.appendChild(li);
        });
        card.appendChild(ul);
        el.appendChild(card);
      });
    },

    achievements: (el, data) => {
      el.innerHTML = "";
      (data.achievements || []).forEach((a) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span class="ach-year"></span>
          <div class="ach-title"></div>
          <div class="ach-place"></div>
          <span class="ach-role"></span>
        `;
        li.querySelector(".ach-year").textContent = a.year;
        li.querySelector(".ach-title").textContent = a.title;
        li.querySelector(".ach-place").textContent = a.place;
        li.querySelector(".ach-role").textContent = a.role;
        el.appendChild(li);
      });
    },

    workingLife: (el, data) => {
      el.innerHTML = "";
      (data.workingLife || []).forEach((p) => {
        const li = document.createElement("li");
        li.textContent = p;
        el.appendChild(li);
      });
    },
  };

  // Apply [data-bind="path"] — set text from a resolved value, or call a named renderer.
  const applyTextBindings = (data) => {
    document.querySelectorAll("[data-bind]").forEach((el) => {
      const key = el.getAttribute("data-bind");
      if (renderers[key]) {
        renderers[key](el, data);
        return;
      }
      const value = resolve(data, key);
      if (value == null) return;
      if (el.tagName === "A" && !el.hasAttribute("data-keep-href")) {
        el.textContent = String(value);
      } else {
        el.textContent = String(value);
      }
    });
  };

  // Apply [data-bind-attr="attr:expr"] — supports plain paths and prefixed values like "mailto:personal.email".
  const applyAttrBindings = (data) => {
    document.querySelectorAll("[data-bind-attr], [data-bind-attr-alt]").forEach((el) => {
      // Generic: data-bind-attr="attrName:expr" can repeat by space-separation
      const raw = el.getAttribute("data-bind-attr");
      if (raw) {
        raw.split(/\s+/).forEach((pair) => {
          const idx = pair.indexOf(":");
          if (idx < 0) return;
          const attr = pair.slice(0, idx);
          const expr = pair.slice(idx + 1);
          el.setAttribute(attr, evalExpr(expr, data));
        });
      }
      // Convenience alias for alt text
      const altPath = el.getAttribute("data-bind-attr-alt");
      if (altPath) {
        const v = resolve(data, altPath);
        if (v != null) el.setAttribute("alt", String(v));
      }
    });
  };

  // Expression: either a path ("personal.cvFile") or "prefix:path" (e.g. "mailto:personal.email", "tel:personal.phoneRaw").
  const evalExpr = (expr, data) => {
    const m = expr.match(/^(mailto|tel|https?|sms):(.+)$/);
    if (m) {
      const prefix = m[1];
      const v = resolve(data, m[2]);
      return v != null ? `${prefix}:${v}` : "";
    }
    const v = resolve(data, expr);
    return v != null ? String(v) : "";
  };

  const showError = (message) => {
    const main = document.querySelector("main") || document.body;
    const box = document.createElement("div");
    box.style.cssText =
      "max-width:560px;margin:3rem auto;padding:1.25rem 1.5rem;border:1px solid #e5b7b9;background:#fff5f5;color:#6a1417;border-radius:12px;font-family:system-ui;";
    box.innerHTML = `<strong>İçerik yüklenemedi.</strong><br><small style="opacity:.8">${message}</small>`;
    main.prepend(box);
  };

  document.addEventListener("DOMContentLoaded", async () => {
    initTheme();
    wirePrint();
    try {
      const res = await fetch(DATA_URL, { cache: "no-cache" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      applyTextBindings(data);
      applyAttrBindings(data);
      markActiveLink();
      // Update page title with the person's name once data is available.
      const name = resolve(data, "personal.fullName");
      if (name && document.title.includes("—") === false) document.title = `${name} — Kişisel Sayfa`;
    } catch (err) {
      console.error("CV verisi yüklenemedi:", err);
      if (location.protocol === "file:") {
        showError(
          "Sayfa <code>file://</code> üzerinden açıldığı için JSON verisi okunamıyor. Yerelde " +
            "test etmek için klasörde basit bir HTTP sunucusu çalıştırın: " +
            "<code>python3 -m http.server</code> ardından <code>http://localhost:8000</code>"
        );
      } else {
        showError(err.message || String(err));
      }
    }
  });
})();
