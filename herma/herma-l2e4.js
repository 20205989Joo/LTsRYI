// ver1.1_26.02.22
// herma-l2e4.js (L2-E4: which / where(when/why) 오고가기)
// ------------------------------------------------------------
// ✅ UI/톤/구조: herma-l2e3.js 그대로 매칭
// ✅ 변경점: 슬롯 정답 후 "합쳐진 문장 1줄"에서
//   - 끝 전치사(prep) 드래그 → which 앞에 위치(문장 자연화)
//   - 그 prep+which 클릭 → where/when/why 변환(같은 문장 라인에서)
//   - 이후 해석 순서 박스(E3 기존) 진행
//
// 데이터(Answer) 형식 가정:
// 1) a1(… which … in.) 2) a2(… in which …) 3) a3(… where/when/why …) 4) 한국어해석
// + 선택 위치는 ||ins:n 유지(없으면 insAfter=0)
//
// ------------------------------------------------------------

const EXCEL_FILE = "herma_allq_chwi.xlsx";
const EXCEL_SHEET = "round1_questions";
const TARGET_LESSON = 2;
const TARGET_EXERCISE = 4;

let subcategory = "Grammar";
let level = "Basic";
let day = "108";
let quizTitle = "quiz_Grammar_Basic_108";
let userId = "";

let rawRows = [];
let questions = [];

let currentIndex = 0;
let results = [];
let isAnswered = false;

let requiredIdxSet = new Set();
let fadedIdxSet = new Set();
let bReqIdxSet = new Set();
let bFadedIdxSet = new Set();

let reduced = false;
let insertOk = false;
let frontMoved = false;
let frontDragActive = false;
let handleSpawned = false;

// L2E4 전용
let movedPrep = false;
let relCompressed = false;

let translateMode = false;
let isKoLocked = false;

let bankTokens = [];
let selectedTokens = [];

let correctInsAfter = 0;

let tokensA = [];
let tokensB = [];
let mixRendered = false;

// ---------- boot ----------
window.addEventListener("DOMContentLoaded", async () => {  var __r2_guard = (new URLSearchParams(window.location.search || "")).get("round2") === "1";
  if (__r2_guard) return;
  applyQueryParams();
  wireBackButton();
  injectStyles(); // ✅ E3 스타일 그대로 + 필요한 것만 아주 조금 추가
  if (window.HermaToastFX) window.HermaToastFX.init({ hostId: "cafe_int", top: 10 });

  try {
    rawRows = await loadExcelRows(EXCEL_FILE);
  } catch (e) {
    console.error(e);
    alert("엑셀 파일을 불러오지 못했습니다.\n" + EXCEL_FILE);
    return;
  }

  buildQuestionsFromRows();
  renderIntro();
});

function toastOk(msg) {
  if (!window.HermaToastFX) return;
  try { window.HermaToastFX.show("ok", String(msg || "")); } catch (_) {}
}

function toastNo(msg) {
  if (!window.HermaToastFX) return;
  try { window.HermaToastFX.show("no", String(msg || "")); } catch (_) {}
}

// ---------- params/nav ----------
function applyQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const key = params.get("key");
  const id = params.get("id");
  if (id) userId = id;

  if (key) {
    quizTitle = key;
    const parts = key.split("_");
    if (parts.length >= 4) {
      subcategory = parts[1] || subcategory;
      level = parts[2] || level;
      day = parts[3] || day;
    }
  } else {
    quizTitle = `quiz_${subcategory}_${level}_${day}`;
  }
}
function wireBackButton() {
  const backBtn = document.getElementById("back-btn");
  if (!backBtn) return;
  backBtn.addEventListener("click", () => history.back());
}

