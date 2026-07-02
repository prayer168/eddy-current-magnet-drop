/* chrome.js — 共用版面：頁首、頁籤導覽、上一頁/下一頁、頁尾、鍵盤切換 */
(function () {
  "use strict";

  const PAGES = [
    { id: "home", file: "index.html", label: "學習任務", icon: "🏁" },
    { id: "explore", file: "explore.html", label: "原理探索", icon: "🧲" },
    { id: "lab", file: "lab.html", label: "互動實驗", icon: "🧪" },
    { id: "sim", file: "sim.html", label: "動畫模擬", icon: "🎬" },
    { id: "apply", file: "apply.html", label: "生活應用", icon: "🏠" },
    { id: "quiz", file: "quiz.html", label: "闖關大挑戰", icon: "🏆" },
    { id: "resources", file: "resources.html", label: "自主學習", icon: "📚" }
  ];

  const page = document.body.dataset.page || "home";
  const idx = PAGES.findIndex(function (p) { return p.id === page; });

  window.SITE_PAGES = PAGES;
  window.CURRENT_PAGE = page;

  function el(tag, attrs, html) {
    const node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function visited(id) {
    try {
      return window.Progress ? window.Progress.isVisited(id) : false;
    } catch (e) { return false; }
  }

  function buildHeader() {
    const header = el("header", { class: "site-header" });
    const skip = el("a", { class: "skip-link", href: "#main" }, "跳到主要內容");
    const brand = el("div", { class: "brand" },
      "<strong>磁鐵慢動作的祕密</strong><span>鋁箔紙與渦電流探究｜國中自然</span>");
    const nav = el("nav", { class: "tab-nav", "aria-label": "教材單元" });

    PAGES.forEach(function (p) {
      const a = el("a", { href: p.file },
        p.icon + " " + p.label + (visited(p.id) && p.id !== page ? ' <span class="done-mark" aria-label="已完成">✓</span>' : ""));
      if (p.id === page) a.setAttribute("aria-current", "page");
      nav.appendChild(a);
    });

    header.appendChild(skip);
    header.appendChild(brand);
    header.appendChild(nav);
    document.getElementById("chrome-header").appendChild(header);
  }

  function buildFooter() {
    const wrap = document.getElementById("chrome-footer");

    // 上一頁 / 下一頁
    const pager = el("div", { class: "pager container", style: "padding-top:0;padding-bottom:20px;" });
    if (idx > 0) {
      const prev = PAGES[idx - 1];
      pager.appendChild(el("a", { href: prev.file, rel: "prev" }, "← " + prev.label));
    }
    pager.appendChild(el("span", { class: "spacer", "aria-hidden": "true" }));
    if (idx >= 0 && idx < PAGES.length - 1) {
      const next = PAGES[idx + 1];
      pager.appendChild(el("a", { href: next.file, rel: "next" }, next.label + " →"));
    }
    wrap.appendChild(pager);

    const footer = el("footer", { class: "site-footer" },
      "磁鐵慢動作的祕密——鋁箔紙與渦電流探究｜國中自然科互動教材｜MIT License｜" +
      '<a href="https://github.com/prayer168/eddy-current-magnet-drop" rel="noopener" target="_blank">GitHub</a>');
    wrap.appendChild(footer);
  }

  // 鍵盤左右方向鍵切換單元（輸入框中不觸發）
  function bindKeys() {
    document.addEventListener("keydown", function (e) {
      if (e.target.matches("input, textarea, select")) return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "ArrowRight" && idx < PAGES.length - 1) location.href = PAGES[idx + 1].file;
      if (e.key === "ArrowLeft" && idx > 0) location.href = PAGES[idx - 1].file;
    });
  }

  buildHeader();
  buildFooter();
  bindKeys();
})();
