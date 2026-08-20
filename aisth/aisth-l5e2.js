// aisth-l5e2.js
// Independent runtime for Aisth Lesson 5 Exercise 2

const TARGET_LESSON = 5;
const TARGET_EXERCISE = 2;
const PAGE_LABEL = "Aisth L5-E2";
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
let day = "017";
let quizTitle = "quiz_Grammar_aisth_l5e2";
let userId = "";

let rawRows = [];
let questions = [];
let currentIndex = 0;
let results = [];
let isCurrentLocked = false;
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

    .dual-input-row {
      display: flex;
      gap: 10px;
      align-items: stretch;
    }

    .dual-input-col {
      width: 50%;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .dual-input {
      width: 100%;
      font-size: 17px;
      font-weight: 900;
      text-align: center;
      letter-spacing: 0.2px;
    }

    .dual-input::placeholder {
      color: #b9b2aa;
      font-weight: 700;
    }

    .hint-line {
      margin-top: 6px;
      font-size: 13px;
      color: #5a4637;
      line-height: 1.45;
    }

    .verb-pill {
      margin-top: 0;
      margin-bottom: 8px;
    }

    .l52-question-box .question-instruction {
      margin: 3px 0 12px;
      color: #111;
      font-size: 17px;
      line-height: 1.5;
      font-weight: 950;
      word-break: keep-all;
    }

    .l52-question-box .sentence {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 112px;
      padding: 18px 12px;
      color: #203736;
      font-size: 17px;
      font-weight: 850;
      line-height: 1.75;
      text-align: center;
      box-sizing: border-box;
    }

    .l52-question-box .hint-line {
      margin-top: 9px;
      color: #5a4637;
      font-size: 13px;
      font-weight: 750;
      line-height: 1.5;
      text-align: center;
    }

    .l52-verb-pill {
      margin: 0 0 10px;
      padding: 0;
      border: 0;
      background: transparent;
      color: var(--aisth-role-v, #d8a21b);
      box-shadow: none;
      font-size: 24px;
      font-weight: 950;
      line-height: 1.15;
    }

    .l52-prompt-slot.is-have {
      border-color: rgba(241,123,42,.56);
      background: #fff2e7;
      color: #d96317;
    }

    .l52-prompt-slot.is-pp {
      border-color: #8a8a8a;
      background: linear-gradient(135deg,#f8f8f8 0%,#ececec 28%,#d4d4d4 53%,#f7f7f7 76%,#c9c9c9 100%);
      color: #242424;
    }

    .l52-answer-box {
      overflow: visible;
    }

    .l52-slot-pair {
      display: grid;
      grid-template-columns: minmax(0,1fr);
      align-items: start;
      gap: 10px;
    }

    .l52-slot-pair.is-single {
      grid-template-columns: minmax(0,1fr);
    }

    .l52-role-block {
      min-width: 0;
      padding: 7px 5px 4px;
      border-radius: 12px;
      background: rgba(255,255,255,.72);
    }

    .l52-role-label {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 24px;
      height: 20px;
      margin-bottom: 2px;
      border-radius: 999px;
      font-size: 10px;
      line-height: 1;
      font-weight: 950;
    }

    .l52-role-label.is-have {
      border: 1px solid rgba(241,123,42,.42);
      background: #fff2e7;
      color: #d96317;
    }

    .l52-role-label.is-pp {
      border: 1px solid #8a8a8a;
      background: linear-gradient(135deg,#f8f8f8 0%,#ddd 52%,#fff 72%,#c9c9c9 100%);
      color: #242424;
    }

    #quiz-area .l52-have-control .aisth-slot-cell:not(.is-slot-correct):not(.is-slot-wrong):not(.is-placeholder) {
      border-color: rgba(241,123,42,.58);
      border-bottom-color: #dc671d;
      background: linear-gradient(180deg,#fffaf6 0%,#fff0e4 58%,#ffe1ca 100%);
      color: #d96317;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.94), 0 3px 8px rgba(217,99,23,.10);
    }

    #quiz-area .l52-pp-control .aisth-slot-cell:not(.is-slot-correct):not(.is-slot-wrong):not(.is-placeholder) {
      border-color: #929292;
      border-bottom-color: #626262;
      background: linear-gradient(135deg,#fafafa 0%,#ededed 28%,#d1d1d1 52%,#fff 72%,#c6c6c6 100%);
      color: #232323;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.96), 0 3px 8px rgba(0,0,0,.10);
    }

    #quiz-area .l52-have-control:focus-within .aisth-slot-cell.is-active:not(.is-placeholder),
    #quiz-area .l52-pp-control:focus-within .aisth-slot-cell.is-active:not(.is-placeholder) {
      transform: translateY(-1px);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.96), 0 0 0 2px rgba(90,90,90,.11), 0 6px 12px rgba(0,0,0,.12);
    }

    .l52-slot-pair .aisth-slot-control {
      gap: 6px 3px;
      padding-top: 6px;
    }

    .l52-slot-pair .aisth-slot-shell {
      gap: 2px;
    }

    .l52-slot-pair .aisth-slot-cell {
      width: 21px;
      height: 34px;
      font-size: 16px;
    }

    #quiz-area .l52-answer-box .l52-static-apostrophe {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      align-self: stretch;
      padding: 0 1px;
      color: #232323;
      font-size: 18px;
      line-height: 1;
      font-weight: 950;
    }

    #quiz-area .l52-have-control .l52-static-apostrophe {
      color: #d96317;
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
    const blankSlotCount = countBlankSlots(question);
    const parts = splitBlankAnswerParts(answer);
    const blankMeta = parseBlankQuestionMeta(question);

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
      blankSlotCount,
      expectedFront: parts.front,
      expectedBack: parts.back,
      blankStem: blankMeta.stem,
      blankVerbHint: blankMeta.verbHint,
      blankKoHint: blankMeta.koHint,
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

function countBlankSlots(question) {
  const m = String(question || "").match(/_{2,}/g);
  return m ? m.length : 0;
}

function splitBlankAnswerParts(answer) {
  const tokens = String(answer || "").trim().split(/\s+/).filter(Boolean);
  if (!tokens.length) return { front: "", back: "" };
  if (tokens.length === 1) return { front: "", back: tokens[0] };
  return { front: tokens[0], back: tokens[tokens.length - 1] };
}

function parseBlankQuestionMeta(question) {
  const raw = normalizeEscapedBreaks(String(question || "")).trim();
  const out = { stem: raw, verbHint: "", koHint: "" };

  const m = raw.match(/\(([^()]*)\)\s*$/s);
  if (!m) return out;

  const inside = String(m[1] || "").trim();
  if (!inside) return out;

  const parts = inside.split(",").map((x) => x.trim());
  const first = String(parts[0] || "").trim();
  const rest = parts.slice(1).map((x) => x.trim()).filter(Boolean).join(", ");

  const stemCandidate = raw.slice(0, m.index).trim();
  if (!first) return out;

  if (/[a-zA-Z]/.test(first)) {
    out.stem = stemCandidate || out.stem;
    out.verbHint = first;
    out.koHint = rest;
    return out;
  }

  return out;
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

  const qSource = q.type === "blank" ? (q.blankStem || q.question) : q.question;
  const qBody = renderBlankBodyWithAB(qSource, q.type, q.blankSlotCount);

  const inputHtml = q.type === "blank"
    ? renderL52BlankInputHtml(q)
    : `<input id="user-answer" class="short-input l52-rewrite-source" type="text" autocomplete="off" inputmode="latin" lang="en" autocapitalize="none" spellcheck="false" />`;

  area.innerHTML = `
    <div class="q-label">Q. ${currentIndex + 1} / ${questions.length}</div>

    <div class="box l52-question-box">
      <div class="question-instruction">${renderTextWithEmphasis(q.instruction || TEXT.INPUT_HINT_FALLBACK)}</div>
      <div class="sentence aisth-question-surface">
        ${q.type === "blank" && q.blankVerbHint ? `<span class="pill verb-pill l52-verb-pill">${escapeHtml(q.blankVerbHint)}</span>` : ""}
        <div>${qBody}</div>
        ${q.type === "blank" && q.blankKoHint ? `<div class="hint-line">(${escapeHtml(q.blankKoHint)})</div>` : ""}
      </div>
    </div>

    <div class="box aisth-letter-answer-box l52-answer-box">
      <div class="aisth-answer-tool-row">
        <span aria-hidden="true"></span>
        <span class="aisth-type-pill">type!</span>
        <span class="aisth-answer-tool-end"><button class="aisth-hint-tool" id="hint-btn" type="button" aria-label="hint"><span class="aisth-hint-bulb" aria-hidden="true">!</span><span>hint</span></button></span>
      </div>
      ${inputHtml}
      <div id="feedback" class="feedback"></div>
    </div>

    <div class="btn-row">
      <button class="quiz-btn" id="next-btn" type="button">Skip</button>
    </div>
  `;

  const hintBtn = document.getElementById("hint-btn");
  const nextBtn = document.getElementById("next-btn");
  const input = document.getElementById("user-answer");
  const frontInput = document.getElementById("user-answer-front");
  const backInput = document.getElementById("user-answer-back");
  const frontSlotControl = frontInput && q.expectedFront && window.AisthInputSlots
    ? window.AisthInputSlots.enhance(frontInput, { modelText: makeL52EditableModelText(q.expectedFront), onEnter: submitCurrentAnswer })
    : null;
  const backModel = q.type === "blank" ? (q.expectedBack || q.answer) : "";
  const backSlotControl = backInput && backModel && window.AisthInputSlots
    ? window.AisthInputSlots.enhance(backInput, { modelText: makeL52EditableModelText(backModel), onEnter: submitCurrentAnswer })
    : null;
  const slotInputControl = input && window.AisthInputSlots
    ? window.AisthInputSlots.enhance(input, { modelText: makeL52EditableModelText(q.answer), onEnter: submitCurrentAnswer })
    : null;

  if (frontSlotControl?.control) frontSlotControl.control.classList.add("l52-have-control");
  if (backSlotControl?.control) backSlotControl.control.classList.add("l52-pp-control");
  if (slotInputControl?.control) slotInputControl.control.classList.add("l52-pp-control");
  if (frontSlotControl?.control) installL52StaticApostrophes(q.expectedFront, frontSlotControl.control);
  if (backSlotControl?.control) installL52StaticApostrophes(backModel, backSlotControl.control);
  if (slotInputControl?.control) installL52StaticApostrophes(q.answer, slotInputControl.control);

  const activeSlots = [
    { input: frontInput, api: frontSlotControl, model: q.expectedFront },
    { input: backInput, api: backSlotControl, model: backModel },
    { input, api: slotInputControl, model: q.answer },
  ].filter((item) => item.input && item.api?.control && item.model);

  activeSlots.forEach((item, itemIndex) => {
    applyL52PlaceholderAnimationDelays(item.api.control);
    item.input.addEventListener("input", () => updateL52AnswerState(q, activeSlots, itemIndex));
  });

  if (hintBtn) {
    hintBtn.addEventListener("click", () => {
      activeSlots.forEach((item) => revealL52FirstSlotPlaceholder(item.api.control, item.model));
      hintBtn.disabled = true;
    });
  }
  if (nextBtn) nextBtn.addEventListener("click", goNext);

  updateL52AnswerState(q, activeSlots);
  if (activeSlots[0]?.api) activeSlots[0].api.focus();
}

function renderL52BlankInputHtml(q) {
  const hasFront = (q?.blankSlotCount || 0) >= 2 && Boolean(q?.expectedFront);
  return `
    <div class="l52-slot-pair${hasFront ? "" : " is-single"}">
      ${hasFront ? `
        <div class="l52-role-block">
          <span class="l52-role-label is-have">A</span>
          <input id="user-answer-front" class="short-input" type="text" autocomplete="off" inputmode="latin" lang="en" autocapitalize="none" spellcheck="false" aria-label="A answer" />
        </div>
      ` : ""}
      <div class="l52-role-block">
        <span class="l52-role-label is-pp">B</span>
        <input id="user-answer-back" class="short-input" type="text" autocomplete="off" inputmode="latin" lang="en" autocapitalize="none" spellcheck="false" aria-label="B answer" />
      </div>
    </div>
  `;
}

function updateL52AnswerState(q, activeSlots, changedIndex = -1) {
  if (!q || isCurrentLocked || !Array.isArray(activeSlots) || !activeSlots.length) return;
  const slotStates = activeSlots.map((item) => updateL52SingleSlotState(item.input, item.api.control, item.model));
  const allCorrect = slotStates.every(Boolean);
  if (allCorrect) {
    submitCurrentAnswer();
    return;
  }
  if (changedIndex >= 0 && slotStates[changedIndex] && activeSlots[changedIndex + 1]?.api) {
    activeSlots[changedIndex + 1].api.focus();
  }
}

function updateL52SingleSlotState(sourceInput, control, modelText) {
  if (!sourceInput || !control || !modelText) return false;
  const modelChars = getL52AnswerChars(pickL52SlotModelText(modelText));
  const userChars = getL52AnswerChars(sourceInput.value);
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
  return allCorrect;
}

function revealL52FirstSlotPlaceholder(control, modelText) {
  if (!control) return;
  const firstChar = getL52AnswerChars(pickL52SlotModelText(modelText))[0] || "";
  if (!firstChar) return;
  control.classList.remove("is-full-hint");
  control.classList.add("has-revealed-hint");
  control.dataset.placeholderChars = firstChar;
  const flowInput = control.querySelector(".aisth-slot-input");
  if (flowInput) flowInput.dispatchEvent(new Event("input", { bubbles: true }));
}

function applyL52PlaceholderAnimationDelays(control) {
  if (!control) return;
  Array.from(control.querySelectorAll(".aisth-slot-cell")).forEach((cell, idx) => {
    cell.style.setProperty("--aisth-placeholder-delay", `${(idx * 0.16).toFixed(2)}s`);
  });
}

function pickL52SlotModelText(value) {
  return String(value || "").replace(/[.?!~]+$/g, "").trim();
}

function getL52AnswerChars(value) {
  return Array.from(String(value || "").replace(/[\s’']/g, ""));
}

function makeL52EditableModelText(value) {
  return pickL52SlotModelText(value).replace(/[’']/g, "");
}

function installL52StaticApostrophes(modelText, control) {
  if (!control || !/[’']/.test(String(modelText || ""))) return;
  const words = pickL52SlotModelText(modelText).split(/\s+/).filter(Boolean);
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
      apostrophe.className = "l52-static-apostrophe";
      apostrophe.setAttribute("aria-hidden", "true");
      apostrophe.textContent = "'";
      const previousCell = cells[Math.max(0, letterIndex - 1)];
      if (previousCell) previousCell.insertAdjacentElement("afterend", apostrophe);
      else shell.prepend(apostrophe);
    });
  });

  const flowInput = control.querySelector(".aisth-slot-input");
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

function submitCurrentAnswer() {
  if (isCurrentLocked) return;

  const q = questions[currentIndex];
  const input = document.getElementById("user-answer");
  const frontInput = document.getElementById("user-answer-front");
  const backInput = document.getElementById("user-answer-back");
  const submitBtn = document.getElementById("submit-btn");
  const nextBtn = document.getElementById("next-btn");
  const feedback = document.getElementById("feedback");

  if (!q) return;

  let userRaw = "";
  let ok = false;

  if (q.type === "blank") {
    const frontRaw = String(frontInput?.value || "").trim();
    const backRaw = String(backInput?.value || "").trim();

    if (!frontRaw && !backRaw) {
      showToast("no", TEXT.INPUT_REQUIRED);
      return;
    }

    userRaw = `${frontRaw} / ${backRaw}`.trim();

    if ((q.blankSlotCount || 0) >= 2) {
      const frontOk = q.expectedFront ? isAnswerCorrect("blank", frontRaw, q.expectedFront) : true;
      const backOk = q.expectedBack ? isAnswerCorrect("blank", backRaw, q.expectedBack) : true;
      ok = frontOk && backOk;
    } else {
      ok =
        isAnswerCorrect("blank", frontRaw, q.answer) ||
        isAnswerCorrect("blank", backRaw, q.answer) ||
        isAnswerCorrect("blank", `${frontRaw} ${backRaw}`.trim(), q.answer);
    }
  } else {
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
  if (input) input.disabled = true;
  if (window.AisthInputSlots) window.AisthInputSlots.setDisabled(input, true);
  if (frontInput) {
    frontInput.disabled = true;
    if (window.AisthInputSlots) window.AisthInputSlots.setDisabled(frontInput, true);
  }
  if (backInput) {
    backInput.disabled = true;
    if (window.AisthInputSlots) window.AisthInputSlots.setDisabled(backInput, true);
  }
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

function renderBlankBodyWithAB(value, type, blankSlotCount = 0) {
  let blankIndex = 0;
  const base = renderTextWithEmphasis(value);

  return base.replace(/_{2,}/g, (m) => {
    blankIndex += 1;
    if (type !== "blank") return `<span class="blank-slot">${m}</span>`;

    let label = "";
    if (blankSlotCount === 1 && blankIndex === 1) label = "B";
    if (blankSlotCount !== 1 && blankIndex === 1) label = "A";
    if (blankIndex === 2) label = "B";

    if (!label) return `<span class="blank-slot">${m}</span>`;

    const underscoreCount = m.length;
    const leftCount = Math.floor((underscoreCount - 1) / 2);
    const rightCount = Math.max(0, underscoreCount - 1 - leftCount);
    const leftSide = "_".repeat(leftCount);
    const rightSide = "_".repeat(rightCount);
    const roleClass = label === "A" ? " is-have" : " is-pp";
    return `<span class="blank-slot l52-prompt-slot${roleClass}">${leftSide}${label}${rightSide}</span>`;
  });
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







