// ver1.1_26.02.22
// herma-l3e1_fixed.js (L3-E1: to부정사로 압축해서 말하기)
// ------------------------------------------------------------
// ✅ 기준 UI/톤/구조: herma-l2e4.js 스타일/흐름을 그대로 사용
// ✅ L3E1 기능:
//   [1] B문장 { ... } 약분 완료 → + 날아감 → A 내부 + 슬롯 표시
//   [2] 올바른 슬롯 클릭 → "합쳐진 문장 1줄(중간문장)"을 같은 A라인에서 표시 (Answer 1) 사용)
//   [3] 같은 A라인(중간문장) 안의 { ... } 클릭 약분 완료 → 최종문장(Answer 2)로 변환
//   [4] 해석 순서(Word Bank) (Answer 마지막 한국어)
// ------------------------------------------------------------

const EXCEL_FILE = "herma_allq_chwi.xlsx";
const EXCEL_SHEET = "round1_questions";
const TARGET_LESSON = 3;
const TARGET_EXERCISE = 1;

let subcategory = "Grammar";
let level = "Basic";
let day = "109";
let quizTitle = "quiz_Grammar_Basic_109";
let userId = "";

let rawRows = [];
let questions = [];

let currentIndex = 0;
let results = [];
let isAnswered = false;

// stage flags
let reduced = false;      // step1 B 약분 완료
let insertOk = false;     // step2 A 슬롯 정답
let compressed = false;   // step3 중간문장 약분 완료 → 최종문장 도달
let translateMode = false;
let isKoLocked = false;

let requiredIdxSet = new Set();
let fadedIdxSet = new Set();
let bReqIdxSet = new Set();
let bFadedIdxSet = new Set();

let frontMoved = false;
let frontDragActive = false;
let handleSpawned = false;

let correctInsAfter = 0;

let tokensA = [];
let tokensB = [];
let tokensMid = [];

let bankTokens = [];
let selectedTokens = [];

