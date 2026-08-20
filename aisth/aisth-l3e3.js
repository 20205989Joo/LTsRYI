// aisth-l3e3.js
// Independent runtime for Aisth Lesson 3 Exercise 3
// Card-select comparative / superlative quiz

const TARGET_LESSON = 3;
const TARGET_EXERCISE = 3;
const SOURCE_EXERCISE = 4;
const PAGE_LABEL = "Aisth L3-E3";
const MAX_QUESTIONS = 0; // 0 = unlimited

const DEFAULT_INSTRUCTION = "맞는 답을 골라보세요!";

const TEXT = {
  START: "🚀 시작",
  INTRO_1: "문맥에 맞는 답을 선택해 동그라미로 표시하세요.",
  INTRO_2: "오답이면 다시 고를 수 있고, 맞으면 다음 문제로 넘어갑니다.",
  PIN: "📌",
  NO_QUESTIONS: "해당 Lesson/Exercise의 문제가 없습니다.",
  PICK_OPTION: "선택지를 먼저 고르세요.",
  CORRECT: "정답!",
  WRONG: "오답",
  QTYPE_CIRCLE: "동그라미형",
  RESULT_TITLE: "결과 요약",
  SCORE: "점수",
  CORRECT_COUNT: "정답",
  MY_ANSWER: "내 답",
  ANSWER: "정답",
  RETRY: "다시하기",
  CLOSE: "닫기",
  UNANSWERED: "(미응답)",
};

const NAME_STOPWORDS = new Set([
  "A",
  "B",
  "Among",
  "Who",
  "Which",
  "Then",
  "So",
  "Really",
  "You",
  "I",
  "We",
  "They",
  "He",
  "She",
  "It",
  "My",
  "Is",
  "This",
  "That",
]);

let subcategory = "Grammar";
let level = "aisth";
let day = "010";
let quizTitle = "quiz_Grammar_aisth_l3e3";
let userId = "";

let rawRows = [];
let questions = [];
let currentIndex = 0;
let results = [];
let isCurrentLocked = false;
let selectedOptionIndex = -1;

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

    .l33-than-token {
      display: inline-flex;
      align-items: center;
      padding: 0 6px;
      border: 1px solid #111;
      border-radius: 7px;
      background: linear-gradient(180deg, #fff7ad 0%, #ffe36e 62%, #e8c840 100%);
      color: #111;
      font-weight: 950;
      line-height: 1.45;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.75), 0 2px 0 rgba(65,48,0,.18);
    }

    .choice-line {
      font-size: 15px;
      line-height: 1.9;
      padding: 4px 0;
      color: #3c2d22;
      word-break: keep-all;
    }

    .opt-token {
      position: relative;
      display: inline-block;
      color: #3c2d22;
      font-weight: 700;
      font-size: inherit;
      line-height: inherit;
      padding: 0 1px;
      margin: 0 2px;
      cursor: pointer;
      user-select: none;
      transition: color 0.15s ease;
      z-index: 0;
    }

    .opt-token:hover {
      color: #7e3106;
    }

    .opt-token.selected {
      color: #7e3106;
      font-weight: 900;
    }

    .opt-token.selected::after {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      width: max(calc(100% + 14px), 28px);
      height: max(calc(100% + 14px), 28px);
      transform: translate(-50%, -50%);
      border: 2px solid #7e3106;
      border-radius: 50%;
      pointer-events: none;
      box-sizing: border-box;
    }

    .slash {
      color: #6f5847;
      font-weight: 700;
    }

    .l33-question-box .question-instruction {
      color: #111;
      font-size: 17px;
      line-height: 1.5;
      font-weight: 950;
      margin: 4px 0 12px;
    }

    .l33-question-box .sentence {
      min-height: 88px;
      box-sizing: border-box;
      padding: 18px 14px;
      border: 1.5px solid rgba(126,49,6,.34);
      color: #203736;
      font-size: 17px;
      font-weight: 850;
      line-height: 1.7;
    }

    #quiz-area .l33-choice-item.l33-choice-er {
      border-color: #111;
      background: linear-gradient(180deg,#fff7ad 0%,#ffe36e 62%,#e8c840 100%);
    }

    #quiz-area .l33-choice-item.l33-choice-est {
      border-color: #111;
      background: linear-gradient(180deg,#e2b47d 0%,#c98642 62%,#a7662e 100%);
    }

    #quiz-area .l33-choice-item.l33-choice-er.selected,
    #quiz-area .l33-choice-item.l33-choice-est.selected {
      border-color: #111;
      filter: saturate(1.08);
      box-shadow: inset 0 3px 8px rgba(80,45,8,.24), 0 1px 4px rgba(0,0,0,.12), 0 0 0 2px rgba(17,17,17,.28);
    }

    #quiz-area .l33-choice-item .aisth-choice-label {
      background: #111;
      color: #fff;
    }

    #quiz-area .l33-choice-item .aisth-choice-text {
      color: #111;
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
      currentIndex = nextIndex;
      renderQuestion();
    },
  });
}

