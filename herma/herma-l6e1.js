// ver1.1_26.02.22
// ------------------------------------------------------------
// ✅ 요청 반영 요약
// 1) 새 박스를 아래로 계속 깔지 않음(세로 길어짐 최소화)
//    - 원본문장 박스 안에서 A를 누르면 그 자리에서 '명사구 만들기'가 열리고
//    - 1단계 완료 시 자동으로 원본문장(A,B) 화면으로 복귀
// 2) 1단계 확인 버튼 제거: 슬롯이 다 채워지면 자동 채점 → 맞으면 자동 복귀
// 3) 명사구 만들기에서 'The'는 맨 앞에 미리 깔아줌(원문에서 가져오기 어려운 케이스 대비)
// 4) 2단계(It 약분)도 원본문장 박스에서 진행
//    - It 클릭 시 자동으로 합쳐진 문장 표시
//    - 아래에 3단계(뜻 순서 맞추기) 박스가 나타남
// ------------------------------------------------------------

const EXCEL_FILE = "herma_allq_chwi.xlsx";
const EXCEL_SHEET = "round1_questions";
const TARGET_LESSON = 6;
const TARGET_EXERCISE = 1;

let subcategory = "Grammar";
let level = "Basic";
let day = "120";
let quizTitle = "quiz_Grammar_Basic_120";
let userId = "";

let rawRows = [];
let questions = [];

let currentIndex = 0;
let results = [];
let isAnswered = false;

// stage flags
let stage1Ok = false;   // 명사구 완성(정답 일치)
let stageReduceOk = false; // It 약분 완료
let stage2Ok = false;   // 약분 후 드래그 완료
let stage3Ok = false;   // 뜻 순서 완료(정답 일치)

let stage3Shown = false; // It 클릭 후 뜻 박스가 한번이라도 열렸는지

// current
let englishAnswerRaw = "";
let koreanAnswerRaw = "";
let subjectPhraseRaw = "";   // Answer에서 잘라낸 주어 명사구(목표)
let aRaw = "";
let bRaw = "";
let laststageFinalSentenceRaw = "";
let laststageKRTokensRaw = "";

// 1단계 (5-1 스타일)
let srcTokens = [];   // [{id, display, clean, lower, used, verb}]
let slots = [];       // [{kind:'fixed'|'slot', text, faded, expectedLower, fillRule, filled, fromTokenId, canNoun, nounText, nounApplied, prefillTakenBase}]
let selectedSlotIndex = -1;
let moveHistory = []; // {slotIndex, tokenId, prevSlotText, prevNounApplied}
let nominalActiveSlotIndex = 0;
let nominalHasFirstDrag = false;
let stopNominalDragTipArc = null;

// 3단계 뜻(순서)
let korBankTokens = [];
let korSelectedTokens = [];

// nounCandidate (approved -> approval 등)
let nounCandidateLower = "";
let nounCandidateText = "";
let stopReduceDragTipArc = null;
let abFlipDefaultHeight = 0;
let nominalFlipCleanupTimer = null;

// UI state
let nominalOpen = false;
const UI_INST_FLIP = "\uB4A4\uC9D1\uC5B4\uBCF4\uC138\uC694";
const UI_INST_REDUCE_SAME = "\uAC19\uC740 \uAC83\uC744 \uC57D\uBD84\uD574\uBCF4\uC138\uC694";
const UI_INST_DRAG = "\uB4DC\uB798\uADF8\uD574\uBCF4\uC138\uC694";
const STAGE_ADVANCE_DELAY_MS = 480;
let stageAdvanceTimerId = null;
const TOAST_OK = "\uC815\uB2F5!";
const TOAST_NO = "\uC624\uB2F5...";

