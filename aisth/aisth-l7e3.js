// aisth-l7e3.js
// Independent runtime for Aisth Lesson 7 Exercise 3

const TARGET_LESSON = 7;
const TARGET_EXERCISE = 3;
const PAGE_LABEL = "Aisth L7-E3";
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

const L73_NESTED_BLUEPRINTS = [
  {
    english:"I think that you said that he told you that it was important.",
    korean:"나는 네가 그가 중요하다고 너에게 말했다고 말했다고 생각해.",
    prefixes:[
      { text:"I think", meaning:"나는 ~라고 생각한다" },
      { text:"you said", meaning:"너는 ~라고 말했다" },
      { text:"he told you", meaning:"그는 너에게 ~라고 말했다" },
    ],
    core:{ text:"it was important", meaning:"그것은 중요했다" },
  },
  {
    english:"She believes that the teacher knows that the answer is wrong.",
    korean:"그녀는 선생님이 답이 틀렸다는 걸 안다고 믿어.",
    prefixes:[
      { text:"She believes", meaning:"그녀는 ~라고 믿는다" },
      { text:"the teacher knows", meaning:"선생님은 ~라는 걸 안다" },
    ],
    core:{ text:"the answer is wrong", meaning:"그 답은 틀렸다" },
  },
  {
    english:"He said that he hopes that you understand that this is serious.",
    korean:"그는 네가 이것이 심각하다는 걸 이해하길 바란다고 말했다.",
    prefixes:[
      { text:"He said", meaning:"그는 ~라고 말했다" },
      { text:"he hopes", meaning:"그는 ~하기를 바란다" },
      { text:"you understand", meaning:"너는 ~라는 걸 이해한다" },
    ],
    core:{ text:"this is serious", meaning:"이것은 심각하다" },
  },
  {
    english:"She noticed that he realized that she had been watching him.",
    korean:"그녀는 그가 자신이 지켜보고 있었다는 걸 깨달았다는 걸 알아챘어.",
    prefixes:[
      { text:"She noticed", meaning:"그녀는 ~라는 걸 알아챘다" },
      { text:"he realized", meaning:"그는 ~라는 걸 깨달았다" },
    ],
    core:{ text:"she had been watching him", meaning:"그녀는 그를 지켜보고 있었다" },
  },
  {
    english:"I'm afraid that she thinks that you forgot that today is her birthday.",
    korean:"그녀는 네가 오늘이 자기 생일이라는 걸 잊었다고 생각하는 것 같아.",
    prefixes:[
      { text:"I'm afraid", meaning:"아무래도 ~인 것 같다" },
      { text:"she thinks", meaning:"그녀는 ~라고 생각한다" },
      { text:"you forgot", meaning:"너는 ~라는 걸 잊었다" },
    ],
    core:{ text:"today is her birthday", meaning:"오늘은 그녀의 생일이다" },
  },
  {
    english:"We know that Mina believes that her brother found the key.",
    korean:"우리는 미나가 자기 남동생이 열쇠를 찾았다고 믿는다는 걸 안다.",
    prefixes:[
      { text:"We know", meaning:"우리는 ~라는 걸 안다" },
      { text:"Mina believes", meaning:"미나는 ~라고 믿는다" },
    ],
    core:{ text:"her brother found the key", meaning:"그녀의 남동생이 열쇠를 찾았다" },
  },
  {
    english:"They heard that you said that the train had already left.",
    korean:"그들은 네가 기차가 이미 떠났다고 말했다는 걸 들었다.",
    prefixes:[
      { text:"They heard", meaning:"그들은 ~라는 걸 들었다" },
      { text:"you said", meaning:"너는 ~라고 말했다" },
    ],
    core:{ text:"the train had already left", meaning:"기차는 이미 떠났다" },
  },
  {
    english:"I remember that she promised that she would call me tonight.",
    korean:"나는 그녀가 오늘 밤 나에게 전화하겠다고 약속한 걸 기억한다.",
    prefixes:[
      { text:"I remember", meaning:"나는 ~라는 걸 기억한다" },
      { text:"she promised", meaning:"그녀는 ~하겠다고 약속했다" },
    ],
    core:{ text:"she would call me tonight", meaning:"그녀는 오늘 밤 나에게 전화할 것이다" },
  },
  {
    english:"He discovered that we knew that the door was locked.",
    korean:"그는 우리가 문이 잠겨 있다는 걸 알고 있었음을 알아냈다.",
    prefixes:[
      { text:"He discovered", meaning:"그는 ~라는 걸 알아냈다" },
      { text:"we knew", meaning:"우리는 ~라는 걸 알고 있었다" },
    ],
    core:{ text:"the door was locked", meaning:"문은 잠겨 있었다" },
  },
  {
    english:"She explained that the doctor said that the medicine would help.",
    korean:"그녀는 의사가 그 약이 도움이 될 거라고 말했다고 설명했다.",
    prefixes:[
      { text:"She explained", meaning:"그녀는 ~라고 설명했다" },
      { text:"the doctor said", meaning:"의사는 ~라고 말했다" },
    ],
    core:{ text:"the medicine would help", meaning:"그 약은 도움이 될 것이다" },
  },
  {
    english:"I heard that she thinks that the meeting starts at nine.",
    korean:"나는 그녀가 회의가 아홉 시에 시작한다고 생각한다는 걸 들었다.",
    prefixes:[
      { text:"I heard", meaning:"나는 ~라는 걸 들었다" },
      { text:"she thinks", meaning:"그녀는 ~라고 생각한다" },
    ],
    core:{ text:"the meeting starts at nine", meaning:"회의는 아홉 시에 시작한다" },
  },
  {
    english:"They believe that we know that the test will be difficult.",
    korean:"그들은 우리가 시험이 어려울 거라는 걸 안다고 믿는다.",
    prefixes:[
      { text:"They believe", meaning:"그들은 ~라고 믿는다" },
      { text:"we know", meaning:"우리는 ~라는 걸 안다" },
    ],
    core:{ text:"the test will be difficult", meaning:"시험은 어려울 것이다" },
  },
  {
    english:"He remembers that I said that Mina needed more time.",
    korean:"그는 내가 미나에게 시간이 더 필요하다고 말했다는 걸 기억한다.",
    prefixes:[
      { text:"He remembers", meaning:"그는 ~라는 걸 기억한다" },
      { text:"I said", meaning:"나는 ~라고 말했다" },
    ],
    core:{ text:"Mina needed more time", meaning:"미나는 시간이 더 필요했다" },
  },
  {
    english:"She discovered that her friend knew that the store was closed.",
    korean:"그녀는 자기 친구가 가게가 닫혀 있다는 걸 알고 있었음을 알아냈다.",
    prefixes:[
      { text:"She discovered", meaning:"그녀는 ~라는 걸 알아냈다" },
      { text:"her friend knew", meaning:"그녀의 친구는 ~라는 걸 알고 있었다" },
    ],
    core:{ text:"the store was closed", meaning:"가게는 닫혀 있었다" },
  },
  {
    english:"We hope that you understand that this rule is important.",
    korean:"우리는 네가 이 규칙이 중요하다는 걸 이해하기를 바란다.",
    prefixes:[
      { text:"We hope", meaning:"우리는 ~하기를 바란다" },
      { text:"you understand", meaning:"너는 ~라는 걸 이해한다" },
    ],
    core:{ text:"this rule is important", meaning:"이 규칙은 중요하다" },
  },
  {
    english:"The teacher explained that the students believed that the answer was correct.",
    korean:"선생님은 학생들이 그 답이 맞다고 믿었다고 설명했다.",
    prefixes:[
      { text:"The teacher explained", meaning:"선생님은 ~라고 설명했다" },
      { text:"the students believed", meaning:"학생들은 ~라고 믿었다" },
    ],
    core:{ text:"the answer was correct", meaning:"그 답은 맞았다" },
  },
  {
    english:"I realized that he knew that we had changed the plan.",
    korean:"나는 그가 우리가 계획을 바꿨다는 걸 알고 있었음을 깨달았다.",
    prefixes:[
      { text:"I realized", meaning:"나는 ~라는 걸 깨달았다" },
      { text:"he knew", meaning:"그는 ~라는 걸 알고 있었다" },
    ],
    core:{ text:"we had changed the plan", meaning:"우리는 계획을 바꿨다" },
  },
  {
    english:"She heard that they promised that they would arrive early.",
    korean:"그녀는 그들이 일찍 도착하겠다고 약속했다는 걸 들었다.",
    prefixes:[
      { text:"She heard", meaning:"그녀는 ~라는 걸 들었다" },
      { text:"they promised", meaning:"그들은 ~하겠다고 약속했다" },
    ],
    core:{ text:"they would arrive early", meaning:"그들은 일찍 도착할 것이다" },
  },
  {
    english:"He thinks that I know that you found his wallet.",
    korean:"그는 내가 네가 그의 지갑을 찾았다는 걸 안다고 생각한다.",
    prefixes:[
      { text:"He thinks", meaning:"그는 ~라고 생각한다" },
      { text:"I know", meaning:"나는 ~라는 걸 안다" },
    ],
    core:{ text:"you found his wallet", meaning:"너는 그의 지갑을 찾았다" },
  },
  {
    english:"They noticed that the manager said that the office would close early.",
    korean:"그들은 관리자가 사무실이 일찍 문을 닫을 거라고 말했다는 걸 알아챘다.",
    prefixes:[
      { text:"They noticed", meaning:"그들은 ~라는 걸 알아챘다" },
      { text:"the manager said", meaning:"관리자는 ~라고 말했다" },
    ],
    core:{ text:"the office would close early", meaning:"사무실은 일찍 문을 닫을 것이다" },
  },
];

