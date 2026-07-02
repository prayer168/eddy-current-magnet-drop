/* quiz.js — 闖關大挑戰引擎 */
(function () {
  "use strict";

  const PAGE_NAMES = {
    "explore.html": "原理探索",
    "lab.html": "互動實驗",
    "sim.html": "動畫模擬",
    "apply.html": "生活應用"
  };

  const Quiz = {};

  Quiz.init = function (main, data) {
    const qs = data.questions;
    let idx = 0;
    let score = 0;
    let answered = false;

    const wrap = document.createElement("div");
    wrap.className = "card fade-in";
    main.appendChild(wrap);

    function levelBadge(level) {
      return '<span class="badge accent">' + level + "</span>";
    }

    function renderQuestion() {
      answered = false;
      const q = qs[idx];
      wrap.innerHTML =
        '<div class="quiz-head">' +
        "<div><span class='badge'>第 " + (idx + 1) + " / " + qs.length + " 題</span>" + levelBadge(q.level) + "</div>" +
        "<div class='quiz-score-band'>目前得分：" + score + "</div>" +
        "</div>" +
        '<p class="quiz-q">' + q.question + "</p>" +
        '<div class="quiz-options" role="group" aria-label="選項"></div>' +
        '<div id="quiz-after"></div>';

      const optBox = wrap.querySelector(".quiz-options");
      q.options.forEach(function (opt, oi) {
        const b = document.createElement("button");
        b.type = "button";
        b.innerHTML = "<b>" + String.fromCharCode(65 + oi) + ".</b> " + opt;
        b.addEventListener("click", function () { answer(oi, b); });
        optBox.appendChild(b);
      });
    }

    function answer(oi, btn) {
      if (answered) return;
      answered = true;
      const q = qs[idx];
      const correct = oi === q.answer;
      if (correct) score++;

      const buttons = wrap.querySelectorAll(".quiz-options button");
      buttons.forEach(function (b, bi) {
        b.disabled = true;
        if (bi === q.answer) b.classList.add("correct");
      });
      if (!correct) btn.classList.add("wrong");

      const after = wrap.querySelector("#quiz-after");
      const reviewName = PAGE_NAMES[q.review] || "教材";
      after.innerHTML =
        '<div class="quiz-explain ' + (correct ? "ok" : "ng") + '" role="status">' +
        "<b>" + (correct ? "答對了！🎉" : "再想想！") + "</b> " + q.explain +
        ' <a href="' + q.review + '">回「' + reviewName + '」複習</a></div>' +
        '<div class="btn-row"><button type="button" class="btn" id="quiz-next">' +
        (idx < qs.length - 1 ? "下一題 →" : "看成績 🏆") + "</button></div>";

      wrap.querySelector(".quiz-score-band").textContent = "目前得分：" + score;
      const nextBtn = after.querySelector("#quiz-next");
      nextBtn.focus();
      nextBtn.addEventListener("click", function () {
        if (idx < qs.length - 1) { idx++; renderQuestion(); }
        else renderResult();
      });
    }

    function renderResult() {
      const total = qs.length;
      let band, msg;
      if (score >= 9) { band = "great"; }
      else if (score >= data.passScore) { band = "good"; }
      else { band = "retry"; }
      msg = data.feedback[band];

      if (window.Progress) {
        window.Progress.setQuizBest(score, total);
        window.Progress.markVisited("quiz");
      }

      const stars = score >= 9 ? "🌟🌟🌟" : score >= data.passScore ? "🌟🌟" : "🌟";
      wrap.innerHTML =
        "<h2 style='margin-top:0'>挑戰結果 " + stars + "</h2>" +
        "<p style='font-size:1.5rem;font-weight:700'>你答對了 <span style='color:var(--c-primary-dark)'>" +
        score + "</span> / " + total + " 題</p>" +
        '<div class="progress-bar-wrap" aria-hidden="true"><div class="progress-bar" style="width:' +
        Math.round((score / total) * 100) + '%"></div></div>' +
        "<p>" + msg + "</p>" +
        '<div class="btn-row">' +
        '<button type="button" class="btn" id="quiz-retry">🔄 再挑戰一次</button>' +
        '<a class="btn secondary" href="explore.html">回原理探索複習</a>' +
        '<a class="btn secondary" href="resources.html">前往自主學習 →</a>' +
        "</div>";

      wrap.querySelector("#quiz-retry").addEventListener("click", function () {
        idx = 0; score = 0;
        renderQuestion();
      });
    }

    renderQuestion();
  };

  window.Quiz = Quiz;
})();
