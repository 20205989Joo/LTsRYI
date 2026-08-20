// aisth-l5e3.js
// Independent runtime for Aisth Lesson 5 Exercise 3

const TARGET_LESSON = 5;
const TARGET_EXERCISE = 3;
const PAGE_LABEL = "Aisth L5-E3";
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
let day = "018";
let quizTitle = "quiz_Grammar_aisth_l5e3";
let userId = "";

let rawRows = [];
let questions = [];
let currentIndex = 0;
let results = [];
let isCurrentLocked = false;
let rewritePlaceholderExample = "";
let blankPlaceholderExample = "";
let currentL53WordTiles = [];
let selectedL53WordIds = [];

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

    .clause-line {
      line-height: 1.7;
    }

    .clause-front {
      color: #d1731f;
      font-weight: 900;
    }

    .clause-back {
      color: #2e6db4;
      font-weight: 900;
    }

    .clause-conn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 24px;
      padding: 2px 8px;
      border: 1px solid #e7c187;
      border-radius: 8px;
      background: #ffe8b8;
      color: #7e3106;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.72), 0 2px 5px rgba(126,49,6,.08);
      font-weight: 950;
      line-height: 1;
      margin: 0 4px;
      vertical-align: middle;
    }

    .clause-ko {
      margin-top: 6px;
      font-size: 13px;
      color: #5a4637;
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

    .l53-scramble {
      display: grid;
      gap: 10px;
    }

    .l53-answer-tray,
    .l53-word-bank {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 7px;
      min-height: 62px;
      padding: 11px;
      border-radius: 14px;
      box-sizing: border-box;
    }

    .l53-answer-tray {
      border: 1.5px dashed rgba(126,49,6,.38);
      background: rgba(255,255,255,.82);
    }

    .l53-answer-tray.is-wrong {
      border-color: #d44a43;
      background: rgba(255,235,233,.86);
      animation: l53TrayShake .28s ease both;
    }

    .l53-word-bank {
      border: 1px solid rgba(233,199,167,.84);
      background: rgba(255,247,233,.92);
    }

    .l53-tray-empty {
      color: #a39488;
      font-size: 12px;
      font-weight: 850;
    }

    .l53-word-chip {
      appearance: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 33px;
      padding: 5px 9px;
      border: 1px solid #7657b5;
      border-radius: 11px;
      background: linear-gradient(180deg,#f7f3ff 0%,#efe9ff 58%,#dfd3f8 100%);
      color: #44227d;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.92), inset 0 -3px 5px rgba(68,34,125,.10), 0 4px 8px rgba(68,34,125,.12);
      font-size: 13px;
      font-weight: 900;
      line-height: 1;
      cursor: pointer;
      user-select: none;
    }

    .l53-word-chip.is-connector {
      border-color: #d28b27;
      background: linear-gradient(180deg,#fff8df 0%,#ffe6aa 100%);
      color: #7e4a08;
    }

    .l53-word-chip:active { transform: translateY(1px); }

    @keyframes l53TrayShake {
      0%, 100% { transform: translateX(0); }
      30% { transform: translateX(-5px); }
      65% { transform: translateX(5px); }
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
    const clauseMeta = buildClauseMeta(qNumber, type, question);

    return {
      no: idx + 1,
      qNumber,
      question,
      answer,
      instruction,
      title,
      type,
      clauseMeta,
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

function buildClauseMeta(qNumber, type, question) {
  const text = normalizeEscapedBreaks(String(question || "")).trim();
  const ko = parseKoClauseFromQuestion(text);

  if (type === "blank") {
    const firstLine = String(text.split("\n")[0] || "").trim();
    const slotMatch = firstLine.match(/_{2,}/);
    if (!slotMatch) return null;

    const slot = slotMatch[0];
    const before = firstLine.slice(0, slotMatch.index);
    const after = firstLine.slice((slotMatch.index || 0) + slot.length);

    if (!before.trim()) {
      const rest = after.trim();
      const commaIndex = rest.indexOf(",");
      const enFront = commaIndex >= 0 ? rest.slice(0, commaIndex).trim() : rest;
      const enBack = commaIndex >= 0 ? rest.slice(commaIndex + 1).trim() : "";
      return {
        kind: "blank-leading",
        slot,
        enFront,
        enBack,
        koFront: ko.front,
        koConj: ko.conj,
        koBack: ko.back,
      };
    }

    return {
      kind: "blank-middle",
      slot,
      enFront: before.trim(),
      enBack: after.trim(),
      koFront: ko.front,
      koConj: ko.conj,
      koBack: ko.back,
    };
  }

  const rewriteMatch = text.match(/^\s*1\)\s*(.*?)\s*\/\s*(.*?)\s*\/\s*2\)\s*(.*?)\s*$/s);
  if (!rewriteMatch) return null;

  return {
    kind: "rewrite-split",
    koFront: String(rewriteMatch[1] || "").trim(),
    koConj: String(rewriteMatch[2] || "").trim(),
    koBack: String(rewriteMatch[3] || "").trim(),
  };
}

function parseKoClauseFromQuestion(text) {
  const out = { front: "", conj: "", back: "" };
  const m = String(text || "").match(/\(([^()]*)\)\s*$/s);
  if (!m) return out;

  const inside = String(m[1] || "").trim();
  if (!inside) return out;

  const parts = inside.split("/").map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 3) {
    out.front = parts[0];
    out.conj = parts[1];
    out.back = parts.slice(2).join(" / ");
    return out;
  }

  if (parts.length === 2) {
    out.front = parts[0];
    out.back = parts[1];
    return out;
  }

  out.front = inside;
  return out;
}

function renderQuestionBody(q) {
  if (q?.type === "blank" && q?.clauseMeta && q.clauseMeta.kind.startsWith("blank-")) {
    const m = q.clauseMeta;
    const slotHtml = `<span class="blank-slot">${escapeHtml(m.slot || "___")}</span>`;
    let enLine = "";

    if (m.kind === "blank-leading") {
      enLine = `${slotHtml} <span class="clause-front">${escapeHtml(m.enFront || "")}</span>${m.enBack ? ` <span class="clause-back">, ${escapeHtml(m.enBack)}</span>` : ""}`;
    } else {
      enLine = `<span class="clause-front">${escapeHtml(m.enFront || "")}</span> ${slotHtml} <span class="clause-back">${escapeHtml(m.enBack || "")}</span>`;
    }

    const koLine = renderKoreanClauseLine(m.koFront, m.koConj, m.koBack);
    return `<div class="clause-line">${enLine}</div>${koLine ? `<div class="clause-ko">(${koLine})</div>` : ""}`;
  }

  if (q?.type === "rewrite" && q?.clauseMeta?.kind === "rewrite-split") {
    const m = q.clauseMeta;
    const koLine = renderKoreanClauseLine(m.koFront, m.koConj, m.koBack, { withLabels: true });
    if (koLine) return `<div class="clause-line">${koLine}</div>`;
  }

  return renderTextWithEmphasis(q?.question || "").replace(/_{2,}/g, (m) => `<span class="blank-slot">${m}</span>`);
}

function renderKoreanClauseLine(front, conj, back, opts = {}) {
  const f = String(front || "").trim();
  const c = String(conj || "").trim();
  const b = String(back || "").trim();
  if (!f && !b) return "";

  const withLabels = !!opts.withLabels;
  const leftLabel = withLabels ? "1) " : "";
  const rightLabel = withLabels ? "2) " : "";

  return `<span class="clause-front">${escapeHtml(leftLabel + f)}</span>${c ? ` <span class="clause-conn">${escapeHtml(c)}</span> ` : " "}<span class="clause-back">${escapeHtml(rightLabel + b)}</span>`;
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

  const qBody = renderQuestionBody(q);
  const useWordScramble = q.type === "rewrite";
  if (useWordScramble) {
    currentL53WordTiles = buildL53ScrambledWordTiles(q.answer, q.qNumber);
    selectedL53WordIds = [];
  }

  const placeholder = q.type === "blank"
    ? `${TEXT.PLACE_BLANK_PREFIX}${blankPlaceholderExample || "answer"})`
    : `${TEXT.PLACE_REWRITE_1} ${TEXT.PLACE_EX_PREFIX}${rewritePlaceholderExample || "example"})`;

  const inputHtml = useWordScramble
    ? `
      <div class="l53-scramble">
        <div id="l53-answer-tray" class="l53-answer-tray" aria-label="완성한 문장"></div>
        <div id="l53-word-bank" class="l53-word-bank" aria-label="섞인 단어"></div>
      </div>
    `
    : `<input id="user-answer" class="short-input" type="text" autocomplete="off" placeholder="${escapeHtmlAttr(placeholder)}" />`;

  area.innerHTML = `
    <div class="q-label">Q. ${currentIndex + 1} / ${questions.length}</div>

    <div class="box">
      <div class="question-instruction">${renderTextWithEmphasis(q.instruction || TEXT.INPUT_HINT_FALLBACK)}</div>
      <div class="sentence aisth-question-surface aisth-question-center">${qBody}</div>
    </div>

    <div class="box" style="background:#fff;">
      ${inputHtml}
      <div id="feedback" class="feedback"></div>
    </div>

    <div class="btn-row">
      <button class="quiz-btn" id="next-btn" type="button">Skip</button>
    </div>
  `;

  const nextBtn = document.getElementById("next-btn");
  if (nextBtn) nextBtn.addEventListener("click", goNext);

  if (useWordScramble) {
    renderL53ScrambleControls();
    return;
  }

  const input = document.getElementById("user-answer");
  const slotModelText = pickL53SlotModelText(q.answer);
  const slotInputControl = input && window.AisthInputSlots
    ? window.AisthInputSlots.enhance(input, { modelText: slotModelText, onEnter: submitCurrentAnswer })
    : null;

  if (input) {
    if (slotInputControl) {
      input.addEventListener("input", () => updateL53SlotAnswerState(input, slotInputControl.control, slotModelText));
      updateL53SlotAnswerState(input, slotInputControl.control, slotModelText);
      slotInputControl.focus();
    } else input.focus();
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

function buildL53ScrambledWordTiles(answer, qNumber) {
  const words = pickL53SlotModelText(answer).split(/\s+/).filter(Boolean);
  const tiles = words.map((text, originalIndex) => ({
    id: `${qNumber}-${originalIndex}`,
    originalIndex,
    text,
  }));
  if (tiles.length < 2) return tiles;

  const offset = (Math.abs(Number(qNumber) || 1) % (tiles.length - 1)) + 1;
  let scrambled = tiles.slice(offset).concat(tiles.slice(0, offset));
  if ((Number(qNumber) || 0) % 2 === 0) scrambled = scrambled.reverse();
  if (scrambled.every((tile, index) => tile.id === tiles[index].id)) {
    scrambled = tiles.slice(1).concat(tiles[0]);
  }
  return scrambled;
}

function renderL53ScrambleControls() {
  const tray = document.getElementById("l53-answer-tray");
  const bank = document.getElementById("l53-word-bank");
  if (!tray || !bank) return;

  const selectedTiles = selectedL53WordIds
    .map((id) => currentL53WordTiles.find((tile) => tile.id === id))
    .filter(Boolean);
  const selectedSet = new Set(selectedL53WordIds);
  const remainingTiles = currentL53WordTiles.filter((tile) => !selectedSet.has(tile.id));

  tray.innerHTML = selectedTiles.length
    ? selectedTiles.map((tile, index) => renderL53WordChip(tile, "selected", index)).join("")
    : '<span class="l53-tray-empty">단어를 차례대로 눌러 문장을 완성해보세요.</span>';
  bank.innerHTML = remainingTiles.map((tile) => renderL53WordChip(tile, "bank")).join("");

  tray.querySelectorAll(".l53-word-chip").forEach((button) => {
    button.addEventListener("click", () => removeL53SelectedWord(Number(button.dataset.selectedIndex)));
  });
  bank.querySelectorAll(".l53-word-chip").forEach((button) => {
    button.addEventListener("click", () => selectL53ScrambleWord(String(button.dataset.wordId || "")));
  });
  if (isCurrentLocked) {
    tray.querySelectorAll("button").forEach((button) => { button.disabled = true; });
    bank.querySelectorAll("button").forEach((button) => { button.disabled = true; });
  }
}

function renderL53WordChip(tile, location, selectedIndex = -1) {
  const normalized = String(tile?.text || "").toLowerCase().replace(/[^a-z]/g, "");
  const connectorWords = new Set(["and", "but", "so", "yet", "or", "if", "when", "while", "unless", "although", "though", "because"]);
  const connectorClass = connectorWords.has(normalized) ? " is-connector" : "";
  const attrs = location === "bank"
    ? `data-word-id="${escapeHtmlAttr(tile.id)}"`
    : `data-selected-index="${selectedIndex}"`;
  return `<button type="button" class="l53-word-chip${connectorClass}" ${attrs}>${escapeHtml(tile.text)}</button>`;
}

function selectL53ScrambleWord(wordId) {
  if (isCurrentLocked || !wordId || selectedL53WordIds.includes(wordId)) return;
  selectedL53WordIds.push(wordId);
  document.getElementById("l53-answer-tray")?.classList.remove("is-wrong");
  renderL53ScrambleControls();
  if (selectedL53WordIds.length === currentL53WordTiles.length) submitCurrentAnswer();
}

function removeL53SelectedWord(selectedIndex) {
  if (isCurrentLocked || !Number.isInteger(selectedIndex) || selectedIndex < 0) return;
  selectedL53WordIds.splice(selectedIndex, 1);
  document.getElementById("l53-answer-tray")?.classList.remove("is-wrong");
  renderL53ScrambleControls();
}

function submitCurrentAnswer() {
  if (isCurrentLocked) return;

  const q = questions[currentIndex];
  if (q?.type === "rewrite") {
    submitL53ScrambleAnswer(q);
    return;
  }
  const input = document.getElementById("user-answer");
  const nextBtn = document.getElementById("next-btn");
  const feedback = document.getElementById("feedback");

  if (!q || !input) return;

  const userRaw = String(input.value || "").trim();
  if (!userRaw) {
    showToast("no", TEXT.INPUT_REQUIRED);
    return;
  }
  const ok = isAnswerCorrect(q.type, userRaw, q.answer)
    || isAnswerCorrect(q.type, userRaw, pickL53SlotModelText(q.answer));

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

function submitL53ScrambleAnswer(q) {
  if (!q || selectedL53WordIds.length !== currentL53WordTiles.length) return;
  const feedback = document.getElementById("feedback");
  const userRaw = selectedL53WordIds
    .map((id) => currentL53WordTiles.find((tile) => tile.id === id)?.text || "")
    .join(" ")
    .trim();
  const ok = isAnswerCorrect(q.type, userRaw, q.answer)
    || isAnswerCorrect(q.type, userRaw, pickL53SlotModelText(q.answer));

  if (!ok) {
    const tray = document.getElementById("l53-answer-tray");
    if (tray) {
      tray.classList.remove("is-wrong");
      void tray.offsetWidth;
      tray.classList.add("is-wrong");
    }
    if (feedback) {
      feedback.className = "feedback";
      feedback.innerHTML = "";
    }
    showToast("no", TEXT.WRONG);
    return;
  }

  isCurrentLocked = true;
  renderL53ScrambleControls();
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

function updateL53SlotAnswerState(sourceInput, control, modelText) {
  if (!sourceInput || !control || !modelText || isCurrentLocked) return;
  const modelChars = getL53AnswerChars(modelText);
  const userChars = getL53AnswerChars(sourceInput.value);
  const cells = Array.from(control.querySelectorAll(".aisth-slot-cell"));
  let allCorrect = modelChars.length > 0 && userChars.length >= modelChars.length;

  cells.forEach((cell, index) => {
    const userChar = userChars[index] || "";
    const modelChar = modelChars[index] || "";
    const filled = Boolean(userChar);
    const correct = filled && userChar.toLowerCase() === modelChar.toLowerCase();
    cell.classList.toggle("is-slot-correct", correct);
    cell.classList.toggle("is-slot-wrong", filled && !correct);
    if (!correct) allCorrect = false;
  });

  if (allCorrect) submitCurrentAnswer();
}

function pickL53SlotModelText(value) {
  let text = stripEmphasisMarkers(normalizeEscapedBreaks(String(value || ""))).trim();
  text = String(text.split(/\r?\n/)[0] || text).trim();
  text = String(text.split(/\|{1,2}/)[0] || text).trim();
  text = String(text.split(/\s+\/\s+/)[0] || text).trim();
  text = text.replace(/\s*\(또는:.*$/s, "").trim();
  return text.replace(/[.?!~]+$/g, "").trim();
}

function getL53AnswerChars(value) {
  return Array.from(String(value || "").replace(/\s+/g, ""));
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