// ---------- boot ----------
window.addEventListener("DOMContentLoaded", async () => {  var __r2_guard = (new URLSearchParams(window.location.search || "")).get("round2") === "1";
  if (__r2_guard) return;
  applyQueryParams();
  wireBackButton();
  injectStyles(); // ✅ L2E4 스타일 그대로
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

// ---------- styles (L2E4 그대로) ----------
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
    .tok.which-gold, .which-gold{
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
    .hidden{ display:none !important; }

    #b-area{ position: relative; }
    .tap-tip{
      position:absolute;
      left: 50%;
      top: -16px;
      transform: translate(-50%, 0);
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
    .sentence-a{
      position: relative;
      z-index: 30;
    }
    .sentence-b{
      position: relative;
      z-index: 10;
    }
    @keyframes tapFloatCenter{
      0%, 100%{ transform: translate(-50%, 0px); }
      50%{ transform: translate(-50%, -8px); }
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

    .shake{
      animation: hermaShake 0.22s linear;
    }
    @keyframes hermaShake{
      0%{ transform: translateX(0); }
      25%{ transform: translateX(-3px); }
      50%{ transform: translateX(3px); }
      75%{ transform: translateX(-2px); }
      100%{ transform: translateX(0); }
    }

        /* ✅ L3E1: {which I must ...} -> to (중앙 압축 + to 페이드) */
    .req-wrap{
      display:inline-block;
      position: relative;
      vertical-align: baseline;
      line-height: inherit;
      font-size: inherit;
      transform-origin: center center;
      white-space: pre;
      --origin-x: 50%;
      overflow: hidden;
      top: 3px;
    }
    .req-group{
      display:inline-block;
      line-height: inherit;
      font-size: inherit;
      transform-origin: var(--origin-x) center;
      white-space: pre;
    }
    .to-overlay{
      position:absolute;
      left: 50%;
      top:50%;
      transform: translate(-50%, -50%);
      opacity:0;
      pointer-events:none;
      font-weight:900;
      line-height: inherit;
      font-size: inherit;
      letter-spacing: 0.02em;
      color:#7e3106;
    }

    .req-wrap.req-transform .req-group{
      animation: reqCollapseCenter .30s cubic-bezier(.2,.9,.2,1) forwards;
    }
    .req-wrap.req-transform .to-overlay{
      animation: toFadeIn .52s ease-out .12s both;
    }

    @keyframes reqCollapseCenter{
      from{ transform: scaleX(1); opacity:1; filter: blur(0px); }
      to{ transform: scaleX(0); opacity:0; filter: blur(0.6px); }
    }
    @keyframes toFadeIn{
      from{ opacity:0; transform: translate(-50%, -50%) scale(0.985); filter: blur(0.7px); }
      to{ opacity:1; transform: translate(-50%, -50%) scale(1); filter: blur(0px); }
    }

    /* to 강조(세련 버전): 얇은 형광펜 + 잔잔한 sheen */
    .to-final{
      display:inline-block;
      font-weight:900;
      line-height: inherit;
      font-size: inherit;
      vertical-align: baseline;
      top: 0;
      position: relative;
      letter-spacing:0.02em;
      color:#7e3106;
      padding: 0 2px;
      border-radius: 4px;
      background: linear-gradient(180deg, rgba(255,255,255,0) 58%, rgba(255, 208, 90, 0.34) 58%);
      box-shadow: 0 0 0 1px rgba(160,110,0,0.12) inset;
    }
    .to-final.to-sheen{
      animation: toSheen .6s ease-out both;
    }
    @keyframes toSheen{
      0%{ box-shadow: 0 0 0 1px rgba(160,110,0,0.10) inset, 0 0 0 rgba(255,208,90,0); filter: brightness(1); }
      55%{ box-shadow: 0 0 0 1px rgba(160,110,0,0.16) inset, 0 10px 26px rgba(255,208,90,0.16); filter: brightness(1.035); }
      100%{ box-shadow: 0 0 0 1px rgba(160,110,0,0.12) inset, 0 0 0 rgba(255,208,90,0); filter: brightness(1); }
    }

  `;
  document.head.appendChild(style);

  if (!document.getElementById("fly-plus")) {
    const fp = document.createElement("div");
    fp.id = "fly-plus";
    fp.textContent = "+";
    document.body.appendChild(fp);
  }
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
    const transformMeta = parseTransformsMetaForL3E1(transformsRaw);

    const { stem, hint } = splitStemAndHint(questionRaw);
    const { A, B } = splitABStem(stem);

    const { s1, s2, kor, insAfter } = parseL3E1Answer(answerRaw);
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
      insAfter: finalInsAfter,
      midSentence: s1 || "",
      finalSentence: s2 || "",
      koreanAnswer: kor || "",
      transformsRaw,
      transformMeta,
      laststageFinalSentence: laststageFinalRaw,
      laststageKRTokens: laststageKRTokensRaw,
    };
  });
}

function parseTransformsMetaForL3E1(raw) {
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
      hint: "",
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

// Answer 권장 형식:
// 1) <mid> 2) <final> 3) <korean> ||ins:n
function parseL3E1Answer(answerRaw) {
  let s = String(answerRaw || "").trim();
  let insAfter = 0;

  const m = s.match(/\|\|\s*ins\s*:\s*(\d+)\s*$/i);
  if (m) {
    insAfter = Number(m[1]) || 0;
    s = s.replace(/\|\|\s*ins\s*:\s*\d+\s*$/i, "").trim();
  }

  const mm = s.match(/1\)\s*([\s\S]*?)\s*2\)\s*([\s\S]*?)(?:\s*3\)\s*([\s\S]*?))?(?:\s*4\)\s*([\s\S]*))?$/m);
  if (mm) {
    const s1 = stripTrailingPeriod(mm[1].trim());
    const s2 = stripTrailingPeriod(mm[2].trim());
    const s3 = (mm[3] || "").trim();
    let kor = "";
    if (/[가-힣]/.test(s3)) kor = s3;
    else if (mm[4] && /[가-힣]/.test(mm[4])) kor = String(mm[4]).trim();
    else {
      const mx = s.match(/[가-힣][\s\S]*$/);
      kor = mx ? mx[0].trim() : "";
    }
    return { s1, s2, kor, insAfter };
  }

  const mx = s.match(/[가-힣][\s\S]*$/);
  const kor = mx ? mx[0].trim() : "";
  const eng = kor ? s.slice(0, mx.index).trim() : s;
  return { s1: stripTrailingPeriod(eng), s2: "", kor, insAfter };
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


  const title = questions[0]?.title || "Herma L3-E1";
  const instruction =
    questions[0]?.instruction ||
    "약분 → 삽입(+) → 중간문장 줄이기(to부정사) → 해석 순서";

  area.innerHTML = `
    <div class="box">
      <div style="font-size:18px; font-weight:900; color:#7e3106; margin-bottom:10px;">📘 Herma L3-E1</div>

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
  document.querySelectorAll(".b-drag-chip, .b-clause-chip, .b-clause-ghost, .b-handle-point").forEach((el) => el.remove());
  const strayTap = document.querySelector("body > #tap-tip.drag-arc");
  if (strayTap) strayTap.remove();

  const q = questions[currentIndex];
  if (!q) return showResultPopup();

  isAnswered = false;
  reduced = false;
  insertOk = false;
  compressed = false;
  translateMode = false;
  isKoLocked = false;
  frontMoved = false;
  frontDragActive = false;
  handleSpawned = false;

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
      <div class="stage-pill" id="stage-pill">1단계: 약분하기</div>
      <div id="instruction-text" style="font-weight:900; color:#7e3106; line-height:1.6;">
        두 문장을 약분해보세요!
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
      enterFrontDragStageE31({
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
        enterHandleReadyStageE31();
      }
      return;
    }
  };

  if (sa) sa.addEventListener("click", onClickToken);
  if (sb) sb.addEventListener("click", onClickToken);

  function enterFrontDragStageE31(startAnchor) {
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
    startFrontDragStepE31(sb, startAnchor, () => {
      frontMoved = true;
      frontDragActive = false;
      bFadedIdxSet = new Set();
      sb.innerHTML = buildBFrontReductionHTMLE31(tokensB, bFadedIdxSet);
      toastOk("위치 이동 완료!");
      enterReduceStageE31();
    });
  }

  function enterReduceStageE31() {
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

  function enterHandleReadyStageE31() {
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

    const hintArea = document.getElementById("hint-area");
    if (hintArea) {
      hintArea.textContent = `힌트:${String(q.hint || "which").trim()}`;
      hintArea.classList.remove("hidden");
    }

    const tapTip = document.getElementById("tap-tip");
    if (tapTip) {
      stopTapTipArcE31(tapTip);
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
    sb.addEventListener("click", () => spawnHandlePointAndEnableDragE31(sa, sb, bArea, q), { once: true });
  }

  function startFrontDragStepE31(sb, startAnchor, onDone) {
    const reqSpans = Array.from(sb.querySelectorAll('[data-req="1"]'));
    if (!reqSpans.length) {
      onDone?.();
      return;
    }

    const layoutBefore = captureReqLayoutE31(reqSpans);
    if (!layoutBefore) {
      onDone?.();
      return;
    }

    const slot = document.createElement("span");
    slot.className = "b-front-slot";
    slot.setAttribute("aria-hidden", "true");
    const reqText = getReqPhraseTextE31(tokensB);
    const measuredW = measureClauseChipWidthE31(reqText);
    const baseSlotW = Math.max(56, Math.round(measuredW + 8));
    slot.style.width = `${baseSlotW}px`;
    sb.prepend(slot);

    const layoutAfter = captureReqLayoutE31(reqSpans) || layoutBefore;

    const chip = createReqGhostFromLayoutE31(layoutAfter);
    document.body.appendChild(chip);
    const chipRect0 = chip.getBoundingClientRect();
    const startX = Math.round(chipRect0.left);
    const startY = Math.round(chipRect0.top);

    reqSpans.forEach((s) => { s.style.opacity = "0"; });

    const tapTip = document.getElementById("tap-tip");
    if (tapTip) {
      const sr = slot.getBoundingClientRect();
      startTapTipArcE31(
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
      applyReqGhostSplitLayoutE31(chip, layoutAfter);
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
        stopTapTipArcE31(tip);
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

  async function spawnHandlePointAndEnableDragE31(sa, sb, bArea, q) {
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
      const rr = getSpanAnchorRectE31(reqSpans);
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

      const hintArea = document.getElementById("hint-area");
      collapseUpAndRemove(hintArea);
      collapseUpAndRemove(bArea);
      toastOk("2단계 완료!");
      setTimeout(() => enterMidSentenceMode(sa, q), 220);
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

  function enterMidSentenceMode(sa, q) {
    const pill = document.getElementById("stage-pill");
    const it = document.getElementById("instruction-text");
    const sub = document.getElementById("instruction-sub");

    if (pill) pill.textContent = "3단계: 문장 압축";
    if (it) it.textContent = "문장을 더욱 더 줄여보세요!";
    if (sub) sub.innerHTML = `<span style="color:#555;">(다 줄이면 최종문장으로 바뀝니다)</span>`;

    tokensMid = tokenizeStarAndBrace(q.midSentence || "");
    fadedIdxSet = new Set();
    requiredIdxSet = new Set();
    for (const t of tokensMid) {
      if (!t.isSpace && t.isReq) requiredIdxSet.add(String(t.idx));
    }

    sa.innerHTML = buildMidSentenceHTML(tokensMid);
    shake(sa);

    const onClickMid = (ev) => {
      if (compressed || translateMode) return;

      const el = ev.target.closest("[data-idx]");
      if (!el) return;

      const idx = el.getAttribute("data-idx");
      const isReq = el.getAttribute("data-req") === "1";
      if (!idx) return;

      if (!isReq) {
        el.classList.add("nope");
        setTimeout(() => el.classList.remove("nope"), 120);
        return;
      }

      el.classList.toggle("faded");
      if (el.classList.contains("faded")) fadedIdxSet.add(idx);
      else fadedIdxSet.delete(idx);

      if (requiredIdxSet.size > 0 && isAllRequiredFaded()) {
        compressed = true;
        shake(sa);

        const pill2 = document.getElementById("stage-pill");
        const it2 = document.getElementById("instruction-text");
        const sub2 = document.getElementById("instruction-sub");
        if (pill2) pill2.textContent = "4단계: 해석 순서";
        if (it2) it2.innerHTML = `아래 단어들을 순서대로 눌러 해석을 완성하세요.`;
        if (sub2) sub2.innerHTML = `<span style="color:#555;">(다 만들고 제출)</span>`;

        (async () => {
          await animateReqGroupsToTo(sa);
          // to가 보인 상태를 잠깐 유지한 뒤 최종문장으로 전환
          await wait(460);
          sa.innerHTML = highlightFirstToRaw(q.finalSentence || "") + ".";
          toastOk("3단계 완료!");
          await wait(220);
          enterTranslateMode(q);
        })();
      }
    };

    sa.addEventListener("click", onClickMid);
  }

  function enterTranslateMode(q) {
    if (translateMode) return;
    translateMode = true;

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
      const configuredFinalParts = parseLaststageFinalSentenceForL3E1(q.laststageFinalSentence);
      if (configuredFinalParts.length) {
        plain.innerHTML = `<div>${renderConfiguredFinalSentenceForL3E1(configuredFinalParts)}</div>`;
      } else {
        plain.innerHTML = `<div>${highlightFirstToRaw(q.finalSentence || "")}.</div>`;
      }
    }

    revealTranslate(q);
    const actionRow = document.getElementById("stage-action-row");
    if (actionRow) actionRow.style.display = "flex";
    const submitBtn = document.getElementById("submit-btn");
    if (submitBtn) submitBtn.disabled = false;
  }
}

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

function normalizeSentenceSpacingE31(s) {
  return String(s || "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s+([.,!?])/g, "$1");
}

function concatTokens(tokens, predicate) {
  let out = "";
  for (const t of tokens) {
    if (predicate(t)) out += t.text;
  }
  return out;
}

function getReqPhraseTextE31(tokens) {
  return normalizeSentenceSpacingE31(concatTokens(tokens, (t) => t.isReq));
}

function buildBFrontReductionHTMLE31(tokens, fadedSet = new Set()) {
  let reqHtml = "";
  let restHtml = "";

  for (const t of tokens) {
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
      const cls = ["tok", "uB"];
      if (isWhichWord(t.text)) cls.push("which-gold");
      restHtml += `<span class="${cls.join(" ")}">${escapeHtml(t.text)}</span>`;
    }
  }

  const req = normalizeSentenceSpacingE31(reqHtml);
  const rest = normalizeSentenceSpacingE31(restHtml);
  if (req && rest) return `${req} ${rest}`;
  return req || rest || "";
}

function getSpanGroupRectE31(spans) {
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

function getSpanLineGroupsE31(spans, tolerance = 6) {
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

function getSpanAnchorRectE31(spans) {
  const groups = getSpanLineGroupsE31(spans, 6);
  if (!groups.length) return new DOMRect(0, 0, 0, 0);
  if (groups.length === 1) return getSpanGroupRectE31(groups[0]);
  return getSpanGroupRectE31(groups[0]);
}

function captureReqLayoutE31(spans) {
  if (!spans || !spans.length) return null;
  const groups = getSpanLineGroupsE31(spans, 6);
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
  const anchor = getSpanGroupRectE31(groups[0]);
  return { bounds, anchor, tokens };
}

function createReqGhostFromLayoutE31(layout) {
  const chip = document.createElement("div");
  chip.className = "b-clause-ghost";
  applyReqGhostSplitLayoutE31(chip, layout);
  return chip;
}

function applyReqGhostSplitLayoutE31(chip, layout) {
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

function measureClauseChipWidthE31(text) {
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

function stopTapTipArcE31(tapTip) {
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

function toPointAnchorE31(v) {
  if (!v) return null;
  if (typeof v.x === "number" && typeof v.y === "number") return { x: v.x, y: v.y };
  if (typeof v.left === "number" && typeof v.top === "number") {
    const w = typeof v.width === "number" ? v.width : 0;
    const h = typeof v.height === "number" ? v.height : 0;
    return { x: v.left + (w / 2), y: v.top + (h / 2) };
  }
  return null;
}

function startTapTipArcE31(tapTip, fromRect, toRect) {
  if (!tapTip || !fromRect || !toRect) return;
  const from = toPointAnchorE31(fromRect);
  const to = toPointAnchorE31(toRect);
  if (!from || !to) return;
  stopTapTipArcE31(tapTip);

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
    if (isWhichWord(t.text)) cls.push("which-gold");
    if (role === "A") cls.push("uA");
    if (role === "B") cls.push("uB");
    const req = t.isReq ? "1" : "0";
    const bReq = role === "B" && t.isReq ? "1" : "0";

    out += `<span class="${cls.join(" ")}" data-idx="${t.idx}" data-req="${req}" data-breq="${bReq}">${escapeHtml(t.text)}</span>`;
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
    if (t.isPre) cls.push("pre");
    if (isWhichWord(core)) cls.push("which-gold");
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



// ✅ mid sentence 전용: 연속된 { ... } "단어들"을 하나의 래퍼(.req-wrap)로 묶고,
//    (경계 공백은 밖에 두고) 가운데에서 'to'가 페이드로 나타나게 한다.
function buildMidSentenceHTML(tokens) {
  let out = "";
  const n = tokens.length;

  const renderNormal = (t, extraCls = "") => {
    if (t.isSpace) return escapeHtml(t.text);
    const cls = ["tok"];
    if (t.isPre) cls.push("pre");
    if (isWhichWord(t.text)) cls.push("which-gold");
    if (extraCls) cls.push(extraCls);
    const req = t.isReq ? "1" : "0";
    return `<span class="${cls.join(" ")}" data-idx="${t.idx}" data-req="${req}">${escapeHtml(t.text)}</span>`;
  };

  for (let i = 0; i < n; i++) {
    const t = tokens[i];

    // start of a req-word run (only non-space req tokens)
    if (!t.isSpace && t.isReq) {
      out += `<span class="req-wrap"><span class="req-group">`;
      out += renderNormal({ ...t, isReq: true }, "req-word");

      // include interior spaces ONLY if followed by another req-word
      while (i + 2 < n && tokens[i + 1].isSpace && !tokens[i + 2].isSpace && tokens[i + 2].isReq) {
        out += escapeHtml(tokens[i + 1].text);
        i += 2;
        out += renderNormal({ ...tokens[i], isReq: true }, "req-word");
      }

      out += `</span><span class="to-overlay">to</span></span>`;
      continue;
    }

    out += renderNormal(t);
  }

  return out;
}



// ✅ 최종문장에 첫 'to'를 하이라이트로 감싼다(없으면 그대로)
function highlightFirstToRaw(sentence) {
  const raw = stripTrailingPeriod(sentence || "");
  if (!raw) return "";
  const marker = "§§TO_HL§§";
  const replaced = raw.replace(/\bto\b/, marker);
  const escaped = escapeHtml(replaced);
  if (!escaped.includes(marker)) return escapeHtml(raw);
  return escaped.replace(marker, `<span class="to-final to-sheen">to</span>`);
}

function parseLaststageFinalSentenceForL3E1(raw) {
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

function mapFinalSegClassForL3E1(seg) {
  const s = String(seg || "").toLowerCase();
  if (s === "a" || s === "ab" || s === "pair") return "uA";
  if (s === "b" || s === "c") return "uB";
  if (s === "link") return "uLink";
  if (s === "linkbox" || s === "hint") return "who-gold";
  return "";
}

function renderConfiguredFinalSentenceForL3E1(parts) {
  const chunks = parts.map((part) => {
    const text = String(part?.text || "").trim();
    if (!text) return "";
    const cls = mapFinalSegClassForL3E1(part.seg);
    if (!cls) return escapeHtml(text);
    return `<span class="${cls}">${escapeHtml(text)}</span>`;
  }).filter(Boolean);
  if (!chunks.length) return "";
  const joined = chunks.join(" ").trim();
  if (/[.!?]$/.test(joined)) return joined;
  return `${joined}.`;
}

function parseLaststageKRTokensForL3E1(raw) {
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

function mapKRTokensSegToRoleForL3E1(seg) {
  const s = String(seg || "").toLowerCase();
  if (s === "a" || s === "ab" || s === "pair") return "A";
  if (s === "b" || s === "c") return "B";
  if (s === "link") return "LINK";
  if (s === "linkbox" || s === "hint") return "LINKBOX";
  return null;
}

function tokenRoleClassForL3E1(role) {
  if (role === "A") return "uA";
  if (role === "B") return "uB";
  if (role === "LINK") return "uLink";
  if (role === "LINKBOX") return "who-gold";
  return "";
}


// ✅ {which I must ...} 래퍼를 중앙으로 압축하면서, 같은 자리에서 'to'가 페이드로 나타나게 한다
async function animateReqGroupsToTo(containerEl) {
  if (!containerEl) return;
  const wraps = Array.from(containerEl.querySelectorAll(".req-wrap"));
  if (!wraps.length) return;

  wraps.forEach((w) => {
    const wrapRect = w.getBoundingClientRect();
    const reqWords = Array.from(w.querySelectorAll(".req-word"));

    let originX = wrapRect.width / 2;
    let slotWidth = Math.max(20, Math.round(wrapRect.width * 0.34));

    if (reqWords.length) {
      const mid = reqWords[Math.floor(reqWords.length / 2)];
      const midRect = mid.getBoundingClientRect();
      originX = (midRect.left + midRect.width / 2) - wrapRect.left;
      slotWidth = Math.max(20, Math.round(midRect.width + 4));
    }

    const startW = Math.max(1, Math.round(wrapRect.width));
    w.style.width = `${startW}px`;
    w.style.setProperty("--origin-x", `${Math.max(0, Math.round(originX))}px`);
    w.dataset.slotW = String(slotWidth);

    w.animate(
      [{ width: `${startW}px` }, { width: `${slotWidth}px` }],
      { duration: 320, easing: "cubic-bezier(.2,.9,.2,1)", fill: "forwards" }
    );
    w.classList.add("req-transform");
  });

  await wait(700);

  // 애니메이션 후 DOM 정리: 중앙 단어 폭(한 단어 자리)만 남기고 to로 치환
  wraps.forEach((w) => {
    const slotW = Math.max(20, Number(w.dataset.slotW || 20));
    w.classList.remove("req-transform");
    w.style.width = `${slotW}px`;
    w.style.display = "inline-block";
    w.style.textAlign = "center";
    w.style.verticalAlign = "baseline";
    w.style.lineHeight = "inherit";
    w.innerHTML = `<span class="to-final to-sheen">to</span>`;
  });
}




// ---------- tokenizer (L2E4 방식) ----------
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

function getMaxIdx(tokens) {
  let m = 0;
  for (const t of tokens) if (!t.isSpace && t.idx > m) m = t.idx;
  return m;
}

// ---------- word bank ----------
function revealTranslate(q) {
  isKoLocked = false;
  const configured = parseLaststageKRTokensForL3E1(String(q?.laststageKRTokens || "").trim());
  if (configured.length) {
    bankTokens = shuffleArray(configured.map((t, i) => ({
      id: `t${i}_${t.text}`,
      text: t.text,
      role: mapKRTokensSegToRoleForL3E1(t.seg),
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
        const cls = tokenRoleClassForL3E1(tok.role);
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
    const roleClass = tokenRoleClassForL3E1(tok.role);
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
  const correct = !!(compressed && koreanCorrect);

  if (!correct) {
    toastNo("오답…");
    return;
  }

  isAnswered = true;

  results.push({
    no: currentIndex + 1,
    word: `Herma L3-E1 / Q${q.qNumber}`,
    selected: `${userKor || "무응답"} || reduced:${reduced ? 1 : 0} || ins:${insertOk ? 1 : 0} || compressed:${compressed ? 1 : 0} || insAfter:${q.insAfter || 0}`,
    correct,
    question: q.questionRaw,
    mid: q.midSentence,
    final: q.finalSentence,
    koreanAnswer: q.koreanAnswer,
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
      word: `Herma L3-E1 / Q${q.qNumber}`,
      selected: `무응답 || reduced:${reduced ? 1 : 0} || ins:${insertOk ? 1 : 0} || compressed:${compressed ? 1 : 0} || insAfter:${q.insAfter || 0}`,
      correct: false,
      question: q.questionRaw,
      mid: q.midSentence,
      final: q.finalSentence,
      koreanAnswer: q.koreanAnswer,
    });
  }

  currentIndex++;
  if (currentIndex >= questions.length) return showResultPopup();
  renderQuestion();
}

// ---------- result popup ----------
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

function isWhichWord(text) {
  const s = String(text || "")
    .trim()
    .replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, "")
    .toLowerCase();
  return s === "which";
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
function shake(el) {
  if (!el) return;
  el.classList.remove("shake");
  void el.offsetWidth;
  el.classList.add("shake");
  setTimeout(() => el.classList.remove("shake"), 240);
}
