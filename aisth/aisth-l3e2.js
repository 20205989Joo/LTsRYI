// aisth-l3e2.js
// Independent runtime for Aisth Lesson 3 Exercise 2

const TARGET_LESSON = 3;
const TARGET_EXERCISE = 2;
const PAGE_LABEL = "Aisth L3-E2";
const MAX_QUESTIONS = 0; // 0 = unlimited

const L32_DIRECT_QUESTION_ROWS = [
  { question: "I **like** apples. (나는 사과를 **좋아해**.)", answer: "I don't like apples.", target: "don't like", focusRole: "verb" },
  { question: "She **is** happy. (그녀는 **행복해**.)", answer: "She isn't happy.", target: "isn't", focusRole: "verb" },
  { question: "We **have** a dog. (우리는 개가 **있어**.)", answer: "We don't have a dog.", target: "don't have", focusRole: "verb" },
  { question: "He **plays** soccer. (그는 축구를 **해**.)", answer: "He doesn't play soccer.", target: "doesn't play", focusRole: "verb" },
  { question: "They **are** at school. (그들은 학교에 **있어**.)", answer: "They aren't at school.", target: "aren't", focusRole: "verb" },
  { question: "You **can** swim. (너는 수영할 수 **있어**.)", answer: "You can't swim.", target: "can't", focusRole: "verb" },
  { question: "I **am** hungry. (나는 **배고파**.)", answer: "I am not hungry.", target: "am not", focusRole: "verb" },
  { question: "She **goes** to bed early. (그녀는 일찍 잠자리에 **들어**.)", answer: "She doesn't go to bed early.", target: "doesn't go", focusRole: "verb" },
  { question: "We **are** ready. (우리는 준비**됐어**.)", answer: "We aren't ready.", target: "aren't", focusRole: "verb" },
  { question: "He **has** a new phone. (그는 새 핸드폰이 **있어**.)", answer: "He doesn't have a new phone.", target: "doesn't have", focusRole: "verb" },
  { question: "I **saw** something. (나는 뭔가를 **봤어**.)", answer: "I didn't see anything.", target: "didn't see anything", focusRole: "verb" },
  { question: "I saw **something**. (나는 **뭔가를** 봤어.)", answer: "I saw nothing.", target: "nothing", focusRole: "negative" },
  { question: "Somebody **called** you. (누군가가 **전화했어**.)", answer: "You didn't get any calls.", target: "didn't get any calls", focusRole: "verb" },
  { question: "**Somebody** called you. (**누군가가** 전화했어.)", answer: "Nobody called you.", target: "Nobody", focusRole: "negative" },
  { question: "She always **smiles**. (그녀는 항상 **웃어**.)", answer: "She doesn't always smile.", target: "doesn't always smile", focusRole: "verb" },
  { question: "She **always** smiles. (그녀는 **항상** 웃어.)", answer: "She never smiles.", target: "never", focusRole: "negative" },
  { question: "**Everyone** is here. (**모두가** 여기에 있어.)", answer: "Not everyone is here.", target: "Not everyone", focusRole: "negative" },
  { question: "**Everyone** is here. (**모두가** 여기에 있어.)", answer: "Nobody is here.", target: "Nobody", focusRole: "negative" },
  { question: "He **goes out** every day. (그는 **외출해** 매일.)", answer: "He doesn't go out every day.", target: "doesn't go out", focusRole: "verb" },
  { question: "He goes out **every day**. (그는 외출해 **매일**.)", answer: "He never goes out.", target: "never", focusRole: "negative" },
  { question: "I **said** something. (나는 **말했어** 무언가를.)", answer: "I didn't say anything.", target: "didn't say anything", focusRole: "verb" },
  { question: "I said **something**. (나는 말했어 **무언가를**.)", answer: "I said nothing.", target: "nothing", focusRole: "negative" },
  { question: "Someone **opened** the door. (문을 **열었어** 누군가가.)", answer: "The door wasn't opened.", target: "wasn't opened", focusRole: "verb" },
  { question: "**Someone** opened the door. (**누군가가** 문을 열었어.)", answer: "No one opened the door.", target: "No one", focusRole: "negative" },
  { question: "I **eat** everything. (나는 먹어 모든 걸.)", answer: "I don't eat everything.", target: "don't eat", focusRole: "verb" },
  { question: "I eat **everything**. (나는 먹어 **모든 걸**.)", answer: "I eat nothing.", target: "nothing", focusRole: "negative" },
  { question: "She **talks** to everyone. (그녀는 모두에게 **말한다**.)", answer: "She doesn't talk to everyone.", target: "doesn't talk", focusRole: "verb" },
  { question: "She talks to **everyone**. (그녀는 모두에게 말한다.)", answer: "She talks to no one.", target: "no one", focusRole: "negative" },
  { question: "They **did** something special. (그들은 뭔가 특별한 걸 **했다**.)", answer: "They didn't do anything special.", target: "didn't do anything special", focusRole: "verb" },
  { question: "They did **something** special. (그들은 **뭔가** 특별한 걸 했다.)", answer: "They did nothing special.", target: "nothing", focusRole: "negative" },
].map((row, idx) => ({
  Lesson: TARGET_LESSON,
  Exercise: TARGET_EXERCISE,
  Title: "부정문",
  Question: row.question,
  QNumber: idx + 1,
  Answer: row.answer,
  Target: idx === 14 ? "doesn't smile" : row.target,
  FixedMiddle: idx === 14 ? "always" : "",
  FocusRole: row.focusRole,
  Instruction: "강조된 성분을 부정문으로 바꿔보세요.",
  KoreanHint: "",
  ClauseRole: "",
}));

const L32_HARD_QUESTION_NUMBERS = new Set([16, 17, 18, 20]);

const DEFAULT_REWRITE_INSTRUCTION = "영어스러운 표현을 자연스럽게 바꿔보세요.";
const DEFAULT_BLANK_INSTRUCTION = "빈칸에 알맞은 단어를 넣어보세요.";

