// aisth-l1e4.js
// Independent runtime for Aisth Lesson 1 Exercise 4
// Flow: click correct word in sentence -> highlight -> show translation box

const TARGET_LESSON = 1;
const TARGET_EXERCISE = 4;
const PAGE_LABEL = "Aisth L1-E4";
const MAX_QUESTIONS = 0; // 0 = unlimited

const FIXED_INSTRUCTION = "문장에서 정답 단어(부사)를 클릭하고 번역해보세요.";

const TEXT = {
  START: "🚀 시작",
  INTRO_1: "문장에서 정답 단어를 클릭한 뒤 번역을 입력하세요.",
  INTRO_2: "정답 단어를 맞게 누르면 번역 박스가 나타납니다.",
  PIN: "📌",
  NO_QUESTIONS: "해당 Lesson/Exercise의 문제가 없습니다.",
  PICK_WORD_FIRST: "먼저 문장에서 정답 단어를 클릭하세요.",
  INPUT_REQUIRED: "번역을 입력하세요.",
  CORRECT: "정답!",
  WRONG: "오답",
  QTYPE: "단어 찾기 + 번역",
  RESULT_TITLE: "결과 요약",
  SCORE: "점수",
  CORRECT_COUNT: "정답",
  MY_ANSWER: "내 답",
  ANSWER: "정답",
  RETRY: "다시하기",
  CLOSE: "닫기",
  UNANSWERED: "(미응답)",
  SUBMIT: "제출",
  HINT: "힌트",
  NEXT: "다음",
  TRANSLATE_HINT: "선택한 단어를 번역해보세요.",
  TRANSLATE_HINT_FREE: "선택한 단어의 뜻을 자유롭게 적어보세요. (채점 X)",
};

const L14_TRANSLATE_PROMPT_BY_QNUMBER = {
  1: "그는 달린다, 어떻게?",
  2: "그녀는 노래한다, 어떻게?",
  3: "그들은 도착한다, 언제?",
  4: "나는 체육관에 간다, 얼마나 자주?",
  5: "우리는 만난다, 언제?",
  6: "태양은 빛난다, 어떻게?",
  7: "그는 질문에 대답한다, 어떻게?",
  8: "그녀는 타자를 친다, 어떻게?",
  9: "나는 그를 본다, 언제?",
  10: "그들은 산다, 어디에?",
  11: "기차는 도착한다, 언제?",
  12: "그녀는 춤춘다, 어떻게?",
  13: "그는 말한다, 어떻게?",
  14: "아이들은 논다, 어디에서?",
  15: "나는 일을 끝낸다, 언제?",
  16: "그녀는 나를 본다, 어떻게?",
  17: "그는 방으로 걸어 들어간다, 어떻게?",
  18: "새들은 노래한다, 어떻게?",
  19: "우리는 웃는다, 어떻게?",
  20: "그는 전화를 받는다, 언제?",
  21: "나는 조부모님을 방문한다, 얼마나 자주?",
  22: "그들은 외식한다, 얼마나 자주?",
  23: "아기는 잔다, 어떻게?",
  24: "그는 시를 쓴다, 어떻게?",
  25: "너는 운전해야 한다, 어떻게?",
  26: "그는 조깅한다, 얼마나 자주?",
  27: "나는 그녀를 만난다, 언제?",
  28: "소년은 웃는다, 어떻게?",
  29: "우리는 도착한다, 언제?",
  30: "그녀는 프랑스어를 말한다, 어떻게?",
};

const L14_S_SUFFIX_VERBS = new Set([
  "is", "has", "does",
  "runs", "sings", "shines", "answers", "arrives", "dances",
  "speaks", "looks", "walks", "sleeps", "writes", "jogs", "smiles",
  "works", "drives",
]);

const L14_VERB_WORD_BY_QNUMBER = {
  1: "runs",
  2: "sings",
  3: "arrive",
  4: "go",
  5: "meet",
  6: "shines",
  7: "answers",
  8: "type",
  9: "see",
  10: "live",
  11: "arrives",
  12: "dances",
  13: "speaks",
  14: "play",
  15: "finish",
  16: "looks",
  17: "walks",
  18: "sing",
  19: "laugh",
  20: "answers",
  21: "visit",
  22: "eat",
  23: "sleeps",
  24: "writes",
  25: "drive",
  26: "jogs",
  27: "meet",
  28: "smiles",
  29: "arrive",
  30: "speaks",
};

