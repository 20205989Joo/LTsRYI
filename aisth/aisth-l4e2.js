// aisth-l4e2.js
// Independent runtime for Aisth Lesson 4 Exercise 2
// Circle-select preposition quiz

const TARGET_LESSON = 4;
const TARGET_EXERCISE = 2;
const PAGE_LABEL = "Aisth L4-E2";
const MAX_QUESTIONS = 0; // 0 = unlimited

const FIXED_INSTRUCTION = "맞는 단어를 골라보세요!";

const TEXT = {
  START: "🚀 시작",
  INTRO_1: "문장을 읽고 알맞은 전치사를 고르세요.",
  INTRO_2: "선택지를 누르면 동그라미 표시가 됩니다.",
  PIN: "📌",
  NO_QUESTIONS: "해당 Lesson/Exercise의 문제가 없습니다.",
  PICK_OPTION: "선택지를 먼저 고르세요.",
  CORRECT: "정답!",
  WRONG: "오답",
  QTYPE: "전치사 선택",
  RESULT_TITLE: "결과 요약",
  SCORE: "점수",
  CORRECT_COUNT: "정답",
  MY_ANSWER: "내 답",
  ANSWER: "정답",
  RETRY: "다시하기",
  CLOSE: "닫기",
  UNANSWERED: "(미응답)",
  SUBMIT: "제출",
  NEXT: "다음",
};

const PREPOSITION_FALLBACK = [
  "in",
  "on",
  "under",
  "over",
  "behind",
  "beside",
  "to",
  "into",
  "across",
  "along",
  "at",
  "above",
  "below",
  "inside",
  "onto",
  "through",
  "down",
];

let subcategory = "Grammar";
let level = "aisth";
let day = "013";
let quizTitle = "quiz_Grammar_aisth_l4e2";
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

    .quiz-btn:disabled { opacity: 0.5; cursor: not-allowed; }

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
      white-space: normal;
    }

    .en-line,
    .ko-line {
      white-space: pre-wrap;
    }

    .en-line {
      line-height: 1.65;
    }

    .ko-line {
      margin-top: 8px;
      color: #5a4637;
      font-size: 12.5px;
      font-weight: 750;
    }

    .l42-question-box .question-instruction {
      color: #111;
      font-size: 17px;
      line-height: 1.5;
      font-weight: 950;
      word-break: keep-all;
      margin: 16px 0 12px;
    }

    .l42-question-box .sentence {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 96px;
      padding: 18px 14px;
      margin-top: 12px;
      font-size: 17px;
      font-weight: 850;
      line-height: 1.75;
      color: #203736;
      text-align: center;
      box-sizing: border-box;
    }

    .l42-choice-item {
      text-align: left;
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

    .btn-row {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }

    .btn-row .quiz-btn { flex: 1; margin-top: 0; }

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

  const answerPool = dedupeByNormalize(
    filtered
      .map((r) => normalizeEscapedBreaks(String(r["Answer"] ?? "").trim()))
      .filter(Boolean)
  );

  questions = filtered.map((row, idx) => {
    const questionRaw = normalizeEscapedBreaks(String(row["Question"] ?? "").trim());
    const answerRaw = normalizeEscapedBreaks(String(row["Answer"] ?? "").trim());
    const instructionRaw = normalizeEscapedBreaks(String(row["Instruction"] ?? "").trim());
    const title = normalizeEscapedBreaks(String(row["Title"] ?? "").trim());

    const parsed = parseChoiceQuestion(questionRaw);
    const options = buildOptions(parsed.options, answerRaw, answerPool);
    const correctOptionIndex = resolveCorrectOptionIndex(answerRaw, options);

    return {
      no: idx + 1,
      qNumber: Number(row["QNumber"]) || idx + 1,
      title,
      instruction: FIXED_INSTRUCTION,
      answerRaw,
      pre: parsed.pre,
      post: parsed.post,
      koreanHint: parsed.koreanHint,
      options,
      correctOptionIndex,
    };
  });
}

function parseChoiceQuestion(raw) {
  const text = normalizeEscapedBreaks(String(raw || "")).trim();
  let englishPart = text;
  let koreanHint = "";

  const tailKorean = text.match(/^(.*)\n+\s*\(([^()]*)\)\s*$/s);
  if (tailKorean && /[가-힣]/.test(String(tailKorean[2] || ""))) {
    englishPart = String(tailKorean[1] || "").trim();
    koreanHint = String(tailKorean[2] || "").trim();
  }

  const m = englishPart.match(/^(.*)\(([^()]*)\)(.*)$/s);
  if (!m) {
    return {
      pre: englishPart,
      options: [],
      post: "",
      koreanHint,
    };
  }

  const pre = cleanInline(String(m[1] || ""));
  const post = cleanInline(String(m[3] || ""));
  const options = String(m[2] || "")
    .split("/")
    .map((x) => cleanInline(x))
    .filter(Boolean);

  return { pre, post, options, koreanHint };
}