/* ------------------------------ init ------------------------------ */
window.addEventListener("DOMContentLoaded", async () => {
  var __r2_guard = (new URLSearchParams(window.location.search || "")).get("round2") === "1";
  if (__r2_guard) return;
  applyQueryParams();
  wireBackButton();
  injectStyles();
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

/* ================== Params / Nav ================== */
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

/* ================== Styles ================== */
function injectStyles() {
  const style = document.createElement("style");
  style.textContent = `
    :root{
      --ink:#7e3106;
      --warm:#fff3e0;
      --slot: rgba(126,49,6,0.04);
      --slot2: rgba(126,49,6,0.07);
      --slotBorder: rgba(126,49,6,0.22);
      --ok:#2e7d32;
      --no:#c62828;
      --hl: rgba(241,123,42,0.18);
      --hlBorder: rgba(241,123,42,0.60);
      --nounGold: rgba(212,175,55,0.20);
      --nounGold2: rgba(212,175,55,0.38);
    }
    .hidden{ display:none !important; }
    .tone-a, .tone-b{
      text-decoration-line: underline;
      text-decoration-thickness: 2px;
      text-underline-offset: 4px;
      text-decoration-skip-ink: none;
    }
    .tone-a{ text-decoration-color: rgba(241,123,42,0.90); }
    .tone-b{ text-decoration-color: rgba(70,140,255,0.92); }

    .stage-pill{
      display:inline-block;
      font-size:12px;
      padding:6px 10px;
      border-radius:999px;
      font-weight:900;
      border:1px solid rgba(0,0,0,0.12);
      background:#fff;
      margin-bottom:8px;
    }

    /* 원문 표시에서 하이라이트 */
    .hl{
      display:inline-block;
      padding:2px 6px;
      border-radius:10px;
      background: var(--hl);
      box-shadow: inset 0 0 0 1px var(--hlBorder);
      font-weight:900;
      color:#222;
    }

    /* A/B view */
    .ab-line{
      line-height: 2.0;
      font-size: 16px;
      font-weight: 900;
      color: #222;
      word-break: keep-all;
    }
    .ab-row{ margin-bottom: 8px; }
    .ab-tag{
      font-size: 12px;
      font-weight: 900;
      color: #7e3106;
      margin-bottom: 4px;
    }
    .ab-card{
      position: relative;
      line-height: 1.75;
      font-size: 15px;
      font-weight: 900;
      color: #222;
      word-break: keep-all;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 12px;
      padding: 10px 12px;
    }
    .ab-card.clickable{
      cursor:pointer;
      transition: background .12s ease, transform .12s ease, box-shadow .12s ease;
    }
    .ab-card.clickable:hover{
      background: rgba(241,123,42,0.06);
      transform: translateY(-0.6px);
      box-shadow: 0 0 0 2px rgba(241,123,42,0.10);
    }
    .ab-card.drag-source{
      cursor: grab;
      user-select: none;
    }
    .ab-card.drag-source.dragging{
      opacity:.55;
      cursor:grabbing;
    }
    .ab-card.over{
      border-color: rgba(70,140,255,0.82);
      box-shadow: 0 0 0 2px rgba(70,140,255,0.14);
      background: rgba(70,140,255,0.08);
    }
    .ab-line.clickable{
      cursor:pointer;
      border-radius:12px;
      padding:6px 8px;
      margin: -4px -8px;
      transition: background .12s ease, transform .12s ease;
    }
    .ab-line.clickable:hover{
      background: rgba(241,123,42,0.08);
      transform: translateY(-0.6px);
    }
    .ab-hint{
      display:inline-block;
      font-size:12px;
      font-weight:900;
      color: rgba(126,49,6,0.72);
      margin-left:6px;
      opacity:.92;
    }
    .ab-hint.legacy-kor-hint{ display:none; }
    .tap-tip{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      margin-left: 0;
      padding: 2px 7px;
      border-radius: 999px;
      border: 1px solid rgba(70,140,255,0.55);
      background: rgba(70,140,255,0.14);
      color: #1f4fb8;
      font-size: 11px;
      font-weight: 900;
      line-height: 1;
      user-select: none;
      animation: tapBob 1s ease-in-out infinite;
      position:absolute;
      right:10px;
      top:-12px;
      z-index:2;
      pointer-events:none;
    }
    @keyframes tapBob{
      0%,100%{ transform: translateY(0); }
      50%{ transform: translateY(-2px); }
    }

    .ab-card.done{
      background: rgba(46,125,50,0.10);
      border-color: rgba(46,125,50,0.42);
      box-shadow: 0 0 0 2px rgba(46,125,50,0.10);
    }
    #ab-box{
      transition: background .28s ease, border-color .28s ease, box-shadow .28s ease;
    }
    #ab-box.nominal-face{
      background: linear-gradient(180deg, rgba(246,239,230,0.98) 0%, rgba(236,226,214,0.98) 100%);
      border-color: rgba(126,49,6,0.18);
      box-shadow: 0 10px 22px rgba(126,49,6,0.06);
    }
    .ab-flip-scene{
      perspective: 1200px;
    }
    .ab-flip-card{
      display:grid;
      position:relative;
      overflow:visible;
      transform-style: preserve-3d;
      transition:
        transform .58s cubic-bezier(.22,.88,.28,1),
        height .42s cubic-bezier(.22,.88,.28,1);
    }
    .ab-flip-card.is-flipped{
      transform: rotateY(180deg);
    }
    .ab-face{
      grid-area: 1 / 1;
      min-width: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      transform-style: preserve-3d;
      pointer-events: none;
    }
    .ab-face.front{
      transform: rotateY(0deg);
      pointer-events: auto;
      transition: opacity .12s ease;
    }
    .ab-face.back{
      transform: rotateY(180deg);
    }
    .ab-flip-card.is-flipped .front{
      opacity:0;
      pointer-events:none;
    }
    .ab-flip-card.is-flipped .back{
      pointer-events:auto;
    }
    .inst-simple{
      font-weight:900;
      color:#7e3106;
      line-height:1.6;
    }

    /* source tokens (A sentence) */
    .src-sentence{
      line-height: 2.0;
      font-size: 15px;
      font-weight: 900;
      color: #222;
      word-break: keep-all;
    }
    .srcTok{
      display:inline;
      border:none;
      border-radius:0;
      padding:0;
      background:transparent;
      margin: 0 4px 0 0;
      cursor: grab;
      user-select:none;
      text-decoration: underline;
      text-decoration-thickness: 1.5px;
      text-decoration-style: dashed;
      text-decoration-color: rgba(241,123,42,0.78);
      transition: color .12s ease, opacity .12s ease;
    }
    .srcTok:hover{ color:#b45716; }
    .srcTok.dragging{
      opacity:.42;
      cursor:grabbing;
    }
    .srcTok.used{
      opacity: .22;
      cursor: not-allowed;
      color: rgba(0,0,0,0.42);
      text-decoration-color: rgba(241,123,42,0.30);
    }
    .srcTok.nope{
      background: rgba(198,40,40,0.08);
    }
    .srcTok.verb{
      display:inline-block;
      padding:1px 6px;
      border-radius:9px;
      border-color: rgba(241,123,42,0.85);
      box-shadow: 0 0 0 2px rgba(241,123,42,0.12);
      background: rgba(241,123,42,0.10);
      color: #7e3106;
    }

    /* target line */
    .target-wrap{
      margin-top:10px;
      padding:10px;
      border-radius:12px;
      border:1px solid rgba(0,0,0,0.08);
      background: rgba(255,255,255,0.92);
    }
    .target-line{
      line-height: 2.0;
      font-size: 15px;
      font-weight: 900;
      color: #222;
      word-break: keep-all;
    }
    .drop-word-slot{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      min-width: 42px;
      min-height: 30px;
      padding: 0 10px;
      border-radius: 12px;
      border: 1.5px dashed rgba(70,140,255,0.55);
      background: rgba(70,140,255,0.08);
      color:#1f4fb8;
      vertical-align:middle;
      margin-right: 4px;
      transition: box-shadow .15s ease, border-color .15s ease, background .15s ease;
      cursor: pointer;
      position: relative;
    }
    .drop-word-slot.empty{
      opacity:.8;
      font-weight:800;
    }
    .drop-word-slot.active{
      border-color: rgba(70,140,255,0.9);
      box-shadow: 0 0 0 2px rgba(70,140,255,0.18);
    }
    .drop-word-slot.over{
      border-color: rgba(70,140,255,0.82);
      box-shadow: 0 0 0 2px rgba(70,140,255,0.14);
      background: rgba(70,140,255,0.14);
    }
    .drop-word-slot.filled{
      border-style: solid;
      background: rgba(70,140,255,0.16);
      color:#113a9a;
    }
    .drop-word-slot.bad{
      box-shadow: 0 0 0 3px rgba(198,40,40,0.12);
      background: rgba(198,40,40,0.10);
      border-color: rgba(198,40,40,0.58);
      color: #7e3106;
    }
    .drag-tip-fly{
      position: fixed;
      left: 0;
      top: 0;
      font-size: 11px;
      font-weight: 900;
      color: #1f4fb8;
      background: rgba(70,140,255,0.14);
      border: 1px solid rgba(70,140,255,0.42);
      border-radius: 999px;
      padding: 2px 7px;
      user-select: none;
      pointer-events: none;
      white-space: nowrap;
      z-index: 9999;
      opacity: .95;
      transform: translate3d(-9999px,-9999px,0);
    }

    .fixed{
      display:inline-block;
      padding:2px 6px;
      border-radius:10px;
      background: rgba(255, 243, 196, 0.95);
      border:1px solid rgba(233,199,167,0.90);
      color:#7e3106;
      font-weight:900;
      margin: 0 2px;
      box-shadow: 0 1px 0 rgba(0,0,0,0.02) inset;
    }
    .fixed.faded{
      opacity: .78;
      background: rgba(255, 243, 196, 0.65);
      border-color: rgba(233,199,167,0.65);
      color: rgba(126,49,6,0.85);
    }

    .slot{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      min-width: 34px;
      height: 28px;
      padding: 0 10px;
      border-radius: 12px;
      border: 1px dashed var(--slotBorder);
      background: var(--slot);
      margin: 0 3px;
      vertical-align: middle;
      cursor: pointer;
      position: relative;
      transition: background .12s ease, transform .12s ease, box-shadow .12s ease;
    }
    .slot:hover{
      background: var(--slot2);
      transform: translateY(-0.6px);
    }
    .slot.selected{
      box-shadow: 0 0 0 3px rgba(126,49,6,0.10);
    }
    .slot.bad{
      box-shadow: 0 0 0 3px rgba(198,40,40,0.10);
      background: rgba(198,40,40,0.06);
    }
    .ghost{ opacity:.25; font-weight:900; }

    /* noun conversion effect */
    .noun-pending{
      border-color: rgba(241,123,42,0.70) !important;
      box-shadow: 0 0 0 2px rgba(241,123,42,0.12);
      animation: nounPulse 0.95s ease-in-out infinite;
    }
    @keyframes nounPulse{
      0%,100%{ transform: translateY(0); box-shadow: 0 0 0 2px rgba(241,123,42,0.10); }
      50%{ transform: translateY(-0.6px); box-shadow: 0 0 0 4px rgba(241,123,42,0.14); }
    }
    .noun-done{
      border-color: rgba(212,175,55,0.85) !important;
      background: linear-gradient(180deg, rgba(255, 244, 210, 0.92) 0%, rgba(255, 235, 170, 0.58) 100%);
      box-shadow: 0 0 0 2px rgba(212,175,55,0.16), 0 8px 18px rgba(212,175,55,0.14);
    }
    .noun-bang{ animation: nounBang 320ms cubic-bezier(.15, 1.25, .25, 1) both; }
    @keyframes nounBang{
      0%{ transform: scale(1); }
      35%{ transform: scale(1.18) rotate(-1.2deg); }
      70%{ transform: scale(0.98) rotate(0.6deg); }
      100%{ transform: scale(1); }
    }
    .noun-float{
      position:absolute;
      right:-6px;
      top:-12px;
      font-size:11px;
      font-weight:900;
      letter-spacing:0.2px;
      color: rgba(126,49,6,0.45);
      text-shadow: 0 10px 16px rgba(0,0,0,0.10);
      transform: rotate(-10deg);
      pointer-events:none;
      animation: nounFloat 760ms ease-out forwards;
    }
    @keyframes nounFloat{
      0%{ opacity:0; transform: translateY(2px) scale(0.96) rotate(-10deg); }
      22%{ opacity:0.55; }
      100%{ opacity:0; transform: translateY(-16px) scale(1.10) rotate(-10deg); }
    }

    .controls-inline{
      display:flex;
      gap:8px;
      margin-top:10px;
      justify-content:flex-end;
    }
    .icon-btn{
      padding:8px 10px;
      border-radius:12px;
      border:1px solid rgba(0,0,0,0.12);
      background:#fff;
      font-weight:900;
      cursor:pointer;
      user-select:none;
    }
    .icon-btn:disabled{ opacity:.45; cursor:not-allowed; }

    /* Stage3: 뜻(순서 맞추기) */
    .answer-line{
      min-height:44px;
      padding:10px;
      border-radius:12px;
      border:1px solid rgba(0,0,0,0.10);
      background:#fff;
      line-height:1.6;
      font-size:15px;
      word-break:keep-all;
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

    .ok{ font-weight:900; font-size:18px; color: var(--ok); text-align:center; }
    .no{ font-weight:900; font-size:18px; color: var(--no); text-align:center; }

    .shake{ animation: shake 260ms ease-in-out; }
    @keyframes shake{
      0%{ transform: translateX(0); }
      25%{ transform: translateX(-4px); }
      50%{ transform: translateX(4px); }
      75%{ transform: translateX(-3px); }
      100%{ transform: translateX(0); }
    }
  `;
  document.head.appendChild(style);
}

/* ================== Load Excel ================== */
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

/* ================== Build Questions ================== */
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
    const laststageFinalRaw =
      String(r["Laststage-FinalSentence"] ?? r["LaststageFinalSentence"] ?? "").trim();
    const laststageKRTokensRaw =
      String(r["Laststage-KRTokens"] ?? r["LaststageKRTokens"] ?? "").trim();

    const { a, b } = splitAandB(questionRaw);
    const { english, korean } = splitEnglishAndKoreanByDash(answerRaw);

    // Answer에서 주어 명사구(subject phrase) 추출
    const subjectPhrase = extractSubjectPhraseFromAnswer(english, b);

    return {
      qNumber,
      title,
      instruction,
      aRaw: a,
      bRaw: b,
      englishAnswer: english,
      koreanAnswer: korean,
      subjectPhrase,
      laststageFinalSentence: laststageFinalRaw,
      laststageKRTokens: laststageKRTokensRaw
    };
  });
}

