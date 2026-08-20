// aisth-l2e3.js
// Independent runtime for Aisth Lesson 2 Exercise 3

const TARGET_LESSON = 2;
const TARGET_EXERCISE = 3;
const PAGE_LABEL = "Aisth L2-E3";
const MAX_QUESTIONS = 0; // 0 = unlimited

const L23_DIRECT_QUESTION_ROWS = [
  ["I ____ __ eat pizza.\n나는 피자를 **먹고 싶어.**", "want to"],
  ["I ____ __ finish this today.\n나는 이것을 오늘 **끝내야 해.**", "have to"],
  ["She ___ __ leave early.\n그녀는 일찍 **떠나야 해.**", "has to"],
  ["We ____ __ wear uniforms.\n우리는 교복을 **입어야 해.**", "have to"],
  ["You ____ __ check the answer.\n너는 정답을 확인**할 필요가 있어.**", "need to"],
  ["He _____ __ find a new job.\n그는 새 직업을 구**할 필요가 있어.**", "needs to"],
  ["They ____ __ practice more.\n그들은 더 연습**할 필요가 있어.**", "need to"],
  ["You _____ ____ __ come today.\n너는 오늘 **안 와도 돼.**", "don't have to"],
  ["She _______ ____ __ hurry.\n그녀는 서두르지 **않아도 돼.**", "doesn't have to"],
  ["We _____ ____ __ bring food.\n우리는 음식을 가져오지 **않아도 돼.**", "don't have to"],
  ["I ____ __ play outside every day.\n나는 예전에 매일 밖에서 놀**곤 했어.**", "used to"],
  ["He ____ __ live in Busan.\n그는 예전에 부산에 살**곤 했어.**", "used to"],
  ["I __ ____ __ solve it now.\n나는 이제 그것을 해결**할 수 있어.**", "am able to"],
  ["She __ ____ __ swim well.\n그녀는 수영을 잘 **할 수 있어.**", "is able to"],
  ["They ___ ____ __ join us.\n그들은 우리와 함께**할 수 있어.**", "are able to"],
  ["I __ _____ __ call him tonight.\n나는 오늘 밤 그에게 전화**할 예정이야.**", "am going to"],
  ["He __ _____ __ study abroad.\n그는 유학을 **갈 예정이야.**", "is going to"],
  ["We ___ _____ __ start soon.\n우리는 곧 시작**할 예정이야.**", "are going to"],
  ["I _____ ____ __ order this.\n저는 이것을 주문**하고 싶습니다.**", "would like to"],
  ["She _____ ____ __ ask a question.\n그녀는 질문을 하나 **하고 싶어 합니다.**", "would like to"],
].map(([Question, Answer], index) => ({
  Lesson: TARGET_LESSON,
  Exercise: TARGET_EXERCISE,
  Title: "여러 단어 유사조동사",
  Question,
  QNumber: index + 1,
  Answer,
  Instruction: "빈칸에 알맞은 유사조동사를 넣어보세요.",
  KoreanHint: "",
  ClauseRole: "",
}));

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
let day = "007";
let quizTitle = "quiz_Grammar_aisth_l2e3";
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

    #quiz-area .l23-prompt-surface {
      display: block !important;
      text-align: center !important;
      white-space: normal !important;
    }

    .l23-prompt-lines {
      display: flex;
      width: 100%;
      min-height: 100%;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 7px;
      text-align: center;
      white-space: normal;
    }

    .l23-en-line {
      color: #203736;
      font-size: 18px;
      line-height: 1.45;
      font-weight: 950;
      word-break: keep-all;
    }

    .l23-ko-line {
      color: #6d5b50;
      font-size: 12.5px;
      line-height: 1.45;
      font-weight: 850;
      word-break: keep-all;
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
  return L23_DIRECT_QUESTION_ROWS.map((row) => ({ ...row }));
}

