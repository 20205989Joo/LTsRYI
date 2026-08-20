// aisth-l6e1.js
// Independent runtime for Aisth Lesson 6 Exercise 1

const TARGET_LESSON = 6;
const TARGET_EXERCISE = 1;
const PAGE_LABEL = "Aisth L6-E1";
const MAX_QUESTIONS = 0; // 0 = unlimited
const GROUP_SIZE = 3;

const L61_VERB_MEANING_HINTS = {
  running: { base: "run", meaning: "달리다" },
  caught: { base: "catch", meaning: "잡다" },
  written: { base: "write", meaning: "쓰다" },
  broken: { base: "break", meaning: "깨다" },
  cooked: { base: "cook", meaning: "요리하다" },
  fallen: { base: "fall", meaning: "떨어지다" },
  read: { base: "read", meaning: "읽다" },
  laughing: { base: "laugh", meaning: "웃다" },
  injured: { base: "injure", meaning: "다치게 하다" },
  invited: { base: "invite", meaning: "초대하다" },
  growing: { base: "grow", meaning: "자라다" },
  shining: { base: "shine", meaning: "빛나다" },
  swimming: { base: "swim", meaning: "수영하다" },
  boiled: { base: "boil", meaning: "끓이다" },
  sung: { base: "sing", meaning: "노래하다" },
  painted: { base: "paint", meaning: "칠하다" },
  drawn: { base: "draw", meaning: "그리다" },
  forgotten: { base: "forget", meaning: "잊다" },
  smiling: { base: "smile", meaning: "미소 짓다" },
  cleaned: { base: "clean", meaning: "청소하다" },
};

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
let day = "020";
let quizTitle = "quiz_Grammar_aisth_l6e1";
let userId = "";