function splitAandB(questionRaw){
  const s = String(questionRaw || "").trim();
  const m = s.match(/A\.\s*([\s\S]*?)\s*B\.\s*([\s\S]*)$/i);
  if (!m) return { a: s, b: "" };
  return { a: m[1].trim(), b: m[2].trim() };
}

function splitEnglishAndKoreanByDash(answerRaw) {
  const s = String(answerRaw || "").trim();

  const m = s.match(/\s[–—]\s/);
  if (m) {
    const idx = m.index;
    const english = stripTrailingPunct(s.slice(0, idx).trim());
    const korean = s.slice(idx + m[0].length).trim();
    return { english, korean };
  }
  const idx2 = s.indexOf(" - ");
  if (idx2 !== -1) {
    const english = stripTrailingPunct(s.slice(0, idx2).trim());
    const korean = s.slice(idx2 + 3).trim();
    return { english, korean };
  }
  return { english: stripTrailingPunct(s), korean: "" };
}

function extractSubjectPhraseFromAnswer(englishAnswer, bRaw){
  const ans = stripTrailingPunct(String(englishAnswer || "").trim());
  const b = stripTrailingPunct(String(bRaw || "").trim());
  if (!b) return guessSubjectByVerb(ans);

  const bTokens = wordsOnly(b);
  if (!bTokens.length) return guessSubjectByVerb(ans);

  // remove leading It
  const bPred = bTokens.filter((w, i) => !(i === 0 && normalizeWord(w) === "it"));
  const ansTokens = wordsOnly(ans);

  const pos = findSubsequence(ansTokens.map(normalizeWord), bPred.map(normalizeWord));
  if (pos === -1) return guessSubjectByVerb(ans);

  return ansTokens.slice(0, pos).join(" ").trim();
}
function guessSubjectByVerb(answer){
  const toks = wordsOnly(answer);
  if (toks.length <= 2) return answer;
  const idx = toks.findIndex((w, i) => i>0 && i<toks.length-1 && looksVerbish(w));
  if (idx <= 0) return toks.slice(0, Math.max(1, Math.floor(toks.length/2))).join(" ");
  return toks.slice(0, idx).join(" ");
}
function looksVerbish(w){
  const lw = normalizeWord(w);
  return /(ed|ing|s)$/.test(lw) || ["is","are","was","were","be","been","being","has","have","had","did","do","does"].includes(lw);
}
function wordsOnly(s){
  return (String(s||"").match(/\s+|[^\s]+/g) || []).filter(p => !/^\s+$/.test(p));
}
function findSubsequence(hay, needle){
  if (!needle.length) return -1;
  for (let i=0; i<=hay.length-needle.length; i++){
    let ok = true;
    for (let j=0; j<needle.length; j++){
      if (hay[i+j] !== needle[j]) { ok=false; break; }
    }
    if (ok) return i;
  }
  return -1;
}

