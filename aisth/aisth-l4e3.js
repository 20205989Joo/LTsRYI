// aisth-l4e3.js
// Independent runtime for Aisth Lesson 4 Exercise 3

const TARGET_LESSON = 4;
const TARGET_EXERCISE = 3;
const PAGE_LABEL = "Aisth L4-E3";
const MAX_QUESTIONS = 0; // 0 = unlimited
const SCRAMBLE_INSTRUCTION = "단어를 순서대로 배열해보세요.";

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

const ANSWER_OVERRIDES_Q1_TO_Q10 = {
  1: "you are tired",
  2: "you finish your homework",
  3: "it rains",
  4: "you sleep",
  5: "I get home",
  6: "you don't study",
  7: "soon as he arrives",
  8: "you're done with homework",
  9: "she is doing homework",
  10: "class is over",
};

let subcategory = "Grammar";
let level = "aisth";
let day = "014";
let quizTitle = "quiz_Grammar_aisth_l4e3";
let userId = "";

let rawRows = [];
let questions = [];
let currentIndex = 0;
let results = [];
let isCurrentLocked = false;
let rewritePlaceholderExample = "";
let blankPlaceholderExample = "";
let currentWordTiles = [];
let selectedWordIds = [];

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

    .l43-question-box .question-instruction {
      color: #111;
      font-size: 17px;
      line-height: 1.5;
      font-weight: 950;
      word-break: keep-all;
      margin: 16px 0 12px;
    }

    .l43-question-box .sentence {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 108px;
      padding: 18px 14px;
      margin-top: 12px;
      color: #203736;
      font-size: 17px;
      font-weight: 850;
      line-height: 1.75;
      text-align: center;
      box-sizing: border-box;
    }

    .l43-en-line,
    .l43-ko-line {
      white-space: pre-wrap;
    }

    .l43-ko-line {
      margin-top: 9px;
      color: #5a4637;
      font-size: 12.5px;
      font-weight: 750;
    }

    .l43-if-marker,
    .l43-ko-condition {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 4px 10px;
      border: 1px solid #7657b5;
      border-radius: 8px;
      background: #efe9ff;
      color: #44227d;
      font-weight: 950;
      line-height: 1.12;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.88);
      white-space: nowrap;
    }

    .l43-if-marker {
      min-height: 29px;
      padding: 4px 12px;
      font-size: 15px;
      vertical-align: -0.18em;
    }

    .l43-ko-condition {
      min-height: 28px;
      font-size: 13px;
    }

    .l43-scramble {
      margin-top: 14px;
    }

    .l43-answer-tray,
    .l43-word-bank {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      min-height: 62px;
      padding: 11px;
      border-radius: 14px;
      box-sizing: border-box;
    }

    .l43-answer-tray {
      border: 1.5px dashed rgba(126, 49, 6, 0.38);
      background: rgba(255, 255, 255, 0.76);
      transition: border-color 0.18s ease, background 0.18s ease;
    }

    .l43-answer-tray.is-wrong {
      border-color: #d44a43;
      background: rgba(255, 235, 233, 0.86);
      animation: l43-tray-shake 0.28s ease both;
    }

    .l43-word-bank {
      margin-top: 10px;
      border: 1px solid rgba(233, 199, 167, 0.84);
      background: rgba(255, 247, 233, 0.92);
    }

    .l43-tray-empty {
      color: #a39488;
      font-size: 13px;
      font-weight: 850;
    }

    .l43-token-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 6px;
      width: 100%;
    }

    .l43-word-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 33px;
      padding: 5px 9px;
      border: 1px solid #7657b5;
      border-radius: 11px;
      background: linear-gradient(180deg, #f7f3ff 0%, #efe9ff 58%, #dfd3f8 100%);
      color: #44227d;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92), inset 0 -3px 5px rgba(68, 34, 125, 0.10), 0 4px 8px rgba(68, 34, 125, 0.12);
      font-size: 13px;
      font-weight: 900;
      line-height: 1;
      cursor: pointer;
      user-select: none;
      transition: transform 0.14s ease, box-shadow 0.14s ease;
    }

    .l43-word-chip:hover {
      transform: translateY(-1px);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92), inset 0 -3px 5px rgba(68, 34, 125, 0.10), 0 6px 11px rgba(68, 34, 125, 0.18);
    }

    .l43-word-chip:active {
      transform: translateY(1px);
    }

    .l43-word-chip.is-role-subject {
      color: #2f8f55;
    }

    .l43-word-chip.is-role-verb {
      color: var(--aisth-role-v-border, #c88a12);
    }

    .l43-word-chip.is-role-target {
      color: #dc3f3f;
    }

    .l43-word-chip.is-role-detail {
      color: #111;
    }

    .l43-word-chip.is-condition {
      border-color: #5e468f;
      background: linear-gradient(180deg, #947fc2 0%, #7657b5 58%, #5e468f 100%);
      color: #fff;
      text-shadow: 0 1px 1px rgba(33, 18, 61, 0.42);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.88), 0 4px 8px rgba(68, 34, 125, 0.12);
    }

    .l43-word-chip.is-condition.is-in-answer {
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92), 0 0 0 2px rgba(118, 87, 181, 0.16), 0 5px 10px rgba(68, 34, 125, 0.16);
    }

    .l43-word-chip:disabled {
      cursor: default;
      opacity: 0.76;
      transform: none;
    }

    @keyframes l43-tray-shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
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

  const firstRowQNumber = Number(filtered[0]?.["QNumber"]) || 1;
  const firstRowAnswer = applyAnswerOverrides(firstRowQNumber, normalizeEscapedBreaks(String(filtered[0]?.["Answer"] ?? "").trim()));
  const firstRewriteRow = filtered.find((r) => detectType(normalizeEscapedBreaks(String(r["Question"] ?? "").trim())) === "rewrite");
  const firstBlankRow = filtered.find((r) => detectType(normalizeEscapedBreaks(String(r["Question"] ?? "").trim())) === "blank");
  const firstRewriteAnswer = applyAnswerOverrides(Number(firstRewriteRow?.["QNumber"]) || 0, normalizeEscapedBreaks(String(firstRewriteRow?.["Answer"] ?? "").trim()));
  const firstBlankAnswer = applyAnswerOverrides(Number(firstBlankRow?.["QNumber"]) || 0, normalizeEscapedBreaks(String(firstBlankRow?.["Answer"] ?? "").trim()));

  rewritePlaceholderExample = clipExample(stripEmphasisMarkers(firstRowAnswer || firstRewriteAnswer || "example"));
  blankPlaceholderExample = clipExample(stripEmphasisMarkers(firstRowAnswer || firstBlankAnswer || "answer"));

  questions = filtered.map((row, idx) => {
    const question = normalizeEscapedBreaks(String(row["Question"] ?? "").trim());
    const qNumber = Number(row["QNumber"]) || idx + 1;
    const answer = stripEmphasisMarkers(
      applyAnswerOverrides(qNumber, normalizeEscapedBreaks(String(row["Answer"] ?? "").trim()))
    );
    const title = stripEmphasisMarkers(normalizeEscapedBreaks(String(row["Title"] ?? "").trim()));
    const type = detectType(question);

    const fallbackInst = type === "blank" ? DEFAULT_BLANK_INSTRUCTION : DEFAULT_REWRITE_INSTRUCTION;
    const modeInst = modeByType[type] || fallbackInst;

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

function applyAnswerOverrides(qNumber, answerRaw) {
  const override = ANSWER_OVERRIDES_Q1_TO_Q10[Number(qNumber)];
  if (override) return override;
  return String(answerRaw ?? "").trim();
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
  currentWordTiles = buildScrambledWordTiles(q.answer, q.qNumber);
  selectedWordIds = [];

  const promptLines = splitQuestionLines(q.question);

  area.innerHTML = `
    <div class="q-label">Q. ${currentIndex + 1} / ${questions.length}</div>

    <div class="box l43-question-box">
      <div class="question-instruction">${escapeHtml(SCRAMBLE_INSTRUCTION)}</div>
      <div class="sentence aisth-question-surface aisth-question-center">
        <div class="l43-en-line">${renderConditionalEnglish(promptLines.english)}</div>
        ${promptLines.korean ? `<div class="l43-ko-line">${renderConditionalKorean(promptLines.korean)}</div>` : ""}
      </div>
      <div class="l43-scramble">
        <div id="l43-answer-tray" class="l43-answer-tray" aria-label="완성한 문장"></div>
        <div id="l43-word-bank" class="l43-word-bank" aria-label="섞인 단어"></div>
      </div>
      <div id="feedback" class="feedback"></div>
    </div>
  `;

  renderScrambleControls();
}

function splitQuestionLines(value) {
  const lines = normalizeEscapedBreaks(String(value ?? "")).split(/\r?\n/);
  return {
    english: String(lines.shift() || "").trim(),
    korean: lines.join(" ").trim(),
  };
}

function renderConditionalEnglish(value) {
  const text = stripEmphasisMarkers(String(value ?? ""));
  const re = /If(?=\s|_|[(),.]|$)|_{2,}/gi;
  let out = "";
  let last = 0;
  let match;
  while ((match = re.exec(text)) !== null) {
    out += escapeHtml(text.slice(last, match.index));
    out += /^if$/i.test(match[0])
      ? `<span class="l43-if-marker">${escapeHtml(match[0])}</span>`
      : `<span class="blank-slot">${escapeHtml(match[0])}</span>`;
    last = re.lastIndex;
  }
  out += escapeHtml(text.slice(last));
  return out;
}

function renderConditionalKorean(value) {
  const text = normalizeEscapedBreaks(String(value ?? ""));
  const emphasized = /\*\*(.*?)\*\*/s.exec(text);
  if (emphasized) {
    const before = text.slice(0, emphasized.index);
    const target = String(emphasized[1] || "").trim();
    const after = text.slice(emphasized.index + emphasized[0].length);
    return `${escapeHtml(before)}<span class="l43-ko-condition">${escapeHtml(target)}</span>${escapeHtml(after)}`;
  }

  const clean = stripEmphasisMarkers(text);
  const prefix = clean.startsWith("(") ? "(" : "";
  const content = prefix ? clean.slice(1) : clean;
  const condition = /^(.+?(?:때까지는|자마자|동안은|중에는|다면|라면|으면|전에|후에|때는|되면|하면|면|때))(?=\s|[,.)!?]|$)/.exec(content);
  if (!condition) return escapeHtml(clean);
  return `${escapeHtml(prefix)}<span class="l43-ko-condition">${escapeHtml(condition[1])}</span>${escapeHtml(content.slice(condition[1].length))}`;
}

function buildScrambledWordTiles(answer, qNumber) {
  const wordTexts = stripEmphasisMarkers(String(answer ?? ""))
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const roles = classifyL43WordRoles(wordTexts);
  const words = wordTexts.map((text, originalIndex) => ({
      id: `${qNumber}-${originalIndex}`,
      originalIndex,
      text,
      role: roles[originalIndex] || "detail",
    }));

  if (words.length < 2) return words;
  const offset = (Math.abs(Number(qNumber) || 1) % (words.length - 1)) + 1;
  let scrambled = words.slice(offset).concat(words.slice(0, offset));
  if ((Number(qNumber) || 0) % 2 === 0) scrambled = scrambled.reverse();
  if (scrambled.every((tile, idx) => tile.id === words[idx].id)) {
    scrambled = words.slice(1).concat(words[0]);
  }
  return scrambled;
}

function renderScrambleControls() {
  const answerTray = document.getElementById("l43-answer-tray");
  const wordBank = document.getElementById("l43-word-bank");
  if (!answerTray || !wordBank) return;

  const selectedTiles = selectedWordIds
    .map((id) => currentWordTiles.find((tile) => tile.id === id))
    .filter(Boolean);
  const selectedSet = new Set(selectedWordIds);
  const remainingTiles = currentWordTiles.filter((tile) => !selectedSet.has(tile.id));

  answerTray.innerHTML = selectedTiles.length
    ? renderL43TokenRows(selectedTiles, "selected")
    : `<span class="l43-tray-empty">단어를 차례대로 눌러보세요.</span>`;
  wordBank.innerHTML = renderL43TokenRows(remainingTiles, "bank");

  answerTray.querySelectorAll(".l43-word-chip").forEach((button) => {
    button.addEventListener("click", () => removeSelectedWord(Number(button.dataset.selectedIndex)));
  });
  wordBank.querySelectorAll(".l43-word-chip").forEach((button) => {
    button.addEventListener("click", () => selectScrambleWord(String(button.dataset.wordId || "")));
  });

  if (isCurrentLocked) {
    answerTray.querySelectorAll("button").forEach((button) => { button.disabled = true; });
    wordBank.querySelectorAll("button").forEach((button) => { button.disabled = true; });
  }
}

function renderL43TokenRows(tiles, location) {
  if (!tiles.length) return "";
  const splitIndex = tiles.length > 3 ? Math.ceil(tiles.length / 2) : tiles.length;
  const rows = [tiles.slice(0, splitIndex), tiles.slice(splitIndex)].filter((row) => row.length);
  let selectedOffset = 0;
  return rows.map((row) => {
    const html = row.map((tile, rowIndex) => renderWordChip(tile, location, selectedOffset + rowIndex)).join("");
    selectedOffset += row.length;
    return `<div class="l43-token-row">${html}</div>`;
  }).join("");
}

function renderWordChip(tile, location, selectedIndex = -1) {
  const role = tile.role || "detail";
  const roleClass = role === "condition" ? " is-condition" : ` is-role-${role}`;
  const locationClass = location === "selected" ? " is-in-answer" : " is-in-bank";
  const attrs = location === "bank"
    ? `data-word-id="${escapeHtmlAttr(tile.id)}"`
    : `data-selected-index="${selectedIndex}"`;
  return `<button type="button" class="l43-word-chip${roleClass}${locationClass}" ${attrs}>${escapeHtml(tile.text)}</button>`;
}

function classifyL43WordRoles(wordTexts) {
  const roles = wordTexts.map(() => "detail");
  const words = wordTexts.map((word) => normalizeL43RoleWord(word));
  if (!words.length) return roles;

  const conditionSingles = new Set(["if", "when", "unless", "before", "after", "while", "until"]);
  let cursor = 0;
  if (words[0] === "as" && words[1] === "soon" && words[2] === "as") {
    roles[0] = roles[1] = roles[2] = "condition";
    cursor = 3;
  } else if (words[0] === "soon" && words[1] === "as") {
    roles[0] = roles[1] = "condition";
    cursor = 2;
  } else if (conditionSingles.has(words[0])) {
    roles[0] = "condition";
    cursor = 1;
  }

  if (cursor >= words.length) return roles;
  const subjectDeterminers = new Set(["a", "an", "the", "my", "your", "his", "her", "our", "their"]);
  const subjectStart = cursor;
  roles[cursor] = "subject";
  cursor += 1;
  if (subjectDeterminers.has(words[subjectStart]) && cursor < words.length) {
    roles[cursor] = "subject";
    cursor += 1;
  }

  const fusedSubjectVerb = /^(?:i['’]m|you['’]re|he['’]s|she['’]s|it['’]s|we['’]re|they['’]re)$/i.test(words[subjectStart]);
  if (cursor >= words.length) return roles;
  if (fusedSubjectVerb) {
    for (let idx = cursor; idx < words.length; idx += 1) roles[idx] = "detail";
    return roles;
  }

  const firstVerbIndex = cursor;
  roles[firstVerbIndex] = "verb";
  cursor += 1;

  const firstVerb = words[firstVerbIndex];
  const auxiliaryVerb = /^(?:do|does|did|don['’]t|doesn['’]t|didn['’]t|can|can['’]t|could|couldn['’]t|will|won['’]t|would|wouldn['’]t|should|shouldn['’]t|may|might|must|mustn['’]t)$/i.test(firstVerb);
  const beVerb = /^(?:am|is|are|was|were|be|been|being)$/i.test(firstVerb);
  if (cursor < words.length && (auxiliaryVerb || (beVerb && /ing$/i.test(words[cursor])))) {
    roles[cursor] = "verb";
    cursor += 1;
  }

  const detailWords = new Set(["up", "out", "home", "late", "early", "hard", "loudly", "now", "yes", "done", "over", "near", "tired", "angry", "nervous", "safe", "happy", "quiet", "better", "first", "saturday", "lunchtime", "bad"]);
  const prepositions = new Set(["at", "by", "for", "from", "in", "into", "of", "off", "on", "out", "over", "through", "to", "under", "with", "without"]);
  const linkingPredicate = beVerb;
  let detailMode = linkingPredicate;
  for (let idx = cursor; idx < words.length; idx += 1) {
    const word = words[idx];
    if (detailMode || prepositions.has(word) || detailWords.has(word) || /ly$/i.test(word)) {
      detailMode = true;
      roles[idx] = "detail";
    } else {
      roles[idx] = "target";
    }
  }
  return roles;
}

function normalizeL43RoleWord(word) {
  return String(word || "")
    .toLowerCase()
    .replace(/^[^a-z’']+|[^a-z’']+$/g, "");
}

function selectScrambleWord(wordId) {
  if (isCurrentLocked || !wordId || selectedWordIds.includes(wordId)) return;
  selectedWordIds.push(wordId);
  const tray = document.getElementById("l43-answer-tray");
  if (tray) tray.classList.remove("is-wrong");
  renderScrambleControls();
  if (selectedWordIds.length === currentWordTiles.length) submitCurrentAnswer();
}

function removeSelectedWord(selectedIndex) {
  if (isCurrentLocked || !Number.isInteger(selectedIndex) || selectedIndex < 0) return;
  selectedWordIds.splice(selectedIndex, 1);
  const tray = document.getElementById("l43-answer-tray");
  if (tray) tray.classList.remove("is-wrong");
  renderScrambleControls();
}

function submitCurrentAnswer() {
  if (isCurrentLocked) return;
  const q = questions[currentIndex];
  const feedback = document.getElementById("feedback");
  if (!q || selectedWordIds.length !== currentWordTiles.length) return;

  const userRaw = selectedWordIds
    .map((id) => currentWordTiles.find((tile) => tile.id === id)?.text || "")
    .join(" ")
    .trim();
  const ok = isAnswerCorrect(q.type, userRaw, q.answer);

  if (!ok) {
    if (feedback) {
      feedback.className = "feedback";
      feedback.innerHTML = "";
    }
    const tray = document.getElementById("l43-answer-tray");
    if (tray) {
      tray.classList.remove("is-wrong");
      void tray.offsetWidth;
      tray.classList.add("is-wrong");
    }
    showToast("no", TEXT.WRONG);
    return;
  }

  isCurrentLocked = true;
  renderScrambleControls();
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