const TEXT = {
  START: "🚀 시작",
  INTRO_1: "Herma 스타일 규칙을 따르는 독립형 Aisth 퀴즈입니다.",
  INTRO_2: "제출하면 채점되고, 다음 문제로 이동할 수 있습니다.",
  PIN: "📌",
  NO_QUESTIONS: "해당 Lesson/Exercise의 문제가 없습니다.",
  INPUT_REQUIRED: "입력 후 제출하세요.",
  PICK_VERB_FIRST: "먼저 강조 동사(또는 보조동사)를 옮기세요.",
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
let day = "009";
let quizTitle = "quiz_Grammar_aisth_l3e2";
let userId = "";

let rawRows = [];
let questions = [];
let currentIndex = 0;
let results = [];
let isCurrentLocked = false;
let rewritePlaceholderExample = "";
let blankPlaceholderExample = "";
let dragPlaced = false;
let dragLead = "";
let notSelected = false;

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
      padding: 10px;
      margin-bottom: 8px;
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
      padding: 10px;
      margin-top: 6px;
      line-height: 1.55;
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

    .drag-line {
      display: block;
      line-height: 1.75;
      white-space: normal;
      word-break: keep-all;
    }

    .line-ko {
      margin-top: 4px;
      color: #6d5b4d;
      font-size: 12px;
      line-height: 1.55;
    }

    .l32-question-box {
      padding: 14px;
      background: #fff3e0;
      border-color: #e9c7a7;
    }

    .l32-question-surface {
      padding: 18px 12px;
      border-color: #ecd8c1;
      background: #fff;
      text-align: center;
      box-shadow: 0 7px 18px rgba(103,63,22,.07);
    }

    .l32-line-en {
      color: #34261d;
      font-size: 18px;
      font-weight: 900;
      line-height: 1.55;
    }

    .l32-question-surface .line-ko {
      margin-top: 7px;
      color: #75685e;
      font-size: 12.5px;
      font-weight: 700;
    }

    .l32-question-surface .l32-focus-token {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 1px 5px;
      border-radius: 7px;
      font-weight: 950;
      line-height: 1.32;
    }

    .l32-question-surface .l32-focus-token.is-verb {
      border: 1px solid var(--aisth-role-v-border, #c88a12);
      background: var(--aisth-role-v-bg, #fff4cc);
      color: var(--aisth-role-v-text, #7a4a00);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.78), 0 0 10px var(--aisth-role-v-glow, rgba(216,162,27,.30));
    }

    .l32-question-surface .l32-focus-token.is-negative {
      border: 1px solid rgba(205,72,82,.24);
      background: rgba(226,79,91,.12);
      color: #a82935;
      box-shadow: none;
    }

    .l32-answer-box {
      padding: 12px 10px 16px;
      background: #fff;
      border-color: #e4d8cc;
    }

    #quiz-area .l32-answer-box .aisth-slot-cell.is-negative-highlight {
      border-color: rgba(205,72,82,.62);
      border-bottom-color: #b6323f;
      background: linear-gradient(180deg,#fffafb 0%,#ffe2e6 100%);
      color: #9f2632;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 3px 8px rgba(190,48,61,.12);
    }

    #quiz-area .l32-answer-box .aisth-slot-cell.is-negative-highlight.is-slot-wrong {
      border-color: #bb2433;
      background: linear-gradient(180deg,#fff2f4 0%,#ffcfd5 100%);
      box-shadow: 0 0 0 2px rgba(198,43,57,.16), 0 0 12px rgba(198,43,57,.25);
    }

    #quiz-area .l32-answer-box .aisth-slot-cell.is-suffix-highlight {
      border-color: rgba(136,84,208,.76);
      border-bottom-color: #6c3ac7;
      background: rgba(136,84,208,.16);
      color: #6c3ac7;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.78), inset 0 0 0 1px rgba(136,84,208,.24), 0 3px 8px rgba(108,58,199,.12);
    }

    #quiz-area .l32-answer-box .aisth-slot-cell.is-suffix-highlight.is-slot-wrong {
      border-color: #bb2433;
      border-bottom-color: #bb2433;
      background: linear-gradient(180deg,#fff2f4 0%,#ffcfd5 100%);
      color: #9f2632;
      box-shadow: 0 0 0 2px rgba(198,43,57,.16), 0 0 12px rgba(198,43,57,.25);
    }

    .l32-fixed-middle {
      display: inline-flex;
      align-items: center;
      min-height: 38px;
      padding: 0 2px;
      color: #34261d;
      font-size: 15px;
      font-weight: 800;
      line-height: 1;
    }

    .l32-hard-row {
      display: flex;
      justify-content: center;
      margin-bottom: 7px;
    }

    .l32-hard-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 3px 8px;
      border: 1px solid #b82f3c;
      border-radius: 999px;
      background: #d94754;
      color: #fff;
      font-size: 10px;
      font-weight: 950;
      letter-spacing: .08em;
      box-shadow: 0 3px 7px rgba(184,47,60,.18);
    }

    #quiz-area .l32-answer-box .l32-static-apostrophe {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      align-self: stretch;
      padding: 0 1px;
      color: #8b2630;
      font-size: 18px;
      font-weight: 950;
      line-height: 1;
    }

    .front-slot {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: baseline;
      margin: 0 5px;
      min-width: 30px;
      height: 1.15em;
      padding: 0 4px;
      border-radius: 4px;
      transition: background 0.12s ease, border-color 0.12s ease;
    }

    .front-slot.empty {
      color: transparent;
      border: 1px dashed rgba(126, 49, 6, 0.09);
      background: transparent;
    }

    .front-slot.hover {
      border-color: rgba(241, 123, 42, 0.35);
      background: rgba(241, 123, 42, 0.06);
    }

    .front-slot.ready {
      border: none;
      background: transparent;
    }

    .drag-token {
      display: inline-block;
      padding: 0 3px;
      border-radius: 4px;
      border: none;
      background: rgba(255, 208, 90, 0.45);
      color: #7e3106;
      font-weight: 900;
      white-space: nowrap;
      cursor: grab;
      user-select: none;
    }

    .drag-token:active { cursor: grabbing; }
    .drag-token.dragging {
      animation: slime-pull 0.32s ease-out;
      transform-origin: 50% 58%;
      filter: saturate(1.06);
    }
    .drag-token.hover-not {
      box-shadow: 0 0 0 1px rgba(196, 69, 58, 0.22) inset, 0 0 8px rgba(196, 69, 58, 0.2);
    }

    .drag-token.used-dim {
      opacity: 0.38;
      pointer-events: none;
      cursor: default;
      background: rgba(255, 208, 90, 0.2);
    }

    .drag-token.used-hide {
      display: none;
    }

    .verb-wrap {
      position: relative;
      display: inline-flex;
      align-items: baseline;
    }

    .aux-pop-token {
      position: absolute;
      left: -0.95em;
      top: -1.15em;
      display: inline-block;
      padding: 0 3px;
      border-radius: 4px;
      border: none;
      background: rgba(255, 208, 90, 0.56);
      color: #7e3106;
      font-weight: 900;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transform: translate(0, 6px) scale(0.86);
      transition: opacity 0.18s ease, transform 0.2s ease;
      user-select: none;
    }

    .aux-pop-token.ready {
      opacity: 1;
      pointer-events: auto;
      cursor: grab;
      transform: translate(0, 0) scale(1);
    }
    .aux-pop-token.hover-not {
      box-shadow: 0 0 0 1px rgba(196, 69, 58, 0.22) inset, 0 0 8px rgba(196, 69, 58, 0.2);
    }

    .aux-pop-token.dragging {
      animation: slime-pull 0.3s ease-out;
      transform-origin: 60% 62%;
    }

    .aux-pop-token.burst {
      animation: aux-burst 0.2s ease-out;
    }

    .aux-pop-token.used {
      display: none;
    }

    .aux-pop-token.lifted {
      opacity: 0;
    }

    .aux-pop-token.docked {
      position: static;
      left: auto;
      top: auto;
      opacity: 1;
      transform: none;
      pointer-events: none;
      margin-right: 2px;
    }

    .verb-wrap.split-open .drag-token {
      background: rgba(255, 208, 90, 0.24);
      color: rgba(126, 49, 6, 0.72);
    }

    .verb-wrap.split-open .aux-pop-token.ready {
      background: rgba(255, 208, 90, 0.32);
      color: rgba(126, 49, 6, 0.76);
    }

    .ghost-chip {
      display: inline;
      padding: 0 2px;
      border-radius: 4px;
      border: none;
      color: #7e3106;
      font-size: 14px;
      font-weight: 900;
      background: rgba(255, 208, 90, 0.55);
    }

    .ghost-chip.neg-glow,
    .drag-token.neg-glow,
    .aux-pop-token.neg-glow {
      color: #7b2a23;
      background: rgba(255, 221, 215, 0.75);
      box-shadow: 0 0 0 1px rgba(200, 82, 70, 0.2) inset, 0 0 8px rgba(210, 84, 71, 0.25);
      text-shadow: 0 0 6px rgba(210, 84, 71, 0.28);
    }

    .ko-neg-add {
      color: #7b2a23;
      background: rgba(255, 221, 215, 0.75);
      border-radius: 4px;
      padding: 0 1px;
      box-shadow: 0 0 0 1px rgba(200, 82, 70, 0.2) inset, 0 0 8px rgba(210, 84, 71, 0.25);
      text-shadow: 0 0 6px rgba(210, 84, 71, 0.28);
    }

    .not-row {
      margin-top: 2px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 6px;
    }

    .not-token {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 999px;
      border: 1px solid rgba(126, 49, 6, 0.22);
      background: rgba(255, 255, 255, 0.85);
      color: #7e3106;
      font-size: 12px;
      font-weight: 900;
      cursor: grab;
      user-select: none;
    }

    .not-token:active {
      cursor: grabbing;
    }

    .not-token.active {
      border-color: rgba(196, 69, 58, 0.45);
      background: rgba(255, 221, 215, 0.85);
      color: #7b2a23;
      box-shadow: 0 0 7px rgba(196, 69, 58, 0.22);
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

    textarea {
      resize: vertical;
      min-height: 58px;
    }

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

    @keyframes slime-pull {
      0% { transform: scale(1, 1); }
      38% { transform: scale(1.22, 0.8) skewX(-6deg); }
      72% { transform: scale(0.94, 1.1) skewX(3deg); }
      100% { transform: scale(1.04, 0.94); }
    }

    @keyframes aux-burst {
      0% { transform: translate(0.78em, 0.54em) scale(0.22, 0.88); opacity: 0.02; filter: blur(0.6px); }
      36% { transform: translate(0.2em, 0.16em) scale(1.22, 0.72); opacity: 1; filter: blur(0.2px); }
      68% { transform: translate(-0.03em, -0.04em) scale(0.93, 1.08); opacity: 1; filter: blur(0); }
      100% { transform: translate(0, 0) scale(1); opacity: 1; filter: blur(0); }
    }
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
  return L32_DIRECT_QUESTION_ROWS.map((row) => ({ ...row }));
}

function publishFrameDebugList() {
  if (!window.AisthLocalQuestionData || typeof window.AisthLocalQuestionData.publishDebugList !== "function") return;
  window.AisthLocalQuestionData.publishDebugList(questions, {
    label: PAGE_LABEL,
    source: "direct-js",
    title: "aisth-l3e2.js",
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
  let filtered = rawRows
    .filter((r) => Number(r["Lesson"]) === TARGET_LESSON && Number(r["Exercise"]) === TARGET_EXERCISE)
    .sort((a, b) => Number(a["QNumber"]) - Number(b["QNumber"]));

  filtered = [
    ...filtered.filter((row) => !L32_HARD_QUESTION_NUMBERS.has(Number(row["QNumber"]))),
    ...filtered.filter((row) => L32_HARD_QUESTION_NUMBERS.has(Number(row["QNumber"]))),
  ];

  if (MAX_QUESTIONS > 0) filtered = filtered.slice(0, MAX_QUESTIONS);

  const modeByType = deriveInstructionModeByType(filtered);

  const firstRowAnswer = cleanAnswerForScoring(normalizeEscapedBreaks(String(filtered[0]?.["Answer"] ?? "").trim()));
  const firstRewriteAnswer = cleanAnswerForScoring(normalizeEscapedBreaks(String(filtered.find((r) => detectType(normalizeEscapedBreaks(String(r["Question"] ?? "").trim())) === "rewrite")?.["Answer"] ?? "").trim()));
  const firstBlankAnswer = cleanAnswerForScoring(normalizeEscapedBreaks(String(filtered.find((r) => detectType(normalizeEscapedBreaks(String(r["Question"] ?? "").trim())) === "blank")?.["Answer"] ?? "").trim()));

  rewritePlaceholderExample = clipExample(stripEmphasisMarkers(firstRowAnswer || firstRewriteAnswer || "example"));
  blankPlaceholderExample = clipExample(stripEmphasisMarkers(firstRowAnswer || firstBlankAnswer || "answer"));

  questions = filtered.map((row, idx) => {
    const question = normalizeEscapedBreaks(String(row["Question"] ?? "").trim());
    const answerRaw = normalizeEscapedBreaks(String(row["Answer"] ?? "").trim());
    const fullAnswer = cleanAnswerForScoring(answerRaw);
    const answer = cleanAnswerForScoring(String(row["Target"] ?? fullAnswer));
    const title = stripEmphasisMarkers(normalizeEscapedBreaks(String(row["Title"] ?? "").trim()));
    const type = "blank";
    const parts = splitQuestionForDisplay(question);

    const fallbackInst = type === "blank" ? DEFAULT_BLANK_INSTRUCTION : DEFAULT_REWRITE_INSTRUCTION;
    const modeInst = modeByType[type] || fallbackInst;

    const qNumber = Number(row["QNumber"]) || idx + 1;
    const rawInstruction = normalizeEscapedBreaks(String(row["Instruction"] ?? "").trim());

    let instruction = rawInstruction || modeInst;
    if (qNumber === 1 && modeInst) instruction = modeInst;
    if (isInstructionLeakingAnswer(instruction, answer, type)) instruction = modeInst;

    return {
      no: idx + 1,
      qNumber,
      question,
      answer,
      instruction,
      title,
      type,
      questionEnglish: parts.english,
      questionKorean: parts.korean,
      focusRole: String(row["FocusRole"] || "negative"),
      fixedMiddle: String(row["FixedMiddle"] || ""),
      isHard: L32_HARD_QUESTION_NUMBERS.has(qNumber),
      fullAnswer,
      dragMeta: buildDragMetaForNegative(parts.english, fullAnswer),
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

const BE_VERBS = new Set(["am", "is", "are", "was", "were"]);
const KEEP_AUX = new Set(["can", "will", "should", "must", "may", "might", "could", "would", "shall"]);
const DO_AUX = new Set(["do", "does", "did"]);

function splitQuestionForDisplay(question) {
  const text = normalizeEscapedBreaks(String(question || "")).trim();
  const m = text.match(/^(.*?)(\(([^()]*)\))\s*$/s);
  if (m && /[가-힣]/.test(String(m[3] || ""))) {
    return {
      english: String(m[1] || "").trim(),
      korean: String(m[2] || "").trim(),
    };
  }
  return { english: text, korean: "" };
}

function cleanAnswerForScoring(raw) {
  let s = stripEmphasisMarkers(normalizeEscapedBreaks(String(raw ?? ""))).trim();
  if (!s) return "";

  const arrowParts = s.split(/(?:->|→)/);
  if (arrowParts.length > 1) s = String(arrowParts[arrowParts.length - 1] || "").trim();

  const outer = s.match(/^\((.*)\)$/);
  if (outer) s = String(outer[1] || "").trim();

  const tailNote = s.match(/^(.+?)\s*\([^)]*\)\s*$/);
  if (tailNote && tailNote[1].trim()) s = tailNote[1].trim();

  return s;
}

function buildDragMetaForNegative(questionEnglish, answer) {
  const raw = normalizeEscapedBreaks(String(questionEnglish || "")).trim();
  if (!raw || !/[A-Za-z]/.test(raw)) {
    return {
      canDrag: false,
      tokens: [],
      verbIndex: -1,
      ghostLead: "",
      keepSourceToken: false,
      baseVerb: "",
      insertIndex: 1,
    };
  }

  const plain = stripEmphasisMarkers(raw);
  const tokens = plain.split(/\s+/).filter(Boolean);
  if (!tokens.length) {
    return {
      canDrag: false,
      tokens: [],
      verbIndex: -1,
      ghostLead: "",
      keepSourceToken: false,
      baseVerb: "",
      insertIndex: 1,
    };
  }

  const answerWords = parseAnswerWords(answer);
  const neg = detectNegativeLeadFromAnswer(answerWords);
  if (!neg.supported) {
    return {
      canDrag: false,
      tokens,
      verbIndex: -1,
      ghostLead: "",
      keepSourceToken: false,
      baseVerb: "",
      insertIndex: 1,
    };
  }

  const qSubject = normalizeWordToken(tokens[0]);
  const aSubject = normalizeWordToken(answerWords[0] || "");
  if (!qSubject || !aSubject || qSubject !== aSubject) {
    return {
      canDrag: false,
      tokens,
      verbIndex: -1,
      ghostLead: "",
      keepSourceToken: false,
      baseVerb: "",
      insertIndex: 1,
    };
  }

  const verbIndex = detectVerbIndexForNegative(tokens, raw, neg);
  if (verbIndex < 0) {
    return {
      canDrag: false,
      tokens,
      verbIndex: -1,
      ghostLead: "",
      keepSourceToken: false,
      baseVerb: "",
      insertIndex: 1,
    };
  }

  return {
    canDrag: true,
    tokens,
    verbIndex,
    ghostLead: neg.aux,
    keepSourceToken: DO_AUX.has(neg.aux),
    baseVerb: DO_AUX.has(neg.aux) ? (neg.baseVerb || inferBaseVerbFromToken(tokens[verbIndex])) : "",
    insertIndex: 1,
  };
}

function detectNegativeLeadFromAnswer(answerWords) {
  const words = [...answerWords];
  for (let i = 0; i < words.length - 1; i++) {
    const w = normalizeWordToken(words[i]);
    const n = normalizeWordToken(words[i + 1]);
    if ((BE_VERBS.has(w) || KEEP_AUX.has(w) || DO_AUX.has(w)) && n === "not") {
      return {
        supported: true,
        aux: w,
        baseVerb: DO_AUX.has(w) ? normalizeWordToken(words[i + 2] || "") : "",
      };
    }
  }
  return { supported: false, aux: "", baseVerb: "" };
}

function detectVerbIndexForNegative(tokens, questionWithMarks, neg) {
  const norms = tokens.map((t) => normalizeWordToken(t));
  if (BE_VERBS.has(neg.aux) || KEEP_AUX.has(neg.aux)) {
    return norms.indexOf(neg.aux);
  }

  const emphasized = extractFirstEmphasisWord(questionWithMarks);
  if (emphasized) {
    const idx = norms.indexOf(emphasized);
    if (idx >= 0) return idx;
  }

  if (neg.baseVerb) {
    const forms = buildVerbForms(neg.baseVerb);
    for (let i = 0; i < norms.length; i++) {
      if (forms.has(norms[i])) return i;
    }
  }

  for (let i = 1; i < norms.length; i++) {
    if (/^[a-z]+$/.test(norms[i])) return i;
  }
  return -1;
}

function extractFirstEmphasisWord(questionWithMarks) {
  const m = String(questionWithMarks || "").match(/\*\*(.*?)\*\*/s);
  if (!m) return "";
  const first = String(m[1] || "").trim().split(/\s+/)[0] || "";
  return normalizeWordToken(first);
}

function inferBaseVerbFromToken(token) {
  const t = normalizeWordToken(token);
  if (!t) return "";
  if (t === "has") return "have";
  if (t === "does") return "do";
  if (t === "goes") return "go";
  if (t === "tries") return "try";
  if (t.endsWith("ies") && t.length > 3) return t.slice(0, -3) + "y";
  if (t.endsWith("es") && t.length > 2) return t.slice(0, -2);
  if (t.endsWith("s") && t.length > 1) return t.slice(0, -1);
  if (t.endsWith("ed") && t.length > 2) return t.slice(0, -2);
  return t;
}

function buildVerbForms(baseVerb) {
  const b = String(baseVerb || "").toLowerCase().trim();
  const out = new Set([b]);
  if (!b) return out;

  if (b === "have") out.add("has");
  if (b === "go") out.add("goes");
  if (b === "do") out.add("does");

  out.add(b + "s");
  out.add(b + "es");
  if (b.endsWith("y") && b.length > 1) out.add(b.slice(0, -1) + "ies");
  return out;
}

function parseAnswerWords(answer) {
  return canonicalizeNegationText(cleanAnswerForScoring(answer))
    .toLowerCase()
    .match(/[a-z']+/g) || [];
}

function canonicalizeNegationText(value) {
  return String(value ?? "")
    .replace(/[’‘`]/g, "'")
    .replace(/\bcannot\b/gi, "can not")
    .replace(/\bcant\b/gi, "can not")
    .replace(/\bwont\b/gi, "will not")
    .replace(/\b(do|does|did|is|are|was|were|could|would|should|must|might|need|has|have|had)nt\b/gi, "$1 not")
    .replace(/\bwon't\b/gi, "will not")
    .replace(/\bshan't\b/gi, "shall not")
    .replace(/\bcan't\b/gi, "can not")
    .replace(/\bain't\b/gi, "is not")
    .replace(/\b([a-z]+)n't\b/gi, "$1 not")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeWordToken(token) {
  return String(token || "")
    .toLowerCase()
    .replace(/^[^a-z]+|[^a-z]+$/g, "");
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

function renderQuestion() {
  const area = document.getElementById("quiz-area");
  if (!area) return;

  const q = questions[currentIndex];
  if (!q) {
    showResultPopup();
    return;
  }

  isCurrentLocked = false;

  area.innerHTML = `
    <div class="q-label">Q. ${currentIndex + 1} / ${questions.length}</div>

    <div class="box l32-question-box">
      ${q.isHard ? '<div class="l32-hard-row"><span class="l32-hard-badge">HARD!</span></div>' : ""}
      <div class="question-instruction">${renderTextWithEmphasis(q.instruction || TEXT.INPUT_HINT_FALLBACK)}</div>
      <div class="sentence aisth-question-surface l32-question-surface">
        <div class="l32-line-en">${renderL32QuestionEmphasis(q.questionEnglish || q.question, q.focusRole)}</div>
        ${q.questionKorean ? `<div class="line-ko">${renderL32QuestionEmphasis(q.questionKorean, q.focusRole)}</div>` : ""}
      </div>
    </div>

    <div class="box aisth-letter-answer-box l32-answer-box">
      <div class="aisth-answer-tool-row">
        <span aria-hidden="true"></span>
        <span class="aisth-type-pill">type!</span>
        <span aria-hidden="true"></span>
      </div>
      <input id="user-answer" class="short-input l32-slot-source-input" type="text" autocomplete="off" inputmode="latin" lang="en" autocapitalize="none" spellcheck="false" />
      <div id="feedback" class="feedback"></div>
    </div>
  `;

  const input = document.getElementById("user-answer");
  const editableModelText = makeL32EditableModelText(q.answer);
  const slotInputControl = input && window.AisthInputSlots
    ? window.AisthInputSlots.enhance(input, {
      modelText: editableModelText,
      onEnter: () => updateL32SlotAnswerState(q, input, slotInputControl?.control),
    })
    : null;

  if (input) {
    if (slotInputControl) {
      const flowInput = slotInputControl.control?.querySelector(".aisth-slot-input");
      if (flowInput) {
        const rawTypingAllowance = Array.from(pickL32SlotModelText(q.answer)).length + 8;
        flowInput.maxLength = Math.max(flowInput.maxLength, rawTypingAllowance);
      }
      installL32StaticApostrophes(q.answer, slotInputControl.control);
      markL32NegativeSlots(q.answer, slotInputControl.control);
      markL32DoesSuffixSlots(q.answer, slotInputControl.control);
      installL32FixedMiddle(q, slotInputControl.control);
      input.addEventListener("input", () => updateL32SlotAnswerState(q, input, slotInputControl.control));
      updateL32SlotAnswerState(q, input, slotInputControl.control);
      slotInputControl.focus();
    } else {
      input.focus();
    }
  }
}

function renderL32QuestionEmphasis(value, focusRole) {
  const text = normalizeEscapedBreaks(String(value ?? ""));
  const roleClass = focusRole === "verb" ? "is-verb" : "is-negative";
  const re = /\*\*(.*?)\*\*/gs;
  let out = "";
  let last = 0;
  let match;

  while ((match = re.exec(text)) !== null) {
    out += escapeHtmlWithBreaks(text.slice(last, match.index));
    out += `<span class="l32-focus-token ${roleClass}">${escapeHtml(String(match[1] ?? "").trim())}</span>`;
    last = re.lastIndex;
  }

  out += escapeHtmlWithBreaks(text.slice(last));
  return out;
}

function updateL32SlotAnswerState(q, sourceInput, control) {
  if (!q || !sourceInput || !control || isCurrentLocked) return;

  const modelChars = getL32AnswerChars(pickL32SlotModelText(q.answer));
  const userChars = getL32AnswerChars(sourceInput.value);
  const cells = Array.from(control.querySelectorAll(".aisth-slot-cell"));
  let allCorrect = modelChars.length > 0 && userChars.length >= modelChars.length;

  cells.forEach((cell, idx) => {
    const userChar = userChars[idx] || "";
    const modelChar = modelChars[idx] || "";
    const isFilled = Boolean(userChar);
    const ok = isFilled && userChar.toLowerCase() === modelChar.toLowerCase();
    cell.classList.toggle("is-slot-correct", ok);
    cell.classList.toggle("is-slot-wrong", isFilled && !ok);
    if (!ok) allCorrect = false;
  });

  if (allCorrect) submitCurrentAnswer();
}

function installL32StaticApostrophes(modelText, control) {
  if (!control || !/[’']/.test(String(modelText || ""))) return;
  const words = pickL32SlotModelText(modelText).split(/\s+/).filter(Boolean);
  const shells = Array.from(control.querySelectorAll(".aisth-slot-shell"));

  words.forEach((word, wordIndex) => {
    const shell = shells[wordIndex];
    if (!shell) return;
    const cells = Array.from(shell.querySelectorAll(".aisth-slot-cell"));
    let letterIndex = 0;

    Array.from(word).forEach((char) => {
      if (!/[’']/.test(char)) {
        letterIndex += 1;
        return;
      }
      const apostrophe = document.createElement("span");
      apostrophe.className = "l32-static-apostrophe";
      apostrophe.setAttribute("aria-hidden", "true");
      apostrophe.textContent = "'";
      const previousCell = cells[Math.max(0, letterIndex - 1)];
      if (previousCell) previousCell.insertAdjacentElement("afterend", apostrophe);
      else shell.prepend(apostrophe);
    });
  });

  const flowInput = control?.querySelector(".aisth-slot-input");
  if (!flowInput) return;
  flowInput.addEventListener("beforeinput", (event) => {
    if (/[’']/.test(String(event.data || ""))) event.preventDefault();
  });
  flowInput.addEventListener("input", () => {
    if (!/[’']/.test(flowInput.value)) return;
    const nextValue = flowInput.value.replace(/[’']/g, "");
    flowInput.value = nextValue;
    try { flowInput.setSelectionRange(nextValue.length, nextValue.length); } catch (_) {}
  }, true);
}

function markL32NegativeSlots(modelText, control) {
  if (!control) return;
  const negativeWords = /^(?:don't|doesn't|didn't|isn't|aren't|can't|wasn't|not|no|nobody|nothing|never)$/i;
  const words = pickL32SlotModelText(modelText).split(/\s+/).filter(Boolean);
  const cells = Array.from(control.querySelectorAll(".aisth-slot-cell"));
  let offset = 0;

  words.forEach((word) => {
    const cleanWord = word.replace(/^[^A-Za-z']+|[^A-Za-z']+$/g, "");
    const length = Array.from(word.replace(/[’']/g, "")).length;
    if (negativeWords.test(cleanWord)) {
      for (let idx = offset; idx < offset + length; idx += 1) {
        if (cells[idx]) cells[idx].classList.add("is-negative-highlight");
      }
    }
    offset += length;
  });
}

function markL32DoesSuffixSlots(modelText, control) {
  if (!control) return;
  const words = pickL32SlotModelText(modelText).split(/\s+/).filter(Boolean);
  const cells = Array.from(control.querySelectorAll(".aisth-slot-cell"));
  let offset = 0;

  words.forEach((word) => {
    const cleanWord = word.replace(/^[^A-Za-z'’]+|[^A-Za-z'’]+$/g, "");
    const length = Array.from(word.replace(/[’']/g, "")).length;
    if (/^does(?:n['’]?t)?$/i.test(cleanWord)) {
      [offset + 2, offset + 3].forEach((idx) => {
        if (cells[idx]) cells[idx].classList.add("is-suffix-highlight");
      });
    }
    offset += length;
  });
}

function installL32FixedMiddle(q, control) {
  const fixedText = String(q?.fixedMiddle || "").trim();
  if (!fixedText || !control) return;
  const shells = Array.from(control.querySelectorAll(".aisth-slot-shell"));
  if (shells.length < 2) return;

  const fixed = document.createElement("span");
  fixed.className = "l32-fixed-middle";
  fixed.textContent = fixedText;
  const gap = shells[0].nextElementSibling;
  if (gap?.classList.contains("aisth-slot-word-gap")) gap.replaceWith(fixed);
  else shells[0].insertAdjacentElement("afterend", fixed);
}

function pickL32SlotModelText(value) {
  return String(value || "").replace(/[.?!~]+$/g, "").trim();
}

function makeL32EditableModelText(value) {
  return pickL32SlotModelText(value).replace(/[’']/g, "");
}

function getL32AnswerChars(value) {
  return Array.from(String(value || "").replace(/[\s’']/g, ""));
}

function renderDragSentenceHtml(q) {
  const meta = q.dragMeta;
  if (!meta?.canDrag) {
    return renderTextWithEmphasis(q.questionEnglish || q.question);
  }
  return renderDraggableLine(meta);
}

function renderDraggableLine(meta) {
  const parts = [];
  meta.tokens.forEach((token, idx) => {
    if (idx === meta.verbIndex) {
      if (meta.keepSourceToken) {
        parts.push(
          `<span class="verb-wrap"><span class="aux-pop-token" id="spawn-aux-token" draggable="false">${escapeHtml(meta.ghostLead)}</span><span class="drag-token" id="drag-verb-token" draggable="false">${escapeHtml(token)}</span></span>`
        );
        return;
      }
      parts.push(`<span class="drag-token" id="aux-direct-token" draggable="false">${escapeHtml(token)}</span>`);
      return;
    }

    parts.push(`<span>${escapeHtml(token)}</span>`);
  });

  return `<div class="drag-line">${parts.join(" ")}</div>`;
}

function renderKoreanLine(q) {
  if (!q?.questionKorean) return "";
  if (!notSelected || !q.dragMeta?.canDrag) return renderTextWithEmphasis(q.questionKorean);
  return renderNegativeKoreanWithEmphasis(q.questionKorean);
}

function refreshKoreanLine(q) {
  const el = document.getElementById("line-ko-text");
  if (!el) return;
  el.innerHTML = renderKoreanLine(q);
}

function renderNegativeKoreanWithEmphasis(value) {
  const text = normalizeEscapedBreaks(String(value ?? ""));
  const re = /\*\*(.*?)\*\*/s;
  const m = re.exec(text);
  if (!m) return renderTextWithEmphasis(value);

  const before = text.slice(0, m.index);
  const target = String(m[1] ?? "").trim();
  const afterStart = m.index + String(m[0] ?? "").length;
  const after = text.slice(afterStart);
  const negInfo = negateKoreanPhraseInfo(target);
  const negHtml = renderNegativeKoreanCoreHtml(negInfo);

  return `${escapeHtml(before)}<span class="focus-token">${negHtml}</span>${escapeHtml(after)}`;
}

function renderNegativeKoreanCoreHtml(info) {
  if (!info) return "";
  if (info.kind === "prefix") {
    const prefixRaw = String(info.prefix || "").trimEnd();
    const hasSpace = /\s$/.test(String(info.prefix || ""));
    return `<span class="ko-neg-add">${escapeHtml(prefixRaw)}</span>${hasSpace ? " " : ""}${escapeHtml(info.base || "")}`;
  }
  if (info.kind === "suffix") {
    return `${escapeHtml(info.base || "")}<span class="ko-neg-add">${escapeHtml(info.suffix || "")}</span>`;
  }
  return escapeHtml(info.text || "");
}

function negateKoreanPhraseInfo(phrase) {
  const src = String(phrase ?? "").trim();
  if (!src) return { kind: "plain", text: src };
  if (/^(안|못)\s/.test(src)) return { kind: "plain", text: src };

  const direct = new Map([
    ["좋아해", { kind: "prefix", prefix: "안 ", base: "좋아해", text: "안 좋아해" }],
    ["행복해", { kind: "suffix", base: "행복하", suffix: "지 않아", text: "행복하지 않아" }],
    ["있어", { kind: "plain", text: "없어" }],
    ["해", { kind: "prefix", prefix: "안 ", base: "해", text: "안 해" }],
    ["했어", { kind: "prefix", prefix: "안 ", base: "했어", text: "안 했어" }],
    ["배고파", { kind: "suffix", base: "배고프", suffix: "지 않아", text: "배고프지 않아" }],
    ["들어", { kind: "prefix", prefix: "안 ", base: "들어", text: "안 들어" }],
    ["됐어", { kind: "prefix", prefix: "안 ", base: "됐어", text: "안 됐어" }],
    ["웃어", { kind: "prefix", prefix: "안 ", base: "웃어", text: "안 웃어" }],
    ["외출해", { kind: "prefix", prefix: "안 ", base: "외출해", text: "안 외출해" }],
    ["봤어", { kind: "prefix", prefix: "안 ", base: "봤어", text: "안 봤어" }],
    ["말했어", { kind: "prefix", prefix: "안 ", base: "말했어", text: "안 말했어" }],
    ["열었어", { kind: "prefix", prefix: "안 ", base: "열었어", text: "안 열었어" }],
    ["먹어", { kind: "prefix", prefix: "안 ", base: "먹어", text: "안 먹어" }],
    ["한다", { kind: "prefix", prefix: "안 ", base: "한다", text: "안 한다" }],
    ["말한다", { kind: "prefix", prefix: "안 ", base: "말한다", text: "안 말한다" }],
    ["했다", { kind: "prefix", prefix: "안 ", base: "했다", text: "안 했다" }],
  ]);
  if (direct.has(src)) return direct.get(src);

  if (src.endsWith("있어")) return { kind: "plain", text: `${src.slice(0, -2)}없어` };
  if (src.endsWith("있다")) return { kind: "plain", text: `${src.slice(0, -2)}없다` };
  if (src.endsWith("해")) return { kind: "prefix", prefix: "안 ", base: src, text: `안 ${src}` };
  if (src.endsWith("한다")) return { kind: "prefix", prefix: "안 ", base: src, text: `안 ${src}` };

  return { kind: "prefix", prefix: "안 ", base: src, text: `안 ${src}` };
}

function wireNotToken(q) {
  const btn = document.getElementById("not-token-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    if (isCurrentLocked) return;
    const ok = tryAttachNotToTarget(q);
    if (!ok && q.dragMeta?.keepSourceToken) {
      showToast("no", TEXT.PICK_VERB_FIRST);
    }
  });
}

function wireDragUI(q) {
  const meta = q.dragMeta;
  if (!meta?.canDrag) return;

  const token = document.getElementById("drag-verb-token");
  const auxToken = document.getElementById("spawn-aux-token");
  const directAux = document.getElementById("aux-direct-token");
  const notToken = document.getElementById("not-token-btn");
  if (!notToken) return;

  let dragGhostNode = null;
  let draggingNot = false;

  if (meta.keepSourceToken && token && auxToken) {
    token.addEventListener("click", () => revealAuxToken(auxToken, q));
    token.addEventListener("dragstart", (ev) => ev.preventDefault());
  } else if (directAux) {
    dragLead = q.dragMeta?.ghostLead || normalizeWordToken(directAux.textContent || "");
  }

  notToken.addEventListener("dragstart", (ev) => {
    if (isCurrentLocked) {
      ev.preventDefault();
      return;
    }
    if (meta.keepSourceToken && (!auxToken || !auxToken.classList.contains("ready"))) {
      showToast("no", TEXT.PICK_VERB_FIRST);
      ev.preventDefault();
      return;
    }

    draggingNot = true;
    dragGhostNode = createDragGhostNode("not");

    if (ev.dataTransfer) {
      ev.dataTransfer.setData("text/plain", "not");
      ev.dataTransfer.effectAllowed = "move";
      ev.dataTransfer.setDragImage(dragGhostNode, 14, 8);
    }
  });

  notToken.addEventListener("dragend", () => {
    draggingNot = false;
    clearNotHover(auxToken, directAux);
    if (dragGhostNode) {
      dragGhostNode.remove();
      dragGhostNode = null;
    }
  });

  bindNotDropTarget(auxToken, () => meta.keepSourceToken && !!auxToken?.classList.contains("ready"), () => {
    if (isCurrentLocked || !draggingNot) return;
    if (dragGhostNode) {
      dragGhostNode.remove();
      dragGhostNode = null;
    }
    draggingNot = false;
    applyNotToTarget(q, auxToken);
  });

  bindNotDropTarget(directAux, () => !meta.keepSourceToken, () => {
    if (isCurrentLocked || !draggingNot) return;
    if (dragGhostNode) {
      dragGhostNode.remove();
      dragGhostNode = null;
    }
    draggingNot = false;
    applyNotToTarget(q, directAux);
  });
}

function bindNotDropTarget(targetEl, canDropFn, onDropped) {
  if (!targetEl) return;

  targetEl.addEventListener("dragover", (ev) => {
    if (!canDropFn()) return;
    ev.preventDefault();
    targetEl.classList.add("hover-not");
  });
  targetEl.addEventListener("dragleave", () => targetEl.classList.remove("hover-not"));
  targetEl.addEventListener("drop", (ev) => {
    if (!canDropFn()) return;
    ev.preventDefault();
    targetEl.classList.remove("hover-not");
    onDropped();
  });
}

function clearNotHover(auxToken, directAux) {
  if (auxToken) auxToken.classList.remove("hover-not");
  if (directAux) directAux.classList.remove("hover-not");
}

function tryAttachNotToTarget(q) {
  const target = resolveNotTarget(q);
  if (!target) return false;
  applyNotToTarget(q, target);
  return true;
}

function resolveNotTarget(q) {
  if (q.dragMeta?.keepSourceToken) {
    const auxToken = document.getElementById("spawn-aux-token");
    if (!auxToken || !auxToken.classList.contains("ready")) return null;
    return auxToken;
  }
  return document.getElementById("aux-direct-token");
}

function applyNotToTarget(q, targetEl) {
  if (!q.dragMeta?.canDrag || !targetEl) return;

  dragLead = q.dragMeta?.ghostLead || dragLead || "";
  if (!dragLead) return;

  notSelected = true;
  dragPlaced = true;

  const notBtn = document.getElementById("not-token-btn");
  if (notBtn) notBtn.classList.add("active");

  targetEl.classList.remove("hover-not");
  updateLeadVisual(q);

  const input = document.getElementById("user-answer");
  if (input) input.focus();
}

function revealAuxToken(auxToken, q) {
  if (!auxToken) return;
  const wrap = auxToken.closest(".verb-wrap");

  dragLead = q.dragMeta?.ghostLead || dragLead || "";

  auxToken.classList.remove("used");
  auxToken.classList.add("ready");
  auxToken.classList.remove("docked");
  auxToken.setAttribute("draggable", "false");
  auxToken.textContent = getComposedLead(q);
  if (wrap) wrap.classList.add("split-open");

  auxToken.classList.remove("burst");
  void auxToken.offsetWidth;
  auxToken.classList.add("burst");
}

function createDragGhostNode(text) {
  const node = document.createElement("span");
  node.textContent = text;
  node.style.position = "fixed";
  node.style.left = "-9999px";
  node.style.top = "-9999px";
  node.style.pointerEvents = "none";
  node.style.display = "inline-block";
  node.style.padding = "0 4px";
  node.style.borderRadius = "4px";
  node.style.fontWeight = "900";
  node.style.fontSize = "14px";
  node.style.color = "#7e3106";
  node.style.background = "rgba(255, 208, 90, 0.55)";
  node.style.boxShadow = "inset 0 0 0 1px rgba(160, 110, 0, 0.15)";
  document.body.appendChild(node);
  return node;
}

function getComposedLead(q) {
  const base = dragLead || q.dragMeta?.ghostLead || "";
  if (!base) return "";
  return notSelected ? `${base} not` : base;
}

function isDoNotLead(lead) {
  return /\b(do|does|did)\s+not\b/i.test(String(lead || ""));
}

function updateLeadVisual(q) {
  const lead = getComposedLead(q);
  if (!lead) return;
  const doNotGlow = isDoNotLead(lead);
  const hasNot = /\bnot\b/i.test(lead);
  const auxToken = document.getElementById("spawn-aux-token");
  const directAux = document.getElementById("aux-direct-token");
  const verbToken = document.getElementById("drag-verb-token");

  if (q.dragMeta?.keepSourceToken) {
    if (auxToken && auxToken.classList.contains("ready")) {
      auxToken.textContent = lead;
      auxToken.classList.toggle("neg-glow", doNotGlow);
      auxToken.classList.toggle("docked", hasNot);
    }
    if (verbToken) {
      verbToken.classList.add("used-dim");
      verbToken.classList.toggle("neg-glow", doNotGlow);
    }
  } else if (directAux) {
    directAux.textContent = lead;
    directAux.classList.add("neg-glow");
  }

  refreshKoreanLine(q);
}

function submitCurrentAnswer() {
  if (isCurrentLocked) return;

  const q = questions[currentIndex];
  const input = document.getElementById("user-answer");
  const submitBtn = document.getElementById("submit-btn");
  const nextBtn = document.getElementById("next-btn");
  const feedback = document.getElementById("feedback");

  if (!q || !input) return;

  const userRaw = String(input.value || "").trim();
  if (!userRaw) {
    showToast("no", TEXT.INPUT_REQUIRED);
    return;
  }
  const ok = isAnswerCorrect(q.type, userRaw, q.answer);

  if (!ok) {
    if (feedback) {
      feedback.className = "feedback";
      feedback.innerHTML = "";
    }
    showToast("no", TEXT.WRONG);
    return;
  }

  isCurrentLocked = true;
  input.disabled = true;
  if (window.AisthInputSlots) window.AisthInputSlots.setDisabled(input, true);
  if (submitBtn) submitBtn.disabled = true;
  scheduleAutoNext();
  results.push({
    no: currentIndex + 1,
    qNumber: q.qNumber,
    type: q.type,
    question: q.question,
    selected: userRaw,
    answer: q.answer,
    instruction: q.instruction,
    correct: true,
  });

  if (feedback) {
    feedback.className = "feedback";
    feedback.innerHTML = "";
  }

  storeLatestResultSnapshot();
  showToast("ok", TEXT.CORRECT);
}

function scheduleAutoNext() {
  const solvedIndex = currentIndex;
  window.setTimeout(() => {
    if (isCurrentLocked && currentIndex === solvedIndex) goNext();
  }, 700);
}

function goNext() {
  currentIndex += 1;
  if (currentIndex >= questions.length) {
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
  let s = canonicalizeNegationText(
    stripEmphasisMarkers(normalizeEscapedBreaks(String(value ?? "")))
      .replace(/[“”]/g, '"')
  )
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







