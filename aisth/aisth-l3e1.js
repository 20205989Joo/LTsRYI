// aisth-l3e1.js
// Independent runtime for Aisth Lesson 3 Exercise 1

const TARGET_LESSON = 3;
const TARGET_EXERCISE = 1;
const PAGE_LABEL = "Aisth L3-E1";
const MAX_QUESTIONS = 0; // 0 = unlimited

const L31_DIRECT_QUESTION_ROWS = [
  { subject: "you", verb: "like", baseVerb: "like", auxiliary: "do", rest: "animals", pullMode: "split", translation: "동물을 좋아해요.", questionTranslation: "동물을 좋아하나요?" },
  { subject: "she", verb: "plays", baseVerb: "play", auxiliary: "does", rest: "the piano", pullMode: "split", translation: "그녀는 피아노를 연주해요.", questionTranslation: "그녀는 피아노를 연주하나요?" },
  { subject: "they", verb: "visit", baseVerb: "visit", auxiliary: "do", rest: "the museum", pullMode: "split", translation: "그들은 박물관을 방문해요.", questionTranslation: "그들은 박물관을 방문하나요?" },
  { subject: "he", verb: "likes", baseVerb: "like", auxiliary: "does", rest: "pizza", pullMode: "split", translation: "그는 피자를 좋아해요.", questionTranslation: "그는 피자를 좋아하나요?" },
  { subject: "we", verb: "need", baseVerb: "need", auxiliary: "do", rest: "more time", pullMode: "split", translation: "우리는 시간이 더 필요해요.", questionTranslation: "우리는 시간이 더 필요한가요?" },
  { subject: "Tom", verb: "watches", baseVerb: "watch", auxiliary: "does", rest: "TV after dinner", pullMode: "split", translation: "톰은 저녁 식사 후에 TV를 봐요.", questionTranslation: "톰은 저녁 식사 후에 TV를 보나요?" },
  { subject: "she", verb: "is", baseVerb: "", auxiliary: "is", rest: "at home now", pullMode: "lift", translation: "그녀는 지금 집에 있어요.", questionTranslation: "그녀는 지금 집에 있나요?" },
  { subject: "they", verb: "are", baseVerb: "", auxiliary: "are", rest: "ready", pullMode: "lift", translation: "그들은 준비됐어요.", questionTranslation: "그들은 준비됐나요?" },
  { subject: "he", verb: "can", baseVerb: "", auxiliary: "can", rest: "swim well", pullMode: "lift", translation: "그는 수영을 잘할 수 있어요.", questionTranslation: "그는 수영을 잘할 수 있나요?" },
  { subject: "we", verb: "will", baseVerb: "", auxiliary: "will", rest: "meet tomorrow", pullMode: "lift", translation: "우리는 내일 만날 거예요.", questionTranslation: "우리는 내일 만날 건가요?" },
  { subject: "you", verb: "must", baseVerb: "", auxiliary: "must", rest: "leave now", pullMode: "lift", translation: "당신은 지금 떠나야 해요.", questionTranslation: "당신은 지금 떠나야 하나요?" },
  { subject: "she", verb: "should", baseVerb: "", auxiliary: "should", rest: "get some rest", pullMode: "lift", translation: "그녀는 좀 쉬어야 해요.", questionTranslation: "그녀는 좀 쉬어야 하나요?" },
  { subject: "I", verb: "am", baseVerb: "", auxiliary: "am", rest: "late", pullMode: "lift", translation: "나는 늦었어요.", questionTranslation: "내가 늦었나요?" },
  { subject: "the dog", verb: "runs", baseVerb: "run", auxiliary: "does", rest: "very fast", pullMode: "split", translation: "그 개는 아주 빨리 달려요.", questionTranslation: "그 개는 아주 빨리 달리나요?" },
  { subject: "your sister", verb: "speaks", baseVerb: "speak", auxiliary: "does", rest: "Chinese", pullMode: "split", translation: "당신의 자매는 중국어를 해요.", questionTranslation: "당신의 자매는 중국어를 하나요?" },
  { subject: "they", verb: "played", baseVerb: "play", auxiliary: "did", rest: "soccer yesterday", pullMode: "split", translation: "그들은 어제 축구를 했어요.", questionTranslation: "그들은 어제 축구를 했나요?" },
];

const DEFAULT_REWRITE_INSTRUCTION = "영어스러운 표현을 자연스럽게 바꿔보세요.";
const DEFAULT_BLANK_INSTRUCTION = "빈칸에 알맞은 단어를 넣어보세요.";

const TEXT = {
  START: "🚀 시작",
  INTRO_1: "Herma 스타일 규칙을 따르는 독립형 Aisth 퀴즈입니다.",
  INTRO_2: "제출하면 채점되고, 다음 문제로 이동할 수 있습니다.",
  PIN: "📌",
  NO_QUESTIONS: "해당 Lesson/Exercise의 문제가 없습니다.",
  INPUT_REQUIRED: "입력 후 제출하세요.",
  CORRECT: "정답!",
  WRONG: "오답",
  QTYPE_BLANK: "빈칸형",
  QTYPE_REWRITE: "서술형",
  INPUT_HINT_FALLBACK: "정답을 입력하세요.",
  PLACE_BLANK_PREFIX: "정답 입력 (ex. ",
  PLACE_REWRITE_1: "자연스럽게 고쳐 쓰세요.",
  PLACE_EX_PREFIX: "(ex. ",
  RESULT_TITLE: "결과 요약",
  SCORE: "점수",
  CORRECT_COUNT: "정답",
  MY_ANSWER: "내 답",
  ANSWER: "정답",
  RETRY: "다시하기",
  CLOSE: "닫기",
  UNANSWERED: "(미응답)",
};

let subcategory = "Grammar";
let level = "aisth";
let day = "008";
let quizTitle = "quiz_Grammar_aisth_l3e1";
let userId = "";