// ---------- styles (E3 유지 + 최소 추가) ----------
function injectStyles() {
  const style = document.createElement("style");
  style.textContent = `
    :root{
      --boxWarm: #fff3e0;

      /* B문장 쿨톤 */
      --bBlue: #468cff;
      --bBg: rgba(70, 140, 255, 0.10);
      --bBorder: rgba(70, 140, 255, 0.35);

      /* +도 B랑 동일 톤 */
      --plus: var(--bBlue);
      --plusSoft: rgba(70, 140, 255, 0.10);
      --plusSoft2: rgba(70, 140, 255, 0.18);
      --plusBorder: rgba(70, 140, 255, 0.55);

      /* A active */
      --aActive: rgba(126, 49, 6, 0.06);
      --aActiveBorder: rgba(126, 49, 6, 0.22);
    }

    .tok{ cursor:pointer; user-select:none; }
    .tok.uA, .tok.uB, .uA, .uB{
      text-decoration: underline;
      text-decoration-thickness: 3px;
      text-underline-offset: 5px;
    }
    .tok.uA, .uA{ text-decoration-color: rgba(241,123,42,0.95); }
    .tok.uB, .uB{ text-decoration-color: rgba(70,120,255,0.95); }
    .uLink{
      text-decoration: underline;
      text-decoration-thickness: 3px;
      text-underline-offset: 5px;
      text-decoration-color: rgba(255, 208, 90, 0.95);
      font-weight: 900;
    }
    .tok.pre{
      background: rgba(255, 208, 90, 0.45);
      border-radius: 6px;
      padding: 0 3px;
      box-shadow: inset 0 0 0 1px rgba(160, 110, 0, 0.18);
      font-weight: 900;
    }
    .tok.faded{
      opacity: 0.22 !important;
      text-decoration: line-through !important;
      filter: blur(0.2px) !important;
    }
    .tok.nope{
      box-shadow: inset 0 0 0 1px rgba(200, 40, 40, 0.22);
      background: rgba(200, 40, 40, 0.05);
    }

    .ab-shell{
      background: var(--boxWarm);
      border: 1px solid #e9c7a7;
      border-radius: 12px;
      padding: 12px;
      margin-bottom: 12px;
      position: relative;
      overflow: visible;
    }
    .ab-title{
      font-weight: 900; color:#7e3106; margin-bottom:6px;
    }

    .sentence-a.active{
      border: 1px solid var(--aActiveBorder) !important;
      background: #fff !important;
      box-shadow: 0 0 0 2px rgba(126,49,6,0.06);
    }

    .sentence-b.cool{
      border: 1px solid var(--bBorder) !important;
      background: #fff !important;
      box-shadow: none;
    }

    .hint-pill{
      display:inline-block;
      font-size:12px;
      background: rgba(255, 208, 90, 0.45);
      border:1px solid rgba(160, 110, 0, 0.22);
      color:#7e3106;
      padding:6px 10px;
      border-radius:999px;
      font-weight:900;
      margin-top:10px;
    }
    .hidden{ display:none !important; }

    .tap-tip{
      position:absolute;
      left: 50%;
      top: -16px;
      transform: translateX(-50%);
      z-index:2;
      padding:2px 8px;
      border-radius:999px;
      background:#1f4fb8;
      color:#fff;
      font-size:11px;
      font-weight:900;
      border:1px solid #163a8f;
      box-shadow:0 3px 8px rgba(31,79,184,0.22);
      animation: tapFloatCenter 1.05s ease-in-out infinite;
      pointer-events:none;
    }
    .tap-tip.drag-mode{
      animation: none;
    }
    .tap-tip.drag-arc{
      position: fixed;
      transform: none;
    }
    .tap-tip-inline{
      position: fixed;
      z-index: 99999;
      display:inline-flex;
      padding:1px 7px;
      border-radius:999px;
      background:#1f4fb8;
      color:#fff;
      font-size:11px;
      font-weight:900;
      border:1px solid #163a8f;
      box-shadow:0 3px 8px rgba(31,79,184,0.22);
      animation: tapFloat 1.05s ease-in-out infinite;
      pointer-events:none;
    }
    .tap-tip-gold{
      position: fixed;
      z-index: 99999;
      display:inline-flex;
      padding:1px 6px;
      border-radius:999px;
      background: rgba(255, 208, 90, 0.95);
      color:#7e3106;
      font-size:10px;
      font-weight:900;
      border:1px solid rgba(160, 110, 0, 0.35);
      box-shadow:0 3px 8px rgba(160,110,0,0.20);
      animation: tapFloat 1.05s ease-in-out infinite;
      pointer-events:none;
    }
    @keyframes tapFloat{
      0%, 100%{ transform: translateY(0px); }
      50%{ transform: translateY(-8px); }
    }
    @keyframes tapFloatCenter{
      0%, 100%{ transform: translate(-50%, 0px); }
      50%{ transform: translate(-50%, -8px); }
    }

    #b-area{ position: relative; }
    .sentence-a{
      position: relative;
      z-index: 30;
    }
    .sentence-b{
      position: relative;
      z-index: 10;
    }

    .b-drag-chip{
      position: fixed;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 4px;
      border: 2px solid #1f4fb8;
      background: rgba(70, 140, 255, 0.18);
      color: #13409a;
      font-weight: 900;
      user-select: none;
      cursor: grab;
      box-shadow: 0 6px 12px rgba(31,79,184,0.22);
    }
    .b-drag-chip.dragging{ cursor: grabbing; }
    .b-clause-chip{
      position: fixed;
      z-index: 9999;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 20px;
      padding: 0 2px;
      border-radius: 6px;
      border: none;
      background: rgba(255, 208, 90, 0.45);
      color: #7e3106;
      font-weight: 900;
      user-select: none;
      cursor: grab;
      box-shadow: inset 0 0 0 1px rgba(160,110,0,0.18);
      white-space: nowrap;
      font-size: 14px;
      line-height: 1.2;
      text-decoration: underline;
      text-decoration-thickness: 3px;
      text-underline-offset: 5px;
      text-decoration-color: rgba(241,123,42,0.95);
    }
    .b-clause-chip.dragging{ cursor: grabbing; }
    .b-clause-ghost{
      position: fixed;
      z-index: 9999;
      background: transparent;
      border: none;
      box-shadow: none;
      user-select: none;
      cursor: grab;
    }
    .b-clause-ghost.dragging{ cursor: grabbing; }
    .b-clause-ghost-token{
      position: absolute;
      pointer-events: none;
      margin: 0;
      white-space: pre;
    }
    .b-front-slot{
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 22px;
      min-width: 78px;
      padding: 0 10px;
      border-radius: 999px;
      border: 2px dashed rgba(241,123,42,0.88);
      background: rgba(241,123,42,0.10);
      vertical-align: baseline;
      margin-right: 6px;
      box-sizing: border-box;
      animation: dragPulse 1.0s ease-in-out infinite;
    }
    .b-front-slot.hit{
      border-color: rgba(46,125,50,0.9);
      background: rgba(46,125,50,0.12);
      animation: none;
    }
    @keyframes dragPulse{
      0%,100%{ transform: translateY(0px); box-shadow: 0 0 0 0 rgba(241,123,42,0.12); }
      50%{ transform: translateY(-2px); box-shadow: 0 6px 14px 0 rgba(241,123,42,0.16); }
    }
    .b-drag-plus{
      width: 12px;
      height: 12px;
      border-radius: 3px;
      border: 1px solid rgba(31,79,184,0.55);
      background: rgba(255,255,255,0.55);
      color: #1f4fb8;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 900;
      line-height: 1;
      flex: 0 0 auto;
    }
    .b-handle-point{
      position: fixed;
      width:22px;
      height:22px;
      border-radius:6px;
      border:2px solid #1f4fb8;
      background: rgba(70,140,255,0.18);
      color:#13409a;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      font-weight:900;
      box-shadow:0 6px 12px rgba(31,79,184,0.22);
      cursor:grab;
      user-select:none;
      z-index:9999;
      transform: none;
    }
    .b-handle-point.dragging{
      cursor:grabbing;
    }
    .b-handle-point.target-hot{
      background: rgba(46,125,50,0.20);
      border-color: rgba(46,125,50,0.92);
      color:#1f4fb8;
      box-shadow: 0 0 0 3px rgba(46,125,50,0.18), 0 8px 16px rgba(46,125,50,0.22);
      animation: handleHotPulse .62s ease-in-out infinite;
    }
    .a-gap{
      display:inline-block;
      width:12px;
      height:11px;
      border:1px dashed rgba(31,79,184,0.82);
      background: rgba(70,140,255,0.09);
      border-radius:3px;
      vertical-align:middle;
      margin: 0 1px;
      position: relative;
      z-index: 35;
      transform-origin:center center;
      animation: gapUncollapse .22s ease-out both;
      animation-delay: calc(var(--gap-i, 0) * 36ms);
    }
    .a-gap.target-hot{
      transform: scale(1.46);
      border-color: rgba(46,125,50,0.95);
      background: rgba(46,125,50,0.22);
      box-shadow: 0 0 0 3px rgba(46,125,50,0.16), 0 4px 10px rgba(46,125,50,0.20);
      animation: targetHotPulse .58s ease-in-out infinite;
    }
    @keyframes gapUncollapse{
      from{ transform: scaleX(0.2); opacity:0; }
      to{ transform: scaleX(1); opacity:1; }
    }
    @keyframes handleHotPulse{
      0%,100%{ transform: translate(-50%, -50%) scale(1); }
      50%{ transform: translate(-50%, -50%) scale(1.18); }
    }
    @keyframes targetHotPulse{
      0%,100%{ transform: scale(1.36); }
      50%{ transform: scale(1.56); }
    }

    .sentence-b.collapsing-center{
      transform-origin:center center;
      animation:bCollapseCenter .32s ease-in forwards;
    }
    @keyframes bCollapseCenter{
      0%{ transform: scaleX(1); opacity:1; }
      100%{ transform: scaleX(0.08); opacity:0; }
    }
    .sentence-b.collapsed-slot{
      height: 14px;
      min-height: 14px;
      border: none !important;
      background: transparent !important;
      box-shadow: none !important;
      padding: 0 !important;
      margin-top: 8px;
      pointer-events:none;
    }

    /* A 내부 삽입 슬롯(+) */
    .ins-slot{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      width:22px;
      height:22px;
      border-radius:8px;
      border:1px solid var(--plusBorder);
      background: var(--plusSoft);
      color: var(--plus);
      font-weight:900;
      cursor:pointer;
      margin: 0 4px;
      vertical-align:middle;
      box-shadow: 0 0 0 2px rgba(70,140,255,0.06);
      transition: transform .12s ease, background .12s ease;
    }
    .ins-slot:hover{
      background: var(--plusSoft2);
      transform: translateY(-0.5px);
    }
    .ins-slot.ok{
      background:#e9f7ee;
      border-color:#2e7d32;
      color:#2e7d32;
      box-shadow: 0 0 0 2px rgba(46,125,50,0.10);
    }
    .ins-slot.bad{
      background:rgba(200,40,40,0.10);
      border-color:rgba(200,40,40,0.6);
      color:#c62828;
      box-shadow: 0 0 0 2px rgba(200,40,40,0.08);
    }
    .ins-slot.reveal{
      animation: popIn .25s ease-out both;
    }
    @keyframes popIn{
      from{ transform: scale(0.7); opacity:0; }
      to{ transform: scale(1); opacity:1; }
    }

    .stage-pill{
      display:inline-block;
      font-size:12px;
      padding:6px 10px;
      border-radius:999px;
      font-weight:900;
      border:1px solid rgba(0,0,0,0.12);
      background:#fff;
      margin-bottom:10px;
    }

    .bank-wrap{
      margin-top:10px;
      padding:10px;
      border-radius:12px;
      border:1px solid rgba(0,0,0,0.08);
      background: rgba(255,255,255,0.75);
    }
    .answer-line{
      min-height:44px;
      padding:10px;
      border-radius:12px;
      border:1px solid rgba(0,0,0,0.10);
      background:#fff;
      line-height:1.6;
      font-size:15px;
    }
    .pill-btn{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      padding:8px 10px;
      border-radius:999px;
      border:1px solid rgba(0,0,0,0.12);
      background:#fff;
      font-weight:800;
      font-size:14px;
      cursor:pointer;
      user-select:none;
      margin:6px 6px 0 0;
    }
    .pill-btn:disabled{ opacity:0.35; cursor:not-allowed; }

    .controls{ display:flex; gap:8px; margin-top:10px; }
    .mini-btn{
      flex:1;
      padding:10px;
      border-radius:12px;
      border:1px solid rgba(0,0,0,0.12);
      background:#fff;
      font-weight:900;
      cursor:pointer;
    }

    .ok{ font-weight:900; font-size:18px; color:#2e7d32; text-align:center; }
    .no{ font-weight:900; font-size:18px; color:#c62828; text-align:center; }

    /* B영역 수축 애니메이션 */
    .b-collapse{
      transform-origin: center center;
      animation: bCollapse .28s ease-in forwards;
    }
    @keyframes bCollapse{
      0%{ transform: scaleX(1); opacity:1; max-height:200px; margin-top:8px; }
      70%{ transform: scaleX(0.15); opacity:0.2; }
      100%{ transform: scaleX(0.05); opacity:0; max-height:0px; margin-top:0px; }
    }

    /* 날아다니는 + */
    #fly-plus{
      position: fixed;
      z-index: 99999;
      width: 26px; height: 26px;
      border-radius: 10px;
      border: 1px solid var(--plusBorder);
      background: var(--plusSoft2);
      color: var(--plus);
      display:flex; align-items:center; justify-content:center;
      font-weight: 900;
      box-shadow: 0 8px 24px rgba(70,140,255,0.25);
      pointer-events: none;
      opacity: 0;
    }
    #fly-plus.show{ opacity: 1; }

    /* mixed preview */
    .mix-insert{
      display:inline;
      background: rgba(70,140,255,0.10);
      border: 1px dashed rgba(70,140,255,0.45);
      padding: 1px 4px;
      border-radius: 8px;
      margin: 0 3px;
      box-shadow: 0 0 0 2px rgba(70,140,255,0.06);
    }
    .mix-strike{
      text-decoration: line-through;
      opacity: 0.35;
      margin-right: 4px;
      color: rgba(0,0,0,0.55);
      font-weight: 800;
    }
    .mix-rest{
      font-weight: 900;
      color: #1f4fb8;
    }
    .mix-fadein{
      animation: mixIn .18s ease-out both;
    }
    @keyframes mixIn{
      from{ transform: translateY(1px); opacity: 0; }
      to{ transform: translateY(0); opacity: 1; }
    }

    /* ====== L2E4 최소 추가(톤 유지) ====== */
    .hint-chip-gold{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      padding: 0 8px;
      min-height: 22px;
      border-radius:999px;
      background: rgba(255, 208, 90, 0.45);
      border:1px solid rgba(160, 110, 0, 0.22);
      color:#7e3106;
      font-weight:900;
      white-space:nowrap;
      vertical-align:middle;
    }
    .who-gold{
      display:inline-block;
      padding:1px 6px;
      border-radius:999px;
      background: rgba(255, 208, 90, 0.45);
      border: 1px solid rgba(160, 110, 0, 0.22);
      color:#7e3106;
      font-weight:900;
      margin-right:0;
    }
    .clause-pill{
      display:inline-flex;
      align-items:center;
      gap:4px;
      padding: 1px 9px;
      border-radius:999px;
      border:1px dashed rgba(70,140,255,0.45);
      background: rgba(70,140,255,0.10);
      box-shadow: 0 0 0 2px rgba(70,140,255,0.06);
      margin: 0 3px;
      vertical-align:middle;
    }
    .clause-pill-text{
      color:#1f4fb8;
      font-weight:900;
      white-space:nowrap;
    }
    .hl-which{
      background: rgba(255, 208, 90, 0.35);
      border-radius: 8px;
      padding: 0 4px;
      font-weight: 900;
    }
    .hl-prep{
      background: rgba(70,140,255,0.16);
      border-radius: 8px;
      padding: 0 4px;
      font-weight: 900;
      border-bottom: 2px solid rgba(70,140,255,0.35);
    }
    .prep-draggable{ cursor: grab; }
    .prep-draggable.dragging{ opacity: .45; }
    .which-drop.over{
      box-shadow: 0 0 0 2px rgba(70,140,255,0.14);
      background: rgba(70,140,255,0.06);
    }
    .prepwhich-click{
      cursor: pointer;
      background: rgba(255, 208, 90, 0.45);
      border-radius: 999px;
      padding: 0 8px;
      border: 1px solid rgba(160, 110, 0, 0.28);
      color:#7e3106;
      font-weight: 900;
    }
    .rel-glow{
      box-shadow:
        0 0 0 2px rgba(255,208,90,0.22),
        0 0 14px rgba(255,196,64,0.45);
      animation: relGlow 1.2s ease-in-out infinite;
    }
    @keyframes relGlow{
      0%, 100%{ box-shadow: 0 0 0 2px rgba(255,208,90,0.22), 0 0 10px rgba(255,196,64,0.35); }
      50%{ box-shadow: 0 0 0 2px rgba(255,208,90,0.36), 0 0 18px rgba(255,196,64,0.62); }
    }
    .shake{
      animation: hermaShake 0.22s linear;
    }
    .shake-soft{
      animation: hermaSoftShake 0.24s ease;
    }
    @keyframes hermaShake{
      0%{ transform: translateX(0); }
      25%{ transform: translateX(-3px); }
      50%{ transform: translateX(3px); }
      75%{ transform: translateX(-2px); }
      100%{ transform: translateX(0); }
    }
    @keyframes hermaSoftShake{
      0%{ transform: translateX(0); }
      25%{ transform: translateX(-2px); }
      50%{ transform: translateX(2px); }
      75%{ transform: translateX(-1px); }
      100%{ transform: translateX(0); }
    }
  `;
  document.head.appendChild(style);
}

