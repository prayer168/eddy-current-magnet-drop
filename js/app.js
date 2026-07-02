/* app.js — 依當前頁面載入 JSON、渲染內容並啟動互動 */
(function () {
  "use strict";

  const page = document.body.dataset.page || "home";
  const main = document.getElementById("main");
  const LBL = 'font-family="Noto Sans TC, Microsoft JhengHei, sans-serif"';

  function getJSON(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(url + " 載入失敗");
      return r.json();
    });
  }

  /* ---------------- 原理探索用小圖（教學寫實、會動） ---------------- */
  const EXPLORE_FIGS = {
    induction:
      '<svg viewBox="0 0 560 190" role="img" aria-label="圖解：磁鐵移入線圈時，檢流計指針偏轉，表示產生了感應電流">' +
      '<g class="tf" style="animation: floatY 2s ease-in-out infinite; transform-box: fill-box;">' +
      '<rect x="40" y="72" width="52" height="20" fill="#ef5350"/><rect x="92" y="72" width="52" height="20" fill="#42a5f5"/>' +
      '<text x="66" y="87" text-anchor="middle" font-size="13" fill="#fff" ' + LBL + '>N</text>' +
      '<text x="118" y="87" text-anchor="middle" font-size="13" fill="#fff" ' + LBL + '>S</text></g>' +
      '<g class="force-arrow"><path d="M156 82 h44" stroke="#455a64" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M198 74 l16 8 l-16 8 z" fill="#455a64"/></g>' +
      '<text x="178" y="64" text-anchor="middle" ' + LBL + ' font-size="12" fill="#455a64">移動！</text>' +
      '<g stroke="#8d6e63" stroke-width="5" fill="none">' +
      '<path d="M236 60 a14 22 0 1 0 0 44"/><path d="M262 60 a14 22 0 1 0 0 44"/><path d="M288 60 a14 22 0 1 0 0 44"/></g>' +
      '<text x="262" y="130" text-anchor="middle" ' + LBL + ' font-size="12.5" fill="#5d4037">線圈</text>' +
      '<path d="M300 82 h60 v40 h40" stroke="#455a64" stroke-width="2.5" fill="none"/>' +
      '<path d="M236 104 v30 h80" stroke="#455a64" stroke-width="2.5" fill="none"/>' +
      '<circle cx="420" cy="122" r="34" fill="#fffde7" stroke="#f9a825" stroke-width="3"/>' +
      '<g class="anim-meter-needle" style="transform-origin: 50% 85%;">' +
      '<path d="M420 140 L420 100" stroke="#c62828" stroke-width="3.5" stroke-linecap="round"/></g>' +
      '<circle cx="420" cy="140" r="4" fill="#37474f"/>' +
      '<text x="420" y="176" text-anchor="middle" ' + LBL + ' font-size="12.5" fill="#f57f17">檢流計：指針偏轉＝有電流！</text>' +
      '<g class="eddy-ring"><circle cx="510" cy="60" r="16" fill="none" stroke="#f57c00" stroke-width="3"/>' +
      '<path d="M524 52 l6 4 l-8 4 z" fill="#f57c00"/></g>' +
      '<text x="510" y="96" text-anchor="middle" ' + LBL + ' font-size="12" fill="#e65100">感應電流</text>' +
      '</svg>',
    eddy:
      '<svg viewBox="0 0 560 190" role="img" aria-label="圖解：磁鐵在整片金屬板上方移動，金屬板內產生一圈一圈的渦電流">' +
      '<rect x="120" y="110" width="320" height="34" rx="6" fill="#cfd8dc" stroke="#90a4ae" stroke-width="2"/>' +
      '<text x="280" y="170" text-anchor="middle" ' + LBL + ' font-size="13" fill="#546e7a">一整片金屬（例如鋁箔）</text>' +
      '<g class="tf" style="animation: floatY 1.8s ease-in-out infinite;">' +
      '<rect x="230" y="34" width="46" height="16" fill="#ef5350"/><rect x="230" y="50" width="46" height="16" fill="#42a5f5"/>' +
      '<text x="253" y="47" text-anchor="middle" font-size="11" fill="#fff" ' + LBL + '>N</text>' +
      '<text x="253" y="62" text-anchor="middle" font-size="11" fill="#fff" ' + LBL + '>S</text></g>' +
      '<g class="force-arrow"><path d="M292 52 h36" stroke="#455a64" stroke-width="3.5" stroke-linecap="round"/>' +
      '<path d="M326 45 l13 7 l-13 7 z" fill="#455a64"/></g>' +
      '<g class="eddy-ring"><ellipse cx="200" cy="127" rx="30" ry="9" fill="none" stroke="#f57c00" stroke-width="3"/>' +
      '<path d="M230 123 l7 3 l-7 4 z" fill="#f57c00"/></g>' +
      '<g class="eddy-ring" style="animation-delay:0.5s"><ellipse cx="310" cy="127" rx="30" ry="9" fill="none" stroke="#f57c00" stroke-width="3"/>' +
      '<path d="M280 123 l-7 3 l7 4 z" fill="#f57c00"/></g>' +
      '<text x="255" y="98" text-anchor="middle" ' + LBL + ' font-size="12.5" fill="#e65100">金屬裡繞圈流動的渦電流</text>' +
      '</svg>',
    lenz:
      '<svg viewBox="0 0 560 190" role="img" aria-label="圖解：磁鐵落入鋁箔管，下方渦電流把它往上推、上方渦電流把它往回拉，落下變慢">' +
      '<rect x="248" y="20" width="64" height="150" rx="6" fill="#cfd8dc" opacity="0.45" stroke="#78909c" stroke-width="2"/>' +
      '<g><rect x="263" y="80" width="34" height="12" fill="#ef5350"/><rect x="263" y="92" width="34" height="12" fill="#42a5f5"/>' +
      '<text x="280" y="90" text-anchor="middle" font-size="9" fill="#fff" ' + LBL + '>N</text>' +
      '<text x="280" y="101" text-anchor="middle" font-size="9" fill="#fff" ' + LBL + '>S</text></g>' +
      '<g class="eddy-ring"><ellipse cx="280" cy="136" rx="36" ry="9" fill="none" stroke="#f57c00" stroke-width="3"/>' +
      '<path d="M316 132 l7 3 l-7 4 z" fill="#f57c00"/></g>' +
      '<g class="eddy-ring" style="animation-delay:0.4s"><ellipse cx="280" cy="52" rx="36" ry="9" fill="none" stroke="#f57c00" stroke-width="3"/>' +
      '<path d="M244 48 l-7 3 l7 4 z" fill="#f57c00"/></g>' +
      '<g class="force-arrow"><path d="M280 78 v-16" stroke="#c62828" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M273 64 l7 -14 l7 14 z" fill="#c62828"/></g>' +
      '<text x="380" y="56" ' + LBL + ' font-size="13" fill="#e65100">上方：往回拉</text>' +
      '<text x="380" y="140" ' + LBL + ' font-size="13" fill="#e65100">下方：往上推</text>' +
      '<text x="380" y="98" ' + LBL + ' font-size="13.5" fill="#c62828" font-weight="700">合力反抗落下！</text>' +
      '<text x="120" y="98" text-anchor="middle" ' + LBL + ' font-size="13" fill="#37474f">磁鐵變成慢動作</text>' +
      '</svg>',
    energy:
      '<svg viewBox="0 0 560 150" role="img" aria-label="圖解：能量轉換流程，磁鐵的動能轉為渦電流的電能，再轉為鋁箔的熱能">' +
      '<rect x="30" y="46" width="130" height="58" rx="12" fill="#e3f2fd" stroke="#1565c0" stroke-width="2"/>' +
      '<text x="95" y="70" text-anchor="middle" ' + LBL + ' font-size="14" fill="#0d47a1" font-weight="700">磁鐵的動能</text>' +
      '<text x="95" y="92" text-anchor="middle" ' + LBL + ' font-size="11.5" fill="#5b6b7d">（落下變慢＝動能減少）</text>' +
      '<g class="force-arrow"><path d="M168 75 h44" stroke="#f57c00" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M210 67 l16 8 l-16 8 z" fill="#f57c00"/></g>' +
      '<rect x="232" y="46" width="130" height="58" rx="12" fill="#fff3e0" stroke="#f57c00" stroke-width="2"/>' +
      '<text x="297" y="70" text-anchor="middle" ' + LBL + ' font-size="14" fill="#e65100" font-weight="700">渦電流的電能</text>' +
      '<text x="297" y="92" text-anchor="middle" ' + LBL + ' font-size="11.5" fill="#5b6b7d">（電磁感應）</text>' +
      '<g class="force-arrow" style="animation-delay:0.4s"><path d="M370 75 h44" stroke="#f57c00" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M412 67 l16 8 l-16 8 z" fill="#f57c00"/></g>' +
      '<rect x="434" y="46" width="110" height="58" rx="12" fill="#ffebee" stroke="#c62828" stroke-width="2"/>' +
      '<text x="489" y="70" text-anchor="middle" ' + LBL + ' font-size="14" fill="#b71c1c" font-weight="700">熱能</text>' +
      '<text x="489" y="92" text-anchor="middle" ' + LBL + ' font-size="11.5" fill="#5b6b7d">（鋁箔微微變熱）</text>' +
      '<text x="280" y="134" text-anchor="middle" ' + LBL + ' font-size="12.5" fill="#455a64">能量守恆：能量不會消失，只會換形式</text>' +
      '</svg>'
  };

  /* ---------------- 各頁渲染 ---------------- */

  function renderHome(c) {
    const h = c.home;
    const ids = ["explore", "lab", "sim", "apply", "quiz", "resources"];
    const done = window.Progress ? window.Progress.visitedCount(ids) : 0;
    const pct = Math.round((done / ids.length) * 100);
    const best = window.Progress ? window.Progress.getQuizBest() : null;

    let html =
      '<section class="hero fade-in">' +
      "<h1>🧲 " + c.site.title + "<br><small style='font-size:0.65em;color:var(--c-sub)'>" + c.site.subtitle + "</small></h1>" +
      '<div class="meta-chips"><span>🎓 ' + c.site.grade + "</span><span>🔬 " + c.site.subject + "</span><span>⏱ " + c.site.duration + "</span></div>" +
      '<div class="callout"><b>🤔 想一想：</b>' + h.hook + "</div>" +
      "</section>";

    html += '<div class="card"><h2>🎯 學習目標</h2><ul class="tight">' +
      h.goals.map(function (g) { return "<li>" + g + "</li>"; }).join("") + "</ul></div>";

    html += '<div class="card"><h2>📌 你需要先知道</h2><ul class="tight">' +
      h.prior.map(function (g) { return "<li>" + g + "</li>"; }).join("") + "</ul></div>";

    html += '<div class="card"><h2>🗺️ 學習進度</h2>' +
      '<div class="progress-bar-wrap"><div class="progress-bar" style="width:' + pct + '%"></div></div>' +
      "<p>已完成 " + done + " / " + ids.length + " 個單元" +
      (best ? "｜闖關最佳成績：<b>" + best.score + " / " + best.total + "</b>" : "") + "</p>" +
      '<div class="step-grid">' +
      h.steps.map(function (s, i) {
        const visited = window.Progress && window.Progress.isVisited(s.page);
        return '<a class="step-card" href="' + s.page + '.html">' +
          (visited ? '<span class="done-flag">✓ 已完成</span>' : "") +
          '<span class="num">' + (i + 1) + '</span><span class="t">' + s.label + "</span>" +
          '<span class="d">' + s.desc + "</span></a>";
      }).join("") +
      "</div></div>";

    html += '<div class="btn-row" style="justify-content:center;margin-top:26px">' +
      '<a class="btn" href="explore.html" style="font-size:1.1rem;padding:14px 34px">🚀 開始學習</a></div>';

    main.innerHTML = html;
  }

  function renderExplore(c) {
    let html = '<h1 class="fade-in">🧲 原理探索</h1>' +
      "<p>四個關鍵概念，一步一步弄懂磁鐵為什麼會「慢動作」。</p>";

    c.explore.sections.forEach(function (sec) {
      html += '<div class="card" id="sec-' + sec.id + '"><h2>' + sec.title + "</h2><p>" + sec.text + "</p>";
      if (sec.figure && EXPLORE_FIGS[sec.figure]) {
        html += '<div class="figure-box">' + EXPLORE_FIGS[sec.figure] + "</div>";
      }
      if (sec.interactive === "tester") {
        html += '<div id="tester-box"></div>';
      }
      html += "</div>";
    });

    html += '<div class="callout think"><b>🎯 探究任務預告：</b>如果鋁箔紙捲愈多層，磁鐵會掉得愈慢嗎？帶著你的猜想，前往「互動實驗」驗證吧！</div>';
    main.innerHTML = html;

    const testerBox = document.getElementById("tester-box");
    if (testerBox && window.Interactions) {
      window.Interactions.initTester(testerBox, c.explore.testerItems);
    }
  }

  function renderLab(c) {
    const lab = c.lab;
    let html = '<h1 class="fade-in">🧪 互動實驗：落管大賽</h1><p>' + lab.intro + "</p>";

    html += '<div class="card"><h2>🔬 實驗變因設計</h2><div class="var-grid">' +
      '<div class="var-card"><b>操縱變因（改變的）</b>' + lab.variables.manipulated + "</div>" +
      '<div class="var-card"><b>控制變因（不變的）</b>' + lab.variables.controlled + "</div>" +
      '<div class="var-card"><b>應變變因（觀察的）</b>' + lab.variables.responding + "</div>" +
      "</div></div>";

    html += '<div class="card"><h2>🔮 先預測：哪一種管子會讓磁鐵掉得「最慢」？</h2><div id="lab-predict-box">' +
      lab.tubes.map(function (t) {
        return '<label><input type="radio" name="lab-predict" value="' + t.id + '" data-name="' + t.name + '"> ' + t.name + "</label>";
      }).join("") + "</div></div>";

    html += '<div class="card" id="lab-root"><h2>⏱ 開始實驗</h2><div class="lab-panel">' +
      '<div class="lab-controls">' +
      '<fieldset><legend>選擇管子（操縱變因）</legend>' +
      lab.tubes.map(function (t, i) {
        return '<label><input type="radio" name="lab-tube" value="' + t.id + '"' + (i === 0 ? " checked" : "") + "> " + t.name + "（" + t.desc + "）</label>";
      }).join("") + "</fieldset>" +
      '<fieldset><legend>選擇落下物（對照組）</legend>' +
      lab.objects.map(function (o, i) {
        return '<label><input type="radio" name="lab-obj" value="' + o.id + '"' + (i === 0 ? " checked" : "") + "> " + o.name + "</label>";
      }).join("") + "</fieldset>" +
      '<div class="btn-row"><button type="button" class="btn accent" id="lab-drop">🖐 放開！</button>' +
      '<button type="button" class="btn secondary" id="lab-reset">🔄 全部重來</button></div>' +
      "</div>" +
      '<div class="lab-view"><div id="lab-view"></div>' +
      '<div class="lab-timer" id="lab-timer" aria-live="polite">0.00 秒</div>' +
      '<p class="lab-note">畫面為 3 倍慢動作，計時顯示真實秒數</p></div>' +
      "</div></div>";

    html += '<div class="card"><h2>📋 實驗紀錄表</h2>' +
      '<table class="result-table" id="lab-table"><thead><tr><th>管子</th><th>磁鐵落下時間</th><th>木塊落下時間</th></tr></thead><tbody></tbody></table>' +
      '<div class="callout" id="lab-feedback" hidden></div>' +
      '<div class="callout think"><b>💡 分析提示：</b>比較「磁鐵」欄位由上到下的變化——導電愈好、愈厚，時間愈長？再比較「木塊」欄位，為什麼每一格都一樣？</div>' +
      "</div>";

    main.innerHTML = html;
    if (window.Interactions) {
      window.Interactions.initLab(document.getElementById("main"), lab);
    }
  }

  function renderSim(c) {
    let html = '<h1 class="fade-in">🎬 動畫模擬：慢動作解密</h1><p>' + c.sim.intro + "</p>";
    html += '<div class="card" id="sim-root">' +
      '<div class="stage-flow" id="sim-flow" role="group" aria-label="動畫階段"></div>' +
      '<div id="sim-svg-wrap"></div>' +
      '<div class="sim-text" id="sim-text" aria-live="polite"></div>' +
      '<div class="btn-row" style="margin-top:14px">' +
      '<button type="button" class="btn" id="sim-play">▶ 自動播放</button>' +
      '<button type="button" class="btn secondary" id="sim-prev">← 上一階段</button>' +
      '<button type="button" class="btn secondary" id="sim-next">下一階段 →</button>' +
      '<button type="button" class="btn secondary" id="sim-reset">🔄 重設</button>' +
      "</div></div>";
    html += '<div class="callout think"><b>🤔 看完想一想：</b>如果把鋁箔管換成「有裂縫、不能讓電流繞圈」的管子，渦電流還轉得起來嗎？磁鐵還會變慢嗎？</div>';
    main.innerHTML = html;

    if (window.Interactions) {
      window.Interactions.initSim(document.getElementById("sim-root"), c.sim.stages);
    }
  }

  function renderApply(c) {
    let html = '<h1 class="fade-in">🏠 生活應用</h1><p>' + c.apply.intro + "</p>";
    html += '<div class="apply-grid">';
    c.apply.items.forEach(function (item) {
      const svg = (window.APPLY_ANIMS && window.APPLY_ANIMS[item.anim]) || "";
      html += '<div class="apply-card">' +
        '<div class="anim-box">' + svg + "</div>" +
        "<h3>" + item.title + "</h3>" +
        '<span class="principle">' + item.principle + "</span>" +
        "<p>" + item.text + "</p>" +
        '<div class="q"><b>想一想：</b>' + item.question + "</div>" +
        "</div>";
    });
    html += "</div>";
    main.innerHTML = html;
  }

  function renderResources(c, res) {
    let html = '<h1 class="fade-in">📚 自主學習</h1><p>' + c.resources.intro + "</p>";
    html += '<div class="res-list">';
    res.resources.forEach(function (r) {
      html += '<div class="res-card">' +
        "<h3><a href='" + r.url + "' target='_blank' rel='noopener'>" + r.title + " ↗</a></h3>" +
        '<span class="badge">' + r.type + '</span><span class="badge accent">' + r.grade + "</span>" +
        "<p style='margin:8px 0 0'>" + r.description + "</p>" +
        '<div class="meta">連結確認日期：' + r.checkedAt + "</div>" +
        "</div>";
    });
    html += "</div>";
    main.innerHTML = html;
  }

  function renderQuizIntro(quizData) {
    main.innerHTML = '<h1 class="fade-in">🏆 闖關大挑戰</h1>' +
      '<div class="card"><p>共 <b>' + quizData.questions.length + "</b> 題，內容全部來自本教材。答對 <b>" +
      quizData.passScore + "</b> 題以上就算過關！每題作答後都有解說，答錯也能學到東西。</p>" +
      '<div class="btn-row"><button type="button" class="btn accent" id="quiz-start" style="font-size:1.1rem">🚀 開始挑戰</button></div></div>';
    document.getElementById("quiz-start").addEventListener("click", function () {
      main.innerHTML = '<h1>🏆 闖關大挑戰</h1>';
      window.Quiz.init(main, quizData);
    });
  }

  /* ---------------- 分派 ---------------- */
  function fail(err) {
    main.innerHTML = '<div class="card"><h2>😥 內容載入失敗</h2><p>' + err.message +
      "</p><p>請確認以 http 伺服器開啟本教材（GitHub Pages 或本機伺服器），不要直接雙擊 HTML 檔。</p></div>";
  }

  if (page === "quiz") {
    getJSON("data/quiz.json").then(renderQuizIntro).catch(fail);
  } else if (page === "resources") {
    Promise.all([getJSON("data/content.json"), getJSON("data/resources.json")])
      .then(function (arr) { renderResources(arr[0], arr[1]); })
      .catch(fail);
  } else {
    getJSON("data/content.json").then(function (c) {
      if (page === "home") renderHome(c);
      else if (page === "explore") renderExplore(c);
      else if (page === "lab") renderLab(c);
      else if (page === "sim") renderSim(c);
      else if (page === "apply") renderApply(c);
    }).catch(fail);
  }
})();
