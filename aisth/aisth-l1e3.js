// aisth-l1e3.js
// Independent runtime for Aisth Lesson 1 Exercise 3

const TARGET_LESSON = 1;
const TARGET_EXERCISE = 3;
const PAGE_LABEL = "Aisth L1-E3";
const MAX_QUESTIONS = 0; // 0 = unlimited

const DEFAULT_REWRITE_INSTRUCTION = "영어스러운 표현을 자연스럽게 바꿔보세요.";
const DEFAULT_BLANK_INSTRUCTION = "빈칸에 알맞은 단어를 넣어보세요.";
const DEFAULT_SCRAMBLE_INSTRUCTION = "단어를 순서대로 놓아 문장을 완성해보세요.";

const ANSWER_KOREAN_VERB_MAP = {
  drink: "마신다",
  goes: "간다",
  study: "공부한다",
  eat: "먹는다",
  runs: "달린다",
  watch: "본다",
  sings: "부른다",
  look: "보여",
  keep: "유지한다",
  makes: "만들어 준다",
};

const L1E3_ROWS = [
  {
    Title: "Do는 ‘~한다’",
    Lesson: TARGET_LESSON,
    Exercise: TARGET_EXERCISE,
    QuestionNumber: 1,
    Instruction: DEFAULT_BLANK_INSTRUCTION,
    Question: "I usually ___ coffee in the morning.\\n\\n(나는 아침에 보통 커피를 마신다.)",
    Answer: "drink",
  },
  {
    Title: "Do는 ‘~한다’",
    Lesson: TARGET_LESSON,
    Exercise: TARGET_EXERCISE,
    QuestionNumber: 2,
    Instruction: DEFAULT_BLANK_INSTRUCTION,
    Question: "She ___ to school every day.\\n\\n(그녀는 매일 학교에 간다.)",
    Answer: "goes",
  },
  {
    Title: "Do는 ‘~한다’",
    Lesson: TARGET_LESSON,
    Exercise: TARGET_EXERCISE,
    QuestionNumber: 3,
    Instruction: DEFAULT_BLANK_INSTRUCTION,
    Question: "They ___ English at home.\\n\\n(그들은 집에서 영어를 공부한다.)",
    Answer: "study",
  },
  {
    Title: "Do는 ‘~한다’",
    Lesson: TARGET_LESSON,
    Exercise: TARGET_EXERCISE,
    QuestionNumber: 4,
    Instruction: DEFAULT_BLANK_INSTRUCTION,
    Question: "We ___ dinner together every night.\\n\\n(우리는 매일 밤 함께 저녁을 먹는다.)",
    Answer: "eat",
  },
  {
    Title: "Do는 ‘~한다’",
    Lesson: TARGET_LESSON,
    Exercise: TARGET_EXERCISE,
    QuestionNumber: 5,
    Instruction: DEFAULT_BLANK_INSTRUCTION,
    Question: "He ___ very fast.\\n\\n(그는 매우 빨리 달린다.)",
    Answer: "runs",
  },
  {
    Title: "Do는 ‘~한다’",
    Lesson: TARGET_LESSON,
    Exercise: TARGET_EXERCISE,
    QuestionNumber: 6,
    Instruction: DEFAULT_BLANK_INSTRUCTION,
    Question: "I ___ the TV after work.\\n\\n(나는 퇴근 후에 TV를 본다.)",
    Answer: "watch",
  },
  {
    Title: "Do는 ‘~한다’",
    Lesson: TARGET_LESSON,
    Exercise: TARGET_EXERCISE,
    QuestionNumber: 7,
    Instruction: DEFAULT_BLANK_INSTRUCTION,
    Question: "She ___ a song in the shower.\\n\\n(그녀는 샤워 중에 노래를 부른다.)",
    Answer: "sings",
  },
  {
    Title: "Do는 ‘~한다’",
    Lesson: TARGET_LESSON,
    Exercise: TARGET_EXERCISE,
    QuestionNumber: 8,
    Instruction: DEFAULT_BLANK_INSTRUCTION,
    Question: "You ___ so happy today.\\n\\n(너 오늘 정말 행복해 보여.)",
    Answer: "look",
  },
  {
    Title: "Do는 ‘~한다’",
    Lesson: TARGET_LESSON,
    Exercise: TARGET_EXERCISE,
    QuestionNumber: 9,
    Instruction: DEFAULT_BLANK_INSTRUCTION,
    Question: "They ___ the room clean.\\n\\n(그들은 방을 깨끗하게 유지한다.)",
    Answer: "keep",
  },
  {
    Title: "Do는 ‘~한다’",
    Lesson: TARGET_LESSON,
    Exercise: TARGET_EXERCISE,
    QuestionNumber: 10,
    Instruction: DEFAULT_BLANK_INSTRUCTION,
    Question: "My mom ___ me a sandwich every morning.\\n\\n(엄마는 매일 아침 내게 샌드위치를 만들어 준다.)",
    Answer: "makes",
  },
  {
    Title: "Do는 ‘~한다’",
    Lesson: TARGET_LESSON,
    Exercise: TARGET_EXERCISE,
    QuestionNumber: 21,
    Instruction: DEFAULT_SCRAMBLE_INSTRUCTION,
    Question: "나는 학교에(to) 간다.",
    Answer: "I go to school.",
  },
  {
    Title: "Do는 ‘~한다’",
    Lesson: TARGET_LESSON,
    Exercise: TARGET_EXERCISE,
    QuestionNumber: 22,
    Instruction: DEFAULT_SCRAMBLE_INSTRUCTION,
    Question: "너는 TV를 본다.",
    Answer: "You watch TV.",
  },
  {
    Title: "Do는 ‘~한다’",
    Lesson: TARGET_LESSON,
    Exercise: TARGET_EXERCISE,
    QuestionNumber: 23,
    Instruction: DEFAULT_SCRAMBLE_INSTRUCTION,
    Question: "아이들은 웃는다.",
    Answer: "The children laugh.",
  },
  {
    Title: "Do는 ‘~한다’",
    Lesson: TARGET_LESSON,
    Exercise: TARGET_EXERCISE,
    QuestionNumber: 24,
    Instruction: DEFAULT_SCRAMBLE_INSTRUCTION,
    Question: "그는 게임을 한다.",
    Answer: "He plays a game.",
  },
  {
    Title: "Do는 ‘~한다’",
    Lesson: TARGET_LESSON,
    Exercise: TARGET_EXERCISE,
    QuestionNumber: 25,
    Instruction: DEFAULT_SCRAMBLE_INSTRUCTION,
    Question: "우리는 점심을 먹는다.",
    Answer: "We eat lunch.",
  },
  {
    Title: "Do는 ‘~한다’",
    Lesson: TARGET_LESSON,
    Exercise: TARGET_EXERCISE,
    QuestionNumber: 26,
    Instruction: DEFAULT_SCRAMBLE_INSTRUCTION,
    Question: "강아지는 짖는다.",
    Answer: "The dog barks.",
  },
  {
    Title: "Do는 ‘~한다’",
    Lesson: TARGET_LESSON,
    Exercise: TARGET_EXERCISE,
    QuestionNumber: 27,
    Instruction: DEFAULT_SCRAMBLE_INSTRUCTION,
    Question: "나는 책을 읽는다.",
    Answer: "I read a book.",
  },
  {
    Title: "Do는 ‘~한다’",
    Lesson: TARGET_LESSON,
    Exercise: TARGET_EXERCISE,
    QuestionNumber: 28,
    Instruction: DEFAULT_SCRAMBLE_INSTRUCTION,
    Question: "그녀는 물을 마신다.",
    Answer: "She drinks water.",
  },
  {
    Title: "Do는 ‘~한다’",
    Lesson: TARGET_LESSON,
    Exercise: TARGET_EXERCISE,
    QuestionNumber: 29,
    Instruction: DEFAULT_SCRAMBLE_INSTRUCTION,
    Question: "우리는 축구를 한다.",
    Answer: "We play soccer.",
  },
  {
    Title: "Do는 ‘~한다’",
    Lesson: TARGET_LESSON,
    Exercise: TARGET_EXERCISE,
    QuestionNumber: 30,
    Instruction: DEFAULT_SCRAMBLE_INSTRUCTION,
    Question: "그는 영어를 말한다.",
    Answer: "He speaks English.",
  },
];

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
let day = "003";
let quizTitle = "quiz_Grammar_aisth_l1e3";
let userId = "";