function buildQuestionsFromRows() {
  let filtered = rawRows
    .filter((r) => Number(r["Lesson"]) === TARGET_LESSON && Number(r["Exercise"]) === SOURCE_EXERCISE)
    .sort((a, b) => Number(a["QNumber"]) - Number(b["QNumber"]));

  if (MAX_QUESTIONS > 0) filtered = filtered.slice(0, MAX_QUESTIONS);

  const fixedInstruction = deriveInstructionMode(filtered) || DEFAULT_INSTRUCTION;
  const answerPool = filtered
    .map((r) => stripEmphasisMarkers(normalizeEscapedBreaks(String(r["Answer"] ?? "").trim())))
    .map((s) => s.trim())
    .filter(Boolean);

  questions = filtered.map((row, idx) => {
    const questionRaw = normalizeEscapedBreaks(String(row["Question"] ?? "").trim());
    const answerRaw = stripEmphasisMarkers(normalizeEscapedBreaks(String(row["Answer"] ?? "").trim())).trim();
    const title = stripEmphasisMarkers(normalizeEscapedBreaks(String(row["Title"] ?? "").trim()));
    const qNumber = Number(row["QNumber"]) || idx + 1;
    const instructionRaw = normalizeEscapedBreaks(String(row["Instruction"] ?? "").trim());
    const explicit = parseExplicitChoiceGroup(questionRaw);

    const instruction = instructionRaw && !isInstructionLeakingAnswer(instructionRaw, answerRaw)
      ? instructionRaw
      : fixedInstruction;

    const options = buildChoiceOptions({
      question: questionRaw,
      answer: answerRaw,
      explicitChoices: explicit?.options || [],
      answerPool,
      qNumber,
    });

    const questionDisplay = explicit?.fullMatch
      ? questionRaw.replace(explicit.fullMatch, "( ___ )")
      : questionRaw;

    return {
      no: idx + 1,
      qNumber,
      title,
      questionRaw,
      questionDisplay,
      answerRaw,
      instruction,
      options,
    };
  });
}

function deriveInstructionMode(rows) {
  const bucket = new Map();
  rows.forEach((row) => {
    const instruction = normalizeEscapedBreaks(String(row["Instruction"] ?? "").trim());
    const answer = stripEmphasisMarkers(normalizeEscapedBreaks(String(row["Answer"] ?? "").trim()));
    if (!instruction) return;
    if (isInstructionLeakingAnswer(instruction, answer)) return;
    bucket.set(instruction, (bucket.get(instruction) || 0) + 1);
  });
  return pickTopKey(bucket);
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
  const firstInst = stripEmphasisMarkers(questions[0]?.instruction || DEFAULT_INSTRUCTION);

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
  selectedOptionIndex = -1;

  const qBody = renderL33QuestionText(q.questionDisplay).replace(/_{2,}/g, (m) => `<span class="blank-slot">${m}</span>`);
  const optionLine = renderChoiceOptionsLine(q);

  area.innerHTML = `
    <div class="q-label">Q. ${currentIndex + 1} / ${questions.length}</div>

    <div class="box l33-question-box">
      <div class="question-instruction">${escapeHtml(DEFAULT_INSTRUCTION)}</div>
      <div class="sentence aisth-question-surface aisth-question-center">${qBody}</div>
      <div class="aisth-choice-list">${optionLine}</div>
      <div id="feedback" class="feedback"></div>
    </div>
  `;

  wireOptionClicks();
}

function renderChoiceOptionsLine(q) {
  const opts = Array.isArray(q?.options) ? q.options.filter(Boolean) : [];
  if (opts.length < 2) return "";
  return opts.map((opt, idx) => `
    <div class="aisth-choice-item l33-choice-item ${getComparisonChoiceTone(q, opt)}" data-opt-index="${idx}" role="button" tabindex="0">
      <span class="aisth-choice-label">${String.fromCharCode(65 + idx)}</span>
      <span class="aisth-choice-text">${escapeHtml(opt)}</span>
    </div>
  `).join("");
}