let rawRows = [];
let questions = [];
let questionGroups = [];
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

    .set-item-q {
      line-height: 1.6;
      font-size: 14px;
      margin-bottom: 8px;
      word-break: keep-all;
      white-space: pre-wrap;
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

    .inline-blank-input {
      width: 46px;
      height: 22px;
      border: 1px solid #d5a22a;
      border-radius: 6px;
      padding: 0 4px;
      font-size: 13px;
      font-weight: 800;
      color: #7e3106;
      background: #fff8e4;
      text-align: center;
      vertical-align: middle;
      box-sizing: border-box;
      outline: none;
      margin: 0 2px;
    }

    #quiz-area .l61-slot-control {
      display: inline-flex;
      width: auto;
      max-width: 100%;
      flex-wrap: nowrap;
      gap: 4px 3px;
      padding: 2px 3px;
      vertical-align: middle;
    }

    #quiz-area .l61-slot-control .aisth-slot-shell {
      min-height: 34px;
      gap: 2px;
    }

    #quiz-area .l61-slot-control .aisth-slot-cell {
      width: 27px;
      height: 34px;
      border-color: rgba(216,162,27,.54);
      border-bottom-color: var(--aisth-role-v-border, #c88a12);
      background: var(--aisth-role-v-bg, #fff4cc);
      color: var(--aisth-role-v-text, #7a4a00);
      font-size: 16px;
    }

    #quiz-area .l61-slot-control .aisth-slot-cell.is-slot-correct {
      border-color: #3f9a68;
      border-bottom-color: #28764c;
      background: linear-gradient(180deg,#f1fff6 0%,#d8f4e3 100%);
      color: #17643c;
    }

    #quiz-area .l61-slot-control .aisth-slot-cell.is-slot-wrong {
      border-color: #dc3f3f;
      border-bottom-color: #b62d2d;
      background: linear-gradient(180deg,#fff5f5 0%,#ffdede 100%);
      color: #a91f1f;
    }

    .l61-meaning-hint {
      position: absolute;
      z-index: 50;
      top: 46px;
      right: 10px;
      display: none;
      width: fit-content;
      max-width: calc(100% - 18px);
      margin: 0;
      padding: 8px 13px;
      border: 1px solid rgba(201,154,24,.72);
      border-radius: 14px;
      background: linear-gradient(180deg,#fff9bf 0%,#ffe67a 100%);
      color: #684900;
      box-shadow: 0 9px 20px rgba(140,101,4,.22);
      font-size: 13px;
      font-weight: 850;
      text-align: center;
      pointer-events: none;
    }

    .l61-answer-stage { position: relative; isolation: isolate; }

    .l61-meaning-hint.is-visible {
      display: block;
      animation: l61HintPop .3s cubic-bezier(.2,1.35,.4,1) both;
    }

    .l61-meaning-hint::before {
      content: "";
      position: absolute;
      top: -7px;
      right: 20px;
      width: 12px;
      height: 12px;
      border-left: 1px solid rgba(201,154,24,.72);
      border-top: 1px solid rgba(201,154,24,.72);
      background: #fff9bf;
      transform: rotate(45deg);
    }

    .l61-hint-base { color: #5c3b00; font-weight: 950; }
    .l61-hint-equals { padding: 0 5px; color: #a47600; }

    @keyframes l61HintPop {
      from { opacity: 0; transform: translateY(-5px) scale(.94); }
      to { opacity: 1; transform: translateY(0) scale(1); }
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

  const firstNo = group[0].qNumber;
  const lastNo = group[group.length - 1].qNumber;
  const instruction = stripEmphasisMarkers(group[0].instruction || TEXT.INPUT_HINT_FALLBACK);

  const itemsHtml = group.map((q, idx) => {
    const qBody = renderQuestionWithInlineInputs(q.question, idx);
    return `
      <div class="set-item">
        <div class="set-item-q">${qBody}</div>
      </div>
    `;
  }).join("");

  area.innerHTML = `
    <div class="q-label">SET ${currentIndex + 1} / ${questionGroups.length} (Q${firstNo}-${lastNo})</div>

    <div class="box">
      <div class="question-instruction">${escapeHtml(instruction)}</div>
    </div>

    <div class="box l61-answer-stage" style="background:#fff;">
      <div class="aisth-answer-tool-row">
        <span aria-hidden="true"></span>
        <span class="aisth-type-pill">type!</span>
        <span class="aisth-answer-tool-end"><button class="aisth-hint-tool" id="hint-btn" type="button" aria-label="hint"><span class="aisth-hint-bulb" aria-hidden="true">!</span><span>hint</span></button></span>
      </div>
      <div class="l61-meaning-hint" id="l61-meaning-hint" role="status" aria-live="polite"></div>
      ${itemsHtml}
      <div id="feedback" class="feedback"></div>
    </div>

    <div class="btn-row">
      <button class="quiz-btn" id="submit-btn" type="button">제출</button>
      <button class="quiz-btn" id="next-btn" type="button">Skip</button>
    </div>
  `;

  const submitBtn = document.getElementById("submit-btn");
  const nextBtn = document.getElementById("next-btn");
  const hintBtn = document.getElementById("hint-btn");
  const inputs = Array.from(document.querySelectorAll(".inline-blank-input"));
  let syncingInlineSlots = false;
  const slotItems = inputs.map((input) => {
    const qIndex = Number(input.getAttribute("data-q-index") ?? -1);
    const model = group[qIndex]?.answer || "";
    const api = model && window.AisthInputSlots
      ? window.AisthInputSlots.enhance(input, { modelText: model, onEnter: submitCurrentAnswer })
      : null;
    if (api?.control) {
      api.control.classList.add("l61-slot-control");
      applyL61HintAnimationDelays(api.control);
    }
    return { input, qIndex, model, api };
  });

  if (submitBtn) submitBtn.addEventListener("click", submitCurrentAnswer);
  if (nextBtn) nextBtn.addEventListener("click", goNext);
  if (hintBtn) {
    hintBtn.addEventListener("click", () => {
      revealL61MeaningHint(group);
      hintBtn.disabled = true;
    });
  }

  if (inputs.length) {
    const firstSlot = slotItems.find((item) => item.api)?.api;
    if (firstSlot) firstSlot.focus();
    else inputs[0].focus();
    slotItems.forEach((item) => {
      const { input } = item;
      input.addEventListener("input", () => {
        const qIndex = input.getAttribute("data-q-index");
        if (qIndex == null) return;
        updateL61SlotState(item);
        if (syncingInlineSlots) return;
        syncingInlineSlots = true;
        slotItems.filter((peer) => peer.qIndex === item.qIndex && peer.input !== input).forEach((peer) => {
          const flowInput = peer.api?.control?.querySelector(".aisth-slot-input");
          if (!flowInput || flowInput.value === input.value) return;
          flowInput.value = input.value;
          flowInput.dispatchEvent(new Event("input", { bubbles: true }));
          updateL61SlotState(peer);
        });
        syncingInlineSlots = false;
      });

      input.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") {
          ev.preventDefault();
          submitCurrentAnswer();
        }
      });
      updateL61SlotState(item);
    });
  }
}

function updateL61SlotState(item) {
  const sourceInput = item?.input;
  const control = item?.api?.control;
  const modelText = String(item?.model || "");
  if (!sourceInput || !control || !modelText) return false;
  const modelChars = getL61AnswerChars(modelText);
  const userChars = getL61AnswerChars(sourceInput.value);
  const cells = Array.from(control.querySelectorAll(".aisth-slot-cell"));
  let allCorrect = modelChars.length > 0 && userChars.length >= modelChars.length;
  cells.forEach((cell, index) => {
    const userChar = userChars[index] || "";
    const modelChar = modelChars[index] || "";
    const filled = Boolean(userChar);
    const correct = filled && userChar === modelChar;
    cell.classList.toggle("is-slot-correct", correct);
    cell.classList.toggle("is-slot-wrong", filled && !correct);
    if (!correct) allCorrect = false;
  });
  return allCorrect;
}

function revealL61MeaningHint(group) {
  const bubble = document.getElementById("l61-meaning-hint");
  const firstQuestion = Array.isArray(group) ? group[0] : null;
  if (!bubble || !firstQuestion) return;
  const firstLine = normalizeEscapedBreaks(String(firstQuestion.question || "")).split(/\r?\n/)[0] || "";
  const form = String(firstLine.trim().split(/\s+/)[0] || "").toLowerCase().replace(/[^a-z]/g, "");
  const hint = L61_VERB_MEANING_HINTS[form];
  if (!hint) return;
  bubble.innerHTML = `<span class="l61-hint-base">${escapeHtml(hint.base)}</span><span class="l61-hint-equals">=</span><span>${escapeHtml(hint.meaning)}</span>`;
  bubble.classList.add("is-visible");
}

function applyL61HintAnimationDelays(control) {
  if (!control) return;
  Array.from(control.querySelectorAll(".aisth-slot-cell")).forEach((cell, index) => {
    cell.style.setProperty("--aisth-placeholder-delay", `${(index * 0.16).toFixed(2)}s`);
  });
}

function getL61AnswerChars(value) {
  return Array.from(String(value || "").replace(/\s+/g, ""));
}

function submitCurrentAnswer() {
  if (isCurrentLocked) return;

  const group = questionGroups[currentIndex] || [];
  const submitBtn = document.getElementById("submit-btn");
  const nextBtn = document.getElementById("next-btn");
  const feedback = document.getElementById("feedback");

  if (!group.length) return;

  const attempts = group.map((q, idx) => {
    const inputs = Array.from(document.querySelectorAll(`.inline-blank-input[data-q-index="${idx}"]`));
    return {
      q,
      inputs,
      values: inputs.map((el) => String(el.value || "").trim()),
    };
  });

  if (attempts.some((a) => !a.values.length || a.values.some((v) => !v))) {
    showToast("no", TEXT.INPUT_REQUIRED);
    return;
  }

  const allOk = attempts.every((a) => a.values.every((v) => isAnswerCorrect(a.q.type, v, a.q.answer)));
  if (!allOk) {
    if (feedback) {
      feedback.className = "feedback";
      feedback.innerHTML = "";
    }
    showToast("no", TEXT.WRONG);
    return;
  }

  isCurrentLocked = true;
  attempts.forEach((a) => {
    a.inputs.forEach((el) => {
      el.disabled = true;
      if (window.AisthInputSlots) window.AisthInputSlots.setDisabled(el, true);
    });
  });
  if (submitBtn) submitBtn.disabled = true;
  scheduleAutoNext();
  attempts.forEach((a) => {
    results.push({
      no: a.q.no,
      qNumber: a.q.qNumber,
      type: a.q.type,
      question: a.q.question,
      selected: a.values.join(" / "),
      answer: a.q.answer,
      instruction: a.q.instruction,
      correct: true,
    });
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

function renderQuestionWithInlineInputs(value, qIndex) {
  const base = renderTextWithEmphasis(value);
  let slot = 0;
  return base.replace(/_{2,}/g, () => {
    const html = `<input class="inline-blank-input" data-q-index="${qIndex}" data-slot-index="${slot}" type="text" autocomplete="off" />`;
    slot += 1;
    return html;
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