/* ================== Intro ================== */
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


  const title = questions[0]?.title || "Herma L6-E1";
  const instruction =
    questions[0]?.instruction ||
    "A문장을 눌러 명사구 만들기를 하고, B의 It을 눌러 한 문장으로 합친 뒤 뜻을 완성하세요.";

  area.innerHTML = `
    <div class="box">
      <div style="font-size:18px; font-weight:900; color:#7e3106; margin-bottom:10px;">📘 Herma L6-E1</div>

      <div style="margin-bottom:10px;">
        <span class="pill">Lesson ${TARGET_LESSON}</span>
        <span class="pill">Exercise ${TARGET_EXERCISE}</span>
        <span class="pill">Day ${escapeHtml(day)}</span>
      </div>

      <div style="font-weight:900; margin-bottom:6px; color:#444;">${escapeHtml(title)}</div>

      <div style="margin-top:10px; font-size:13px; color:#7e3106; line-height:1.6;">
        📝 ${escapeHtml(instruction)}
      </div>

      <div style="margin-top:10px; font-size:12px; color:#555; line-height:1.6;">
        1) A문장을 <b>클릭</b>하면 그 자리에서 명사구 만들기가 열립니다.<br/>
        2) 슬롯이 다 차면 자동 채점되며, 맞으면 자동으로 원문 화면으로 돌아옵니다.<br/>
        3) 이후 B문장의 <b>It</b>을 누르면 문장이 합쳐지고 뜻(순서)이 열립니다.
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

function clearStageAdvanceTimer() {
  if (!stageAdvanceTimerId) return;
  clearTimeout(stageAdvanceTimerId);
  stageAdvanceTimerId = null;
}

function queueStageAdvance(fn) {
  clearStageAdvanceTimer();
  stageAdvanceTimerId = setTimeout(() => {
    stageAdvanceTimerId = null;
    if (typeof fn === "function") fn();
  }, STAGE_ADVANCE_DELAY_MS);
}

function syncActionButtonsVisibility() {
  const show = !!stage3Shown;
  const submitBtn = document.getElementById("submit-btn");
  const nextBtn = document.getElementById("next-btn");
  if (submitBtn) submitBtn.classList.toggle("hidden", !show);
  if (nextBtn) nextBtn.classList.toggle("hidden", !show);
}

/* ================== Main Render ================== */
function renderQuestion() {
  const area = document.getElementById("quiz-area");
  if (!area) return;

  const q = questions[currentIndex];
  if (!q) return showResultPopup();

  // reset flags
  isAnswered = false;
  stage1Ok = false;
  stageReduceOk = false;
  stage2Ok = false;
  stage3Ok = false;
  stage3Shown = false;

  nominalOpen = false;
  selectedSlotIndex = -1;
  moveHistory = [];
  nominalActiveSlotIndex = 0;
  nominalHasFirstDrag = false;
  clearStageAdvanceTimer();
  stopNominalDragTipArcHint();
  stopReduceDragTipArcHint();
  abFlipDefaultHeight = 0;
  if (nominalFlipCleanupTimer) {
    clearTimeout(nominalFlipCleanupTimer);
    nominalFlipCleanupTimer = null;
  }
  korBankTokens = [];
  korSelectedTokens = [];

  aRaw = String(q.aRaw || "").trim();
  bRaw = String(q.bRaw || "").trim();
  englishAnswerRaw = String(q.englishAnswer || "").trim();
  koreanAnswerRaw = String(q.koreanAnswer || "").trim();
  subjectPhraseRaw = String(q.subjectPhrase || "").trim();
  laststageFinalSentenceRaw = String(q.laststageFinalSentence || "").trim();
  laststageKRTokensRaw = String(q.laststageKRTokens || "").trim();

  // 1) src tokens from A (strip **, mark verb tokens inside)
  srcTokens = buildSourceTokensFromDoubleStarSentence(aRaw);

  // 2) build slots plan from subject phrase
  const plan = buildSlotsPlanForNominal(subjectPhraseRaw, srcTokens);
  slots = plan.slots;
  nounCandidateLower = plan.nounLower;
  nounCandidateText = plan.nounText || "";

  area.innerHTML = `
    <div class="q-label">Q. ${currentIndex + 1} / ${questions.length}</div>

    <div class="box" id="instruction-box">
      <div class="inst-simple" id="instruction-text"></div>
    </div>

    <div class="box" id="ab-box">
      <div class="ab-flip-scene">
        <div class="ab-flip-card" id="ab-flip-card">
          <!-- A/B 원문 화면 -->
          <div class="ab-face front" id="ab-face-front">
            <div id="ab-view"></div>
          </div>

          <!-- 인플레이스 1단계(명사구 만들기) 화면 -->
          <div class="ab-face back" id="ab-face-back">
            <div id="nominal-view"></div>
          </div>
        </div>
      </div>
    </div>

    ${window.HermaStageTemplates?.translateBlockHTML?.() || `
      <div id="translate-block" class="hidden">
        <div class="box" style="margin-bottom:10px;">
          <div class="sentence" id="plain-english-line"></div>
        </div>
        <div class="sentence" id="answer-line" style="min-height:86px; display:flex; flex-wrap:wrap; align-items:flex-start; gap:6px;"></div>
        <div class="box" style="margin-top:10px;">
          <div id="bank-area"></div>
          <div id="remain-info" style="margin-top:8px; font-size:12px; font-weight:900; color:rgba(126,49,6,0.78);"></div>
        </div>
      </div>
    `}

    <div class="btn-row">
      <button class="quiz-btn" id="submit-btn" onclick="submitAnswer()" disabled>제출</button>
      <button class="quiz-btn" id="next-btn" onclick="goNext()">다음</button>
    </div>

    <div id="feedback-area" style="margin-top:12px;"></div>
  `;

  renderInstruction();
  renderABView();
  syncActionButtonsVisibility();
  wireABDelegation();
  deferCaptureABFlipDefaultHeight();
}

function renderABView(){
  const ab = document.getElementById("ab-view");
  if (!ab) return;

  renderInstruction();

  // stage2 이전: 기존 A/B 화면 유지
  if (!stage2Ok){
    const isDragPhase = !!(stage1Ok && stageReduceOk);
    const aDisplayHtml = stage1Ok
      ? renderFinalSentenceWithNounHighlight(buildUserSubjectPhraseDisplay() || subjectPhraseRaw)
      : renderDoubleStarAsHighlight(aRaw);
    const bDisplayHtml = renderBWithItClickable(bRaw, stageReduceOk);

    const aHint = stage1Ok
      ? ``
      : `<span class="ab-hint legacy-kor-hint">👆 눌러서 명사구</span><span class="tap-tip">tap</span>`;

    const bHint = !stage1Ok
      ? ``
      : ``;

    const aCardId = isDragPhase ? "a-drop-target" : "a-line";
    const aRole = stage1Ok ? "" : `data-role="a-line"`;
    const bDragClass = isDragPhase ? "drag-source" : "";
    const bDragAttr = isDragPhase ? `id="b-drag-source" draggable="true"` : "";

    ab.innerHTML = `
      <div class="ab-row">
        <div class="ab-tag">A문장</div>
        <div id="${aCardId}" class="ab-card ${stage1Ok ? "done" : "clickable"}" ${aRole}>
          <span class="tone-a">${aDisplayHtml}</span> ${aHint}
        </div>
      </div>
      <div class="ab-row">
        <div class="ab-tag">B문장</div>
        <div class="ab-card ${stageReduceOk ? "done" : ""} ${bDragClass}" ${bDragAttr}>
          <span id="b-it-wrap" class="tone-b">${bDisplayHtml}</span> ${bHint}
        </div>
      </div>
    `;
    if (isDragPhase) {
      setupReductionDrag();
      startReduceDragTipArc();
    } else {
      stopReduceDragTipArcHint();
    }
    syncABFlipCardHeight("front");
    return;
  }

  // ✅ stage2 이후: "완결된 한 문장"만 표시 (+ approval 하이라이트)
  stopReduceDragTipArcHint();
  const finalHtml = renderFinalABSegmentUnderlinedHtml();

  ab.innerHTML = `
    <div class="ab-row">
      <div class="ab-card done joined-glow">
        ${finalHtml}
      </div>
    </div>
  `;
  syncABFlipCardHeight("front");
}

function renderInstruction(){
  const box = document.getElementById("instruction-box");
  const text = document.getElementById("instruction-text");
  if (!box || !text) return;

  if (stage3Shown) {
    box.classList.add("hidden");
    return;
  }
  box.classList.remove("hidden");
  if (!stage1Ok) {
    text.textContent = UI_INST_FLIP;
    return;
  }
  text.textContent = stageReduceOk ? UI_INST_DRAG : UI_INST_REDUCE_SAME;
}

function setupReductionDrag(){
  const src = document.getElementById("b-drag-source");
  const dst = document.getElementById("a-drop-target");
  if (!src || !dst || stage2Ok || !stage1Ok || !stageReduceOk) return;

  src.draggable = true;
  src.addEventListener("dragstart", (e) => {
    if (isAnswered || stage2Ok) return;
    src.classList.add("dragging");
    stopReduceDragTipArcHint();
    try { e.dataTransfer.setData("text/reduce", "1"); } catch (_) {}
  });
  src.addEventListener("dragend", () => {
    src.classList.remove("dragging");
  });

  dst.addEventListener("dragover", (e) => {
    if (isAnswered || stage2Ok) return;
    e.preventDefault();
    dst.classList.add("over");
  });
  dst.addEventListener("dragleave", () => {
    dst.classList.remove("over");
  });
  dst.addEventListener("drop", (e) => {
    if (isAnswered || stage2Ok) return;
    e.preventDefault();
    dst.classList.remove("over");
    onReduceDragDone();
  });
}

function stopReduceDragTipArcHint(){
  if (typeof stopReduceDragTipArc === "function") {
    try { stopReduceDragTipArc(); } catch (_) {}
  }
  stopReduceDragTipArc = null;
}

function startReduceDragTipArc(){
  stopReduceDragTipArcHint();
  if (isAnswered || stage2Ok || !stage1Ok || !stageReduceOk) return;

  const source = document.getElementById("b-drag-source");
  const target = document.getElementById("a-drop-target");
  if (!source || !target) return;

  const tip = document.createElement("div");
  tip.className = "drag-tip-fly";
  tip.textContent = "drag";
  document.body.appendChild(tip);

  let alive = true;
  let rafId = 0;
  let cycleStartTs = 0;
  const durationMs = 1300;
  const pauseMs = 220;
  const arcLift = 34;
  const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  const frame = (ts) => {
    if (!alive) return;
    if (!document.body.contains(tip)) {
      alive = false;
      return;
    }
    if (!cycleStartTs) cycleStartTs = ts;
    let elapsed = ts - cycleStartTs;
    if (elapsed > durationMs + pauseMs) {
      cycleStartTs = ts;
      elapsed = 0;
    }

    const sRect = source.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();
    if (!sRect.width || !tRect.width) {
      rafId = requestAnimationFrame(frame);
      return;
    }
    const start = { x: sRect.left + (sRect.width / 2), y: sRect.top + (sRect.height / 2) };
    const end = { x: tRect.left + (tRect.width / 2), y: tRect.top + (tRect.height / 2) };
    const control = { x: (start.x + end.x) / 2, y: Math.min(start.y, end.y) - arcLift };

    const moving = elapsed <= durationMs;
    const t0 = moving ? (elapsed / durationMs) : 1;
    const t = easeInOut(Math.max(0, Math.min(1, t0)));
    const omt = 1 - t;
    const x = (omt * omt * start.x) + (2 * omt * t * control.x) + (t * t * end.x);
    const y = (omt * omt * start.y) + (2 * omt * t * control.y) + (t * t * end.y);
    const halfW = tip.offsetWidth / 2;
    const halfH = tip.offsetHeight / 2;

    tip.style.opacity = moving ? ".95" : "0";
    tip.style.transform = `translate3d(${(x - halfW).toFixed(2)}px, ${(y - halfH).toFixed(2)}px, 0)`;
    rafId = requestAnimationFrame(frame);
  };

  rafId = requestAnimationFrame(frame);
  stopReduceDragTipArc = () => {
    alive = false;
    cancelAnimationFrame(rafId);
    if (tip.parentNode) tip.parentNode.removeChild(tip);
  };
}


function wireABDelegation(){
  const box = document.getElementById("ab-box");
  if (!box) return;

  box.onclick = (ev) => {
    if (isAnswered) return;

    const aLine = ev.target.closest('[data-role="a-line"]');
    if (aLine && !stage1Ok && !nominalOpen) {
      openNominalInPlace();
      return;
    }

    const itEl = ev.target.closest("[data-btok]");
    if (itEl && stage1Ok && !stageReduceOk && !stage2Ok) {
      if ((itEl.getAttribute("data-clean") || "") !== "it") return;
      onItClicked(itEl);
      return;
    }
  };
}

function captureABFlipDefaultHeight(){
  const front = document.getElementById("ab-view");
  if (!front) return;
  const h = Math.max(
    Math.ceil(front.getBoundingClientRect().height || 0),
    Math.ceil(front.scrollHeight || 0)
  );
  if (h > 0) abFlipDefaultHeight = h;
}

function deferCaptureABFlipDefaultHeight(){
  requestAnimationFrame(() => {
    if (!nominalOpen) captureABFlipDefaultHeight();
  });
}

function syncABFlipCardHeight(face){
  const card = document.getElementById("ab-flip-card");
  if (!card) return;
  if (face === "back") {
    card.style.height = "";
    return;
  }
  if (face === "front" && abFlipDefaultHeight > 0) {
    card.style.height = `${abFlipDefaultHeight}px`;
    return;
  }
  card.style.height = "";
}

function deferSyncABFlipCardHeight(face){
  requestAnimationFrame(() => syncABFlipCardHeight(face));
}

/* ================== Stage1 In-place Nominal Builder ================== */
function openNominalInPlace(){
  const ab = document.getElementById("ab-view");
  const nv = document.getElementById("nominal-view");
  const flip = document.getElementById("ab-flip-card");
  const abBox = document.getElementById("ab-box");
  if (!ab || !nv) return;
  if (nominalFlipCleanupTimer) {
    clearTimeout(nominalFlipCleanupTimer);
    nominalFlipCleanupTimer = null;
  }

  syncActionButtonsVisibility();

  stopReduceDragTipArcHint();
  nominalOpen = true;
  nominalActiveSlotIndex = 0;
  nominalHasFirstDrag = false;
  clearStageAdvanceTimer();
  stopNominalDragTipArcHint();

  nv.innerHTML = `
    <div class="sentence">
      <div class="src-sentence" id="src-sentence"></div>
    </div>
    <div class="sentence" style="margin-top:8px;">
      <div class="target-line" id="target-line"></div>
    </div>
  `;

  renderSourceSentence();
  renderTargetLine();
  startNominalDragTipArc();
  syncABFlipCardHeight("back");
  requestAnimationFrame(() => {
    if (abBox) abBox.classList.add("nominal-face");
    if (flip) flip.classList.add("is-flipped");
  });
}

function closeNominalInPlace(){
  const ab = document.getElementById("ab-view");
  const nv = document.getElementById("nominal-view");
  const flip = document.getElementById("ab-flip-card");
  const abBox = document.getElementById("ab-box");
  if (!ab || !nv) return;

  syncActionButtonsVisibility();

  stopNominalDragTipArcHint();
  nominalOpen = false;
  renderABView();
  syncABFlipCardHeight("front");
  requestAnimationFrame(() => {
    if (flip) flip.classList.remove("is-flipped");
    if (abBox) abBox.classList.remove("nominal-face");
  });
  nominalFlipCleanupTimer = setTimeout(() => {
    if (nv) nv.innerHTML = "";
    nominalFlipCleanupTimer = null;
  }, 620);
}

function maybeAutoCompleteStage1(){
  if (!areAllSlotsFilled()) return;

  const built = buildUserSubjectPhrase();
  const target = normalizeTargetSubject();

  if (built === target) {
    stage1Ok = true;
    stopNominalDragTipArcHint();
    if (window.HermaToastFX) window.HermaToastFX.show("ok", TOAST_OK);

    setTimeout(() => {
      closeNominalInPlace();
    }, 320);
    return;
  }

  // approved -> approval 같은 탭 변환 대기 상태는 오답 처리하지 않음
  if (hasPendingNounConversion()) {
    return;
  }
}

function renderSourceSentence(){
  const wrap = document.getElementById("src-sentence");
  if (!wrap) return;

  wrap.innerHTML = "";
  srcTokens.forEach((t) => {
    const sp = document.createElement("span");
    sp.className = "srcTok" + (t.used ? " used" : "") + (t.verb ? " verb" : "");
    sp.textContent = t.display;
    sp.setAttribute("data-token-id", t.id);
    sp.draggable = !t.used;

    sp.addEventListener("click", () => {
      if (isAnswered || t.used) return;
      onClickSourceToken(t.id, sp);
    });
    sp.addEventListener("dragstart", (e) => {
      if (isAnswered || t.used) return;
      sp.classList.add("dragging");
      try { e.dataTransfer.setData("text/plain", t.id); } catch (_) {}
    });
    sp.addEventListener("dragend", () => {
      sp.classList.remove("dragging");
    });

    wrap.appendChild(sp);
  });

  if (nominalOpen) deferSyncABFlipCardHeight("back");
}

function onClickSourceToken(tokenId, el){
  const t = srcTokens.find(x => x.id === tokenId);
  if (!t || t.used || isAnswered) return;

  const targetIndex = pickTargetSlotIndex();
  if (targetIndex === -1) return;

  const slot = slots[targetIndex];
  if (!slot || slot.kind !== "slot" || slot.filled) return;

  const prevText = slot.text || "";
  const prevApplied = !!slot.nounApplied;

  slot.filled = true;
  slot.fromTokenId = t.id;

  if (slot.fillRule === "verbNOUN") {
    slot.text = t.clean;
    slot.canNoun = isTokenConvertibleToNoun(t.lower, slot.nounText || nounCandidateText);
    slot.nounText = slot.nounText || nounCandidateText;
    slot.nounApplied = false;
  } else {
    slot.text = t.clean;
    slot.canNoun = false;
    slot.nounText = "";
    slot.nounApplied = false;
  }

  t.used = true;
  if (!nominalHasFirstDrag) {
    nominalHasFirstDrag = true;
    stopNominalDragTipArcHint();
  }

  moveHistory.push({
    slotIndex: targetIndex,
    tokenId: t.id,
    prevSlotText: prevText,
    prevNounApplied: prevApplied,
  });

  const nextSlot = findNextEmptySlotIndex(targetIndex + 1);
  nominalActiveSlotIndex = nextSlot >= 0 ? nextSlot : targetIndex;
  selectedSlotIndex = nominalActiveSlotIndex;
  renderSourceSentence();
  renderTargetLine();

  maybeAutoCompleteStage1();
}

function renderTargetLine(){
  const tl = document.getElementById("target-line");
  if (!tl) return;

  tl.innerHTML = "";

  slots.forEach((s, i) => {
    if (s.kind === "fixed") {
      const span = document.createElement("span");
      span.className = "fixed" + (s.faded ? " faded" : "");
      span.textContent = s.text;
      tl.appendChild(span);
      tl.appendChild(document.createTextNode(" "));
      return;
    }

    const slot = document.createElement("span");
    const filled = !!(s.filled && s.text);
    slot.className = "drop-word-slot" + (filled ? " filled" : " empty")
      + (i === nominalActiveSlotIndex ? " active" : "")
      + (s.canNoun && !s.nounApplied ? " noun-pending" : "")
      + (s.nounApplied ? " noun-done" : "");
    slot.setAttribute("data-slot", String(i));

    const label = document.createElement("span");
    label.className = s.filled ? "" : "ghost";
    label.textContent = s.filled ? s.text : "…";
    slot.appendChild(label);

    slot.addEventListener("click", () => {
      if (isAnswered) return;

      if (s.filled && s.canNoun && !s.nounApplied) {
        s.text = s.nounText || s.text;
        s.nounApplied = true;

        label.textContent = s.text;

        slot.classList.remove("noun-pending");
        slot.classList.add("noun-done");
        slot.classList.remove("noun-bang");
        void slot.offsetWidth;
        slot.classList.add("noun-bang");

        const fx = document.createElement("span");
        fx.className = "noun-float";
        fx.textContent = "noun!";
        slot.appendChild(fx);
        setTimeout(() => fx.remove(), 900);

        setTimeout(() => {
          renderTargetLine();
          maybeAutoCompleteStage1();
        }, 220);
        return;
      }

      if (s.filled) {
        const tokId = s.fromTokenId || "";
        s.filled = false;
        s.text = "";
        s.fromTokenId = "";
        s.canNoun = false;
        s.nounText = "";
        s.nounApplied = false;

        const tok = srcTokens.find(x => x.id === tokId);
        if (tok) tok.used = false;

        nominalActiveSlotIndex = i;
        selectedSlotIndex = i;
        renderSourceSentence();
        renderTargetLine();
        return;
      }

      if (!s.filled) {
        nominalActiveSlotIndex = i;
        selectedSlotIndex = i;
        renderTargetLine();
      }
    });
    slot.addEventListener("dragover", (e) => {
      if (isAnswered) return;
      if (s.filled) return;
      e.preventDefault();
      slot.classList.add("over");
    });
    slot.addEventListener("dragleave", () => {
      slot.classList.remove("over");
    });
    slot.addEventListener("drop", (e) => {
      if (isAnswered) return;
      if (s.filled) return;
      e.preventDefault();
      slot.classList.remove("over");
      const tokenId = String(e.dataTransfer?.getData("text/plain") || "").trim();
      if (!tokenId) return;
      nominalActiveSlotIndex = i;
      selectedSlotIndex = i;
      onClickSourceToken(tokenId, null);
    });

    tl.appendChild(slot);
    tl.appendChild(document.createTextNode(" "));
  });

  if (!nominalHasFirstDrag) startNominalDragTipArc();
  if (nominalOpen) deferSyncABFlipCardHeight("back");
}

function pickTargetSlotIndex(){
  if (nominalActiveSlotIndex >= 0) {
    const s0 = slots[nominalActiveSlotIndex];
    if (s0 && s0.kind === "slot" && !s0.filled) return nominalActiveSlotIndex;
  }
  if (selectedSlotIndex >= 0) {
    const s = slots[selectedSlotIndex];
    if (s && s.kind === "slot" && !s.filled) return selectedSlotIndex;
  }
  for (let i=0; i<slots.length; i++){
    const s = slots[i];
    if (s.kind === "slot" && !s.filled) return i;
  }
  return -1;
}

function findNextEmptySlotIndex(startIdx){
  const start = Number.isFinite(startIdx) ? startIdx : 0;
  for (let i=start; i<slots.length; i++){
    const s = slots[i];
    if (s && s.kind === "slot" && !s.filled) return i;
  }
  for (let i=0; i<start; i++){
    const s = slots[i];
    if (s && s.kind === "slot" && !s.filled) return i;
  }
  return -1;
}

function buildUserSubjectPhrase(){
  const words = [];
  slots.forEach((s) => {
    if (s.kind === "fixed") words.push(s.text);
    else if (s.kind === "slot" && s.filled && s.text) words.push(s.text);
  });
  return normalizeEnglish(words.join(" "));
}

function buildUserSubjectPhraseDisplay(){
  const words = [];
  slots.forEach((s) => {
    if (s.kind === "fixed" && s.text) words.push(s.text);
    else if (s.kind === "slot" && s.filled && s.text) words.push(s.text);
  });
  return words.join(" ").trim();
}
function normalizeTargetSubject(){
  return normalizeEnglish(subjectPhraseRaw);
}

function areAllSlotsFilled(){
  return slots.every(s => s.kind !== "slot" || s.filled);
}

function hasPendingNounConversion(){
  return slots.some(
    s => s.kind === "slot" && s.filled && s.canNoun && !s.nounApplied
  );
}

function isTokenConvertibleToNoun(tokenLower, nounText){
  const tok = String(tokenLower || "").toLowerCase().trim();
  const noun = normalizeWord(nounText || "");
  if (!tok || !noun) return false;
  if (tok === noun) return true;

  const nounBase = noun.replace(/(al|tion|sion|ment|ance|ence|ness|ity|er|or)$/i, "");
  const tokBase = tok.replace(/(ed|ing|s|es)$/i, "");
  if (nounBase && tokBase && (tokBase.startsWith(nounBase) || nounBase.startsWith(tokBase))) return true;

  if (noun.endsWith("al")) {
    const stem = noun.slice(0, -2); // approval -> approv
    const candidates = new Set([
      stem,
      stem + "e",
      stem + "ed",
      stem + "ing",
      stem + "s",
      stem + "es",
    ]);
    if (candidates.has(tok)) return true;
  }

  return false;
}

function undoMove(){
  if (!moveHistory.length || isAnswered) return;

  const last = moveHistory.pop();
  const s = slots[last.slotIndex];

  if (s && s.kind === "slot") {
    s.filled = false;
    s.text = last.prevSlotText || "";
    s.fromTokenId = "";
    s.canNoun = false;
    s.nounText = "";
    s.nounApplied = false;
  }

  const t = srcTokens.find(x => x.id === last.tokenId);
  if (t) t.used = false;

  nominalActiveSlotIndex = last.slotIndex;
  selectedSlotIndex = nominalActiveSlotIndex;
  stage1Ok = false;
  renderSourceSentence();
  renderTargetLine();
}

function resetMoves(){
  if (isAnswered) return;

  moveHistory = [];
  nominalActiveSlotIndex = 0;
  selectedSlotIndex = nominalActiveSlotIndex;
  stage1Ok = false;

  slots.forEach((s) => {
    if (s.kind === "slot") {
      s.filled = false;
      s.text = "";
      s.fromTokenId = "";
      s.canNoun = false;
      s.nounText = "";
      s.nounApplied = false;
    }
  });

  srcTokens.forEach((t) => (t.used = false));

  const takenBaseWords = new Set(
    slots
      .filter(x => x.kind === "fixed" && x.prefillTakenBase)
      .map(x => String(x.prefillTakenBase).toLowerCase())
  );
  srcTokens.forEach((t) => {
    if (takenBaseWords.has(t.lower)) t.used = true;
  });

  renderSourceSentence();
  renderTargetLine();
}

function stopNominalDragTipArcHint(){
  if (typeof stopNominalDragTipArc === "function") {
    try { stopNominalDragTipArc(); } catch (_) {}
  }
  stopNominalDragTipArc = null;
}

function startNominalDragTipArc(){
  stopNominalDragTipArcHint();
  if (isAnswered || !nominalOpen || stage1Ok) return;
  if (nominalHasFirstDrag) return;

  const preferredToken =
    srcTokens.find(t => !t.used && /^approv/.test(String(t.lower || "")))
    || srcTokens.find(t => !t.used && isTokenConvertibleToNoun(t.lower, nounCandidateText))
    || srcTokens.find(t => !t.used);
  const source = preferredToken
    ? document.querySelector(`.srcTok[data-token-id="${preferredToken.id}"]`)
    : document.querySelector(".srcTok:not(.used)");
  const target = document.querySelector(`.drop-word-slot[data-slot="${nominalActiveSlotIndex}"]`)
    || document.querySelector(".drop-word-slot.empty")
    || document.querySelector(".drop-word-slot");
  if (!source || !target) return;

  const tip = document.createElement("div");
  tip.className = "drag-tip-fly";
  tip.textContent = "drag";
  document.body.appendChild(tip);

  let alive = true;
  let rafId = 0;
  let cycleStartTs = 0;
  const durationMs = 1300;
  const pauseMs = 220;
  const arcLift = 42;

  const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  const frame = (ts) => {
    if (!alive) return;
    if (!document.body.contains(tip)) {
      alive = false;
      return;
    }
    if (!cycleStartTs) cycleStartTs = ts;
    let elapsed = ts - cycleStartTs;
    if (elapsed > durationMs + pauseMs) {
      cycleStartTs = ts;
      elapsed = 0;
    }

    const sRect = source.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();
    if (!sRect.width || !tRect.width) {
      rafId = requestAnimationFrame(frame);
      return;
    }

    const start = { x: sRect.left + (sRect.width / 2), y: sRect.top + (sRect.height / 2) };
    const end = { x: tRect.left + (tRect.width / 2), y: tRect.top + (tRect.height / 2) };
    const control = { x: (start.x + end.x) / 2, y: Math.min(start.y, end.y) - arcLift };

    const moving = elapsed <= durationMs;
    const t0 = moving ? (elapsed / durationMs) : 1;
    const t = easeInOut(Math.max(0, Math.min(1, t0)));
    const omt = 1 - t;
    const x = (omt * omt * start.x) + (2 * omt * t * control.x) + (t * t * end.x);
    const y = (omt * omt * start.y) + (2 * omt * t * control.y) + (t * t * end.y);
    const halfW = tip.offsetWidth / 2;
    const halfH = tip.offsetHeight / 2;

    tip.style.opacity = moving ? ".95" : "0";
    tip.style.transform = `translate3d(${(x - halfW).toFixed(2)}px, ${(y - halfH).toFixed(2)}px, 0)`;

    rafId = requestAnimationFrame(frame);
  };

  rafId = requestAnimationFrame(frame);
  stopNominalDragTipArc = () => {
    alive = false;
    cancelAnimationFrame(rafId);
    if (tip.parentNode) tip.parentNode.removeChild(tip);
  };
}

/* ================== Stage2: It click ================== */
function onItClicked(itEl){
  if (stage2Ok || stageReduceOk) return;

  stopReduceDragTipArcHint();
  const itNode = itEl || document.querySelector('#b-it-wrap [data-clean="it"]');
  if (itNode) {
    itNode.style.opacity = "0.22";
    itNode.style.textDecoration = "line-through";
  }
  stageReduceOk = true;

  renderABView();
  if (window.HermaToastFX) window.HermaToastFX.show("ok", TOAST_OK);
}

function onReduceDragDone(){
  if (stage2Ok || !stageReduceOk) return;
  stopReduceDragTipArcHint();
  stage2Ok = true;
  renderABView();
  if (window.HermaToastFX) window.HermaToastFX.show("ok", TOAST_OK);
  queueStageAdvance(() => {
    ensureStage3();
    const submitBtn = document.getElementById("submit-btn");
    if (submitBtn) submitBtn.disabled = false;
    syncActionButtonsVisibility();
  });
}

function renderBWithItClickable(b, reduced = false){
  const toks = tokenizePlain(b);
  return toks.map((t, idx) => {
    if (t.isSpace) return escapeHtml(t.raw);
    const isIt = (t.clean === "it");
    if (!isIt) return `<span>${escapeHtml(t.text)}</span>`;
    if (reduced) {
      return `<span class="hl" style="opacity:0.22; text-decoration:line-through;">${escapeHtml(t.text)}</span>`;
    }
    return `<span class="hl" data-btok="${idx}" data-clean="${escapeHtml(t.clean)}">${escapeHtml(t.text)}</span>`;
  }).join("");
}

/* ================== Stage3: Korean order ================== */
function ensureStage3(){
  if (stage3Shown) {
    renderKorBank();
    syncActionButtonsVisibility();
    return;
  }

  stage3Shown = true;

  const abBox = document.getElementById("ab-box");
  const instBox = document.getElementById("instruction-box");
  const tb = document.getElementById("translate-block");
  if (window.HermaStageTemplates?.openFinalStage) {
    window.HermaStageTemplates.openFinalStage({
      abBlockEl: abBox,
      instructionBoxEl: instBox,
      translateBlockEl: tb,
    });
  } else {
    if (abBox) abBox.classList.add("hidden");
    if (instBox) instBox.classList.add("hidden");
    if (tb) tb.classList.remove("hidden");
  }

  const plain = document.getElementById("plain-english-line");
  if (plain) {
    plain.innerHTML = `<div>${renderFinalABSegmentUnderlinedHtml()}</div>`;
  }

  const configured = parseLaststageKRTokens(laststageKRTokensRaw);
  const correctTokens = configured.length ? configured : buildLargeKoreanTokenObjectsByAB(koreanAnswerRaw);
  korBankTokens = shuffleArray(correctTokens.map((t, i) => ({
    id: `k${i}_${t.text}_${Math.random().toString(16).slice(2,6)}`,
    text: t.text,
    seg: t.seg || ""
  })));
  korSelectedTokens = [];
  renderKorBank();
  syncActionButtonsVisibility();
}

function renderKorBank(){
  const answerLine = document.getElementById("answer-line");
  const bankArea = document.getElementById("bank-area");
  const remainInfo = document.getElementById("remain-info");
  if (!answerLine || !bankArea) return;

  if (window.HermaFinalStage?.renderKoreanScramble) {
    window.HermaFinalStage.renderKoreanScramble({
      answerLineEl: answerLine,
      bankAreaEl: bankArea,
      remainInfoEl: remainInfo || null,
      selectedTokens: korSelectedTokens,
      bankTokens: korBankTokens,
      isKoLocked: isAnswered,
      onSelectToken: (tok) => {
        if (isAnswered) return;
        const idx = korBankTokens.findIndex((x) => x.id === tok.id);
        if (idx >= 0) {
          const moved = korBankTokens.splice(idx, 1)[0];
          if (moved) korSelectedTokens.push(moved);
        }
      },
      onUnselectLast: () => {
        if (isAnswered) return;
        const last = korSelectedTokens.pop();
        if (last) korBankTokens.push(last);
      },
      decorateToken: (el, tok) => {
        if (!el || !tok) return;
        applyKorSegUnderline(el, tok.seg);
      },
      rerender: () => renderKorBank(),
      guideHtml: "\uC870\uAC01\uC744 \uB204\uB974\uC138\uC694.<br>\uB9C8\uC9C0\uB9C9 \uC870\uAC01\uC744 \uB204\uB974\uBA74 \uCDE8\uC18C\uB429\uB2C8\uB2E4."
    });
    return;
  }

  if (!korSelectedTokens.length) {
    answerLine.innerHTML = `<span style="opacity:.45; font-weight:900; line-height:1.45;">\uC870\uAC01\uC744 \uB204\uB974\uC138\uC694.<br>\uB9C8\uC9C0\uB9C9 \uC870\uAC01\uC744 \uB204\uB974\uBA74 \uCDE8\uC18C\uB429\uB2C8\uB2E4.</span>`;
  } else {
    answerLine.innerHTML = "";
    korSelectedTokens.forEach((tok, idx) => {
      const isLast = idx === korSelectedTokens.length - 1;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pill-btn";
      btn.textContent = tok.text;
      btn.style.margin = "0 6px 6px 0";
      btn.style.border = isLast ? "2px solid rgba(241,123,42,0.9)" : "1px solid rgba(0,0,0,0.12)";
      btn.style.cursor = isAnswered ? "not-allowed" : (isLast ? "pointer" : "default");
      btn.disabled = isAnswered;
      applyKorSegUnderline(btn, tok.seg);
      btn.addEventListener("click", () => {
        if (isAnswered || !isLast) return;
        const last = korSelectedTokens.pop();
        if (last) korBankTokens.push(last);
        renderKorBank();
      });
      answerLine.appendChild(btn);
    });
  }

  bankArea.innerHTML = "";
  korBankTokens.forEach((tok) => {
    const btn = document.createElement("button");
    btn.className = "pill-btn";
    btn.type = "button";
    btn.textContent = tok.text;
    btn.disabled = isAnswered;
    applyKorSegUnderline(btn, tok.seg);
    btn.addEventListener("click", () => {
      if (isAnswered) return;
      const idx = korBankTokens.findIndex((x) => x.id === tok.id);
      if (idx >= 0) {
        const moved = korBankTokens.splice(idx, 1)[0];
        if (moved) korSelectedTokens.push(moved);
        renderKorBank();
      }
    });
    bankArea.appendChild(btn);
  });
  if (remainInfo) remainInfo.textContent = `\uB0A8\uC740 \uC870\uAC01: ${korBankTokens.length}\uAC1C`;
}

/* ================== Submit / Next / Result ================== */
function submitAnswer(){
  if (isAnswered) return;

  const q = questions[currentIndex];

  const built = buildUserSubjectPhrase();
  const target = normalizeTargetSubject();
  const korUser = normalizeKorean(korSelectedTokens.map(x => x.text).join(" "));
  const configured = parseLaststageKRTokens(laststageKRTokensRaw);
  const korTargetRaw = configured.length ? configured.map((t) => t.text).join(" ") : koreanAnswerRaw;
  const korTarget = normalizeKorean(korTargetRaw);

  stage1Ok = (built === target);
  stage3Ok = korTarget ? (korUser === korTarget) : true;

  const correct = stage1Ok && stage2Ok && stage3Ok;
  if (!correct) {
    if (window.HermaToastFX) window.HermaToastFX.show("no", TOAST_NO);
    return;
  }

  isAnswered = true;

  results.push({
    no: currentIndex + 1,
    word: `Herma L6-E1 / Q${q.qNumber}`,
    selected: `명사구: ${built || "무응답"} / 뜻: ${korUser || "무응답"}`,
    correct,
    question: `A. ${q.aRaw}\nB. ${q.bRaw}`,
    englishAnswer: englishAnswerRaw,
    koreanAnswer: koreanAnswerRaw,
  });

  const feedback = document.getElementById("feedback-area");
  if (feedback) feedback.innerHTML = "";
  if (window.HermaToastFX) window.HermaToastFX.show("ok", TOAST_OK);

  const submitBtn = document.getElementById("submit-btn");
  if (submitBtn) submitBtn.disabled = true;
}

function goNext(){
  clearStageAdvanceTimer();
  if (!isAnswered){
    const q = questions[currentIndex];
    const built = buildUserSubjectPhrase();
    const korUser = normalizeKorean(korSelectedTokens.map(x => x.text).join(" "));
    results.push({
      no: currentIndex + 1,
      word: `Herma L6-E1 / Q${q.qNumber}`,
      selected: `명사구: ${built || "무응답"} / 뜻: ${korUser || "무응답"}`,
      correct: false,
      question: `A. ${q.aRaw}\nB. ${q.bRaw}`,
      englishAnswer: englishAnswerRaw,
      koreanAnswer: koreanAnswerRaw,
    });
  }

  currentIndex++;
  if (currentIndex >= questions.length) return showResultPopup();
  renderQuestion();
}

function showResultPopup(){
  const total = results.length;
  const correctCount = results.filter(r => r.correct).length;
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
    testspecific: results
  };
  localStorage.setItem("QuizResults", JSON.stringify(resultObject));

  const popup = document.getElementById("result-popup");
  const content = document.getElementById("result-content");
  if (!popup || !content) return alert(`완료! 점수: ${score}점 (${correctCount}/${total})`);

  const rows = results.map(r => `
    <tr>
      <td style="padding:6px; border-bottom:1px solid #eee;">${r.no}</td>
      <td style="padding:6px; border-bottom:1px solid #eee;">${escapeHtml(r.word)}</td>
      <td style="padding:6px; border-bottom:1px solid #eee;">${escapeHtml(trimForTable(r.selected))}</td>
      <td style="padding:6px; border-bottom:1px solid #eee;">${r.correct ? "⭕" : "❌"}</td>
    </tr>
  `).join("");

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
            <th style="padding:6px; border-bottom:1px solid #ccc;">내 답</th>
            <th style="padding:6px; border-bottom:1px solid #ccc;">정답</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>

    <div class="btn-row">
      <button class="quiz-btn" onclick="window.location.reload()">🔁 재시험</button>
      <button class="quiz-btn" onclick="document.getElementById('result-popup').style.display='none'">닫기</button>
    </div>
  `;

  popup.style.display = "flex";
}

