// aisth-l6e3.js
// Independent runtime for Aisth Lesson 6 Exercise 3

const TARGET_LESSON = 6;
const TARGET_EXERCISE = 4;
const SOURCE_EXERCISE = 3;
const PAGE_LABEL = "Aisth L6-E4";
const MAX_QUESTIONS = 0; // 0 = unlimited
const GROUP_SIZE = 2;

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

const VERB_HINT_BY_ANSWER = {
  interesting: "interest",
  interested: "interest",
  surprising: "surprise",
  surprised: "surprise",
  annoying: "annoy",
  annoyed: "annoy",
  exciting: "excite",
  excited: "excite",
  confusing: "confuse",
  confused: "confuse",
  disappointing: "disappoint",
  disappointed: "disappoint",
  shocking: "shock",
  shocked: "shock",
  tiring: "tire",
  tired: "tire",
};

const ING_ED_FORMS_BY_VERB = {
  interest: { ing: "interesting", ed: "interested" },
  surprise: { ing: "surprising", ed: "surprised" },
  annoy: { ing: "annoying", ed: "annoyed" },
  excite: { ing: "exciting", ed: "excited" },
  confuse: { ing: "confusing", ed: "confused" },
  disappoint: { ing: "disappointing", ed: "disappointed" },
  shock: { ing: "shocking", ed: "shocked" },
  tire: { ing: "tiring", ed: "tired" },
};

let subcategory = "Grammar";
let level = "aisth";
let day = "023";
let quizTitle = "quiz_Grammar_aisth_l6e4";
let userId = "";