function buildOptions(parsedOptions, answerRaw, answerPool) {
  const out = dedupeByNormalize(parsedOptions || []);
  const answer = cleanInline(answerRaw);

  if (!out.some((x) => normalizeEnglish(x) === normalizeEnglish(answer))) {
    out.push(answer);
  }

  const pool = [...dedupeByNormalize(answerPool), ...PREPOSITION_FALLBACK];
  for (const cand of pool) {
    if (out.length >= 4) break;
    const c = cleanInline(cand);
    if (!c) continue;
    if (out.some((x) => normalizeEnglish(x) === normalizeEnglish(c))) continue;
    out.push(c);
  }

  return dedupeByNormalize(out).slice(0, 4);
}

function resolveCorrectOptionIndex(answerRaw, options) {
  const answer = normalizeEnglish(answerRaw);
  const idx = (options || []).findIndex((o) => normalizeEnglish(o) === answer);
  return idx;
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

      <div style="margin-top:10px; font-size:13px; color:#7e3106;">${TEXT.PIN} ${escapeHtml(FIXED_INSTRUCTION)}</div>
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

  const stemText = `${q.pre ? q.pre + " " : ""}( ___ )${q.post ? " " + q.post : ""}`.trim();

  area.innerHTML = `
    <div class="q-label">Q. ${currentIndex + 1} / ${questions.length}</div>

    <div class="box l42-question-box">
      <div class="question-instruction">${escapeHtml(FIXED_INSTRUCTION)}</div>
      <div class="sentence aisth-question-surface">
        <div class="en-line">${renderTextWithEmphasis(stemText).replace(/_{2,}/g, (m) => `<span class="blank-slot">${m}</span>`)}</div>
        ${q.koreanHint ? `<div class="ko-line">(${renderTextWithEmphasis(q.koreanHint)})</div>` : ""}
      </div>
      <div class="aisth-choice-list">${renderOptionTokens(q.options)}</div>
      <div id="feedback" class="feedback"></div>
    </div>
  `;

  wireOptionClicks();
}

function renderOptionTokens(options) {
  return (options || [])
    .map((opt, idx) => `
      <div class="aisth-choice-item l42-choice-item" data-opt-index="${idx}" role="button" tabindex="0">
        <span class="aisth-choice-label">${String.fromCharCode(65 + idx)}</span>
        <span class="aisth-choice-text">${escapeHtml(opt)}</span>
      </div>
    `)
    .join("");
}

function wireOptionClicks() {
  document.querySelectorAll(".l42-choice-item").forEach((el) => {
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
  document.querySelectorAll(".l42-choice-item").forEach((el) => {
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

  const selectedText = String(q.options[selectedOptionIndex] || "").trim();
  const fallbackOk = normalizeEnglish(selectedText) === normalizeEnglish(q.answerRaw);
  const ok = q.correctOptionIndex >= 0 ? selectedOptionIndex === q.correctOptionIndex : fallbackOk;

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
  document.querySelectorAll(".l42-choice-item").forEach((el) => {
    el.style.pointerEvents = "none";
  });

  results.push({
    no: currentIndex + 1,
    qNumber: q.qNumber,
    question: buildQuestionPlainText(q),
    selected: selectedText,
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

function buildQuestionPlainText(q) {
  const en = `${q.pre ? q.pre + " " : ""}(${(q.options || []).join(" / ")})${q.post ? " " + q.post : ""}`.trim();
  const ko = q.koreanHint ? ` (${q.koreanHint})` : "";
  return en + ko;
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
        <div><b>Q${idx + 1}</b> ${escapeHtml(buildQuestionPlainText(q))}</div>
        <div style="margin-top:4px;"><span class="${stateClass}">${state}</span></div>
        <div>${TEXT.MY_ANSWER}: ${escapeHtml(user)}</div>
        <div>${TEXT.ANSWER}: ${escapeHtml(q.answerRaw)}</div>
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

function cleanInline(value) {
  return normalizeEscapedBreaks(String(value || "")).replace(/\s+/g, " ").trim();
}

function dedupeByNormalize(items) {
  const out = [];
  const seen = new Set();
  for (const item of items || []) {
    const s = cleanInline(item);
    const k = normalizeEnglish(s);
    if (!s || !k || seen.has(k)) continue;
    seen.add(k);
    out.push(s);
  }
  return out;
}

function normalizeEscapedBreaks(value) {
  return String(value ?? "")
    .replaceAll("\\r\\n", "\n")
    .replaceAll("\\n", "\n")
    .replaceAll("\\r", "\n")
    .replace(/\\+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n");
}

function normalizeEnglish(value) {
  return cleanInline(value)
    .replace(/[’‘`]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[.?!~]+$/g, "")
    .toLowerCase();
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

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