function getComparisonChoiceTone(q, option) {
  const value = String(option || "").toLowerCase();
  if (/\bmost\b|[a-z]+est\b/.test(value)) return "l33-choice-est";
  if (/\b(?:more|less)\b|[a-z]+er\b/.test(value)) return "l33-choice-er";
  const context = `${q?.answerRaw || ""} ${q?.questionDisplay || ""}`.toLowerCase();
  return /\bmost\b|[a-z]+est\b|\bthe\s+_{2,}/.test(context) ? "l33-choice-est" : "l33-choice-er";
}

function wireOptionClicks() {
  document.querySelectorAll(".l33-choice-item").forEach((el) => {
    const activate = () => {
      if (isCurrentLocked) return;
      const idx = Number(el.dataset.optIndex ?? -1);
      if (!Number.isInteger(idx) || idx < 0) return;
      selectedOptionIndex = idx;
      refreshOptionSelection();
      submitCurrentAnswer();
    };
    el.addEventListener("click", activate);
    el.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activate();
      }
    });
  });
}

function refreshOptionSelection() {
  document.querySelectorAll(".l33-choice-item").forEach((el) => {
    const idx = Number(el.dataset.optIndex ?? -1);
    el.classList.toggle("selected", idx === selectedOptionIndex);
  });
}

