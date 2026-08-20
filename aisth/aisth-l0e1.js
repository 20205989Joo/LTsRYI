// aisth-l0e1.js
// Aisth Prologue 1: parenthesis circle-select warm-up

const EXCEL_FILE = "LTRYI-grammar-lesson-questions.xlsx";
const TARGET_LESSON = 0;
const TARGET_EXERCISE = 1;
const PAGE_LABEL = "Aisth L0-E1";
const MAX_QUESTIONS = 0; // 0 = unlimited

const DEFAULT_INSTRUCTION = "올바른 답을 선택해보세요!";

const TEXT = {
  START: "🚀 시작",
  INTRO_1: "프롤로그 워밍업: 괄호 보기 중 맞는 형태를 고르세요.",
  INTRO_2: "선택지를 누르면 전체가 강조됩니다.",
  PIN: "📌",
  NO_QUESTIONS: "해당 Lesson/Exercise의 문제가 없습니다.",
  PICK_OPTION: "선택지를 먼저 고르세요.",
  CORRECT: "정답!",
  WRONG: "오답",
  S_REMINDER: "기억하세요, **s**는 딱 하나만!",
  SUBMIT: "제출",
  NEXT: "다음",
  LOAD_FAIL: "엑셀 파일을 불러오지 못했습니다. 파일명/경로를 확인하세요.",
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
let day = "001";
let quizTitle = "quiz_Grammar_aisth_l0e1";
let userId = "";

let rawRows = [];
let questions = [];
let currentIndex = 0;
let results = [];
let isCurrentLocked = false;
let selectedOptionIndex = -1;
let autoNextTimer = 0;
let wrongReleaseTimer = 0;

window.addEventListener("DOMContentLoaded", async () => {
  injectRuntimeStyles();

  if (window.HermaToastFX) {
    window.HermaToastFX.init({ hostId: "cafe_int", top: 10 });
  }

  applyQueryParams();
  wireBackButton();
  wirePopupEvents();

  try {
    rawRows = await loadExcelRows(EXCEL_FILE);
  } catch (err) {
    console.error(err);
    alert(TEXT.LOAD_FAIL + "\n" + EXCEL_FILE);
    return;
  }

  buildQuestionsFromRows();
  publishFrameQuestionDebugList();
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
      display: inline-flex;
      align-items: center;
      min-height: 24px;
      padding: 2px 10px;
      border-radius: 999px;
      background: rgba(255, 240, 207, 0.14);
      border: 1px solid rgba(255, 226, 166, 0.28);
      font-weight: 900;
      font-size: 16px;
      margin-bottom: 10px;
      color: #f4d99b;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.42);
    }

    .question-instruction {
      color: #111;
      font-size: 17px;
      line-height: 1.5;
      font-weight: 950;
      word-break: keep-all;
      margin: 16px 0 12px;
    }

    .prompt {
      display: flex;
      align-items: center;
      background: #fff;
      border: 1.5px solid rgba(126, 49, 6, 0.34);
      border-radius: 12px;
      min-height: 96px;
      padding: 18px 14px;
      margin-top: 12px;
      line-height: 1.75;
      font-size: 17px;
      color: #203736;
      word-break: keep-all;
      white-space: pre-wrap;
      box-sizing: border-box;
    }
    .blank-slot {
      display: inline-block;
      padding: 1px 8px;
      border-radius: 7px;
      border: 1px dashed var(--aisth-role-v-border, #c88a12);
      background: var(--aisth-role-v-bg, #fff4cc);
      color: var(--aisth-role-v-text, #7a4a00);
      font-weight: 900;
      margin: 0 2px;
    }

    .focus-token {
      background: rgba(136, 84, 208, 0.16);
      border-radius: 6px;
      padding: 0 3px;
      box-shadow: inset 0 0 0 1px rgba(136, 84, 208, 0.24);
      color: #6c3ac7;
      font-weight: 900;
    }

    .s-reminder .focus-token {
      font-size: 1.32em;
      line-height: 1;
      padding: 0 4px;
      vertical-align: -0.04em;
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

async function loadExcelRows(filename) {
  const cacheBust = `v=${Date.now()}`;
  const url = filename.includes("?") ? `${filename}&${cacheBust}` : `${filename}?${cacheBust}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);

  const buffer = await res.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  return rows.filter((row) => !isRowAllEmpty(row));
}

function isRowAllEmpty(row) {
  const keys = Object.keys(row || {});
  if (!keys.length) return true;
  return keys.every((k) => String(row[k] ?? "").trim() === "");
}

function buildQuestionsFromRows() {
  let filtered = rawRows
    .filter((r) => Number(r["Lesson"]) === TARGET_LESSON && Number(r["Exercise"]) === TARGET_EXERCISE)
    .sort((a, b) => Number(a["QNumber"]) - Number(b["QNumber"]));

  if (MAX_QUESTIONS > 0) filtered = filtered.slice(0, MAX_QUESTIONS);

  questions = filtered.map((row, idx) => {
    const rawQuestion = normalizeEscapedBreaks(String(row["Question"] ?? "").trim());
    const answerRaw = normalizeEscapedBreaks(String(row["Answer"] ?? "").trim());
    const title = normalizeEscapedBreaks(String(row["Title"] ?? "").trim());
    const instruction = normalizeQuestionInstruction(row["Instruction"]);
    const parsed = parseParenthesisQuestion(rawQuestion);
    const sMarkedPromptBefore = markPluralSubjectWithEmphasis(parsed.before);
    const sMarkedOptions = (parsed.options || []).map((opt) => ({
      ...opt,
      text: markSingularVerbSWithEmphasis(opt.text),
    }));
    const correctOptionIndex = resolveCorrectOptionIndex(answerRaw, sMarkedOptions);

    return {
      no: idx + 1,
      qNumber: Number(row["QNumber"]) || idx + 1,
      title,
      instruction,
      answerRaw,
      promptBefore: sMarkedPromptBefore,
      promptAfter: parsed.after,
      options: sMarkedOptions,
      correctOptionIndex,
      questionRaw: rawQuestion,
    };
  });
}

function parseParenthesisQuestion(raw) {
  const text = String(raw || "").trim();
  const m = text.match(/^(.*)\(([^()]+)\)(.*)$/);
  if (!m) {
    return {
      before: text,
      after: "",
      options: [],
    };
  }

  const before = String(m[1] || "").trimEnd();
  const inside = String(m[2] || "").trim();
  const after = String(m[3] || "").trimStart();

  const parts = inside.split("/").map((x) => x.trim()).filter(Boolean);
  const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const options = parts.map((textPart, idx) => ({
    label: labels[idx] || String(idx + 1),
    text: textPart,
  }));

  return { before, after, options };
}

function resolveCorrectOptionIndex(answerRaw, options) {
  const normAns = normalizeLoose(answerRaw);
  return (options || []).findIndex((o) => normalizeLoose(o.text) === normAns || normalizeLoose(o.label) === normAns);
}

function buildTutorialRuleExample(subject, verb, note) {
  const noteHtml = note ? `<div class="lip-example-note">${escapeHtml(note)}</div>` : "";
  return `
    <div class="lip-grammar-demo">
      <div class="lip-grammar-side is-subject">
        <div class="lip-grammar-side-label">Subject</div>
        <div class="lip-grammar-token">${subject}</div>
      </div>
      <div class="lip-grammar-arrow">→</div>
      <div class="lip-grammar-side is-verb">
        <div class="lip-grammar-side-label">Verb</div>
        <div class="lip-grammar-token">${verb}</div>
      </div>
    </div>
    ${noteHtml}
  `;
}

function buildTutorialCircleS(char) {
  return `<span class="lip-grammar-mark is-ring">${escapeHtml(char)}</span>`;
}

function buildTutorialMissingS() {
  return `<span class="lip-grammar-miss" aria-hidden="true"></span>`;
}

function buildInstructionWord(text, variant) {
  return `<span class="lip-inline-word lip-inline-word-${variant}">${escapeHtml(text)}</span>`;
}

function buildInstructionS() {
  return `<span class="lip-inline-s">${escapeHtml("s")}</span>`;
}

function buildPlainInstructionS() {
  return escapeHtml("s");
}

function buildStep1InstructionHtml() {
  return `${buildInstructionWord("\uC8FC\uC5B4", "subject")}\uC5D0 ${buildInstructionS()}\uAC00 \uC788\uB2E4\uBA74, ${buildInstructionWord("\uB3D9\uC0AC", "verb")}\uC5D4 ${buildPlainInstructionS()}\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4`;
}

function buildStep2InstructionHtml() {
  return `${buildInstructionWord("\uC8FC\uC5B4", "subject")}\uC5D0 ${buildPlainInstructionS()}\uAC00 \uC5C6\uB2E4\uBA74 ${buildInstructionWord("\uB3D9\uC0AC", "verb")}\uC5D4 ${buildInstructionS()}\uAC00 \uC788\uC2B5\uB2C8\uB2E4`;
}

function buildTutorialStep1Example() {
  return buildTutorialRuleExample(
    `dog${buildTutorialCircleS("s")}`,
    `run${buildTutorialMissingS()}`
  );
}

function buildTutorialStep2Example() {
  return buildTutorialRuleExample(
    `he${buildTutorialMissingS()}`,
    `run${buildTutorialCircleS("s")}`
  );
}

function buildIntroPlayerConfig() {
  const firstQuestion = questions[0] || null;

  return {
    pageLabel: PAGE_LABEL,
    title: firstQuestion?.title || "\uB2E8\uC218/\uBCF5\uC218",
    nextLabel: "다음",
    primaryLabel: TEXT.START,
    onPrimary: startQuiz,
    steps: [
      {
        title: "주어에 s가 있다면, 동사엔 s가 없습니다",
        titleHtml: buildStep1InstructionHtml(),
        exampleHtml: buildTutorialStep1Example(),
      },
      {
        title: "주어에 s가 없다면 동사엔 s가 있습니다",
        titleHtml: buildStep2InstructionHtml(),
        exampleHtml: buildTutorialStep2Example(),
      },
      {
        title: "\uC774\uC81C \uC9C1\uC811 \uD574\uBCF4\uC138\uC694!",
      },
    ],
  };
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
        startLabel: TEXT.START,
        onStart: startQuiz,
      })) {
        return;
      }
    } catch (err) {
      console.error("AisthIntroFronts render failed:", err);
    }
  }

  if (window.LessonIntroPlayer && typeof window.LessonIntroPlayer.render === "function") {
    try {
      if (window.LessonIntroPlayer.render(area, buildIntroPlayerConfig())) {
        return;
      }
    } catch (err) {
      console.error("LessonIntroPlayer render failed:", err);
    }
  }

  const total = questions.length;
  const title = questions[0]?.title || PAGE_LABEL;
  const firstInst = questions[0]?.instruction || DEFAULT_INSTRUCTION;

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
  if (autoNextTimer) {
    clearTimeout(autoNextTimer);
    autoNextTimer = 0;
  }
  if (wrongReleaseTimer) {
    clearTimeout(wrongReleaseTimer);
    wrongReleaseTimer = 0;
  }
  const promptHtml = `${renderTextWithEmphasis(q.promptBefore)} <span class="blank-slot">___</span> ${renderTextWithEmphasis(q.promptAfter)}`.trim();
  const optionsHtml = q.options
    .map((opt, idx) => `
      <div class="aisth-choice-item" data-opt-index="${idx}" role="button" tabindex="0">
        <span class="aisth-choice-label">${escapeHtml(opt.label)}</span>
        <span class="aisth-choice-text">${renderTextWithEmphasis(opt.text)}</span>
      </div>
    `)
    .join("");

  area.innerHTML = `
    <div class="q-label">Q. ${currentIndex + 1} / ${questions.length}</div>

    <div class="box aisth-l0e1-question-box">
      <div class="question-instruction">${escapeHtml(q.instruction || DEFAULT_INSTRUCTION)}</div>
      <div class="s-reminder" style="font-size:12px; color:#6c3ac7; font-weight:900; margin-top:6px;">${renderTextWithEmphasis(TEXT.S_REMINDER)}</div>
      <div class="prompt aisth-question-surface">${promptHtml}</div>
      <div class="aisth-choice-list">${optionsHtml}</div>
      <div id="feedback" class="feedback"></div>
    </div>
  `;

  wireChoiceEvents();
}

function wireChoiceEvents() {
  document.querySelectorAll(".aisth-choice-item").forEach((el) => {
    const activate = () => {
      if (isCurrentLocked) return;
      const idx = Number(el.dataset.optIndex ?? -1);
      if (!Number.isInteger(idx) || idx < 0) return;
      if (wrongReleaseTimer) {
        clearTimeout(wrongReleaseTimer);
        wrongReleaseTimer = 0;
      }
      selectedOptionIndex = idx;
      refreshChoiceSelection();
      submitCurrentAnswer();
    };

    el.addEventListener("click", activate);
    el.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        activate();
      }
    });
  });
}

function refreshChoiceSelection() {
  document.querySelectorAll(".aisth-choice-item").forEach((el) => {
    const idx = Number(el.dataset.optIndex ?? -1);
    el.classList.toggle("selected", idx === selectedOptionIndex);
  });
}

function submitCurrentAnswer() {
  if (isCurrentLocked) return;

  const q = questions[currentIndex];
  const feedback = document.getElementById("feedback");

  if (!q) return;
  if (selectedOptionIndex < 0 || selectedOptionIndex >= q.options.length) {
    showToast("no", TEXT.PICK_OPTION);
    return;
  }

  const selectedOpt = q.options[selectedOptionIndex];
  const fallbackOk = normalizeLoose(selectedOpt.text) === normalizeLoose(q.answerRaw);
  const ok = q.correctOptionIndex >= 0 ? selectedOptionIndex === q.correctOptionIndex : fallbackOk;

  if (!ok) {
    const wrongIndex = selectedOptionIndex;
    if (feedback) {
      feedback.className = "feedback";
      feedback.innerHTML = "";
    }
    showToast("no", TEXT.WRONG);
    wrongReleaseTimer = window.setTimeout(() => {
      wrongReleaseTimer = 0;
      if (!isCurrentLocked && selectedOptionIndex === wrongIndex) {
        selectedOptionIndex = -1;
        refreshChoiceSelection();
      }
    }, 420);
    return;
  }

  isCurrentLocked = true;

  document.querySelectorAll(".aisth-choice-item").forEach((el) => {
    el.style.pointerEvents = "none";
  });

  const correctOpt = q.correctOptionIndex >= 0 ? q.options[q.correctOptionIndex] : null;

  results.push({
    no: currentIndex + 1,
    qNumber: q.qNumber,
    question: buildQuestionPlainText(q),
    selected: `${selectedOpt.label}. ${stripEmphasisTokens(selectedOpt.text)}`,
    answer: correctOpt ? `${correctOpt.label}. ${stripEmphasisTokens(correctOpt.text)}` : stripEmphasisTokens(q.answerRaw),
    instruction: q.instruction,
    correct: true,
  });

  if (feedback) {
    feedback.className = "feedback";
    feedback.innerHTML = "";
  }

  storeLatestResultSnapshot();
  showToast("ok", TEXT.CORRECT);
  autoNextTimer = window.setTimeout(() => {
    autoNextTimer = 0;
    goNext();
  }, 560);
}
function publishFrameQuestionDebugList() {
  if (!window.AisthFrameLoader || typeof window.AisthFrameLoader.setQuestionDebugList !== "function") return;
  const items = questions.map((q, idx) => {
    const correctOpt = q.correctOptionIndex >= 0 ? q.options[q.correctOptionIndex] : null;
    return {
      no: idx + 1,
      question: buildQuestionPlainText(q),
      answer: correctOpt ? `${correctOpt.label}. ${stripEmphasisTokens(correctOpt.text)}` : stripEmphasisTokens(q.answerRaw),
    };
  });
  window.AisthFrameLoader.setQuestionDebugList(items, {
    label: PAGE_LABEL,
    title: quizTitle,
  });
}
function buildQuestionPlainText(q) {
  return `${stripEmphasisTokens(q.promptBefore)} ( ___ ) ${stripEmphasisTokens(q.promptAfter)}`.replace(/\s+/g, " ").trim();
}

function goNext() {
  currentIndex += 1;
  if (currentIndex >= questions.length) {
    showResultPopup();
    return;
  }
  renderQuestion();
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
    const correctOpt = q.correctOptionIndex >= 0 ? q.options[q.correctOptionIndex] : null;
    const answerShown = correctOpt ? `${correctOpt.label}. ${stripEmphasisTokens(correctOpt.text)}` : stripEmphasisTokens(q.answerRaw);

    return `
      <div class="result-item">
        <div><b>Q${idx + 1}</b> ${escapeHtml(buildQuestionPlainText(q))}</div>
        <div style="margin-top:4px;"><span class="${stateClass}">${state}</span></div>
        <div>${TEXT.MY_ANSWER}: ${escapeHtml(user)}</div>
        <div>${TEXT.ANSWER}: ${escapeHtml(answerShown)}</div>
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

function normalizeQuestionInstruction(value) {
  const text = normalizeEscapedBreaks(String(value ?? "").trim());
  if (!text || text.includes("동그라미")) return DEFAULT_INSTRUCTION;
  return text;
}

function normalizeEscapedBreaks(value) {
  return String(value ?? "")
    .replaceAll("\\r\\n", "\n")
    .replaceAll("\\n", "\n")
    .replaceAll("\\r", "\n")
    .replace(/\\+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n");
}

function normalizeLoose(value) {
  return String(value ?? "")
    .replace(/[’‘`]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.?!~]+$/g, "")
    .toLowerCase()
    .replace(/[\s'"`.,!?~:;()\[\]{}_*+-]+/g, "");
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

function markPluralSubjectWithEmphasis(value) {
  const src = String(value ?? "");
  if (!src || src.includes("**")) return src;
  if (!isPluralSubjectText(src)) return src;
  return `**${src.trim()}**`;
}

function isPluralSubjectText(value) {
  const text = normalizeEscapedBreaks(String(value ?? ""))
    .replace(/\*\*/g, "")
    .replace(/[.,!?;:()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  if (!text) return false;
  if (/\band\b/.test(text)) return true;

  const words = text.split(" ").filter(Boolean);
  if (!words.length) return false;

  const first = words[0];
  if (["they", "we", "these", "those"].includes(first)) return true;
  if (["he", "she", "it", "this", "that", "i", "you"].includes(first)) return false;

  const determiners = new Set(["a", "an", "the", "my", "your", "his", "her", "our", "their", "this", "that", "these", "those"]);
  const singularSWords = new Set(["news", "mathematics", "physics", "economics"]);
  const irregularPluralNouns = new Set(["people", "children", "men", "women", "mice", "feet", "teeth", "geese", "police"]);

  const contentWords = words.filter((w) => !determiners.has(w));
  const head = contentWords.length ? contentWords[contentWords.length - 1] : words[words.length - 1];
  if (!head) return false;
  if (irregularPluralNouns.has(head)) return true;
  if (singularSWords.has(head)) return false;

  return /^[a-z]+s$/i.test(head) && !/ss$/i.test(head);
}

function markSingularVerbSWithEmphasis(value) {
  const src = normalizeEscapedBreaks(String(value ?? ""));
  if (!src || src.includes("**")) return src;

  const m = src.match(/^(\s*)([A-Za-z]+)(\s*)$/);
  if (!m) return src;

  const lead = m[1] || "";
  const word = m[2] || "";
  const trail = m[3] || "";
  if (!shouldMarkSingularVerbWord(word)) return src;

  return `${lead}${word.slice(0, -1)}**${word.slice(-1)}**${trail}`;
}

function shouldMarkSingularVerbWord(word) {
  const w = String(word ?? "").toLowerCase();
  if (!w || !/^[a-z]+$/.test(w)) return false;
  if (["is", "has", "does"].includes(w)) return true;
  if (!w.endsWith("s")) return false;
  if (w.length <= 1) return false;
  if (/ss$/.test(w)) return false;
  if (["this", "his", "yes", "news"].includes(w)) return false;
  return true;
}

function stripEmphasisTokens(value) {
  return String(value ?? "").replace(/\*\*/g, "");
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
