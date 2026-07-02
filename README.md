# 磁鐵慢動作的祕密——鋁箔紙與渦電流探究

探討鋁箔紙對磁鐵落下速度的影響——國中自然科「探究與實作」數位互動教材。

**線上使用：** https://prayer168.github.io/eddy-current-magnet-drop/

## 教材簡介

磁鐵吸不住鋁箔紙，但把磁鐵丟進鋁箔紙捲成的管子裡，它卻會像慢動作一樣緩緩落下。本教材以這個反直覺的現象為起點，帶領學生透過觀察、預測、模擬實驗與動畫，理解電磁感應、渦電流與冷次定律，並連結到高鐵煞車、電磁爐等生活科技。

## 適用對象

- 國中八～九年級（自然科學）
- 一次學習約 40 分鐘
- 支援電腦、平板與手機

## 學習目標

1. 觀察並描述磁鐵通過鋁箔管時落下變慢的現象
2. 說出電磁感應、渦電流與冷次定律的基本概念
3. 設計實驗：分辨操縱變因、控制變因與應變變因
4. 用渦電流解釋生活中的電磁煞車、電磁爐等應用

## 教材特色

- **多頁式網站**：七個單元各自獨立 HTML，直接以連結切換
- **虛擬落管實驗**：先預測、再實驗，四種管材 × 磁鐵/木塊對照組，自動記錄比較表
- **五階段慢動作模擬**：圖形、階段流程列、說明文字逐階段同步
- **六則生活應用**：每則配專屬會動 SVG 動畫（含箭頭與標籤說明原理）
- **素養導向闖關**：10 題情境／數據判讀題，附解析與回看連結
- **進度保存**：localStorage 跨頁記錄單元完成度與最佳成績
- **無障礙**：鍵盤操作、aria-label、`prefers-reduced-motion` 支援

## 頁籤內容

| 頁面 | 內容 |
|------|------|
| `index.html` 學習任務 | 引起動機、學習目標、先備知識、學習進度 |
| `explore.html` 原理探索 | 磁性材料點擊測試、電磁感應、渦電流、冷次定律、能量轉換 |
| `lab.html` 互動實驗 | 變因設計、預測與驗證、落管計時、實驗紀錄表 |
| `sim.html` 動畫模擬 | 五階段渦電流產生過程動畫 |
| `apply.html` 生活應用 | 六則渦電流應用（每則專屬動畫） |
| `quiz.html` 闖關大挑戰 | 10 題素養導向測驗、計分與學習建議 |
| `resources.html` 自主學習 | 8 個延伸學習資源 |
| `share/facebook-post.html` | 中英雙語臉書介紹文，一鍵複製 |

## 使用方式

直接開啟 GitHub Pages 網址即可。本機使用需以 HTTP 伺服器啟動（教材以 fetch 載入 JSON）：

```bash
cd eddy-current-magnet-drop
python -m http.server 8000
# 瀏覽 http://localhost:8000
```

## 專案結構

```text
eddy-current-magnet-drop/
├─ index.html / explore.html / lab.html / sim.html
├─ apply.html / quiz.html / resources.html
├─ css/        style.css・animation.css・responsive.css
├─ js/         chrome.js（共用版面）・app.js（頁面渲染）
│              interactions.js（測試/實驗/模擬）・applyAnim.js（應用動畫）
│              quiz.js（闖關）・progress.js（進度）
├─ data/       content.json・quiz.json・resources.json・curriculum.json
└─ docs/       lesson-plan.md・design-spec.md・references.md・test-report.md
```

## 使用技術

HTML5・CSS3（含 CSS Animation）・SVG・原生 JavaScript・JSON。無框架、無建置步驟。

## 課綱對應

詳見 [data/curriculum.json](data/curriculum.json)。核心素養與學習表現對應以 108 課綱自然科學領域第四學習階段整理；課綱代碼標註「待教師依正式課綱手冊確認」者，請教師確認後使用。

## 開發與更新紀錄

見 [CHANGELOG.md](CHANGELOG.md) 與 Git 提交紀錄。

## 授權

MIT License。教材內容歡迎教師於課堂自由使用與改作，引用請註明出處。
