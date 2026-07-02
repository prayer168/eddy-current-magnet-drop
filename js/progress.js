/* progress.js — 跨頁面學習進度（localStorage） */
(function () {
  "use strict";
  const KEY = "ecmd-progress-v1";

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || { visited: {}, quizBest: null };
    } catch (e) {
      return { visited: {}, quizBest: null };
    }
  }

  function save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* 私密模式可忽略 */ }
  }

  const Progress = {
    markVisited: function (pageId) {
      const d = load();
      if (!d.visited[pageId]) {
        d.visited[pageId] = new Date().toISOString();
        save(d);
      }
    },
    isVisited: function (pageId) {
      return !!load().visited[pageId];
    },
    visitedCount: function (ids) {
      const d = load();
      return ids.filter(function (id) { return !!d.visited[id]; }).length;
    },
    setQuizBest: function (score, total) {
      const d = load();
      if (!d.quizBest || score > d.quizBest.score) {
        d.quizBest = { score: score, total: total, at: new Date().toISOString() };
        save(d);
      }
    },
    getQuizBest: function () { return load().quizBest; },
    reset: function () {
      try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    }
  };

  window.Progress = Progress;

  // 進入頁面即標記造訪（quiz 頁改為完成挑戰才算）
  const page = document.body.dataset.page;
  if (page && page !== "quiz") Progress.markVisited(page);
})();