const L73_KOREAN_CHUNK_BLUEPRINTS = [
  [
    { text:"나는", colorIndex:0 },
    { text:"네가", colorIndex:1 },
    { text:"그가", colorIndex:2 },
    { text:"중요하다고", colorIndex:3 },
    { text:"너에게 말했다고", colorIndex:2 },
    { text:"말했다고", colorIndex:1 },
    { text:"생각해.", colorIndex:0 },
  ],
  [
    { text:"그녀는", colorIndex:0 },
    { text:"선생님이", colorIndex:1 },
    { text:"답이 틀렸다는 걸", colorIndex:2 },
    { text:"안다고", colorIndex:1 },
    { text:"믿어.", colorIndex:0 },
  ],
  [
    { text:"그는", colorIndex:0 },
    { text:"네가", colorIndex:2 },
    { text:"이것이 심각하다는 걸", colorIndex:3 },
    { text:"이해하길", colorIndex:2 },
    { text:"바란다고", colorIndex:1 },
    { text:"말했다.", colorIndex:0 },
  ],
  [
    { text:"그녀는", colorIndex:0 },
    { text:"그가", colorIndex:1 },
    { text:"자신이 지켜보고 있었다는 걸", colorIndex:2 },
    { text:"깨달았다는 걸", colorIndex:1 },
    { text:"알아챘어.", colorIndex:0 },
  ],
  [
    { text:"그녀는", colorIndex:1 },
    { text:"네가", colorIndex:2 },
    { text:"오늘이 자기 생일이라는 걸", colorIndex:3 },
    { text:"잊었다고", colorIndex:2 },
    { text:"생각하는", colorIndex:1 },
    { text:"것 같아.", colorIndex:0 },
  ],
  [
    { text:"우리는", colorIndex:0 },
    { text:"미나가", colorIndex:1 },
    { text:"자기 남동생이 열쇠를 찾았다고", colorIndex:2 },
    { text:"믿는다는 걸", colorIndex:1 },
    { text:"안다.", colorIndex:0 },
  ],
  [
    { text:"그들은", colorIndex:0 },
    { text:"네가", colorIndex:1 },
    { text:"기차가 이미 떠났다고", colorIndex:2 },
    { text:"말했다는 걸", colorIndex:1 },
    { text:"들었다.", colorIndex:0 },
  ],
  [
    { text:"나는", colorIndex:0 },
    { text:"그녀가", colorIndex:1 },
    { text:"오늘 밤 나에게 전화하겠다고", colorIndex:2 },
    { text:"약속한 걸", colorIndex:1 },
    { text:"기억한다.", colorIndex:0 },
  ],
  [
    { text:"그는", colorIndex:0 },
    { text:"우리가", colorIndex:1 },
    { text:"문이 잠겨 있다는 걸", colorIndex:2 },
    { text:"알고 있었음을", colorIndex:1 },
    { text:"알아냈다.", colorIndex:0 },
  ],
  [
    { text:"그녀는", colorIndex:0 },
    { text:"의사가", colorIndex:1 },
    { text:"그 약이 도움이 될 거라고", colorIndex:2 },
    { text:"말했다고", colorIndex:1 },
    { text:"설명했다.", colorIndex:0 },
  ],
  [
    { text:"나는", colorIndex:0 },
    { text:"그녀가", colorIndex:1 },
    { text:"회의가 아홉 시에 시작한다고", colorIndex:2 },
    { text:"생각한다는 걸", colorIndex:1 },
    { text:"들었다.", colorIndex:0 },
  ],
  [
    { text:"그들은", colorIndex:0 },
    { text:"우리가", colorIndex:1 },
    { text:"시험이 어려울 거라는 걸", colorIndex:2 },
    { text:"안다고", colorIndex:1 },
    { text:"믿는다.", colorIndex:0 },
  ],
  [
    { text:"그는", colorIndex:0 },
    { text:"내가", colorIndex:1 },
    { text:"미나에게 시간이 더 필요하다고", colorIndex:2 },
    { text:"말했다는 걸", colorIndex:1 },
    { text:"기억한다.", colorIndex:0 },
  ],
  [
    { text:"그녀는", colorIndex:0 },
    { text:"자기 친구가", colorIndex:1 },
    { text:"가게가 닫혀 있다는 걸", colorIndex:2 },
    { text:"알고 있었음을", colorIndex:1 },
    { text:"알아냈다.", colorIndex:0 },
  ],
  [
    { text:"우리는", colorIndex:0 },
    { text:"네가", colorIndex:1 },
    { text:"이 규칙이 중요하다는 걸", colorIndex:2 },
    { text:"이해하기를", colorIndex:1 },
    { text:"바란다.", colorIndex:0 },
  ],
  [
    { text:"선생님은", colorIndex:0 },
    { text:"학생들이", colorIndex:1 },
    { text:"그 답이 맞다고", colorIndex:2 },
    { text:"믿었다고", colorIndex:1 },
    { text:"설명했다.", colorIndex:0 },
  ],
  [
    { text:"나는", colorIndex:0 },
    { text:"그가", colorIndex:1 },
    { text:"우리가 계획을 바꿨다는 걸", colorIndex:2 },
    { text:"알고 있었음을", colorIndex:1 },
    { text:"깨달았다.", colorIndex:0 },
  ],
  [
    { text:"그녀는", colorIndex:0 },
    { text:"그들이", colorIndex:1 },
    { text:"일찍 도착하겠다고", colorIndex:2 },
    { text:"약속했다는 걸", colorIndex:1 },
    { text:"들었다.", colorIndex:0 },
  ],
  [
    { text:"그는", colorIndex:0 },
    { text:"내가", colorIndex:1 },
    { text:"네가 그의 지갑을 찾았다는 걸", colorIndex:2 },
    { text:"안다고", colorIndex:1 },
    { text:"생각한다.", colorIndex:0 },
  ],
  [
    { text:"그들은", colorIndex:0 },
    { text:"관리자가", colorIndex:1 },
    { text:"사무실이 일찍 문을 닫을 거라고", colorIndex:2 },
    { text:"말했다는 걸", colorIndex:1 },
    { text:"알아챘다.", colorIndex:0 },
  ],
];