let subcategory = "Grammar";
let level = "aisth";
let day = "004";
let quizTitle = "quiz_Grammar_aisth_l1e4";
let userId = "";

let rawRows = [];
let questions = [];
let currentIndex = 0;
let results = [];
let isCurrentLocked = false;

let selectedWordOk = false;
let selectedWordIndex = -1;
let selectedWordText = "";

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
      line-height: 1.75;
      font-size: 14px;
      word-break: keep-all;
      white-space: pre-wrap;
    }

    #clickable-sentence {
      column-gap: 0.42em !important;
      row-gap: 0.12em !important;
    }

    .word-token {
      cursor: pointer;
      border-radius: 6px;
      transition: background-color 0.15s ease;
    }
    .word-token:hover {
      background: rgba(241,123,42,0.15);
    }

    .word-token.hit {
      padding: 2px 5px;
      border: 2px dotted #1e8a9a;
      border-radius: 5px;
      background: transparent;
      color: #126f7e;
      box-shadow: none;
      font-weight: 900;
      line-height: 1.1;
    }

    .word-token .focus-token {
      display: inline-block;
      background: rgba(136, 84, 208, 0.16);
      border-radius: 6px;
      padding: 0 3px;
      box-shadow: inset 0 0 0 1px rgba(136, 84, 208, 0.24);
      color: #6c3ac7;
      font-weight: 900;
      line-height: 1;
    }

    #clickable-sentence.is-step-2 .word-token.is-verb,
    .l14-verb-highlight {
      display: inline-flex;
      align-items: center;
      border: 1px solid var(--aisth-role-v-border, #c88a12);
      border-radius: 7px;
      background: var(--aisth-role-v-bg, #fff4cc);
      color: var(--aisth-role-v-text, #7a4a00);
      box-shadow:
        inset 0 0 0 1px rgba(200, 138, 18, 0.20),
        0 0 10px var(--aisth-role-v-glow, rgba(216,162,27,.24));
      font-weight: 950;
      line-height: 1.1;
    }

    #clickable-sentence.is-step-2 .word-token.is-verb {
      padding: 2px 6px;
    }

    .l14-verb-highlight {
      padding: 1px 5px;
      margin: 0 1px;
    }

    .word-token.miss {
      background: rgba(198,40,40,0.12);
      box-shadow: inset 0 0 0 1px rgba(198,40,40,0.35);
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
    input::placeholder,
    textarea::placeholder {
      color: #b9b2aa;
      opacity: 1;
    }

    .l14-translate-answer-line {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 6px;
      margin-top: 2px;
    }

    .l14-translate-prefix {
      flex: 0 1 auto;
      max-width: 100%;
      color: #3c2d22;
      font-size: 14px;
      font-weight: 900;
      line-height: 1.45;
      word-break: keep-all;
    }

    .l14-translate-colon {
      color: #7e3106;
      font-size: 14px;
      font-weight: 900;
      line-height: 1.45;
    }

    .l14-translate-input {
      flex: 1 1 128px;
      min-width: 118px;
    }

    .l14-translate-input textarea {
      min-height: 40px;
      resize: none;
    }

    .l14-translate-input .aisth-slot-control {
      width: auto;
      min-width: 118px;
      padding: 0 2px 4px;
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

    .l14-chip-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
    }

    .l14-kind-label {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 24px;
      padding: 3px 8px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 900;
      line-height: 1;
      white-space: nowrap;
    }

    .l14-kind-label.is-adj {
      background: transparent;
      color: #92364c;
    }

    .l14-kind-label.is-adv {
      background: transparent;
      color: #126f7e;
    }

    .l14-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 28px;
      padding: 4px 10px;
      border-radius: 999px;
      border: 1px solid transparent;
      font-size: 13px;
      font-weight: 900;
      line-height: 1;
      white-space: nowrap;
    }

    .l14-chip.is-verb {
      border-color: #f1c18e;
      background: #fff;
      color: #7e3106;
    }

    .l14-chip.is-adv,
    .l14-chip.is-adj {
      min-height: 0;
      padding: 2px 5px;
      border-width: 2px;
      border-style: dotted;
      border-radius: 5px;
      background: transparent;
      box-shadow: none;
      line-height: 1;
    }

    .l14-chip.is-adv {
      border-color: #1e8a9a;
      color: #126f7e;
    }

    .l14-chip.is-adj {
      border-color: #b84a62;
      color: #92364c;
    }

    .l14-do-chip {
      position: relative;
      overflow: visible;
    }

    .l14-do-chip::after {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      width: calc(100% + 10px);
      height: calc(100% + 10px);
      transform: translate(-50%, -50%);
      border: 2px solid #2b67c7;
      border-radius: 999px;
      animation: lip-mark-ring 1.8s ease-in-out infinite;
      pointer-events: none;
    }

    .l14-example-sentence {
      background: #fff;
      border: 1px solid #ead4bd;
      border-radius: 12px;
      padding: 10px 12px;
      font-size: 14px;
      line-height: 1.65;
      color: #3c2d22;
      word-break: keep-all;
    }

    .l14-focus-adj,
    .l14-focus-adv {
      display: inline-flex;
      align-items: center;
      padding: 2px 5px;
      border-width: 2px;
      border-style: dotted;
      border-radius: 5px;
      background: transparent;
      box-shadow: none;
      font-weight: 900;
      line-height: 1;
    }

    .l14-focus-adj {
      border-color: #b84a62;
      color: #92364c;
    }

    .l14-focus-adv {
      border-color: #1e8a9a;
      color: #126f7e;
    }

    .l14-ly {
      display: inline;
      min-width: 0;
      margin-left: 0;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
      color: inherit;
      padding: 0;
    }  `;
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

  questions = filtered.map((row, idx) => {
    const question = normalizeEscapedBreaks(String(row["Question"] ?? "").trim());
    const answerRaw = normalizeEscapedBreaks(String(row["Answer"] ?? "").trim());
    const parsed = parseAnswer(answerRaw);
    const qNumber = Number(row["QNumber"]) || idx + 1;

    return {
      no: idx + 1,
      qNumber,
      title: normalizeEscapedBreaks(String(row["Title"] ?? "").trim()),
      question,
      instruction: FIXED_INSTRUCTION,
      answerWord: parsed.word,
      answerWordNorm: normalizeToken(parsed.word),
      answerKo: parsed.ko,
      answerKoNorm: normalizeKorean(parsed.ko),
      translatePrompt: getTranslatePrompt(qNumber),
      verbWordNorm: normalizeToken(L14_VERB_WORD_BY_QNUMBER[qNumber] || ""),
    };
  });
}

function parseAnswer(answerRaw) {
  const raw = stripEmphasisMarkers(String(answerRaw || "").trim());
  if (!raw) return { word: "", ko: "" };

  if (raw.includes(",")) {
    const [first, ...rest] = raw.split(",");
    return {
      word: stripEmphasisMarkers(String(first || "").trim()),
      ko: stripEmphasisMarkers(rest.join(",").trim()),
    };
  }

  return { word: raw, ko: "" };
}

function buildL14Chip(text, variant, extraClass = "") {
  const variantClass = variant === "adv" ? " is-adv" : variant === "adj" ? " is-adj" : " is-verb";
  return `<span class="l14-chip${variantClass}${extraClass ? ` ${extraClass}` : ""}">${escapeHtml(text)}</span>`;
}

function buildL14LyChip(stem) {
  return `
    <span class="l14-chip is-adv">
      ${escapeHtml(stem)}<span class="l14-ly">ly</span>
    </span>
  `;
}

function buildL14Step1ExampleHtml() {
  return `
    <div class="lip-example-stack">
      <div class="l14-chip-row">
        ${buildL14Chip("eat", "verb")}
        ${buildL14Chip("행복하게", "adv")}
      </div>
      <div class="l14-chip-row">
        ${buildL14Chip("run", "verb")}
        ${buildL14Chip("오늘 아침에", "adv")}
      </div>
    </div>
  `;
}

function buildL14Step2ExampleHtml() {
  return `
    <div class="lip-example-stack">
      <div class="l14-chip-row">
        ${buildL14Chip("Do", "verb", "l14-do-chip")}
        ${buildL14Chip("eat", "verb")}
        ${buildL14Chip("행복하게", "adv")}
      </div>
      <div class="l14-chip-row">
        ${buildL14Chip("Do", "verb", "l14-do-chip")}
        ${buildL14Chip("run", "verb")}
        ${buildL14Chip("오늘 아침에", "adv")}
      </div>
    </div>
  `;
}

function buildL14Step3ExampleHtml() {
  return `
    <div class="lip-example-stack">
      <div class="l14-example-sentence">Mina is <span class="l14-focus-adj">happy</span>.</div>
      <div class="l14-example-sentence">Mina runs <span class="l14-focus-adv">happily</span> <span class="l14-focus-adv">today</span>.</div>
    </div>
  `;
}

function buildL14Step4ExampleHtml() {
  return `
    <div class="lip-example-stack">
      <div class="l14-chip-row">
        <span class="l14-kind-label is-adj">형용사</span>
        ${buildL14Chip("quick", "adj")}
        ${buildL14Chip("slow", "adj")}
      </div>
      <div class="l14-chip-row">
        <span class="l14-kind-label is-adv">부사</span>
        ${buildL14LyChip("quick")}
        ${buildL14LyChip("slow")}
      </div>
    </div>
  `;
}

function buildIntroPlayerConfig() {
  const firstQuestion = questions[0] || null;

  return {
    pageLabel: PAGE_LABEL,
    title: stripEmphasisMarkers(firstQuestion?.title || "Adverb"),
    nextLabel: "다음",
    primaryLabel: TEXT.START,
    onPrimary: startQuiz,
    steps: [
      {
        title: "부사adv는 좀 특이합니다. 설명이 잘 안될때 씁니다.",
        exampleHtml: buildL14Step1ExampleHtml(),
      },
      {
        title: "그래서 do와 셋트로 자주 씁니다",
        exampleHtml: buildL14Step2ExampleHtml(),
      },
      {
        title: "be와 함께 쓰는 형용사와 다르다는 것 잊지마세요",
        body: "언제, 어디서, 왜 했는지 설명합니다.",
        exampleHtml: buildL14Step3ExampleHtml(),
      },
      {
        title: "지금은 ly로 구분해볼까요!",
        body: "지금 당장은 ly만 기억하세요.",
        exampleHtml: buildL14Step4ExampleHtml(),
      },
      {
        title: "직접 형용사와 부사를 구분해보세요!",
      },
    ],
  };
}

function renderIntro() {
  const area = document.getElementById("quiz-area");
  if (!area) return;

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
  selectedWordOk = false;
  selectedWordIndex = -1;
  selectedWordText = "";

  const translateHint = q.answerKo ? TEXT.TRANSLATE_HINT : TEXT.TRANSLATE_HINT_FREE;
  const translatePlaceholder = q.answerKo
    ? `번역 입력 (ex. ${clipExample(q.answerKo) || "뜻"})`
    : "번역 입력 (자유 입력)";
  const translateAnswerHtml = q.answerKo
    ? `
      <div class="l14-translate-answer-line">
        <span class="l14-translate-prefix">${renderTranslatePromptWithVerbHighlight(q.translatePrompt)}</span>
        <span class="l14-translate-colon">:</span>
        <span class="l14-translate-input">
          <textarea id="user-ko" rows="2" lang="ko" placeholder="${escapeHtmlAttr(translatePlaceholder)}"></textarea>
        </span>
      </div>
    `
    : `<textarea id="user-ko" rows="2" lang="ko" placeholder="${escapeHtmlAttr(translatePlaceholder)}"></textarea>`;

  area.innerHTML = `
      <div class="q-label">Q. ${currentIndex + 1} / ${questions.length}</div>

    <div class="box">
      <div class="question-instruction">${escapeHtml(FIXED_INSTRUCTION)}</div>
      <div class="sentence aisth-question-surface aisth-question-center" id="clickable-sentence">${renderClickableSentence(q.question, q)}</div>
    </div>

    <div class="box aisth-hint-host" id="translate-wrap" style="background:#fff; display:none;">
      ${q.no > 1 && q.answerKo ? `<button class="aisth-hint-tool" id="hint-btn" type="button" aria-label="hint"><span class="aisth-hint-bulb" aria-hidden="true">!</span><span>hint</span></button>` : ""}
      <div style="font-size:13px; color:#7e3106; font-weight:900; margin-bottom:6px;">${escapeHtml(translateHint)}</div>
      ${translateAnswerHtml}
      <div id="feedback" class="feedback"></div>
    </div>

    <div class="btn-row" id="actions-wrap" style="display:none;">
      <button class="quiz-btn" id="submit-btn" type="button">${escapeHtml(TEXT.SUBMIT)}</button>
      <button class="quiz-btn" id="next-btn" type="button">Skip</button>
    </div>
  `;

  wireWordClicks();

  const submitBtn = document.getElementById("submit-btn");
  const hintBtn = document.getElementById("hint-btn");
  const nextBtn = document.getElementById("next-btn");
  if (submitBtn) submitBtn.addEventListener("click", submitCurrentAnswer);
  if (hintBtn) {
    hintBtn.addEventListener("click", () => {
      const slotInputControl = ensureKoreanSlotInput(q);
      revealFirstSlotPlaceholder(slotInputControl?.control, q.answerKo);
      hintBtn.disabled = true;
    });
  }
  if (nextBtn) nextBtn.addEventListener("click", goNext);
}

function renderClickableSentence(text, q) {
  const parts = stripEmphasisMarkers(normalizeEscapedBreaks(String(text || "")))
    .split(/\s+/)
    .filter(Boolean);
  let tokenIndex = 0;

  return parts.map((part) => {
    const isVerb = q?.verbWordNorm && normalizeToken(part) === q.verbWordNorm;
    const html = `<span class="word-token${isVerb ? " is-verb" : ""}" data-token-index="${tokenIndex}">${renderTokenWithVerbSuffixHighlight(part)}</span>`;
    tokenIndex += 1;
    return html;
  }).join("");
}

function renderTokenWithVerbSuffixHighlight(part) {
  const raw = String(part ?? "");
  const m = raw.match(/^([^A-Za-z]*)([A-Za-z]+)([^A-Za-z]*)$/);
  if (!m) return escapeHtml(raw);

  const lead = m[1] || "";
  const word = m[2] || "";
  const trail = m[3] || "";
  if (!shouldHighlightVerbSuffix(word)) return escapeHtml(raw);

  return `${escapeHtml(lead)}${escapeHtml(word.slice(0, -1))}<span class="focus-token">${escapeHtml(word.slice(-1))}</span>${escapeHtml(trail)}`;
}

function shouldHighlightVerbSuffix(word) {
  return L14_S_SUFFIX_VERBS.has(String(word || "").toLowerCase());
}

function getTranslatePrompt(qNumber) {
  return L14_TRANSLATE_PROMPT_BY_QNUMBER[qNumber] || "선택한 단어의 뜻";
}

function renderTranslatePromptWithVerbHighlight(prompt) {
  const raw = String(prompt || "");
  const commaIndex = raw.indexOf(",");
  const before = commaIndex >= 0 ? raw.slice(0, commaIndex) : raw;
  const after = commaIndex >= 0 ? raw.slice(commaIndex) : "";
  const m = before.match(/^(.*\s)(\S+)$/);
  if (!m) return `<span class="l14-verb-highlight">${escapeHtml(before)}</span>${escapeHtml(after)}`;
  return `${escapeHtml(m[1])}<span class="l14-verb-highlight">${escapeHtml(m[2])}</span>${escapeHtml(after)}`;
}

function wireWordClicks() {
  const q = questions[currentIndex];
  document.querySelectorAll(".word-token").forEach((el) => {
    el.addEventListener("click", () => {
      if (!q || isCurrentLocked || selectedWordOk) return;

      const raw = String(el.textContent || "").trim();
      const norm = normalizeToken(raw);

      if (!norm) return;

      if (norm === q.answerWordNorm) {
        selectedWordOk = true;
        selectedWordText = raw;
        selectedWordIndex = Number(el.dataset.tokenIndex || -1);
        refreshWordHighlight();

        const wrap = document.getElementById("translate-wrap");
        if (wrap) wrap.style.display = "block";
        const sentence = document.getElementById("clickable-sentence");
        if (sentence) sentence.classList.add("is-step-2");
        const actionsWrap = document.getElementById("actions-wrap");
        if (actionsWrap) actionsWrap.style.display = "flex";

        const input = document.getElementById("user-ko");
        const slotInputControl = ensureKoreanSlotInput(q);
        if (slotInputControl) slotInputControl.focus();
        else if (input) input.focus();

        showToast("ok", TEXT.CORRECT);
      } else {
        el.classList.add("miss");
        setTimeout(() => el.classList.remove("miss"), 220);
        showToast("no", TEXT.WRONG);
      }
    });
  });
}

function ensureKoreanSlotInput(q) {
  const input = document.getElementById("user-ko");
  if (!input || !window.AisthInputSlots) return null;
  return window.AisthInputSlots.enhance(input, {
    modelText: q?.answerKo || "",
    placeholderText: q?.no === 1 ? q?.answerKo || "" : "",
    onEnter: submitCurrentAnswer,
  });
}

function revealFirstSlotPlaceholder(control, modelText) {
  if (!control) return;
  const firstChar = Array.from(String(modelText || "").replace(/\s+/g, ""))[0] || "";
  if (!firstChar) return;
  control.classList.remove("is-full-hint");
  control.classList.add("has-revealed-hint");
  control.dataset.placeholderChars = firstChar;
  const flowInput = control.querySelector(".aisth-slot-input");
  if (flowInput) flowInput.dispatchEvent(new Event("input", { bubbles: true }));
}

function refreshWordHighlight() {
  document.querySelectorAll(".word-token").forEach((el) => {
    const idx = Number(el.dataset.tokenIndex || -1);
    el.classList.toggle("hit", selectedWordOk && idx === selectedWordIndex);
  });
}

function submitCurrentAnswer() {
  if (isCurrentLocked) return;

  const q = questions[currentIndex];
  const feedback = document.getElementById("feedback");
  const submitBtn = document.getElementById("submit-btn");
  const nextBtn = document.getElementById("next-btn");
  const input = document.getElementById("user-ko");

  if (!q) return;

  if (!selectedWordOk) {
    showToast("no", TEXT.PICK_WORD_FIRST);
    return;
  }

  const userKo = String(input?.value || "").trim();

  if (q.answerKo) {
    if (!userKo) {
      showToast("no", TEXT.INPUT_REQUIRED);
      return;
    }

    const koOk = normalizeKorean(userKo) === q.answerKoNorm;
    if (!koOk) {
      if (feedback) {
        feedback.className = "feedback";
        feedback.innerHTML = "";
      }
      showToast("no", TEXT.WRONG);
      return;
    }
  }

  isCurrentLocked = true;
  if (input) input.disabled = true;
  if (window.AisthInputSlots) window.AisthInputSlots.setDisabled(input, true);
  if (submitBtn) submitBtn.disabled = true;
  scheduleAutoNext();
  if (feedback) {
    feedback.className = "feedback";
    feedback.innerHTML = "";
  }

  const shownAnswer = q.answerKo ? `${q.answerWord}, ${q.answerKo}` : q.answerWord;
  const shownSelected = q.answerKo
    ? `${stripTokenPunct(selectedWordText)}${userKo ? `, ${userKo}` : ""}`
    : stripTokenPunct(selectedWordText);

  results.push({
    no: currentIndex + 1,
    qNumber: q.qNumber,
    question: q.question,
    selected: shownSelected,
    answer: shownAnswer,
    instruction: FIXED_INSTRUCTION,
    correct: true,
  });

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

function normalizeToken(value) {
  return stripTokenPunct(value).toLowerCase();
}

function stripTokenPunct(value) {
  return String(value ?? "")
    .trim()
    .replace(/^[^A-Za-z0-9가-힣]+/g, "")
    .replace(/[^A-Za-z0-9가-힣]+$/g, "");
}

function normalizeKorean(value) {
  return stripEmphasisMarkers(String(value ?? ""))
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.?!~]+$/g, "")
    .trim();
}

function normalizeEscapedBreaks(value) {
  return String(value ?? "")
    .replaceAll("\\r\\n", "\n")
    .replaceAll("\\n", "\n")
    .replaceAll("\\r", "\n")
    .replace(/\\+\n/g, "\n");
}

function stripEmphasisMarkers(value) {
  return String(value ?? "").replace(/\*\*(.*?)\*\*/gs, "$1");
}

function clipExample(s) {
  const oneLine = stripEmphasisMarkers(normalizeEscapedBreaks(String(s ?? ""))).replace(/\s+/g, " ").trim();
  if (!oneLine) return "";
  return oneLine.length > 28 ? oneLine.slice(0, 28) + "..." : oneLine;
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
    const answerShown = q.answerKo ? `${q.answerWord}, ${q.answerKo}` : q.answerWord;

    return `
      <div class="result-item">
        <div><b>Q${idx + 1}</b> ${escapeHtml(stripEmphasisMarkers(q.question))}</div>
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


