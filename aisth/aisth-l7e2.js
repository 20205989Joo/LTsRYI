// aisth-l7e2.js
// Independent runtime for Aisth Lesson 7 Exercise 2

const TARGET_LESSON = 7;
const TARGET_EXERCISE = 2;
const PAGE_LABEL = "Aisth L7-E2";
const MAX_QUESTIONS = 0; // 0 = unlimited

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

const L72_ROLE_ORDER = ["S", "V", "T", "D"];
const L72_ROLE_LABELS = {
  S: "누가",
  V: "어떤 행동",
  T: "무엇을·누구에게",
  D: "언제·어디서·어떻게",
};

const L72_TOKEN_ROWS = [
  { sentence: "She cleaned the room.", roles: { S: "She", V: "cleaned", T: "the room" } },
  { sentence: "He runs every morning.", roles: { S: "He", V: "runs", D: "every morning" } },
  { sentence: "She gave me a book.", roles: { S: "She", V: "gave", T: "me", D: "a book" } },
  { sentence: "She cleaned the room and he rested quietly.", parts: [{ text: "She", role: "S" }, { text: "cleaned", role: "V" }, { text: "the room", role: "T" }, { text: "and", fixed: "connector" }, { text: "he", role: "S" }, { text: "rested", role: "V" }, { text: "quietly", role: "D" }] },
  { sentence: "They arrived early and we opened the gate.", parts: [{ text: "They", role: "S" }, { text: "arrived", role: "V" }, { text: "early", role: "D" }, { text: "and", fixed: "connector" }, { text: "we", role: "S" }, { text: "opened", role: "V" }, { text: "the gate", role: "T" }] },
  { sentence: "I think that she finished the work yesterday.", parts: [{ text: "I", role: "S" }, { text: "think", role: "V" }, { text: "that", fixed: "that" }, { text: "she", role: "S" }, { text: "finished", role: "V" }, { text: "the work", role: "T" }, { text: "yesterday", role: "D" }] },
  { sentence: "He fixed the bike and she smiled brightly.", parts: [{ text: "He", role: "S" }, { text: "fixed", role: "V" }, { text: "the bike", role: "T" }, { text: "and", fixed: "connector" }, { text: "she", role: "S" }, { text: "smiled", role: "V" }, { text: "brightly", role: "D" }] },
  { sentence: "We met at the station and they brought the documents.", parts: [{ text: "We", role: "S" }, { text: "met", role: "V" }, { text: "at the station", role: "D" }, { text: "and", fixed: "connector" }, { text: "they", role: "S" }, { text: "brought", role: "V" }, { text: "the documents", role: "T" }] },
  { sentence: "She said that he sent me the file yesterday.", parts: [{ text: "She", role: "S" }, { text: "said", role: "V" }, { text: "that", fixed: "that" }, { text: "he", role: "S" }, { text: "sent", role: "V" }, { text: "me", role: "T" }, { text: "the file yesterday", role: "D" }] },
  { sentence: "They cooked dinner and we ate outside.", parts: [{ text: "They", role: "S" }, { text: "cooked", role: "V" }, { text: "dinner", role: "T" }, { text: "and", fixed: "connector" }, { text: "we", role: "S" }, { text: "ate", role: "V" }, { text: "outside", role: "D" }] },
  { sentence: "The baby slept peacefully and his mother closed the door.", parts: [{ text: "The baby", role: "S" }, { text: "slept", role: "V" }, { text: "peacefully", role: "D" }, { text: "and", fixed: "connector" }, { text: "his mother", role: "S" }, { text: "closed", role: "V" }, { text: "the door", role: "T" }] },
  { sentence: "I know that they elected him president yesterday.", parts: [{ text: "I", role: "S" }, { text: "know", role: "V" }, { text: "that", fixed: "that" }, { text: "they", role: "S" }, { text: "elected", role: "V" }, { text: "him", role: "T" }, { text: "president yesterday", role: "D" }] },
  { sentence: "We opened the box and she found a letter inside.", parts: [{ text: "We", role: "S" }, { text: "opened", role: "V" }, { text: "the box", role: "T" }, { text: "and", fixed: "connector" }, { text: "she", role: "S" }, { text: "found", role: "V" }, { text: "a letter", role: "T" }, { text: "inside", role: "D" }] },
  { sentence: "He arrived late and I gave him the key.", parts: [{ text: "He", role: "S" }, { text: "arrived", role: "V" }, { text: "late", role: "D" }, { text: "and", fixed: "connector" }, { text: "I", role: "S" }, { text: "gave", role: "V" }, { text: "him", role: "T" }, { text: "the key", role: "D" }] },
  { sentence: "She believes that we made the plan better today.", parts: [{ text: "She", role: "S" }, { text: "believes", role: "V" }, { text: "that", fixed: "that" }, { text: "we", role: "S" }, { text: "made", role: "V" }, { text: "the plan", role: "T" }, { text: "better today", role: "D" }] },
];