let rawRows = [];
let questions = [];
let currentIndex = 0;
let results = [];
let isCurrentLocked = false;
let rewritePlaceholderExample = "";
let blankPlaceholderExample = "";
let interactionStage = 0;
let autoNextTimer = 0;

window.addEventListener("DOMContentLoaded", async () => {
  injectRuntimeStyles();

  if (window.HermaToastFX) {
    window.HermaToastFX.init({ hostId: "cafe_int", top: 10 });
  }

  applyQueryParams();
  wireBackButton();
  wirePopupEvents();
  installFrameQuestionNavigator();

  try {
    rawRows = loadLocalQuestionRows();
  } catch (err) {
    console.error(err);
    alert("문제 데이터 파일을 불러오지 못했습니다.\naisth-local-question-data.js");
    return;
  }

  buildQuestionsFromRows();
  publishFrameDebugList();
  renderIntro();
});

function injectRuntimeStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .quiz-btn {
      display: inline-block;
      margin-top: 12px;
      padding: 8px 16px;
      font-size: 14px;
      background: #f17b2a;
      color: #fff;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 900;
    }

    .quiz-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pill {
      display: inline-block;
      font-size: 12px;
      background: #fff3e0;
      border: 1px solid #e9c7a7;
      color: #7e3106;
      padding: 4px 8px;
      border-radius: 999px;
      margin-right: 6px;
      margin-bottom: 6px;
    }

    .box {
      background: #fff3e0;
      border: 1px solid #e9c7a7;
      border-radius: 12px;
      padding: 12px;
      margin-bottom: 12px;
    }

    .q-label {
      font-weight: 900;
      font-size: 16px;
      margin-bottom: 10px;
      color: #7e3106;
    }

    .sentence {
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 12px;
      padding: 12px;
      margin-top: 8px;
      line-height: 1.65;
      font-size: 14px;
      word-break: keep-all;
      white-space: pre-wrap;
    }

    .blank-slot {
      display: inline-block;
      padding: 1px 6px;
      border-radius: 7px;
      border: 1px dashed #d5a22a;
      background: #fff8e4;
      color: #7e3106;
      font-weight: 900;
      margin: 0 2px;
    }

    .focus-token {
      background: rgba(255, 208, 90, 0.45);
      border-radius: 6px;
      padding: 0 3px;
      box-shadow: inset 0 0 0 1px rgba(160, 110, 0, 0.18);
      color: #7e3106;
      font-weight: 900;
    }
    textarea,
    .short-input {
      width: 100%;
      border: 1px solid #ddd;
      border-radius: 10px;
      padding: 10px;
      font-size: 13px;
      box-sizing: border-box;
      outline: none;
      background: #fff;
    }

    textarea { resize: vertical; }

    .short-input {
      font-size: 18px;
      font-weight: 900;
      text-align: center;
      letter-spacing: 0.3px;
    }
    input::placeholder,
    textarea::placeholder {
      color: #b9b2aa;
      opacity: 1;
    }


    .btn-row {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }

    .btn-row .quiz-btn {
      flex: 1;
      margin-top: 0;
    }

    .feedback {
      margin-top: 8px;
      font-weight: 900;
      font-size: 13px;
      line-height: 1.6;
    }

    .l31-workspace {
      padding: 18px 14px 20px;
      overflow: visible;
      background: #fff;
    }

    .l31-stage-guide {
      min-height: 46px;
      color: #6f3b18;
      font-size: 14px;
      font-weight: 900;
      line-height: 1.55;
      text-align: center;
    }

    .l31-stage-number {
      display: inline-flex;
      align-items: center;
      padding: 3px 8px;
      margin-right: 5px;
      border-radius: 999px;
      background: #f17b2a;
      color: #fff;
      font-size: 11px;
      letter-spacing: .02em;
      vertical-align: 1px;
    }

    .l31-board {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 170px;
      margin-top: 10px;
      padding: 58px 12px 24px;
      border: 1px solid #ecd8c1;
      border-radius: 18px;
      background: #fff;
      box-shadow: 0 8px 20px rgba(103,63,22,.08);
      overflow: visible;
    }

    .l31-sentence-line {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      max-width: 100%;
      color: #34261d;
      font-size: clamp(16px, 3.9vw, 20px);
      font-weight: 850;
      line-height: 1.4;
    }

    .l31-sentence-stage {
      display: inline-flex;
      align-items: center;
      max-width: 100%;
    }

    .l31-sentence-core {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      min-width: 0;
      max-width: 100%;
      flex-wrap: wrap;
    }

    .l31-punctuation {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 10px;
      flex: 0 0 10px;
    }

    .l31-token {
      min-height: 36px;
      box-sizing: border-box;
      border-radius: 11px;
    }

    .l31-token {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 4px 7px;
    }

    .l31-verb-token {
      appearance: none;
      border: 1px solid #e4ad76;
      background: #fff4e6;
      color: #74380c;
      font: inherit;
      box-shadow: 0 3px 0 #d6a16d, 0 6px 12px rgba(111,59,24,.12);
      transition: transform .14s ease, box-shadow .14s ease, background .14s ease;
    }

    .l31-suffix-token {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-left: 1px;
      padding: 0 3px;
      border-radius: 7px;
      background: rgba(138,89,218,.18);
      color: #6c3ac7;
      box-shadow: inset 0 0 0 1px rgba(122,70,214,.24);
      font-weight: 950;
    }

    button.l31-verb-token { cursor: pointer; }

    button.l31-verb-token:hover,
    button.l31-verb-token:focus-visible {
      transform: none;
      background: #fff9f0;
      box-shadow: 0 5px 0 #d6a16d, 0 9px 16px rgba(111,59,24,.14);
      outline: 3px solid rgba(241,123,42,.18);
      outline-offset: 2px;
    }

    .l31-source-stack {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 0;
      min-height: 36px;
      padding: 0;
    }

    .l31-source-gap {
      color: transparent;
      border-color: transparent;
      background: transparent;
      box-shadow: none;
      pointer-events: none;
      user-select: none;
    }

    .l31-aux-chip {
      position: absolute;
      bottom: calc(100% + 9px);
      left: 50%;
      z-index: 4;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 32px;
      padding: 4px 7px;
      border: 1px solid #df9b54;
      border-radius: 13px 13px 11px 11px;
      background: linear-gradient(180deg, #fff8df, #ffd889);
      color: #6e350c;
      font: inherit;
      font-size: 13px;
      font-weight: 950;
      line-height: 1.1;
      box-shadow: 0 3px 0 #d9a558, 0 7px 13px rgba(105,60,18,.16);
      white-space: nowrap;
      cursor: grab;
      animation: l31AuxFragmentPop .54s cubic-bezier(.18,1.52,.36,1) both;
      touch-action: none;
    }

    .l31-aux-chip::after {
      content: "";
      position: absolute;
      bottom: -7px;
      left: 50%;
      width: 7px;
      height: 10px;
      border-radius: 40% 40% 55% 55%;
      background: #ffd889;
      box-shadow: 0 1px 0 #d9a558;
      transform: translateX(-50%);
    }

    .l31-aux-chip.is-do-fragment {
      left: calc(50% - 20px);
    }

    .l31-aux-chip.is-es-fragment {
      left: calc(50% + 20px);
      border-color: #6c3ac7;
      background: rgba(136,84,208,.16);
      color: #6c3ac7;
      box-shadow: 0 3px 0 rgba(108,58,199,.56), 0 0 12px rgba(136,84,208,.24);
    }

    .l31-aux-chip.is-es-fragment::after {
      background: rgba(136,84,208,.30);
      box-shadow: 0 1px 0 rgba(108,58,199,.56);
    }

    .l31-aux-chip.is-waiting {
      opacity: .52;
      cursor: not-allowed;
      filter: saturate(.65);
    }

    .l31-aux-chip:active { cursor: grabbing; }

    .l31-aux-chip.is-coaching {
      animation: l31AuxDragCoach 1.25s cubic-bezier(.45,.02,.25,1) both;
    }

    .l31-aux-chip.is-coach-stopped {
      animation: none;
      transform: translateX(-50%);
    }

    .l31-aux-chip.is-touch-dragging {
      position: fixed;
      z-index: 9999;
      bottom: auto;
      margin: 0;
      pointer-events: none;
      animation: none;
    }

    .l31-base-token {
      cursor: default;
    }

    .l31-front-slot {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 32px;
      min-height: 28px;
      box-sizing: border-box;
      padding: 3px 7px;
      border: 1px solid rgba(224,139,61,.42);
      border-radius: 10px;
      background: rgba(255,245,231,.72);
      color: rgba(165,92,29,.48);
      font-size: 13px;
      font-weight: 900;
      flex: 0 0 auto;
      transition: transform .16s ease, background .16s ease, box-shadow .16s ease, color .16s ease;
      animation: l31GhostBreathe 1.7s ease-in-out infinite;
    }

    .l31-front-slot.is-reserved {
      visibility: hidden;
      animation: none;
      pointer-events: none;
    }

    .l31-front-slot.is-over {
      transform: scale(1.07);
      background: #ffe4b6;
      color: #8b4514;
      box-shadow: 0 0 0 5px rgba(241,123,42,.14);
    }

    .l31-front-slot.is-filled {
      border-style: solid;
      border-color: #df9b54;
      background: linear-gradient(180deg, #fff8df, #ffd889);
      color: #6e350c;
      font-size: inherit;
      box-shadow: 0 4px 0 #d9a558;
      transform: none;
      animation: l31SlotLand .35s cubic-bezier(.2,1.4,.4,1) both;
    }

    .l31-front-composite {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      flex: 0 0 auto;
    }

    .l31-front-slot.l31-front-suffix {
      min-width: 28px;
      border-color: rgba(108,58,199,.46);
      background: rgba(136,84,208,.12);
      color: rgba(108,58,199,.62);
      box-shadow: inset 0 0 0 1px rgba(136,84,208,.08);
    }

    .l31-front-slot.l31-front-suffix.is-over {
      border-color: #6c3ac7;
      background: rgba(136,84,208,.24);
      color: #6c3ac7;
      box-shadow: 0 0 0 5px rgba(136,84,208,.14);
    }

    .l31-front-slot.l31-front-suffix.is-filled {
      border-color: #6c3ac7;
      background: rgba(136,84,208,.16);
      color: #6c3ac7;
      box-shadow: 0 4px 0 rgba(108,58,199,.56), 0 0 10px rgba(136,84,208,.24);
    }

    .l31-translation-line {
      position: relative;
      width: 100%;
      min-height: 23px;
      margin-top: 14px;
      color: #75685e;
      font-size: 12.5px;
      font-weight: 750;
      line-height: 1.55;
      text-align: center;
      overflow: hidden;
    }

    .l31-translation-old,
    .l31-translation-new {
      display: block;
      width: 100%;
    }

    .l31-translation-line.is-changing .l31-translation-old {
      animation: l31TranslationWipeOut .28s ease-in both;
    }

    .l31-translation-line.is-changing .l31-translation-new {
      position: absolute;
      inset: 0;
      animation: l31TranslationWipeIn .36s .3s ease-out both;
    }

    @keyframes l31AuxFragmentPop {
      0% { opacity: 0; transform: translate(-50%, 25px) scale(.18,.58) rotate(7deg); }
      44% { opacity: 1; transform: translate(-50%, -8px) scale(.72,1.22) rotate(-4deg); }
      72% { transform: translate(-50%, 3px) scale(1.1,.9) rotate(2deg); }
      100% { opacity: 1; transform: translate(-50%, 0) scale(1) rotate(0); }
    }

    @keyframes l31GhostBreathe {
      0%, 100% { opacity: .55; }
      50% { opacity: .9; }
    }

    @keyframes l31AuxDragCoach {
      0%, 16%, 100% { transform: translate(-50%, 0) scale(1); }
      52%, 68% {
        transform: translate(calc(-50% + var(--l31-coach-x, 0px)), var(--l31-coach-y, 0px)) scale(.94);
      }
    }

    @keyframes l31TranslationWipeOut {
      from { opacity: 1; clip-path: inset(0 0 0 0); }
      to { opacity: 0; clip-path: inset(0 0 0 100%); }
    }

    @keyframes l31TranslationWipeIn {
      from { opacity: 0; clip-path: inset(0 100% 0 0); }
      to { opacity: 1; clip-path: inset(0 0 0 0); }
    }

    @keyframes l31SlotLand {
      from { transform: translateY(-16px) scale(1.08); opacity: .35; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }

    @media (max-width: 480px) {
      .l31-board { padding: 56px 8px 22px; }
      .l31-sentence-core { gap: 5px; }
      .l31-front-slot { min-width: 30px; padding: 3px 6px; font-size: 12px; }
      .l31-aux-chip { min-width: 30px; padding: 4px 6px; font-size: 12px; }
    }

    .ok { color: #2e7d32; }
    .bad { color: #c62828; }

    .result-item {
      background: #fffaf4;
      border: 1px solid #f0d9bf;
      border-radius: 10px;
      padding: 10px;
      margin-top: 8px;
      font-size: 12px;
      line-height: 1.5;
    }

    .result-ok { color: #2e7d32; font-weight: 900; }
    .result-bad { color: #c62828; font-weight: 900; }
  `;
  document.head.appendChild(style);
}

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
  }
}

function wireBackButton() {
  const backBtn = document.getElementById("back-btn");
  if (!backBtn) return;
  backBtn.addEventListener("click", () => history.back());
}

function wirePopupEvents() {
  const popup = document.getElementById("result-popup");
  if (!popup) return;
  popup.addEventListener("click", (ev) => {
    if (ev.target === popup) closePopup();
  });
}

function loadLocalQuestionRows() {
  return L31_DIRECT_QUESTION_ROWS.map((row) => ({ ...row }));
}

function publishFrameDebugList() {
  if (!window.AisthLocalQuestionData || typeof window.AisthLocalQuestionData.publishDebugList !== "function") return;
  window.AisthLocalQuestionData.publishDebugList(questions, {
    label: PAGE_LABEL,
    source: "direct-js",
    title: "aisth-l3e1.js",
  });
}

function installFrameQuestionNavigator() {
  if (!window.AisthLocalQuestionData || typeof window.AisthLocalQuestionData.installNavigator !== "function") return;
  window.AisthLocalQuestionData.installNavigator({
    getLength: () => questions.length,
    goTo: (nextIndex) => {
      if (typeof autoNextTimer !== "undefined" && autoNextTimer) {
        window.clearTimeout(autoNextTimer);
        autoNextTimer = 0;
      }
      if (typeof hintTimerId !== "undefined" && hintTimerId) {
        window.clearTimeout(hintTimerId);
        hintTimerId = 0;
      }
      isCurrentLocked = false;
      currentIndex = nextIndex;
      renderQuestion();
    },
  });
}

function buildQuestionsFromRows() {
  const source = MAX_QUESTIONS > 0 ? rawRows.slice(0, MAX_QUESTIONS) : rawRows;
  questions = source.map((row, idx) => {
    const statement = `${capitalizeSentenceStart(row.subject)} ${row.verb} ${row.rest}.`;
    const remainingVerb = row.baseVerb ? `${row.baseVerb} ` : "";
    const question = `${capitalizeSentenceStart(row.auxiliary)} ${questionSubject(row.subject)} ${remainingVerb}${row.rest}?`;

    return {
      ...row,
      no: idx + 1,
      qNumber: idx + 1,
      question: statement,
      answer: question,
      instruction: "평서문을 의문문으로 바꿔봅시다.",
      title: "의문문 만들기",
      type: "transform",
    };
  });
}

function deriveInstructionModeByType(rows) {
  const bucket = { rewrite: new Map(), blank: new Map() };

  rows.forEach((row) => {
    const question = normalizeEscapedBreaks(String(row["Question"] ?? "").trim());
    const answer = stripEmphasisMarkers(normalizeEscapedBreaks(String(row["Answer"] ?? "").trim()));
    const instruction = normalizeEscapedBreaks(String(row["Instruction"] ?? "").trim());
    const type = detectType(question);

    if (!instruction) return;
    if (isInstructionLeakingAnswer(instruction, answer, type)) return;

    const m = bucket[type];
    m.set(instruction, (m.get(instruction) || 0) + 1);
  });

  return {
    rewrite: pickTopKey(bucket.rewrite),
    blank: pickTopKey(bucket.blank),
  };
}

function pickTopKey(mapObj) {
  let topKey = "";
  let topCount = -1;
  for (const [k, c] of mapObj.entries()) {
    if (c > topCount) {
      topKey = k;
      topCount = c;
    }
  }
  return topKey;
}

function detectType(question) {
  return String(question || "").includes("___") ? "blank" : "rewrite";
}

function renderIntro() {
  const area = document.getElementById("quiz-area");
  if (!area) return;

  if (window.AisthIntroFronts && typeof window.AisthIntroFronts.render === "function") {
    try {
      if (window.AisthIntroFronts.render(area, {
        pageLabel: PAGE_LABEL,
        lesson: TARGET_LESSON,
        exercise: TARGET_EXERCISE,
        questions,
        startLabel: TEXT.START,
        onStart: startQuiz,
      })) {
        return;
      }
    } catch (err) {
      console.error("AisthIntroFronts render failed:", err);
    }
  }

  const total = questions.length;
  const title = questions[0]?.title || PAGE_LABEL;
  const firstInst = stripEmphasisMarkers(questions[0]?.instruction || TEXT.INPUT_HINT_FALLBACK);

  area.innerHTML = `
    <div class="box">
      <div style="font-size:18px; font-weight:900; color:#7e3106; margin-bottom:10px;">🧩 ${escapeHtml(PAGE_LABEL)}</div>

      <div style="margin-bottom:10px;">
        <span class="pill">Lesson ${TARGET_LESSON}</span>
        <span class="pill">Exercise ${TARGET_EXERCISE}</span>
        <span class="pill">총 ${total}문제</span>
        <span class="pill">Day ${escapeHtml(day)}</span>
      </div>

      <div style="font-weight:900; margin-bottom:6px; color:#444;">${escapeHtml(title)}</div>
      <div style="font-size:13px; line-height:1.6; color:#333;">
        ${escapeHtml(TEXT.INTRO_1)}<br/>
        ${escapeHtml(TEXT.INTRO_2)}
      </div>

      <div style="margin-top:10px; font-size:13px; color:#7e3106;">${TEXT.PIN} ${escapeHtml(firstInst)}</div>
      <button class="quiz-btn" id="start-btn" style="width:100%; margin-top:12px;">${escapeHtml(TEXT.START)}</button>
    </div>
  `;

  const startBtn = document.getElementById("start-btn");
  if (startBtn) startBtn.addEventListener("click", startQuiz);
}

function startQuiz() {
  if (!questions.length) {
    alert(TEXT.NO_QUESTIONS);
    return;
  }

  currentIndex = 0;
  results = [];
  renderQuestion();
}

function renderQuestion(resetStage = true) {
  const area = document.getElementById("quiz-area");
  if (!area) return;

  const q = questions[currentIndex];
  if (!q) {
    showResultPopup();
    return;
  }

  if (resetStage) {
    isCurrentLocked = false;
    interactionStage = 0;
  }

  const isComplete = isTransformationComplete(q);

  area.innerHTML = `
    <div class="q-label">Q. ${currentIndex + 1} / ${questions.length}</div>
    <div class="box l31-workspace">
      <div class="l31-stage-guide">${buildStageGuide(q)}</div>
      <div class="l31-board" aria-live="polite">
        ${buildTransformationSentence(q)}
        ${buildTranslationLine(q)}
      </div>
    </div>
    ${isComplete ? '<div class="btn-row"><button class="quiz-btn" id="l31-next-btn" type="button">다음</button></div>' : ""}
  `;

  if (interactionStage === 0) {
    const pullTarget = document.getElementById("l31-pull-target");
    if (pullTarget) {
      pullTarget.addEventListener("click", revealAuxiliary);
      pullTarget.focus();
    }
  } else if (!isComplete) {
    wireAuxiliaryDrag(q);
  } else {
    const nextBtn = document.getElementById("l31-next-btn");
    if (nextBtn) nextBtn.addEventListener("click", goNext);
  }
}

function buildTranslationLine(q) {
  const statementText = escapeHtml(q?.translation || "");
  if (!isTransformationComplete(q)) {
    return `<div class="l31-translation-line"><span>${statementText}</span></div>`;
  }
  return `
    <div class="l31-translation-line is-changing">
      <span class="l31-translation-old">${statementText}</span>
      <span class="l31-translation-new">${escapeHtml(q?.questionTranslation || q?.translation || "")}</span>
    </div>
  `;
}

function buildStageGuide(q) {
  if (interactionStage === 0) {
    return '<span class="l31-stage-number">1단계</span> 의문문으로 만들어봅시다 · 앞으로 뽑을 성분을 클릭해봅시다.';
  }
  if (interactionStage === 1) {
    if (usesSplitDoes(q)) {
      return '<span class="l31-stage-number">2단계</span> 먼저 <b>do</b>를 문장 맨 앞으로 드래그해봅시다.';
    }
    return `<span class="l31-stage-number">2단계</span> 위로 나온 <b>${escapeHtml(q.auxiliary)}</b>를 문장 맨 앞으로 드래그해봅시다.`;
  }
  if (usesSplitDoes(q) && interactionStage === 2) {
    return '<span class="l31-stage-number">3단계</span> 이제 <b>es</b>를 do 뒤에 붙여봅시다.';
  }
  return '<span class="l31-stage-number">완성</span> 조동사가 앞으로 오면 의문문이 됩니다.';
}

function usesSplitDoes(q) {
  return String(q?.auxiliary || "").toLowerCase() === "does";
}

function isTransformationComplete(q) {
  return usesSplitDoes(q) ? interactionStage === 3 : interactionStage === 2;
}

function buildTransformationSentence(q) {
  const initialSubject = escapeHtml(capitalizeSentenceStart(q.subject));
  const movedSubject = escapeHtml(questionSubject(q.subject));
  const verb = renderL31VerbWithSuffix(q);
  const baseVerb = escapeHtml(q.baseVerb);
  const rest = escapeHtml(q.rest);
  const auxiliary = escapeHtml(q.auxiliary);
  const splitDoes = usesSplitDoes(q);

  if (interactionStage === 0) {
    return `
      <div class="l31-sentence-line">
        <div class="l31-sentence-stage">
          <div class="l31-sentence-core">
            <span class="l31-front-slot is-reserved" aria-hidden="true">${escapeHtml(capitalizeSentenceStart(q.auxiliary))}</span>
            <span class="l31-token l31-subject-token">${initialSubject}</span>
            <button class="l31-token l31-verb-token" id="l31-pull-target" type="button" aria-label="${escapeHtmlAttr(q.verb)} 성분 뽑기">${verb}</button>
            <span class="l31-token l31-rest-token">${rest}<span class="l31-punctuation">.</span></span>
          </div>
        </div>
      </div>
    `;
  }

  if (interactionStage === 1) {
    const sourceVerbHtml = baseVerb
      ? `<span class="l31-token l31-verb-token">${baseVerb}</span>`
      : `<span class="l31-token l31-verb-token l31-source-gap" aria-label="옮겨진 동사의 빈 자리">${verb}</span>`;
    const fragmentChips = splitDoes
      ? `
              <button class="l31-aux-chip is-do-fragment" id="l31-aux-chip" type="button" draggable="true" aria-label="do, 문장 첫 자리로 드래그">do</button>
              <button class="l31-aux-chip is-es-fragment is-waiting" type="button" disabled aria-label="do를 먼저 옮긴 뒤 사용할 es">es</button>
            `
      : `<button class="l31-aux-chip" id="l31-aux-chip" type="button" draggable="true" aria-label="${auxiliary}, 문장 첫 자리로 드래그">${auxiliary}</button>`;
    return `
      <div class="l31-sentence-line">
        <div class="l31-sentence-stage">
          <div class="l31-sentence-core">
            <span class="l31-front-slot" id="l31-front-slot" role="button" tabindex="0" aria-label="조동사를 놓을 문장 첫 자리">${escapeHtml(capitalizeSentenceStart(splitDoes ? "do" : q.auxiliary))}</span>
            <span class="l31-token l31-subject-token">${initialSubject}</span>
            <span class="l31-source-stack">
              ${sourceVerbHtml}
              ${fragmentChips}
            </span>
            <span class="l31-token l31-rest-token">${rest}<span class="l31-punctuation">.</span></span>
          </div>
        </div>
      </div>
    `;
  }

  if (splitDoes && interactionStage === 2) {
    return `
      <div class="l31-sentence-line">
        <div class="l31-sentence-stage">
          <div class="l31-sentence-core">
            <span class="l31-front-composite">
              <span class="l31-front-slot is-filled">Do</span>
              <span class="l31-front-slot l31-front-suffix" id="l31-suffix-slot" role="button" tabindex="0" aria-label="es를 놓을 자리">es</span>
            </span>
            <span class="l31-token l31-subject-token">${movedSubject}</span>
            <span class="l31-source-stack">
              <span class="l31-token l31-verb-token l31-base-token">${baseVerb}</span>
              <button class="l31-aux-chip is-es-fragment" id="l31-aux-chip" type="button" draggable="true" aria-label="es, do 뒤로 드래그">es</button>
            </span>
            <span class="l31-token l31-rest-token">${rest}<span class="l31-punctuation">.</span></span>
          </div>
        </div>
      </div>
    `;
  }

  const completedAuxiliary = splitDoes
    ? '<span class="l31-front-composite"><span class="l31-front-slot is-filled">Do</span><span class="l31-front-slot l31-front-suffix is-filled">es</span></span>'
    : `<span class="l31-front-slot is-filled">${escapeHtml(capitalizeSentenceStart(q.auxiliary))}</span>`;

  return `
    <div class="l31-sentence-line">
      <div class="l31-sentence-stage">
        <div class="l31-sentence-core">
          ${completedAuxiliary}
          <span class="l31-token l31-subject-token">${movedSubject}</span>
          ${baseVerb ? `<span class="l31-token l31-verb-token l31-base-token">${baseVerb}</span>` : `<span class="l31-token l31-verb-token l31-source-gap" aria-hidden="true">${verb}</span>`}
          <span class="l31-token l31-rest-token">${rest}<span class="l31-punctuation">?</span></span>
        </div>
      </div>
    </div>
  `;
}

function renderL31VerbWithSuffix(q) {
  const verb = String(q?.verb || "");
  const baseVerb = String(q?.baseVerb || "");
  if (!baseVerb || !verb.toLowerCase().startsWith(baseVerb.toLowerCase())) {
    return escapeHtml(verb);
  }

  const suffix = verb.slice(baseVerb.length);
  if (!/^(?:s|es)$/i.test(suffix)) return escapeHtml(verb);
  return `${escapeHtml(baseVerb)}<span class="l31-suffix-token">${escapeHtml(suffix)}</span>`;
}

function revealAuxiliary() {
  if (isCurrentLocked || interactionStage !== 0) return;
  interactionStage = 1;
  renderQuestion(false);
  const chip = document.getElementById("l31-aux-chip");
  if (chip) chip.focus();
}

function wireAuxiliaryDrag(q) {
  const chip = document.getElementById("l31-aux-chip");
  const splitDoes = usesSplitDoes(q);
  const isSuffixStep = splitDoes && interactionStage === 2;
  const slot = document.getElementById(isSuffixStep ? "l31-suffix-slot" : "l31-front-slot");
  if (!chip || !slot) return;

  const fragmentText = isSuffixStep ? "es" : splitDoes ? "do" : q.auxiliary;
  const placeFragment = () => {
    if (splitDoes && interactionStage === 1) {
      interactionStage = 2;
      renderQuestion(false);
      const nextChip = document.getElementById("l31-aux-chip");
      if (nextChip) nextChip.focus();
      return;
    }
    completeTransformation();
  };

  const chipRect = chip.getBoundingClientRect();
  const slotRect = slot.getBoundingClientRect();
  chip.style.setProperty("--l31-coach-x", `${slotRect.left + slotRect.width / 2 - (chipRect.left + chipRect.width / 2)}px`);
  chip.style.setProperty("--l31-coach-y", `${slotRect.top + slotRect.height / 2 - (chipRect.top + chipRect.height / 2)}px`);
  let coachTimer = window.setTimeout(() => {
    coachTimer = 0;
    if (chip.isConnected) chip.classList.add("is-coaching");
  }, 650);
  const stopCoach = () => {
    if (coachTimer) {
      window.clearTimeout(coachTimer);
      coachTimer = 0;
    }
    chip.classList.remove("is-coaching");
    chip.classList.add("is-coach-stopped");
  };

  chip.addEventListener("dragstart", (ev) => {
    stopCoach();
    if (!ev.dataTransfer) return;
    ev.dataTransfer.effectAllowed = "move";
    ev.dataTransfer.setData("text/plain", fragmentText);
    slot.classList.add("is-over");
  });
  chip.addEventListener("dragend", () => slot.classList.remove("is-over"));

  slot.addEventListener("dragover", (ev) => {
    ev.preventDefault();
    if (ev.dataTransfer) ev.dataTransfer.dropEffect = "move";
    slot.classList.add("is-over");
  });
  slot.addEventListener("dragleave", () => slot.classList.remove("is-over"));
  slot.addEventListener("drop", (ev) => {
    ev.preventDefault();
    slot.classList.remove("is-over");
    placeFragment();
  });
  slot.addEventListener("keydown", (ev) => {
    if (ev.key !== "Enter" && ev.key !== " ") return;
    ev.preventDefault();
    placeFragment();
  });

  let touchPointerId = null;
  const moveTouchChip = (ev) => {
    if (touchPointerId !== ev.pointerId) return;
    chip.style.left = `${ev.clientX}px`;
    chip.style.top = `${ev.clientY - chip.offsetHeight / 2}px`;
    const rect = slot.getBoundingClientRect();
    const isInside = ev.clientX >= rect.left && ev.clientX <= rect.right
      && ev.clientY >= rect.top && ev.clientY <= rect.bottom;
    slot.classList.toggle("is-over", isInside);
  };
  const finishTouchDrag = (ev, cancelled = false) => {
    if (touchPointerId !== ev.pointerId) return;
    const rect = slot.getBoundingClientRect();
    const isInside = !cancelled
      && ev.clientX >= rect.left && ev.clientX <= rect.right
      && ev.clientY >= rect.top && ev.clientY <= rect.bottom;
    touchPointerId = null;
    slot.classList.remove("is-over");
    chip.classList.remove("is-touch-dragging");
    chip.style.left = "";
    chip.style.top = "";
    if (isInside) placeFragment();
  };

  chip.addEventListener("pointerdown", (ev) => {
    stopCoach();
    if (ev.pointerType === "mouse") return;
    ev.preventDefault();
    touchPointerId = ev.pointerId;
    chip.setPointerCapture(ev.pointerId);
    chip.classList.add("is-touch-dragging");
    moveTouchChip(ev);
  });
  chip.addEventListener("pointermove", moveTouchChip);
  chip.addEventListener("pointerup", (ev) => finishTouchDrag(ev));
  chip.addEventListener("pointercancel", (ev) => finishTouchDrag(ev, true));
}

function completeTransformation() {
  if (isCurrentLocked) return;
  const q = questions[currentIndex];
  if (!q) return;
  const expectedStage = usesSplitDoes(q) ? 2 : 1;
  if (interactionStage !== expectedStage) return;
  isCurrentLocked = true;
  interactionStage = usesSplitDoes(q) ? 3 : 2;
  results.push({
    no: currentIndex + 1,
    qNumber: q.qNumber,
    type: q.type,
    question: q.question,
    selected: q.answer,
    answer: q.answer,
    instruction: q.instruction,
    correct: true,
  });
  renderQuestion(false);
  storeLatestResultSnapshot();
  showToast("ok", TEXT.CORRECT);
}

function scheduleAutoNext() {
  const solvedIndex = currentIndex;
  if (autoNextTimer) window.clearTimeout(autoNextTimer);
  autoNextTimer = window.setTimeout(() => {
    autoNextTimer = 0;
    if (isCurrentLocked && currentIndex === solvedIndex) goNext();
  }, 700);
}

function goNext() {
  if (autoNextTimer) {
    window.clearTimeout(autoNextTimer);
    autoNextTimer = 0;
  }
  currentIndex += 1;
  if (currentIndex >= questions.length) {
    showResultPopup();
    return;
  }
  renderQuestion();
}

function capitalizeSentenceStart(value) {
  const text = String(value || "");
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

function questionSubject(value) {
  const text = String(value || "");
  if (text === "I" || /^[A-Z]/.test(text)) return text;
  return text.toLowerCase();
}

function isAnswerCorrect(type, userRaw, modelRaw) {
  const userStrict = normalizeForCompare(userRaw, type);
  const userLoose = normalizeLoose(userRaw, type);
  if (!userStrict && !userLoose) return false;

  const candidates = buildModelCandidates(modelRaw);
  for (const cand of candidates) {
    const candStrict = normalizeForCompare(cand, type);
    const candLoose = normalizeLoose(cand, type);
    if (userStrict && candStrict && userStrict === candStrict) return true;
    if (userLoose && candLoose && userLoose === candLoose) return true;
  }
  return false;
}

function buildModelCandidates(modelRaw) {
  const raw = String(modelRaw ?? "").trim();
  if (!raw) return [""];

  const set = new Set([raw]);

  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t) continue;
    set.add(t);

    for (const part of t.split(/\|{1,2}/)) {
      const p = part.trim();
      if (p) set.add(p);
    }

    if (t.includes("|")) {
      const withoutPipes = t.replace(/\|+/g, " ").replace(/\s+/g, " ").trim();
      if (withoutPipes) set.add(withoutPipes);
    }

    if (/\bor\b/i.test(t)) {
      for (const part of t.split(/\bor\b/i)) {
        const p = part.trim();
        if (p && p.length <= 80) set.add(p);
      }
    }

    if (t.includes("/")) {
      const parts = t.split("/").map((x) => x.trim()).filter(Boolean);
      if (parts.length >= 2 && parts.length <= 6) {
        parts.forEach((p) => { if (p.length <= 80) set.add(p); });
      }
    }

    if (t.includes(",")) {
      const parts = t.split(",").map((x) => x.trim()).filter(Boolean);
      if (parts.length >= 2 && parts.length <= 4) {
        parts.forEach((p) => { if (p.length <= 40) set.add(p); });
      }
    }
  }

  return [...set];
}

function isInstructionLeakingAnswer(instruction, answer, type) {
  const i1 = normalizeForCompare(instruction, type);
  const a1 = normalizeForCompare(answer, type);
  if (i1 && a1 && i1 === a1) return true;

  const i2 = normalizeLoose(instruction, type);
  const a2 = normalizeLoose(answer, type);
  return !!i2 && !!a2 && i2 === a2;
}

function normalizeForCompare(value, type) {
  let s = stripEmphasisMarkers(normalizeEscapedBreaks(String(value ?? "")))
    .replace(/[’‘`]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.?!~]+$/g, "")
    .trim();

  if (type === "blank") s = s.toLowerCase();

  return s;
}

function normalizeLoose(value, type) {
  return normalizeForCompare(value, type)
    .toLowerCase()
    .replace(/[\s'"`.,!?~:;()\[\]{}_-]+/g, "");
}

function clipExample(s) {
  const oneLine = stripEmphasisMarkers(normalizeEscapedBreaks(String(s ?? ""))).replace(/\s+/g, " ").trim();
  if (!oneLine) return "";
  return oneLine.length > 36 ? oneLine.slice(0, 36) + "..." : oneLine;
}

function normalizeEscapedBreaks(value) {
  return String(value ?? "")
    .replaceAll("\\r\\n", "\n")
    .replaceAll("\\n", "\n")
    .replaceAll("\\r", "\n")
    .replace(/\\+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n");
}

function stripEmphasisMarkers(value) {
  return String(value ?? "").replace(/\*\*(.*?)\*\*/gs, "$1");
}

function escapeHtmlWithBreaks(value) {
  return escapeHtml(value).replaceAll("\n", "<br/>");
}

function renderTextWithEmphasis(value) {
  const text = normalizeEscapedBreaks(String(value ?? ""));
  const re = /\*\*(.*?)\*\*/gs;
  let out = "";
  let last = 0;
  let m;

  while ((m = re.exec(text)) !== null) {
    out += escapeHtmlWithBreaks(text.slice(last, m.index));
    out += `<span class="focus-token">${escapeHtml(String(m[1] ?? "").trim())}</span>`;
    last = re.lastIndex;
  }

  out += escapeHtmlWithBreaks(text.slice(last));
  return out;
}

function formatMultilineText(value) {
  return escapeHtml(stripEmphasisMarkers(normalizeEscapedBreaks(String(value ?? "")))).replaceAll("\n", "<br/>");
}

function showResultPopup() {
  const popup = document.getElementById("result-popup");
  const content = document.getElementById("result-content");
  if (!popup || !content) return;

  const total = questions.length;
  const correctCount = results.filter((r) => r.correct).length;
  const score = total ? Math.round((correctCount / total) * 100) : 0;

  const rowsHtml = questions.map((q, idx) => {
    const row = results.find((r) => r.qNumber === q.qNumber);
    const user = row?.selected ?? TEXT.UNANSWERED;
    const state = row?.correct ? TEXT.CORRECT : TEXT.WRONG;
    const stateClass = row?.correct ? "result-ok" : "result-bad";

    return `
      <div class="result-item">
        <div><b>Q${idx + 1}</b> ${renderTextWithEmphasis(q.question)}</div>
        <div style="margin-top:4px;"><span class="${stateClass}">${state}</span></div>
        <div>${TEXT.MY_ANSWER}: ${escapeHtml(user)}</div>
        <div>${TEXT.ANSWER}: ${formatMultilineText(q.answer)}</div>
      </div>
    `;
  }).join("");

  content.innerHTML = `
    <div style="font-size:18px; font-weight:900; color:#7e3106;">${TEXT.RESULT_TITLE}</div>
    <div style="margin-top:8px;">
      <span class="pill">${TEXT.SCORE} ${score}점</span>
      <span class="pill">${TEXT.CORRECT_COUNT} ${correctCount}/${total}</span>
    </div>

    <div style="margin-top:8px; font-size:12px; color:#7e3106; font-weight:900;">
      ${escapeHtml(quizTitle)}
    </div>

    <div style="margin-top:10px;">${rowsHtml}</div>

    <div class="btn-row" style="margin-top:14px;">
      <button class="quiz-btn" id="retry-btn" type="button">${TEXT.RETRY}</button>
      <button class="quiz-btn" id="close-popup-btn" type="button">${TEXT.CLOSE}</button>
    </div>
  `;

  const retryBtn = document.getElementById("retry-btn");
  const closeBtn = document.getElementById("close-popup-btn");
  if (retryBtn) retryBtn.addEventListener("click", () => window.location.reload());
  if (closeBtn) closeBtn.addEventListener("click", closePopup);

  popup.style.display = "flex";
  popup.setAttribute("aria-hidden", "false");
}

function closePopup() {
  const popup = document.getElementById("result-popup");
  if (!popup) return;
  popup.style.display = "none";
  popup.setAttribute("aria-hidden", "true");
}

function showToast(kind, text) {
  if (window.HermaToastFX) {
    window.HermaToastFX.show(kind, text);
    return;
  }
  if (kind === "ok") console.info(text);
  else console.warn(text);
}

function storeLatestResultSnapshot() {
  try {
    const total = questions.length;
    const correctCount = results.filter((r) => r.correct).length;
    const score = total ? Math.round((correctCount / total) * 100) : 0;
    const payload = {
      id: userId,
      quiztitle: quizTitle,
      subcategory,
      level,
      day,
      score,
      total,
      correctCount,
      results,
    };
    localStorage.setItem("QuizResults", JSON.stringify(payload));
  } catch (_) {}
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeHtmlAttr(str) {
  return escapeHtml(stripEmphasisMarkers(normalizeEscapedBreaks(str))).replaceAll("\n", " ");
}







