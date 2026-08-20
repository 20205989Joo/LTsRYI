// aisth-l1e1.js
// Independent runtime for Aisth Lesson 1 Exercise 1

const TARGET_LESSON = 1;
const TARGET_EXERCISE = 1;
const PAGE_LABEL = "Aisth L1-E1";
const MAX_QUESTIONS = 0; // 0 = unlimited
const MAX_PAIR_QUESTIONS = 20;

const L1E1_ROWS = [
    {
        "QNumber":  "1",
        "Question":  "나는 슬픔이다",
        "Instruction":  "영어스러운 표현을 자연스럽게 바꿔보세요.",
        "Answer":  "나는 슬프다",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "2",
        "Question":  "I ___ sad.",
        "Instruction":  "빈칸에 알맞은 be동사를 넣어보세요.",
        "Answer":  "am",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "3",
        "Question":  "너는 피곤함이다",
        "Instruction":  "영어스러운 표현을 자연스럽게 바꿔보세요.",
        "Answer":  "너는 피곤하다",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "4",
        "Question":  "You ___ tired.",
        "Instruction":  "빈칸에 알맞은 be동사를 넣어보세요.",
        "Answer":  "are",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "5",
        "Question":  "그는 배고픔이다",
        "Instruction":  "영어스러운 표현을 자연스럽게 바꿔보세요.",
        "Answer":  "그는 배고프다",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "6",
        "Question":  "He ___ hungry.",
        "Instruction":  "빈칸에 알맞은 be동사를 넣어보세요.",
        "Answer":  "is",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "7",
        "Question":  "우리는 기쁨이다",
        "Instruction":  "영어스러운 표현을 자연스럽게 바꿔보세요.",
        "Answer":  "우리는 기쁘다",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "8",
        "Question":  "We ___ happy.",
        "Instruction":  "빈칸에 알맞은 be동사를 넣어보세요.",
        "Answer":  "are",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "9",
        "Question":  "내 이름은 민수이다",
        "Instruction":  "영어스러운 표현을 자연스럽게 바꿔보세요.",
        "Answer":  "내 이름은 민수다",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "10",
        "Question":  "My name ___ Minsu.",
        "Instruction":  "빈칸에 알맞은 be동사를 넣어보세요.",
        "Answer":  "is",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "11",
        "Question":  "이 책은 여기이다",
        "Instruction":  "영어스러운 표현을 자연스럽게 바꿔보세요.",
        "Answer":  "이 책은 여기에 있다",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "12",
        "Question":  "The book ___ here.",
        "Instruction":  "빈칸에 알맞은 be동사를 넣어보세요.",
        "Answer":  "is",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "13",
        "Question":  "그녀는 선생님이다",
        "Instruction":  "영어스러운 표현을 자연스럽게 바꿔보세요.",
        "Answer":  "그녀는 선생님이다",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "14",
        "Question":  "She ___ a teacher.",
        "Instruction":  "빈칸에 알맞은 be동사를 넣어보세요.",
        "Answer":  "is",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "15",
        "Question":  "날씨는 추움이다",
        "Instruction":  "영어스러운 표현을 자연스럽게 바꿔보세요.",
        "Answer":  "날씨는 춥다",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "16",
        "Question":  "It ___ cold.",
        "Instruction":  "빈칸에 알맞은 be동사를 넣어보세요.",
        "Answer":  "is",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "17",
        "Question":  "나는 무서움이다",
        "Instruction":  "영어스러운 표현을 자연스럽게 바꿔보세요.",
        "Answer":  "나는 무섭다",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "18",
        "Question":  "I ___ scared.",
        "Instruction":  "빈칸에 알맞은 be동사를 넣어보세요.",
        "Answer":  "am",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "19",
        "Question":  "방들은 깨끗함이다",
        "Instruction":  "영어스러운 표현을 자연스럽게 바꿔보세요.",
        "Answer":  "방들은 깨끗하다",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "20",
        "Question":  "The rooms ___ clean.",
        "Instruction":  "빈칸에 알맞은 be동사를 넣어보세요.",
        "Answer":  "are",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "21",
        "Question":  "너희는 준비됨이다",
        "Instruction":  "너희는 준비됐다",
        "Answer":  "너희는 준비됐다",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "22",
        "Question":  "You ___ ready.",
        "Instruction":  "빈칸에 알맞은 be동사를 넣어보세요.",
        "Answer":  "are",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "23",
        "Question":  "그들은 멋짐이다",
        "Instruction":  "영어스러운 표현을 자연스럽게 바꿔보세요.",
        "Answer":  "그들은 멋지다",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "24",
        "Question":  "They ___ cool.",
        "Instruction":  "빈칸에 알맞은 be동사를 넣어보세요.",
        "Answer":  "are",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "25",
        "Question":  "그녀는 친절함이다",
        "Instruction":  "영어스러운 표현을 자연스럽게 바꿔보세요.",
        "Answer":  "그녀는 친절하다",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "26",
        "Question":  "She ___ kind.",
        "Instruction":  "빈칸에 알맞은 be동사를 넣어보세요.",
        "Answer":  "is",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "27",
        "Question":  "나는 학생이다",
        "Instruction":  "영어스러운 표현을 자연스럽게 바꿔보세요.",
        "Answer":  "나는 학생이다",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "28",
        "Question":  "I ___ a student.",
        "Instruction":  "빈칸에 알맞은 be동사를 넣어보세요.",
        "Answer":  "am",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "29",
        "Question":  "그는 의사이다",
        "Instruction":  "영어스러운 표현을 자연스럽게 바꿔보세요.",
        "Answer":  "그는 의사이다",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "30",
        "Question":  "He ___ a doctor.",
        "Instruction":  "빈칸에 알맞은 be동사를 넣어보세요.",
        "Answer":  "is",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "31",
        "Question":  "우리는 가족이다",
        "Instruction":  "우리는 가족이다",
        "Answer":  "우리는 가족이다",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "32",
        "Question":  "We ___ family.",
        "Instruction":  "빈칸에 알맞은 be동사를 넣어보세요.",
        "Answer":  "are",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "33",
        "Question":  "오늘은 월요일이다",
        "Instruction":  "영어스러운 표현을 자연스럽게 바꿔보세요.",
        "Answer":  "오늘은 월요일이다",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "34",
        "Question":  "Today ___ Monday.",
        "Instruction":  "빈칸에 알맞은 be동사를 넣어보세요.",
        "Answer":  "is",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "35",
        "Question":  "나는 집에 있음이다",
        "Instruction":  "영어스러운 표현을 자연스럽게 바꿔보세요.",
        "Answer":  "나는 집에 있다",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "36",
        "Question":  "I ___ at home.",
        "Instruction":  "빈칸에 알맞은 be동사를 넣어보세요.",
        "Answer":  "am",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "37",
        "Question":  "고양이들은 귀여움이다",
        "Instruction":  "영어스러운 표현을 자연스럽게 바꿔보세요.",
        "Answer":  "고양이들은 귀엽다",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "38",
        "Question":  "The cats ___ cute.",
        "Instruction":  "빈칸에 알맞은 be동사를 넣어보세요.",
        "Answer":  "are",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "39",
        "Question":  "사과들은 빨강이다",
        "Instruction":  "영어스러운 표현을 자연스럽게 바꿔보세요.",
        "Answer":  "사과들은 빨갛다",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    },
    {
        "QNumber":  "40",
        "Question":  "The apples ___ red.",
        "Instruction":  "빈칸에 알맞은 be동사를 넣어보세요.",
        "Answer":  "are",
        "Exercise":  "1",
        "ClauseRole":  "",
        "KoreanHint":  "",
        "Title":  "Be = ‘이다’, 근데…",
        "RevisionNote":  "",
        "Lesson":  "1"
    }
];

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
let day = "001";
let quizTitle = "quiz_Grammar_aisth_l1e1";
let userId = "";