let subcategory = "Grammar";
let level = "aisth";
let day = "027";
let quizTitle = "quiz_Grammar_aisth_l7e2";
let userId = "";

let rawRows = [];
let questions = [];
let currentIndex = 0;
let results = [];
let isCurrentLocked = false;
let rewritePlaceholderExample = "";
let blankPlaceholderExample = "";
let selectedTokenId = "";
let aimedWordId = "";
let tokenAssignments = {};
let tokenWrongRoles = new Set();
let l72ViewportScrollLeft = 0;
let l72DidDrag = false;
let l72IsZoomed = false;
let l72ShouldCenterAim = false;
let l72ZoomTransitioning = false;
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

  questions = buildL72TokenQuestions();
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

    .l72-shell {
      --l72-s:#2f8f55; --l72-s-bg:#e2f7e8;
      --l72-v:#9a6300; --l72-v-bg:#fff2bd;
      --l72-t:#bd2c32; --l72-t-bg:#ffe1e1;
      --l72-d:#202020; --l72-d-bg:#ececec;
      display:grid;
      gap:8px;
      min-height:390px;
    }

    .l72-overview-stage {
      min-height:286px;
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      gap:20px;
      padding:24px 18px;
      box-sizing:border-box;
      border:2px solid rgba(44,41,38,.78);
      border-radius:19px;
      background:linear-gradient(180deg,rgba(255,255,255,.96),rgba(247,240,229,.94));
      box-shadow:inset 0 0 34px rgba(35,30,26,.08),0 10px 22px rgba(70,45,25,.12);
    }

    .l72-overview-kicker,
    .l72-original-kicker {
      color:#8b7766;
      font-size:9px;
      line-height:1;
      font-weight:950;
      letter-spacing:.16em;
    }

    .l72-overview-sentence {
      appearance:none;
      width:100%;
      padding:14px 4px;
      border:0;
      background:transparent;
      color:#201c18;
      font-size:clamp(15px,4.7vw,19px);
      font-family:inherit;
      line-height:1.5;
      font-weight:950;
      letter-spacing:-.025em;
      white-space:normal;
      text-align:center;
      cursor:pointer;
    }

    .l72-overview-copy {
      display:block;
      width:100%;
      white-space:normal;
      overflow-wrap:normal;
      word-break:keep-all;
      transform-origin:0 50%;
      will-change:transform,opacity;
    }

    .l72-overview-stage.is-zooming .l72-overview-kicker,
    .l72-overview-stage.is-zooming .l72-zoom-btn {
      opacity:0;
      transition:opacity .18s ease;
    }

    .l72-overview-stage.is-zooming .l72-overview-sentence {
      pointer-events:none;
    }

    .l72-overview-stage.is-zooming .l72-overview-copy {
      animation:l72-sentence-zoom-in .52s cubic-bezier(.16,.84,.18,1) both;
    }

    @keyframes l72-sentence-zoom-in {
      0% { transform:translateX(0) scale(1); opacity:1; }
      18% { transform:translateX(calc(var(--l72-zoom-x,0px) * .08)) scale(1.08); opacity:1; }
      76% { transform:translateX(calc(var(--l72-zoom-x,0px) * .72)) scale(1.78); opacity:1; }
      100% { transform:translateX(var(--l72-zoom-x,0px)) scale(2.12); opacity:.16; }
    }

    .l72-zoom-btn {
      min-width:94px;
      padding:8px 18px;
      border:1px solid rgba(126,49,6,.30);
      border-radius:999px;
      background:#2c2926;
      color:#fff7ef;
      font-size:11px;
      font-weight:950;
      letter-spacing:.08em;
      cursor:pointer;
      box-shadow:0 6px 13px rgba(35,29,24,.18);
    }

    .l72-original-line {
      min-height:42px;
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      gap:5px;
      padding:5px 10px 7px;
      color:#fff6df;
      font-size:13px;
      line-height:1.25;
      font-weight:900;
      text-align:center;
      text-shadow:0 1px 2px rgba(0,0,0,.70);
      background:linear-gradient(90deg,transparent 0%,rgba(32,23,17,.58) 18%,rgba(32,23,17,.76) 50%,rgba(32,23,17,.58) 82%,transparent 100%);
    }

    .l72-original-line .l72-original-kicker {
      color:#ffd778;
      text-shadow:0 0 9px rgba(255,198,62,.28);
    }

    .is-role-s { --role-color:var(--l72-s); --role-bg:var(--l72-s-bg); }
    .is-role-v { --role-color:var(--l72-v); --role-bg:var(--l72-v-bg); }
    .is-role-t { --role-color:var(--l72-t); --role-bg:var(--l72-t-bg); }
    .is-role-d { --role-color:var(--l72-d); --role-bg:var(--l72-d-bg); }

    .l72-fps-frame {
      position:relative;
      height:286px;
      overflow:hidden;
      border:2px solid #2c2926;
      border-radius:19px;
      background:
        linear-gradient(180deg,rgba(255,255,255,.94),rgba(246,238,224,.92)),
        repeating-linear-gradient(90deg,transparent 0 46px,rgba(66,55,45,.035) 47px 48px);
      box-shadow:inset 0 0 38px rgba(35,30,26,.13),0 10px 22px rgba(70,45,25,.13);
      isolation:isolate;
    }

    .l72-fps-viewport {
      position:absolute;
      inset:0;
      z-index:1;
      overflow-x:auto;
      overflow-y:hidden;
      scrollbar-width:none;
      cursor:grab;
      touch-action:pan-x;
      user-select:none;
    }
    .l72-fps-viewport::-webkit-scrollbar { display:none; }
    .l72-fps-viewport.is-dragging { cursor:grabbing; }

    .l72-sentence-track {
      display:inline-flex;
      align-items:center;
      gap:10px;
      width:max-content;
      min-width:max-content;
      height:100%;
      padding:44px 160px 112px;
      box-sizing:border-box;
      white-space:nowrap;
      font-family:inherit;
    }

    .l72-word-target {
      appearance:none;
      position:relative;
      display:inline-flex;
      align-items:center;
      isolation:isolate;
      min-height:58px;
      padding:8px 2px;
      border:0;
      border-radius:0;
      background:transparent;
      color:var(--role-color,#171411);
      box-shadow:none;
      font-size:32px;
      font-family:inherit;
      line-height:1.1;
      font-weight:950;
      letter-spacing:-.025em;
      white-space:nowrap;
      cursor:crosshair;
      transform:scale(1);
      transition:transform .18s ease,box-shadow .18s ease,background .18s ease;
    }
    .l72-word-target.is-aimed {
      transform:scale(1.10);
      text-shadow:0 0 12px rgba(241,123,42,.28),0 2px 0 rgba(255,255,255,.9);
      z-index:2;
    }
    .l72-word-target.has-role {
      color:var(--role-color);
      background:transparent;
      text-shadow:0 0 5px var(--role-color),0 0 17px var(--role-bg);
    }
    .l72-word-target.has-role::before {
      content:"";
      position:absolute;
      z-index:-1;
      inset:-11px -15px;
      border-radius:50%;
      background:radial-gradient(ellipse,var(--role-bg) 0 34%,transparent 74%);
      filter:blur(4px);
      opacity:.96;
      pointer-events:none;
    }
    .l72-word-target.is-wrong { animation:l72-word-shake .32s ease; color:#c42832; text-decoration:underline wavy rgba(196,40,50,.72); }
    .l72-word-target.is-correct { text-shadow:0 0 11px rgba(47,143,85,.24); }

    .l72-fixed-word {
      position:relative;
      display:inline-flex;
      align-items:center;
      min-height:58px;
      padding:8px 2px;
      font-size:32px;
      line-height:1.1;
      font-weight:950;
      letter-spacing:-.025em;
      white-space:nowrap;
    }
    .l72-fixed-word.is-connector {
      color:#b46500;
      text-shadow:0 0 6px #ffe8b8,0 0 18px rgba(231,193,135,.78);
    }
    .l72-fixed-word.is-that {
      background:linear-gradient(90deg,#f17b2a 0%,#ffd84a 52%,#f5a400 100%);
      -webkit-background-clip:text;
      background-clip:text;
      color:transparent;
      -webkit-text-fill-color:transparent;
      filter:drop-shadow(0 0 5px rgba(255,205,54,.54)) drop-shadow(0 1px 0 rgba(126,49,6,.16));
    }

    @keyframes l72-word-shake {
      25%{transform:translateX(-4px)} 50%{transform:translateX(4px)} 75%{transform:translateX(-2px)}
    }

    .l72-spray-rack {
      position:absolute;
      z-index:9;
      left:0;
      right:0;
      bottom:-7px;
      display:flex;
      align-items:flex-end;
      justify-content:center;
      gap:2px;
      height:112px;
      padding:0 7px;
      pointer-events:none;
    }

    .l72-role-spray {
      appearance:none;
      position:relative;
      width:60px;
      height:104px;
      padding:0;
      border:0;
      background:transparent;
      cursor:pointer;
      pointer-events:auto;
      filter:drop-shadow(0 7px 6px rgba(0,0,0,.22));
      transition:transform .16s ease,filter .16s ease;
    }

    .l72-spray-can {
      position:absolute;
      left:50%;
      bottom:0;
      width:44px;
      height:72px;
      overflow:hidden;
      border:2px solid #2d2925;
      border-radius:13px 13px 8px 8px;
      background:linear-gradient(90deg,#77716b 0%,#eee9df 17%,#b9b2aa 43%,#f8f4ec 63%,#827b74 100%);
      box-shadow:inset 0 2px 0 rgba(255,255,255,.72),inset 0 -8px 13px rgba(39,34,30,.16),0 0 13px var(--role-bg);
      transform:translateX(-50%);
    }

    .l72-spray-can::before {
      content:"";
      position:absolute;
      inset:25px 0 11px;
      background:linear-gradient(180deg,var(--role-bg,#ddd),var(--role-color,#555));
      border-top:2px solid rgba(255,255,255,.55);
      border-bottom:2px solid rgba(34,29,25,.20);
    }

    .l72-spray-can::after {
      content:"SPRAY";
      position:absolute;
      left:0;
      right:0;
      bottom:12px;
      color:rgba(31,27,24,.72);
      font:950 6px/1 sans-serif;
      letter-spacing:.08em;
      text-align:center;
    }

    .l72-spray-nozzle {
      position:absolute;
      top:10px;
      left:50%;
      width:28px;
      height:20px;
      border:2px solid #2d2925;
      border-radius:9px 9px 5px 5px;
      background:linear-gradient(90deg,#4d4945,#ece7dd 34%,#817b75 72%,#3c3936);
      box-shadow:inset 0 1px 0 rgba(255,255,255,.65);
      transform:translateX(-50%);
    }

    .l72-spray-nozzle::before {
      content:"";
      position:absolute;
      top:-5px;
      left:50%;
      width:12px;
      height:7px;
      border:2px solid #282522;
      border-radius:5px 5px 2px 2px;
      background:var(--role-color,#555);
      box-shadow:0 0 10px var(--role-bg,#ddd);
      transform:translateX(-50%);
    }

    .l72-spray-mist {
      position:absolute;
      left:50%;
      top:-26px;
      width:68px;
      height:68px;
      opacity:.24;
      background:radial-gradient(ellipse at 50% 100%,var(--role-color,#777) 0%,var(--role-bg,#ddd) 30%,transparent 72%);
      filter:blur(2px);
      transform:translateX(-50%);
      pointer-events:none;
    }

    .l72-spray-role {
      position:absolute;
      z-index:3;
      left:50%;
      bottom:34px;
      color:#211d19;
      font-size:20px;
      line-height:1;
      font-weight:1000;
      text-shadow:0 0 7px rgba(255,255,255,.92),0 0 12px var(--role-bg);
      transform:translateX(-50%);
      pointer-events:none;
    }

    .l72-role-spray:hover { transform:translateY(-4px);filter:drop-shadow(0 7px 9px var(--role-bg)); }
    .l72-role-spray:active { transform:translateY(3px) scale(.96); }
    .l72-role-spray:active .l72-spray-mist { opacity:.92;filter:blur(4px); }

    .l72-crosshair {
      position:absolute;
      z-index:7;
      top:42%;
      left:50%;
      width:32px;
      height:32px;
      border:2px solid rgba(191,31,38,.78);
      border-radius:50%;
      box-shadow:0 0 0 1px rgba(255,255,255,.86),0 0 11px rgba(191,31,38,.23);
      transform:translate(-50%,-50%);
      pointer-events:none;
    }
    .l72-crosshair::before,.l72-crosshair::after { content:"";position:absolute;left:50%;top:50%;background:#bf1f26;transform:translate(-50%,-50%); }
    .l72-crosshair::before { width:46px;height:2px; }
    .l72-crosshair::after { width:2px;height:46px; }

    .l72-guide {
      margin:2px 0 0;
      color:#cbb9a8;
      font-size:10px;
      font-weight:850;
      text-align:center;
    }

    @media (max-width:420px) {
      .l72-fps-frame { height:270px; }
      .l72-word-target,.l72-fixed-word { min-height:54px;padding:7px 2px;font-size:28px; }
      .l72-sentence-track { padding-inline:150px; }
      .l72-role-spray { width:57px; }
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
  if (!window.AisthLocalQuestionData || typeof window.AisthLocalQuestionData.getRows !== "function") {
    throw new Error("Aisth local question data is not loaded.");
  }
  return window.AisthLocalQuestionData.getRows(TARGET_LESSON, TARGET_EXERCISE);
}

function publishFrameDebugList() {
  if (!window.AisthLocalQuestionData || typeof window.AisthLocalQuestionData.publishDebugList !== "function") return;
  window.AisthLocalQuestionData.publishDebugList(questions, {
    label: PAGE_LABEL,
    source: "inline",
    title: "aisth-l7e2.js · token questions",
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

    return {
      no: idx + 1,
      qNumber,
      question,
      answer,
      instruction,
      title,
      type,
    };
  });
}

function buildL72TokenQuestions() {
  return L72_TOKEN_ROWS.map((row, index) => {
    const sourceParts = Array.isArray(row.parts)
      ? row.parts
      : L72_ROLE_ORDER.filter((role) => row.roles?.[role]).map((role) => ({ role, text:row.roles[role] }));
    let wordIndex = 0;
    const parts = sourceParts.map((part, partIndex) => {
      const text = String(part.text || "").trim();
      if (part.fixed) return { id:`l72-${index + 1}-f${partIndex + 1}`, text, fixed:String(part.fixed) };
      wordIndex += 1;
      return { id:`l72-${index + 1}-p${wordIndex}`, text, role:String(part.role || "") };
    });
    const words = parts.filter((part) => part.role);
    const range = L72_ROLE_ORDER.filter((role) => words.some((word) => word.role === role));
    return {
      no: index + 1,
      qNumber: index + 1,
      question: row.sentence,
      answer: words.map((word) => `${word.text}: ${word.role}`).join(" · "),
      instruction: "문장 토큰을 S·V·T·D 자리에 분류해보세요.",
      title: "S·V·T·D 토큰 분류",
      type: "token",
      range,
      roles: { ...(row.roles || {}) },
      parts,
      words,
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
  selectedTokenId = "";
  aimedWordId = "";
  tokenAssignments = {};
  tokenWrongRoles = new Set();
  l72ViewportScrollLeft = 0;
  l72DidDrag = false;
  l72IsZoomed = false;
  l72ShouldCenterAim = false;
  l72ZoomTransitioning = false;
  if (autoNextTimer) {
    window.clearTimeout(autoNextTimer);
    autoNextTimer = 0;
  }
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
  selectedTokenId = q.range[0] || "";
  aimedWordId = q.words[0]?.id || "";
  tokenAssignments = {};
  tokenWrongRoles = new Set();
  l72ViewportScrollLeft = 0;
  l72IsZoomed = false;
  l72ShouldCenterAim = true;
  l72ZoomTransitioning = false;
  renderL72TokenExercise(area, q);
}

function renderL72TokenExercise(area, q) {
  if (!l72IsZoomed) {
    renderL72Overview(area, q);
    return;
  }

  const displayParts = Array.isArray(q.parts) && q.parts.length ? q.parts : q.words;
  const wordHtml = displayParts.map((word, index) => {
    const punctuation = index === displayParts.length - 1 ? "." : "";
    if (word.fixed) {
      return `<span class="l72-fixed-word is-${escapeHtmlAttr(word.fixed)}">${escapeHtml(word.text)}${punctuation}</span>`;
    }
    const assignedRole = tokenAssignments[word.id] || "";
    const stateClasses = [
      assignedRole ? `is-role-${assignedRole.toLowerCase()} has-role` : "",
      tokenWrongRoles.has(word.id) ? "is-wrong" : "",
      isCurrentLocked ? "is-correct" : "",
      aimedWordId === word.id ? "is-aimed" : "",
    ].filter(Boolean).join(" ");
    return `<span class="l72-word-target ${stateClasses}" data-word-id="${word.id}">${escapeHtml(word.text)}${punctuation}</span>`;
  }).join("");
  const spraysHtml = q.range.map((role) => `
    <button class="l72-role-spray is-role-${role.toLowerCase()}" type="button" data-role="${role}" title="${escapeHtmlAttr(L72_ROLE_LABELS[role])}" aria-label="${role} ${escapeHtmlAttr(L72_ROLE_LABELS[role])}">
      <span class="l72-spray-mist" aria-hidden="true"></span>
      <span class="l72-spray-nozzle" aria-hidden="true"></span>
      <span class="l72-spray-can" aria-hidden="true"></span>
      <span class="l72-spray-role" aria-hidden="true">${role}</span>
    </button>
  `).join("");

  area.innerHTML = `
    <div class="q-label">Q. ${currentIndex + 1} / ${questions.length}</div>
    <section class="l72-shell">
      <div class="l72-original-line">
        <span class="l72-original-kicker">ORIGINAL</span>
        <span>${escapeHtml(q.question)}</span>
      </div>
        <div class="l72-fps-frame">
          <div class="l72-fps-viewport" id="l72-fps-viewport"><div class="l72-sentence-track">${wordHtml}</div></div>
          <div class="l72-crosshair" aria-hidden="true"></div>
          <div class="l72-spray-rack">${spraysHtml}</div>
        </div>
        <div class="l72-guide">문장을 좌우로 끌어 조준하고, 아래의 역할 스프레이를 바로 눌러보세요.</div>
    </section>
  `;

  wireL72TokenInteractions(area, q);
  restoreL72Viewport(area);
}

function renderL72Overview(area, q) {
  area.innerHTML = `
    <div class="q-label">Q. ${currentIndex + 1} / ${questions.length}</div>
    <section class="l72-shell">
      <div class="l72-overview-stage">
        <span class="l72-overview-kicker">FULL SENTENCE</span>
        <button class="l72-overview-sentence" id="l72-overview-sentence" type="button"><span class="l72-overview-copy">${escapeHtml(q.question)}</span></button>
        <button class="l72-zoom-btn" id="l72-zoom-btn" type="button">ZOOM</button>
      </div>
    </section>
  `;

  const openZoom = () => {
    if (l72ZoomTransitioning) return;
    l72ZoomTransitioning = true;
    const stage = area.querySelector(".l72-overview-stage");
    const sentence = area.querySelector("#l72-overview-sentence");
    const copy = sentence?.querySelector(".l72-overview-copy");
    if (stage && copy?.firstChild) {
      const copyRect = copy.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      const firstBreak = q.question.search(/\s/);
      const firstEnd = firstBreak > 0 ? firstBreak : q.question.length;
      const firstRange = document.createRange();
      firstRange.setStart(copy.firstChild, 0);
      firstRange.setEnd(copy.firstChild, firstEnd);
      const firstRect = firstRange.getBoundingClientRect();
      const firstCenterFromCopy = firstRect.left + firstRect.width / 2 - copyRect.left;
      const targetCenter = stageRect.left + stageRect.width / 2;
      const zoomX = targetCenter - (copyRect.left + firstCenterFromCopy * 2.12);
      copy.style.setProperty("--l72-zoom-x", `${Math.round(zoomX)}px`);
    }
    let didFinish = false;
    let fallbackTimer = 0;
    const finishZoom = () => {
      if (didFinish) return;
      didFinish = true;
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
      l72IsZoomed = true;
      l72ShouldCenterAim = true;
      l72ViewportScrollLeft = 0;
      renderL72TokenExercise(area, q);
      window.requestAnimationFrame(() => { l72ZoomTransitioning = false; });
    };
    copy?.addEventListener("animationend", finishZoom, { once:true });
    stage?.classList.add("is-zooming");
    fallbackTimer = window.setTimeout(finishZoom, 620);
  };
  area.querySelector("#l72-overview-sentence")?.addEventListener("click", openZoom);
  area.querySelector("#l72-zoom-btn")?.addEventListener("click", openZoom);
}

function wireL72TokenInteractions(area, q) {
  wireL72HorizontalDrag(area);
  area.querySelectorAll(".l72-role-spray").forEach((button) => {
    const role = button.dataset.role || "";
    button.addEventListener("click", () => {
      if (isCurrentLocked) return;
      selectedTokenId = role;
      rememberL72Viewport(area);
      assignL72RoleToWord(area, q, aimedWordId, role);
    });
  });
}

function rememberL72Viewport(area) {
  const viewport = area?.querySelector("#l72-fps-viewport");
  if (viewport) l72ViewportScrollLeft = viewport.scrollLeft;
}

function restoreL72Viewport(area) {
  const viewport = area?.querySelector("#l72-fps-viewport");
  if (!viewport) return;
  viewport.scrollLeft = l72ViewportScrollLeft;
  window.requestAnimationFrame(() => {
    const aimed = area.querySelector(`.l72-word-target[data-word-id="${aimedWordId}"]`);
    if (!aimed) return;
    if (l72ShouldCenterAim) {
      const viewportRect = viewport.getBoundingClientRect();
      const aimedRect = aimed.getBoundingClientRect();
      const targetCenter = aimedRect.left + aimedRect.width / 2;
      const crosshairCenter = viewportRect.left + viewportRect.width / 2;
      viewport.scrollLeft = Math.max(0, viewport.scrollLeft + Math.round(targetCenter - crosshairCenter));
      l72ViewportScrollLeft = viewport.scrollLeft;
      l72ShouldCenterAim = false;
      syncL72AimFromCrosshair(area);
      return;
    }
    viewport.scrollLeft = l72ViewportScrollLeft;
    const left = aimed.offsetLeft;
    const right = left + aimed.offsetWidth;
    const visibleLeft = viewport.scrollLeft + 20;
    const visibleRight = viewport.scrollLeft + viewport.clientWidth - 20;
    if (left < visibleLeft || right > visibleRight) {
      viewport.scrollLeft = Math.max(0, left - Math.round(viewport.clientWidth * .28));
      l72ViewportScrollLeft = viewport.scrollLeft;
    }
    syncL72AimFromCrosshair(area);
  });
}

function syncL72AimFromCrosshair(area) {
  const viewport = area?.querySelector("#l72-fps-viewport");
  const crosshair = area?.querySelector(".l72-crosshair");
  if (!viewport || !crosshair) return;
  const crosshairRect = crosshair.getBoundingClientRect();
  const crosshairX = crosshairRect.left + crosshairRect.width / 2;
  const targets = Array.from(viewport.querySelectorAll(".l72-word-target"));
  const aimed = targets.find((target) => {
    const rect = target.getBoundingClientRect();
    return crosshairX >= rect.left - 4 && crosshairX <= rect.right + 4;
  });
  aimedWordId = String(aimed?.dataset.wordId || "");
  targets.forEach((target) => target.classList.toggle("is-aimed", target === aimed));
}

function wireL72HorizontalDrag(area) {
  const viewport = area?.querySelector("#l72-fps-viewport");
  if (!viewport) return;
  let pointerId = null;
  let startX = 0;
  let startScroll = 0;
  let moved = false;

  viewport.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    startScroll = viewport.scrollLeft;
    moved = false;
    viewport.classList.add("is-dragging");
    viewport.setPointerCapture?.(pointerId);
  });
  viewport.addEventListener("pointermove", (event) => {
    if (pointerId !== event.pointerId) return;
    const delta = event.clientX - startX;
    if (Math.abs(delta) > 5) moved = true;
    if (!moved) return;
    l72DidDrag = true;
    viewport.scrollLeft = startScroll - delta;
    l72ViewportScrollLeft = viewport.scrollLeft;
    syncL72AimFromCrosshair(area);
  });
  const finishDrag = (event) => {
    if (pointerId !== event.pointerId) return;
    viewport.classList.remove("is-dragging");
    viewport.releasePointerCapture?.(pointerId);
    pointerId = null;
    l72ViewportScrollLeft = viewport.scrollLeft;
    syncL72AimFromCrosshair(area);
    window.setTimeout(() => { l72DidDrag = false; }, 0);
  };
  viewport.addEventListener("pointerup", finishDrag);
  viewport.addEventListener("pointercancel", finishDrag);
  viewport.addEventListener("wheel", (event) => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    event.preventDefault();
    viewport.scrollLeft += event.deltaY;
    l72ViewportScrollLeft = viewport.scrollLeft;
    syncL72AimFromCrosshair(area);
  }, { passive: false });
  viewport.addEventListener("scroll", () => {
    l72ViewportScrollLeft = viewport.scrollLeft;
    syncL72AimFromCrosshair(area);
  }, { passive: true });
}

function assignL72RoleToWord(area, q, wordId, role) {
  if (isCurrentLocked || !q.words.some((word) => word.id === wordId)) return;
  if (!L72_ROLE_ORDER.includes(role)) {
    if (!tokenAssignments[wordId]) return;
    delete tokenAssignments[wordId];
    tokenWrongRoles.delete(wordId);
    renderL72TokenExercise(area, q);
    return;
  }
  tokenAssignments[wordId] = role;
  tokenWrongRoles.delete(wordId);

  if (q.words.every((word) => tokenAssignments[word.id])) {
    evaluateL72TokenAssignments(area, q);
    return;
  }
  renderL72TokenExercise(area, q);
}

function evaluateL72TokenAssignments(area, q) {
  const wrongWords = q.words.filter((word) => tokenAssignments[word.id] !== word.role);
  tokenWrongRoles = new Set(wrongWords.map((word) => word.id));
  if (wrongWords.length) {
    showToast("no", TEXT.WRONG);
    renderL72TokenExercise(area, q);
    return;
  }

  isCurrentLocked = true;
  const selected = q.words.map((word) => `${word.text}:${tokenAssignments[word.id]}`).join(" · ");
  const nextResult = {
    no: currentIndex + 1,
    qNumber: q.qNumber,
    type: q.type,
    question: q.question,
    selected,
    answer: q.answer,
    instruction: q.instruction,
    correct: true,
  };
  const existingIndex = results.findIndex((item) => item.qNumber === q.qNumber);
  if (existingIndex >= 0) results.splice(existingIndex, 1, nextResult);
  else results.push(nextResult);
  renderL72TokenExercise(area, q);
  storeLatestResultSnapshot();
  showToast("ok", TEXT.CORRECT);
  scheduleAutoNext();
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