let subcategory = "Grammar";
let level = "aisth";
let day = "028";
let quizTitle = "quiz_Grammar_aisth_l7e3";
let userId = "";

let rawRows = [];
let questions = [];
let currentIndex = 0;
let results = [];
let isCurrentLocked = false;
let rewritePlaceholderExample = "";
let blankPlaceholderExample = "";
let l73Stage = "erase";
let l73RemovedThatIndexes = new Set();
let l73ExtractedClauseIndexes = [];
let l73SelectedClauseIndex = -1;
let l73ClauseTransitioning = false;
let l73PlacedTokenIds = [];
let l73TokenWrong = false;

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
  questions = buildL73NestedQuestions();
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

    .l73-shell { display:grid;gap:10px;min-height:385px; }
    .l73-stage-label { color:#6d538f;font-size:10px;font-weight:950;letter-spacing:.09em;text-transform:uppercase; }
    .l73-that-word {
      display:inline-block;
      background:linear-gradient(90deg,#f17b2a 0%,#ffd84a 52%,#f5a400 100%);
      -webkit-background-clip:text;
      background-clip:text;
      color:transparent;
      -webkit-text-fill-color:transparent;
      filter:drop-shadow(0 0 5px rgba(255,205,54,.48)) drop-shadow(0 1px 0 rgba(126,49,6,.14));
    }

    .l73-erase-sentence {
      padding:18px 12px;
      line-height:2.05;
      text-align:center;
      font-size:16px;
      font-weight:900;
    }
    .l73-that-button {
      appearance:none;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      min-height:28px;
      margin:0 2px;
      padding:2px 7px;
      border:1px solid rgba(241,123,42,.52);
      border-radius:8px;
      background:#fffaf0;
      font:inherit;
      cursor:pointer;
      box-shadow:0 0 0 3px rgba(255,205,54,.10);
    }
    .l73-erased-that { display:inline-block;width:13px;border-bottom:2px dashed rgba(241,123,42,.32);vertical-align:middle; }
    .l73-erase-guide { color:#8a7b95;font-size:10px;font-weight:850;text-align:center; }

    .l73-depth-0 { --nest-color:#6d538f;--nest-bg:#f1e8fa; }
    .l73-depth-1 { --nest-color:#2c78b8;--nest-bg:#e4f2ff; }
    .l73-depth-2 { --nest-color:#2f8f55;--nest-bg:#e2f7e8; }
    .l73-depth-3 { --nest-color:#b46500;--nest-bg:#fff0c7; }

    .l73-extract-sentence {
      padding:18px 12px;
      line-height:2.25;
      text-align:center;
      font-size:16px;
      font-weight:900;
    }
    .l73-source-prefix {
      color:#3b343f;
      opacity:.56;
    }
    .l73-source-scope {
      display:inline;
      padding:2px 4px;
      border-radius:6px;
      background:var(--nest-bg);
      color:var(--nest-color);
      box-shadow:0 0 0 2px var(--nest-bg),0 0 12px var(--nest-bg);
      -webkit-box-decoration-break:clone;
      box-decoration-break:clone;
      cursor:grab;
      transition:background .2s ease,color .2s ease,box-shadow .2s ease,opacity .2s ease;
    }
    .l73-source-scope:active { cursor:grabbing; }
    .l73-source-head {
      padding:1px 3px;
      border-radius:4px;
      background:rgba(255,255,255,.78);
      color:var(--nest-color);
      box-shadow:inset 0 -3px 0 var(--nest-color);
      font-weight:1000;
      text-shadow:0 0 1px currentColor;
    }
    .l73-extract-guide { color:#776b7e;font-size:11px;font-weight:850;text-align:center; }
    .l73-extract-tray {
      display:grid;
      align-content:start;
      gap:7px;
      min-height:145px;
      padding:9px 4px 4px;
      border-top:2px solid rgba(109,83,143,.14);
    }
    .l73-extract-empty { color:#968a9e;font-size:12px;font-weight:850;text-align:center;padding:17px 4px; }
    .l73-extracted-piece {
      display:grid;
      grid-template-columns:minmax(0,1fr) auto;
      align-items:center;
      gap:5px 10px;
      min-height:46px;
      padding:8px 10px;
      border-left:5px solid var(--nest-color);
      border-radius:9px;
      background:linear-gradient(90deg,var(--nest-bg),rgba(255,255,255,.95));
      color:var(--nest-color);
      box-shadow:0 4px 10px rgba(45,35,54,.08);
      font-size:15px;
      line-height:1.25;
      font-weight:950;
    }
    .l73-extracted-piece small { color:#655a6c;font-size:12px;font-weight:850;text-align:right; }

    .l73-question-box .question-instruction {
      color:#111;
      font-size:17px;
      line-height:1.5;
      font-weight:950;
      word-break:keep-all;
      margin:16px 0 12px;
    }
    .l73-question-box .sentence {
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      min-height:108px;
      padding:18px 14px;
      margin-top:12px;
      color:#203736;
      font-size:17px;
      font-weight:850;
      line-height:1.75;
      text-align:center;
      box-sizing:border-box;
    }
    .l73-en-line { white-space:pre-wrap; }
    .l73-scramble { margin-top:14px; }
    .l73-answer-tray,
    .l73-word-bank {
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      gap:6px;
      min-height:62px;
      padding:11px;
      border-radius:14px;
      box-sizing:border-box;
    }
    .l73-answer-tray {
      border:1.5px dashed rgba(126,49,6,.38);
      background:rgba(255,255,255,.76);
      transition:border-color .18s ease,background .18s ease;
    }
    .l73-answer-tray.is-wrong {
      border-color:#d44a43;
      background:rgba(255,235,233,.86);
      animation:l73-token-shake .28s ease both;
    }
    .l73-word-bank {
      margin-top:10px;
      border:1px solid rgba(233,199,167,.84);
      background:rgba(255,247,233,.92);
    }
    .l73-tray-empty { color:#a39488;font-size:13px;font-weight:850; }
    .l73-token-row {
      display:flex;
      flex-wrap:wrap;
      align-items:center;
      justify-content:center;
      gap:6px;
      width:100%;
    }
    .l73-order-token {
      appearance:none;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      min-height:33px;
      padding:5px 9px;
      border:1px solid #7657b5;
      border-radius:11px;
      background:#fff;
      border-color:var(--nest-color);
      color:var(--nest-color);
      box-shadow:inset 0 -3px 0 var(--nest-bg),0 0 8px var(--nest-bg),0 4px 8px rgba(49,38,56,.08);
      font-size:13px;
      font-weight:900;
      line-height:1;
      cursor:pointer;
      user-select:none;
      transition:transform .14s ease,box-shadow .14s ease;
    }
    .l73-order-token:hover { transform:translateY(-1px);box-shadow:inset 0 -3px 0 var(--nest-bg),0 0 11px var(--nest-bg),0 6px 11px rgba(49,38,56,.12); }
    .l73-order-token:active { transform:translateY(1px); }
    .l73-order-token:disabled { cursor:default;opacity:.76;transform:none; }
    @keyframes l73-token-shake { 25%{transform:translateX(-4px)}50%{transform:translateX(4px)}75%{transform:translateX(-2px)} }
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

function buildL73NestedQuestions() {
  return L73_NESTED_BLUEPRINTS.map((blueprint, index) => {
    const chunkBlueprint = L73_KOREAN_CHUNK_BLUEPRINTS[index] || [];
    const tokens = chunkBlueprint.map((chunk, tokenIndex) => ({
      id:`l73-${index + 1}-t${tokenIndex + 1}`,
      text:chunk.text,
      index:tokenIndex,
      colorIndex:chunk.colorIndex % 4,
    }));
    const oddTokens = tokens.filter((_, tokenIndex) => tokenIndex % 2 === 1).reverse();
    const evenTokens = tokens.filter((_, tokenIndex) => tokenIndex % 2 === 0).reverse();
    return {
      no:index + 1,
      qNumber:index + 1,
      question:blueprint.english,
      answer:blueprint.korean,
      korean:blueprint.korean,
      instruction:"안긴 문장의 범위를 차례로 뽑은 뒤, 영어 문장에 맞게 한국어 토큰을 배열해보세요.",
      title:"that 안긴 문장",
      type:"nested-token",
      prefixes:blueprint.prefixes.map((prefix) => ({ ...prefix })),
      core:{ ...blueprint.core },
      tokens,
      bankOrder:[...oddTokens, ...evenTokens].map((token) => token.id),
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

function renderQuestion() {
  const area = document.getElementById("quiz-area");
  if (!area) return;
  const q = questions[currentIndex];
  if (!q) {
    showResultPopup();
    return;
  }

  isCurrentLocked = false;
  l73Stage = "erase";
  l73RemovedThatIndexes = new Set();
  l73ExtractedClauseIndexes = [];
  l73SelectedClauseIndex = -1;
  l73ClauseTransitioning = false;
  l73PlacedTokenIds = [];
  l73TokenWrong = false;
  renderL73Exercise(area, q);
}

function renderL73Exercise(area, q) {
  const stageHtml = l73Stage === "erase"
    ? renderL73EraseStage(q)
    : l73Stage === "extract"
      ? renderL73ExtractStage(q)
      : renderL73TokenStage(q);

  area.innerHTML = `
    <div class="q-label">Q. ${currentIndex + 1} / ${questions.length}</div>
    <section class="box l73-shell${l73Stage === "tokens" ? " l73-question-box" : ""}">${stageHtml}<div id="feedback" class="feedback"></div></section>
  `;

  if (l73Stage === "erase") {
    wireL73EraseInteractions(area, q);
  } else if (l73Stage === "extract") {
    wireL73ExtractInteractions(area, q);
  } else {
    wireL73TokenInteractions(area, q);
  }
}

function renderL73EraseStage(q) {
  return `
    <div class="l73-stage-label">STEP 1 · THAT 지우기</div>
    <div class="sentence l73-erase-sentence">${renderL73ErasableSentence(q.question)}</div>
    <div class="l73-erase-guide">that을 하나씩 눌러 문장에서 지워보세요.</div>
  `;
}

function renderL73ErasableSentence(question) {
  const source = String(question || "");
  const re = /\bthat\b/gi;
  let html = "";
  let last = 0;
  let index = 0;
  let match;
  while ((match = re.exec(source)) !== null) {
    html += escapeHtml(source.slice(last, match.index));
    html += l73RemovedThatIndexes.has(index)
      ? `<span class="l73-erased-that" aria-label="that removed"></span>`
      : `<button class="l73-that-button" type="button" data-that-index="${index}"><span class="l73-that-word">that</span></button>`;
    last = re.lastIndex;
    index += 1;
  }
  html += escapeHtml(source.slice(last));
  return html;
}

function wireL73EraseInteractions(area, q) {
  const thatCount = (String(q.question || "").match(/\bthat\b/gi) || []).length;
  area.querySelectorAll(".l73-that-button").forEach((button) => {
    button.addEventListener("click", () => {
      if (isCurrentLocked || l73Stage !== "erase") return;
      const index = Number(button.dataset.thatIndex ?? -1);
      if (!Number.isInteger(index) || index < 0) return;
      l73RemovedThatIndexes.add(index);
      if (l73RemovedThatIndexes.size >= thatCount) l73Stage = "extract";
      renderL73Exercise(area, q);
    });
  });
}

function buildL73ClausePieces(q) {
  const prefixes = q.prefixes.map((prefix, index) => ({
    index,
    type:"prefix",
    text:prefix.text,
    meaning:prefix.meaning,
    colorIndex:index % 4,
  }));
  return [...prefixes, {
    index:prefixes.length,
    type:"core",
    text:q.core.text,
    meaning:q.core.meaning,
    colorIndex:prefixes.length % 4,
  }];
}

function renderL73ExtractStage(q) {
  const pieces = buildL73ClausePieces(q);
  const expectedIndex = l73ExtractedClauseIndexes.length;
  const extractedPrefixHtml = pieces.slice(0, expectedIndex)
    .map((piece) => `<span class="l73-source-prefix">${escapeHtml(piece.text)}</span>`)
    .join(" ");
  const activePieces = pieces.slice(expectedIndex);
  const activeScopeHtml = activePieces.length && !l73ClauseTransitioning
    ? `<span class="l73-source-scope l73-depth-${expectedIndex % 4}" draggable="true" data-clause-index="${expectedIndex}"><span class="l73-source-head">${escapeHtml(activePieces[0].text)}</span>${activePieces.length > 1 ? ` ${escapeHtml(activePieces.slice(1).map((piece) => piece.text).join(" "))}` : ""}.</span>`
    : "";
  const sentenceHtml = activeScopeHtml
    ? [extractedPrefixHtml, activeScopeHtml].filter(Boolean).join(" ")
    : `${extractedPrefixHtml || escapeHtml(pieces.map((piece) => piece.text).join(" "))}.`;
  const extractedHtml = l73ExtractedClauseIndexes.map((pieceIndex) => {
    const piece = pieces[pieceIndex];
    if (!piece) return "";
    return `
      <div class="l73-extracted-piece l73-depth-${piece.colorIndex}">
        <span>${escapeHtml(piece.text)}${piece.type === "prefix" ? " ~" : ""}</span>
        <small>${escapeHtml(piece.meaning)}</small>
      </div>
    `;
  }).join("");
  return `
    <div class="l73-stage-label">STEP 2 · 색칠된 문장 범위 뽑기</div>
    <div class="sentence l73-extract-sentence">${sentenceHtml}</div>
    <div class="l73-extract-guide">바깥 문장부터 차례로 아래로 뽑아보세요.</div>
    <div class="l73-extract-tray" id="l73-extract-tray">${extractedHtml || '<div class="l73-extract-empty">색칠된 문장을 끌어 아래에 놓으세요.</div>'}</div>
  `;
}

function wireL73ExtractInteractions(area, q) {
  area.querySelectorAll(".l73-source-scope").forEach((range) => {
    const clauseIndex = Number(range.dataset.clauseIndex ?? -1);
    range.addEventListener("dragstart", (event) => {
      if (isCurrentLocked || l73ClauseTransitioning) return;
      l73SelectedClauseIndex = clauseIndex;
      event.dataTransfer?.setData("text/plain", String(clauseIndex));
    });
  });
  const tray = area.querySelector("#l73-extract-tray");
  tray?.addEventListener("dragover", (event) => event.preventDefault());
  tray?.addEventListener("drop", (event) => {
    event.preventDefault();
    const droppedIndex = Number(event.dataTransfer?.getData("text/plain") ?? l73SelectedClauseIndex);
    extractL73Clause(area, q, droppedIndex);
  });
}

function extractL73Clause(area, q, clauseIndex) {
  if (isCurrentLocked || l73Stage !== "extract" || l73ClauseTransitioning) return;
  const pieces = buildL73ClausePieces(q);
  const expectedIndex = l73ExtractedClauseIndexes.length;
  if (!Number.isInteger(clauseIndex) || clauseIndex !== expectedIndex || !pieces[clauseIndex]) {
    showToast("no", TEXT.WRONG);
    return;
  }
  l73ExtractedClauseIndexes.push(clauseIndex);
  l73SelectedClauseIndex = -1;
  const isComplete = l73ExtractedClauseIndexes.length >= pieces.length;
  if (isComplete) l73ClauseTransitioning = true;
  renderL73Exercise(area, q);
  if (!isComplete) return;
  const solvedIndex = currentIndex;
  window.setTimeout(() => {
    if (currentIndex !== solvedIndex || l73Stage !== "extract") return;
    l73ClauseTransitioning = false;
    l73Stage = "tokens";
    renderL73Exercise(area, q);
  }, 620);
}

function renderL73TokenStage(q) {
  const placedSet = new Set(l73PlacedTokenIds);
  const placedIds = l73PlacedTokenIds;
  const bankIds = q.bankOrder.filter((tokenId) => !placedSet.has(tokenId));
  const placedHtml = renderL73TokenRows(q, placedIds, "placed");
  const bankHtml = renderL73TokenRows(q, bankIds, "bank");
  return `
    <div class="l73-stage-label">STEP 3 · 한국어 토큰 배열하기</div>
    <div class="question-instruction">문장을 순서대로 조립해보세요!</div>
    <div class="sentence aisth-question-surface aisth-question-center">
      <div class="l73-en-line">${escapeHtml(q.question)}</div>
    </div>
    <div class="l73-scramble">
      <div class="l73-answer-tray${l73TokenWrong ? " is-wrong" : ""}" id="l73-token-zone" aria-label="완성한 한국어 문장">${placedHtml || '<span class="l73-tray-empty">단어를 차례대로 눌러보세요.</span>'}</div>
      <div class="l73-word-bank" aria-label="섞인 한국어 단어">${bankHtml}</div>
    </div>
  `;
}

function renderL73TokenRows(q, tokenIds, location) {
  if (!tokenIds.length) return "";
  const splitIndex = tokenIds.length > 3 ? Math.ceil(tokenIds.length / 2) : tokenIds.length;
  const rows = [tokenIds.slice(0, splitIndex), tokenIds.slice(splitIndex)].filter((row) => row.length);
  return rows.map((row) => `<div class="l73-token-row">${row.map((tokenId) => renderL73OrderToken(q, tokenId, location)).join("")}</div>`).join("");
}

function renderL73OrderToken(q, tokenId, location) {
  const token = q.tokens.find((item) => item.id === tokenId);
  if (!token) return "";
  return `<button class="l73-order-token l73-depth-${token.colorIndex}" type="button" data-token-id="${token.id}" data-location="${location}">${escapeHtml(token.text)}</button>`;
}

function wireL73TokenInteractions(area, q) {
  area.querySelectorAll('.l73-order-token[data-location="bank"]').forEach((button) => {
    button.addEventListener("click", () => {
      if (isCurrentLocked) return;
      l73TokenWrong = false;
      l73PlacedTokenIds.push(String(button.dataset.tokenId || ""));
      checkL73TokenOrder(area, q);
    });
  });
  area.querySelectorAll('.l73-order-token[data-location="placed"]').forEach((button) => {
    button.addEventListener("click", () => {
      if (isCurrentLocked) return;
      l73TokenWrong = false;
      const tokenId = String(button.dataset.tokenId || "");
      l73PlacedTokenIds = l73PlacedTokenIds.filter((id) => id !== tokenId);
      renderL73Exercise(area, q);
    });
  });
}

function checkL73TokenOrder(area, q) {
  if (l73PlacedTokenIds.length < q.tokens.length) {
    renderL73Exercise(area, q);
    return;
  }
  const isCorrect = q.tokens.every((token, index) => l73PlacedTokenIds[index] === token.id);
  if (!isCorrect) {
    l73TokenWrong = true;
    showToast("no", TEXT.WRONG);
    renderL73Exercise(area, q);
    return;
  }

  isCurrentLocked = true;
  const userRaw = q.tokens.map((token) => token.text).join(" ");
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
  storeLatestResultSnapshot();
  showToast("ok", TEXT.CORRECT);
  renderL73Exercise(area, q);
  scheduleAutoNext();
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







