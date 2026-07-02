# 設計規格

## 網站架構

多頁式網站：7 個獨立 HTML，各頁 `<body data-page="...">` 標示身分。
共用版面（頁首、頁籤導覽、上一頁/下一頁、頁尾、鍵盤左右鍵切換）由 `js/chrome.js` 動態產生。
`js/app.js` 依 `data-page` 載入所需 JSON 並渲染該頁內容。

## 內容與邏輯分離

- `data/content.json`：所有頁面文案、模擬階段文字、實驗參數（各管落下時間）、生活應用（含 `anim` 鍵）
- `data/quiz.json`：題庫、通過門檻、回饋語
- `data/resources.json`：自主學習資源
- `data/curriculum.json`：課綱對應
- `js/applyAnim.js`：`anim` 鍵 → SVG 動畫對照表

## 動畫技術要點

- SVG 圖層切換一律 `setAttribute("hidden","")` / `removeAttribute("hidden")`，
  並以 CSS `.sim-svg-group[hidden]{display:none!important}` 保證生效（勿用 `element.hidden`）
- SVG 子元素 transform 動畫一律搭配 `transform-box: fill-box; transform-origin: ...`
- 所有動畫納入 `@media (prefers-reduced-motion: reduce)` 關閉清單
- 生活應用同步動畫（如座艙落下與渦電流出現）以相同 duration 的 keyframes 對齊時間軸

## 實驗模型參數

管長設定 60 cm，時間為教學簡化模型（呈現正確的相對關係，非精確物理解）：

| 管材 | 磁鐵 | 木塊 |
|------|------|------|
| 塑膠管 | 0.35 s | 0.35 s |
| 鋁箔 1 層 | 0.65 s | 0.35 s |
| 鋁箔 5 層 | 1.30 s | 0.35 s |
| 銅管 | 2.60 s | 0.35 s |

畫面以 3 倍慢動作播放，計時器顯示模型秒數。

## 視覺系統

- 主色 `#1565c0`（藍）、強調 `#f57c00`（橘＝渦電流）、警示 `#c62828`（紅＝力/熱）
- 磁鐵一律紅（N）藍（S）雙色塊，全教材一致
- 字級 17px（手機 16px）、行高 1.75、觸控目標 ≥ 44px

## 無障礙

- 跳至主要內容連結、`aria-current`、`aria-live`、SVG `role="img"` + `aria-label`
- 測驗與互動全鍵盤可操作；顏色之外均有文字/符號輔助（✓✗、最慢！）

## 進度保存

`localStorage["ecmd-progress-v1"]`：`visited`（各頁時間戳）、`quizBest`（最佳成績）。
quiz 頁完成挑戰才記為完成。