function submitCurrentAnswer() {
  if (isCurrentLocked) return;

  const q = questions[currentIndex];
  const feedback = document.getElementById("feedback");

  if (!q) return;
  if (selectedOptionIndex < 0) {
    showToast("no", TEXT.PICK_OPTION);
    return;
  }

  const selected = String(q.options[selectedOptionIndex] ?? "").trim();
  const ok = isAnswerCorrect(selected, q.answerRaw);

  if (!ok) {
    if (feedback) {
      feedback.className = "feedback";
      feedback.innerHTML = "";
    }
    showToast("no", TEXT.WRONG);
    return;
  }

  isCurrentLocked = true;
  scheduleAutoNext();
  document.querySelectorAll(".l33-choice-item").forEach((el) => {
    el.style.pointerEvents = "none";
  });

  results.push({
    no: currentIndex + 1,
    qNumber: q.qNumber,
    question: stripEmphasisMarkers(q.questionDisplay),
    selected,
    answer: q.answerRaw,
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

function isAnswerCorrect(userRaw, modelRaw) {
  const userStrict = normalizeForCompare(userRaw);
  const userLoose = normalizeLoose(userRaw);
  if (!userStrict && !userLoose) return false;

  const candidates = buildModelCandidates(modelRaw);
  for (const cand of candidates) {
    const candStrict = normalizeForCompare(cand);
    const candLoose = normalizeLoose(cand);
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
        parts.forEach((p) => { if (p.length <= 80) set.add(p); });
      }
    }
  }

  return [...set];
}

function buildChoiceOptions({ question, answer, explicitChoices, answerPool, qNumber }) {
  const answerNorm = normalizeLoose(answer);
  const options = [];
  const seen = new Set();

  const add = (value) => {
    const clean = cleanChoiceText(value);
    if (!clean) return;
    const key = normalizeLoose(clean);
    if (!key || seen.has(key)) return;
    seen.add(key);
    options.push(clean);
  };

  if (Array.isArray(explicitChoices) && explicitChoices.length >= 2) {
    explicitChoices.forEach(add);
    add(answer);
    return dedupeByNormalize(options);
  }

  add(answer);
  extractNameCandidates(question).forEach(add);
  extractOnePhrases(question).forEach(add);
  buildVariantCandidates(answer).forEach(add);

  const relatedPool = (answerPool || [])
    .map(cleanChoiceText)
    .filter(Boolean)
    .filter((x) => isSameShape(answer, x))
    .filter((x) => normalizeLoose(x) !== answerNorm);

  relatedPool.forEach((x) => {
    if (options.length < 4) add(x);
  });

  (answerPool || []).forEach((x) => {
    if (options.length < 4) add(x);
  });

  buildGenericFallback(answer).forEach((x) => {
    if (options.length < 4) add(x);
  });

  const normalized = dedupeByNormalize(options).filter((x) => x);
  if (!normalized.some((x) => normalizeLoose(x) === answerNorm)) normalized.unshift(cleanChoiceText(answer));

  const picked = [normalized[0], ...normalized.slice(1, 4)].filter(Boolean);
  if (picked.length < 2) return [cleanChoiceText(answer), cleanChoiceText(answer)];
  return rotateChoices(picked, qNumber);
}

function rotateChoices(options, qNumber) {
  const list = dedupeByNormalize(options).filter(Boolean);
  if (list.length < 2) return list;
  const shift = Math.abs(Number(qNumber) || 0) % list.length;
  return list.slice(shift).concat(list.slice(0, shift));
}

function dedupeByNormalize(items) {
  const out = [];
  const seen = new Set();
  (items || []).forEach((item) => {
    const s = cleanChoiceText(item);
    const key = normalizeLoose(s);
    if (!s || !key || seen.has(key)) return;
    seen.add(key);
    out.push(s);
  });
  return out;
}

function parseExplicitChoiceGroup(questionText) {
  const s = normalizeEscapedBreaks(String(questionText ?? ""));
  const re = /\(([^()]*\/[^()]*)\)/g;
  let m;
  while ((m = re.exec(s)) !== null) {
    const inside = String(m[1] ?? "").trim();
    const options = inside.split("/")
      .map((x) => cleanChoiceText(x))
      .filter(Boolean);
    if (options.length >= 2) {
      return {
        fullMatch: m[0],
        options: dedupeByNormalize(options),
      };
    }
  }
  return null;
}

function extractNameCandidates(questionText) {
  const names = [];
  const re = /\b[A-Z][a-z]+\b/g;
  let m;
  const s = normalizeEscapedBreaks(String(questionText ?? ""));
  while ((m = re.exec(s)) !== null) {
    const name = String(m[0] || "").trim();
    if (!name || NAME_STOPWORDS.has(name)) continue;
    names.push(name);
  }
  return dedupeByNormalize(names);
}

function extractOnePhrases(questionText) {
  const out = [];
  const s = normalizeEscapedBreaks(String(questionText ?? ""));

  const phraseRe = /\b(the\s+(?:first|second|third|fourth|fifth|last)\s+one|this one|that one)\b/gi;
  let m;
  while ((m = phraseRe.exec(s)) !== null) {
    out.push(String(m[1] ?? "").trim());
  }

  return dedupeByNormalize(out);
}

function buildVariantCandidates(answerText) {
  const out = [];
  const answer = cleanChoiceText(answerText);
  const isProperName = /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*$/.test(answer);
  if (isProperName) return out;
  const lower = answer.toLowerCase();

  const pref = lower.match(/^(more|most|less|least)\s+(.+)$/);
  if (pref) {
    const stem = pref[2].trim();
    out.push(`more ${stem}`);
    out.push(`most ${stem}`);
    out.push(`less ${stem}`);
    out.push(`least ${stem}`);
  }

  const onePhrase = lower.match(/^the\s+(first|second|third|fourth|fifth|last)\s+one$/);
  if (onePhrase) {
    out.push("the first one");
    out.push("the second one");
    out.push("the third one");
    out.push("the last one");
  }

  if (/^[a-z]+$/.test(lower)) {
    if (lower.endsWith("er")) {
      const base = deriveBaseFromEr(lower);
      out.push(base);
      out.push(toComparative(base));
      out.push(toSuperlative(base));
    } else if (lower.endsWith("est")) {
      const base = deriveBaseFromEst(lower);
      out.push(base);
      out.push(toComparative(base));
      out.push(toSuperlative(base));
    } else {
      out.push(toComparative(lower));
      out.push(toSuperlative(lower));
    }
  }

  return dedupeByNormalize(out);
}

function buildGenericFallback(answerText) {
  const answer = cleanChoiceText(answerText).toLowerCase();
  if (/^[A-Z][a-z]+$/.test(cleanChoiceText(answerText))) {
    return ["Alice", "Mike", "Tom"];
  }
  if (answer.includes("one")) {
    return ["the first one", "the second one", "the third one"];
  }
  if (/^(more|most|less|least)\s+/.test(answer)) {
    const stem = answer.replace(/^(more|most|less|least)\s+/, "").trim();
    return [`more ${stem}`, `most ${stem}`, `less ${stem}`, `least ${stem}`];
  }
  if (/^[a-z]+$/.test(answer)) {
    const base = answer.endsWith("er")
      ? deriveBaseFromEr(answer)
      : answer.endsWith("est")
        ? deriveBaseFromEst(answer)
        : answer;
    return [base, toComparative(base), toSuperlative(base)];
  }
  return [];
}

function isSameShape(answer, candidate) {
  const a = cleanChoiceText(answer);
  const b = cleanChoiceText(candidate);
  if (!a || !b) return false;
  if (normalizeLoose(a) === normalizeLoose(b)) return false;

  if (/^[A-Z][a-z]+$/.test(a)) return /^[A-Z][a-z]+$/.test(b);
  if (/\bone\b/i.test(a)) return /\bone\b/i.test(b);
  if (/^(more|most|less|least)\s+/i.test(a)) return /^(more|most|less|least)\s+/i.test(b);
  if (/^[a-z]+$/.test(a) && a.endsWith("er")) return /^[a-z]+$/.test(b) && b.endsWith("er");
  if (/^[a-z]+$/.test(a) && a.endsWith("est")) return /^[a-z]+$/.test(b) && b.endsWith("est");
  if (a.includes(" ")) return b.includes(" ");
  return /^[a-z]+$/.test(b);
}

function deriveBaseFromEr(word) {
  if (!word.endsWith("er")) return word;
  if (word.endsWith("ier")) return word.slice(0, -3) + "y";
  let stem = word.slice(0, -2);
  if (stem.length >= 2) {
    const last = stem[stem.length - 1];
    const prev = stem[stem.length - 2];
    if (last === prev && /[bcdfghjklmnpqrstvwxyz]/.test(last)) {
      stem = stem.slice(0, -1);
    }
  }
  return stem;
}

function deriveBaseFromEst(word) {
  if (!word.endsWith("est")) return word;
  if (word.endsWith("iest")) return word.slice(0, -4) + "y";
  let stem = word.slice(0, -3);
  if (stem.length >= 2) {
    const last = stem[stem.length - 1];
    const prev = stem[stem.length - 2];
    if (last === prev && /[bcdfghjklmnpqrstvwxyz]/.test(last)) {
      stem = stem.slice(0, -1);
    }
  }
  return stem;
}

function toComparative(baseWord) {
  const base = String(baseWord || "").toLowerCase().trim();
  if (!base) return "";
  if (base.endsWith("y") && base.length > 1) return base.slice(0, -1) + "ier";
  if (base.endsWith("e")) return base + "r";
  if (isCvc(base)) return base + base.at(-1) + "er";
  return base + "er";
}

function toSuperlative(baseWord) {
  const base = String(baseWord || "").toLowerCase().trim();
  if (!base) return "";
  if (base.endsWith("y") && base.length > 1) return base.slice(0, -1) + "iest";
  if (base.endsWith("e")) return base + "st";
  if (isCvc(base)) return base + base.at(-1) + "est";
  return base + "est";
}

function isCvc(word) {
  if (!/^[a-z]{3,}$/.test(word)) return false;
  const vowels = "aeiou";
  const a = word[word.length - 3];
  const b = word[word.length - 2];
  const c = word[word.length - 1];
  return !vowels.includes(a) && vowels.includes(b) && !vowels.includes(c) && c !== "w" && c !== "x" && c !== "y";
}

function cleanChoiceText(value) {
  return stripEmphasisMarkers(normalizeEscapedBreaks(String(value ?? "")))
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[()]/g, "")
    .trim();
}