let rawRows = [];
let questions = [];
let questionGroups = [];
let currentIndex = 0;
let results = [];
let isCurrentLocked = false;
let currentPairStage = "ko";
let stageTransitionTimer = 0;
let rewritePlaceholderExample = "";
let blankPlaceholderExample = "";

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

    .set-item {
      border: 1px solid #eadac7;
      border-radius: 10px;
      background: #fff;
      padding: 10px;
      margin-top: 8px;
    }

    .set-item:first-child {
      margin-top: 0;
    }

    .set-item-head {
      font-size: 12px;
      font-weight: 900;
      color: #7e3106;
      margin-bottom: 6px;
    }

    .hint-base {
      margin-top: 6px;
      font-size: 12px;
      color: #7e3106;
      font-weight: 900;
    }

    .hint-base code {
      font-size: 12px;
      background: #fff3e0;
      border: 1px solid #e9c7a7;
      border-radius: 999px;
      padding: 2px 8px;
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

    .l63-stage-card {
      border: 1px solid rgba(125, 80, 35, 0.2);
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.98);
      padding: 12px;
      box-shadow: 0 8px 20px rgba(83, 48, 17, 0.08);
      animation: l63-stage-in 0.34s ease both;
    }

    .l63-stage-card.is-leaving {
      animation: l63-stage-out 0.22s ease both;
      pointer-events: none;
    }

    @keyframes l63-stage-in {
      from { opacity: 0; transform: translateY(7px) scale(0.985); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes l63-stage-out {
      to { opacity: 0; transform: translateY(-5px) scale(0.99); }
    }

    .l63-stage-kicker {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 8px;
      color: #7e3106;
      font-size: 12px;
      font-weight: 950;
    }

    .l63-type-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 48px;
      height: 22px;
      padding: 0 10px;
      margin: 0 auto 4px;
      border-radius: 999px;
      border: 0;
      background: linear-gradient(180deg, #6553d7 0%, #3c56c9 100%);
      color: #f2f4ff;
      font-size: 11px;
      font-weight: 950;
      letter-spacing: 0;
      box-shadow: 0 4px 10px rgba(65, 75, 191, 0.22);
      animation: l63TypeBounce 1.04s cubic-bezier(.2,.82,.26,1) infinite;
    }

    @keyframes l63TypeBounce {
      0%, 100% { transform: translateY(0); }
      45% { transform: translateY(-6px); }
    }

    .l63-question {
      margin: 0 0 10px;
      border: 0;
      background: #fffaf4;
      box-shadow: inset 0 0 0 1px rgba(126, 49, 6, 0.1);
      font-size: 15px;
      font-weight: 850;
      text-align: center;
    }

    .l63-answer-panel {
      position: relative;
      min-height: 78px;
      padding: 12px 10px 10px;
      border: 1px solid rgba(126, 49, 6, 0.16);
      border-radius: 13px;
      background: #fff;
    }

    .l63-ko-line {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 7px;
      min-height: 48px;
    }

    .l63-fixed-subject {
      flex: 0 0 auto;
      color: #24211e;
      font-size: 18px;
      font-weight: 950;
      letter-spacing: -0.04em;
      white-space: nowrap;
    }

    .l63-ko-input,
    .l63-hidden-source {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    .l63-answer-panel .aisth-slot-control {
      width: auto;
      max-width: 100%;
      margin: 0;
    }

    .l63-answer-panel .aisth-slot-flow {
      justify-content: center;
      gap: 5px;
    }

    .l63-answer-panel .aisth-slot-cell {
      width: 27px;
      min-width: 27px;
      height: 38px;
      font-size: 17px;
    }

    .l63-answer-panel .aisth-slot-word {
      gap: 3px;
    }

    .l63-answer-panel .aisth-slot-cell.is-l63-first-hint,
    #quiz-area .l63-pair-answer-box .aisth-slot-cell.is-l63-first-hint {
      border-color: rgba(201,154,24,.76) !important;
      border-bottom-color: #c99a18 !important;
      background: linear-gradient(180deg,#fffdf0 0%,#ffef9d 100%) !important;
      color: #8a6500 !important;
      box-shadow: 0 0 0 3px rgba(255,210,53,.16) !important;
    }

    .l63-answer-panel .aisth-slot-cell.is-l63-first-hint .aisth-slot-placeholder-char,
    #quiz-area .l63-pair-answer-box .aisth-slot-cell.is-l63-first-hint .aisth-slot-placeholder-char {
      display: inline-block;
      color: #8a6500 !important;
      opacity: 1 !important;
      animation: none !important;
      font-weight: 950;
    }

    #quiz-area .l63-pair-answer-box .aisth-slot-cell.is-slot-correct {
      border-color: rgba(47,170,98,.86) !important;
      border-bottom-color: #219653 !important;
      background: linear-gradient(180deg,#f7fff9 0%,#dff7e8 100%) !important;
      color: #145d33 !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.92), 0 0 0 2px rgba(43,184,101,.16), 0 0 12px rgba(43,184,101,.30) !important;
    }

    #quiz-area .l63-pair-answer-box .aisth-slot-cell.is-slot-wrong {
      border-color: rgba(220,63,75,.90) !important;
      border-bottom-color: #c72b39 !important;
      background: linear-gradient(180deg,#fff8f9 0%,#ffe1e5 100%) !important;
      color: #9d1f2d !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 0 0 2px rgba(220,63,75,.14), 0 0 12px rgba(220,63,75,.28) !important;
    }

    .l63-choice-note {
      margin: 1px 0 10px;
      color: #5d5148;
      font-size: 12px;
      font-weight: 750;
      text-align: center;
    }

    .l63-choice-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 9px;
    }

    .l63-choice {
      position: relative;
      min-height: 76px;
      border-radius: 14px;
      border: 1.5px solid currentColor;
      cursor: pointer;
      font: inherit;
      font-weight: 950;
      transition: transform 0.16s ease, filter 0.16s ease, box-shadow 0.16s ease;
    }

    .l63-choice:hover { transform: translateY(-2px); }
    .l63-choice:active { transform: translateY(0) scale(0.98); }
    .l63-choice:disabled { cursor: default; }

    .l63-choice.is-ing {
      color: #c7001f;
      border-color: rgba(199, 0, 31, 0.42);
      background: linear-gradient(160deg, #fffafb, #fff0f3);
      box-shadow: inset 0 1px 0 #fff, 0 6px 14px rgba(199, 0, 31, 0.1);
    }

    .l63-choice.is-ed {
      color: #075fc9;
      border-color: rgba(7, 95, 201, 0.42);
      background: linear-gradient(160deg, #fbfdff, #edf6ff);
      box-shadow: inset 0 1px 0 #fff, 0 6px 14px rgba(7, 95, 201, 0.1);
    }

    .l63-choice-letter {
      position: absolute;
      top: 7px;
      left: 8px;
      display: grid;
      place-items: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.82);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
      color: #4e4944;
      font-size: 10px;
    }

    .l63-choice-suffix {
      display: block;
      font-size: 24px;
      line-height: 1;
      letter-spacing: -0.03em;
    }

    .l63-choice-word {
      display: block;
      margin-top: 7px;
      color: #554e48;
      font-size: 10px;
      font-weight: 800;
      opacity: 0.72;
    }

    .l63-choice.is-correct {
      transform: translateY(-2px) scale(1.02);
      filter: saturate(1.08);
      box-shadow: 0 0 0 3px rgba(79, 176, 105, 0.2), 0 8px 18px rgba(48, 135, 73, 0.16);
    }

    .l63-choice.is-wrong { animation: l63-choice-shake 0.3s ease; }

    @keyframes l63-choice-shake {
      25% { transform: translateX(-4px); }
      50% { transform: translateX(4px); }
      75% { transform: translateX(-2px); }
    }

    .l63-pair-stack { display: grid; gap: 0; }

    .l63-pair-stage {
      display: grid;
      gap: 10px;
      max-height: 360px;
      overflow: hidden;
      transition: max-height 0.42s ease, gap 0.34s ease;
    }

    .l63-pair-stage.is-morphing {
      gap: 0;
      max-height: 360px;
      pointer-events: auto;
    }

    .l63-pair-source {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 82px;
      max-height: 112px;
      overflow: hidden;
      margin-top: 0;
      text-align: center;
      font-size: 20px;
      font-weight: 950;
      transition: opacity 0.32s ease, transform 0.32s ease, max-height 0.38s ease, padding 0.38s ease, margin 0.38s ease, border-color 0.26s ease;
    }

    .l63-source-focus {
      display: inline-block;
      padding: 0;
      font-weight: 950;
      line-height: 1.08;
      white-space: nowrap;
    }

    .l63-source-focus.is-ing {
      color: rgba(199, 0, 31, 0.92);
      -webkit-text-stroke: 0.25px rgba(199, 0, 31, 0.34);
      text-shadow: -1px -1px 0 rgba(255,255,255,.58), 1px 1px 0 rgba(104,0,17,.28), 0 0 6px rgba(255,20,58,.38), 0 0 12px rgba(255,20,58,.18);
    }

    .l63-source-focus.is-ed {
      color: rgba(7, 95, 201, 0.92);
      -webkit-text-stroke: 0.25px rgba(7, 95, 201, 0.34);
      text-shadow: -1px -1px 0 rgba(255,255,255,.6), 1px 1px 0 rgba(0,42,116,.28), 0 0 6px rgba(0,103,255,.4), 0 0 12px rgba(0,103,255,.18);
    }

    .l63-pair-stage.is-morphing .l63-pair-source {
      opacity: 0;
      transform: translateY(-24px);
      pointer-events: none;
    }

    .l63-pair-answer-box {
      background: #fff;
      border: 1.5px solid rgba(126, 49, 6, 0.26);
      border-radius: 12px;
      padding: 11px 12px 14px;
      text-align: center;
      max-height: 220px;
      overflow: hidden;
      margin-top: 0;
      box-sizing: border-box;
      transition: opacity 0.32s ease, transform 0.32s ease, max-height 0.38s ease, padding 0.38s ease, margin 0.38s ease, border-color 0.26s ease, border-width 0.38s ease;
    }

    .l63-pair-answer-box.is-plain {
      min-height: 62px;
      max-height: 92px;
      padding: 16px 12px 18px;
      background: #fff;
      box-shadow: 0 7px 14px rgba(126, 49, 6, 0.06);
    }

    .l63-pair-answer-box.is-plain.is-lifting {
      margin-top: calc(-1 * var(--l63-source-lift, 0px));
    }

    .l63-pair-answer-box.is-expanded {
      max-height: 340px;
      padding: 16px 12px 14px;
    }

    .l63-pair-tool-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 0 4px;
      max-height: 24px;
      opacity: 1;
      transition: opacity 0.18s ease, max-height 0.22s ease, margin 0.22s ease;
    }

    .l63-pair-tool-spacer,
    .l63-pair-tool-end {
      display: flex;
      flex: 1 1 0;
      align-items: center;
    }

    .l63-pair-tool-end { justify-content: flex-end; }

    .l63-pair-answer-box.is-plain .l63-pair-tool-row {
      max-height: 0;
      margin: 0;
      opacity: 0;
      overflow: hidden;
    }

    .l63-pair-ko-template {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 7px;
      min-height: 48px;
    }

    .l63-pair-ko-template .aisth-slot-control {
      width: auto;
      display: inline-flex;
      flex-wrap: wrap;
      justify-content: center;
      max-width: 100%;
      padding: 0;
      gap: 5px;
      row-gap: 7px;
      vertical-align: middle;
    }

    .l63-pair-ko-template .aisth-slot-shell {
      flex-wrap: wrap;
      justify-content: center;
      max-width: 100%;
      row-gap: 7px;
    }

    .l63-pair-ko-template .aisth-slot-cell {
      width: 32px;
      min-width: 32px;
      height: 42px;
      font-size: 19px;
    }

    .l63-pair-ko-plain-line {
      text-align: center;
      font-size: 23px;
      font-weight: 950;
      color: #1f1a16;
      line-height: 1.24;
      opacity: 0;
      transform: translateY(8px);
    }

    .l63-pair-answer-box.is-plain.is-in .l63-pair-ko-plain-line {
      opacity: 1;
      transform: translateY(0);
      transition: opacity 0.18s ease, transform 0.28s cubic-bezier(.2,.75,.24,1);
    }

    .l63-pair-en-rest {
      max-height: 0;
      opacity: 0;
      overflow: hidden;
      transform: translateY(10px);
      margin-top: 0;
      transition: max-height 0.42s ease 0.12s, opacity 0.28s ease 0.16s, transform 0.32s ease 0.16s, margin-top 0.28s ease;
    }

    .l63-pair-answer-box.is-expanded .l63-pair-en-rest {
      max-height: 245px;
      opacity: 1;
      transform: translateY(0);
      margin-top: 12px;
    }

    .l63-word-choice-list {
      margin-top: 8px;
      padding-top: 0;
      border-top: 0;
      gap: 8px;
    }

    .l63-word-choice {
      min-height: 42px;
      padding: 8px 11px;
      text-align: left;
    }

    .l63-word-choice .aisth-choice-text {
      font-size: 17px;
      letter-spacing: 0.01em;
      color: #111;
      -webkit-text-stroke: 0;
      text-shadow: none;
    }

    .l63-word-choice.is-wrong { animation: l63-choice-shake 0.3s ease; }
    .l63-word-choice.is-correct { box-shadow: 0 0 0 3px rgba(79, 176, 105, 0.2), 0 7px 16px rgba(48, 135, 73, 0.14); }
    .l63-word-choice[aria-disabled="true"] { pointer-events: none; }

    .l63-pair-card-title {
      margin: 0 0 10px;
      padding: 7px 0;
      border-top: 1px solid rgba(126, 49, 6, 0.15);
      border-bottom: 1px solid rgba(126, 49, 6, 0.15);
      color: #7e3106;
      font-size: 12px;
      font-weight: 950;
    }

    .l63-pair-en-question {
      margin: 0 0 9px;
      color: #1f1a16;
      font-size: 19px;
      font-weight: 950;
      line-height: 1.35;
    }

    @media (prefers-reduced-motion: reduce) {
      .l63-pair-stage,
      .l63-pair-source,
      .l63-pair-answer-box,
      .l63-pair-en-rest { transition-duration: 0.01ms !important; }
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
  if (!window.AisthLocalQuestionData || typeof window.AisthLocalQuestionData.getRows !== "function") {
    throw new Error("Aisth local question data is not loaded.");
  }
  return window.AisthLocalQuestionData.getRows(TARGET_LESSON, SOURCE_EXERCISE);
}

function publishFrameDebugList() {
  if (!window.AisthLocalQuestionData || typeof window.AisthLocalQuestionData.publishDebugList !== "function") return;
  window.AisthLocalQuestionData.publishDebugList(questions, {
    label: PAGE_LABEL,
    source: "local",
    title: "aisth-local-question-data.js",
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
      currentIndex = Math.floor(nextIndex / GROUP_SIZE);
      currentPairStage = nextIndex % GROUP_SIZE === 0 ? "ko" : "en";
      renderQuestion();
    },
  });
}