/* ================== 핵심: ** 하이라이트 처리 ================== */
function renderDoubleStarAsHighlight(sentence){
  const s = String(sentence || "");
  const segs = splitByDoubleStar(s);
  return segs.map(seg => {
    if (seg.hl) return `<span class="hl">${escapeHtml(seg.text)}</span>`;
    return escapeHtml(seg.text);
  }).join("");
}

function splitByDoubleStar(s){
  const out = [];
  let buf = "";
  let hl = false;
  for (let i=0; i<s.length; i++){
    const ch = s[i];
    const nx = s[i+1];
    if (ch === "*" && nx === "*"){
      if (buf) out.push({ text: buf, hl });
      buf = "";
      hl = !hl;
      i++;
      continue;
    }
    buf += ch;
  }
  if (buf) out.push({ text: buf, hl });
  return out;
}

/* ================== Build Source Tokens (A) with ** ================== */
function buildSourceTokensFromDoubleStarSentence(sentence){
  const segs = splitByDoubleStar(String(sentence || ""));
  const tokens = [];
  let idx = 0;

  segs.forEach(seg => {
    const parts = seg.text.match(/\s+|[^\s]+/g) || [];
    parts.forEach(p => {
      if (!p || /^\s+$/.test(p)) return;
      const clean = cleanWord(p);
      idx++;
      tokens.push({
        pos: idx-1,
        id: `src_${idx}_${Math.random().toString(16).slice(2,6)}`,
        display: p,
        clean,
        lower: clean.toLowerCase(),
        used: false,
        verb: !!seg.hl && !!clean,
      });
    });
  });

  return tokens;
}

