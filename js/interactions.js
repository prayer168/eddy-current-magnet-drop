/* interactions.js — 磁鐵測試（explore）、落管實驗（lab）、五階段模擬（sim） */
(function () {
  "use strict";

  const Interactions = {};
  const LBL = 'font-family="Noto Sans TC, Microsoft JhengHei, sans-serif"';

  /* ================================================================
     ① 原理探索：磁鐵吸什麼？點擊測試
  ================================================================ */
  const TESTER_ICONS = {
    nail: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="28" y="10" width="8" height="38" fill="#8d99a5"/><rect x="20" y="6" width="24" height="7" rx="2" fill="#6b7885"/><path d="M28 48 l4 10 l4 -10 z" fill="#8d99a5"/></svg>',
    foil: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 20 l10 -6 l8 6 l8 -6 l8 6 l8 -6 l8 6 v28 h-50 z" fill="#cfd8dc" stroke="#90a4ae"/><path d="M14 26 l8 4 M30 24 l8 5 M44 26 l6 4" stroke="#eceff1" stroke-width="2"/></svg>',
    coin: '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="20" fill="#e8c982" stroke="#c9a24e" stroke-width="3"/><text x="32" y="39" text-anchor="middle" font-size="18" fill="#a3792c" ' + LBL + '>1</text></svg>',
    clip: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M24 46 V18 a8 8 0 0 1 16 0 v24 a5 5 0 0 1 -10 0 V22" fill="none" stroke="#78909c" stroke-width="4" stroke-linecap="round"/></svg>',
    eraser: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="12" y="24" width="40" height="20" rx="4" fill="#ef9a9a" stroke="#e57373"/><rect x="12" y="24" width="14" height="20" rx="4" fill="#90caf9" stroke="#64b5f6"/></svg>',
    spoon: '<svg viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="32" cy="16" rx="10" ry="12" fill="#cfd8dc" stroke="#90a4ae"/><rect x="29" y="26" width="6" height="30" rx="3" fill="#b0bec5" stroke="#90a4ae"/></svg>'
  };

  Interactions.initTester = function (container, items) {
    const grid = document.createElement("div");
    grid.className = "tester-grid";
    const why = document.createElement("div");
    why.className = "tester-why";
    why.setAttribute("aria-live", "polite");
    why.textContent = "點一個物品，看看磁鐵吸不吸得住！";

    let answered = 0;
    items.forEach(function (item) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tester-item";
      btn.setAttribute("aria-label", item.name + "：點擊測試磁鐵是否吸得住");
      btn.innerHTML = (TESTER_ICONS[item.id] || "") +
        "<span>" + item.name + "</span><span class='verdict'></span>";
      btn.addEventListener("click", function () {
        if (btn.classList.contains("is-yes") || btn.classList.contains("is-no")) {
          why.textContent = item.why;
          return;
        }
        btn.classList.add(item.magnetic ? "is-yes" : "is-no");
        btn.querySelector(".verdict").textContent = item.magnetic ? "吸得住 ✓" : "吸不住 ✗";
        why.textContent = item.why;
        answered++;
        if (answered === items.length) {
          why.innerHTML = "<b>全部測完了！</b>發現了嗎——鋁箔紙「吸不住」，卻是本課的主角。因為它雖然沒有磁性，卻很會「導電」，這正是渦電流的舞台！";
        }
      });
      grid.appendChild(btn);
    });

    const reset = document.createElement("button");
    reset.type = "button";
    reset.className = "btn secondary";
    reset.textContent = "🔄 重新測試";
    reset.addEventListener("click", function () {
      answered = 0;
      grid.querySelectorAll(".tester-item").forEach(function (b) {
        b.classList.remove("is-yes", "is-no");
        b.querySelector(".verdict").textContent = "";
      });
      why.textContent = "點一個物品，看看磁鐵吸不吸得住！";
    });

    container.appendChild(grid);
    container.appendChild(why);
    const row = document.createElement("div");
    row.className = "btn-row";
    row.appendChild(reset);
    container.appendChild(row);
  };

  /* ================================================================
     ② 互動實驗：落管計時（慢動作 3 倍）
  ================================================================ */
  const SLOWMO = 3; // 慢動作倍率

  function labSceneSVG(tube, obj) {
    const isMagnet = obj.id === "magnet";
    const objSVG = isMagnet
      ? '<g id="lab-obj" class="tf"><rect x="212" y="34" width="36" height="13" fill="#ef5350"/><rect x="212" y="47" width="36" height="13" fill="#42a5f5"/>' +
        '<text x="230" y="44" text-anchor="middle" font-size="10" fill="#fff" ' + LBL + '>N</text>' +
        '<text x="230" y="57" text-anchor="middle" font-size="10" fill="#fff" ' + LBL + '>S</text></g>'
      : '<g id="lab-obj" class="tf"><rect x="213" y="36" width="34" height="24" rx="3" fill="#a1887f" stroke="#795548"/>' +
        '<path d="M216 42 h28 M216 50 h28" stroke="#8d6e63" stroke-width="1.5"/></g>';

    return '<svg viewBox="0 0 460 400" role="img" aria-label="落管實驗：' + obj.name + '從' + tube.name + '頂端落下">' +
      '<rect x="60" y="378" width="340" height="10" rx="4" fill="#90a4ae"/>' +
      '<rect x="196" y="70" width="68" height="300" rx="6" fill="' + tube.color + '" opacity="0.42" stroke="#78909c" stroke-width="2"/>' +
      '<text x="310" y="120" ' + LBL + ' font-size="14" fill="#37474f">' + tube.name + '</text>' +
      '<text x="310" y="140" ' + LBL + ' font-size="12" fill="#78909c">（' + tube.desc + '）</text>' +
      '<text x="310" y="180" ' + LBL + ' font-size="12" fill="#78909c">管長 60 cm</text>' +
      '<g id="lab-eddy" hidden>' +
      '  <g class="eddy-ring" fill="none" stroke="#f57c00" stroke-width="2.5">' +
      '    <ellipse cx="230" cy="0" rx="36" ry="8" id="lab-eddy-top"/>' +
      '    <ellipse cx="230" cy="0" rx="36" ry="8" id="lab-eddy-bot"/>' +
      '  </g>' +
      '</g>' +
      objSVG +
      '<text x="80" y="60" ' + LBL + ' font-size="12" fill="#78909c">放開點</text>' +
      '<path d="M118 56 h70" stroke="#b0bec5" stroke-width="2" stroke-dasharray="5 4"/>' +
      '</svg>';
  }

  Interactions.initLab = function (root, labData) {
    let selTube = labData.tubes[0];
    let selObj = labData.objects[0];
    let running = false;
    let rafId = null;
    const results = {}; // key: tubeId + "-" + objId -> time

    const view = root.querySelector("#lab-view");
    const timerEl = root.querySelector("#lab-timer");
    const dropBtn = root.querySelector("#lab-drop");
    const resetBtn = root.querySelector("#lab-reset");
    const feedback = root.querySelector("#lab-feedback");
    const tableBody = root.querySelector("#lab-table tbody");

    function renderScene() {
      view.innerHTML = labSceneSVG(selTube, selObj);
    }

    function renderTable() {
      tableBody.innerHTML = "";
      const magnetTimes = labData.tubes
        .map(function (t) { return results[t.id + "-magnet"]; })
        .filter(function (v) { return v !== undefined; });
      const maxMag = magnetTimes.length ? Math.max.apply(null, magnetTimes) : null;

      labData.tubes.forEach(function (t) {
        const m = results[t.id + "-magnet"];
        const w = results[t.id + "-wood"];
        const tr = document.createElement("tr");
        const mCell = (m !== undefined) ? m.toFixed(2) + " 秒" : "—";
        const isBest = (m !== undefined && maxMag !== null && m === maxMag && magnetTimes.length > 1);
        tr.innerHTML = "<td>" + t.name + "</td>" +
          "<td" + (isBest ? ' class="best"' : "") + ">" + mCell + (isBest ? "（最慢！）" : "") + "</td>" +
          "<td>" + ((w !== undefined) ? w.toFixed(2) + " 秒" : "—") + "</td>";
        tableBody.appendChild(tr);
      });
    }

    function checkComplete() {
      const allMagnet = labData.tubes.every(function (t) { return results[t.id + "-magnet"] !== undefined; });
      if (allMagnet) {
        const predSel = root.querySelector('input[name="lab-predict"]:checked');
        let predMsg = "";
        if (predSel) {
          const correct = predSel.value === "copper";
          predMsg = correct
            ? "🎯 你的預測正確——銅管最慢！"
            : "你原本預測「" + predSel.dataset.name + "」最慢，實驗結果是銅管最慢。修正想法也是科學探究重要的一步！";
        }
        feedback.innerHTML = "<b>實驗完成！</b>" + predMsg + "<br>" + labData.conclusion;
        feedback.hidden = false;
      }
    }

    function run() {
      if (running) return;
      running = true;
      dropBtn.disabled = true;

      const time = (selObj.id === "magnet") ? selTube.magnetTime : selTube.woodTime;
      const animDur = time * SLOWMO;
      const objG = view.querySelector("#lab-obj");
      const eddyG = view.querySelector("#lab-eddy");

      // 只有磁鐵在導體管中才顯示渦電流
      const showEddy = selObj.id === "magnet" && selTube.id !== "plastic";
      if (showEddy) eddyG.removeAttribute("hidden");

      objG.style.setProperty("--fall-dur", animDur + "s");
      objG.style.setProperty("--fall-dist", "300px");
      objG.classList.add("lab-falling");

      const t0 = performance.now();
      function tick(now) {
        const p = Math.min((now - t0) / (animDur * 1000), 1);
        timerEl.textContent = (p * time).toFixed(2) + " 秒";
        // 渦電流圈跟著磁鐵位置
        if (showEddy) {
          const y = 60 + p * 300;
          const top = view.querySelector("#lab-eddy-top");
          const bot = view.querySelector("#lab-eddy-bot");
          if (top) top.setAttribute("cy", Math.max(y - 34, 78));
          if (bot) bot.setAttribute("cy", Math.min(y + 34, 362));
        }
        if (p < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          running = false;
          dropBtn.disabled = false;
          results[selTube.id + "-" + selObj.id] = time;
          renderTable();
          checkComplete();
        }
      }
      rafId = requestAnimationFrame(tick);
    }

    function resetScene() {
      if (rafId) cancelAnimationFrame(rafId);
      running = false;
      dropBtn.disabled = false;
      timerEl.textContent = "0.00 秒";
      renderScene();
    }

    root.querySelectorAll('input[name="lab-tube"]').forEach(function (r) {
      r.addEventListener("change", function () {
        selTube = labData.tubes.find(function (t) { return t.id === r.value; });
        resetScene();
      });
    });
    root.querySelectorAll('input[name="lab-obj"]').forEach(function (r) {
      r.addEventListener("change", function () {
        selObj = labData.objects.find(function (o) { return o.id === r.value; });
        resetScene();
      });
    });

    dropBtn.addEventListener("click", run);
    resetBtn.addEventListener("click", function () {
      Object.keys(results).forEach(function (k) { delete results[k]; });
      feedback.hidden = true;
      renderTable();
      resetScene();
    });

    renderScene();
    renderTable();
  };

  /* ================================================================
     ③ 動畫模擬：五階段（圖、流程列、文字同步）
     SVG 圖層切換一律使用 setAttribute/removeAttribute("hidden")
  ================================================================ */

  function tubeSVG(x, color, label) {
    return '<rect x="' + x + '" y="80" width="64" height="240" rx="6" fill="' + color + '" opacity="0.42" stroke="#78909c" stroke-width="2"/>' +
      '<text x="' + (x + 32) + '" y="340" text-anchor="middle" ' + LBL + ' font-size="13" fill="#37474f">' + label + '</text>';
  }
  function magnetSVG(cx, cy, extraClass) {
    return '<g class="tf ' + (extraClass || "") + '">' +
      '<rect x="' + (cx - 17) + '" y="' + cy + '" width="34" height="13" fill="#ef5350"/>' +
      '<rect x="' + (cx - 17) + '" y="' + (cy + 13) + '" width="34" height="13" fill="#42a5f5"/>' +
      '<text x="' + cx + '" y="' + (cy + 10) + '" text-anchor="middle" font-size="10" fill="#fff" ' + LBL + '>N</text>' +
      '<text x="' + cx + '" y="' + (cy + 23) + '" text-anchor="middle" font-size="10" fill="#fff" ' + LBL + '>S</text></g>';
  }
  function eddyRing(cx, cy, dir) {
    // dir: 1 順時針箭頭在右、-1 逆時針箭頭在左
    const ax = dir > 0 ? cx + 36 : cx - 36;
    const tri = dir > 0
      ? '<path d="M' + ax + ' ' + (cy - 3) + ' l7 3 l-7 4 z" fill="#f57c00"/>'
      : '<path d="M' + ax + ' ' + (cy - 3) + ' l-7 3 l7 4 z" fill="#f57c00"/>';
    return '<g class="eddy-ring"><ellipse cx="' + cx + '" cy="' + cy + '" rx="36" ry="9" fill="none" stroke="#f57c00" stroke-width="3"/>' + tri + "</g>";
  }
  function labelText(x, y, txt, color, size, anchor) {
    return '<text x="' + x + '" y="' + y + '" ' + LBL + ' font-size="' + (size || 13) + '" fill="' + (color || "#37474f") + '"' +
      (anchor ? ' text-anchor="' + anchor + '"' : "") + ">" + txt + "</text>";
  }

  function buildSimSVG() {
    const TX = 208; // 主管左緣 x（中心 240）
    const C = 240;
    let s = '<svg class="sim-stage-svg" viewBox="0 0 620 360" role="img" aria-label="磁鐵落入鋁箔管的五階段模擬動畫">';

    /* ---------- 階段 1：放開磁鐵 ---------- */
    s += '<g class="sim-svg-group" data-stage="s1">';
    s += tubeSVG(TX, "#cfd8dc", "鋁箔管");
    s += magnetSVG(C, 30);
    // 磁力線（磁鐵周圍橢圓迴圈）
    s += '<g fill="none" stroke="#90a4ae" stroke-width="1.8" opacity="0.9">' +
      '<ellipse cx="240" cy="43" rx="42" ry="26"/><ellipse cx="240" cy="43" rx="62" ry="40"/>' +
      '<path d="M282 40 l4 5 l-7 2 z" fill="#90a4ae"/><path d="M198 46 l-4 -5 l7 -2 z" fill="#90a4ae"/></g>';
    s += labelText(322, 40, "強力磁鐵", "#c62828", 14);
    s += labelText(322, 62, "周圍有磁場（磁力線）", "#78909c", 12);
    s += labelText(322, 120, "此時鋁箔內沒有電流", "#37474f", 13);
    s += labelText(90, 200, "鋁箔：不會被磁鐵吸住，", "#37474f", 12.5, "start");
    s += labelText(90, 220, "但是很會導電", "#37474f", 12.5, "start");
    s += "</g>";

    /* ---------- 階段 2：磁場改變 ---------- */
    s += '<g class="sim-svg-group" data-stage="s2" hidden>';
    s += tubeSVG(TX, "#cfd8dc", "鋁箔管");
    s += magnetSVG(C, 150);
    // 下方：磁場變強（多而實的向下箭頭）
    s += '<g class="field-arrow" stroke="#1565c0" stroke-width="3" fill="none">' +
      '<path d="M226 190 v34 M240 190 v40 M254 190 v34"/>' +
      '<path d="M222 224 l4 8 l4 -8 z" fill="#1565c0" stroke="none"/>' +
      '<path d="M236 230 l4 8 l4 -8 z" fill="#1565c0" stroke="none"/>' +
      '<path d="M250 224 l4 8 l4 -8 z" fill="#1565c0" stroke="none"/></g>';
    // 上方：磁場變弱（稀疏虛線箭頭）
    s += '<g stroke="#90caf9" stroke-width="2" fill="none" stroke-dasharray="5 4">' +
      '<path d="M233 100 v40 M247 100 v40"/></g>';
    s += labelText(322, 118, "磁鐵上方：磁場愈來愈弱", "#78909c", 13);
    s += labelText(322, 215, "磁鐵下方：磁場愈來愈強", "#1565c0", 13.5);
    s += labelText(322, 240, "「改變」是感應的關鍵！", "#e65100", 13);
    s += '<g class="force-arrow"><path d="M150 150 v26" stroke="#455a64" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M143 174 l7 12 l7 -12 z" fill="#455a64"/></g>';
    s += labelText(150, 140, "落下中", "#455a64", 12, "middle");
    s += "</g>";

    /* ---------- 階段 3：產生渦電流 ---------- */
    s += '<g class="sim-svg-group" data-stage="s3" hidden>';
    s += tubeSVG(TX, "#cfd8dc", "鋁箔管");
    s += magnetSVG(C, 150);
    s += eddyRing(C, 214, 1);
    s += eddyRing(C, 118, -1);
    s += labelText(322, 122, "上方渦電流（方向相反）", "#e65100", 13);
    s += labelText(322, 218, "下方渦電流", "#e65100", 13.5);
    s += labelText(322, 244, "磁場改變 → 鋁箔感應出", "#37474f", 13);
    s += labelText(322, 264, "繞圈流動的「渦電流」", "#37474f", 13);
    s += "</g>";

    /* ---------- 階段 4：冷次反抗 ---------- */
    s += '<g class="sim-svg-group" data-stage="s4" hidden>';
    s += tubeSVG(TX, "#cfd8dc", "鋁箔管");
    s += magnetSVG(C, 150);
    s += eddyRing(C, 214, 1);
    s += eddyRing(C, 118, -1);
    // 向上合力箭頭
    s += '<g class="force-arrow"><path d="M240 148 v-34" stroke="#c62828" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M231 118 l9 -18 l9 18 z" fill="#c62828"/></g>';
    s += labelText(150, 108, "電磁阻力", "#c62828", 14, "middle");
    // 推與拉
    s += labelText(322, 226, "下方渦電流像「同極」→ 往上推", "#c62828", 13);
    s += labelText(322, 116, "上方渦電流像「異極」→ 往回拉", "#c62828", 13);
    s += labelText(322, 260, "一推一拉都反抗落下", "#37474f", 13);
    s += labelText(322, 282, "＝冷次定律：反抗變化", "#e65100", 13.5);
    s += "</g>";

    /* ---------- 階段 5：結果比較 ---------- */
    s += '<g class="sim-svg-group" data-stage="s5" hidden>';
    // 塑膠管（左）
    s += tubeSVG(140, "#b0bec5", "塑膠管");
    s += '<g class="sim-magnet-fast">' + magnetSVG(172, 88, "") + "</g>";
    s += labelText(172, 70, "咻——快！", "#455a64", 13, "middle");
    // 鋁箔管（右）
    s += tubeSVG(400, "#cfd8dc", "鋁箔管");
    s += '<g class="sim-magnet-slow">' + magnetSVG(432, 88, "") + "</g>";
    s += labelText(432, 70, "慢～動～作", "#e65100", 13, "middle");
    s += '<g class="heat-wave" stroke="#ef5350" stroke-width="2.5" fill="none" stroke-linecap="round">' +
      '<path d="M478 220 q4 -8 0 -15"/><path d="M478 180 q4 -8 0 -15"/></g>';
    s += labelText(492, 205, "動能→熱能", "#c62828", 12, "start");
    s += labelText(285, 200, "同時放開", "#37474f", 13, "middle");
    s += labelText(285, 222, "兩顆磁鐵", "#37474f", 13, "middle");
    s += "</g>";

    s += "</svg>";
    return s;
  }

  Interactions.initSim = function (root, stages) {
    const svgWrap = root.querySelector("#sim-svg-wrap");
    svgWrap.innerHTML = buildSimSVG();

    const flow = root.querySelector("#sim-flow");
    const textBox = root.querySelector("#sim-text");
    const playBtn = root.querySelector("#sim-play");
    const prevBtn = root.querySelector("#sim-prev");
    const nextBtn = root.querySelector("#sim-next");
    const resetBtn = root.querySelector("#sim-reset");

    let cur = 0;
    let timer = null;

    // 建立流程列
    stages.forEach(function (st, i) {
      if (i > 0) {
        const arrow = document.createElement("span");
        arrow.className = "arrow";
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "→";
        flow.appendChild(arrow);
      }
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = (i + 1) + " " + st.label;
      b.addEventListener("click", function () { stopAuto(); show(i); });
      flow.appendChild(b);
    });

    function show(i) {
      cur = i;
      // SVG 圖層：attribute 切換（勿用 element.hidden）
      svgWrap.querySelectorAll(".sim-svg-group").forEach(function (g) {
        if (g.getAttribute("data-stage") === stages[i].id) {
          g.removeAttribute("hidden");
        } else {
          g.setAttribute("hidden", "");
        }
      });
      // 流程列
      flow.querySelectorAll("button").forEach(function (b, bi) {
        if (bi === i) b.setAttribute("aria-current", "step");
        else b.removeAttribute("aria-current");
      });
      // 文字
      textBox.innerHTML = "<h3>" + stages[i].title + "</h3><p>" + stages[i].text + "</p>";
      prevBtn.disabled = i === 0;
      nextBtn.disabled = i === stages.length - 1;
    }

    function stopAuto() {
      if (timer) { clearInterval(timer); timer = null; }
      playBtn.textContent = "▶ 自動播放";
    }

    playBtn.addEventListener("click", function () {
      if (timer) { stopAuto(); return; }
      playBtn.textContent = "⏸ 暫停";
      if (cur === stages.length - 1) show(0);
      timer = setInterval(function () {
        if (cur < stages.length - 1) show(cur + 1);
        else stopAuto();
      }, 5000);
    });
    prevBtn.addEventListener("click", function () { stopAuto(); if (cur > 0) show(cur - 1); });
    nextBtn.addEventListener("click", function () { stopAuto(); if (cur < stages.length - 1) show(cur + 1); });
    resetBtn.addEventListener("click", function () { stopAuto(); show(0); });

    show(0);
  };

  window.Interactions = Interactions;
})();