function buildQuestionsFromRows() {
  let filtered = rawRows
    .filter((r) => Number(r["Lesson"]) === TARGET_LESSON && Number(r["Exercise"]) === SOURCE_EXERCISE)
    .sort((a, b) => Number(a["QNumber"]) - Number(b["QNumber"]));

  if (MAX_QUESTIONS > 0) filtered = filtered.slice(0, MAX_QUESTIONS);

  const modeByType = deriveInstructionModeByType(filtered);

  const firstRowAnswer = normalizeEscapedBreaks(String(filtered[0]?.["Answer"] ?? "").trim());
  const firstRewriteAnswer = normalizeEscapedBreaks(String(filtered.find((r) => detectType(normalizeEscapedBreaks(String(r["Question"] ?? "").trim())) === "rewrite")?.["Answer"] ?? "").trim());
  const firstBlankAnswer = normalizeEscapedBreaks(String(filtered.find((r) => detectType(normalizeEscapedBreaks(String(r["Question"] ?? "").trim())) === "blank")?.["Answer"] ?? "").trim());

  rewritePlaceholderExample = clipExample(stripEmphasisMarkers(firstRowAnswer || firstRewriteAnswer || "example"));
  blankPlaceholderExample = clipExample(stripEmphasisMarkers(firstRowAnswer || firstBlankAnswer || "answer"));

  questions = filtered.map((row, idx) => {
    const question = normalizeEscapedBreaks(String(row["Question"] ?? "").trim());
    const answer = stripEmphasisMarkers(normalizeEscapedBreaks(String(row["Answer"] ?? "").trim()));
    const title = stripEmphasisMarkers(normalizeEscapedBreaks(String(row["Title"] ?? "").trim()));
    const type = detectType(question);

    const fallbackInst = type === "blank" ? DEFAULT_BLANK_INSTRUCTION : DEFAULT_REWRITE_INSTRUCTION;
    const modeInst = modeByType[type] || fallbackInst;

    const qNumber = Number(row["QNumber"]) || idx + 1;
    const rawInstruction = normalizeEscapedBreaks(String(row["Instruction"] ?? "").trim());

    let instruction = rawInstruction || modeInst;
    if (qNumber === 1 && modeInst) instruction = modeInst;
    if (isInstructionLeakingAnswer(instruction, answer, type)) instruction = modeInst;
    const verbHint = qNumber % 2 === 0 ? deriveVerbHintFromAnswer(answer) : "";

    return {
      no: idx + 1,
      qNumber,
      question,
      answer,
      instruction,
      title,
      type,
      verbHint,
    };
  });

  questionGroups = [];
  for (let i = 0; i < questions.length; i += GROUP_SIZE) {
    questionGroups.push(questions.slice(i, i + GROUP_SIZE));
  }
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

function deriveVerbHintFromAnswer(answerRaw) {
  const first = firstModelToken(answerRaw);
  if (!first) return "";
  const key = first.toLowerCase();
  if (VERB_HINT_BY_ANSWER[key]) return VERB_HINT_BY_ANSWER[key];

  if (key.endsWith("ing") && key.length > 4) return key.slice(0, -3);
  if (key.endsWith("ed") && key.length > 3) return key.slice(0, -2);
  return key;
}

function firstModelToken(modelRaw) {
  const raw = String(modelRaw || "").trim();
  if (!raw) return "";
  const one = raw.split(/\r?\n/)[0].trim();
  const part = one.split("||")[0].split("/")[0].split(",")[0].trim();
  const token = part.split(/\s+/)[0] || "";
  return token.replace(/[^A-Za-z]/g, "");
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
  const setTotal = questionGroups.length;
  const title = questions[0]?.title || PAGE_LABEL;
  const firstInst = stripEmphasisMarkers(questions[0]?.instruction || TEXT.INPUT_HINT_FALLBACK);

  area.innerHTML = `
    <div class="box">
      <div style="font-size:18px; font-weight:900; color:#7e3106; margin-bottom:10px;">🧩 ${escapeHtml(PAGE_LABEL)}</div>

      <div style="margin-bottom:10px;">
        <span class="pill">Lesson ${TARGET_LESSON}</span>
        <span class="pill">Exercise ${TARGET_EXERCISE}</span>
        <span class="pill">총 ${total}문제</span>
        <span class="pill">${setTotal}세트</span>
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
  currentPairStage = "ko";
  renderQuestion();
}

function renderQuestion() {
  const area = document.getElementById("quiz-area");
  if (!area) return;

  const group = questionGroups[currentIndex];
  if (!group || !group.length) {
    showResultPopup();
    return;
  }

  isCurrentLocked = false;
  if (stageTransitionTimer) {
    window.clearTimeout(stageTransitionTimer);
    stageTransitionTimer = 0;
  }

  const koQuestion = group[0];
  const enQuestion = group[1];
  if (currentPairStage === "en" && enQuestion) {
    renderL63EnglishStage(area, koQuestion, enQuestion);
    return;
  }
  currentPairStage = "ko";
  renderL63KoreanStage(area, koQuestion, enQuestion);
}

function renderL63KoreanStage(area, koQuestion, enQuestion) {
  if (!koQuestion) return;
  const answerParts = splitL63KoreanAnswer(koQuestion.answer);
  const showFullPlaceholder = koQuestion.qNumber === 1 || koQuestion.qNumber === 3;
  const instruction = stripEmphasisMarkers(koQuestion.instruction || DEFAULT_REWRITE_INSTRUCTION);
  const setEnd = enQuestion ? enQuestion.qNumber : koQuestion.qNumber;
  const forms = getL63IngEdForms(enQuestion?.answer || "");
  const correctSuffix = firstModelToken(enQuestion?.answer || "").toLowerCase().endsWith("ing") ? "ing" : "ed";
  const englishQuestion = renderTextWithEmphasis(enQuestion?.question || "")
    .replace(/_{2,}/g, '<span class="blank-slot">___</span>');

  area.innerHTML = `
    <div class="q-label">SET ${currentIndex + 1} / ${questionGroups.length} · Q${koQuestion.qNumber}-${setEnd}</div>
    <div class="box"><div class="question-instruction">${escapeHtml(instruction)}</div></div>
    <div class="box" style="background:#fff;">
      <div class="l63-pair-stack">
        <div class="l63-pair-stage" id="l63-pair-stage">
          <div class="sentence aisth-question-surface aisth-question-center l63-pair-source">${renderL63KoreanSource(koQuestion.question, enQuestion?.answer)}</div>
          <div class="l63-pair-answer-box" id="l63-pair-answer-box">
            <div class="l63-pair-tool-row">
              <span class="l63-pair-tool-spacer" aria-hidden="true"></span>
              <span class="l63-type-pill">type!</span>
              <span class="l63-pair-tool-end">${showFullPlaceholder ? "" : `<button class="aisth-hint-tool" id="l63-hint-btn" type="button" aria-label="hint"><span class="aisth-hint-bulb" aria-hidden="true">!</span><span>hint</span></button>`}</span>
            </div>
            <div class="l63-pair-ko-template" id="l63-pair-ko-template">
              <span class="l63-fixed-subject">${escapeHtml(answerParts.fixed)}</span>
              <input id="l63-ko-answer" class="l63-ko-input" type="text" lang="ko" autocomplete="off" />
            </div>
            <div class="l63-pair-en-rest" id="l63-pair-en-rest" aria-hidden="true">
              <div class="l63-pair-card-title">ing인지 ed인지 골라보세요.</div>
              <div class="l63-pair-en-question">${englishQuestion}</div>
              <div class="aisth-choice-list l63-word-choice-list">
                ${buildL63ChoiceHtml("A", "ing", forms.ing)}
                ${buildL63ChoiceHtml("B", "ed", forms.ed)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="feedback" class="feedback"></div>
    </div>
  `;

  const input = document.getElementById("l63-ko-answer");
  const hintBtn = document.getElementById("l63-hint-btn");
  const slotApi = input && window.AisthInputSlots
      ? window.AisthInputSlots.enhance(input, {
        modelText: answerParts.predicate,
        placeholderText: showFullPlaceholder ? answerParts.predicate : "",
      })
    : null;

  if (slotApi?.control) slotApi.control.classList.add("l63-ko-slot-control");
  if (input) {
    input.dataset.fixedSubject = answerParts.fixed;
    input.dataset.answerCandidates = JSON.stringify(answerParts.predicates);
    input.addEventListener("input", () => {
      if (paintL63SlotState(input, answerParts.predicates)) submitCurrentAnswer();
    });
  }
  if (hintBtn) {
    hintBtn.addEventListener("click", () => {
      revealL63FirstCharacterHint(slotApi?.control, answerParts.predicates);
      hintBtn.disabled = true;
    });
  }
  area.querySelectorAll(".l63-word-choice").forEach((button) => {
    const activate = () => selectL63Suffix(button, correctSuffix, enQuestion);
    button.addEventListener("click", activate);
    button.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      activate();
    });
  });
  if (input) paintL63SlotState(input, answerParts.predicates);
  if (slotApi) slotApi.focus();
  else input?.focus();
}

function renderL63EnglishStage(area, koQuestion, enQuestion) {
  if (!enQuestion) {
    goNext();
    return;
  }
  currentPairStage = "ko";
  renderL63KoreanStage(area, koQuestion, enQuestion);
  revealL63EnglishStage(koQuestion, enQuestion, splitL63KoreanAnswer(koQuestion.answer).fixed + " " + splitL63KoreanAnswer(koQuestion.answer).predicate, true);
}

function buildL63ChoiceHtml(letter, suffix, word) {
  return `
    <div class="aisth-choice-item l63-word-choice" data-suffix="${suffix}" role="button" tabindex="0">
      <span class="aisth-choice-label">${letter}</span>
      <span class="aisth-choice-text">${escapeHtml(word)}</span>
    </div>
  `;
}

function renderL63KoreanSource(questionRaw, englishAnswerRaw) {
  const source = stripEmphasisMarkers(normalizeEscapedBreaks(String(questionRaw || "")).trim());
  const direction = firstModelToken(englishAnswerRaw || "").toLowerCase().endsWith("ing") ? "ing" : "ed";
  const parts = source.match(/^(.+?(?:은|는|이|가))(\s+)(.+)$/);
  if (!parts) return escapeHtml(source);
  return `${escapeHtml(parts[1])}${parts[2]}<span class="l63-source-focus is-${direction}">${escapeHtml(parts[3])}</span>`;
}

function revealL63EnglishStage(koQuestion, enQuestion, koreanAnswer, immediate = false) {
  const stage = document.getElementById("l63-pair-stage");
  const sourceBox = stage?.querySelector(".l63-pair-source");
  const answerBox = document.getElementById("l63-pair-answer-box");
  const koTemplate = document.getElementById("l63-pair-ko-template");
  const enRest = document.getElementById("l63-pair-en-rest");
  const submitBtn = document.getElementById("submit-btn");
  if (!stage || !answerBox || !koTemplate || !enRest) return;

  koTemplate.innerHTML = `<div class="l63-pair-ko-plain-line">${escapeHtml(koreanAnswer)}</div>`;
  answerBox.classList.add("is-plain");
  void answerBox.offsetWidth;
  answerBox.classList.add("is-in");
  enRest.setAttribute("aria-hidden", "true");
  if (submitBtn) {
    const buttonRow = submitBtn.closest(".btn-row");
    submitBtn.remove();
    if (buttonRow && !buttonRow.children.length) buttonRow.remove();
  }
  currentPairStage = "en";

  const liftAndOpen = () => {
    if (sourceBox) {
      const sourceRect = sourceBox.getBoundingClientRect();
      const answerRect = answerBox.getBoundingClientRect();
      const lift = Math.max(0, answerRect.top - sourceRect.top);
      stage.style.setProperty("--l63-source-lift", `${Math.ceil(lift)}px`);
    }
    stage.classList.add("is-morphing");
    answerBox.classList.add("is-lifting");
  };
  const expand = () => {
    answerBox.classList.add("is-expanded");
    enRest.setAttribute("aria-hidden", "false");
    isCurrentLocked = false;
  };

  if (immediate) {
    liftAndOpen();
    expand();
    return;
  }
  const transitionIndex = currentIndex;
  stageTransitionTimer = window.setTimeout(() => {
    if (currentIndex !== transitionIndex) return;
    liftAndOpen();
    stageTransitionTimer = window.setTimeout(() => {
      if (currentIndex !== transitionIndex) return;
      stageTransitionTimer = 0;
      expand();
    }, 460);
  }, 120);
}

function submitCurrentAnswer() {
  if (isCurrentLocked || currentPairStage !== "ko") return;
  const group = questionGroups[currentIndex] || [];
  const q = group[0];
  const input = document.getElementById("l63-ko-answer");
  const value = String(input?.value || "").trim();
  if (!q || !input) return;

  if (!value) {
    showToast("no", TEXT.INPUT_REQUIRED);
    return;
  }
  const candidates = parseL63StoredCandidates(input.dataset.answerCandidates);
  const isCorrect = candidates.some((candidate) => normalizeLoose(value, "rewrite") === normalizeLoose(candidate, "rewrite"));
  if (!isCorrect) {
    showToast("no", TEXT.WRONG);
    return;
  }

  isCurrentLocked = true;
  if (window.AisthInputSlots) window.AisthInputSlots.setDisabled(input, true);
  const koreanAnswer = `${input.dataset.fixedSubject} ${value}`.trim();
  document.getElementById("submit-btn")?.setAttribute("disabled", "disabled");
  recordL63Result(q, koreanAnswer);
  storeLatestResultSnapshot();
  showToast("ok", TEXT.CORRECT);
  revealL63EnglishStage(q, group[1], koreanAnswer);
}

function selectL63Suffix(button, correctSuffix, question) {
  if (isCurrentLocked || !button || !question) return;
  const selectedSuffix = String(button.dataset.suffix || "");
  if (selectedSuffix !== correctSuffix) {
    button.classList.remove("is-wrong");
    void button.offsetWidth;
    button.classList.add("is-wrong");
    showToast("no", TEXT.WRONG);
    return;
  }

  isCurrentLocked = true;
  button.classList.add("selected", "is-correct");
  button.closest(".l63-word-choice-list")?.querySelectorAll(".l63-word-choice").forEach((choice) => {
    choice.setAttribute("aria-disabled", "true");
    choice.setAttribute("tabindex", "-1");
  });
  recordL63Result(question, firstModelToken(question.answer));
  storeLatestResultSnapshot();
  showToast("ok", TEXT.CORRECT);
  window.setTimeout(goNext, 650);
}

function recordL63Result(question, selected) {
  const existing = results.findIndex((item) => item.no === question.no);
  const nextResult = {
    no: question.no,
    qNumber: question.qNumber,
    type: question.type,
    question: question.question,
    selected,
    answer: question.answer,
    instruction: question.instruction,
    correct: true,
  };
  if (existing >= 0) results.splice(existing, 1, nextResult);
  else results.push(nextResult);
}

function splitL63KoreanAnswer(answerRaw) {
  const raw = stripTerminalPunctuation(String(answerRaw || "").split(/\r?\n/)[0].trim());
  const alternatives = raw.split("/").map((part) => stripTerminalPunctuation(part.trim())).filter(Boolean);
  const first = alternatives[0] || raw;
  const fixedPhraseOverrides = {
    "나는 흥미를 느꼈다": "나는 흥미를",
    "나는 짜증이 났다": "나는 짜증이",
  };
  const overriddenFixed = fixedPhraseOverrides[first] || "";
  if (overriddenFixed) {
    const predicates = alternatives.map((part) => part.startsWith(`${overriddenFixed} `)
      ? part.slice(overriddenFixed.length).trim()
      : part).filter(Boolean);
    return {
      fixed: overriddenFixed,
      predicate: predicates[0] || first,
      predicates: predicates.length ? predicates : [first],
    };
  }
  const matched = first.match(/^(.+?(?:은|는|이|가))\s+(.+)$/);
  const fixed = matched ? matched[1].trim() : (first.split(/\s+/)[0] || "");
  const predicate = matched ? matched[2].trim() : first.slice(fixed.length).trim();
  const predicates = alternatives.map((part, index) => {
    if (part.startsWith(`${fixed} `)) return part.slice(fixed.length).trim();
    if (index === 0 && matched) return matched[2].trim();
    return part;
  }).filter(Boolean);
  return { fixed, predicate: predicate || predicates[0] || first, predicates: predicates.length ? predicates : [predicate || first] };
}

function stripTerminalPunctuation(value) {
  return String(value || "").replace(/[.?!~]+$/g, "").trim();
}

function parseL63StoredCandidates(raw) {
  try {
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function getL63IngEdForms(answerRaw) {
  const answer = firstModelToken(answerRaw).toLowerCase();
  const verb = VERB_HINT_BY_ANSWER[answer] || deriveVerbHintFromAnswer(answer);
  const known = ING_ED_FORMS_BY_VERB[verb];
  if (known) return { verb, ing: known.ing, ed: known.ed };
  return {
    verb,
    ing: answer.endsWith("ing") ? answer : `${verb}ing`,
    ed: answer.endsWith("ed") ? answer : `${verb}ed`,
  };
}

function revealL63FirstCharacterHint(control, candidates) {
  if (!control) return;
  const firstCharacter = Array.from(String(candidates?.[0] || "").replace(/\s+/g, ""))[0] || "";
  if (!firstCharacter) return;
  control.dataset.placeholderChars = firstCharacter;
  control.classList.add("has-revealed-hint");
  control.querySelector(".aisth-slot-cell")?.classList.add("is-l63-first-hint");
  control.querySelector(".aisth-slot-input")?.dispatchEvent(new Event("keyup", { bubbles: true }));
}

function paintL63SlotState(sourceInput, candidates) {
  const control = document.getElementById(sourceInput?.dataset.aisthSlotControlId || "");
  if (!control) return false;
  const actual = Array.from(String(sourceInput.value || "").replace(/\s+/g, ""));
  const candidateChars = (Array.isArray(candidates) ? candidates : [])
    .map((candidate) => Array.from(String(candidate || "").replace(/\s+/g, "")))
    .filter((chars) => chars.length);
  const expected = candidateChars.find((chars) => actual.every((char, index) => chars[index] === char))
    || candidateChars[0]
    || [];
  control.querySelectorAll(".aisth-slot-cell").forEach((cell, index) => {
    cell.classList.toggle("is-slot-correct", Boolean(actual[index]) && actual[index] === expected[index]);
    cell.classList.toggle("is-slot-wrong", Boolean(actual[index]) && actual[index] !== expected[index]);
  });
  return candidateChars.some((chars) => chars.length === actual.length && chars.every((char, index) => actual[index] === char));
}

function goNext() {
  currentIndex += 1;
  currentPairStage = "ko";
  isCurrentLocked = false;
  if (currentIndex >= questionGroups.length) {
    showResultPopup();
    return;
  }
  renderQuestion();
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
