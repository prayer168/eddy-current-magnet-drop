/* applyAnim.js — 生活應用每則專屬會動 SVG（key → svg 對照表）
   動畫 keyframes 定義於 css/animation.css，全部支援 prefers-reduced-motion */
(function () {
  "use strict";

  const LBL = 'font-family="Noto Sans TC, Microsoft JhengHei, sans-serif" font-size="11"';

  const APPLY_ANIMS = {

    /* 高鐵電磁煞車：列車減速進站，軌道感應出渦電流，阻力箭頭與剎車熱 */
    train:
      '<svg viewBox="0 0 320 180" role="img" aria-label="動畫：高鐵列車煞車時，車底電磁鐵使軌道產生渦電流，渦電流阻力使列車減速並產生熱">' +
      '<rect x="0" y="148" width="320" height="10" fill="#78909c"/>' +
      '<rect x="0" y="158" width="320" height="4" fill="#546e7a"/>' +
      '<g class="anim-train-body">' +
      '  <path d="M20 96 h130 q22 0 26 26 v8 h-156 z" fill="#eceff1" stroke="#90a4ae"/>' +
      '  <path d="M150 96 q22 0 26 26 l-26 0 z" fill="#1565c0"/>' +
      '  <rect x="30" y="104" width="22" height="14" rx="3" fill="#90caf9"/>' +
      '  <rect x="60" y="104" width="22" height="14" rx="3" fill="#90caf9"/>' +
      '  <rect x="90" y="104" width="22" height="14" rx="3" fill="#90caf9"/>' +
      '  <rect x="120" y="104" width="22" height="14" rx="3" fill="#90caf9"/>' +
      '  <rect x="40" y="132" width="80" height="10" rx="3" fill="#c62828"/>' +
      '  <text x="80" y="127" text-anchor="middle" ' + LBL + ' fill="#c62828">電磁鐵（不接觸軌道）</text>' +
      '</g>' +
      '<g class="anim-train-eddy" fill="none" stroke="#f57c00" stroke-width="2.5">' +
      '  <circle cx="60" cy="152" r="7"/><circle cx="90" cy="152" r="7"/><circle cx="120" cy="152" r="7"/>' +
      '  <path d="M64 146 l4 -2 l0 4 z" fill="#f57c00"/>' +
      '  <path d="M94 146 l4 -2 l0 4 z" fill="#f57c00"/>' +
      '  <path d="M124 146 l4 -2 l0 4 z" fill="#f57c00"/>' +
      '</g>' +
      '<g class="anim-train-heat" stroke="#ef5350" stroke-width="2" fill="none" stroke-linecap="round">' +
      '  <path d="M70 142 q3 -5 0 -9"/><path d="M100 142 q3 -5 0 -9"/>' +
      '</g>' +
      '<g class="force-arrow"><path d="M210 120 h48" stroke="#c62828" stroke-width="5" stroke-linecap="round"/>' +
      '  <path d="M258 112 l16 8 l-16 8 z" fill="#c62828"/>' +
      '  <text x="238" y="108" text-anchor="middle" ' + LBL + ' fill="#c62828" font-weight="700">渦電流阻力</text></g>' +
      '<text x="90" y="174" text-anchor="middle" ' + LBL + ' fill="#e65100">軌道中的渦電流</text>' +
      '<text x="250" y="174" text-anchor="middle" ' + LBL + ' fill="#455a64">← 列車前進方向</text>' +
      '</svg>',

    /* 遊樂園自由落體：座艙高速落下，進入銅板區被渦電流煞停 */
    tower:
      '<svg viewBox="0 0 320 180" role="img" aria-label="動畫：自由落體座艙落下，經過下方銅板區時感應渦電流，產生向上阻力使座艙減速停住">' +
      '<rect x="146" y="6" width="14" height="160" fill="#90a4ae"/>' +
      '<rect x="143" y="0" width="20" height="8" rx="3" fill="#607d8b"/>' +
      '<rect x="140" y="108" width="26" height="58" fill="#d98e63" stroke="#bf6f43"/>' +
      '<text x="196" y="130" ' + LBL + ' fill="#bf6f43" font-weight="700">銅板煞車區</text>' +
      '<g class="anim-tower-cart">' +
      '  <rect x="112" y="-14" width="82" height="26" rx="6" fill="#1565c0"/>' +
      '  <circle cx="128" cy="-4" r="6" fill="#ffe0b2"/><circle cx="152" cy="-4" r="6" fill="#ffe0b2"/><circle cx="176" cy="-4" r="6" fill="#ffe0b2"/>' +
      '  <rect x="138" y="6" width="30" height="8" fill="#c62828"/>' +
      '  <text x="153" y="-20" text-anchor="middle" ' + LBL + ' fill="#37474f">座艙（背面有磁鐵）</text>' +
      '</g>' +
      '<g class="anim-tower-eddy" fill="none" stroke="#f57c00" stroke-width="2.5">' +
      '  <circle cx="134" cy="130" r="8"/><circle cx="172" cy="130" r="8"/>' +
      '  <path d="M139 123 l5 -2 l-1 5 z" fill="#f57c00"/><path d="M177 123 l5 -2 l-1 5 z" fill="#f57c00"/>' +
      '  <text x="228" y="152" text-anchor="middle" ' + LBL + ' fill="#e65100">渦電流</text>' +
      '</g>' +
      '<g class="anim-tower-brakearrow">' +
      '  <path d="M84 150 v-36" stroke="#2e7d32" stroke-width="5" stroke-linecap="round"/>' +
      '  <path d="M76 116 l8 -16 l8 16 z" fill="#2e7d32"/>' +
      '  <text x="84" y="168" text-anchor="middle" ' + LBL + ' fill="#2e7d32" font-weight="700">向上阻力</text>' +
      '</g>' +
      '<text x="262" y="30" text-anchor="middle" ' + LBL + ' fill="#455a64">停電也能煞車！</text>' +
      '</svg>',

    /* 電磁爐：線圈變化磁場 → 鍋底渦電流 → 直接生熱 */
    cooktop:
      '<svg viewBox="0 0 320 180" role="img" aria-label="動畫：電磁爐內線圈產生變化磁場，讓鐵鍋底部感應渦電流而發熱，鍋中冒出蒸氣">' +
      '<rect x="40" y="130" width="240" height="34" rx="8" fill="#37474f"/>' +
      '<rect x="40" y="126" width="240" height="8" rx="4" fill="#111827"/>' +
      '<g stroke="#fbc02d" stroke-width="4" fill="none">' +
      '  <path d="M110 150 h100" stroke-dasharray="10 6"/>' +
      '  <path d="M120 158 h80" stroke-dasharray="10 6"/>' +
      '</g>' +
      '<text x="160" y="177" text-anchor="middle" ' + LBL + ' fill="#fbc02d">爐內線圈（通入快速變化的電流）</text>' +
      '<g class="anim-cook-field" stroke="#42a5f5" stroke-width="2.5" fill="none">' +
      '  <path d="M120 124 q-6 -10 0 -20"/><path d="M200 124 q6 -10 0 -20"/>' +
      '</g>' +
      '<g class="anim-cook-field d2" stroke="#42a5f5" stroke-width="2.5" fill="none">' +
      '  <path d="M140 124 q-5 -9 0 -18"/><path d="M180 124 q5 -9 0 -18"/>' +
      '</g>' +
      '<text x="252" y="108" ' + LBL + ' fill="#1565c0">變化磁場</text>' +
      '<path d="M108 96 l-8 30 h120 l-8 -30 z" fill="#616161" stroke="#424242"/>' +
      '<path d="M100 126 h120" stroke="#f57c00" stroke-width="3"/>' +
      '<g class="anim-cook-eddy" fill="none" stroke="#f57c00" stroke-width="2.5">' +
      '  <ellipse cx="160" cy="120" rx="26" ry="5"/>' +
      '  <path d="M186 118 l6 2 l-6 3 z" fill="#f57c00"/>' +
      '</g>' +
      '<text x="66" y="92" ' + LBL + ' fill="#e65100">鍋底渦電流→發熱</text>' +
      '<path d="M96 100 h128" stroke="none"/>' +
      '<rect x="104" y="88" width="112" height="10" fill="#78909c"/>' +
      '<g class="anim-cook-steam" stroke="#90a4ae" stroke-width="3" fill="none" stroke-linecap="round">' +
      '  <path d="M140 82 q4 -8 0 -14"/>' +
      '</g>' +
      '<g class="anim-cook-steam d2" stroke="#90a4ae" stroke-width="3" fill="none" stroke-linecap="round">' +
      '  <path d="M175 82 q-4 -8 0 -14"/>' +
      '</g>' +
      '<text x="160" y="60" text-anchor="middle" ' + LBL + ' fill="#455a64">爐面不熱，熱從鍋底「自己長出來」</text>' +
      '</svg>',

    /* 金屬探測器：線圈磁場圈圈擴散，地下金屬感應渦電流，機器嗶嗶響 */
    detector:
      '<svg viewBox="0 0 320 180" role="img" aria-label="動畫：金屬探測器的線圈發出變化磁場，地下的金屬罐感應出渦電流，探測器偵測到而發出嗶嗶聲">' +
      '<rect x="0" y="120" width="320" height="60" fill="#efebe0"/>' +
      '<path d="M0 120 h320" stroke="#c8b98a" stroke-width="3"/>' +
      '<g transform="rotate(18 200 60)">' +
      '  <rect x="196" y="18" width="9" height="86" rx="4" fill="#546e7a"/>' +
      '  <rect x="186" y="10" width="30" height="12" rx="6" fill="#37474f"/>' +
      '</g>' +
      '<ellipse cx="176" cy="112" rx="34" ry="10" fill="#1565c0" opacity="0.9"/>' +
      '<ellipse cx="176" cy="112" rx="22" ry="6" fill="#90caf9"/>' +
      '<g class="anim-det-ring"><ellipse cx="176" cy="126" rx="26" ry="9" fill="none" stroke="#42a5f5" stroke-width="2.5"/></g>' +
      '<g class="anim-det-ring d2"><ellipse cx="176" cy="130" rx="30" ry="11" fill="none" stroke="#42a5f5" stroke-width="2.5"/></g>' +
      '<g class="anim-det-ring d3"><ellipse cx="176" cy="134" rx="34" ry="13" fill="none" stroke="#42a5f5" stroke-width="2.5"/></g>' +
      '<g>' +
      '  <rect x="158" y="148" width="38" height="20" rx="4" fill="#9e9e9e" stroke="#757575"/>' +
      '  <ellipse cx="177" cy="148" rx="19" ry="5" fill="#bdbdbd" stroke="#757575"/>' +
      '</g>' +
      '<g class="anim-det-eddy" fill="none" stroke="#f57c00" stroke-width="2.5">' +
      '  <ellipse cx="177" cy="158" rx="12" ry="5"/>' +
      '  <path d="M189 156 l5 2 l-5 3 z" fill="#f57c00"/>' +
      '</g>' +
      '<text x="112" y="166" text-anchor="middle" ' + LBL + ' fill="#e65100">金屬中的渦電流</text>' +
      '<g class="anim-det-beep">' +
      '  <text x="242" y="30" ' + LBL + ' font-size="16" font-weight="700" fill="#c62828">嗶！嗶！</text>' +
      '  <path d="M228 36 q-6 -8 0 -16 M222 40 q-10 -12 0 -24" stroke="#c62828" stroke-width="2" fill="none"/>' +
      '</g>' +
      '<text x="70" y="100" text-anchor="middle" ' + LBL + ' fill="#1565c0">線圈發出變化磁場</text>' +
      '<path d="M96 104 q30 8 46 10" stroke="#1565c0" stroke-width="1.5" fill="none" stroke-dasharray="4 3"/>' +
      '</svg>',

    /* 渦電流分選機：磁鼓旋轉，鋁罐被彈飛到遠箱，玻璃直接落下 */
    sorter:
      '<svg viewBox="0 0 320 180" role="img" aria-label="動畫：資源回收輸送帶末端的旋轉磁鼓使鋁罐產生渦電流而被彈飛到遠處的箱子，不導電的玻璃瓶直接落入近處箱子">' +
      '<path class="anim-sort-belt" d="M10 84 h130" stroke="#455a64" stroke-width="8" stroke-linecap="round" stroke-dasharray="14 10"/>' +
      '<text x="60" y="72" text-anchor="middle" ' + LBL + ' fill="#455a64">輸送帶 →</text>' +
      '<g class="anim-sort-drum">' +
      '  <circle cx="152" cy="84" r="22" fill="#eceff1" stroke="#90a4ae" stroke-width="2"/>' +
      '  <path d="M152 62 a22 22 0 0 1 0 44 z" fill="#ef5350"/>' +
      '  <path d="M152 62 a22 22 0 0 0 0 44 z" fill="#42a5f5"/>' +
      '  <text x="146" y="80" ' + LBL + ' font-size="10" fill="#fff">N</text>' +
      '  <text x="154" y="96" ' + LBL + ' font-size="10" fill="#fff">S</text>' +
      '</g>' +
      '<text x="152" y="124" text-anchor="middle" ' + LBL + ' fill="#37474f">高速旋轉磁鼓</text>' +
      '<g class="anim-sort-alcan">' +
      '  <rect x="118" y="62" width="16" height="22" rx="3" fill="#b0bec5" stroke="#78909c"/>' +
      '  <ellipse cx="126" cy="62" rx="8" ry="2.5" fill="#cfd8dc" stroke="#78909c"/>' +
      '  <text x="126" y="54" text-anchor="middle" ' + LBL + ' font-size="10" fill="#546e7a">鋁罐</text>' +
      '</g>' +
      '<path d="M148 46 q60 -26 108 24" stroke="#f57c00" stroke-width="2" fill="none" stroke-dasharray="5 4"/>' +
      '<text x="216" y="26" text-anchor="middle" ' + LBL + ' fill="#e65100">渦電流磁場排斥→彈飛！</text>' +
      '<g class="anim-sort-glass">' +
      '  <rect x="140" y="58" width="12" height="20" rx="3" fill="#81c784" stroke="#4caf50"/>' +
      '  <rect x="143" y="52" width="6" height="8" fill="#81c784"/>' +
      '</g>' +
      '<g stroke="#8d6e63" stroke-width="3" fill="#efebe9">' +
      '  <path d="M160 176 v-30 h44 v30"/>' +
      '  <path d="M242 176 v-30 h52 v30"/>' +
      '</g>' +
      '<text x="182" y="170" text-anchor="middle" ' + LBL + ' font-size="10" fill="#5d4037">玻璃・塑膠</text>' +
      '<text x="268" y="170" text-anchor="middle" ' + LBL + ' font-size="10" fill="#5d4037">鋁罐</text>' +
      '</svg>',

    /* 儀表止震：指針振盪快速停止，因為鋁盤在磁鐵間產生渦電流阻尼 */
    meter:
      '<svg viewBox="0 0 320 180" role="img" aria-label="動畫：指針式儀表的指針左右擺動後迅速停住，因為底下的鋁盤在磁鐵之間擺動時產生渦電流阻尼">' +
      '<path d="M60 96 a100 100 0 0 1 200 0" fill="#f5f9fc" stroke="#90a4ae" stroke-width="2"/>' +
      '<g stroke="#78909c" stroke-width="2">' +
      '  <path d="M74 82 l10 8"/><path d="M110 52 l7 10"/><path d="M160 40 l0 12"/><path d="M210 52 l-7 10"/><path d="M246 82 l-10 8"/>' +
      '</g>' +
      '<text x="160" y="34" text-anchor="middle" ' + LBL + ' fill="#455a64">指針很快停住，方便讀數</text>' +
      '<g class="anim-meter-needle">' +
      '  <path d="M160 96 L160 46" stroke="#c62828" stroke-width="4" stroke-linecap="round"/>' +
      '  <circle cx="160" cy="96" r="7" fill="#37474f"/>' +
      '</g>' +
      '<g transform="translate(0 6)">' +
      '  <rect x="118" y="112" width="16" height="34" fill="#ef5350"/>' +
      '  <text x="126" y="134" text-anchor="middle" ' + LBL + ' font-size="10" fill="#fff">N</text>' +
      '  <rect x="186" y="112" width="16" height="34" fill="#42a5f5"/>' +
      '  <text x="194" y="134" text-anchor="middle" ' + LBL + ' font-size="10" fill="#fff">S</text>' +
      '  <ellipse cx="160" cy="130" rx="22" ry="16" fill="#cfd8dc" stroke="#90a4ae"/>' +
      '  <g class="anim-meter-eddy" fill="none" stroke="#f57c00" stroke-width="2.5">' +
      '    <ellipse cx="160" cy="130" rx="12" ry="8"/>' +
      '    <path d="M172 127 l5 3 l-6 3 z" fill="#f57c00"/>' +
      '  </g>' +
      '</g>' +
      '<text x="160" y="172" text-anchor="middle" ' + LBL + ' fill="#e65100">鋁盤擺動→渦電流→吸收晃動</text>' +
      '<text x="60" y="150" text-anchor="middle" ' + LBL + ' fill="#455a64">磁鐵</text>' +
      '<path d="M74 146 q20 -4 34 -6" stroke="#455a64" stroke-width="1.5" fill="none" stroke-dasharray="4 3"/>' +
      '</svg>'
  };

  window.APPLY_ANIMS = APPLY_ANIMS;
})();