function isInstructionLeakingAnswer(instruction, answer) {
  const i1 = normalizeForCompare(instruction);
  const a1 = normalizeForCompare(answer);
  if (i1 && a1 && i1 === a1) return true;
  const i2 = normalizeLoose(instruction);
  const a2 = normalizeLoose(answer);
  return !!i2 && !!a2 && i2 === a2;
}

function normalizeForCompare(value) {
  return stripEmphasisMarkers(normalizeEscapedBreaks(String(value ?? "")))
    .replace(/[’‘`]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.?!~]+$/g, "")
    .trim();
}

function normalizeLoose(value) {
  return normalizeForCompare(value)
    .toLowerCase()
    .replace(/[\s'"`.,!?~:;()\[\]{}_-]+/g, "");
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

function renderL33QuestionText(value) {
  return renderTextWithEmphasis(value).replace(/\bthan\b/gi, (match) => `<span class="l33-than-token">${match}</span>`);
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
        <div><b>Q${idx + 1}</b> ${renderTextWithEmphasis(q.questionDisplay)}</div>
        <div style="margin-top:4px;"><span class="${stateClass}">${state}</span></div>
        <div>${TEXT.MY_ANSWER}: ${escapeHtml(user)}</div>
        <div>${TEXT.ANSWER}: ${formatMultilineText(q.answerRaw)}</div>
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