// ---------- load excel ----------
async function loadExcelRows(filename) {
  const bust = `v=${Date.now()}`;
  const url = filename.includes("?") ? `${filename}&${bust}` : `${filename}?${bust}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  const buf = await res.arrayBuffer();

  const wb = XLSX.read(buf, { type: "array" });
  const sheet = wb.Sheets[EXCEL_SHEET] || wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
  return rows.filter((r) => !isRowAllEmpty(r));
}
function isRowAllEmpty(row) {
  const keys = Object.keys(row || {});
  if (!keys.length) return true;
  return keys.every((k) => String(row[k] ?? "").trim() === "");
}

// ---------- build questions ----------
function buildQuestionsFromRows() {
  const filtered = rawRows
    .filter((r) => Number(r["Lesson"]) === TARGET_LESSON && Number(r["Exercise"]) === TARGET_EXERCISE)
    .sort((a, b) => Number(a["QNumber"]) - Number(b["QNumber"]));

  questions = filtered.map((r, idx) => {
    const qNumber = Number(r["QNumber"]) || idx + 1;
    const title = String(r["Title"] ?? "").trim();
    const instruction = String(r["Instruction"] ?? "").trim();
    const questionRaw = String(r["Question"] ?? "").trim();
    const answerRaw = String(r["Answer"] ?? "").trim();
    const transformsRaw =
      String(r["Transforms"] ?? r["Transform"] ?? r["TransformMap"] ?? "").trim();
    const laststageFinalRaw =
      String(r["Laststage-FinalSentence"] ?? r["LaststageFinalSentence"] ?? "").trim();
    const laststageKRTokensRaw =
      String(r["Laststage-KRTokens"] ?? r["LaststageKRTokens"] ?? "").trim();
    const transformMeta = parseTransformsMetaForL2E4(transformsRaw);

    const { stem, hint } = splitStemAndHint(questionRaw);
    const { A, B } = splitABStem(stem);

    const { a1, a2, a3, a4, insAfter } = parseAnswerStepsAndIns(answerRaw);
    const prep = detectPrepFromPrepWhich(a2);
    const finalHint = String(transformMeta.hint || hint || "which").trim();
    const finalInsAfter = Number(transformMeta.insAfter) || insAfter || 0;

    return {
      qNumber,
      title,
      instruction,
      questionRaw,
      stem,
      A,
      B,
      hint: finalHint,
      a1, a2, a3, koreanAnswer: a4,
      prep,
      transformsRaw,
      transformMeta,
      laststageFinalSentence: laststageFinalRaw,
      laststageKRTokens: laststageKRTokensRaw,
      insAfter: finalInsAfter,
    };
  });
}

function parseTransformsMetaForL2E4(raw) {
  const meta = {};
  const s = String(raw || "").trim();
  if (!s) return meta;

  const parts = s.split(/[;|]/).map((x) => x.trim()).filter(Boolean);
  for (const part of parts) {
    const m = part.match(/^([a-zA-Z0-9_-]+)\s*[:=]\s*(.+)$/);
    if (!m) continue;
    const key = String(m[1] || "").trim().toLowerCase();
    const val = String(m[2] || "").trim();
    if (!key) continue;
    meta[key] = val;
  }

  if (meta.insafter !== undefined) meta.insAfter = Number(meta.insafter) || 0;
  if (meta.hint !== undefined) meta.hint = String(meta.hint || "").replace(/[{}]/g, "").trim();
  return meta;
}

function splitStemAndHint(questionRaw) {
  const s = String(questionRaw || "").trim();
  const braceHints = s.match(/\{([^{}]+)\}/g) || [];
  if (braceHints.length) {
    const lastHint = String(braceHints[braceHints.length - 1] || "").replace(/[{}]/g, "").trim();
    const lastBraceRaw = braceHints[braceHints.length - 1] || "";
    const cutAt = s.lastIndexOf(lastBraceRaw);
    if (cutAt > 0) {
      const stem = s
        .slice(0, cutAt)
        .replace(/[→]+/g, "")
        .replace(/[^\x00-\x7F]+/g, " ")
        .trim();
      return { stem, hint: lastHint };
    }
  }
  const arrowIdx = s.lastIndexOf("→");
  if (arrowIdx === -1) {
    return {
      stem: s.replace(/[^\x00-\x7F]+/g, " ").trim(),
      hint: ""
    };
  }
  const stem = s
    .slice(0, arrowIdx)
    .replace(/[^\x00-\x7F]+/g, " ")
    .trim();
  const hintRaw = s.slice(arrowIdx + 1).trim();
  const hint = hintRaw.replace(/[{}]/g, "").trim();
  return { stem, hint };
}

function splitABStem(stem) {
  const s = String(stem || "").trim();
  const aPos = s.search(/A\.\s*/i);
  const bPos = s.search(/B\.\s*/i);
  if (aPos === -1) return { A: "", B: s };

  if (bPos !== -1 && bPos > aPos) {
    const afterA = s.slice(aPos).replace(/^A\.\s*/i, "");
    const A = afterA.slice(0, Math.max(0, bPos - aPos)).replace(/B\.\s*$/i, "").trim();
    const B = s.slice(bPos).replace(/^B\.\s*/i, "").trim();
    return { A, B };
  }
  return { A: s.replace(/^A\.\s*/i, "").trim(), B: "" };
}

function parseAnswerStepsAndIns(answerRaw) {
  let s = String(answerRaw || "").trim();
  let insAfter = 0;

  const m = s.match(/\|\|\s*ins\s*:\s*(\d+)\s*$/i);
  if (m) {
    insAfter = Number(m[1]) || 0;
    s = s.replace(/\|\|\s*ins\s*:\s*\d+\s*$/i, "").trim();
  }

  // 1) ... 2) ... 3) ... 4) ...
  const mm = s.match(
    /1\)\s*([\s\S]*?)\s*2\)\s*([\s\S]*?)\s*3\)\s*([\s\S]*?)\s*4\)\s*([\s\S]*)$/m
  );

  if (!mm) {
    // 폴백: 전부 영어로 들어온 경우
    return { a1: stripTrailingPeriod(s), a2: "", a3: "", a4: "", insAfter };
  }

  return {
    a1: stripTrailingPeriod(mm[1].trim()),
    a2: stripTrailingPeriod(mm[2].trim()),
    a3: stripTrailingPeriod(mm[3].trim()),
    a4: mm[4].trim(),
    insAfter,
  };
}

function detectPrepFromPrepWhich(prepWhichSentence) {
  const low = String(prepWhichSentence || "").toLowerCase();
  const m = low.match(/\b(about|at|by|for|from|in|of|on|to|with)\s+which\b/);
  return m ? m[1] : "";
}

// ---------- intro ----------
function renderIntro() {
  const area = document.getElementById("quiz-area");
  if (!area) return;

  if (window.HermaIntroFronts && typeof window.HermaIntroFronts.render === "function") {
    try {
      if (window.HermaIntroFronts.render(area, {
        lesson: TARGET_LESSON,
        exercise: TARGET_EXERCISE,
        onStart: startQuiz,
      })) {
        return;
      }
    } catch (err) {
      console.error("HermaIntroFronts render failed:", err);
    }
  }


  const title = questions[0]?.title || "Herma L2-E4";
  const instruction =
    questions[0]?.instruction ||
    "약분 → which문장 만들기 → 전치사를 which 앞으로 옮기기 → where/when/why로 바꾸기";

  area.innerHTML = `
    <div class="box">
      <div style="font-size:18px; font-weight:900; color:#7e3106; margin-bottom:10px;">📘 Herma L2-E4</div>

      <div style="margin-bottom:10px;">
        <span class="pill">Lesson ${TARGET_LESSON}</span>
        <span class="pill">Exercise ${TARGET_EXERCISE}</span>
        <span class="pill">Day ${escapeHtml(day)}</span>
      </div>

      <div style="font-weight:900; margin-bottom:6px; color:#444;">${escapeHtml(title)}</div>

      <div style="margin-top:10px; font-size:13px; color:#7e3106; line-height:1.6;">
        📝 ${escapeHtml(instruction)}
      </div>

      <button class="quiz-btn" style="width:100%; margin-top:12px;" onclick="startQuiz()">🚀 시작</button>
    </div>
  `;
}

function startQuiz() {
  if (!questions.length) {
    alert("해당 Lesson/Exercise에 문제가 없습니다.");
    return;
  }
  currentIndex = 0;
  results = [];
  renderQuestion();
}

// ---------- main ----------
function renderQuestion() {
  const area = document.getElementById("quiz-area");
  if (!area) return;
  document.querySelectorAll(".b-drag-chip, .b-clause-chip, .b-clause-ghost, .b-handle-point, .tap-tip-inline, .tap-tip-gold").forEach((el) => el.remove());
  const strayTap = document.querySelector("body > #tap-tip.drag-arc");
  if (strayTap) strayTap.remove();

  const q = questions[currentIndex];
  if (!q) return showResultPopup();

  isAnswered = false;
  reduced = false;
  insertOk = false;
  frontMoved = false;
  frontDragActive = false;
  handleSpawned = false;
  movedPrep = false;
  relCompressed = false;
  translateMode = false;
  mixRendered = false;
  isKoLocked = false;

  bankTokens = [];
  selectedTokens = [];
  fadedIdxSet = new Set();
  requiredIdxSet = new Set();
  bReqIdxSet = new Set();
  bFadedIdxSet = new Set();

  correctInsAfter = Number(q.insAfter) || 0;

  tokensA = tokenizeStarAndBrace(q.A);
  const aMax = getMaxIdx(tokensA);
  tokensB = tokenizeStarAndBrace(q.B).map((t) => ({ ...t, idx: t.idx ? t.idx + aMax : 0 }));

  for (const t of [...tokensA, ...tokensB]) {
    if (!t.isSpace && t.isReq) requiredIdxSet.add(String(t.idx));
  }
  for (const t of tokensB) {
    if (!t.isSpace && t.isReq) bReqIdxSet.add(String(t.idx));
  }

  const translateBlockTpl =
    window.HermaStageTemplates?.translateBlockHTML?.() ||
    `
      <div id="translate-block" class="hidden">
        <div class="box" style="margin-bottom:10px;">
          <div class="sentence" id="plain-english-line"></div>
        </div>
        <div class="sentence" id="answer-line" style="
          min-height:86px;
          display:flex;
          flex-wrap:wrap;
          align-items:flex-start;
          gap:6px;
        "></div>
        <div class="box" style="margin-top:10px;">
          <div id="bank-area"></div>
          <div id="remain-info" style="margin-top:8px; font-size:12px; font-weight:900; color:rgba(126,49,6,0.78);"></div>
        </div>
      </div>
    `;

  area.innerHTML = `
    <div class="q-label">Q. ${currentIndex + 1} / ${questions.length}</div>

    <div class="box" id="instruction-box">
      <div class="stage-pill" id="stage-pill">1단계: 약분 준비</div>
      <div id="instruction-text" style="font-weight:900; color:#7e3106; line-height:1.6;">
        약분을 먼저 해볼까요!
      </div>
      <div id="instruction-sub" style="margin-top:8px; font-size:12px; color:#555; line-height:1.5;">
        
      </div>
    </div>

    <div class="ab-shell" id="ab-block">
      <div class="ab-title">문장 A</div>
      <div class="sentence sentence-a" id="sentence-a"></div>

      <div id="b-area">
        <div class="ab-title" style="margin-top:10px;">문장 B</div>
        <div class="sentence sentence-b cool" id="sentence-b"></div>
        <div id="tap-tip" class="tap-tip hidden">drag</div>
      </div>

      <div id="hint-area" class="hint-pill hidden"></div>
    </div>

    ${translateBlockTpl}

    <div id="stage-action-row" class="btn-row" style="margin-top:12px; display:none;">
      <button class="quiz-btn" id="submit-btn" onclick="submitAnswer()">제출</button>
      <button class="quiz-btn" id="next-btn" onclick="goNext()">다음</button>
    </div>

    <div id="feedback-area" style="margin-top:12px;"></div>
  `;

  const sa = document.getElementById("sentence-a");
  const sb = document.getElementById("sentence-b");
  const bArea = document.getElementById("b-area");

  if (sa) sa.innerHTML = buildSentenceHTML(tokensA, "A");
  if (sb) sb.innerHTML = buildSentenceHTML(tokensB, "B");

  const submitBtn = document.getElementById("submit-btn");
  if (submitBtn) submitBtn.disabled = true;
  const actionRow = document.getElementById("stage-action-row");
  if (actionRow) actionRow.style.display = "none";
  const stagePillEl = document.getElementById("stage-pill");
  const stageTextEl = document.getElementById("instruction-text");
  const stageSubEl = document.getElementById("instruction-sub");
  if (stagePillEl) stagePillEl.style.display = "none";
  if (stagePillEl) stagePillEl.textContent = "1단계: 약분 준비";
  if (stageTextEl) stageTextEl.textContent = "약분을 먼저 해볼까요!";
  if (stageSubEl) {
    stageSubEl.textContent = "";
    stageSubEl.style.display = "none";
  }

  const onClickToken = (ev) => {
    const el = ev.target.closest("[data-idx]");
    if (!el) return;

    const idx = el.getAttribute("data-idx");
    const isReq = el.getAttribute("data-req") === "1";
    const isPre = el.classList.contains("pre");

    if (!frontMoved) {
      if (frontDragActive) return;
      if (!(isReq || isPre)) {
        el.classList.add("nope");
        setTimeout(() => el.classList.remove("nope"), 120);
        return;
      }
      const tr = el.getBoundingClientRect();
      enterFrontDragStageE24({
        x: tr.left + (tr.width / 2),
        y: tr.top + (tr.height / 2),
      });
      return;
    }

    if (frontMoved && !reduced) {
      if (!idx) return;
      const isBReq = el.getAttribute("data-breq") === "1";
      if (!isBReq) {
        el.classList.add("nope");
        setTimeout(() => el.classList.remove("nope"), 120);
        return;
      }
      el.classList.toggle("faded");
      if (el.classList.contains("faded")) bFadedIdxSet.add(String(idx));
      else bFadedIdxSet.delete(String(idx));

      if (isAllBRequiredFaded()) {
        reduced = true;
        toastOk("약분 완료!");
        enterHandleReadyStageE24();
      }
      return;
    }
  };

  if (sa) sa.addEventListener("click", onClickToken);
  if (sb) sb.addEventListener("click", onClickToken);

  let prepTapEl = null;
  let hintTapEl = null;
  function showPrepTap(clickEl) {
    hidePrepTap();
    if (!clickEl) return;
    const tip = document.createElement("span");
    tip.className = "tap-tip-inline";
    tip.textContent = "tap!";
    const r = clickEl.getBoundingClientRect();
    tip.style.left = `${Math.round(r.left + r.width / 2 - 20)}px`;
    tip.style.top = `${Math.round(Math.max(6, r.top - 24))}px`;
    document.body.appendChild(tip);
    prepTapEl = tip;
  }
  function hidePrepTap() {
    if (!prepTapEl) return;
    prepTapEl.remove();
    prepTapEl = null;
  }

  function showHintTap(hintEl) {
    hideHintTap();
    if (!hintEl) return;
    const tip = document.createElement("span");
    tip.className = "tap-tip-gold";
    tip.textContent = "tap!";
    const r = hintEl.getBoundingClientRect();
    tip.style.left = `${Math.round(r.left + r.width / 2 - 17)}px`;
    tip.style.top = `${Math.round(Math.max(6, r.top - 18))}px`;
    document.body.appendChild(tip);
    hintTapEl = tip;
  }
  function hideHintTap() {
    if (!hintTapEl) return;
    hintTapEl.remove();
    hintTapEl = null;
  }

  function enterFrontDragStageE24(startAnchor) {
    frontDragActive = true;

    const pill = document.getElementById("stage-pill");
    const it = document.getElementById("instruction-text");
    const sub = document.getElementById("instruction-sub");
    if (pill) pill.textContent = "1단계: 위치 이동";
    if (it) it.textContent = "약분하기 좋게 옮겨봅시다";
    if (sub) {
      sub.textContent = "";
      sub.style.display = "none";
    }

    const tapTip = document.getElementById("tap-tip");
    if (tapTip) {
      tapTip.textContent = "drag";
      tapTip.classList.add("drag-mode");
      tapTip.classList.remove("hidden");
    }

    if (!sb) return;
    startFrontDragStepE24(sb, startAnchor, () => {
      frontMoved = true;
      frontDragActive = false;
      bFadedIdxSet = new Set();
      sb.innerHTML = buildBFrontReductionHTMLE24(tokensB, bFadedIdxSet);
      toastOk("위치 이동 완료!");
      enterReduceStageE24();
    });
  }

  function enterReduceStageE24() {
    const pill = document.getElementById("stage-pill");
    const it = document.getElementById("instruction-text");
    const sub = document.getElementById("instruction-sub");
    if (pill) pill.textContent = "2단계: 약분하기";
    if (it) it.textContent = "드디어 약분해볼까요!";
    if (sub) {
      sub.textContent = "";
      sub.style.display = "none";
    }
    const tapTip = document.getElementById("tap-tip");
    if (tapTip) tapTip.classList.add("hidden");
  }

  function enterHandleReadyStageE24() {
    const pill = document.getElementById("stage-pill");
    const it = document.getElementById("instruction-text");
    const sub = document.getElementById("instruction-sub");
    if (pill) pill.textContent = "2단계: 결합하기";
    if (it) it.textContent = "문장 B의 +를 문장 A 목표 위치로 옮겨보세요.";
    if (sub) {
      sub.textContent = "";
      sub.style.display = "none";
    }
    if (sa) sa.classList.add("active");

    const tapTip = document.getElementById("tap-tip");
    if (tapTip) {
      stopTapTipArcE24(tapTip);
      tapTip.textContent = "tap";
      tapTip.classList.remove("drag-mode");
      tapTip.classList.remove("drag-arc");
      tapTip.classList.remove("hidden");
      tapTip.style.position = "";
      tapTip.style.left = "";
      tapTip.style.top = "";
      tapTip.style.transform = "";
    }

    if (!sb || !bArea || !sa) return;
    sb.style.cursor = "pointer";
    sb.addEventListener("click", () => spawnHandlePointAndEnableDragE24(sa, sb, bArea, q), { once: true });
  }

  function startFrontDragStepE24(sb, startAnchor, onDone) {
    const reqSpans = Array.from(sb.querySelectorAll('[data-req="1"]'));
    if (!reqSpans.length) {
      onDone?.();
      return;
    }

    const layoutBefore = captureReqLayoutE24(reqSpans);
    if (!layoutBefore) {
      onDone?.();
      return;
    }

    const slot = document.createElement("span");
    slot.className = "b-front-slot";
    slot.setAttribute("aria-hidden", "true");
    const reqText = getReqPhraseTextE24(tokensB);
    const measuredW = measureClauseChipWidthE24(reqText);
    const baseSlotW = Math.max(56, Math.round(measuredW + 8));
    slot.style.width = `${baseSlotW}px`;
    sb.prepend(slot);

    // 도착영역(slot) 생성으로 밀린 실제 좌표를 시작점으로 사용
    const layoutAfter = captureReqLayoutE24(reqSpans) || layoutBefore;

    const chip = createReqGhostFromLayoutE24(layoutAfter);
    document.body.appendChild(chip);
    const chipRect0 = chip.getBoundingClientRect();
    const startX = Math.round(chipRect0.left);
    const startY = Math.round(chipRect0.top);

    reqSpans.forEach((s) => { s.style.opacity = "0"; });

    const tapTip = document.getElementById("tap-tip");
    if (tapTip) {
      const sr = slot.getBoundingClientRect();
      startTapTipArcE24(
        tapTip,
        { x: layoutAfter.anchor.left + layoutAfter.anchor.width / 2, y: layoutAfter.anchor.top + (layoutAfter.anchor.height / 2) },
        { x: sr.left + sr.width / 2, y: sr.top + (sr.height / 2) }
      );
    }

    let dragging = false;
    let dx = 0;
    let dy = 0;
    let isSingle = false;

    const toSingleGhost = (anchorX, anchorY) => {
      if (isSingle) return;
      const r0 = chip.getBoundingClientRect();
      const fallbackX = r0.left + (r0.width / 2);
      const fallbackY = r0.top + (r0.height / 2);
      const cx = Number.isFinite(anchorX) ? Number(anchorX) : fallbackX;
      const cy = Number.isFinite(anchorY) ? Number(anchorY) : fallbackY;

      chip.classList.remove("b-clause-ghost");
      chip.classList.add("b-clause-chip");
      chip.innerHTML = "";
      chip.textContent = reqText;
      chip.style.width = "";
      chip.style.height = "";

      const r1 = chip.getBoundingClientRect();
      chip.style.left = `${Math.round(cx - (r1.width / 2))}px`;
      chip.style.top = `${Math.round(cy - (r1.height / 2))}px`;
      isSingle = true;
    };

    const toSplitGhostAtStart = () => {
      if (!isSingle) return;
      applyReqGhostSplitLayoutE24(chip, layoutAfter);
      chip.style.left = `${Math.round(startX)}px`;
      chip.style.top = `${Math.round(startY)}px`;
      isSingle = false;
    };

    const resetChip = () => {
      toSplitGhostAtStart();
      chip.style.left = `${Math.round(startX)}px`;
      chip.style.top = `${Math.round(startY)}px`;
      slot.classList.remove("hit");
    };

    const onMove = (e) => {
      if (!dragging) return;
      const nx = e.clientX - dx;
      const ny = e.clientY - dy;
      chip.style.left = `${nx}px`;
      chip.style.top = `${ny}px`;

      const cRect = chip.getBoundingClientRect();
      const cx = cRect.left + cRect.width / 2;
      const cy = cRect.top + cRect.height / 2;
      const sRect = slot.getBoundingClientRect();
      const hit = cx >= sRect.left && cx <= sRect.right && cy >= sRect.top && cy <= sRect.bottom;
      slot.classList.toggle("hit", hit);
    };

    const onUp = (e) => {
      if (!dragging) return;
      dragging = false;
      chip.classList.remove("dragging");
      chip.releasePointerCapture?.(e.pointerId);

      const cRect = chip.getBoundingClientRect();
      const cx = cRect.left + cRect.width / 2;
      const cy = cRect.top + cRect.height / 2;
      const sRect = slot.getBoundingClientRect();
      const hit = cx >= sRect.left && cx <= sRect.right && cy >= sRect.top && cy <= sRect.bottom;

      if (!hit) {
        resetChip();
        return;
      }

      const tip = document.getElementById("tap-tip");
      if (tip) {
        stopTapTipArcE24(tip);
        tip.classList.add("hidden");
      }
      chip.remove();
      slot.remove();
      onDone?.();
    };

    const onDown = (e) => {
      dragging = true;
      toSingleGhost(e.clientX, e.clientY);
      chip.classList.add("dragging");
      const rect = chip.getBoundingClientRect();
      dx = e.clientX - rect.left;
      dy = e.clientY - rect.top;
      chip.setPointerCapture?.(e.pointerId);
    };

    chip.addEventListener("pointerdown", onDown);
    chip.addEventListener("pointermove", onMove);
    chip.addEventListener("pointerup", onUp);
    chip.addEventListener("pointercancel", onUp);
  }

  async function spawnHandlePointAndEnableDragE24(sa, sb, bArea, q) {
    if (handleSpawned) return;
    handleSpawned = true;

    const tapTip = document.getElementById("tap-tip");
    if (tapTip) tapTip.classList.add("hidden");

    if (sa) {
      sa.innerHTML = buildSentenceWithGapsHTML(tokensA, "A");
      sa.classList.add("active");
      sa.style.position = "relative";
      sa.style.zIndex = "30";
    }

    sb.style.position = "relative";
    sb.style.zIndex = "10";
    sb.style.cursor = "default";
    const point = document.createElement("span");
    point.className = "b-handle-point";
    point.textContent = "+";
    point.style.position = "fixed";
    point.style.transform = "translate(-50%, -50%)";
    point.style.zIndex = "9999";

    const reqSpans = Array.from(sb.querySelectorAll('[data-breq="1"]'));
    const sbRect = sb.getBoundingClientRect();
    let anchorCX = sbRect.left + (sbRect.width / 2);
    let anchorCY = sbRect.top + (sbRect.height / 2);
    if (reqSpans.length) {
      const rr = getSpanAnchorRectE24(reqSpans);
      anchorCX = rr.left + (rr.width / 2);
      anchorCY = rr.top + (rr.height / 2);
    }
    document.body.appendChild(point);
    const startLeft = Math.round(anchorCX);
    const startTop = Math.round(anchorCY);
    point.style.left = `${startLeft}px`;
    point.style.top = `${startTop}px`;

    let dragging = false;
    let startPX = 0;
    let startPY = 0;
    let baseLeft = startLeft;
    let baseTop = startTop;

    const resetPoint = () => {
      point.classList.remove("dragging");
      point.classList.remove("target-hot");
      sb.style.transform = "";
      clearGapHotState(sa);
      point.style.left = `${baseLeft}px`;
      point.style.top = `${baseTop}px`;
    };

    const onMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - startPX;
      const dy = e.clientY - startPY;
      sb.style.transform = `translate(${Math.round(dx)}px, ${Math.round(dy)}px)`;
      point.style.left = `${Math.round(baseLeft + dx)}px`;
      point.style.top = `${Math.round(baseTop + dy)}px`;

      const cRect = point.getBoundingClientRect();
      const gapEl = pickDropGapElement(sa, cRect);
      const hot = !!gapEl;
      clearGapHotState(sa);
      if (hot && gapEl) gapEl.classList.add("target-hot");
      point.classList.toggle("target-hot", hot);
    };

    const onUp = (e) => {
      if (!dragging) return;
      dragging = false;
      point.classList.remove("dragging");
      point.classList.remove("target-hot");
      point.releasePointerCapture?.(e.pointerId);
      clearGapHotState(sa);

      const cRect = point.getBoundingClientRect();
      const expectedAfter = Number(correctInsAfter) || 2;
      const gapEl = pickDropGapElement(sa, cRect);
      const dropGap = gapEl ? (Number(gapEl.getAttribute("data-after")) || 0) : 0;
      if (!dropGap || dropGap !== expectedAfter) {
        resetPoint();
        toastNo("오답…");
        return;
      }

      insertOk = true;
      point.remove();
      sb.style.transform = "";

      renderMixedPreview(sa, dropGap, q);
      if (bArea) collapseUpAndRemove(bArea);
      toastOk("2단계 완료!");
      setTimeout(() => enterHintReplaceStep(sa, bArea, q), 320);
    };

    const onDown = (e) => {
      dragging = true;
      point.classList.add("dragging");
      startPX = e.clientX;
      startPY = e.clientY;
      const pr = point.getBoundingClientRect();
      baseLeft = pr.left + (pr.width / 2);
      baseTop = pr.top + (pr.height / 2);
      point.setPointerCapture?.(e.pointerId);
    };

    point.addEventListener("pointerdown", onDown);
    point.addEventListener("pointermove", onMove);
    point.addEventListener("pointerup", onUp);
    point.addEventListener("pointercancel", onUp);
  }

  function enterTouchStage() {
    reduced = true;
    toastOk("1단계 완료!");

    const pill = document.getElementById("stage-pill");
    const it = document.getElementById("instruction-text");
    const sub = document.getElementById("instruction-sub");
    if (pill) pill.textContent = "2단계: 합치기";
    if (it) it.textContent = "두 문장을 합쳐보세요!";
    if (sub) {
      sub.textContent = "";
      sub.style.display = "none";
    }
    if (sa) sa.classList.add("active");

    const hintArea = document.getElementById("hint-area");
    if (hintArea) {
      hintArea.textContent = `힌트:${String(q.hint || "which").trim()}`;
      hintArea.classList.remove("hidden");
    }

    const tapTip = document.getElementById("tap-tip");
    if (tapTip) tapTip.classList.remove("hidden");

    if (!sb || !bArea || !sa) return;
    sb.style.cursor = "pointer";
    sb.addEventListener("click", () => collapseAndSpawnDragChip(sa, sb, bArea, q), { once: true });
  }

  async function collapseAndSpawnDragChip(sa, sb, bArea, q) {
    const bRect = sb.getBoundingClientRect();
    const tapTip = document.getElementById("tap-tip");
    if (tapTip) tapTip.classList.add("hidden");

    sb.classList.add("collapsing-center");
    await wait(320);
    sb.classList.remove("collapsing-center");
    sb.classList.add("collapsed-slot");
    const slotH = Math.max(1, Math.round(sb.offsetHeight || bRect.height));
    sb.style.minHeight = "";
    sb.style.boxSizing = "border-box";
    sb.style.height = `${slotH}px`;
    sb.innerHTML = "";
    sb.style.cursor = "default";

    if (sa) sa.innerHTML = buildSentenceWithGapsHTML(tokensA, "A");

    const chip = document.createElement("div");
    chip.className = "b-drag-chip";
    chip.innerHTML = `<span class="b-drag-plus">+</span>`;
    document.body.appendChild(chip);

    const startX = bRect.left + bRect.width / 2 - 11;
    const startY = bRect.top + 8;
    chip.style.left = `${startX}px`;
    chip.style.top = `${startY}px`;

    let dragging = false;
    let dx = 0;
    let dy = 0;

    const onMove = (e) => {
      if (!dragging) return;
      chip.style.left = `${e.clientX - dx}px`;
      chip.style.top = `${e.clientY - dy}px`;
    };

    const onUp = (e) => {
      if (!dragging) return;
      dragging = false;
      chip.classList.remove("dragging");
      chip.releasePointerCapture?.(e.pointerId);

      const aRect = sa.getBoundingClientRect();
      const cRect = chip.getBoundingClientRect();
      const cx = cRect.left + cRect.width / 2;
      const cy = cRect.top + cRect.height / 2;
      const inA = cx >= aRect.left && cx <= aRect.right && cy >= aRect.top && cy <= aRect.bottom;
      const expectedAfter = Number(correctInsAfter) || 2;

      if (!inA) {
        chip.style.left = `${startX}px`;
        chip.style.top = `${startY}px`;
        return;
      }

      const dropGap = pickDropGapAfter(sa, cx, cy);
      if (!dropGap || dropGap !== expectedAfter) {
        chip.style.left = `${startX}px`;
        chip.style.top = `${startY}px`;
        toastNo("오답…");
        return;
      }

      insertOk = true;
      chip.remove();

      renderMixedPreview(sa, dropGap, q);
      if (bArea) collapseUpAndRemove(bArea);
      toastOk("2단계 완료!");
      setTimeout(() => enterHintReplaceStep(sa, bArea, q), 320);
    };

    const onDown = (e) => {
      dragging = true;
      chip.classList.add("dragging");
      const rect = chip.getBoundingClientRect();
      dx = e.clientX - rect.left;
      dy = e.clientY - rect.top;
      chip.setPointerCapture?.(e.pointerId);
    };

    chip.addEventListener("pointerdown", onDown);
    chip.addEventListener("pointermove", onMove);
    chip.addEventListener("pointerup", onUp);
    chip.addEventListener("pointercancel", onUp);
  }

  function renderMixedPreview(sa, afterPos, q) {
    if (!sa || mixRendered) return;
    mixRendered = true;

    const struck = concatTokens(tokensB, (t) => t.isReq).trim(); // 약분 대상
    const rest = concatTokens(tokensB, (t) => !t.isReq).trim(); // 남는 부분
    const clause = rest;

    if (window.HermaStageTemplates?.buildMixedPreviewHTML) {
      sa.innerHTML = window.HermaStageTemplates.buildMixedPreviewHTML({
        tokensA,
        afterPos,
        struckText: struck,
        clauseText: clause,
        escapeHtml,
      });
    } else {
      sa.innerHTML = buildMixedHTML(tokensA, afterPos, struck, clause);
    }

    sa.classList.add("active");
    sa.classList.add("mix-fadein");
  }

  function enterHintReplaceStep(sa, bArea, q) {
    const pill = document.getElementById("stage-pill");
    const it = document.getElementById("instruction-text");
    const sub = document.getElementById("instruction-sub");
    const hintArea = document.getElementById("hint-area");
    const hintWord = getHintWord(q.hint || "which");

    if (pill) pill.textContent = "2.5단계: 힌트 적용";
    if (it) it.innerHTML = `<b>힌트:${escapeHtml(hintWord)}</b>를 눌러 지운 공통어를 바꿔보세요.`;
    if (sub) {
      sub.textContent = "";
      sub.style.display = "none";
    }

    if (!hintArea) {
      enterMergedSingleLineMode(sa, q);
      return;
    }

    hintArea.textContent = `힌트:${hintWord}`;
    hintArea.style.cursor = "pointer";
    hintArea.classList.remove("hidden");
    showHintTap(hintArea);

    hintArea.addEventListener("click", () => {
      hideHintTap();
      if (sa) sa.innerHTML = renderA1WithDrag(q.a1, q.prep, { draggable: false });

      hintArea.remove();
      setTimeout(() => enterMergedSingleLineMode(sa, q), 220);
    }, { once: true });
  }

  // ✅ 여기부터 L2E4 핵심: "문장 한 줄" 안에서 드래그/클릭
  function enterMergedSingleLineMode(sa, q) {
    if (!sa) return;

    const pill = document.getElementById("stage-pill");
    const it = document.getElementById("instruction-text");
    const sub = document.getElementById("instruction-sub");

    if (pill) pill.textContent = "3단계: 전치사를 which 앞으로!";
    if (it) {
      it.innerHTML = `
        문장 끝의 <b class="hl-prep">${escapeHtml(q.prep || "전치사")}</b>를
        <b class="hl-which">which</b> 앞에 <b>끌어다 놓으세요</b>.
      `;
    }
    if (sub) sub.innerHTML = `<span style="color:#555;">(놓으면 문장이 자연스럽게 바뀝니다)</span>`;

    // A문장 영역을 "합쳐진 문장 1줄"로 교체
    sa.style.pointerEvents = "auto";
    sa.innerHTML = renderA1WithDrag(q.a1, q.prep, { draggable: true });

    const prepEl = sa.querySelector(".prep-draggable");
    const whichEl = sa.querySelector(".which-drop");
    const wrap = sa;

    if (!prepEl || !whichEl) {
      // 데이터가 이상하면 그냥 a1 출력
      sa.textContent = q.a1 + ".";
      return;
    }

    prepEl.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", (q.prep || "").trim());
      prepEl.classList.add("dragging");
    });
    prepEl.addEventListener("dragend", () => prepEl.classList.remove("dragging"));

    whichEl.addEventListener("dragover", (e) => {
      e.preventDefault();
      whichEl.classList.add("over");
    });
    whichEl.addEventListener("dragleave", () => whichEl.classList.remove("over"));

    whichEl.addEventListener("drop", (e) => {
      e.preventDefault();
      whichEl.classList.remove("over");

      const data = (e.dataTransfer.getData("text/plain") || "").trim().toLowerCase();
      const expected = (q.prep || "").trim().toLowerCase();
      if (!expected || data !== expected) {
        shake(wrap);
        return;
      }

      // ✅ 성공: 끝 전치사는 사라지고, 문장은 a2로 자연화
      movedPrep = true;
      shake(wrap);

      // a2 렌더 + prep+which를 클릭 가능하게 하이라이트
      sa.innerHTML = renderA2ClickablePrepWhich(q.a2, q.prep);

      // 안내 문구 업데이트
      if (pill) pill.textContent = "4단계: prep + which =?";
      if (it) {
        it.innerHTML = `
          <span class="prepwhich-click" style="pointer-events:none;">${escapeHtml((q.prep||"") + " which")}</span>
          부분을 <b>클릭</b>해서 <b>where</b>로 바꾸세요.
        `;
      }
      if (sub) sub.innerHTML = `<span style="color:#555;">(클릭하면 바로 바뀜)</span>`;

      // 클릭 시 a3로 바꾸고 해석 순서 진입
      const clickEl = sa.querySelector(".prepwhich-click");
      if (clickEl) {
        showPrepTap(clickEl);
        clickEl.addEventListener("click", async () => {
          if (relCompressed) return;
          relCompressed = true;
          hidePrepTap();

          sa.innerHTML = renderA3HighlightedRel(q.a3);
          const relEl = sa.querySelector(".rel-hint");
          if (relEl) {
            relEl.classList.remove("shake-soft");
            void relEl.offsetWidth;
            relEl.classList.add("shake-soft");
          } else {
            shake(wrap);
          }

          await wait(250);
          toastOk("3단계 완료!");
          enterTranslateMode(q);
        });
      }
    });
  }

  function enterTranslateMode(q) {
    if (translateMode) return;
    translateMode = true;

    hidePrepTap();
    hideHintTap();
    const ab = document.getElementById("ab-block");
    const instBox = document.getElementById("instruction-box");
    const tb = document.getElementById("translate-block");
    if (window.HermaStageTemplates?.openFinalStage) {
      window.HermaStageTemplates.openFinalStage({
        abBlockEl: ab,
        instructionBoxEl: instBox,
        translateBlockEl: tb,
        collapseRemove: collapseUpAndRemove,
      });
    } else {
      if (ab) ab.classList.add("hidden");
      collapseUpAndRemove(instBox);
      if (tb) tb.classList.remove("hidden");
    }

    const plain = document.getElementById("plain-english-line");
    if (plain) {
      const configuredFinalParts = parseLaststageFinalSentenceForL2E4(q.laststageFinalSentence);
      if (configuredFinalParts.length) {
        plain.innerHTML = `<div>${renderConfiguredFinalSentenceForL2E4(configuredFinalParts)}</div>`;
      } else {
        plain.innerHTML = `<div>${renderA3HighlightedRel(q.a3)}</div>`;
      }
    }

    revealTranslate(q);
    const actionRow = document.getElementById("stage-action-row");
    if (actionRow) actionRow.style.display = "flex";
    const submitBtn = document.getElementById("submit-btn");
    if (submitBtn) submitBtn.disabled = false;
  }
}

// ---------- sentence render helpers (L2E4) ----------
function renderA1WithDrag(a1, prep, options = {}) {
  const isDrag = options.draggable !== false;
  const s = stripTrailingPeriod(String(a1 || "").trim());
  const p = String(prep || "").trim();
  if (!s) return "";

  const mWhich = s.match(/\bwhich\b/i);
  if (!mWhich || typeof mWhich.index !== "number") return escapeHtml(s) + ".";

  const whichStart = mWhich.index;
  const whichWord = mWhich[0];
  const before = s.slice(0, whichStart).trim();
  const afterWhich = s.slice(whichStart + whichWord.length).trim();

  let clauseText = afterWhich;
  let prepWord = p;
  if (p) {
    const reEnd = new RegExp(`^(.*)\\b(${escapeReg(p)})\\b$`, "i");
    const mEnd = afterWhich.match(reEnd);
    if (mEnd) {
      clauseText = String(mEnd[1] || "").trim();
      prepWord = String(mEnd[2] || p).trim();
    }
  }

  const beforeHtml = escapeHtml(before);
  const whichCls = isDrag ? "hint-chip-gold which-drop" : "hint-chip-gold";
  const whichHtml = `<span class="${whichCls}">${escapeHtml(whichWord)}</span>`;
  const clauseMain = clauseText ? `<span class="clause-pill-text">${escapeHtml(clauseText)}</span>` : "";
  let prepHtml = "";
  if (prepWord) {
    if (isDrag) {
      prepHtml = `<span class="hint-chip-gold prep-draggable" draggable="true">${escapeHtml(prepWord)}</span>`;
    } else {
      prepHtml = `<span class="hint-chip-gold">${escapeHtml(prepWord)}</span>`;
    }
  }
  const gap = clauseMain && prepHtml ? " " : "";

  if (!clauseMain && !prepHtml) {
    return `${beforeHtml} ${whichHtml}.`;
  }
  return `${beforeHtml} <span class="mix-insert">${whichHtml} <span class="clause-pill">${clauseMain}${gap}${prepHtml}</span></span>.`;
}

function renderA2ClickablePrepWhich(a2, prep) {
  // a2: "This is the apartment in which I live"
  const s = stripTrailingPeriod(String(a2 || "").trim());
  const p = String(prep || "").trim();
  if (!s) return "";

  if (!p) return escapeHtml(s) + ".";

  const re = new RegExp(`\\b${escapeReg(p)}\\s+which\\b`, "i");
  const m = s.match(re);
  if (!m) return escapeHtml(s) + ".";

  const i = m.index;
  const seg = s.slice(i, i + m[0].length);
  const before = escapeHtml(s.slice(0, i));
  const mid = escapeHtml(seg);
  const after = escapeHtml(s.slice(i + seg.length));

  return `${before}<span class="prepwhich-click">${mid}</span>${after}.`;
}

function renderA3HighlightedRel(a3) {
  const s = stripTrailingPeriod(String(a3 || "").trim());
  if (!s) return "";
  return escapeHtml(s).replace(/\b(where|when|why)\b/gi, (m) => `<span class="hint-chip-gold rel-hint rel-glow">${m}</span>`) + ".";
}

function shake(el) {
  el.classList.remove("shake");
  void el.offsetWidth;
  el.classList.add("shake");
  setTimeout(() => el.classList.remove("shake"), 240);
}

function parseLaststageFinalSentenceForL2E4(raw) {
  const s = String(raw || "").trim();
  if (!s) return [];

  const parts = s.split("|").map((x) => x.trim()).filter(Boolean);
  if (!parts.length) return [];

  let tagged = false;
  const out = [];
  parts.forEach((part) => {
    const m = part.match(/^(plain|a|b|c|ab|pair|link|linkbox|hint)\s*::\s*(.+)$/i);
    if (m) {
      tagged = true;
      out.push({ seg: String(m[1] || "").toLowerCase(), text: String(m[2] || "").trim() });
      return;
    }
    out.push({ seg: "plain", text: part });
  });

  if (!tagged) return [];
  return out.filter((x) => x.text);
}

function mapFinalSegClassForL2E4(seg) {
  const s = String(seg || "").toLowerCase();
  if (s === "a" || s === "ab" || s === "pair") return "uA";
  if (s === "b" || s === "c") return "uB";
  if (s === "link") return "uLink";
  if (s === "linkbox" || s === "hint") return "who-gold";
  return "";
}

function renderConfiguredFinalSentenceForL2E4(parts) {
  const chunks = parts.map((part) => {
    const text = String(part?.text || "").trim();
    if (!text) return "";
    const cls = mapFinalSegClassForL2E4(part.seg);
    if (!cls) return escapeHtml(text);
    return `<span class="${cls}">${escapeHtml(text)}</span>`;
  }).filter(Boolean);
  if (!chunks.length) return "";
  const joined = chunks.join(" ").trim();
  if (/[.!?]$/.test(joined)) return joined;
  return `${joined}.`;
}

function parseLaststageKRTokensForL2E4(raw) {
  const s = String(raw || "").trim();
  if (!s) return [];

  const tokens = s.split("|").map((x) => x.trim()).filter(Boolean);
  if (!tokens.length) return [];

  let tagged = false;
  const out = [];
  tokens.forEach((token) => {
    const m = token.match(/^(plain|a|b|c|ab|pair|link|linkbox|hint)\s*::\s*(.+)$/i);
    if (m) {
      tagged = true;
      out.push({ text: String(m[2] || "").trim(), seg: String(m[1] || "").toLowerCase() });
      return;
    }
    out.push({ text: token, seg: "plain" });
  });

  if (!tagged) return [];
  return out.filter((x) => x.text);
}

function mapKRTokensSegToRoleForL2E4(seg) {
  const s = String(seg || "").toLowerCase();
  if (s === "a" || s === "ab" || s === "pair") return "A";
  if (s === "b" || s === "c") return "B";
  if (s === "link") return "LINK";
  if (s === "linkbox" || s === "hint") return "LINKBOX";
  return null;
}

function tokenRoleClassForL2E4(role) {
  if (role === "A") return "uA";
  if (role === "B") return "uB";
  if (role === "LINK") return "uLink";
  if (role === "LINKBOX") return "who-gold";
  return "";
}

// ---------- core helpers (E3 그대로) ----------
function isAllRequiredFaded() {
  for (const idx of requiredIdxSet) {
    if (!fadedIdxSet.has(String(idx))) return false;
  }
  return true;
}

function isAllBRequiredFaded() {
  if (!bReqIdxSet.size) return true;
  for (const idx of bReqIdxSet) {
    if (!bFadedIdxSet.has(String(idx))) return false;
  }
  return true;
}

function normalizeSentenceSpacingE24(s) {
  return String(s || "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s+([.,!?])/g, "$1");
}

function getReqPhraseTextE24(tokensB) {
  return normalizeSentenceSpacingE24(concatTokens(tokensB, (t) => t.isReq));
}

function buildBFrontReductionHTMLE24(tokensB, fadedSet = new Set()) {
  let reqHtml = "";
  let restHtml = "";

  for (const t of tokensB) {
    if (t.isReq) {
      if (t.isSpace) {
        reqHtml += escapeHtml(t.text);
      } else {
        const cls = ["tok", "pre", "uA"];
        if (fadedSet.has(String(t.idx))) cls.push("faded");
        reqHtml += `<span class="${cls.join(" ")}" data-breq="1" data-idx="${t.idx}" data-req="1">${escapeHtml(t.text)}</span>`;
      }
      continue;
    }

    if (t.isSpace) {
      restHtml += escapeHtml(t.text);
    } else {
      restHtml += `<span class="tok uB">${escapeHtml(t.text)}</span>`;
    }
  }

  const req = normalizeSentenceSpacingE24(reqHtml);
  const rest = normalizeSentenceSpacingE24(restHtml);
  if (req && rest) return `${req} ${rest}`;
  return req || rest || "";
}

function getSpanGroupRectE24(spans) {
  if (!spans || !spans.length) return new DOMRect(0, 0, 0, 0);
  let left = Infinity;
  let right = -Infinity;
  let top = Infinity;
  let bottom = -Infinity;
  for (const sp of spans) {
    const r = sp.getBoundingClientRect();
    left = Math.min(left, r.left);
    right = Math.max(right, r.right);
    top = Math.min(top, r.top);
    bottom = Math.max(bottom, r.bottom);
  }
  if (!Number.isFinite(left) || !Number.isFinite(right) || !Number.isFinite(top) || !Number.isFinite(bottom)) {
    return new DOMRect(0, 0, 0, 0);
  }
  return new DOMRect(left, top, Math.max(1, right - left), Math.max(1, bottom - top));
}

function getSpanLineGroupsE24(spans, tolerance = 6) {
  const sorted = Array.from(spans || [])
    .map((sp) => ({ sp, rect: sp.getBoundingClientRect() }))
    .sort((a, b) => a.rect.top - b.rect.top || a.rect.left - b.rect.left);
  if (!sorted.length) return [];

  const groups = [];
  for (const item of sorted) {
    const last = groups[groups.length - 1];
    if (!last || Math.abs(item.rect.top - last.topRef) > tolerance) {
      groups.push({ topRef: item.rect.top, items: [item] });
    } else {
      last.items.push(item);
      last.topRef = (last.topRef + item.rect.top) / 2;
    }
  }
  return groups.map((g) => g.items.map((x) => x.sp));
}

function getSpanAnchorRectE24(spans) {
  const groups = getSpanLineGroupsE24(spans, 6);
  if (!groups.length) return new DOMRect(0, 0, 0, 0);
  if (groups.length === 1) return getSpanGroupRectE24(groups[0]);
  // 멀티라인이면 시작 줄(첫 줄) 기준으로 앵커를 잡아 좌표 튐을 방지한다.
  return getSpanGroupRectE24(groups[0]);
}

function getReqLineTextsFromSpansE24(spans) {
  const groups = getSpanLineGroupsE24(spans, 6);
  if (!groups.length) return [];
  return groups.map((line) =>
    line
      .slice()
      .sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left)
      .map((sp) => String(sp.textContent || "").trim())
      .filter(Boolean)
      .join(" ")
  ).filter(Boolean);
}

function captureReqLayoutE24(spans) {
  if (!spans || !spans.length) return null;
  const groups = getSpanLineGroupsE24(spans, 6);
  if (!groups.length) return null;

  let left = Infinity;
  let right = -Infinity;
  let top = Infinity;
  let bottom = -Infinity;
  const tokens = [];

  for (const sp of spans) {
    const r = sp.getBoundingClientRect();
    const cs = window.getComputedStyle(sp);
    left = Math.min(left, r.left);
    right = Math.max(right, r.right);
    top = Math.min(top, r.top);
    bottom = Math.max(bottom, r.bottom);
    tokens.push({
      text: String(sp.textContent || ""),
      left: r.left,
      top: r.top,
      width: r.width,
      height: r.height,
      fontFamily: cs.fontFamily,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      lineHeight: cs.lineHeight,
      letterSpacing: cs.letterSpacing,
    });
  }

  if (!Number.isFinite(left) || !Number.isFinite(right) || !Number.isFinite(top) || !Number.isFinite(bottom)) {
    return null;
  }

  const bounds = new DOMRect(left, top, Math.max(1, right - left), Math.max(1, bottom - top));
  const anchor = getSpanGroupRectE24(groups[0]);
  return { bounds, anchor, tokens };
}

function createReqGhostFromLayoutE24(layout) {
  const chip = document.createElement("div");
  chip.className = "b-clause-ghost";
  applyReqGhostSplitLayoutE24(chip, layout);
  return chip;
}

function applyReqGhostSplitLayoutE24(chip, layout) {
  if (!chip || !layout) return;
  chip.classList.remove("b-clause-chip");
  chip.classList.add("b-clause-ghost");
  chip.innerHTML = "";
  chip.style.left = `${Math.round(layout.bounds.left)}px`;
  chip.style.top = `${Math.round(layout.bounds.top)}px`;
  chip.style.width = `${Math.max(1, Math.round(layout.bounds.width))}px`;
  chip.style.height = `${Math.max(1, Math.round(layout.bounds.height))}px`;

  for (const t of layout.tokens) {
    const tok = document.createElement("span");
    tok.className = "tok pre uA b-clause-ghost-token";
    tok.textContent = t.text;
    tok.style.left = `${Math.round(t.left - layout.bounds.left)}px`;
    tok.style.top = `${Math.round(t.top - layout.bounds.top)}px`;
    tok.style.width = `${Math.max(1, Math.round(t.width))}px`;
    tok.style.height = `${Math.max(1, Math.round(t.height))}px`;
    tok.style.fontFamily = t.fontFamily;
    tok.style.fontSize = t.fontSize;
    tok.style.fontWeight = t.fontWeight;
    tok.style.lineHeight = t.lineHeight;
    tok.style.letterSpacing = t.letterSpacing;
    chip.appendChild(tok);
  }
}

function measureClauseChipWidthE24(text) {
  const probe = document.createElement("div");
  probe.className = "b-clause-chip";
  probe.textContent = String(text || "");
  probe.style.visibility = "hidden";
  probe.style.pointerEvents = "none";
  probe.style.left = "-99999px";
  probe.style.top = "-99999px";
  document.body.appendChild(probe);
  const w = probe.getBoundingClientRect().width || probe.offsetWidth || 48;
  probe.remove();
  return Math.max(48, Math.round(w));
}

function stopTapTipArcE24(tapTip) {
  if (!tapTip) return;
  const anim = tapTip._arcAnim;
  if (anim && typeof anim.cancel === "function") anim.cancel();
  tapTip._arcAnim = null;

  const homeParent = tapTip._homeParent;
  const homeNext = tapTip._homeNext;
  if (homeParent && tapTip.parentElement !== homeParent) {
    if (homeNext && homeNext.parentNode === homeParent) homeParent.insertBefore(tapTip, homeNext);
    else homeParent.appendChild(tapTip);
  }
  tapTip._homeParent = null;
  tapTip._homeNext = null;
  tapTip.style.position = "";
  tapTip.style.left = "";
  tapTip.style.top = "";
  tapTip.style.transform = "";
}

function toPointAnchorE24(v) {
  if (!v) return null;
  if (typeof v.x === "number" && typeof v.y === "number") return { x: v.x, y: v.y };
  if (typeof v.left === "number" && typeof v.top === "number") {
    const w = typeof v.width === "number" ? v.width : 0;
    const h = typeof v.height === "number" ? v.height : 0;
    return { x: v.left + (w / 2), y: v.top + (h / 2) };
  }
  return null;
}

function startTapTipArcE24(tapTip, fromRect, toRect) {
  if (!tapTip || !fromRect || !toRect) return;
  const from = toPointAnchorE24(fromRect);
  const to = toPointAnchorE24(toRect);
  if (!from || !to) return;
  stopTapTipArcE24(tapTip);

  tapTip._homeParent = tapTip.parentElement;
  tapTip._homeNext = tapTip.nextSibling;
  if (tapTip.parentElement !== document.body) document.body.appendChild(tapTip);

  tapTip.classList.add("drag-mode", "drag-arc");
  tapTip.classList.remove("hidden");
  tapTip.style.right = "auto";
  tapTip.style.position = "fixed";
  tapTip.style.left = "0px";
  tapTip.style.top = "0px";
  tapTip.style.transform = "none";

  const tr = tapTip.getBoundingClientRect();
  const tipW = Math.max(18, tr.width || 18);
  const tipH = Math.max(10, tr.height || 10);
  const host = document.getElementById("cafe_int");
  const hb = host ? host.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
  const minX = Math.round(hb.left + 2);
  const maxX = Math.round(hb.right - tipW - 2);
  const minY = Math.round(hb.top + 2);
  const maxY = Math.round(hb.bottom - tipH - 2);
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  const sx = clamp(Math.round(from.x - (tipW / 2)), minX, maxX);
  const sy = clamp(Math.round(from.y - tipH - 8), minY, maxY);
  const ex = clamp(Math.round(to.x - (tipW / 2)), minX, maxX);
  const ey = clamp(Math.round(to.y - tipH - 8), minY, maxY);
  const mx = Math.round((sx + ex) / 2);
  const lift = Math.max(20, Math.round(Math.abs(ex - sx) * 0.14));
  const my = clamp(Math.min(sy, ey) - lift, minY, maxY);

  tapTip.style.left = `${sx}px`;
  tapTip.style.top = `${sy}px`;
  tapTip._arcAnim = tapTip.animate(
    [
      { left: `${sx}px`, top: `${sy}px` },
      { left: `${mx}px`, top: `${my}px` },
      { left: `${ex}px`, top: `${ey}px` },
    ],
    { duration: 1100, easing: "ease-in-out", iterations: Infinity }
  );
}

function buildSentenceHTML(tokens, role) {
  let out = "";

  for (const t of tokens) {
    if (t.isSpace) {
      out += escapeHtml(t.text);
      continue;
    }

    const cls = ["tok"];
    if (t.isPre || (role === "B" && t.isReq)) cls.push("pre");
    if (role === "A") cls.push("uA");
    if (role === "B") cls.push("uB");
    const req = t.isReq ? "1" : "0";

    out += `<span class="${cls.join(" ")}" data-idx="${t.idx}" data-req="${req}">${escapeHtml(t.text)}</span>`;
  }
  return out;
}

function buildSentenceWithGapsHTML(tokens, role) {
  let out = "";
  let wordPos = 0;
  let gapIdx = 0;
  const gapAfterSet = new Set();

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.isSpace) continue;

    const raw = String(t.text || "");
    if (/^[.,!?]+$/.test(raw)) {
      out += escapeHtml(raw);
      continue;
    }

    const m = raw.match(/^(.+?)([.,!?])$/);
    const core = m ? m[1] : raw;
    const punct = m ? m[2] : "";

    const cls = ["tok"];
    if (t.isPre || (role === "B" && t.isReq)) cls.push("pre");
    if (role === "A") cls.push("uA");
    if (role === "B") cls.push("uB");
    const req = t.isReq ? "1" : "0";

    wordPos += 1;
    out += `<span class="${cls.join(" ")}" data-idx="${t.idx}" data-req="${req}">${escapeHtml(core)}</span>`;

    const next = tokens[i + 1];
    const hasSpaceAfter = !!(next && next.isSpace);
    const coreLower = core.toLowerCase();
    const isWord = /[a-z]/i.test(core);
    const allowGapAfter = isWord && coreLower !== "the";
    const shouldGapAfterWord = hasSpaceAfter && allowGapAfter;
    const shouldGapBeforePunct = !!punct && allowGapAfter;

    if (shouldGapAfterWord || shouldGapBeforePunct) {
      gapIdx += 1;
      gapAfterSet.add(wordPos);
      out += `<span class="a-gap" data-after="${wordPos}" style="--gap-i:${gapIdx}" aria-hidden="true"></span>`;
    } else if (hasSpaceAfter) {
      out += " ";
    }

    if (punct) out += escapeHtml(punct);
  }

  if (role === "A") {
    const needAfter = Number(correctInsAfter) || 0;
    if (needAfter > 0 && needAfter === wordPos && !gapAfterSet.has(needAfter)) {
      gapIdx += 1;
      out += `<span class="a-gap" data-after="${needAfter}" style="--gap-i:${gapIdx}" aria-hidden="true"></span>`;
    }
  }

  return out;
}

function pickDropGapAfter(sa, cx, cy) {
  const gap = pickDropGapElement(sa, cx, cy);
  if (!gap) return 0;
  return Number(gap.getAttribute("data-after")) || 0;
}

function pickDropGapElement(sa, cxOrRect, cy) {
  const gaps = Array.from(sa.querySelectorAll(".a-gap[data-after]"));
  const isRect =
    cxOrRect &&
    typeof cxOrRect === "object" &&
    Number.isFinite(cxOrRect.left) &&
    Number.isFinite(cxOrRect.top) &&
    Number.isFinite(cxOrRect.right) &&
    Number.isFinite(cxOrRect.bottom);

  const pad = 2;
  let best = null;
  let bestDist = Infinity;
  for (const g of gaps) {
    const r = g.getBoundingClientRect();
    if (isRect) {
      const rl = Number(cxOrRect.left) + pad;
      const rr = Number(cxOrRect.right) - pad;
      const rt = Number(cxOrRect.top) + pad;
      const rb = Number(cxOrRect.bottom) - pad;
      const hit = rr >= r.left && rl <= r.right && rb >= r.top && rt <= r.bottom;
      if (!hit) continue;
      const cx = (Number(cxOrRect.left) + Number(cxOrRect.right)) / 2;
      const cy2 = (Number(cxOrRect.top) + Number(cxOrRect.bottom)) / 2;
      const gx = (r.left + r.right) / 2;
      const gy = (r.top + r.bottom) / 2;
      const dist = Math.abs(cx - gx) + Math.abs(cy2 - gy);
      if (dist < bestDist) {
        bestDist = dist;
        best = g;
      }
      continue;
    }

    const cx = Number(cxOrRect);
    if (cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom) {
      return g;
    }
  }
  return best;
}

function clearGapHotState(sa) {
  if (!sa) return;
  sa.querySelectorAll(".a-gap.target-hot").forEach((g) => g.classList.remove("target-hot"));
}

function buildMixedHTML(tokensA, afterPos, struckText, restText) {
  let out = "";
  let wordPos = 0;

  for (const t of tokensA) {
    if (t.isSpace) {
      out += escapeHtml(t.text);
      continue;
    }

    wordPos += 1;

    const cls = ["tok"];
    if (t.isPre) cls.push("pre");
    cls.push("uA");
    out += `<span class="${cls.join(" ")}">${escapeHtml(t.text)}</span>`;

    if (wordPos === afterPos) {
      const s = struckText ? `<span class="mix-strike">${escapeHtml(struckText)}</span>` : "";
      const r = restText ? `<span class="mix-rest"><span class="uB">${escapeHtml(restText)}</span></span>` : "";
      out += ` <span class="mix-insert">${s}${r}</span> `;
    }
  }
  return out;
}

// ---------- tokenizer (E3 그대로) ----------
function tokenizeStarAndBrace(input) {
  const s = String(input || "");
  let mode = "normal"; // normal | star | brace
  const out = [];
  let buf = "";

  const flush = () => {
    if (!buf) return;
    out.push({ text: buf, mode });
    buf = "";
  };

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "*") {
      flush();
      mode = mode === "star" ? "normal" : "star";
      continue;
    }
    if (ch === "{") {
      flush();
      mode = "brace";
      continue;
    }
    if (ch === "}") {
      flush();
      mode = "normal";
      continue;
    }
    buf += ch;
  }
  flush();

  const tokens = [];
  let idx = 0;
  for (const seg of out) {
    const parts = seg.text.split(/(\s+)/);
    for (const p of parts) {
      if (p === "") continue;
      const isSpace = /^\s+$/.test(p);

      if (isSpace) {
        tokens.push({
          text: p,
          isSpace: true,
          isPre: false,
          isReq: seg.mode === "brace",
          idx: 0,
        });
      } else {
        idx += 1;
        tokens.push({
          text: p,
          isSpace: false,
          isPre: seg.mode === "star",
          isReq: seg.mode === "brace",
          idx,
        });
      }
    }
  }
  return tokens;
}

function concatTokens(tokens, predicate) {
  let out = "";
  for (const t of tokens) {
    if (predicate(t)) out += t.text;
  }
  return out;
}

function getMaxIdx(tokens) {
  let m = 0;
  for (const t of tokens) if (!t.isSpace && t.idx > m) m = t.idx;
  return m;
}

// ---------- word bank (E3 그대로) ----------
function revealTranslate(q) {
  isKoLocked = false;
  const configured = parseLaststageKRTokensForL2E4(String(q?.laststageKRTokens || "").trim());
  if (configured.length) {
    bankTokens = shuffleArray(configured.map((t, i) => ({
      id: `t${i}_${t.text}`,
      text: t.text,
      role: mapKRTokensSegToRoleForL2E4(t.seg),
    })));
  } else {
    const correctTokens = tokenizeKorean(String(q?.koreanAnswer || "").trim());
    bankTokens = shuffleArray(correctTokens.map((t, i) => ({ id: `t${i}_${t}`, text: t, role: null })));
  }
  selectedTokens = [];
  renderBankAndAnswer();
}

function renderBankAndAnswer() {
  const bankArea = document.getElementById("bank-area");
  const answerLine = document.getElementById("answer-line");
  const remainInfo = document.getElementById("remain-info");
  if (!bankArea || !answerLine || !remainInfo) return;

  if (window.HermaKRScramble?.render) {
    window.HermaKRScramble.render({
      answerLineEl: answerLine,
      bankAreaEl: bankArea,
      remainInfoEl: remainInfo,
      state: { selectedTokens, bankTokens, isKoLocked },
      onSelectToken: (tok) => {
        if (isKoLocked) return;
        const idx = bankTokens.findIndex((x) => x.id === tok.id);
        if (idx >= 0) {
          const [moved] = bankTokens.splice(idx, 1);
          selectedTokens.push(moved);
        }
      },
      onUnselectLast: () => {
        if (isKoLocked) return;
        const popped = selectedTokens.pop();
        if (popped) bankTokens.push(popped);
      },
      decorateToken: (el, tok) => {
        if (!el || !tok) return;
        const cls = tokenRoleClassForL2E4(tok.role);
        if (cls) el.classList.add(cls);
      },
      rerender: () => renderBankAndAnswer(),
    });
    return;
  }

  remainInfo.textContent = `남은 조각: ${bankTokens.length}개`;
  answerLine.textContent = selectedTokens.map((x) => x.text).join(" ");

  bankArea.innerHTML = "";
  bankTokens.forEach((tok) => {
    const btn = document.createElement("button");
    const roleClass = tokenRoleClassForL2E4(tok.role);
    btn.className = `pill-btn ${roleClass}`;
    btn.type = "button";
    btn.textContent = tok.text;
    btn.disabled = isKoLocked;

    btn.addEventListener("click", () => {
      if (isKoLocked) return;
      const idx = bankTokens.findIndex((x) => x.id === tok.id);
      if (idx >= 0) {
        const [moved] = bankTokens.splice(idx, 1);
        selectedTokens.push(moved);
        renderBankAndAnswer();
      }
    });

    bankArea.appendChild(btn);
  });
}

// ---------- submit/next ----------
function submitAnswer() {
  if (!translateMode) {
    toastNo("마지막 단계에서 제출하세요.");
    return;
  }
  if (isAnswered) return;

  const q = questions[currentIndex];
  const userKor = selectedTokens.length ? selectedTokens.map((x) => x.text).join(" ") : "";

  const koreanCorrect = normalizeKorean(userKor) === normalizeKorean(q.koreanAnswer);
  const correct = !!(relCompressed && koreanCorrect);

  if (!correct) {
    toastNo("오답…");
    return;
  }

  isAnswered = true;

  results.push({
    no: currentIndex + 1,
    word: `Herma L2-E4 / Q${q.qNumber}`,
    selected: `${userKor || "무응답"} || movedPrep:${movedPrep ? 1 : 0} || rel:${relCompressed ? 1 : 0} || insPick:${insertOk ? correctInsAfter : 0}`,
    correct,
    question: q.questionRaw,
    a1: q.a1,
    a2: q.a2,
    a3: q.a3,
    koreanAnswer: q.koreanAnswer,
    insAfter: q.insAfter || 0,
  });

  const submitBtn = document.getElementById("submit-btn");
  if (submitBtn) submitBtn.disabled = true;

  isKoLocked = true;
  renderBankAndAnswer();
  toastOk("정답!");
}

function goNext() {
  if (!isAnswered) {
    const q = questions[currentIndex];
    results.push({
      no: currentIndex + 1,
      word: `Herma L2-E4 / Q${q.qNumber}`,
      selected: `무응답 || movedPrep:${movedPrep ? 1 : 0} || rel:${relCompressed ? 1 : 0} || insPick:${insertOk ? correctInsAfter : 0}`,
      correct: false,
      question: q.questionRaw,
      a1: q.a1,
      a2: q.a2,
      a3: q.a3,
      koreanAnswer: q.koreanAnswer,
      insAfter: q.insAfter || 0,
    });
  }

  currentIndex++;
  if (currentIndex >= questions.length) return showResultPopup();
  renderQuestion();
}

// ---------- result popup (E3 그대로) ----------
function showResultPopup() {
  const total = results.length;
  const correctCount = results.filter((r) => r.correct).length;
  const score = total ? Math.round((correctCount / total) * 100) : 0;

  const resultObject = {
    quiztitle: quizTitle,
    subcategory,
    level,
    day,
    teststatus: "done",
    course: "herma",
    lesson: TARGET_LESSON,
    exercise: TARGET_EXERCISE,
    userId: userId || "",
    testspecific: results,
  };

  localStorage.setItem("QuizResults", JSON.stringify(resultObject));

  const popup = document.getElementById("result-popup");
  const content = document.getElementById("result-content");
  if (!popup || !content) return alert(`완료! 점수: ${score}점 (${correctCount}/${total})`);

  const rows = results
    .map(
      (r) => `
    <tr>
      <td style="padding:6px; border-bottom:1px solid #eee;">${r.no}</td>
      <td style="padding:6px; border-bottom:1px solid #eee;">${escapeHtml(r.word)}</td>
      <td style="padding:6px; border-bottom:1px solid #eee;">${escapeHtml(trimForTable(r.selected))}</td>
      <td style="padding:6px; border-bottom:1px solid #eee;">${r.correct ? "⭕" : "❌"}</td>
    </tr>
  `
    )
    .join("");

  content.innerHTML = `
    <div style="font-weight:900; font-size:16px; margin-bottom:8px;">📄 전체 결과</div>
    <div style="margin-bottom:10px; font-size:14px;">
      점수: <b>${score}점</b> (${correctCount} / ${total})
    </div>

    <div style="max-height:260px; overflow-y:auto; margin-bottom:14px;">
      <table style="width:100%; border-collapse:collapse; font-size:13px;">
        <thead>
          <tr style="background:#f6f6f6;">
            <th style="padding:6px; border-bottom:1px solid #ccc;">번호</th>
            <th style="padding:6px; border-bottom:1px solid #ccc;">문항</th>
            <th style="padding:6px; border-bottom:1px solid #ccc;">내 상태</th>
            <th style="padding:6px; border-bottom:1px solid #ccc;">정답</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>

    <div class="btn-row">
      <button class="quiz-btn" onclick="restartQuiz()">🔁 재시험</button>
      <button class="quiz-btn" onclick="closePopup()">닫기</button>
    </div>
  `;

  popup.style.display = "flex";
}
function restartQuiz() { window.location.reload(); }
function closePopup() {
  const popup = document.getElementById("result-popup");
  if (popup) popup.style.display = "none";
}

// ---------- korean utils ----------
function tokenizeKorean(kor) {
  const s = String(kor || "").trim();
  if (!s) return [];
  return s.split(/\s+/).filter(Boolean);
}
function normalizeKorean(s) {
  return String(s || "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.。!?]+$/g, "")
    .trim();
}

// ---------- misc ----------
function stripTrailingPeriod(s) {
  return String(s || "")
    .trim()
    .replace(/\.\s*$/, "")
    .trim();
}
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function trimForTable(s) {
  const t = String(s || "");
  return t.length > 70 ? t.slice(0, 70) + "..." : t;
}

function getHintWord(hintRaw) {
  const raw = String(hintRaw || "").trim();
  if (!raw) return "which";
  const cleaned = raw.replace(/[{}]/g, "").trim();
  const first = cleaned.split(/\s*\/\s*/)[0]?.trim();
  return first || cleaned || "which";
}

function collapseUpAndRemove(el) {
  if (!el) return;
  el.style.overflow = "hidden";
  el.animate(
    [
      { maxHeight: `${el.scrollHeight || 200}px`, opacity: 1, transform: "translateY(0)" },
      { maxHeight: "0px", opacity: 0, transform: "translateY(-8px)" },
    ],
    { duration: 280, easing: "ease" }
  );
  setTimeout(() => el.remove(), 290);
}

function wait(ms) { return new Promise((res) => setTimeout(res, ms)); }
function escapeReg(s) { return String(s || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