let rawRows = [];
let questions = [];
let currentIndex = 0;
let results = [];
let isCurrentLocked = false;
let rewritePlaceholderExample = "";
let blankPlaceholderExample = "";
let autoNextTimer = 0;

window.addEventListener("DOMContentLoaded", () => {
  injectRuntimeStyles();

  if (window.HermaToastFX) {
    window.HermaToastFX.init({ hostId: "cafe_int", top: 10 });
  }

  applyQueryParams();
  wireBackButton();
  wirePopupEvents();
  installFrameQuestionNavigator();

  rawRows = L1E3_ROWS.map((row) => ({ ...row }));
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

    #quiz-area .l13-prompt-surface {
      display: block !important;
      text-align: center !important;
      white-space: normal !important;
    }

    .l13-prompt-lines {
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

    .l13-en-line {
      color: #203736;
      font-size: 18px;
      line-height: 1.45;
      font-weight: 950;
      word-break: keep-all;
    }

    .l13-ko-line {
      color: #6d5b50;
      font-size: 12.5px;
      line-height: 1.45;
      font-weight: 850;
      word-break: keep-all;
    }

    .l13-ko-line.is-primary {
      color: #203736;
      font-size: 16px;
      font-weight: 950;
    }

    .l13-ko-verb {
      display: inline;
      background: var(--aisth-role-v-bg, #fff4cc);
      border-radius: 6px;
      padding: 0 3px;
      box-shadow: inset 0 0 0 1px rgba(200, 138, 18, 0.24), 0 0 10px var(--aisth-role-v-glow, rgba(216,162,27,.30));
      color: var(--aisth-role-v-text, #7a4a00);
      font-weight: 950;
    }

    #quiz-area .l13-prompt-surface .aisth-sentence-flow {
      display: inline !important;
      width: auto !important;
      max-width: 100% !important;
      white-space: normal !important;
    }

    .l13-answer-box {
      background: #fff !important;
      padding: 12px 10px !important;
      position: relative;
      text-align: center;
    }

    .l13-type-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 48px;
      height: 22px;
      padding: 0 10px;
      margin: 0 auto 4px;
      border-radius: 999px;
      background: linear-gradient(180deg, #6553d7 0%, #3c56c9 100%);
      color: #f2f4ff;
      font-size: 11px;
      font-weight: 950;
      letter-spacing: 0;
      box-shadow: 0 4px 10px rgba(65, 75, 191, 0.22);
      animation: l13TypeBounce 1.04s cubic-bezier(.2,.82,.26,1) infinite;
    }

    @keyframes l13TypeBounce {
      0%, 100% {
        transform: translateY(0);
      }
      45% {
        transform: translateY(-6px);
      }
    }

    #quiz-area .l13-answer-box .aisth-slot-control {
      justify-content: center;
      gap: 8px 7px;
      padding: 8px 0 4px;
    }

    #quiz-area .l13-answer-box .aisth-slot-shell {
      min-height: 38px;
      gap: 3px;
    }

    #quiz-area .l13-answer-box .aisth-slot-cell {
      width: 24px;
      height: 36px;
      border-color: rgba(102, 126, 214, 0.62);
      border-bottom-color: rgba(77, 87, 170, 0.78);
      background: linear-gradient(180deg, #fbfcff 0%, #edf1ff 56%, #dfe7ff 100%);
      color: #24305f;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.9),
        0 3px 8px rgba(58, 70, 152, 0.10);
      font-size: 17px;
      border-radius: 6px 6px 4px 4px;
    }

    #quiz-area .l13-answer-box .aisth-slot-cell.is-filled {
      border-color: rgba(95, 112, 214, 0.74);
      border-bottom-color: rgba(68, 76, 170, 0.92);
      background: linear-gradient(180deg, #f7f9ff 0%, #e8edff 100%);
    }

    #quiz-area .l13-answer-box .aisth-slot-cell.is-placeholder {
      color: rgba(80, 86, 108, 0.24);
      border-color: rgba(142, 151, 188, 0.30);
      border-bottom-color: rgba(112, 119, 156, 0.38);
      background: linear-gradient(180deg, rgba(250,251,255,0.76) 0%, rgba(235,239,250,0.50) 100%);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.78);
    }

    #quiz-area .l13-answer-box.is-full-hint .aisth-slot-cell.is-placeholder {
      color: transparent;
      text-shadow: none;
      animation: l13PlaceholderTap 1.8s ease-in-out infinite;
      animation-delay: var(--l13-placeholder-delay, 0s);
    }

    @keyframes l13PlaceholderTap {
      0%, 12% {
        color: transparent;
        text-shadow: none;
      }
      24%, 70% {
        color: rgba(80, 86, 108, 0.28);
        text-shadow: 0 1px 0 rgba(255,255,255,0.72);
      }
      100% {
        color: rgba(80, 86, 108, 0.18);
        text-shadow: none;
      }
    }

    #quiz-area .l13-answer-box .aisth-slot-control:focus-within .aisth-slot-cell.is-active {
      border-color: rgba(90, 137, 244, 0.92);
      border-bottom-color: #4f6ee9;
      background: #f7faff;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.95),
        0 0 0 2px rgba(93, 132, 255, 0.16),
        0 6px 13px rgba(63, 87, 190, 0.18);
    }

    #quiz-area .l13-answer-box .aisth-slot-cell.is-slot-correct {
      border-color: rgba(47, 170, 98, 0.86);
      border-bottom-color: #219653;
      background: linear-gradient(180deg, #f7fff9 0%, #dff7e8 100%);
      color: #145d33;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.92),
        0 0 0 2px rgba(43, 184, 101, 0.16),
        0 0 12px rgba(43, 184, 101, 0.30);
    }

    #quiz-area .l13-answer-box .aisth-slot-cell.is-slot-wrong {
      border-color: rgba(220, 63, 75, 0.90);
      border-bottom-color: #c72b39;
      background: linear-gradient(180deg, #fff8f9 0%, #ffe1e5 100%);
      color: #9d1f2d;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.9),
        0 0 0 2px rgba(220, 63, 75, 0.14),
        0 0 12px rgba(220, 63, 75, 0.28);
    }

    #quiz-area .l13-answer-box .aisth-slot-cell.is-suffix-highlight {
      border-color: rgba(136, 84, 208, 0.76);
      border-bottom-color: #6c3ac7;
      background: rgba(136, 84, 208, 0.16);
      color: #6c3ac7;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.78),
        inset 0 0 0 1px rgba(136, 84, 208, 0.24),
        0 0 12px rgba(136, 84, 208, 0.30);
    }

    #quiz-area .l13-answer-box .aisth-slot-cell.is-suffix-highlight.is-placeholder {
      color: rgba(108, 58, 199, 0.28);
      background: rgba(136, 84, 208, 0.12);
    }

    #quiz-area .l13-answer-box .aisth-slot-cell.is-suffix-highlight.is-slot-correct {
      color: #6c3ac7;
      border-color: rgba(136, 84, 208, 0.82);
      border-bottom-color: #6c3ac7;
      background: rgba(136, 84, 208, 0.18);
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.78),
        inset 0 0 0 1px rgba(136, 84, 208, 0.28),
        0 0 13px rgba(136, 84, 208, 0.34);
    }

    #quiz-area .l13-answer-box .aisth-slot-cell.is-suffix-highlight.is-slot-wrong {
      border-color: rgba(220, 63, 75, 0.90);
      border-bottom-color: #c72b39;
      background: linear-gradient(180deg, #fff8f9 0%, #ffe1e5 100%);
      color: #9d1f2d;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.9),
        0 0 0 2px rgba(220, 63, 75, 0.14),
        0 0 12px rgba(220, 63, 75, 0.28);
    }

    .l13-scramble-box {
      padding: 13px 10px 14px !important;
    }

    .l13-scramble-prompt {
      display: flex;
      min-height: 100%;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      position: relative;
    }

    .l13-scramble-ko-hint {
      color: #6d5b50;
      font-size: 12px;
      line-height: 1.35;
      font-weight: 850;
      word-break: keep-all;
    }

    .l13-drag-pill {
      position: absolute;
      left: 50%;
      top: calc(100% - 10px);
      z-index: 4;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 21px;
      padding: 0 10px;
      border-radius: 999px;
      background: linear-gradient(180deg, #6553d7 0%, #3c56c9 100%);
      color: #f2f4ff;
      font-size: 10.5px;
      font-weight: 950;
      pointer-events: none;
      box-shadow: 0 5px 12px rgba(65, 75, 191, 0.24);
      animation: l13DragPillMove 1.72s cubic-bezier(.2,.82,.26,1) infinite;
    }

    @keyframes l13DragPillMove {
      0%, 12% {
        opacity: 0;
        transform: translate(-50%, -34px) scale(0.94);
      }
      24% {
        opacity: 1;
        transform: translate(-50%, -22px) scale(1);
      }
      68% {
        opacity: 1;
        transform: translate(-50%, 56px) scale(1);
      }
      88%, 100% {
        opacity: 0;
        transform: translate(-50%, 64px) scale(0.94);
      }
    }

    .l13-scramble-bank {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 7px;
      min-height: 36px;
      padding: 1px 4px 2px;
    }

    .l13-word-chip,
    .l13-word-slot {
      appearance: none;
      border: 0;
      font-family: inherit;
      font-weight: 950;
      letter-spacing: 0;
      user-select: none;
      touch-action: manipulation;
    }

    .l13-word-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 32px;
      padding: 6px 12px;
      border-radius: 999px;
      color: #202a61;
      background: linear-gradient(180deg, #ffffff 0%, #eef2ff 52%, #dce5ff 100%);
      border: 1px solid rgba(91, 112, 210, 0.72);
      border-bottom-color: rgba(60, 70, 166, 0.92);
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.92),
        inset 0 0 0 1px rgba(255,255,255,0.54),
        0 4px 10px rgba(58, 70, 152, 0.18);
      cursor: grab;
      transition: transform 150ms ease, box-shadow 150ms ease, filter 150ms ease;
    }

    .l13-word-chip.is-verb {
      color: var(--aisth-role-v-text, #7a4a00);
      background: linear-gradient(180deg, #fffdf4 0%, var(--aisth-role-v-bg, #fff4cc) 54%, #f5d88d 100%);
      border-color: var(--aisth-role-v-border, #c88a12);
      border-bottom-color: #9f6810;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.9),
        inset 0 0 0 1px rgba(216, 162, 27, 0.18),
        0 0 13px var(--aisth-role-v-glow, rgba(216,162,27,.30));
    }

    .l13-word-chip:active {
      cursor: grabbing;
      transform: translateY(1px) scale(0.985);
      box-shadow:
        inset 0 2px 4px rgba(42, 54, 128, 0.12),
        0 2px 5px rgba(58, 70, 152, 0.10);
    }

    .l13-word-chip.is-used {
      display: none;
      pointer-events: none;
    }

    .l13-scramble-slots {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px 7px;
      min-height: 44px;
      padding: 4px 0;
    }

    .l13-word-slot {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 54px;
      min-height: 38px;
      padding: 5px 10px;
      border-radius: 7px 7px 5px 5px;
      border: 1px dashed rgba(102, 126, 214, 0.70);
      border-bottom-color: rgba(77, 87, 170, 0.84);
      color: rgba(55, 63, 128, 0.36);
      background: linear-gradient(180deg, #fbfcff 0%, #edf1ff 56%, #dfe7ff 100%);
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.9),
        0 3px 8px rgba(58, 70, 152, 0.10);
      cursor: pointer;
      transition: border-color 150ms ease, background 150ms ease, color 150ms ease, box-shadow 150ms ease;
    }

    .l13-word-slot::before {
      content: "";
      width: 18px;
      height: 2px;
      border-radius: 99px;
      background: rgba(102, 126, 214, 0.32);
    }

    .l13-word-slot.is-filled::before {
      content: none;
    }

    .l13-word-slot.is-placeholder {
      color: rgba(80, 86, 108, 0.24);
      border-color: rgba(142, 151, 188, 0.34);
      border-bottom-color: rgba(112, 119, 156, 0.42);
      background: linear-gradient(180deg, rgba(250,251,255,0.80) 0%, rgba(235,239,250,0.54) 100%);
      animation: l13ScramblePlaceholder 1.9s ease-in-out infinite;
      animation-delay: var(--l13-placeholder-delay, 0s);
    }

    .l13-word-slot.is-placeholder::before {
      content: none;
    }

    @keyframes l13ScramblePlaceholder {
      0%, 16% {
        color: transparent;
      }
      30%, 72% {
        color: rgba(80, 86, 108, 0.30);
      }
      100% {
        color: rgba(80, 86, 108, 0.18);
      }
    }

    .l13-word-slot.is-verb-target {
      border-color: rgba(200, 138, 18, 0.62);
      border-bottom-color: rgba(122, 74, 0, 0.80);
      background: rgba(255, 244, 204, 0.72);
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.78),
        inset 0 0 0 1px rgba(200, 138, 18, 0.18),
        0 0 10px var(--aisth-role-v-glow, rgba(216,162,27,.30));
    }

    .l13-word-slot.is-over {
      border-style: solid;
      border-color: rgba(90, 137, 244, 0.92);
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.95),
        0 0 0 2px rgba(93, 132, 255, 0.16),
        0 6px 13px rgba(63, 87, 190, 0.16);
    }

    .l13-word-slot.is-filled {
      border-style: solid;
      color: #24305f;
      border-color: rgba(102, 126, 214, 0.62);
      border-bottom-color: rgba(77, 87, 170, 0.78);
    }

    .l13-word-slot.is-correct {
      border-color: rgba(47, 170, 98, 0.86);
      border-bottom-color: #219653;
      background: linear-gradient(180deg, #f7fff9 0%, #dff7e8 100%);
      color: #145d33;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.92),
        0 0 0 2px rgba(43, 184, 101, 0.16),
        0 0 12px rgba(43, 184, 101, 0.30);
    }

    .l13-word-slot.is-wrong {
      border-color: rgba(220, 63, 75, 0.88);
      border-bottom-color: #c72b39;
      background: linear-gradient(180deg, #fff8f9 0%, #ffe1e5 100%);
      color: #9d1f2d;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.9),
        0 0 0 2px rgba(220, 63, 75, 0.12);
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

function buildQuestionsFromRows() {
  let filtered = rawRows
    .filter((r) => Number(r["Lesson"]) === TARGET_LESSON && Number(r["Exercise"]) === TARGET_EXERCISE)
    .sort((a, b) => getRowQuestionNumber(a) - getRowQuestionNumber(b));

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
    const title = normalizeEscapedBreaks(String(row["Title"] ?? "").trim());
    const qNumber = getRowQuestionNumber(row, idx + 1);
    const type = qNumber >= 21 ? "scramble" : detectType(question);

    const fallbackInst = type === "blank"
      ? DEFAULT_BLANK_INSTRUCTION
      : type === "scramble"
        ? DEFAULT_SCRAMBLE_INSTRUCTION
        : DEFAULT_REWRITE_INSTRUCTION;
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

function deriveInstructionModeByType(rows) {
  const bucket = { rewrite: new Map(), blank: new Map(), scramble: new Map() };

  rows.forEach((row) => {
    const question = normalizeEscapedBreaks(String(row["Question"] ?? "").trim());
    const answer = stripEmphasisMarkers(normalizeEscapedBreaks(String(row["Answer"] ?? "").trim()));
    const instruction = normalizeEscapedBreaks(String(row["Instruction"] ?? "").trim());
    const qNumber = getRowQuestionNumber(row);
    const type = qNumber >= 21 ? "scramble" : detectType(question);

    if (!instruction) return;
    if (isInstructionLeakingAnswer(instruction, answer, type)) return;

    const m = bucket[type];
    m.set(instruction, (m.get(instruction) || 0) + 1);
  });

  return {
    rewrite: pickTopKey(bucket.rewrite),
    blank: pickTopKey(bucket.blank),
    scramble: pickTopKey(bucket.scramble),
  };
}

function getRowQuestionNumber(row, fallback = 0) {
  return Number(row?.["QNumber"] || row?.["QuestionNumber"]) || fallback;
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

function buildL13Chip(text, variant, role) {
  const variantClass = variant === "ko" ? " is-ko" : " is-en";
  const roleClass = role === "verb" ? " is-verb-role" : "";
  return `<span class="lip-word-chip-demo${variantClass}${roleClass}">${escapeHtml(text)}</span>`;
}

function buildL13Step1ExampleHtml() {
  return `
    <div class="lip-example-stack">
      <div class="lip-example-line">
        ${buildL13Chip("Do", "en", "verb")}
        <span class="lip-example-symbol">=</span>
        ${buildL13Chip("\uD55C\uB2E4", "ko", "verb")}
      </div>
    </div>
  `;
}

function buildL13Step2ExampleHtml() {
  const items = ["drink", "walk", "study", "smile"];
  const chips = items
    .map((item, index) => (
      `
        <div class="lip-morph-chip is-verb-role" style="--lip-delay:${(index * 0.22).toFixed(2)}s;">
          <span class="lip-morph-word is-from">Do</span>
          <span class="lip-morph-word is-to">${escapeHtml(item)}</span>
        </div>
      `
    ))
    .join("");

  return `
    <div class="lip-morph-grid">
      ${chips}
    </div>
  `;
}

function buildL13Step3ExampleHtml() {
  return `
    <div class="lip-fill-demo">
      <span class="lip-sentence-link">\uB098\uB294 \uC74C\uB8CC\uC218\uB97C</span>
      <span class="lip-fill-slot is-verb-role">
        <span class="lip-fill-word">drink</span>
      </span>
    </div>
  `;
}

function buildIntroPlayerConfig() {
  const firstQuestion = questions[0] || null;

  return {
    pageLabel: PAGE_LABEL,
    title: stripEmphasisMarkers(firstQuestion?.title || "Do = '~\uB97C \uD55C\uB2E4'"),
    nextLabel: "\uB2E4\uC74C",
    primaryLabel: TEXT.START,
    onPrimary: startQuiz,
    steps: [
      {
        title: "Do\uB294 '~\uB97C \uD55C\uB2E4' \uC5D0\uC694. \uBCF4\uD1B5 '\uB3D9\uC0ACverb'\uB77C\uACE0 \uBD80\uB985\uB2C8\uB2E4",
        exampleHtml: buildL13Step1ExampleHtml(),
      },
      {
        title: "Do\uB3C4 Be\uCC98\uB7FC, \uBCC0\uD615\uC2DC\uCF1C\uC11C \uC501\uB2C8\uB2E4",
        exampleHtml: buildL13Step2ExampleHtml(),
      },
      {
        title: "\uC6B0\uB9AC\uAC00 \uC678\uC6CC\uC628 \uB2E8\uC5B4, \uADF8\uB300\uB85C \uC368\uBCF4\uC544\uC694!",
        exampleHtml: buildL13Step3ExampleHtml(),
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

function publishFrameDebugList() {
  if (!window.AisthFrameLoader || typeof window.AisthFrameLoader.setQuestionDebugList !== "function") return;

  window.AisthFrameLoader.setQuestionDebugList(questions.map((q) => ({
    no: q.no,
    question: q.question,
    answer: q.answer,
  })), {
    label: PAGE_LABEL,
    source: "local",
    title: "aisth-l1e3.js",
  });
}

function installFrameQuestionNavigator() {
  window.AisthQuestionNavigator = {
    goTo: goToQuestionIndex,
  };

  window.addEventListener("aisth:question-jump", (ev) => {
    goToQuestionIndex(ev?.detail?.index);
  });
}

function goToQuestionIndex(index) {
  const nextIndex = Number(index);
  if (!Number.isInteger(nextIndex) || nextIndex < 0 || nextIndex >= questions.length) return false;

  if (autoNextTimer) {
    window.clearTimeout(autoNextTimer);
    autoNextTimer = 0;
  }

  isCurrentLocked = false;
  currentIndex = nextIndex;
  renderQuestion();
  return true;
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
  if (autoNextTimer) {
    window.clearTimeout(autoNextTimer);
    autoNextTimer = 0;
  }

  if (q.type === "scramble") {
    renderScrambleQuestion(area, q);
    return;
  }

  const qBody = renderQuestionPrompt(q);
  const inputHtml = `<input id="user-answer" class="short-input l13-slot-source-input" type="text" autocomplete="off" inputmode="latin" lang="en" autocapitalize="none" spellcheck="false" />`;

  area.innerHTML = `
    <div class="q-label">Q. ${currentIndex + 1} / ${questions.length}</div>

    <div class="box">
      <div class="question-instruction">${renderTextWithEmphasis(q.instruction || TEXT.INPUT_HINT_FALLBACK)}</div>
      <div class="sentence aisth-question-surface aisth-question-center l13-prompt-surface">${qBody}</div>
    </div>

    <div class="box l13-answer-box aisth-letter-answer-box${q.no === 1 ? " is-full-hint" : ""}">
      <div class="l13-type-pill">type!</div>
      ${inputHtml}
      <div id="feedback" class="feedback"></div>
    </div>
  `;

  const input = document.getElementById("user-answer");
  const placeholderText = buildSlotPlaceholderText(q);
  const slotInputControl = input && window.AisthInputSlots
    ? window.AisthInputSlots.enhance(input, { modelText: q.answer, placeholderText, onEnter: () => updateSlotAnswerState(q, input, slotInputControl?.control) })
    : null;

  if (input) {
    if (slotInputControl) {
      applyPlaceholderAnimationDelays(slotInputControl.control);
      input.addEventListener("input", () => updateSlotAnswerState(q, input, slotInputControl.control));
      updateSlotAnswerState(q, input, slotInputControl.control);
      slotInputControl.focus();
    } else {
      input.focus();
      input.addEventListener("input", () => {
        const ok = isAnswerCorrect(q.type, input.value, q.answer);
        if (ok) completeCurrentAnswer(q, input.value, input);
      });
    }
  }
}

function renderScrambleQuestion(area, q) {
  q.scrambleState = buildScrambleState(q);
  const qBody = renderScramblePrompt(q);

  area.innerHTML = `
    <div class="q-label">Q. ${currentIndex + 1} / ${questions.length}</div>

    <div class="box">
      <div class="question-instruction">${renderTextWithEmphasis(q.instruction || DEFAULT_SCRAMBLE_INSTRUCTION)}</div>
      <div class="sentence aisth-question-surface aisth-question-center l13-prompt-surface">${qBody}</div>
    </div>

    <div class="box l13-answer-box l13-scramble-box">
      <div class="l13-scramble-slots" id="l13-scramble-slots"></div>
      <div id="feedback" class="feedback"></div>
    </div>
  `;

  refreshScrambleUI(q);
}

function renderScramblePrompt(q) {
  return `
    <div class="l13-scramble-prompt">
      <div class="l13-scramble-ko-hint">${renderKoreanPromptLine(q.question, q)}</div>
      <div class="l13-drag-pill">drag!</div>
      <div class="l13-scramble-bank" id="l13-scramble-bank"></div>
    </div>
  `;
}

function buildScrambleState(q) {
  const answerWords = splitAnswerWords(q.answer);
  const verbIndex = getScrambleVerbIndex(answerWords);
  const words = answerWords.map((text, idx) => ({
    id: `q${q.no}-w${idx}`,
    text,
    answerIndex: idx,
    role: idx === verbIndex ? "verb" : "",
  }));

  return {
    words,
    verbIndex,
    showPlaceholder: q.no === 11,
    bankOrder: buildScrambleBankOrder(words),
    slots: Array.from({ length: words.length }, () => null),
  };
}

function buildScrambleBankOrder(words) {
  if (words.length <= 1) return words.map((w) => w.id);
  if (words.length === 2) return [words[1].id, words[0].id];
  return words.slice(1).concat(words[0]).map((w) => w.id);
}

function splitAnswerWords(answerRaw) {
  const text = pickSlotModelText(answerRaw);
  return text.split(/\s+/).map((word) => word.trim()).filter(Boolean);
}

function getScrambleVerbIndex(words) {
  if (!Array.isArray(words) || words.length <= 1) return 0;
  const first = String(words[0] || "").toLowerCase();
  if (first === "the" && words.length >= 3) return 2;
  return 1;
}

function refreshScrambleUI(q) {
  const state = q.scrambleState;
  const bank = document.getElementById("l13-scramble-bank");
  const slots = document.getElementById("l13-scramble-slots");
  if (!state || !bank || !slots) return;

  const usedIds = new Set(state.slots.filter(Boolean).map((word) => word.id));
  const orderedWords = state.bankOrder.map((id) => state.words.find((word) => word.id === id)).filter(Boolean);

  bank.innerHTML = orderedWords.map((word) => {
    const usedClass = usedIds.has(word.id) ? " is-used" : "";
    const roleClass = word.role === "verb" ? " is-verb" : "";
    return `<button type="button" class="l13-word-chip${roleClass}${usedClass}" draggable="true" data-word-id="${escapeHtml(word.id)}">${escapeHtml(word.text)}</button>`;
  }).join("");

  slots.innerHTML = state.slots.map((word, idx) => {
    const filledClass = word ? " is-filled" : "";
    const targetClass = idx === state.verbIndex ? " is-verb-target" : "";
    const resultClass = word
      ? (word.answerIndex === idx ? " is-correct" : " is-wrong")
      : "";
    const placeholder = !word && state.showPlaceholder ? state.words[idx]?.text || "" : "";
    const placeholderClass = placeholder ? " is-placeholder" : "";
    const label = word ? escapeHtml(word.text) : escapeHtml(placeholder);
    const delay = placeholder ? ` style="--l13-placeholder-delay:${(idx * 0.14).toFixed(2)}s;"` : "";
    return `<button type="button" class="l13-word-slot${targetClass}${filledClass}${placeholderClass}${resultClass}" data-slot-index="${idx}" aria-label="${escapeHtml(`slot ${idx + 1}`)}"${delay}>${label}</button>`;
  }).join("");

  wireScrambleEvents(q);
  maybeCompleteScramble(q);
}

function wireScrambleEvents(q) {
  const bank = document.getElementById("l13-scramble-bank");
  const slots = document.getElementById("l13-scramble-slots");
  if (!bank || !slots) return;

  Array.from(bank.querySelectorAll(".l13-word-chip")).forEach((chip) => {
    chip.addEventListener("dragstart", (ev) => {
      ev.dataTransfer.setData("text/plain", chip.dataset.wordId || "");
      ev.dataTransfer.effectAllowed = "move";
    });

    chip.addEventListener("click", () => {
      placeWordInFirstEmptySlot(q, chip.dataset.wordId);
    });
  });

  Array.from(slots.querySelectorAll(".l13-word-slot")).forEach((slot) => {
    slot.addEventListener("dragover", (ev) => {
      ev.preventDefault();
      slot.classList.add("is-over");
      ev.dataTransfer.dropEffect = "move";
    });

    slot.addEventListener("dragleave", () => {
      slot.classList.remove("is-over");
    });

    slot.addEventListener("drop", (ev) => {
      ev.preventDefault();
      slot.classList.remove("is-over");
      placeScrambleWord(q, ev.dataTransfer.getData("text/plain"), Number(slot.dataset.slotIndex));
    });

    slot.addEventListener("click", () => {
      returnScrambleSlot(q, Number(slot.dataset.slotIndex));
    });
  });
}

function placeWordInFirstEmptySlot(q, wordId) {
  const state = q.scrambleState;
  if (!state || isCurrentLocked) return;
  const emptyIndex = state.slots.findIndex((word) => !word);
  if (emptyIndex < 0) return;
  placeScrambleWord(q, wordId, emptyIndex);
}

function placeScrambleWord(q, wordId, slotIndex) {
  const state = q.scrambleState;
  if (!state || isCurrentLocked) return;

  const targetIndex = Number(slotIndex);
  if (!Number.isInteger(targetIndex) || targetIndex < 0 || targetIndex >= state.slots.length) return;

  const word = state.words.find((item) => item.id === wordId);
  if (!word) return;

  const previousIndex = state.slots.findIndex((item) => item && item.id === word.id);
  if (previousIndex >= 0) state.slots[previousIndex] = null;
  state.slots[targetIndex] = word;
  refreshScrambleUI(q);
}

function returnScrambleSlot(q, slotIndex) {
  const state = q.scrambleState;
  if (!state || isCurrentLocked) return;

  const targetIndex = Number(slotIndex);
  if (!Number.isInteger(targetIndex) || targetIndex < 0 || targetIndex >= state.slots.length) return;
  if (!state.slots[targetIndex]) return;

  state.slots[targetIndex] = null;
  refreshScrambleUI(q);
}

function maybeCompleteScramble(q) {
  const state = q.scrambleState;
  if (!state || isCurrentLocked) return;
  if (!isScrambleSolved(state)) return;

  const selected = state.slots.map((word) => word.text).join(" ");
  window.setTimeout(() => {
    if (!isCurrentLocked && isScrambleSolved(state)) completeCurrentAnswer(q, selected, null);
  }, 220);
}

function isScrambleSolved(state) {
  if (!state || !state.slots.length || state.slots.some((word) => !word)) return false;
  return state.slots.every((word, idx) => word.answerIndex === idx);
}

function renderQuestionPrompt(q) {
  const parts = splitQuestionPrompt(q.question);
  const enHtml = parts.en
    ? `<div class="l13-en-line"><span class="aisth-sentence-flow">${renderPromptLine(parts.en)}</span></div>`
    : "";
  const koHtml = parts.ko
    ? `<div class="l13-ko-line${parts.en ? "" : " is-primary"}">${renderKoreanPromptLine(parts.ko, q)}</div>`
    : "";

  return `
        <div class="l13-prompt-lines">
          ${enHtml}
          ${koHtml}
        </div>
      `;
}

function splitQuestionPrompt(raw) {
  const lines = normalizeEscapedBreaks(String(raw ?? ""))
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length >= 2) {
    return {
      en: lines[0],
      ko: lines.slice(1).join(" "),
    };
  }

  const only = lines[0] || "";
  if (/[A-Za-z]/.test(only) || only.includes("___")) {
    return { en: only, ko: "" };
  }

  return { en: "", ko: only };
}

function renderPromptLine(line) {
  return renderTextWithEmphasis(line).replace(/_{2,}/g, (m) => `<span class="blank-slot">${m}</span>`);
}

function renderKoreanPromptLine(line, q) {
  const text = String(line ?? "");
  const phrase = findKoreanVerbPhrase(text, q);
  if (!phrase) return escapeHtml(text);

  const idx = text.lastIndexOf(phrase);
  if (idx < 0) return escapeHtml(text);

  return `${escapeHtml(text.slice(0, idx))}<span class="l13-ko-verb">${escapeHtml(phrase)}</span>${escapeHtml(text.slice(idx + phrase.length))}`;
}

function findKoreanVerbPhrase(line, q) {
  const answerKey = pickSlotModelText(q?.answer).toLowerCase();
  const mapped = ANSWER_KOREAN_VERB_MAP[answerKey];
  if (mapped && String(line ?? "").includes(mapped)) return mapped;

  const match = String(line ?? "").match(/([가-힣]+)(?=[.)!?]*\s*$)/);
  return match ? match[1].trim() : "";
}

function buildSlotPlaceholderText(q) {
  const modelText = pickSlotModelText(q?.answer);
  if (!modelText) return "";
  if (q?.no === 1) return modelText;

  const firstChar = Array.from(modelText.replace(/\s+/g, ""))[0] || "";
  return firstChar;
}

function applyPlaceholderAnimationDelays(control) {
  if (!control) return;
  Array.from(control.querySelectorAll(".aisth-slot-cell")).forEach((cell, idx) => {
    cell.style.setProperty("--l13-placeholder-delay", `${(idx * 0.16).toFixed(2)}s`);
  });
}

function updateSlotAnswerState(q, sourceInput, control) {
  if (!q || !sourceInput || !control || isCurrentLocked) return;

  const modelText = pickSlotModelText(q.answer);
  const modelChars = getAnswerChars(modelText);
  const userChars = getAnswerChars(sourceInput.value);
  const cells = Array.from(control.querySelectorAll(".aisth-slot-cell"));
  const suffixIndices = getVerbSuffixIndices(modelText);
  let allCorrect = modelChars.length > 0 && userChars.length >= modelChars.length;

  cells.forEach((cell, idx) => {
    const userChar = userChars[idx] || "";
    const modelChar = modelChars[idx] || "";
    const isFilled = Boolean(userChar);
    const ok = isFilled && compareSlotChar(userChar, modelChar);

    cell.classList.toggle("is-slot-correct", ok);
    cell.classList.toggle("is-slot-wrong", isFilled && !ok);
    cell.classList.toggle("is-suffix-highlight", suffixIndices.has(idx));
    if (!ok) allCorrect = false;
  });

  if (allCorrect) {
    completeCurrentAnswer(q, sourceInput.value || modelText, sourceInput);
  }
}

function compareSlotChar(userChar, modelChar) {
  return String(userChar || "").toLowerCase() === String(modelChar || "").toLowerCase();
}

function getAnswerChars(value) {
  return Array.from(String(value ?? "").replace(/\s+/g, ""));
}

function getVerbSuffixIndices(modelText) {
  const chars = getAnswerChars(modelText);
  const lower = chars.join("").toLowerCase();
  const indices = new Set();
  if (hasThirdPersonEsEnding(lower)) {
    indices.add(chars.length - 2);
    indices.add(chars.length - 1);
  } else if (lower.endsWith("s")) {
    indices.add(chars.length - 1);
  }
  return indices;
}

function hasThirdPersonEsEnding(lower) {
  if (!String(lower || "").endsWith("es")) return false;
  const stem = String(lower).slice(0, -2);
  return /(?:s|x|z|ch|sh|o)$/.test(stem);
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

function completeCurrentAnswer(q, userRaw, input) {
  if (isCurrentLocked || !q) return;

  isCurrentLocked = true;
  if (input) {
    input.disabled = true;
    if (window.AisthInputSlots) window.AisthInputSlots.setDisabled(input, true);
  }

  results.push({
    no: currentIndex + 1,
    qNumber: q.qNumber,
    type: q.type,
    question: q.question,
    selected: String(userRaw || "").trim(),
    answer: q.answer,
    instruction: q.instruction,
    correct: true,
  });

  const feedback = document.getElementById("feedback");
  if (feedback) {
    feedback.className = "feedback";
    feedback.innerHTML = "";
  }

  storeLatestResultSnapshot();
  showToast("ok", TEXT.CORRECT);

  const solvedIndex = currentIndex;
  autoNextTimer = window.setTimeout(() => {
    autoNextTimer = 0;
    if (currentIndex === solvedIndex) goNext();
  }, 620);
}

function submitCurrentAnswer() {
  if (isCurrentLocked) return;

  const q = questions[currentIndex];
  const input = document.getElementById("user-answer");
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

  completeCurrentAnswer(q, userRaw, input);
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