let rawRows = [];
let questions = [];
let currentIndex = 0;
let results = [];
let isCurrentLocked = false;
let rewritePlaceholderExample = "";
let blankPlaceholderExample = "";

window.addEventListener("DOMContentLoaded", () => {
  injectRuntimeStyles();

  if (window.HermaToastFX) {
    window.HermaToastFX.init({ hostId: "cafe_int", top: 10 });
  }

  applyQueryParams();
  wireBackButton();
  wirePopupEvents();
  installFrameQuestionNavigator();

  rawRows = L1E1_ROWS.map((row) => ({ ...row }));
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

    .pair-stack {
      display: grid;
      gap: 0;
    }

    .pair-stack.is-step2 {
      gap: 0;
    }

    .pair-ko-stage {
      display: grid;
      gap: 10px;
      max-height: 240px;
      overflow: hidden;
      transition: max-height 0.42s ease, gap 0.34s ease;
    }

    .pair-ko-stage.is-solved {
      gap: 0;
      opacity: 0;
      transform: translateY(-22px);
      max-height: 0;
      pointer-events: none;
    }

    .pair-ko-stage.is-morphing {
      gap: 0;
      max-height: 330px;
      pointer-events: auto;
    }

    .pair-ko-stage.is-gone {
      display: none;
    }

    .pair-source {
      text-align: center;
      font-size: 20px;
      font-weight: 950;
      min-height: 82px;
      display: flex;
      align-items: center;
      justify-content: center;
      max-height: 112px;
      overflow: hidden;
      transition: opacity 0.32s ease, transform 0.32s ease, max-height 0.38s ease, padding 0.38s ease, margin 0.38s ease, border-color 0.26s ease, border-width 0.38s ease, background 0.24s ease, box-shadow 0.24s ease;
    }

    .pair-answer-box {
      background: #fff;
      border: 1.5px solid rgba(126, 49, 6, 0.26);
      border-radius: 12px;
      padding: 14px 12px;
      text-align: center;
      max-height: 120px;
      overflow: hidden;
      box-sizing: border-box;
      transition: opacity 0.32s ease, transform 0.32s ease, max-height 0.38s ease, padding 0.38s ease, margin 0.38s ease, border-color 0.26s ease, border-width 0.38s ease;
    }

    .pair-ko-stage.is-morphing .pair-source {
      opacity: 0;
      transform: translateY(-24px);
      pointer-events: none;
    }

    .pair-ko-stage.is-solved .pair-source,
    .pair-ko-stage.is-solved .pair-answer-box {
      opacity: 0;
      transform: translateY(-24px);
      min-height: 0 !important;
      height: 0 !important;
      max-height: 0 !important;
      margin-top: 0 !important;
      margin-bottom: 0 !important;
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      border-color: transparent !important;
      border-width: 0 !important;
      pointer-events: none;
    }

    .pair-answer-box.is-plain {
      min-height: 62px;
      max-height: 92px;
      padding: 16px 12px 18px;
      background: #fff;
      border-color: rgba(126, 49, 6, 0.26) !important;
      border-width: 1.5px !important;
      box-shadow: 0 7px 14px rgba(126, 49, 6, 0.06);
      transform: translateY(0);
    }

    .pair-answer-box.is-plain.is-lifting {
      margin-top: calc(-1 * var(--pair-source-lift, 0px));
      transform: translateY(0);
    }

    .pair-answer-box.is-expanded {
      max-height: 320px;
      padding: 16px 12px 14px;
    }

    .pair-ko-plain-line {
      text-align: center;
      font-size: 23px;
      font-weight: 950;
      color: #1f1a16;
      line-height: 1.24;
      opacity: 0;
      transform: translateY(8px);
    }

    .pair-answer-box.is-plain.is-in .pair-ko-plain-line {
      opacity: 1;
      transform: translateY(0);
      transition: opacity 0.18s ease, transform 0.28s cubic-bezier(.2,.75,.24,1);
    }

    .pair-ko-complete {
      min-height: 44px;
      max-height: 70px;
      opacity: 0;
      overflow: hidden;
      text-align: center;
      font-size: 23px;
      font-weight: 950;
      color: #1f1a16;
      transform: translateY(18px);
      margin: 4px auto 14px;
      padding: 8px 0 10px;
    }

    .pair-ko-complete.is-in {
      opacity: 1;
      animation: pairKoSlideUp 0.48s cubic-bezier(.2,.75,.24,1) both;
    }

    @keyframes pairKoSlideUp {
      from {
        opacity: 0;
        transform: translateY(18px);
      }
      to {
        opacity: 1;
        transform: translateY(-4px);
      }
    }

    .pair-en-rest {
      max-height: 0;
      opacity: 0;
      overflow: hidden;
      transform: translateY(10px);
      margin-top: 0;
      transition: max-height 0.42s ease 0.12s, opacity 0.28s ease 0.16s, transform 0.32s ease 0.16s, margin-top 0.28s ease;
    }

    .pair-answer-box.is-expanded .pair-en-rest {
      max-height: 190px;
      opacity: 1;
      transform: translateY(0);
      margin-top: 12px;
    }

    .pair-card {
      background: #fff;
      border: 1.5px solid rgba(126, 49, 6, 0.26);
      border-radius: 12px;
      padding: 14px 12px;
      text-align: center;
      overflow: hidden;
    }

    .pair-card-title {
      font-size: 13px;
      font-weight: 950;
      color: #7e3106;
      margin: 0 0 12px;
      padding: 8px 0;
      border-top: 1px solid rgba(126, 49, 6, 0.15);
      border-bottom: 1px solid rgba(126, 49, 6, 0.15);
    }

    .pair-ko-source {
      display: block;
      margin-bottom: 10px;
      font-size: 16px;
      font-weight: 900;
      color: #3c2d22;
      line-height: 1.45;
    }

    .pair-ko-template {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 6px;
      font-size: 23px;
      font-weight: 950;
      line-height: 1.4;
    }

    .pair-fixed {
      display: inline-flex;
      align-items: center;
      min-height: 40px;
      color: #1f1a16;
    }

    .pair-fixed-subject {
      margin-right: -2px;
    }

    .pair-pass-button {
      min-height: 42px;
      padding: 9px 16px;
      border-radius: 9px;
      border: 1.5px solid rgba(241, 123, 42, 0.42);
      border-bottom: 3px solid rgba(241, 123, 42, 0.68);
      background: linear-gradient(180deg, #fffaf4 0%, #ffe9d6 100%);
      color: #7e3106;
      font-size: 17px;
      font-weight: 950;
      cursor: pointer;
      box-shadow: 0 5px 10px rgba(126, 49, 6, 0.10);
    }

    .pair-pass-button:active {
      transform: translateY(1px);
      border-bottom-width: 2px;
    }

    .pair-pass-sentence {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 0;
      width: auto;
      padding: 9px 12px;
      border: 0;
      border-radius: 8px;
      background: transparent;
      color: #1f1a16;
      font-size: 23px;
      font-weight: 950;
      line-height: 1.35;
      cursor: pointer;
      box-shadow: none;
      animation: pairPassHum 1.8s ease-in-out infinite;
    }

    .pair-pass-sentence:active {
      transform: translateY(1px) scale(0.99);
      animation-play-state: paused;
    }

    .pair-pass-sentence:disabled {
      cursor: not-allowed;
      opacity: 0.72;
      animation-play-state: paused;
    }

    .pair-tap-pill {
      position: absolute;
      top: -17px;
      left: 50%;
      transform: translateX(-50%);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 40px;
      height: 22px;
      padding: 0 9px;
      border-radius: 999px;
      background: #145a68;
      color: #dcfbff;
      font-size: 11px;
      font-weight: 950;
      letter-spacing: 0;
      box-shadow: 0 3px 7px rgba(20, 90, 104, 0.22);
      animation: pairTapBounce 1.05s cubic-bezier(.2,.8,.28,1) infinite;
      pointer-events: none;
    }

    @keyframes pairPassHum {
      0%, 100% {
        transform: translateY(0) scale(1);
        text-shadow: 0 0 0 rgba(241,123,42,0);
      }
      50% {
        transform: translateY(-1px) scale(1.018);
        text-shadow: 0 0 9px rgba(241,123,42,0.22);
      }
    }

    @keyframes pairTapBounce {
      0%, 100% {
        transform: translate(-50%, 0);
      }
      45% {
        transform: translate(-50%, -7px);
      }
    }

    .pair-ko-template .aisth-slot-control {
      width: auto;
      display: inline-flex;
      flex-wrap: nowrap;
      padding: 0;
      gap: 5px;
      vertical-align: middle;
    }

    .pair-ko-template .aisth-slot-cell {
      width: 32px;
      height: 42px;
      font-size: 19px;
    }

    .pair-en-question {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 8px;
      font-size: 22px;
      font-weight: 950;
      color: #1f1a16;
      line-height: 1.35;
    }

    .pair-en-question .aisth-slot-control {
      width: auto;
      display: inline-flex;
      flex-wrap: nowrap;
      padding: 0;
      gap: 4px;
      vertical-align: middle;
    }

    #quiz-area .pair-en-question .aisth-slot-cell {
      width: 30px;
      min-width: 30px;
      height: 42px;
      border-color: rgba(102, 126, 214, 0.62);
      border-bottom-color: rgba(77, 87, 170, 0.78);
      background: linear-gradient(180deg, #fbfcff 0%, #edf1ff 56%, #dfe7ff 100%);
      color: #24305f;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 3px 8px rgba(58, 70, 152, 0.10);
      font-size: 20px;
    }

    #quiz-area .pair-en-question .aisth-slot-cell.is-filled {
      border-color: rgba(95, 112, 214, 0.74);
      border-bottom-color: rgba(68, 76, 170, 0.92);
      background: linear-gradient(180deg, #f7f9ff 0%, #e8edff 100%);
    }

    #quiz-area .pair-en-question .aisth-slot-cell.is-placeholder {
      color: rgba(80, 86, 108, 0.24);
      border-color: rgba(142, 151, 188, 0.30);
      border-bottom-color: rgba(112, 119, 156, 0.38);
      background: linear-gradient(180deg, rgba(250,251,255,0.76) 0%, rgba(235,239,250,0.50) 100%);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.78);
    }

    #quiz-area .pair-en-question .aisth-slot-control:focus-within .aisth-slot-cell.is-active {
      border-color: rgba(90, 137, 244, 0.92);
      border-bottom-color: #4f6ee9;
      background: #f7faff;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.95), 0 0 0 2px rgba(93, 132, 255, 0.16), 0 6px 13px rgba(63, 87, 190, 0.18);
    }

    #quiz-area .pair-en-question .aisth-slot-cell.is-slot-correct {
      border-color: rgba(47, 170, 98, 0.86);
      border-bottom-color: #219653;
      background: linear-gradient(180deg, #f7fff9 0%, #dff7e8 100%);
      color: #145d33;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.92), 0 0 0 2px rgba(43, 184, 101, 0.16), 0 0 12px rgba(43, 184, 101, 0.30);
    }

    #quiz-area .pair-en-question .aisth-slot-cell.is-slot-wrong {
      border-color: rgba(220, 63, 75, 0.90);
      border-bottom-color: #c72b39;
      background: linear-gradient(180deg, #fff8f9 0%, #ffe1e5 100%);
      color: #9d1f2d;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 0 0 2px rgba(220, 63, 75, 0.14), 0 0 12px rgba(220, 63, 75, 0.28);
    }

    .pair-be-input {
      width: 76px;
      min-height: 42px;
      border: 1.5px solid rgba(217, 192, 167, 0.9);
      border-bottom: 3px solid #d9c0a7;
      border-radius: 9px 9px 5px 5px;
      background: rgba(255, 248, 228, 0.68);
      color: #3c2d22;
      font-size: 20px;
      font-weight: 950;
      text-align: center;
      outline: none;
      box-sizing: border-box;
    }

    .pair-be-input:focus {
      border-color: rgba(241, 123, 42, 0.72);
      border-bottom-color: #f17b2a;
      background: rgba(255, 247, 238, 0.94);
      box-shadow: 0 4px 10px rgba(241, 123, 42, 0.14);
    }

    .pair-en-hint {
      margin-top: 8px;
      font-size: 12px;
      font-weight: 800;
      color: #7e6b5d;
      line-height: 1.45;
    }

    .pair-ida-chip {
      font-size: 12px;
      padding: 1px 6px;
      vertical-align: baseline;
    }

    .focus-token {
      background: var(--aisth-role-v-bg, #fff4cc);
      border-radius: 6px;
      padding: 0 3px;
      box-shadow: inset 0 0 0 1px rgba(200, 138, 18, 0.24), 0 0 10px var(--aisth-role-v-glow, rgba(216,162,27,.30));
      color: var(--aisth-role-v-text, #7a4a00);
      font-weight: 900;
    }

    .focus-token.pair-subject-highlight {
      background: rgba(136, 84, 208, 0.16);
      box-shadow: inset 0 0 0 1px rgba(136, 84, 208, 0.24);
      color: #6c3ac7;
    }

    .focus-token.pair-subject-s {
      font-size: 1.22em;
      line-height: 1;
      padding: 0 4px;
      vertical-align: -0.03em;
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

function publishFrameDebugList() {
  if (!window.AisthLocalQuestionData || typeof window.AisthLocalQuestionData.publishDebugList !== "function") return;
  window.AisthLocalQuestionData.publishDebugList(questions, {
    label: PAGE_LABEL,
    source: "local-custom",
    title: "aisth-l1e1.js",
  });
}

function installFrameQuestionNavigator() {
  if (!window.AisthLocalQuestionData || typeof window.AisthLocalQuestionData.installNavigator !== "function") return;
  window.AisthLocalQuestionData.installNavigator({
    getLength: () => questions.length,
    goTo: (nextIndex) => {
      isCurrentLocked = false;
      currentIndex = nextIndex;
      renderQuestion();
    },
  });
}

function buildQuestionsFromRows() {
  const filtered = rawRows
    .filter((r) => Number(r["Lesson"]) === TARGET_LESSON && Number(r["Exercise"]) === TARGET_EXERCISE)
    .sort((a, b) => Number(a["QNumber"]) - Number(b["QNumber"]));

  const pairs = [];
  for (let i = 0; i < filtered.length - 1; i += 2) {
    const koRow = filtered[i];
    const enRow = filtered[i + 1];
    if (!koRow || !enRow) continue;
    pairs.push({ koRow, enRow });
  }

  const limit = MAX_QUESTIONS > 0 ? MAX_QUESTIONS : MAX_PAIR_QUESTIONS;
  const selectedPairs = pairs.slice(0, limit);

  const firstPair = selectedPairs[0] || null;
  rewritePlaceholderExample = clipExample(stripEmphasisMarkers(normalizeEscapedBreaks(String(firstPair?.koRow?.["Answer"] ?? ""))) || "example");
  blankPlaceholderExample = clipExample(stripEmphasisMarkers(normalizeEscapedBreaks(String(firstPair?.enRow?.["Answer"] ?? ""))) || "answer");

  questions = selectedPairs.map(({ koRow, enRow }, idx) => {
    const koQuestion = normalizeEscapedBreaks(String(koRow["Question"] ?? "").trim());
    const koAnswer = stripEmphasisMarkers(normalizeEscapedBreaks(String(koRow["Answer"] ?? "").trim()));
    const enQuestion = normalizeEscapedBreaks(String(enRow["Question"] ?? "").trim());
    const enAnswer = stripEmphasisMarkers(normalizeEscapedBreaks(String(enRow["Answer"] ?? "").trim()));
    const title = stripEmphasisMarkers(normalizeEscapedBreaks(String(koRow["Title"] || enRow["Title"] || "").trim()));
    const qNumber = idx + 1;
    const sourceQNumbers = [
      Number(koRow["QNumber"]) || idx * 2 + 1,
      Number(enRow["QNumber"]) || idx * 2 + 2,
    ];
    const koParts = splitKoreanBeAnswer(koAnswer);
    const koPassThrough = isKoreanPassThrough(koQuestion, koAnswer);
    const pairAnswer = `${koPassThrough ? koQuestion : koAnswer} / ${enAnswer}`;

    return {
      no: idx + 1,
      qNumber,
      sourceQNumbers,
      question: `${koQuestion}\n${enQuestion}`,
      answer: pairAnswer,
      instruction: DEFAULT_REWRITE_INSTRUCTION,
      title,
      type: "bePair",
      koQuestion,
      koAnswer,
      koParts,
      koPassThrough,
      enQuestion,
      enAnswer,
      enInstruction: normalizeEscapedBreaks(String(enRow["Instruction"] ?? "").trim()) || DEFAULT_BLANK_INSTRUCTION,
    };
  });
}

function isKoreanPassThrough(question, answer) {
  const q = stripEmphasisMarkers(normalizeEscapedBreaks(String(question ?? ""))).replace(/\s+/g, " ").trim();
  const a = stripEmphasisMarkers(normalizeEscapedBreaks(String(answer ?? ""))).replace(/\s+/g, " ").trim();
  if (!q || !a) return false;
  if (normalizeLoose(q, "rewrite") === normalizeLoose(a, "rewrite")) return true;

  const qCore = getKoreanCopulaCore(q);
  const aCore = getKoreanCopulaCore(a);
  return !!qCore && !!aCore && normalizeLoose(qCore, "rewrite") === normalizeLoose(aCore, "rewrite");
}

function getKoreanCopulaCore(value) {
  const text = String(value ?? "").trim();
  if (text.endsWith("이다")) return text.slice(0, -2).trim();
  if (text.endsWith("다")) return text.slice(0, -1).trim();
  return "";
}

function splitKoreanBeAnswer(answer) {
  const text = stripEmphasisMarkers(normalizeEscapedBreaks(String(answer ?? ""))).replace(/\s+/g, " ").trim();
  const match = text.match(/^(.+?)([은는])\s+(.+)$/);
  if (!match) {
    const body = text.endsWith("다") ? text.slice(0, -1).trim() : text;
    return { subject: "", particle: "는", body, ending: "다" };
  }

  const subject = match[1].trim();
  const particle = match[2];
  const predicate = match[3].trim();
  const body = predicate.endsWith("다") ? predicate.slice(0, -1).trim() : predicate;
  return { subject, particle, body, ending: "다" };
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

function buildL1IntroChip(text, variant, role) {
  const variantClass = variant === "ko" ? " is-ko" : " is-en";
  const roleClass = role === "verb" ? " is-verb-role" : "";
  return `<span class="lip-word-chip-demo${variantClass}${roleClass}">${escapeHtml(text)}</span>`;
}

function buildL1PurpleHighlight(text) {
  return `<span class="lip-inline-s">${escapeHtml(text)}</span>`;
}

function buildL1Step1ExampleHtml() {
  return `
    <div class="lip-example-stack">
      <div class="lip-example-line">
        ${buildL1IntroChip("be", "en", "verb")}
        <span class="lip-example-symbol">=</span>
        ${buildL1IntroChip("\uC774\uB2E4", "ko", "verb")}
      </div>
    </div>
  `;
}

function buildL1Step2ExampleHtml() {
  const items = [
    "Mina",
    "happy",
    "\uC606\uC9D1 \uAC15\uC544\uC9C0",
    "\uD589\uBCF5\uD574\uC11C\uC8FD\uB294\uC0C1\uD0DC",
  ];
  const rotatingItems = items
    .map((item, index) => (
      `<span class="lip-rotator-item" style="--lip-delay:${(index * 1.4).toFixed(1)}s;">${buildL1IntroChip(item, "en")}</span>`
    ))
    .join("");

  return `
    <div class="lip-rotator-demo">
      <div class="lip-rotator-prefix">
        ${buildL1IntroChip("be", "en", "verb")}
        <span class="lip-example-symbol">+</span>
      </div>
      <div class="lip-rotator-window">
        ${rotatingItems}
      </div>
    </div>
  `;
}

function buildL1Step3ExampleHtml() {
  return `
    <div class="lip-example-stack">
      <div class="lip-example-line">
        <span class="lip-sentence-link">\uB098\uB294 \uC2AC\uD514\uC774\uB2E4</span>
      </div>
      <div class="lip-example-line">
        <span class="lip-example-symbol">\u2192</span>
        <span class="lip-sentence-chip">\uB098\uB294 \uC2AC\uD504\uB2E4</span>
      </div>
    </div>
  `;
}

function buildL1Step4ExampleHtml() {
  return `
    <div class="lip-example-stack">
      <div class="lip-example-line">
        <span class="lip-sentence-link">I\uB294</span>
        ${buildL1IntroChip("am", "en", "verb")}
      </div>
      <div class="lip-example-line">
        <span class="lip-sentence-link">\uB2E8\uC218\uB294</span>
        <span class="lip-word-chip-demo is-en">i${buildL1PurpleHighlight("s")}</span>
      </div>
      <div class="lip-example-line">
        <span class="lip-sentence-link">${buildL1PurpleHighlight("\uBCF5\uC218")}\uB294</span>
        ${buildL1IntroChip("are", "en", "verb")}
      </div>
    </div>
  `;
}

function buildIntroPlayerConfig() {
  const firstQuestion = questions[0] || null;

  return {
    pageLabel: PAGE_LABEL,
    title: stripEmphasisMarkers(firstQuestion?.title || "Be = '\uC774\uB2E4', \uADFC\uB370..."),
    nextLabel: "\uB2E4\uC74C",
    primaryLabel: TEXT.START,
    onPrimary: startQuiz,
    steps: [
      {
        title: "be\uB294 '\uC774\uB2E4'\uC785\uB2C8\uB2E4.",
        exampleHtml: buildL1Step1ExampleHtml(),
      },
      {
        title: "'\uC774\uB2E4'\uB4A4\uC5D0\uB294 \uC774\uB984, \uB610\uB294 \uC0C1\uD0DC\uAC00 \uC635\uB2C8\uB2E4.",
        exampleHtml: buildL1Step2ExampleHtml(),
      },
      {
        title: "\uADF8\uB798\uC11C \uD55C\uAD6D\uB9D0\uB85C \uC4F0\uBA74, \uC774\uB7F0 \uB290\uB08C\uC774\uC5D0\uC694.",
        exampleHtml: buildL1Step3ExampleHtml(),
      },
      {
        title: "be\uB294 am, is, are\uB85C \uBC14\uAFD4\uC11C \uC501\uB2C8\uB2E4.",
        exampleHtml: buildL1Step4ExampleHtml(),
      },
      {
        title: "\uC774\uC81C \uC9C1\uC811 be\uB97C \uBC88\uC5ED\uD574\uBCF4\uC138\uC694!",
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

function renderQuestion() {
  const area = document.getElementById("quiz-area");
  if (!area) return;

  const q = questions[currentIndex];
  if (!q) {
    showResultPopup();
    return;
  }

  isCurrentLocked = false;

  if (q.type === "bePair") {
    renderBePairQuestion(area, q);
    return;
  }

  const qBody = renderTextWithEmphasis(q.question).replace(/_{2,}/g, (m) => `<span class="blank-slot">${m}</span>`);

  const placeholder = q.type === "blank"
    ? `${TEXT.PLACE_BLANK_PREFIX}${blankPlaceholderExample || "answer"})`
    : `${TEXT.PLACE_REWRITE_1} ${TEXT.PLACE_EX_PREFIX}${rewritePlaceholderExample || "example"})`;

  const inputHtml = q.type === "blank"
    ? `<input id="user-answer" class="short-input" type="text" autocomplete="off" placeholder="${escapeHtmlAttr(placeholder)}" />`
    : `<textarea id="user-answer" rows="3" placeholder="${escapeHtmlAttr(placeholder)}"></textarea>`;

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
      <button class="quiz-btn" id="submit-btn" type="button">제출</button>
      <button class="quiz-btn" id="next-btn" type="button">Skip</button>
    </div>
  `;

  const submitBtn = document.getElementById("submit-btn");
  const nextBtn = document.getElementById("next-btn");
  const input = document.getElementById("user-answer");
  const slotInputControl = input && window.AisthInputSlots
    ? window.AisthInputSlots.enhance(input, { modelText: q.answer, onEnter: submitCurrentAnswer })
    : null;
  if (submitBtn) submitBtn.addEventListener("click", submitCurrentAnswer);
  if (nextBtn) nextBtn.addEventListener("click", goNext);

  if (input) {
    if (slotInputControl) slotInputControl.focus();
    else input.focus();
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

function renderBePairQuestion(area, q) {
  const ko = q.koParts || splitKoreanBeAnswer(q.koAnswer);
  const enParts = splitBlankSentence(q.enQuestion);
  const hint = renderKoreanBeHint(q.koQuestion);
  const koInputHtml = q.koPassThrough
    ? `
              <button id="ko-pass-btn" class="pair-pass-sentence" type="button">
                <span class="pair-tap-pill">그대로!</span>
                <span>${escapeHtml(q.koQuestion)}</span>
              </button>
            `
    : renderKoreanAnswerTemplate(q, ko);
  q.pairStage = "ko";
  q.koSolved = "";

  area.innerHTML = `
    <div class="q-label">Q. ${currentIndex + 1} / ${questions.length}</div>

    <div class="box">
      <div class="question-instruction">${renderTextWithEmphasis(q.instruction || TEXT.INPUT_HINT_FALLBACK)}</div>
      <div class="pair-stack">
        <div class="pair-ko-stage" id="pair-ko-stage">
          <div class="sentence aisth-question-surface aisth-question-center pair-source">${escapeHtml(q.koQuestion)}</div>
          <div class="pair-answer-box" id="pair-answer-box">
            <div class="pair-ko-template" id="pair-ko-template">
              ${koInputHtml}
            </div>
            <div id="pair-en-rest" class="pair-en-rest" aria-hidden="true">
              <div class="pair-card-title">${escapeHtml(q.enInstruction || DEFAULT_BLANK_INSTRUCTION)}</div>
              <div class="pair-en-question">
                <span>${renderPairEnglishSubject(enParts.before)}</span>
                <input id="en-answer" class="pair-be-input" type="text" autocomplete="off" inputmode="text" lang="en" autocapitalize="none" spellcheck="false" placeholder="${escapeHtmlAttr(q.qNumber === 1 ? q.enAnswer : "")}" disabled />
                <span>${escapeHtml(enParts.after)}</span>
              </div>
              <div class="pair-en-hint">${hint}</div>
            </div>
          </div>
        </div>
      </div>
      <div id="feedback" class="feedback"></div>
    </div>

    <div class="btn-row">
      <button class="quiz-btn" id="submit-btn" type="button">제출</button>
      <button class="quiz-btn" id="next-btn" type="button">Skip</button>
    </div>
  `;

  const submitBtn = document.getElementById("submit-btn");
  const nextBtn = document.getElementById("next-btn");
  const bodyInputs = Array.from(document.querySelectorAll(".pair-ko-slot-input"));
  const enInput = document.getElementById("en-answer");
  const passBtn = document.getElementById("ko-pass-btn");

  const bodySlotControls = !q.koPassThrough && window.AisthInputSlots
    ? bodyInputs
        .map((input) => window.AisthInputSlots.enhance(input, {
          modelText: input.dataset.modelText || "",
          placeholderText: input.dataset.placeholder || "",
          onEnter: submitCurrentAnswer,
        }))
        .filter(Boolean)
    : [];
  const enSlotControl = enInput && window.AisthInputSlots
    ? window.AisthInputSlots.enhance(enInput, {
        modelText: q.enAnswer,
        placeholderText: q.qNumber === 1 ? q.enAnswer : "",
      })
    : null;
  if (enInput && window.AisthInputSlots) {
    window.AisthInputSlots.setDisabled(enInput, true);
    enInput.addEventListener("input", () => updateBePairEnglishSlots(q, enInput, enSlotControl?.control));
  }

  if (submitBtn) submitBtn.addEventListener("click", submitCurrentAnswer);
  if (nextBtn) nextBtn.addEventListener("click", goNext);
  if (passBtn) passBtn.addEventListener("click", submitCurrentAnswer);
  bodyInputs.forEach((input) => {
    if (!input) return;
    input.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") {
        ev.preventDefault();
        submitCurrentAnswer();
      }
    });
  });

  if (passBtn) passBtn.focus();
  else if (bodySlotControls[0]) bodySlotControls[0].focus();
  else if (bodyInputs[0]) bodyInputs[0].focus();
}

function renderKoreanAnswerTemplate(q, ko) {
  const bodyParts = buildKoreanBodyTemplateParts(ko.body);
  const bodyHtml = bodyParts.map((part, index) => {
    if (part.kind === "fixed") {
      return `<span class="pair-fixed">${escapeHtml(part.text)}</span>`;
    }

    const placeholder = q.qNumber === 1 ? part.text : "";
    return `
      <span class="pair-slot-source">
        <input class="short-input pair-ko-slot-input" type="text" autocomplete="off" inputmode="text" lang="ko" autocapitalize="none" spellcheck="false" data-model-text="${escapeHtmlAttr(part.text)}" data-placeholder="${escapeHtmlAttr(placeholder)}" />
      </span>
    `;
  }).join("");

  return `
              <span class="pair-fixed pair-fixed-subject">${escapeHtml(ko.subject + ko.particle)}</span>
              ${bodyHtml}
              <span class="pair-fixed">${escapeHtml(ko.ending)}</span>
            `;
}

function buildKoreanBodyTemplateParts(body) {
  const text = String(body ?? "").trim();
  const locativeMatch = text.match(/^(.+?)에\s*있$/);
  if (locativeMatch) {
    return [
      { kind: "slot", text: locativeMatch[1].trim() },
      { kind: "fixed", text: "에" },
      { kind: "slot", text: "있" },
    ];
  }

  return [{ kind: "slot", text }];
}

function splitBlankSentence(sentence) {
  const text = String(sentence ?? "");
  const match = text.match(/_{2,}/);
  if (!match) return { before: text, after: "" };
  return {
    before: text.slice(0, match.index).trimEnd(),
    after: text.slice(match.index + match[0].length).trimStart(),
  };
}

function renderPairEnglishSubject(value) {
  const raw = String(value ?? "");
  const leading = raw.match(/^\s*/)?.[0] || "";
  const trailing = raw.match(/\s*$/)?.[0] || "";
  const core = raw.trim();
  if (!core) return escapeHtml(raw);

  const renderedCore = renderPairEnglishSubjectCore(core);
  return `${escapeHtml(leading)}${renderedCore}${escapeHtml(trailing)}`;
}

function renderPairEnglishSubjectCore(subject) {
  const text = String(subject ?? "");
  const punctuation = text.match(/[.,!?;:]+$/)?.[0] || "";
  const core = punctuation ? text.slice(0, -punctuation.length) : text;
  const lower = core.toLowerCase();

  if (lower === "we" || lower === "they") {
    return `<span class="focus-token pair-subject-highlight">${escapeHtml(core)}</span>${escapeHtml(punctuation)}`;
  }

  if (!isPluralSubjectText(core)) return escapeHtml(text);

  const match = core.match(/([A-Za-z]+s)$/);
  if (!match) {
    return `<span class="focus-token pair-subject-highlight">${escapeHtml(core)}</span>${escapeHtml(punctuation)}`;
  }

  const word = match[1];
  if (/ss$/i.test(word)) return escapeHtml(text);

  const sIndex = match.index + word.length - 1;
  return `${escapeHtml(core.slice(0, sIndex))}<span class="focus-token pair-subject-highlight pair-subject-s">${escapeHtml(core.slice(sIndex, sIndex + 1))}</span>${escapeHtml(core.slice(sIndex + 1))}${escapeHtml(punctuation)}`;
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

  const contentWords = words.filter((word) => !determiners.has(word));
  const head = contentWords.length ? contentWords[contentWords.length - 1] : words[words.length - 1];
  if (!head) return false;
  if (irregularPluralNouns.has(head)) return true;
  if (singularSWords.has(head)) return false;

  return /^[a-z]+s$/i.test(head) && !/ss$/i.test(head);
}

function renderKoreanBeHint(value) {
  const text = escapeHtml(stripEmphasisMarkers(normalizeEscapedBreaks(String(value ?? ""))));
  return text.replaceAll("이다", `<span class="blank-slot pair-ida-chip">이다</span>`);
}

// Step transition pattern: morph the previous step's answer box into the next step's container,
// then expand its lower area. Keep this as the shared model for later multi-step exercises.
function revealBePairEnglishStage(q, koUser) {
  const koStage = document.getElementById("pair-ko-stage");
  const sourceBox = koStage?.querySelector(".pair-source");
  const answerBox = document.getElementById("pair-answer-box");
  const koTemplate = document.getElementById("pair-ko-template");
  const enRest = document.getElementById("pair-en-rest");
  const enInput = document.getElementById("en-answer");
  const submitBtn = document.getElementById("submit-btn");
  const stack = koStage?.closest(".pair-stack");

  if (koTemplate) {
    koTemplate.innerHTML = `<div class="pair-ko-plain-line">${escapeHtml(koUser)}</div>`;
  }
  if (answerBox) {
    answerBox.classList.remove("is-in");
    answerBox.classList.remove("is-lifting");
    answerBox.classList.remove("is-expanded");
    answerBox.classList.add("is-plain");
    void answerBox.offsetWidth;
    answerBox.classList.add("is-in");
  }
  if (enRest) enRest.setAttribute("aria-hidden", "true");
  if (enInput && window.AisthInputSlots) window.AisthInputSlots.setDisabled(enInput, true);
  else if (enInput) enInput.disabled = true;
  if (submitBtn) submitBtn.hidden = true;

  window.setTimeout(() => {
    if (koStage && sourceBox && answerBox) {
      const sourceRect = sourceBox.getBoundingClientRect();
      const answerRect = answerBox.getBoundingClientRect();
      const lift = Math.max(0, answerRect.top - sourceRect.top);
      koStage.style.setProperty("--pair-source-lift", `${Math.ceil(lift)}px`);
    }
    if (koStage) koStage.classList.add("is-morphing");
    if (answerBox) answerBox.classList.add("is-lifting");
  }, 120);

  window.setTimeout(() => {
    if (stack) stack.classList.add("is-step2");
    if (answerBox) answerBox.classList.add("is-expanded");
    if (enRest) enRest.setAttribute("aria-hidden", "false");
    if (enInput && window.AisthInputSlots) window.AisthInputSlots.setDisabled(enInput, false);
    else if (enInput) enInput.disabled = false;
  }, 580);

  window.setTimeout(() => {
    const control = document.getElementById(enInput?.dataset.aisthSlotControlId || "");
    const flowInput = control?.querySelector(".aisth-slot-input");
    if (flowInput) flowInput.focus();
    else if (enInput) enInput.focus();
  }, 720);
}

function submitCurrentAnswer() {
  if (isCurrentLocked) return;

  const q = questions[currentIndex];
  if (q?.type === "bePair") {
    submitBePairAnswer(q);
    return;
  }

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

function submitBePairAnswer(q) {
  const bodyInputs = Array.from(document.querySelectorAll(".pair-ko-slot-input"));
  const enInput = document.getElementById("en-answer");
  const passBtn = document.getElementById("ko-pass-btn");
  const submitBtn = document.getElementById("submit-btn");
  const nextBtn = document.getElementById("next-btn");
  const feedback = document.getElementById("feedback");
  const ko = q.koParts || splitKoreanBeAnswer(q.koAnswer);

  if (!enInput) return;
  if (q.pairStage !== "en" && !q.koPassThrough && !bodyInputs.length) return;

  if (q.pairStage !== "en") {
    if (q.koPassThrough) {
      const koUser = q.koQuestion || q.koAnswer;
      q.pairStage = "en";
      q.koSolved = koUser;
      if (passBtn) passBtn.disabled = true;
      if (feedback) {
        feedback.className = "feedback";
        feedback.innerHTML = "";
      }
      showToast("ok", TEXT.CORRECT);
      revealBePairEnglishStage(q, koUser);
      return;
    }

    const hasEmptySlot = bodyInputs.some((input) => !String(input.value || "").trim());
    if (hasEmptySlot) {
      showToast("no", TEXT.INPUT_REQUIRED);
      return;
    }

    const koUser = buildKoreanUserFromSlots(ko, bodyInputs);
    const koOk = isAnswerCorrect("rewrite", koUser, q.koAnswer);
    if (!koOk) {
      if (feedback) {
        feedback.className = "feedback";
        feedback.innerHTML = "";
      }
      showToast("no", TEXT.WRONG);
      return;
    }

    q.pairStage = "en";
    q.koSolved = koUser;
    bodyInputs.forEach((input) => {
      input.disabled = true;
      if (window.AisthInputSlots) window.AisthInputSlots.setDisabled(input, true);
    });
    if (feedback) {
      feedback.className = "feedback";
      feedback.innerHTML = "";
    }
    showToast("ok", TEXT.CORRECT);
    revealBePairEnglishStage(q, koUser);
    return;
  }

  const enRaw = String(enInput.value || "").trim();
  if (!enRaw) {
    showToast("no", TEXT.INPUT_REQUIRED);
    return;
  }

  const enOk = isAnswerCorrect("blank", enRaw, q.enAnswer);

  if (!enOk) {
    if (feedback) {
      feedback.className = "feedback";
      feedback.innerHTML = "";
    }
    showToast("no", TEXT.WRONG);
    return;
  }

  completeBePairEnglishAnswer(q, enInput, enRaw);
}

function updateBePairEnglishSlots(q, enInput, control) {
  if (!q || !enInput || !control) return;
  const expected = Array.from(String(q.enAnswer || "").replace(/\s+/g, "").toLowerCase());
  const actual = Array.from(String(enInput.value || "").replace(/\s+/g, "").toLowerCase());
  control.querySelectorAll(".aisth-slot-cell").forEach((cell, index) => {
    cell.classList.toggle("is-slot-correct", Boolean(actual[index]) && actual[index] === expected[index]);
    cell.classList.toggle("is-slot-wrong", Boolean(actual[index]) && actual[index] !== expected[index]);
  });

  if (q.pairStage !== "en" || isCurrentLocked || actual.length !== expected.length) return;
  if (actual.every((char, index) => char === expected[index])) {
    completeBePairEnglishAnswer(q, enInput, String(enInput.value || "").trim());
  }
}

function completeBePairEnglishAnswer(q, enInput, enRaw) {
  if (isCurrentLocked || !q || !enInput) return;

  isCurrentLocked = true;
  if (window.AisthInputSlots) window.AisthInputSlots.setDisabled(enInput, true);
  else enInput.disabled = true;
  const submitBtn = document.getElementById("submit-btn");
  const nextBtn = document.getElementById("next-btn");
  const feedback = document.getElementById("feedback");
  if (submitBtn) submitBtn.disabled = true;
  if (nextBtn) nextBtn.disabled = true;

  const koUser = q.koSolved || q.koAnswer;
  results.push({
    no: currentIndex + 1,
    qNumber: q.qNumber,
    type: q.type,
    question: q.question,
    selected: `${koUser} / ${enRaw}`,
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
  const solvedIndex = currentIndex;
  window.setTimeout(() => {
    if (currentIndex === solvedIndex) goNext();
  }, 650);
}

function buildKoreanUserFromSlots(ko, inputs) {
  const bodyParts = buildKoreanBodyTemplateParts(ko.body);
  let slotIndex = 0;
  const body = bodyParts.map((part) => {
    if (part.kind === "fixed") return part.text;
    const input = inputs[slotIndex];
    slotIndex += 1;
    return String(input?.value || "").trim();
  }).join("");

  return `${ko.subject}${ko.particle} ${body}${ko.ending}`;
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