/* ================== Build Slots Plan (Nominal) ================== */
function buildSlotsPlanForNominal(subjectPhrase, srcTokens){
  const srcSet = new Set(srcTokens.map(t => t.lower));
  const { words, optionalMask } = explodeAnswerToWords(subjectPhrase);

  const STOP = new Set(["the","a","an","that","which","who","whom","whose","was","were","is","are","am","be","been","being","by","of","in","on","at","with","for","to","from","and"]);
  let nounCandidate = "";
  for (let i=0; i<words.length; i++){
    if (optionalMask[i]) continue;
    const lw = words[i].toLowerCase();
    if (STOP.has(lw)) continue;
    if (lw.endsWith("'s") || lw.endsWith("’s")) continue;
    if (!srcSet.has(lw)) { nounCandidate = words[i]; break; }
  }
  const nounLower = nounCandidate ? nounCandidate.toLowerCase() : "";

  const slots = [];

    // ✅ 맨 앞 The 미리 깔기 (프리필만 하고, 원문 토큰은 소비하지 않는다)
    let startIdx = 0;
    if (words.length && !optionalMask[0] && words[0].toLowerCase() === "the") {
        slots.push({ kind:"fixed", text:"The", faded:false }); // prefillTakenBase 제거
        startIdx = 1;
    }


  for (let i=startIdx; i<words.length; i++){
    const w = words[i];
    const lw = w.toLowerCase();
    const opt = !!optionalMask[i];

    if (opt) {
      slots.push({ kind:"fixed", text:w, faded:true });
      continue;
    }

    if (/(?:'s|’s)$/i.test(w)) {
      const base = w.replace(/(?:'s|’s)$/i, "").toLowerCase();
      if (srcSet.has(base)) {
        slots.push({ kind:"fixed", text:w, faded:false, prefillTakenBase: base });
        continue;
      }
    }

    if (nounLower && lw === nounLower) {
      slots.push({
        kind:"slot",
        text:"",
        expectedLower: nounLower,
        fillRule: "verbNOUN",
        filled:false,
        fromTokenId:"",
        canNoun:false,
        nounText:w,
        nounApplied:false,
      });
      continue;
    }

    if (srcSet.has(lw)) {
      slots.push({
        kind:"slot",
        text:"",
        expectedLower: lw,
        fillRule: "exact",
        filled:false,
        fromTokenId:"",
        canNoun:false,
        nounText:"",
        nounApplied:false,
      });
      continue;
    }

    slots.push({ kind:"fixed", text:w, faded:false });
  }

  const taken = new Set(slots.filter(s => s.kind==="fixed" && s.prefillTakenBase).map(s => s.prefillTakenBase));
  srcTokens.forEach(t => { if (taken.has(t.lower)) t.used = true; });

  return { slots, nounLower, nounText: nounCandidate };
}

/* ================== Answer explode (parentheses) ================== */
function explodeAnswerToWords(answer){
  const s = stripTrailingPunct(String(answer || "").trim());
  const parts = [];
  let i = 0;
  let inParen = false;
  let buf = "";

  const pushBuf = () => {
    const txt = buf.trim();
    if (!txt) return;
    parts.push({ text: txt, optional: inParen });
  };

  while (i < s.length) {
    const ch = s[i];
    if (ch === "(") { pushBuf(); buf=""; inParen=true; i++; continue; }
    if (ch === ")") { pushBuf(); buf=""; inParen=false; i++; continue; }
    buf += ch; i++;
  }
  pushBuf();

  const words = [];
  const optionalMask = [];
  parts.forEach(seg => {
    seg.text.split(/\s+/).filter(Boolean).forEach(w => {
      words.push(cleanWord(w));
      optionalMask.push(!!seg.optional);
    });
  });

  return { words, optionalMask };
}

/* ================== Tokenize B plain ================== */
function tokenizePlain(sentence){
  const s = String(sentence || "");
  const parts = s.match(/\s+|[^\s]+/g) || [];
  const out = [];
  parts.forEach(p => {
    if (!p) return;
    if (/^\s+$/.test(p)) out.push({ isSpace:true, raw:p });
    else out.push({ isSpace:false, text:p, clean: normalizeWord(p) });
  });
  return out;
}

/* ================== Korean Utils ================== */
function tokenizeKorean(kor) {
  const s = String(kor || "").trim();
  if (!s) return [];
  return s.split(/\s+/).filter(Boolean);
}
function parseLaststageKRTokens(raw){
  const s = String(raw || "").trim();
  if (!s) return [];
  return s
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((token) => {
      const m = token.match(/^(a|ab|b|c)\s*::\s*(.+)$/i);
      if (m) return { text: m[2].trim(), seg: m[1].toLowerCase() };
      return { text: token, seg: "b" };
    });
}
function parseLaststageFinalSentence(raw){
  const s = stripTrailingPunct(String(raw || "").trim());
  if (!s) return [];
  return s
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((part) => {
      const m = part.match(/^(a|ab|b|c)\s*::\s*(.+)$/i);
      if (!m) return { text: part, seg: "a" };
      return { text: m[2].trim(), seg: m[1].toLowerCase() };
    });
}
function isSegA(seg){
  const s = String(seg || "").toLowerCase();
  return s === "a" || s === "ab";
}
function isSegB(seg){
  const s = String(seg || "").toLowerCase();
  return s === "b" || s === "c";
}
function applyKorSegUnderline(el, seg){
  if (!el) return;
  if (isSegA(seg)) {
    el.style.textDecorationLine = "underline";
    el.style.textDecorationThickness = "2px";
    el.style.textUnderlineOffset = "3px";
    el.style.textDecorationColor = "rgba(241,123,42,0.90)";
    return;
  }
  if (isSegB(seg)) {
    el.style.textDecorationLine = "underline";
    el.style.textDecorationThickness = "2px";
    el.style.textUnderlineOffset = "3px";
    el.style.textDecorationColor = "rgba(70,140,255,0.92)";
  }
}
function stripKoreanTailPunct(w){
  return String(w || "").replace(/[.。!?,"'”’)\]]+$/g, "");
}
function groupTailKoreanTokens(arr){
  const a = (arr || []).filter(Boolean);
  if (!a.length) return [];
  if (a.length <= 2) return [a.join(" ")];
  if (a.length === 3) return [a.slice(0, 2).join(" "), a[2]];
  if (a.length === 4) return [a.slice(0, 2).join(" "), a.slice(2).join(" ")];
  return [
    a.slice(0, 2).join(" "),
    a.slice(2, 4).join(" "),
    a.slice(4).join(" ")
  ].filter(Boolean);
}
function buildLargeKoreanTokenObjectsByAB(kor){
  const toks = tokenizeKorean(kor);
  if (!toks.length) return [];
  let splitIdx = -1;
  for (let i = 0; i < toks.length; i++) {
    const core = stripKoreanTailPunct(toks[i]);
    if (/(은|는|이|가)$/.test(core)) { splitIdx = i; break; }
  }
  if (splitIdx < 0) {
    const grouped = groupTailKoreanTokens(toks);
    return grouped.map((t) => ({ text: t, seg: "b" }));
  }
  const out = [];
  out.push({ text: toks.slice(0, splitIdx + 1).join(" "), seg: "a" });
  out.push(...groupTailKoreanTokens(toks.slice(splitIdx + 1)).map((t) => ({ text: t, seg: "b" })));
  return out.filter((o) => !!(o && o.text));
}
function normalizeKorean(s) {
  return String(s || "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.。!?]+$/g, "")
    .trim();
}

/* ================== Misc Utils ================== */
function normalizeEnglish(s){
  return String(s || "")
    .replace(/[‘’]/g, "'")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.。!?]+$/g, "")
    .trim()
    .toLowerCase();
}
function normalizeWord(w){
  return String(w || "")
    .replace(/[‘’]/g, "'")
    .replace(/^[“"']+|[”"']+$/g, "")
    .replace(/[,:;]+$/g, "")
    .replace(/[.?!]+$/g, "")
    .trim()
    .toLowerCase();
}
function stripTrailingPunct(s) {
  return String(s || "").trim().replace(/[.。!?]+$/g, "").trim();
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
function cleanWord(w){
  return String(w || "")
    .replace(/^[“"']+|[”"']+$/g, "")
    .replace(/[,:;]+$/g, "")
    .replace(/[.?!]+$/g, "")
    .trim();
}

function renderFinalSentenceWithNounHighlight(sentence){
  const targetLower = String(nounCandidateLower || "").toLowerCase();
  if (!targetLower) return escapeHtml(sentence);

  const toks = tokenizePlain(sentence);
  let done = false;

  return toks.map(t => {
    if (t.isSpace) return escapeHtml(t.raw);
    const w = normalizeWord(t.text); // 또는 t.clean 써도 됨
    if (!done && w === targetLower){
      done = true;
      return `<span class="hl">${escapeHtml(t.text)}</span>`;
    }
    return escapeHtml(t.text);
  }).join("");
}

function buildReducedBDisplayFromRaw(){
  const toks = tokenizePlain(bRaw);
  const kept = [];
  let removedIt = false;
  toks.forEach((t) => {
    if (t.isSpace) {
      if (kept.length && !kept[kept.length - 1].isSpace) kept.push({ isSpace:true, raw:" " });
      return;
    }
    if (!removedIt && t.clean === "it") {
      removedIt = true;
      return;
    }
    kept.push(t);
  });
  while (kept.length && kept[0].isSpace) kept.shift();
  while (kept.length && kept[kept.length - 1].isSpace) kept.pop();
  return kept.map((t) => (t.isSpace ? " " : t.text)).join("").replace(/\s+/g, " ").trim();
}

function renderFinalABSegmentUnderlinedHtml(){
  if (laststageFinalSentenceRaw) {
    const parts = parseLaststageFinalSentence(laststageFinalSentenceRaw);
    if (parts.length) {
      return parts.map((part) => {
        const cls = isSegB(part.seg) ? "tone-b" : "tone-a";
        return `<span class="${cls}">${renderFinalSentenceWithNounHighlight(part.text)}</span>`;
      }).join(" ");
    }
  }
  const aPart = buildUserSubjectPhraseDisplay() || subjectPhraseRaw;
  const bPart = buildReducedBDisplayFromRaw();
  if (!bPart) return `<span class="tone-a">${renderFinalSentenceWithNounHighlight(aPart)}</span>`;
  return `<span class="tone-a">${renderFinalSentenceWithNounHighlight(aPart)}</span> <span class="tone-b">${escapeHtml(bPart)}</span>`;
}