function publishFrameDebugList() {
  if (!window.AisthLocalQuestionData || typeof window.AisthLocalQuestionData.publishDebugList !== "function") return;
  window.AisthLocalQuestionData.publishDebugList(questions, {
    label: PAGE_LABEL,
    source: "direct-js",
    title: "aisth-l2e3.js",
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

  const qBody = renderQuestionPrompt(q);

  const placeholder = q.type === "blank"
    ? ""
    : `${TEXT.PLACE_REWRITE_1} ${TEXT.PLACE_EX_PREFIX}${rewritePlaceholderExample || "example"})`;

  const inputHtml = q.type === "blank"
    ? `<input id="user-answer" class="short-input l23-slot-source-input" type="text" autocomplete="off" inputmode="latin" lang="en" autocapitalize="none" spellcheck="false" placeholder="${escapeHtmlAttr(placeholder)}" />`
    : `<textarea id="user-answer" rows="3" placeholder="${escapeHtmlAttr(placeholder)}"></textarea>`;

  area.innerHTML = `
    <div class="q-label">Q. ${currentIndex + 1} / ${questions.length}</div>

    <div class="box">
      <div class="question-instruction">${renderTextWithEmphasis(q.instruction || TEXT.INPUT_HINT_FALLBACK)}</div>
      <div class="sentence aisth-question-surface aisth-question-center l23-prompt-surface">${qBody}</div>
    </div>

    <div class="box${q.type === "blank" ? " aisth-letter-answer-box" : ""}" style="background:#fff;">
      <div class="aisth-answer-tool-row">
        <span aria-hidden="true"></span>
        <span class="aisth-type-pill">type!</span>
        <span class="aisth-answer-tool-end">${q.type === "blank" && q.no > 1 ? `<button class="aisth-hint-tool" id="hint-btn" type="button" aria-label="hint"><span class="aisth-hint-bulb" aria-hidden="true">!</span><span>hint</span></button>` : ""}</span>
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
  const initialPlaceholderText = q.type === "blank" && q.no === 1 ? pickSlotModelText(q.answer) : "";
  const slotInputControl = input && window.AisthInputSlots
    ? window.AisthInputSlots.enhance(input, {
      modelText: q.answer,
      placeholderText: initialPlaceholderText,
      onEnter: () => updateSlotAnswerState(q, input, slotInputControl?.control),
    })
    : null;

  if (hintBtn) {
    hintBtn.addEventListener("click", () => {
      revealFirstSlotPlaceholder(slotInputControl?.control, buildSlotPlaceholderText(q));
      hintBtn.disabled = true;
    });
  }
  if (nextBtn) nextBtn.addEventListener("click", goNext);

  if (input) {
    if (slotInputControl) {
      applyPlaceholderAnimationDelays(slotInputControl.control);
      input.addEventListener("input", () => updateSlotAnswerState(q, input, slotInputControl.control));
      updateSlotAnswerState(q, input, slotInputControl.control);
      slotInputControl.focus();
    }
    else input.focus();
    input.addEventListener("keydown", (ev) => {
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
  const input = document.getElementById("user-answer");
  const submitBtn = document.getElementById("submit-btn");
  const nextBtn = document.getElementById("next-btn");
  const feedback = document.getElementById("feedback");

  if (!q || !input) return;

  const userRaw = String(input.value || "").trim();
  if (!userRaw) {
    showToast("no", TEXT.INPUT_REQUIRED);
    return;
  }
  const ok = isAnswerCorrect(q.type, userRaw, q.answer);

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

function renderQuestionPrompt(q) {
  const parts = splitQuestionPrompt(q?.question || "");
  const enHtml = parts.en
    ? `<div class="l23-en-line"><span class="aisth-sentence-flow">${renderPromptLine(parts.en)}</span></div>`
    : "";
  const koHtml = parts.ko
    ? `<div class="l23-ko-line">${renderTextWithEmphasis(parts.ko)}</div>`
    : "";

  return `
    <div class="l23-prompt-lines">
      ${enHtml}
      ${koHtml}
    </div>
  `;
}

function splitQuestionPrompt(raw) {
  const lines = normalizeEscapedBreaks(String(raw ?? ""))
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => stripEnglishWrapper(line));

  if (lines.length >= 2) {
    const enIndex = lines.findIndex((line) => /[A-Za-z]/.test(line) || line.includes("___"));
    if (enIndex >= 0) {
      return {
        en: lines[enIndex],
        ko: lines.filter((_, idx) => idx !== enIndex).join(" "),
      };
    }
  }

  const only = lines[0] || "";
  if (/[A-Za-z]/.test(only) || only.includes("___")) return { en: only, ko: "" };
  return { en: "", ko: only };
}

function stripEnglishWrapper(line) {
  return String(line ?? "").replace(/^\((.*)\)$/s, "$1").trim();
}

function renderPromptLine(line) {
  return renderTextWithEmphasis(line).replace(/_{2,}/g, (m) => `<span class="blank-slot">${m}</span>`);
}

function buildSlotPlaceholderText(q) {
  const modelText = pickSlotModelText(q?.answer);
  if (!modelText) return "";
  return Array.from(modelText.replace(/\s+/g, ""))[0] || "";
}

function revealFirstSlotPlaceholder(control, placeholderText) {
  if (!control || !placeholderText) return;
  control.classList.remove("is-full-hint");
  control.classList.add("has-revealed-hint");
  control.dataset.placeholderChars = String(placeholderText);
  const flowInput = control.querySelector(".aisth-slot-input");
  if (flowInput) flowInput.dispatchEvent(new Event("input", { bubbles: true }));
}

function applyPlaceholderAnimationDelays(control) {
  if (!control) return;
  Array.from(control.querySelectorAll(".aisth-slot-cell")).forEach((cell, idx) => {
    cell.style.setProperty("--aisth-placeholder-delay", `${(idx * 0.16).toFixed(2)}s`);
  });
}

function updateSlotAnswerState(q, sourceInput, control) {
  if (!q || !sourceInput || !control || isCurrentLocked || q.type !== "blank") return;

  const modelText = pickSlotModelText(q.answer);
  const modelChars = getAnswerChars(modelText);
  const userChars = getAnswerChars(sourceInput.value);
  const cells = Array.from(control.querySelectorAll(".aisth-slot-cell"));
  const thirdPersonSIndices = getQuasiModalThirdPersonSIndices(modelText);
  let allCorrect = modelChars.length > 0 && userChars.length >= modelChars.length;

  cells.forEach((cell, idx) => {
    const userChar = userChars[idx] || "";
    const modelChar = modelChars[idx] || "";
    const isFilled = Boolean(userChar);
    const ok = isFilled && compareSlotChar(userChar, modelChar);

    cell.classList.toggle("is-slot-correct", ok);
    cell.classList.toggle("is-slot-wrong", isFilled && !ok);
    cell.classList.toggle("is-suffix-highlight", thirdPersonSIndices.has(idx));
    if (!ok) allCorrect = false;
  });

  if (allCorrect) submitCurrentAnswer();
}

function compareSlotChar(userChar, modelChar) {
  return String(userChar || "").toLowerCase() === String(modelChar || "").toLowerCase();
}

function getAnswerChars(value) {
  return Array.from(String(value ?? "").replace(/\s+/g, ""));
}

function getQuasiModalThirdPersonSIndices(modelText) {
  const firstWord = String(modelText || "").trim().split(/\s+/)[0]?.toLowerCase() || "";
  if (!["needs", "has", "doesn't", "doesnt"].includes(firstWord)) return new Set();
  const sIndex = Array.from(firstWord).lastIndexOf("s");
  return sIndex >= 0 ? new Set([sIndex]) : new Set();
}

function pickSlotModelText(modelRaw) {
  const raw = stripEmphasisMarkers(normalizeEscapedBreaks(String(modelRaw ?? ""))).trim();
  if (!raw) return "";

  let line = raw.split(/\r?\n/).map((x) => x.trim()).filter(Boolean)[0] || raw;
  line = line.split("||").map((x) => x.trim()).filter(Boolean)[0] || line;
  if (/\bor\b/i.test(line)) line = line.split(/\bor\b/i).map((x) => x.trim()).filter(Boolean)[0] || line;
  if (line.includes("/")) line = line.split("/").map((x) => x.trim()).filter(Boolean)[0] || line;
  if (line.includes(",")) line = line.split(",").map((x) => x.trim()).filter(Boolean)[0] || line;
  return line.replace(/[.?!~]+$/g, "").trim();
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







