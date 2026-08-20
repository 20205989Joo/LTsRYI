// aisth-l7e1.js
// Independent runtime for Aisth Lesson 7 Exercise 1

const TARGET_LESSON = 7;
const TARGET_EXERCISE = 1;
const PAGE_LABEL = "Aisth L7-E1";
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

let subcategory = "Grammar";
let level = "aisth";
let day = "026";
let quizTitle = "quiz_Grammar_aisth_l7e1";
let userId = "";

let rawRows = [];
let questions = [];
let currentIndex = 0;
let results = [];
let isCurrentLocked = false;
let hintTimerId = 0;
let activeHintRole = "S";
let interrogationTimerId = 0;
let interrogationResolvedRoles = new Set();
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

    .sentence.svtd-mode {
      white-space: normal;
      padding: 8px;
      line-height: 1.45;
    }

    .blank-slot {
      display: inline-block;
      padding: 1px 6px;
      border-radius: 7px;
      border: 1px dashed var(--aisth-role-v-border, #c88a12);
      background: var(--aisth-role-v-bg, #fff4cc);
      color: var(--aisth-role-v-text, #7a4a00);
      font-weight: 900;
      margin: 0 2px;
    }

    .focus-token {
      background: var(--aisth-role-v-bg, #fff4cc);
      border-radius: 6px;
      padding: 0 3px;
      box-shadow: inset 0 0 0 1px rgba(200, 138, 18, 0.24), 0 0 10px var(--aisth-role-v-glow, rgba(216,162,27,.30));
      color: var(--aisth-role-v-text, #7a4a00);
      font-weight: 900;
    }

    .svtd-inline-tag {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 1.45em;
      padding: 0.02em 0.4em;
      border-width: 1px;
      border-style: solid;
      border-radius: 999px;
      vertical-align: -0.08em;
      font-weight: 900;
    }

    .svtd-inline-tag.is-subject {
      border-color: #2f8f55;
      background: #e2f7e8;
      color: #17643c;
    }

    .svtd-inline-tag.is-verb {
      border-color: var(--aisth-role-v-border, #c88a12);
      background: var(--aisth-role-v-bg, #fff4cc);
      color: var(--aisth-role-v-text, #7a4a00);
    }

    .svtd-inline-tag.is-target {
      border-color: #dc3f3f;
      background: #ffe1e1;
      color: #a91f1f;
    }

    .svtd-inline-tag.is-detail {
      border-color: #111;
      background: #1f1f1f;
      color: #fff;
    }

    .svtd-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      margin-top: 0;
    }

    .svtd-table th,
    .svtd-table td {
      border: 1px solid #e4d4c1;
      padding: 6px 4px;
      font-size: 13px;
      line-height: 1.45;
      vertical-align: middle;
      text-align: center;
      word-break: keep-all;
    }

    .svtd-table th {
      background: #fff8ee;
      color: #7e3106;
      font-weight: 900;
    }

    .svtd-table td {
      background: #fff;
      color: #3c2d22;
      min-height: 0;
    }

    .svtd-empty {
      display: inline-block;
      width: 100%;
      height: 1em;
      color: transparent;
      font-weight: 900;
      opacity: 1;
    }

    .svtd-input-wrap {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .svtd-input-row {
      display: grid;
      grid-template-columns: 116px 1fr;
      gap: 8px;
      align-items: center;
    }

    .svtd-input-label {
      color: #7e3106;
      font-size: 13px;
      font-weight: 900;
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      white-space: nowrap;
    }

    .scope-deco {
      position: relative;
      display: inline-block;
      width: 18px;
      height: 18px;
      margin-right: 6px;
      border: 1.4px solid #d63b3b;
      border-radius: 50%;
      box-sizing: border-box;
      opacity: 0.95;
      background:
        radial-gradient(circle at center, transparent 0 2.4px, #d63b3b 2.4px 3.1px, transparent 3.1px),
        linear-gradient(#d63b3b, #d63b3b) center/1px 100% no-repeat,
        linear-gradient(#d63b3b, #d63b3b) center/100% 1px no-repeat;
    }

    .scope-deco::before {
      content: "";
      position: absolute;
      inset: -3px;
      border: 1px solid rgba(214, 59, 59, 0.45);
      border-radius: 50%;
    }

    .scope-deco::after {
      content: "";
      position: absolute;
      inset: 3px;
      border: 1.2px solid #d63b3b;
      border-radius: 50%;
    }

    .svtd-field {
      font-size: 14px;
      font-weight: 800;
      text-align: left;
      letter-spacing: 0;
      padding: 8px 10px;
    }

    .svtd-field-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      width: 100%;
    }

    .svtd-affix {
      color: #7e3106;
      font-size: 17px;
      font-weight: 900;
      white-space: nowrap;
      line-height: 1;
      flex: 0 0 auto;
      user-select: none;
    }

    .svtd-affix.svtd-affix-mid {
      font-size: 15px;
    }

    .svtd-affix.svtd-affix-long {
      font-size: 13px;
    }

    .svtd-field-wrap .svtd-field {
      flex: 1 1 0;
      width: 0;
      min-width: 0;
    }

    .svtd-input-none {
      width: 100%;
      height: 36px;
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
      position: relative;
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }

    .btn-row .quiz-btn {
      flex: 1;
      margin-top: 0;
    }

    .quiz-btn.hint-mode {
      background: #ffd45a;
      color: #5d4200;
      box-shadow: 0 8px 16px rgba(213, 170, 0, 0.18);
    }

    .feedback {
      margin-top: 8px;
      font-weight: 900;
      font-size: 13px;
      line-height: 1.6;
    }

    .hint-tooltip {
      display: none;
      position: absolute;
      right: 0;
      bottom: calc(100% + 8px);
      max-width: 230px;
      padding: 8px 10px;
      border: 1px solid #e6c09a;
      border-radius: 10px;
      background: #fffaf2;
      color: #3c2d22;
      box-shadow: 0 10px 24px rgba(126, 49, 6, 0.16);
      font-size: 12px;
      font-weight: 900;
      line-height: 1.45;
      z-index: 5;
    }

    .hint-tooltip.is-visible {
      display: block;
    }

    .hint-tooltip::after {
      content: "";
      position: absolute;
      right: 24px;
      top: 100%;
      border-width: 7px 6px 0 6px;
      border-style: solid;
      border-color: #fffaf2 transparent transparent transparent;
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

    .l71-briefing {
      border: 1px solid rgba(126, 49, 6, 0.16);
      border-radius: 13px;
      background: rgba(255, 251, 244, 0.94);
      padding: 8px;
      margin-bottom: 8px;
    }

    .l71-briefing .question-instruction {
      margin-bottom: 6px;
      font-size: 12px;
      text-align: center;
    }

    .l71-briefing .svtd-table th,
    .l71-briefing .svtd-table td {
      padding: 3px 3px;
      font-size: 10px;
      line-height: 1.25;
    }

    .l71-scene {
      --scene-night: #151844;
      position: relative;
      height: 156px;
      margin: 0 0 8px;
      overflow: hidden;
      border: 2px solid #0e1237;
      border-radius: 18px;
      background:
        radial-gradient(circle at 76% 18%, rgba(255, 212, 104, 0.2) 0 1px, transparent 2px),
        radial-gradient(circle at 18% 28%, rgba(120, 221, 255, 0.28) 0 1px, transparent 2px),
        linear-gradient(180deg, #252a68 0%, var(--scene-night) 76%, #0d1236 100%);
      box-shadow: inset 0 -18px 34px rgba(0, 0, 0, 0.22), 0 7px 18px rgba(22, 24, 68, 0.18);
    }

    .l71-scene::before {
      content: "";
      position: absolute;
      left: 50%;
      top: -18px;
      width: 78px;
      height: 116px;
      transform: translateX(-50%);
      clip-path: polygon(36% 0, 64% 0, 100% 100%, 0 100%);
      background: linear-gradient(180deg, rgba(255, 224, 135, 0.58), rgba(255, 224, 135, 0.02));
      opacity: 0.68;
    }

    .l71-scene::after {
      content: "";
      position: absolute;
      left: 26px;
      right: 26px;
      bottom: 24px;
      height: 5px;
      border-radius: 50%;
      background: rgba(7, 9, 32, 0.74);
      box-shadow: 0 10px 18px rgba(0, 0, 0, 0.35);
    }

    .l71-lamp {
      position: absolute;
      z-index: 4;
      left: 50%;
      top: -3px;
      width: 34px;
      height: 20px;
      transform: translateX(-50%);
      border-radius: 5px 5px 18px 18px;
      background: #ffcf58;
      box-shadow: 0 0 18px rgba(255, 210, 95, 0.65);
    }

    .l71-person {
      position: absolute;
      z-index: 3;
      bottom: 24px;
      width: 76px;
      height: 91px;
      transform-origin: 50% 82%;
    }

    .l71-detective { left: 22px; animation: l71-detective-idle 2.4s ease-in-out infinite; }
    .l71-suspect { right: 21px; animation: l71-suspect-nervous 0.72s ease-in-out infinite; }

    .l71-head {
      position: absolute;
      left: 18px;
      top: 4px;
      width: 42px;
      height: 42px;
      border: 3px solid #0b1239;
      border-radius: 48% 52% 45% 55%;
      background: #f3a96e;
      box-shadow: inset -6px -6px 0 rgba(158, 65, 73, 0.18);
    }

    .l71-detective .l71-head { background: #71d3df; }

    .l71-eye {
      position: absolute;
      top: 17px;
      width: 5px;
      height: 6px;
      border-radius: 50%;
      background: #111638;
    }

    .l71-eye.is-left { left: 10px; }
    .l71-eye.is-right { right: 10px; }

    .l71-mouth {
      position: absolute;
      left: 15px;
      top: 29px;
      width: 11px;
      height: 5px;
      border-bottom: 2px solid #5d2b3f;
      border-radius: 50%;
    }

    .l71-detective .l71-mouth { border-bottom-color: #123b54; }

    .l71-hat {
      position: absolute;
      z-index: 2;
      left: 10px;
      top: -2px;
      width: 57px;
      height: 17px;
      border-radius: 50% 50% 8px 8px;
      background: #ffcf58;
      border-bottom: 3px solid #0b1239;
      transform: rotate(-4deg);
    }

    .l71-body {
      position: absolute;
      left: 12px;
      bottom: 0;
      width: 54px;
      height: 48px;
      border: 3px solid #0b1239;
      border-radius: 28px 28px 10px 10px;
      background: #ef6a70;
      box-sizing: border-box;
    }

    .l71-detective .l71-body { background: #6357c7; }

    .l71-arm {
      position: absolute;
      z-index: -1;
      top: 54px;
      width: 32px;
      height: 10px;
      border: 3px solid #0b1239;
      border-radius: 999px;
      background: #ef6a70;
      transform-origin: 8px 50%;
    }

    .l71-detective .l71-arm { right: -5px; background: #6357c7; transform: rotate(-19deg); }
    .l71-suspect .l71-arm { left: -4px; transform: rotate(18deg); }

    .l71-bubble {
      position: absolute;
      z-index: 7;
      top: 12px;
      max-width: 108px;
      min-height: 29px;
      padding: 7px 9px;
      border: 2px solid #0d1237;
      border-radius: 13px;
      background: #fff8dc;
      color: #191b3f;
      font-size: 10px;
      font-weight: 950;
      line-height: 1.25;
      text-align: center;
      box-sizing: border-box;
      filter: drop-shadow(0 4px 5px rgba(0, 0, 0, 0.17));
    }

    .l71-detective-bubble { left: 83px; }
    .l71-suspect-bubble { right: 82px; top: 65px; background: #fff; opacity: 0; transform: translateY(4px); }
    .l71-suspect-bubble.has-answer { opacity: 1; transform: translateY(0); transition: 0.22s ease; }

    .l71-suspect.is-shaking .l71-head { animation: l71-head-no 0.5s ease 2; }
    .l71-scene.is-celebrating .l71-person { animation: l71-cheer 0.68s ease 2 both; }
    .l71-scene.is-celebrating .l71-arm { top: 42px; transform: rotate(-68deg); }
    .l71-scene.is-celebrating .l71-person .l71-arm:last-child { transform: rotate(68deg); }
    .l71-scene.is-celebrating { background: radial-gradient(circle at 50% 42%, #ffda69 0 12%, #4f54b5 45%, #181a4a 100%); }

    @keyframes l71-detective-idle { 50% { transform: translateY(-2px) rotate(-1deg); } }
    @keyframes l71-suspect-nervous { 25% { transform: translateX(-1px) rotate(-1deg); } 75% { transform: translateX(1px) rotate(1deg); } }
    @keyframes l71-head-no { 25% { transform: translateX(-6px) rotate(-8deg); } 75% { transform: translateX(6px) rotate(8deg); } }
    @keyframes l71-cheer { 45% { transform: translateY(-15px) rotate(-2deg); } 75% { transform: translateY(0) rotate(2deg); } }

    .l71-file {
      position: relative;
      padding: 13px 9px 9px;
      border: 1px solid #b99c74;
      border-radius: 4px 11px 11px 11px;
      background:
        repeating-linear-gradient(0deg, transparent 0 23px, rgba(74, 105, 127, 0.09) 24px),
        #f6edcf;
      box-shadow: 0 6px 14px rgba(80, 57, 28, 0.14), inset 0 0 26px rgba(133, 92, 38, 0.06);
    }

    .l71-file::before {
      content: "취조 파일";
      position: absolute;
      left: 12px;
      top: -10px;
      padding: 3px 10px;
      border: 1px solid #b99c74;
      border-bottom: 0;
      border-radius: 6px 6px 0 0;
      background: #dfc99f;
      color: #4d3829;
      font-size: 10px;
      font-weight: 950;
      letter-spacing: 0.1em;
    }

    .l71-file-row {
      display: grid;
      grid-template-columns: 70px minmax(0, 1fr);
      align-items: center;
      gap: 6px;
      min-height: 39px;
      padding: 3px 4px;
      border-bottom: 1px dashed rgba(91, 70, 45, 0.2);
      transition: background 0.2s ease, transform 0.2s ease;
    }

    .l71-file-row:last-child { border-bottom: 0; }
    .l71-file-row.is-active { background: rgba(255, 255, 255, 0.54); transform: translateX(2px); }
    .l71-file-row.is-solved { opacity: 0.78; }

    .l71-file-label {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #3d332b;
      font-size: 10px;
      font-weight: 950;
      white-space: nowrap;
    }

    .l71-file-label .svtd-inline-tag { min-width: 20px; padding: 1px 5px; font-size: 10px; }
    .l71-file-answer { min-width: 0; display: flex; align-items: center; gap: 5px; }
    .l71-file-answer .aisth-slot-control { width: auto; max-width: 100%; padding: 0; gap: 3px; }
    .l71-file-answer .aisth-slot-cell { width: 20px; min-width: 20px; height: 29px; font-size: 13px; }
    .l71-file-answer .aisth-slot-word { gap: 2px; }

    .l71-none-stamp {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 25px;
      padding: 0 10px;
      border: 2px solid rgba(171, 50, 55, 0.48);
      border-radius: 4px;
      color: #a32d35;
      font-size: 10px;
      font-weight: 950;
      letter-spacing: 0.08em;
      transform: rotate(-3deg);
      opacity: 0.68;
    }

    .l71-affix { color: #6d4b2f; font-size: 11px; font-weight: 950; white-space: nowrap; }
    .l71-source-input { position: absolute !important; width: 1px !important; height: 1px !important; opacity: 0 !important; }

    .l71-scene {
      height: 158px;
      border-color: #292725;
      border-radius: 12px;
      background:
        linear-gradient(90deg, transparent 49.4%, rgba(255,255,255,0.035) 50%, transparent 50.6%),
        repeating-linear-gradient(0deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 19px),
        linear-gradient(180deg, #4b4a48 0%, #353534 67%, #252525 100%);
      box-shadow: inset 0 -24px 34px rgba(0,0,0,0.34), inset 0 0 0 1px rgba(255,255,255,0.04), 0 6px 15px rgba(30,25,20,0.18);
    }

    .l71-scene::before {
      top: 13px;
      width: 124px;
      height: 108px;
      clip-path: polygon(43% 0, 57% 0, 100% 100%, 0 100%);
      background: linear-gradient(180deg, rgba(255, 231, 169, 0.34), rgba(255, 231, 169, 0.025));
      opacity: 0.62;
    }

    .l71-scene::after {
      left: 56px;
      right: 56px;
      bottom: 23px;
      height: 12px;
      border: 2px solid #171717;
      border-radius: 2px;
      background: linear-gradient(180deg, #706453, #3e3932);
      box-shadow: 0 9px 0 -5px #171717, 0 15px 20px rgba(0,0,0,0.38);
    }

    .l71-lamp {
      top: -5px;
      width: 39px;
      height: 24px;
      border: 2px solid #171717;
      border-radius: 3px 3px 18px 18px;
      background: linear-gradient(180deg, #7c7b76, #343432);
      box-shadow: 0 8px 15px rgba(255, 224, 150, 0.27);
    }

    .l71-person {
      bottom: 28px;
      width: 72px;
      height: 84px;
      animation: none;
    }

    .l71-detective { left: 22px; transform: rotate(1deg); }
    .l71-suspect { right: 20px; animation: l71-suspect-side-nervous 1.15s ease-in-out infinite; }

    .l71-head {
      top: 5px;
      width: 39px;
      height: 43px;
      border: 2.5px solid #171717;
      background: #d5a078;
      box-shadow: inset 0 -5px 0 rgba(103, 55, 42, 0.14);
    }

    .l71-detective .l71-head {
      left: 20px;
      border-radius: 52% 44% 48% 46%;
      background: #c9956f;
      transform: rotate(2deg);
    }

    .l71-suspect .l71-head {
      left: 12px;
      border-radius: 44% 52% 46% 48%;
      background: #d9a27b;
      transform: rotate(-2deg);
    }

    .l71-hair {
      position: absolute;
      z-index: 2;
      top: -2px;
      width: 31px;
      height: 16px;
      border: 2px solid #171717;
      border-bottom: 0;
      background: #292724;
    }

    .l71-detective .l71-hair { left: 7px; border-radius: 17px 13px 2px 5px; }
    .l71-suspect .l71-hair { right: 7px; border-radius: 13px 17px 5px 2px; }

    .l71-eye { top: 17px; width: 4px; height: 5px; background: #171717; }
    .l71-detective .l71-eye.is-left,
    .l71-suspect .l71-eye.is-right { display: none; }
    .l71-detective .l71-eye.is-right { right: 7px; }
    .l71-suspect .l71-eye.is-left { left: 7px; }

    .l71-nose {
      position: absolute;
      top: 20px;
      width: 8px;
      height: 7px;
      border-top: 2px solid #171717;
      background: #d5a078;
      transform: rotate(18deg);
    }

    .l71-detective .l71-nose { right: -6px; border-right: 2px solid #171717; }
    .l71-suspect .l71-nose { left: -6px; border-left: 2px solid #171717; transform: rotate(-18deg); }

    .l71-mouth { top: 31px; width: 9px; height: 3px; border-bottom-color: #5c302d; }
    .l71-detective .l71-mouth { left: 25px; border-bottom-color: #5c302d; }
    .l71-suspect .l71-mouth { left: 5px; border-bottom-color: #5c302d; }

    .l71-hat {
      left: 9px;
      top: -4px;
      width: 56px;
      height: 14px;
      border: 2px solid #171717;
      border-radius: 9px 9px 3px 3px;
      background: #262524;
      transform: rotate(2deg);
    }

    .l71-body {
      left: 10px;
      height: 43px;
      border-color: #171717;
      border-radius: 18px 18px 5px 5px;
      background: #353a3e;
    }

    .l71-detective .l71-body { background: #252b30; }
    .l71-suspect .l71-body { background: #6d6258; }

    .l71-arm,
    .l71-detective .l71-arm,
    .l71-suspect .l71-arm {
      z-index: 5;
      top: 61px;
      width: 39px;
      height: 9px;
      border-color: #171717;
      background: #353a3e;
    }

    .l71-detective .l71-arm { left: 39px; transform: rotate(8deg); }
    .l71-suspect .l71-arm { left: -7px; background: #6d6258; transform: rotate(-8deg); }

    .l71-chair {
      position: absolute;
      z-index: -2;
      left: 7px;
      bottom: -8px;
      width: 58px;
      height: 43px;
      border: 3px solid #181818;
      border-radius: 7px 7px 0 0;
      opacity: 0.72;
    }

    .l71-dialogue-step {
      position: absolute;
      inset: 0;
      z-index: 8;
      opacity: 0;
      pointer-events: none;
      animation: l71-dialogue-cycle 12s linear infinite;
      animation-delay: var(--l71-dialogue-delay, 0s);
    }

    .l71-dialogue-step .l71-bubble {
      display: block;
      min-height: 26px;
      max-width: 113px;
      padding: 6px 8px;
      border-color: #252321;
      border-radius: 8px;
      background: #eee6d4;
      color: #272421;
      filter: drop-shadow(0 3px 3px rgba(0,0,0,0.2));
    }

    .l71-dialogue-step .l71-detective-bubble { left: 72px; top: 10px; }
    .l71-dialogue-step .l71-suspect-bubble { right: 69px; top: 69px; opacity: 1; transform: none; background: #f7f4ec; }
    .l71-dialogue-step.is-empty .l71-suspect-bubble { color: #8e3434; }

    @keyframes l71-dialogue-cycle {
      0%, 20% { opacity: 1; }
      24%, 100% { opacity: 0; }
    }

    @keyframes l71-suspect-side-nervous {
      0%, 100% { transform: translateY(0) rotate(-1deg); }
      50% { transform: translateY(1px) rotate(1deg); }
    }

    .l71-scene.has-empty-t:not(.has-empty-d) .l71-suspect .l71-head { animation: l71-head-no-t 12s linear infinite; }
    .l71-scene.has-empty-d:not(.has-empty-t) .l71-suspect .l71-head { animation: l71-head-no-d 12s linear infinite; }
    .l71-scene.has-empty-t.has-empty-d .l71-suspect .l71-head { animation: l71-head-no-td 12s linear infinite; }

    @keyframes l71-head-no-t {
      0%, 49%, 75%, 100% { transform: translateX(0) rotate(-2deg); }
      55%, 65% { transform: translateX(-5px) rotate(-9deg); }
      60%, 70% { transform: translateX(5px) rotate(7deg); }
    }

    @keyframes l71-head-no-d {
      0%, 74%, 100% { transform: translateX(0) rotate(-2deg); }
      80%, 90% { transform: translateX(-5px) rotate(-9deg); }
      85%, 95% { transform: translateX(5px) rotate(7deg); }
    }

    @keyframes l71-head-no-td {
      0%, 49%, 75%, 100% { transform: translateX(0) rotate(-2deg); }
      55%, 65%, 80%, 90% { transform: translateX(-5px) rotate(-9deg); }
      60%, 70%, 85%, 95% { transform: translateX(5px) rotate(7deg); }
    }

    .l71-file {
      padding: 13px 5px 1px;
      overflow: visible;
    }

    .l71-file-row {
      grid-template-columns: 80px minmax(0, 1fr);
      gap: 4px;
      min-height: 32px;
      padding: 2px;
      overflow: visible;
    }

    .l71-file-label {
      min-width: 0;
      gap: 4px;
      padding-top: 0;
      white-space: nowrap;
      line-height: 1;
      font-size: 10px;
    }

    .l71-file-label .svtd-inline-tag {
      width: 22px;
      min-width: 22px;
      height: 22px;
      min-height: 22px;
      padding: 0;
      border-radius: 50%;
      font-size: 10px;
      line-height: 1;
      box-sizing: border-box;
    }

    .l71-file-label > span:last-child {
      min-width: 0;
      white-space: nowrap;
    }

    .l71-file-answer {
      min-width: 0;
      max-width: 100%;
      overflow: visible;
      align-items: center;
      gap: 0;
    }

    .l71-file-answer .aisth-slot-control,
    .l71-file-answer .aisth-slot-control.aisth-slot-control--latin {
      width: auto;
      max-width: 100%;
      min-width: 0;
      flex: 0 1 auto;
      justify-content: flex-start;
      flex-wrap: wrap;
      gap: 6px;
      overflow: visible;
    }

    .l71-answer-cluster {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      width: 100%;
      min-width: 0;
      max-width: 100%;
      white-space: normal;
    }

    #quiz-area .l71-file-answer .aisth-slot-control.aisth-slot-control--latin .aisth-slot-shell {
      min-height: 22px;
      gap: 0;
    }
    .l71-file-answer .aisth-slot-word-gap { display: none; }
    #quiz-area .l71-file-answer .aisth-slot-control.aisth-slot-control--latin .aisth-slot-cell {
      width: 22px;
      min-width: 22px;
      height: 30px;
      padding-inline: 0;
      font-size: 15px;
    }

    #quiz-area .l71-file-answer .aisth-slot-control.aisth-slot-control--latin .aisth-slot-cell.is-placeholder {
      border-color: rgba(102,126,214,.62);
      border-bottom-color: rgba(77,87,170,.78);
      background: linear-gradient(180deg,#fbfcff 0%,#edf1ff 56%,#dfe7ff 100%);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 3px 8px rgba(58,70,152,.10);
    }

    .l71-affix {
      color: #2f7b3a;
      font-size: 14px;
      line-height: 1;
      font-weight: 950;
      white-space: nowrap;
      text-shadow: 0 0 5px rgba(47,123,58,.16);
    }

    .l71-file-answer .aisth-slot-cell.is-l71-suffix:not(.is-slot-wrong) {
      border-color: rgba(136, 84, 208, 0.76);
      border-bottom-color: #6c3ac7;
      background: rgba(136, 84, 208, 0.16);
      color: #6c3ac7;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.78), inset 0 0 0 1px rgba(136,84,208,.24), 0 0 10px rgba(136,84,208,.24);
    }

    .l71-briefing {
      display: grid;
      justify-items: center;
      gap: 8px;
      text-align: center;
      margin-bottom: 14px;
    }

    .l71-briefing .svtd-table {
      margin: 0 auto;
      border-collapse: separate;
      border-spacing: 0;
      border-radius: 10px;
      overflow: hidden;
    }
    .l71-briefing .svtd-table th {
      padding: 6px 4px;
      font-size: 13px;
      line-height: 1.15;
    }
    .l71-briefing .svtd-table td {
      padding: 7px 4px;
      font-size: 11px;
      line-height: 1.2;
    }
    .l71-briefing .svtd-table th:nth-child(1) { border-color: #2f8f55; background: #e2f7e8; color: #17643c; }
    .l71-briefing .svtd-table th:nth-child(2) { border-color: #c88a12; background: #fff4cc; color: #7a4a00; }
    .l71-briefing .svtd-table th:nth-child(3) { border-color: #dc3f3f; background: #ffe1e1; color: #a91f1f; }
    .l71-briefing .svtd-table th:nth-child(4) { border-color: #111; background: #1f1f1f; color: #fff; }

    .l71-title-caption {
      width: 100%;
      margin: 0 0 2px;
      color: #3c2d22;
      font-size: 15px;
      line-height: 1.15;
      font-weight: 950;
      text-align: center;
    }

    .l71-question-layout {
      display: flex;
      flex-direction: column;
      height: calc(100% - 40px);
      min-height: 438px;
      box-sizing: border-box;
    }

    .l71-question-layout .l71-scene {
      flex: 0 0 240px;
      height: 240px;
      margin-bottom: 8px;
    }

    .l71-question-layout.has-wrapped-slot .l71-scene {
      flex-basis: 204px;
      height: 204px;
    }

    .l71-question-layout.has-wrapped-slot .l71-scene::before { height: 150px; }
    .l71-question-layout.has-wrapped-slot .l71-dialogue-step .l71-detective-bubble { top: 40px; }
    .l71-question-layout.has-wrapped-slot .l71-dialogue-step .l71-suspect-bubble { top: 99px; }

    .l71-question-layout .l71-scene::before { height: 180px; }
    .l71-question-layout .l71-dialogue-step .l71-detective-bubble { top: 72px; }
    .l71-question-layout .l71-dialogue-step .l71-suspect-bubble { top: 131px; }

    .l71-question-layout .l71-file {
      flex: 0 0 auto;
      margin-top: auto;
    }

    .l71-person {
      bottom: 28px;
      width: 82px;
      height: 94px;
      transform-origin: 50% 86%;
    }

    .l71-detective { left: 14px; }
    .l71-suspect { right: 14px; }

    .l71-head,
    .l71-detective .l71-head,
    .l71-suspect .l71-head {
      z-index: 4;
      top: 11px;
      width: 41px;
      height: 47px;
      overflow: visible;
      border: 2.5px solid #171717;
      box-shadow: inset 0 -5px 0 rgba(103,55,42,.12);
    }

    .l71-detective .l71-head {
      left: 25px;
      border-radius: 52% 46% 48% 46%;
      background: #c9956f;
      transform: rotate(1deg);
    }

    .l71-suspect .l71-head {
      left: 14px;
      border-radius: 46% 52% 46% 49%;
      background: #d9a27b;
      transform: rotate(-1deg);
    }

    .l71-hair,
    .l71-detective .l71-hair,
    .l71-suspect .l71-hair {
      z-index: 5;
      top: -4px;
      width: 39px;
      height: 21px;
      border: 2px solid #171717;
      border-bottom: 0;
      background: #292724;
    }

    .l71-detective .l71-hair {
      left: -1px;
      border-radius: 23px 15px 7px 4px;
    }

    .l71-suspect .l71-hair {
      right: -1px;
      border-radius: 15px 23px 4px 7px;
      background: #332b28;
    }

    .l71-hair::before {
      content: "";
      position: absolute;
      top: 11px;
      width: 6px;
      height: 12px;
      border-radius: 2px 2px 6px 6px;
      background: inherit;
    }

    .l71-detective .l71-hair::before { left: 1px; }
    .l71-suspect .l71-hair::before { right: 1px; }

    .l71-hair-lock {
      position: absolute;
      z-index: 6;
      top: 7px;
      width: 12px;
      height: 9px;
      border-radius: 0 0 10px 2px;
      background: #292724;
      transform: rotate(16deg);
    }

    .l71-detective .l71-hair-lock { left: 23px; }
    .l71-suspect .l71-hair-lock { right: 23px; background: #332b28; transform: scaleX(-1) rotate(16deg); }

    .l71-ear {
      position: absolute;
      z-index: 3;
      top: 22px;
      width: 8px;
      height: 11px;
      border: 2px solid #171717;
      border-radius: 50%;
      background: inherit;
    }

    .l71-detective .l71-ear { left: -6px; }
    .l71-suspect .l71-ear { right: -6px; }

    .l71-eye { top: 20px; width: 4px; height: 5px; background: #171717; }
    .l71-detective .l71-eye.is-right { right: 7px; }
    .l71-suspect .l71-eye.is-left { left: 7px; }

    .l71-brow {
      position: absolute;
      z-index: 7;
      top: 15px;
      width: 9px;
      height: 3px;
      border-top: 2px solid #171717;
      border-radius: 50%;
    }

    .l71-detective .l71-brow { right: 5px; transform: rotate(-8deg); }
    .l71-suspect .l71-brow { left: 5px; transform: rotate(11deg); }

    .l71-nose,
    .l71-detective .l71-nose,
    .l71-suspect .l71-nose {
      z-index: 7;
      top: 23px;
      width: 0;
      height: 0;
      border: 0;
      background: transparent;
      transform: none;
    }

    .l71-detective .l71-nose {
      right: -7px;
      border-top: 4px solid transparent;
      border-bottom: 4px solid transparent;
      border-left: 8px solid #171717;
    }

    .l71-detective .l71-nose::after {
      content: "";
      position: absolute;
      right: 2px;
      top: -2px;
      border-top: 2px solid transparent;
      border-bottom: 2px solid transparent;
      border-left: 5px solid #c9956f;
    }

    .l71-suspect .l71-nose {
      left: -7px;
      border-top: 4px solid transparent;
      border-bottom: 4px solid transparent;
      border-right: 8px solid #171717;
    }

    .l71-suspect .l71-nose::after {
      content: "";
      position: absolute;
      left: 2px;
      top: -2px;
      border-top: 2px solid transparent;
      border-bottom: 2px solid transparent;
      border-right: 5px solid #d9a27b;
    }

    .l71-mouth {
      top: 36px;
      width: 9px;
      height: 3px;
      border: 0;
      border-top: 2px solid #5c302d;
      border-radius: 50%;
    }
    .l71-detective .l71-mouth { left: 26px; transform: rotate(3deg); }
    .l71-suspect .l71-mouth { left: 5px; transform: rotate(-4deg); }

    .l71-hat {
      z-index: 9;
      left: 18px;
      top: 7px;
      width: 52px;
      height: 4px;
      border: 2px solid #171717;
      border-radius: 50% 50% 3px 3px;
      background: #282826;
      transform: rotate(1deg);
    }

    .l71-hat::before {
      content: "";
      position: absolute;
      left: 8px;
      bottom: 1px;
      width: 31px;
      height: 14px;
      border: 2px solid #171717;
      border-radius: 14px 14px 3px 3px;
      background: #343331;
    }

    .l71-hat::after {
      content: "";
      position: absolute;
      left: 10px;
      bottom: 3px;
      width: 29px;
      height: 4px;
      border-radius: 2px;
      background: #8d6d45;
    }

    .l71-neck {
      position: absolute;
      z-index: 2;
      top: 50px;
      width: 13px;
      height: 14px;
      border: 2px solid #171717;
      background: #c9956f;
    }

    .l71-detective .l71-neck { left: 38px; }
    .l71-suspect .l71-neck { left: 30px; background: #d9a27b; }

    .l71-body,
    .l71-detective .l71-body,
    .l71-suspect .l71-body {
      z-index: 1;
      top: 57px;
      width: 58px;
      height: 39px;
      border: 2.5px solid #171717;
      border-radius: 20px 20px 5px 5px;
    }

    .l71-detective .l71-body { left: 12px; background: #252b30; }
    .l71-suspect .l71-body { left: 12px; background: #6d6258; }

    .l71-body::after {
      content: "";
      position: absolute;
      left: 50%;
      top: 1px;
      width: 15px;
      height: 19px;
      transform: translateX(-50%);
      clip-path: polygon(0 0, 100% 0, 50% 100%);
      background: rgba(255,255,255,.12);
    }

    .l71-arm,
    .l71-detective .l71-arm,
    .l71-suspect .l71-arm {
      z-index: 6;
      top: 69px;
      width: 42px;
      height: 9px;
      border: 2px solid #171717;
      border-radius: 7px;
    }

    .l71-detective .l71-arm { left: 43px; background: #252b30; transform: rotate(8deg); }
    .l71-suspect .l71-arm { left: -3px; background: #6d6258; transform: rotate(-8deg); }

    .l71-hand {
      position: absolute;
      z-index: 7;
      top: 73px;
      width: 10px;
      height: 9px;
      border: 2px solid #171717;
      border-radius: 50%;
    }

    .l71-detective .l71-hand { right: -6px; background: #c9956f; }
    .l71-suspect .l71-hand { left: -6px; background: #d9a27b; }
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
    .filter((r) => {
      const question = String(r["Question"] ?? "").trim();
      const answer = String(r["Answer"] ?? "").trim();
      return question && answer && answer !== "System.Xml.XmlElement";
    })
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
    const answer = normalizeEscapedBreaks(String(row["Answer"] ?? "").trim());
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
  interrogationResolvedRoles = new Set();
  if (interrogationTimerId) {
    window.clearTimeout(interrogationTimerId);
    interrogationTimerId = 0;
  }

  const isSVTD = /\([SVTD]\)/i.test(String(q.question || ""));
  if (isSVTD) {
    renderInterrogationQuestion(area, q);
    return;
  }
  const qBody = renderSVTDTable(q.question);
  const svtdVisibleRoles = isSVTD ? getSVTDVisibleRoles(q.question) : null;
  const displayInstruction = isSVTD
    ? "SVTD\uC5D0 \uB9DE\uCD94\uC5B4 \uB2E8\uC5B4\uB97C \uC785\uB825\uD574\uBCF4\uC138\uC694!"
    : (q.instruction || TEXT.INPUT_HINT_FALLBACK);

  const placeholder = q.type === "blank"
    ? `${TEXT.PLACE_BLANK_PREFIX}${blankPlaceholderExample || "answer"})`
    : `${TEXT.PLACE_REWRITE_1} ${TEXT.PLACE_EX_PREFIX}${rewritePlaceholderExample || "example"})`;

  const svtdPlaceholder = isSVTD && currentIndex === 0 ? extractSVTDAnswerEnglishSlots(q.answer) : null;
  const svtdAffixes = isSVTD ? extractSVTDAffixes(q.answer) : null;
  const inputHtml = isSVTD
    ? renderSVTDInputForm(svtdPlaceholder, svtdVisibleRoles, svtdAffixes)
    : (q.type === "blank"
      ? `<input id="user-answer" class="short-input" type="text" autocomplete="off" placeholder="${escapeHtmlAttr(placeholder)}" />`
      : `<textarea id="user-answer" rows="3" placeholder="${escapeHtmlAttr(placeholder)}"></textarea>`);

  area.innerHTML = `
    <div class="q-label">Q. ${currentIndex + 1} / ${questions.length}</div>

    <div class="box">
      <div class="question-instruction">${renderInstructionWithSVTDColors(displayInstruction)}</div>
      <div class="sentence${isSVTD ? " svtd-mode" : ""}">${qBody}</div>
    </div>

    <div class="box" style="background:#fff;">
      ${inputHtml}
      <div id="feedback" class="feedback"></div>
    </div>

    <div class="btn-row">
      <button class="quiz-btn" id="submit-btn" type="button">제출</button>
      <button class="quiz-btn hint-mode" id="next-btn" type="button">\uD78C\uD2B8</button>
      <div class="hint-tooltip" id="hint-tooltip" role="status" aria-live="polite"></div>
    </div>
  `;

  const submitBtn = document.getElementById("submit-btn");
  const nextBtn = document.getElementById("next-btn");
  const input = document.getElementById("user-answer");
  const svtdInputs = [
    document.getElementById("svtd-input-s"),
    document.getElementById("svtd-input-v"),
    document.getElementById("svtd-input-t"),
    document.getElementById("svtd-input-d"),
  ].filter(Boolean);
  const slotInputControl = !svtdInputs.length && input && window.AisthInputSlots
    ? window.AisthInputSlots.enhance(input, { modelText: q.answer, onEnter: submitCurrentAnswer })
    : null;

  if (submitBtn) submitBtn.addEventListener("click", submitCurrentAnswer);
  if (nextBtn) nextBtn.addEventListener("click", handleNextOrHint);

  if (svtdInputs.length) {
    svtdInputs.forEach((el) => {
      const role = String(el.id || "").replace("svtd-input-", "").toUpperCase();
      el.addEventListener("focus", () => {
        activeHintRole = role;
        hideHintTooltip();
      });
      el.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") {
          ev.preventDefault();
          submitCurrentAnswer();
        }
      });
    });
    svtdInputs[0].focus();
  } else if (input) {
    if (slotInputControl) slotInputControl.focus();
    else input.focus();
    input.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" && q.type === "blank") {
        ev.preventDefault();
        submitCurrentAnswer();
      }
      if (ev.key === "Enter" && ev.ctrlKey && q.type !== "blank") {
        ev.preventDefault();
        submitCurrentAnswer();
      }
    });
  }
}

function submitCurrentAnswer() {
  if (isCurrentLocked) return;

  const q = questions[currentIndex];
  const submitBtn = document.getElementById("submit-btn");
  const nextBtn = document.getElementById("next-btn");
  const feedback = document.getElementById("feedback");

  if (!q) return;

  const isSVTD = /\([SVTD]\)/i.test(String(q.question || ""));
  let userRaw = "";
  let ok = false;

  if (isSVTD) {
    const userSlots = collectSVTDUserSlots();
    const hasAny = Object.values(userSlots).some((v) => String(v || "").trim() !== "");
    if (!hasAny) {
      showToast("no", TEXT.INPUT_REQUIRED);
      return;
    }

    const expectedSlots = parseSVTDAnswerSlots(q.answer);
    ok = isSVTDSlotsCorrect(userSlots, expectedSlots);
    userRaw = `S:${userSlots.S} | V:${userSlots.V} | T:${userSlots.T} | D:${userSlots.D}`;
  } else {
    const input = document.getElementById("user-answer");
    if (!input) return;

    userRaw = String(input.value || "").trim();
    if (!userRaw) {
      showToast("no", TEXT.INPUT_REQUIRED);
      return;
    }
    ok = isAnswerCorrect(q.type, userRaw, q.answer);
  }

  if (!ok) {
    if (feedback) {
      feedback.className = "feedback";
      feedback.innerHTML = "";
    }
    showToast("no", TEXT.WRONG);
    return;
  }

  isCurrentLocked = true;
  if (isSVTD) {
    ["s", "v", "t", "d"].forEach((k) => {
      const el = document.getElementById(`svtd-input-${k}`);
      if (el) el.disabled = true;
    });
  } else {
    const input = document.getElementById("user-answer");
    if (input) input.disabled = true;
    if (window.AisthInputSlots) window.AisthInputSlots.setDisabled(input, true);
  }
  if (submitBtn) submitBtn.disabled = true;
  scheduleAutoNext();
  if (nextBtn) {
    nextBtn.textContent = "Skip";
    nextBtn.classList.remove("hint-mode");
  }
  hideHintTooltip();

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

function hideHintTooltip() {
  const tooltip = document.getElementById("hint-tooltip");
  if (hintTimerId) {
    window.clearTimeout(hintTimerId);
    hintTimerId = 0;
  }
  if (tooltip) {
    tooltip.classList.remove("is-visible");
    tooltip.innerHTML = "";
  }
}

function renderInterrogationQuestion(area, q) {
  const expectedSlots = parseSVTDAnswerSlots(q.answer);
  const modelSlots = extractSVTDAnswerEnglishSlots(q.answer);
  const affixes = extractSVTDAffixes(q.answer);
  const needsWrappedSlot = Object.values(modelSlots).some((value) => {
    const words = String(value || "").trim().split(/\s+/).filter(Boolean);
    const characterWidth = words.join("").length * 22;
    return words.length > 1 && characterWidth + ((words.length - 1) * 6) > 205;
  });

  area.innerHTML = `
    <div class="q-label">Q. ${currentIndex + 1} / ${questions.length}</div>
    <section class="l71-question-layout${needsWrappedSlot ? " has-wrapped-slot" : ""}">
      ${renderInterrogationScene(q, expectedSlots)}
      <section class="l71-briefing">
        ${renderSVTDTable(q.question)}
        <div class="l71-title-caption">를 맞춰보세요</div>
      </section>
      ${renderInterrogationFile(q, expectedSlots, modelSlots, affixes)}
    </section>
  `;

  const slotApis = {};
  ["S", "V", "T", "D"].forEach((role) => {
    const input = document.getElementById(`svtd-input-${role.toLowerCase()}`);
    if (!input || !window.AisthInputSlots) return;
    const api = window.AisthInputSlots.enhance(input, {
      modelText: modelSlots[role],
      placeholderText: currentIndex === 0 ? modelSlots[role] : "",
    });
    slotApis[role] = api;
    if (role === "V") applyL71SuffixPalette(api?.control, modelSlots[role]);
    input.addEventListener("input", () => handleIndependentSVTDTyping(q, role, input, api?.control, expectedSlots));
  });

  q.interrogationExpected = expectedSlots;
  q.interrogationModels = modelSlots;
  q.interrogationSlotApis = slotApis;
  interrogationResolvedRoles = new Set(["S", "V", "T", "D"].filter((role) => expectedSlots[role]?.empty));
  const firstRole = ["S", "V", "T", "D"].find((role) => !expectedSlots[role]?.empty && slotApis[role]);
  if (firstRole) slotApis[firstRole].focus();
}

function renderInterrogationScene(q, expectedSlots) {
  const sourceSlots = parseSVTDSlots(q?.question || "");
  const prompts = {
    S: "그래서, 누가 했지?",
    V: "뭘 했는데?",
    T: "어디다가?",
    D: "좀 더 자세히 말해봐.",
  };
  const sceneClasses = [
    "l71-scene",
    expectedSlots?.T?.empty ? "has-empty-t" : "",
    expectedSlots?.D?.empty ? "has-empty-d" : "",
  ].filter(Boolean).join(" ");
  const dialogue = ["S", "V", "T", "D"].map((role, index) => {
    const isEmpty = Boolean(expectedSlots?.[role]?.empty);
    const response = isEmpty ? "..." : conversationalizeInterrogationLine(role, sourceSlots[role]);
    return `
      <div class="l71-dialogue-step${isEmpty ? " is-empty" : ""}" style="--l71-dialogue-delay:${index * 3}s;">
        <div class="l71-bubble l71-detective-bubble">${escapeHtml(prompts[role])}</div>
        <div class="l71-bubble l71-suspect-bubble">${escapeHtml(response)}</div>
      </div>
    `;
  }).join("");
  return `
    <section class="${sceneClasses}" id="l71-scene" aria-label="SVTD 취조실 예시 애니메이션">
      <span class="l71-lamp" aria-hidden="true"></span>
      ${dialogue}
      ${renderInterrogationPerson("detective")}
      ${renderInterrogationPerson("suspect")}
    </section>
  `;
}

function renderInterrogationPerson(kind) {
  return `
    <div class="l71-person l71-${kind}" id="l71-${kind}" aria-hidden="true">
      ${kind === "detective" ? '<span class="l71-hat"></span>' : ""}
      <span class="l71-head">
        <span class="l71-hair"></span>
        <span class="l71-hair-lock"></span>
        <span class="l71-ear"></span>
        <span class="l71-brow"></span>
        <span class="l71-eye is-left"></span><span class="l71-eye is-right"></span><span class="l71-mouth"></span>
        <span class="l71-nose"></span>
      </span>
      <span class="l71-neck"></span>
      <span class="l71-body"></span>
      <span class="l71-arm"></span>
      <span class="l71-hand"></span>
      <span class="l71-chair"></span>
    </div>
  `;
}

function conversationalizeInterrogationLine(role, rawValue) {
  const value = String(rawValue || "").trim();
  const lines = {
    S: {
      "나는": "저요.",
      "그들은": "그 사람들이요.",
      "그녀는": "그녀요.",
      "우리는": "저희요.",
      "그는": "그 사람이요.",
    },
    V: {
      "일어난다": "일어나요.",
      "웃었다": "웃었어요.",
      "간다": "가요.",
      "기다렸다": "기다렸어요.",
      "여행한다": "여행해요.",
      "논다": "놀아요.",
      "요리해줬다": "요리해줬어요.",
      "제공했다": "건네줬어요.",
      "만들었다": "만들었어요.",
      "선출했다": "뽑았어요.",
      "보았다": "봤어요.",
      "자고 있다": "자고 있어요.",
      "달린다": "달려요.",
      "만났다": "만났어요.",
      "도착했다": "도착했어요.",
      "외쳤다": "외쳤어요.",
    },
    T: {
      "학교에": "학교에요.",
      "축구를": "축구요.",
      "그에게": "그 사람한테요.",
      "우리에게": "저희한테요.",
      "그녀를": "그녀를요.",
      "그를": "그 사람을요.",
      "나를": "저를요.",
    },
    D: {
      "7시에": "오전 7시에요.",
      "시끄럽게": "시끄럽게요.",
      "매일": "매일요.",
      "방 안에서": "방 안에서요.",
      "자주": "자주요.",
      "주말에": "주말에요.",
      "저녁을": "저녁을요.",
      "도움을": "도움을요.",
      "행복하게": "행복하게요.",
      "대통령으로": "대통령으로요.",
      "우는 것을": "우는 걸요.",
      "웃게": "웃게요.",
      "지금": "지금요.",
      "매일 아침": "매일 아침이요.",
      "역에서": "역에서요.",
      "늦게": "늦게요.",
    },
  };
  if (lines[role]?.[value]) return lines[role][value];
  return value ? `${value}요.` : "말해볼게요.";
}

function renderInterrogationFile(q, expectedSlots, modelSlots, affixes) {
  const labels = {
    S: "누가",
    V: "어떤 행동",
    T: "어디다가",
    D: "자세히 설명",
  };
  const rows = ["S", "V", "T", "D"].map((role) => {
    const expected = expectedSlots[role];
    const roleClass = svtdRoleClass(role);
    const inputId = `svtd-input-${role.toLowerCase()}`;
    const prefix = affixes[role]?.prefix || "";
    const suffix = affixes[role]?.suffix || "";
    const answerHtml = expected.empty
      ? '<span class="l71-none-stamp">해당 없음</span>'
      : `
          <span class="l71-answer-cluster">
            ${prefix ? `<span class="l71-affix">${escapeHtml(prefix)}</span>` : ""}
            <input id="${inputId}" class="l71-source-input" type="text" autocomplete="off" inputmode="text" lang="en" autocapitalize="none" spellcheck="false" />
            ${suffix ? `<span class="l71-affix">${escapeHtml(suffix)}</span>` : ""}
          </span>
        `;
    return `
      <div class="l71-file-row" id="l71-row-${role.toLowerCase()}" data-role="${role}">
        <label class="l71-file-label" for="${inputId}">
          ${role === "T" ? '<span class="scope-deco" aria-hidden="true"></span>' : `<span class="svtd-inline-tag is-${roleClass}">${role}</span>`}<span>${labels[role]}</span>
        </label>
        <div class="l71-file-answer">${answerHtml}</div>
      </div>
    `;
  }).join("");

  return `<section class="l71-file">${rows}</section>`;
}

function handleIndependentSVTDTyping(q, role, input, control, expectedSlots) {
  if (isCurrentLocked || interrogationResolvedRoles.has(role)) return;
  const value = String(input.value || "").trim();
  paintInterrogationSlots(input, control, q.interrogationModels?.[role] || "");
  if (!isSingleSVTDRoleCorrect(value, expectedSlots[role])) return;

  interrogationResolvedRoles.add(role);
  if (window.AisthInputSlots) window.AisthInputSlots.setDisabled(input, true);
  else input.disabled = true;
  document.getElementById(`l71-row-${role.toLowerCase()}`)?.classList.add("is-solved");
  const allSolved = ["S", "V", "T", "D"].every((item) => expectedSlots[item]?.empty || interrogationResolvedRoles.has(item));
  if (allSolved) {
    finishInterrogationQuestion(q);
    return;
  }

  const roleOrder = ["S", "V", "T", "D"];
  const currentRoleIndex = roleOrder.indexOf(role);
  const nextRole = roleOrder
    .slice(currentRoleIndex + 1)
    .concat(roleOrder.slice(0, currentRoleIndex))
    .find((item) => !expectedSlots[item]?.empty && !interrogationResolvedRoles.has(item));
  if (nextRole) q.interrogationSlotApis?.[nextRole]?.focus();
}

function paintInterrogationSlots(input, control, modelText) {
  if (!input || !control) return;
  const expected = Array.from(String(modelText || "").replace(/\s+/g, "").toLowerCase());
  const actual = Array.from(String(input.value || "").replace(/\s+/g, "").toLowerCase());
  control.querySelectorAll(".aisth-slot-cell").forEach((cell, index) => {
    cell.classList.toggle("is-slot-correct", Boolean(actual[index]) && actual[index] === expected[index]);
    cell.classList.toggle("is-slot-wrong", Boolean(actual[index]) && actual[index] !== expected[index]);
  });
}

function applyL71SuffixPalette(control, modelText) {
  if (!control) return;
  const word = String(modelText || "").trim().toLowerCase();
  const suffixLength = /^(goes)$/.test(word) ? 2 : /^(travels|runs)$/.test(word) ? 1 : 0;
  if (!suffixLength) return;
  const cells = Array.from(control.querySelectorAll(".aisth-slot-cell"));
  cells.slice(-suffixLength).forEach((cell) => cell.classList.add("is-l71-suffix"));
}

function isSingleSVTDRoleCorrect(userRaw, expected) {
  const user = normalizeLoose(String(userRaw || ""), "rewrite");
  if (!user || !expected || expected.empty) return false;
  return (expected.candidates || [])
    .map((candidate) => normalizeLoose(String(candidate || ""), "rewrite"))
    .filter(Boolean)
    .some((candidate) => candidate === user);
}

function finishInterrogationQuestion(q) {
  if (isCurrentLocked) return;
  isCurrentLocked = true;

  const userSlots = collectSVTDUserSlots();
  const userRaw = `S:${userSlots.S} | V:${userSlots.V} | T:${userSlots.T} | D:${userSlots.D}`;
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
  interrogationTimerId = window.setTimeout(goNext, 700);
}

function showHintTooltip(role = activeHintRole) {
  const tooltip = document.getElementById("hint-tooltip");
  const q = questions[currentIndex];
  if (!tooltip || !q) return;

  tooltip.innerHTML = buildHintHtml(q, role);
  tooltip.classList.add("is-visible");

  if (hintTimerId) window.clearTimeout(hintTimerId);
  hintTimerId = window.setTimeout(hideHintTooltip, 5200);
}

function buildHintHtml(q, role = activeHintRole) {
  const isSVTD = /\([SVTD]\)/i.test(String(q.question || ""));
  if (isSVTD) return buildSVTDHintHtml(q, role);

  const answer = clipExample(stripEmphasisMarkers(String(q.answer || "")));
  if (answer) return `${escapeHtml("\uD78C\uD2B8")}: ${escapeHtml(answer)}`;
  return escapeHtml("\uC9C8\uBB38\uC758 \uD45C\uC2DC\uB97C \uBA3C\uC800 \uD655\uC778\uD574\uBCF4\uC138\uC694.");
}

function svtdRoleClass(role) {
  if (role === "S") return "subject";
  if (role === "V") return "verb";
  if (role === "T") return "target";
  if (role === "D") return "detail";
  return "";
}

function svtdRoleLabel(role) {
  if (role === "S") return "S";
  if (role === "V") return "V";
  if (role === "T") return "T";
  if (role === "D") return "D";
  return role;
}

function svtdAnswerPart(answerRaw, role) {
  const order = ["S", "V", "T", "D"];
  const idx = order.indexOf(role);
  if (idx < 0) return "";
  return normalizeEscapedBreaks(String(answerRaw || ""))
    .split(/\s*-\s*/)
    .map((x) => String(x || "").trim())[idx] || "";
}

function firstSVTDHintCore(expectedPart) {
  if (!expectedPart || expectedPart.empty) return "";
  const candidates = (expectedPart.candidates || [])
    .map((x) => stripEmphasisMarkers(String(x || "")).replace(/\([^)]*\)/g, "").replace(/\s+/g, " ").trim())
    .filter((x) => x && x !== "\uC5C6\uC74C" && x !== "_");
  return candidates.sort((a, b) => a.length - b.length)[0] || "";
}

function normalizeHintEnglish(value, role) {
  let text = stripEmphasisMarkers(String(value || ""))
    .replace(/\([^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return "";

  text = text.replace(/^(a|an|the)\s+/i, "");

  if (role !== "V") return text;

  const irregular = {
    am: "be",
    are: "be",
    is: "be",
    was: "be",
    were: "be",
    has: "have",
    had: "have",
    does: "do",
    did: "do",
    goes: "go",
    went: "go",
    made: "make",
    gave: "give",
    got: "get",
    took: "take",
    wrote: "write",
    saw: "see",
    ate: "eat",
    ran: "run",
    bought: "buy",
    taught: "teach",
    thought: "think",
    brought: "bring",
    laughed: "laugh",
    opened: "open",
    cleaned: "clean",
    walked: "walk",
    played: "play",
    smiled: "smile",
    liked: "like",
    used: "use",
    closed: "close",
    watched: "watch",
    looked: "look",
  };
  const lower = text.toLowerCase();
  if (irregular[lower]) return irregular[lower];
  if (/ied$/i.test(text)) return text.replace(/ied$/i, "y");
  if (/([sxz]|ch|sh)es$/i.test(text)) return text.replace(/es$/i, "");
  if (/[^s]s$/i.test(text)) return text.replace(/s$/i, "");
  if (/ed$/i.test(text)) {
    const stem = text.replace(/ed$/i, "");
    if (/[^aeiou][aeiou][^aeiouwxy]$/i.test(stem)) return stem.slice(0, -1);
    if (/e$/i.test(stem)) return stem;
    return `${stem}e`;
  }
  return text;
}

function guessKoreanVerbBase(value) {
  const text = String(value || "")
    .replace(/\([^)]*\)/g, "")
    .replace(/[_*]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return "";
  if (/했다$/.test(text)) return text.replace(/했다$/, "하다");
  if (/하였다$/.test(text)) return text.replace(/하였다$/, "하다");
  if (/되었다$/.test(text)) return text.replace(/되었다$/, "되다");
  if (/렸다$/.test(text)) return text.replace(/렸다$/, "리다");
  if (/았다$/.test(text)) return text.replace(/았다$/, "다");
  if (/었다$/.test(text)) return text.replace(/었다$/, "다");
  if (/였다$/.test(text)) return text.replace(/였다$/, "이다");
  if (/갔다$/.test(text)) return text.replace(/갔다$/, "가다");
  if (/왔다$/.test(text)) return text.replace(/왔다$/, "오다");
  return text;
}

function normalizeHintKorean(value, role) {
  const text = String(value || "")
    .replace(/\([^)]*\)/g, "")
    .replace(/[_*]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (role === "V") return guessKoreanVerbBase(text) || text;
  return text.replace(/[은는이가을를]$/u, "");
}

function chooseSVTDHintRole(expectedSlots, preferredRole = activeHintRole) {
  const order = ["S", "V", "T", "D"];
  if (order.includes(preferredRole)) return preferredRole;
  return order.find((role) => !(expectedSlots[role] || {}).empty) || "S";
}

function buildSVTDHintText(q, role, expectedSlots) {
  const answerPart = svtdAnswerPart(q.answer, role);
  const guide = parseSVTDGuidePart(answerPart);
  const rawCore = guide.core || firstSVTDHintCore(expectedSlots[role]);
  const core = normalizeHintEnglish(rawCore, role);
  const questionSlot = stripEmphasisMarkers(String(parseSVTDSlots(q.question)[role] || ""))
    .replace(/_+/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const clue = normalizeHintKorean(questionSlot || guide.prefix, role);

  if ((expectedSlots[role] || {}).empty) return "\uBE44\uC6CC\uB3C4 \uB428";
  if (guide.prefix && core) return `${guide.prefix} = ${core}`;
  if (clue && core) return `${clue} = ${core}`;
  if (core) return core;
  return "\uD78C\uD2B8 \uC5C6\uC74C";
}

function buildSVTDHintHtml(q, preferredRole = activeHintRole) {
  const expectedSlots = parseSVTDAnswerSlots(q.answer);
  const role = chooseSVTDHintRole(expectedSlots, preferredRole);
  const roleClass = svtdRoleClass(role);
  const roleTag = roleClass ? renderSVTDInlineTag(svtdRoleLabel(role), roleClass) : escapeHtml(role);
  return `${roleTag} <span>${escapeHtml(buildSVTDHintText(q, role, expectedSlots))}</span>`;
}

function handleNextOrHint() {
  if (isCurrentLocked) {
    goNext();
    return;
  }
  showHintTooltip(activeHintRole);
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

function svtdRoleFromText(value) {
  const text = String(value || "");
  const lower = text.toLowerCase();
  if (/^s/i.test(text) || text.includes("\uC8FC\uC5B4") || text.includes("\uB204\uAC00")) return "subject";
  if (/^v/i.test(text) || text.includes("\uB3D9\uC0AC") || text.includes("\uD588\uB2E4")) return "verb";
  if (/^t/i.test(text) || lower.includes("target") || text.includes("\uB204\uAD6C\uD55C\uD14C")) return "target";
  if (/^d/i.test(text) || lower.includes("detail") || text.includes("\uC5B4\uB5BB\uAC8C")) return "detail";
  return "";
}

function renderSVTDInlineTag(value, role) {
  return `<span class="svtd-inline-tag is-${role}">${escapeHtml(value)}</span>`;
}

function renderSVTDColoredSegment(value) {
  const text = String(value ?? "");
  const re = /(SVTD|S\s*\([^)]*\)|V\s*\([^)]*\)|T\s*\([^)]*\)|D\s*\([^)]*\)|\b[SVTD]\b|\uC8FC\uC5B4|\uB3D9\uC0AC|target|Target|detail|Detail|\uB204\uAC00|\uD588\uB2E4|\uB204\uAD6C\uD55C\uD14C|\uC5B4\uB5BB\uAC8C)/g;
  let out = "";
  let last = 0;
  let m;

  while ((m = re.exec(text)) !== null) {
    const token = String(m[0] || "");
    const role = svtdRoleFromText(token);
    out += escapeHtmlWithBreaks(text.slice(last, m.index));
    if (token === "SVTD") {
      out += ["S", "V", "T", "D"].map((x) => renderSVTDInlineTag(x, svtdRoleClass(x))).join("");
    } else {
      out += role ? renderSVTDInlineTag(token, role) : escapeHtml(token);
    }
    last = re.lastIndex;
  }

  out += escapeHtmlWithBreaks(text.slice(last));
  return out;
}

function renderInstructionWithSVTDColors(value) {
  const text = normalizeEscapedBreaks(String(value ?? ""));
  const re = /\*\*(.*?)\*\*/gs;
  let out = "";
  let last = 0;
  let m;

  while ((m = re.exec(text)) !== null) {
    out += renderSVTDColoredSegment(text.slice(last, m.index));
    out += `<span class="focus-token">${renderSVTDColoredSegment(String(m[1] ?? "").trim())}</span>`;
    last = re.lastIndex;
  }

  out += renderSVTDColoredSegment(text.slice(last));
  return out;
}

function parseSVTDSlots(questionRaw) {
  const order = ["S", "V", "T", "D"];
  const out = { S: "", V: "", T: "", D: "" };

  const firstLine = normalizeEscapedBreaks(String(questionRaw ?? "")).split(/\n/)[0].trim();
  if (!firstLine) return out;

  const parts = firstLine.split("/").map((x) => String(x || "").trim()).filter(Boolean);
  parts.slice(0, 4).forEach((part, idx) => {
    const m = part.match(/\(([SVTD])\)\s*$/i);
    const role = (m?.[1] || order[idx]).toUpperCase();
    if (!out.hasOwnProperty(role)) return;

    let value = m ? part.slice(0, m.index).trim() : part;
    if (/^_+$/.test(value) || value === "___" || value === "없음") value = "";
    out[role] = value;
  });

  return out;
}

function renderSVTDTable(questionRaw) {
  const slots = parseSVTDSlots(questionRaw);
  const hasRoleMarkers = /\([SVTD]\)/i.test(String(questionRaw || ""));
  if (!hasRoleMarkers) {
    return renderTextWithEmphasis(questionRaw).replace(/_{2,}/g, (m) => `<span class="blank-slot">${m}</span>`);
  }

  const order = ["S", "V", "T", "D"];
  const head = order.map((k) => `<th>${k}</th>`).join("");
  const body = order.map((k) => {
    const val = String(slots[k] || "").trim();
    return `<td>${val ? renderTextWithEmphasis(val) : '<span class="svtd-empty">&nbsp;</span>'}</td>`;
  }).join("");

  return `<table class="svtd-table"><thead><tr>${head}</tr></thead><tbody><tr>${body}</tr></tbody></table>`;
}

function getSVTDVisibleRoles(questionRaw) {
  const slots = parseSVTDSlots(questionRaw);
  return {
    S: !!String(slots.S || "").trim(),
    V: !!String(slots.V || "").trim(),
    T: !!String(slots.T || "").trim(),
    D: !!String(slots.D || "").trim(),
  };
}

function renderSVTDInputForm(placeholders = null, visibleRoles = null, affixes = null) {
  const ph = placeholders || { S: "", V: "", T: "", D: "" };
  const show = visibleRoles || { S: true, V: true, T: true, D: true };
  const fx = affixes || {
    S: { prefix: "", suffix: "" },
    V: { prefix: "", suffix: "" },
    T: { prefix: "", suffix: "" },
    D: { prefix: "", suffix: "" },
  };

  const affixClass = (text) => {
    const len = String(text || "").replace(/\s+/g, " ").trim().length;
    if (len >= 9) return " svtd-affix-long";
    if (len >= 5) return " svtd-affix-mid";
    return "";
  };

  const renderRow = (role, labelHtml, id) => `
      <div class="svtd-input-row">
        <label class="svtd-input-label" for="${id}">${labelHtml}</label>
        ${show[role]
          ? `<div class="svtd-field-wrap">
              ${fx[role]?.prefix ? `<span class="svtd-affix svtd-affix-prefix${affixClass(fx[role].prefix)}">${escapeHtml(fx[role].prefix)}</span>` : ""}
              <input id="${id}" class="short-input svtd-field" type="text" autocomplete="off" placeholder="${escapeHtmlAttr(ph[role] || "")}" />
              ${fx[role]?.suffix ? `<span class="svtd-affix svtd-affix-suffix${affixClass(fx[role].suffix)}">${escapeHtml(fx[role].suffix)}</span>` : ""}
            </div>`
          : `<div class="svtd-input-none" aria-hidden="true"></div>`}
      </div>`;

  return `
    <div class="svtd-input-wrap">
      ${renderRow("S", "누가? :", "svtd-input-s")}
      ${renderRow("V", "어떤 행동을? :", "svtd-input-v")}
      ${renderRow("T", '<span class="scope-deco" aria-hidden="true"></span>어디다가? :', "svtd-input-t")}
      ${renderRow("D", "자세히 설명 :", "svtd-input-d")}
    </div>
  `;
}

function parseSVTDGuidePart(partRaw) {
  const text = normalizeEscapedBreaks(String(partRaw || "")).trim();
  if (!text) return { prefix: "", core: "", suffix: "" };

  const noParen = text.replace(/\([^)]*\)/g, "").trim();
  if (!noParen) return { prefix: "", core: "", suffix: "" };

  let rest = noParen;
  const prefixParts = [];
  while (true) {
    const m = rest.match(/^\s*\*\*(.*?)\*\*/s);
    if (!m) break;
    const token = String(m[1] || "").trim();
    if (token) prefixParts.push(token);
    rest = rest.slice(m[0].length);
  }

  let coreSource = rest;
  const suffixParts = [];
  while (true) {
    const m = coreSource.match(/\*\*(.*?)\*\*\s*$/s);
    if (!m) break;
    const token = String(m[1] || "").trim();
    if (token) suffixParts.unshift(token);
    coreSource = coreSource.slice(0, m.index).trimEnd();
  }

  const core = stripEmphasisMarkers(coreSource).replace(/\s+/g, " ").trim();
  return {
    prefix: prefixParts.join(" ").trim(),
    core,
    suffix: suffixParts.join(" ").trim(),
  };
}

function extractSVTDAnswerEnglishSlots(answerRaw) {
  const parts = normalizeEscapedBreaks(String(answerRaw || ""))
    .split(/\s*-\s*/)
    .map((x) => String(x || "").trim());

  const order = ["S", "V", "T", "D"];
  const out = { S: "", V: "", T: "", D: "" };

  order.forEach((role, idx) => {
    const part = String(parts[idx] || "").trim();
    if (!part || /\(\s*없음\s*\)|^없음$|^___$|^_$/.test(part)) {
      out[role] = "";
      return;
    }
    const guide = parseSVTDGuidePart(part);
    out[role] = guide.core || "";
  });

  return out;
}

function extractSVTDAffixes(answerRaw) {
  const parts = normalizeEscapedBreaks(String(answerRaw || ""))
    .split(/\s*-\s*/)
    .map((x) => String(x || "").trim());

  const order = ["S", "V", "T", "D"];
  const out = {
    S: { prefix: "", suffix: "" },
    V: { prefix: "", suffix: "" },
    T: { prefix: "", suffix: "" },
    D: { prefix: "", suffix: "" },
  };

  order.forEach((role, idx) => {
    const part = String(parts[idx] || "").trim();
    if (!part || /\(\s*없음\s*\)|^없음$|^___$|^_$/.test(part)) return;
    const guide = parseSVTDGuidePart(part);
    out[role] = { prefix: guide.prefix || "", suffix: guide.suffix || "" };
  });

  return out;
}

function collectSVTDUserSlots() {
  return {
    S: String(document.getElementById("svtd-input-s")?.value || "").trim(),
    V: String(document.getElementById("svtd-input-v")?.value || "").trim(),
    T: String(document.getElementById("svtd-input-t")?.value || "").trim(),
    D: String(document.getElementById("svtd-input-d")?.value || "").trim(),
  };
}

function parseSVTDAnswerSlots(answerRaw) {
  const order = ["S", "V", "T", "D"];
  const out = {
    S: { empty: false, candidates: [] },
    V: { empty: false, candidates: [] },
    T: { empty: false, candidates: [] },
    D: { empty: false, candidates: [] },
  };

  const parts = normalizeEscapedBreaks(String(answerRaw || ""))
    .split(/\s*-\s*/)
    .map((x) => String(x || "").trim());

  order.forEach((role, idx) => {
    out[role] = parseSVTDAnswerPart(parts[idx] || "");
  });

  return out;
}

function parseSVTDAnswerPart(partRaw) {
  const text = normalizeEscapedBreaks(String(partRaw || "")).trim();
  const empty = !text || /\(\s*없음\s*\)|^없음$|^___$|^_$/i.test(text);
  if (empty) {
    return { empty: true, candidates: ["", "없음", "_"] };
  }

  const set = new Set();
  set.add(text);

  const outside = text.replace(/\([^)]*\)/g, "").trim();
  if (outside) set.add(outside);
  const guide = parseSVTDGuidePart(text);
  if (guide.core) set.add(guide.core);

  const re = /\(([^()]*)\)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const inner = String(m[1] || "").trim();
    if (inner) set.add(inner);
  }

  String(text)
    .split(/[\/,]/)
    .map((x) => String(x || "").trim())
    .filter(Boolean)
    .forEach((x) => {
      set.add(x);
      const g = parseSVTDGuidePart(x);
      if (g.core) set.add(g.core);
    });

  return { empty: false, candidates: Array.from(set) };
}

function isSVTDSlotsCorrect(userSlots, expectedSlots) {
  const order = ["S", "V", "T", "D"];
  const emptyNorms = new Set(["", "없음", "_"].map((x) => normalizeLoose(x, "rewrite")));

  for (const role of order) {
    const user = normalizeLoose(String(userSlots[role] || ""), "rewrite");
    const expected = expectedSlots[role] || { empty: false, candidates: [] };

    if (expected.empty) {
      if (!user || emptyNorms.has(user)) continue;
      return false;
    }

    if (!user) return false;

    const candidateNorms = (expected.candidates || [])
      .map((x) => normalizeLoose(String(x || ""), "rewrite"))
      .filter(Boolean);

    const exact = candidateNorms.some((c) => c === user);
    const relaxed = candidateNorms.some((c) => (c.length >= 2 && c.includes(user)) || (user.length >= 2 && user.includes(c)));
    if (!exact && !relaxed) return false;
  }

  return true;
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







