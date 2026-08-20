// dish-quiz.js

let subcategory = '';
let level = '';
let day = '';

let currentIndex = 0;
let currentTimer = null;
let questions = [];
let results = [];
let quizData = [];
let selectedDay = '';
let quizTitle = '';
let userId = '';
const workbookCache = new Map();
let debugAutoCompleting = false;
let assistWheelMode = false;

// 🔧 이 문제에서 이미 답을 처리했는지 여부
let isAnswered = false;

function readQuizResultsMap() {
  try {
    const raw = localStorage.getItem('QuizResultsMap');
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch (_) {
    return {};
  }
}

function storeQuizResultWithMap(resultObject) {
  localStorage.setItem('QuizResults', JSON.stringify(resultObject));

  const quizKey = String(resultObject?.quiztitle || resultObject?.quizTitle || '').trim();
  if (!quizKey) return;

  const map = readQuizResultsMap();
  map[quizKey] = resultObject;
  localStorage.setItem('QuizResultsMap', JSON.stringify(map));
  window.dispatchEvent(new CustomEvent('dish:result-saved', { detail: resultObject }));
}

function isTesterUser() {
  return String(userId || '').trim().toLowerCase() === 'tester';
}

function isReviewItem(item) {
  return String(item?.source || '').toLowerCase() === 'review';
}

function getScoredResults(resultRows) {
  const mainRows = resultRows.filter(row => !isReviewItem(row));
  return mainRows.length ? mainRows : resultRows;
}

function renderAssistWheelButton() {
  if (!isTesterUser()) return;
  if (document.getElementById('assist-wheel-toggle')) return;

  if (!document.getElementById('assist-wheel-style')) {
    const style = document.createElement('style');
    style.id = 'assist-wheel-style';
    style.textContent = `
      #assist-wheel-toggle{
        position:fixed;
        right:14px;
        bottom:18px;
        z-index:10010;
        width:54px;
        height:54px;
        border:1px solid rgba(33,45,42,.28);
        border-radius:50%;
        background:#fffaf0;
        box-shadow:0 8px 22px rgba(0,0,0,.18);
        display:grid;
        place-items:center;
        cursor:pointer;
        transition:transform .14s ease, background .14s ease, box-shadow .14s ease;
      }
      #assist-wheel-toggle:hover{
        transform:translateY(-1px);
        box-shadow:0 10px 26px rgba(0,0,0,.22);
      }
      #assist-wheel-toggle.active{
        background:#dff3e8;
        border-color:#3b7c5b;
      }
      #assist-wheel-toggle .assist-wheel-icon{
        width:32px;
        height:32px;
        border:5px solid #2f3a35;
        border-radius:50%;
        background:
          radial-gradient(circle at center, #fffaf0 0 18%, transparent 19%),
          conic-gradient(from 0deg, #7c8b7d 0 16deg, transparent 16deg 60deg, #7c8b7d 60deg 76deg, transparent 76deg 120deg, #7c8b7d 120deg 136deg, transparent 136deg 180deg, #7c8b7d 180deg 196deg, transparent 196deg 240deg, #7c8b7d 240deg 256deg, transparent 256deg 300deg, #7c8b7d 300deg 316deg, transparent 316deg 360deg);
        box-sizing:border-box;
        position:relative;
      }
      #assist-wheel-toggle .assist-wheel-icon::after{
        content:"";
        position:absolute;
        left:50%;
        top:50%;
        width:9px;
        height:9px;
        border-radius:50%;
        background:#2f3a35;
        transform:translate(-50%,-50%);
      }
      #assist-wheel-toggle.active .assist-wheel-icon{
        border-color:#246445;
      }
    `;
    document.head.appendChild(style);
  }

  const button = document.createElement('button');
  button.id = 'assist-wheel-toggle';
  button.type = 'button';
  button.title = 'Assist wheel';
  button.setAttribute('aria-label', 'Assist wheel');
  button.setAttribute('aria-pressed', 'false');
  button.innerHTML = '<span class="assist-wheel-icon" aria-hidden="true"></span>';
  button.addEventListener('click', () => {
    assistWheelMode = !assistWheelMode;
    button.classList.toggle('active', assistWheelMode);
    button.setAttribute('aria-pressed', assistWheelMode ? 'true' : 'false');
  });

  document.body.appendChild(button);
}

function renderTesterDebugControls() {
  if (!isTesterUser() || document.getElementById('dish-debug-controls')) return;

  const controls = document.createElement('div');
  controls.id = 'dish-debug-controls';
  controls.style.cssText = `
    position: fixed;
    right: 10px;
    top: 96px;
    z-index: 10020;
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 104px;
  `;
  controls.innerHTML = `
    <button type="button" data-debug-result="correct" style="
      border: 0;
      border-radius: 6px;
      padding: 7px 6px;
      background: #2e7d32;
      color: #fff;
      font-size: 11px;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.18);
    ">다 맞게 하기</button>
    <button type="button" data-debug-result="wrong" style="
      border: 0;
      border-radius: 6px;
      padding: 7px 6px;
      background: #b3261e;
      color: #fff;
      font-size: 11px;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.18);
    ">다 틀리게 하기</button>
  `;

  controls.querySelector('[data-debug-result="correct"]')?.addEventListener('click', () => {
    completeQuizForDebug(true).catch(error => {
      console.error(error);
      alert('Failed to complete the quiz.');
    });
  });
  controls.querySelector('[data-debug-result="wrong"]')?.addEventListener('click', () => {
    completeQuizForDebug(false).catch(error => {
      console.error(error);
      alert('Failed to complete the quiz.');
    });
  });

  document.body.appendChild(controls);
}

function getDishLearnUrl() {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('id') || '';
  if (window.DishRetakeLock?.buildStudyUrlFromQuizKey) {
    return window.DishRetakeLock.buildStudyUrlFromQuizKey(quizTitle, userId);
  }

  return `dish-learn.html?id=${encodeURIComponent(userId)}&dishQuizKey=${encodeURIComponent(quizTitle)}`;
}

async function loadWorkbookRows(workbookLevel) {
  const normalizedLevel = String(workbookLevel || '').toUpperCase();
  if (workbookCache.has(normalizedLevel)) {
    return workbookCache.get(normalizedLevel);
  }

  const response = await fetch(`${normalizedLevel}.xlsx`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load ${normalizedLevel}.xlsx (${response.status})`);
  }

  const data = await response.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  workbookCache.set(normalizedLevel, rows);
  return rows;
}

function getDayNumber(value) {
  if (window.DishReview?.parseDayNumber) {
    return window.DishReview.parseDayNumber(value);
  }
  const digits = String(value ?? '').replace(/[^0-9]/g, '');
  return digits ? Number(digits) : null;
}

function createChoiceQuestion(entry, sourceRows) {
  const answer = entry['Korean Meaning'];
  const wrongs = sourceRows
    .filter(q => q['Korean Meaning'] !== answer)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4)
    .map(q => q['Korean Meaning']);

  const options = [...wrongs, answer].sort(() => 0.5 - Math.random());

  return {
    word: entry['Word'],
    answer,
    options,
    source: entry.__review ? 'review' : 'main',
    reviewLevel: entry.__reviewLevel || null,
    reviewDay: entry.__reviewDay || null
  };
}

window.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const key = params.get('key');
  userId = params.get('id') || '';

  if (!key) return alert('시험 key 정보가 없습니다.');

  quizTitle = key;
  const parts = key.split('_');
  if (parts.length < 4) return alert('시험 key 형식이 잘못되었습니다.');

  subcategory = parts[1];
  level = parts[2];
  day = parts[3];
  console.log('✅ 파싱된 값:', { subcategory, level, day });
  document.getElementById('back-btn')?.addEventListener('click', () => history.back());

  if (window.DishRetakeLock?.isLocked?.(quizTitle)) {
    const quizArea = document.getElementById('quiz-area');
    if (quizArea) {
      quizArea.innerHTML = `
        <div style="
          background: #fff3e0;
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          font-size: 14px;
          line-height: 1.45;
          color: #5a3a24;
          font-weight: bold;
        ">
          재시험 준비 시간이 남아 있어요.
        </div>
      `;
    }

    window.DishRetakeLock.showLockPopup({
      quizKey: quizTitle,
      onStudy: () => {
        window.location.href = getDishLearnUrl();
      }
    });
    return;
  }

  try {
    quizData = await loadWorkbookRows(level);
  } catch (e) {
    console.error(e);
    alert('문제 파일을 불러오는 중 오류가 발생했습니다.');
    return;
  }

  renderTesterDebugControls();
  renderAssistWheelButton();
  renderInstruction();
});

function renderDishQuiz1TitleDemo() {
  if (!document.body.matches('.wordflow-25d[data-word-stage="quiz1"]')) return '';

  return `
    <div class="wf-q1-title-demo" aria-hidden="true">
      <div class="wf-q1-demo-head">
        <span>QUESTION DEMO</span>
        <strong>3 SEC</strong>
      </div>
      <div class="wf-q1-demo-timer"><i></i></div>
      <div class="wf-q1-demo-word">bloom</div>
      <div class="wf-q1-demo-choices">
        <span data-choice="A">\uB2EC\uB9AC\uB2E4</span>
        <span data-choice="B" class="is-answer">\uAF43\uD53C\uB2E4</span>
        <span data-choice="C">\uC7A0\uB4E4\uB2E4</span>
      </div>
      <div class="wf-q1-demo-instruction">CHOOSE THE RIGHT MEANING</div>
      <div class="wf-q1-demo-complete">CORRECT!</div>
    </div>
  `;
}

function startDishQuiz1TitleDemo() {
  const demo = document.querySelector('#quiz-area .wf-q1-title-demo');
  if (!demo) return;

  const timer = demo.querySelector('.wf-q1-demo-timer > i');
  const word = demo.querySelector('.wf-q1-demo-word');
  const answer = demo.querySelector('.wf-q1-demo-choices > .is-answer');
  const instruction = demo.querySelector('.wf-q1-demo-instruction');
  const complete = demo.querySelector('.wf-q1-demo-complete');

  const run = () => {
    if (!demo.isConnected) return;
    let remaining = 100;
    word?.classList.remove('is-correct');
    answer?.classList.remove('is-demo-pressing', 'is-selected');
    instruction?.classList.remove('is-hidden');
    complete?.classList.remove('is-visible');
    if (timer) timer.style.width = '100%';

    const timerInterval = window.setInterval(() => {
      if (!demo.isConnected) {
        window.clearInterval(timerInterval);
        return;
      }
      remaining = Math.max(18, remaining - 3);
      if (timer) timer.style.width = `${remaining}%`;
    }, 45);

    window.setTimeout(() => {
      if (!demo.isConnected) return;
      answer?.classList.add('is-demo-pressing');
    }, 1260);

    window.setTimeout(() => {
      if (!demo.isConnected) return;
      window.clearInterval(timerInterval);
      answer?.classList.remove('is-demo-pressing');
      answer?.classList.add('is-selected');
      word?.classList.add('is-correct');
      instruction?.classList.add('is-hidden');
      complete?.classList.add('is-visible');
    }, 1420);

    window.setTimeout(run, 2850);
  };

  run();
}

function renderInstruction() {
  const quizArea = document.getElementById('quiz-area');
  quizArea.innerHTML = `
    <div style="
      background: #fff3e0;
      padding: 16px;
      border-radius: 12px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      margin-bottom: 20px;
      font-size: 14px;
    ">
      <div style="font-size:18px; font-weight:bold; color: #7e3106; margin-bottom: 12px;">📘 시험 안내</div>
      ${renderDishQuiz1TitleDemo()}
      <ul style="margin-bottom: 16px; padding-left: 20px; line-height: 1.6;">
        <li>총 20문제가 출제됩니다.</li>
        <li>각 문제당 <b>3초</b>의 시간이 주어집니다.</li>
        <li>정답을 고르지 못하면 <b>자동 오답 처리</b>됩니다.</li>
      </ul>
      <div style="font-weight: bold; margin-bottom: 10px; color: #444;">
        과목: ${subcategory} / 난이도: ${level} / Day: ${day}
      </div>
      <button class="quiz-btn" style="width: 100%;" onclick="startQuiz()">🚀 시험 시작</button>
    </div>
  `;

  const infoItems = quizArea.querySelectorAll('li');
  if (infoItems[0]) infoItems[0].textContent = 'Total 30 questions: 20 current + 10 review.';

  const startBtn = quizArea.querySelector('button.quiz-btn');
  if (document.body.matches('.wordflow-25d[data-word-stage="quiz1"]')) {
    const title = quizArea.querySelector(':scope > div > div:first-child');
    if (title) title.textContent = 'MEANING MATCH';
    if (startBtn) startBtn.textContent = 'PRESS START';
    startDishQuiz1TitleDemo();
  }
  startBtn?.removeAttribute('onclick');
  startBtn?.addEventListener('click', () => {
    startQuiz().catch(error => {
      console.error(error);
      alert('Failed to start the quiz.');
    });
  });
}

async function startQuiz(options = {}) {
  const dayNumber = getDayNumber(day);
  let dayData = quizData.filter(q => getDayNumber(q['Day']) === dayNumber);

  dayData = dayData.sort(() => 0.5 - Math.random()).slice(0, 20);

  if (dayData.length === 0) return alert('해당 Day의 문제가 없습니다.');

  const excludeWords = new Set(
    dayData.map(entry => String(entry.Word || '').trim().toLowerCase()).filter(Boolean)
  );
  const reviewRows = await window.DishReview?.buildReviewRows?.({
    userId,
    quizKey: quizTitle,
    level,
    day: dayNumber,
    loadRows: loadWorkbookRows,
    excludeWords
  }) || [];

  const sourceRows = [...quizData, ...reviewRows];
  questions = [...dayData, ...reviewRows]
    .map(entry => createChoiceQuestion(entry, sourceRows))
    .sort(() => 0.5 - Math.random());

  currentIndex = 0;
  results = [];
  if (options.render !== false) {
    renderQuestion();
  }
}

async function completeQuizForDebug(makeCorrect) {
  if (!isTesterUser() || debugAutoCompleting) return;
  debugAutoCompleting = true;

  try {
    if (currentTimer) {
      clearTimeout(currentTimer);
      currentTimer = null;
    }

    if (!questions.length) {
      await startQuiz({ render: false });
    }

    if (!questions.length) {
      alert('문제를 만들 수 없습니다.');
      return;
    }

    results = questions.map((q, index) => ({
      no: index + 1,
      word: q.word,
      answer: q.answer,
      selected: makeCorrect ? (q.answer || '맞는 답') : '틀린 답',
      source: q.source || 'main',
      reviewLevel: q.reviewLevel || null,
      reviewDay: q.reviewDay || null,
      correct: !!makeCorrect || (assistWheelMode && isReviewItem(q)),
      assistWheel: assistWheelMode && isReviewItem(q)
    }));

    currentIndex = questions.length;
    isAnswered = true;
    showResultPopup();
  } finally {
    debugAutoCompleting = false;
  }
}

function renderQuestion() {
  // 🔧 이전 문제 타이머가 남아 있으면 정리
  if (currentTimer) {
    clearTimeout(currentTimer);
    currentTimer = null;
  }

  if (currentIndex >= questions.length) {
    return showResultPopup();
  }

  // 새 문제 시작 → 아직 답 안 함
  isAnswered = false;

  const quizArea = document.getElementById('quiz-area');
  const q = questions[currentIndex];

  quizArea.innerHTML = `
    <div
      data-question-current="${currentIndex + 1}"
      data-question-total="${questions.length}"
      style="font-weight:bold; font-size:18px; margin-bottom:10px;"
    >
      ${currentIndex + 1}. ${q.word}
    </div>
    <div id="timer-bar" style="
      height: 8px;
      background: green;
      width: 100%;
    "></div>
    <div style="margin-top:12px; display:flex; flex-direction:column; gap:6px;">
      ${q.options
        .map(
          (opt, i) =>
            `<button class="quiz-btn" onclick="checkAnswer('${opt.replace(/'/g, "\\'")}')">${opt}</button>`
        )
        .join('')}
    </div>
    <div id="feedback" style="margin-top:12px; font-weight:bold;"></div>
  `;

  if (document.body.matches('.wordflow-25d[data-word-stage="quiz1"]')) {
    quizArea.querySelectorAll('.quiz-btn').forEach(button => {
      const cancelPress = () => {
        button.classList.remove('is-pressing');
      };
      button.addEventListener('pointerdown', () => {
        button.classList.add('is-pressing');
      });
      button.addEventListener('pointercancel', cancelPress);
      button.addEventListener('pointerleave', cancelPress);
      button.addEventListener('click', () => {
        quizArea.querySelectorAll('.quiz-btn.is-selected').forEach(item => {
          item.classList.remove('is-selected');
        });
        button.classList.remove('is-pressing');
        button.classList.add('is-selected');
      });
    });
  }

  const bar = document.getElementById('timer-bar');
  if (bar) {
    // 처음엔 꽉 찬 상태
    bar.style.transition = 'none';
    bar.style.width = '100%';

    // 리플로우 강제
    void bar.offsetWidth;

    // 3초 동안 100% → 0%로 줄어드는 애니메이션
    bar.style.transition = 'width 3s linear';
    bar.style.width = '0%';
  }

  currentTimer = setTimeout(() => {
    checkAnswer(null); // 시간 초과
  }, 3000);
}

function checkAnswer(selected) {
  // 🔧 이미 이 문제 처리했으면 무시
  if (isAnswered) return;
  isAnswered = true;

  // 🔧 타이머 중단
  if (currentTimer) {
    clearTimeout(currentTimer);
    currentTimer = null;
  }

  // 🔧 타이머 바 현재 위치에서 얼리기
  const bar = document.getElementById('timer-bar');
  if (bar) {
    const currentWidth = getComputedStyle(bar).width; // px 단위
    bar.style.transition = 'none';
    bar.style.width = currentWidth; // 그대로 고정
    bar.style.opacity = '0.85'; // 살짝 톤 다운(선택 완료 느낌)
  }

  const q = questions[currentIndex];
  if (!q) {
    // 방어 코드
    return;
  }

  const assistPass = assistWheelMode && isReviewItem(q);
  const correct = assistPass || q.answer === selected;

  results.push({
    no: currentIndex + 1,
    word: q.word,
    answer: q.answer,
    selected: selected || '시간 초과',
    source: q.source || 'main',
    reviewLevel: q.reviewLevel || null,
    reviewDay: q.reviewDay || null,
    correct,
    assistWheel: assistPass
  });

  const feedback = document.getElementById('feedback');
  if (feedback) {
    feedback.textContent = correct ? '정답입니다 ✅' : '오답입니다 ❌';
  }

  if (document.body.matches('.wordflow-25d[data-word-stage="quiz1"]')) {
    const quizArea = document.getElementById('quiz-area');
    quizArea?.classList.remove('is-correct', 'is-wrong');
    quizArea?.classList.add(correct ? 'is-correct' : 'is-wrong');

    const choiceButtons = Array.from(document.querySelectorAll('#quiz-area .wf-q1-options .quiz-btn'));
    choiceButtons.forEach((button, index) => {
      button.classList.remove('is-correct-choice', 'is-wrong-choice', 'is-answer-choice');
      const option = q.options[index];
      if (!correct && option === q.answer) {
        button.classList.add('is-answer-choice');
      }
      if (selected != null && option === selected) {
        button.classList.add(correct ? 'is-correct-choice' : 'is-wrong-choice');
      }
    });
  }

  showDishQuiz1AnswerToast(correct, selected == null);

  // 🔧 버튼 중복 클릭 방지
  const buttons = document.querySelectorAll('#quiz-area .quiz-btn');
  buttons.forEach(btn => {
    btn.disabled = true;
  });

  setTimeout(() => {
    currentIndex++;
    renderQuestion();
  }, 800);
}

function showDishQuiz1AnswerToast(correct, timedOut) {
  if (!document.body.matches('.wordflow-25d[data-word-stage="quiz1"]')) return;
  document.querySelector('.dish-q1-direct-toast')?.remove();

  const toast = document.createElement('div');
  const positive = correct === true;
  toast.className = `dish-q1-direct-toast ${positive ? 'correct' : 'wrong'}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'assertive');
  toast.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 30000;
    width: min(226px, calc(100vw - 48px));
    min-height: 82px;
    padding: 12px 16px;
    border: 2px solid rgba(255,248,224,0.9);
    border-radius: 17px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    box-sizing: border-box;
    color: #fff;
    background: ${positive
      ? 'linear-gradient(145deg, #65a77d 0%, #2e7555 100%)'
      : 'linear-gradient(145deg, #df786a 0%, #ad4842 100%)'};
    box-shadow:
      0 6px 0 ${positive ? '#245f46' : '#873934'},
      0 17px 34px ${positive ? 'rgba(29,92,60,0.3)' : 'rgba(128,47,43,0.3)'},
      inset 0 1px 0 rgba(255,255,255,0.32),
      inset 0 -4px 9px rgba(45,25,18,0.12);
    opacity: 1;
    overflow: hidden;
    pointer-events: none;
    transform: translate(-50%, -50%);
  `;
  toast.innerHTML = `
    <strong style="
      position:relative;
      z-index:2;
      width:44px;
      height:44px;
      flex:0 0 44px;
      border:2px solid rgba(255,250,230,.82);
      border-radius:50%;
      display:grid;
      place-items:center;
      color:${positive ? '#2d7654' : '#b14943'};
      background:#fff8e8;
      box-shadow:
        inset 0 1px 0 #fff,
        0 3px 7px rgba(38,42,31,.16);
      font:700 30px/1 Arial,sans-serif;
    ">${positive ? '✓' : '×'}</strong>
    <span style="position:relative; z-index:2; min-width:0; text-align:left;">
      <small style="
        display:block;
        margin-bottom:3px;
        color:rgba(255,249,229,.76);
        font-size:8px;
        font-weight:900;
        letter-spacing:.16em;
      ">ANSWER CHECK</small>
      <b style="
        display:block;
        color:#fffaf0;
        font-size:17px;
        font-weight:950;
        line-height:1;
        letter-spacing:.04em;
        text-shadow:0 1px 2px rgba(25,45,32,.2);
      ">${positive ? 'CORRECT' : timedOut ? 'TIME OUT' : 'WRONG'}</b>
    </span>
    <i aria-hidden="true" style="
      position:absolute;
      right:-8px;
      bottom:-12px;
      width:62px;
      height:62px;
      border:10px solid rgba(255,249,225,.08);
      border-radius:50%;
      transform:rotate(-18deg);
    "></i>
    <i aria-hidden="true" style="
      position:absolute;
      top:9px;
      right:12px;
      width:8px;
      height:14px;
      border:1px solid rgba(255,245,210,.28);
      border-radius:100% 0 100% 0;
      transform:rotate(28deg);
    "></i>
  `;

  document.body.appendChild(toast);
  toast.animate([
    {
      opacity: 0,
      transform: 'translate(-50%, -46%) scale(.82)'
    },
    {
      opacity: 1,
      transform: 'translate(-50%, -52%) scale(1.04)',
      offset: 0.18
    },
    {
      opacity: 1,
      transform: 'translate(-50%, -50%) scale(1)',
      offset: 0.76
    },
    {
      opacity: 0,
      transform: 'translate(-50%, -55%) scale(.97)'
    }
  ], {
    duration: 760,
    easing: 'cubic-bezier(.2,.86,.24,1)',
    fill: 'forwards'
  });
  setTimeout(() => toast.remove(), 790);
}

function escapeDishQuiz1ResultHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));
}

function formatDishQuiz1ResultSource(result) {
  if (String(result?.source || '').toLowerCase() !== 'review') {
    return '\uC624\uB298';
  }

  const reviewLevel = String(result?.reviewLevel || '').trim().toUpperCase();
  const reviewDay = String(result?.reviewDay || '').replace(/[^0-9]/g, '');
  return `${reviewLevel || 'REVIEW'}${reviewDay ? ` Day ${reviewDay}` : ''}`;
}

function renderDishQuiz1WordflowResult(popup, summary) {
  const rows = results.map(result => {
    const isReview = String(result?.source || '').toLowerCase() === 'review';
    return `
      <tr class="${isReview ? 'is-review' : 'is-main'}">
        <td>${escapeDishQuiz1ResultHtml(result.no)}</td>
        <td><span class="wf-result-source">${escapeDishQuiz1ResultHtml(formatDishQuiz1ResultSource(result))}</span></td>
        <td class="wf-result-word">${escapeDishQuiz1ResultHtml(result.word)}</td>
        <td>${escapeDishQuiz1ResultHtml(result.selected)}</td>
        <td><span class="wf-result-verdict ${result.correct ? 'is-correct' : 'is-wrong'}">${result.correct ? '\u2713' : '\u00D7'}</span></td>
      </tr>
    `;
  }).join('');

  popup.innerHTML = `
    <div class="popup-content wf-result-content" id="result-content">
      <div class="wf-result-header">
        <span class="wf-result-kicker">WORD QUIZ \u00B7 RESULT</span>
        <h2>\uC804\uCCB4 \uC2DC\uD5D8\uC9C0 \uACB0\uACFC</h2>
      </div>
      <div class="wf-result-score ${summary.canSubmit ? 'is-pass' : 'is-retry'}">
        <div class="wf-result-score-number">
          <strong>${summary.score}</strong>
          <span>\uC810</span>
        </div>
        <div class="wf-result-score-copy">
          <span>\uC815\uB2F5</span>
          <strong>${summary.correctCount} / ${summary.totalQuestions}</strong>
          <small>\uC624\uB298 \uBB38\uC81C \uAE30\uC900</small>
        </div>
      </div>
      <div class="wf-result-status ${summary.canSubmit ? 'is-pass' : 'is-retry'}">
        <span aria-hidden="true">${summary.canSubmit ? '\u2713' : '!'}</span>
        <strong>${summary.canSubmit
          ? '80\uC810 \uC774\uC0C1\uC785\uB2C8\uB2E4. \uC81C\uCD9C\uD558\uB7EC \uAC08 \uC218 \uC788\uC5B4\uC694.'
          : '80\uC810 \uC774\uC0C1\uBD80\uD130 \uC81C\uCD9C\uD560 \uC218 \uC788\uC5B4\uC694.'}</strong>
      </div>
      <div class="wf-result-detail" id="result-detail">
        <table class="wf-result-table">
          <colgroup>
            <col class="wf-col-number" />
            <col class="wf-col-source" />
            <col class="wf-col-word" />
            <col class="wf-col-answer" />
            <col class="wf-col-verdict" />
          </colgroup>
          <thead>
            <tr>
              <th>\uBC88\uD638</th>
              <th>\uCD9C\uCC98</th>
              <th>\uBB38\uC81C</th>
              <th>\uB0B4 \uB2F5\uC548</th>
              <th>\uACB0\uACFC</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="wf-result-actions">
        ${summary.canSubmit
          ? '<button class="quiz-btn secondary" type="button" onclick="restartQuiz()">\uC7AC\uC2DC\uD5D8</button>'
          : '<button class="quiz-btn secondary" type="button" onclick="window.location.href=getDishLearnUrl()">MEM\uC73C\uB85C \uB3CC\uC544\uAC00\uAE30</button>'}
        <button class="quiz-btn" id="submit-btn" type="button" ${summary.canSubmit ? '' : 'disabled'} onclick="returnToTray()">\uB2E4\uC74C \uB2E8\uACC4\uB85C</button>
      </div>
    </div>
  `;
  popup.style.display = 'flex';
}

function showResultPopup() {
  // 혹시 남아 있는 타이머 정리
  if (currentTimer) {
    clearTimeout(currentTimer);
    currentTimer = null;
  }
  isAnswered = true;

  // ✅ 점수 계산
  const scoreRows = getScoredResults(results);
  const totalQuestions = scoreRows.length;
  const correctCount = scoreRows.filter(r => r.correct).length;
  const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const canSubmit = score >= 80;

  if (canSubmit) {
    window.DishRetakeLock?.clearLock?.(quizTitle);
  } else {
    window.DishRetakeLock?.setLock?.(quizTitle, undefined, {
      score,
      correctCount,
      totalQuestions
    });
  }

  const resultObject = {
    quiztitle: quizTitle,
    subcategory,
    level,
    day,
    teststatus: 'stage1',
    stage: 'dish-quiz1',
    score,
    correctCount,
    totalQuestions,
    canSubmit,
    testspecific: results
  };

  storeQuizResultWithMap(resultObject);

  const popup = document.getElementById('result-popup');

  if (document.body.matches('.wordflow-25d[data-word-stage="quiz1"]')) {
    renderDishQuiz1WordflowResult(popup, {
      score,
      correctCount,
      totalQuestions,
      canSubmit
    });
    return;
  }

  const table = `
    <table style="width:100%; border-collapse: collapse; font-size: 13px;">
      <thead>
        <tr style="background:#f6f6f6;">
          <th style="padding: 6px; border-bottom: 1px solid #ccc;">번호</th>
          <th style="padding: 6px; border-bottom: 1px solid #ccc;">Type</th>
          <th style="padding: 6px; border-bottom: 1px solid #ccc;">문제</th>
          <th style="padding: 6px; border-bottom: 1px solid #ccc;">내 답안</th>
          <th style="padding: 6px; border-bottom: 1px solid #ccc;">정답 여부</th>
        </tr>
      </thead>
      <tbody>
        ${results
          .map(
            r => `
          <tr>
            <td style="padding:6px; border-bottom: 1px solid #eee;">${r.no}</td>
            <td style="padding:6px; border-bottom: 1px solid #eee;">${r.source === 'review' ? `Review ${r.reviewLevel || ''} Day ${r.reviewDay || ''}` : 'Main'}</td>
            <td style="padding:6px; border-bottom: 1px solid #eee;">${r.word}</td>
            <td style="padding:6px; border-bottom: 1px solid #eee;">${r.selected}</td>
            <td style="padding:6px; border-bottom: 1px solid #eee;">${r.correct ? '⭕' : '❌'}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  `;

  popup.innerHTML = `
    <div class="popup-content" id="result-content">
      <div style="font-weight: bold; font-size:16px; margin-bottom: 8px;">📄 전체 시험지 결과</div>
      <div style="margin-bottom: 8px; font-size: 14px;">
        총 점수: <b>${score}점</b> (${correctCount} / ${totalQuestions})
      </div>
      ${
        !canSubmit
          ? `<div style="margin-bottom: 10px; font-size: 12px; color:#c62828;">
               ⚠️ 80점 이상부터 제출할 수 있어요. 다시 한 번 풀어볼까요?
             </div>`
          : `<div style="margin-bottom: 10px; font-size: 12px; color:#2e7d32;">
               ✅ 80점 이상입니다! 제출하러 갈 수 있어요.
             </div>`
      }
      <div id="result-detail" style="max-height: 260px; overflow-y: auto; margin-bottom: 14px;">
        ${table}
      </div>
      <div style="display:flex; justify-content: space-between; gap: 10px; margin-top:8px;">
        <button class="quiz-btn" onclick="restartQuiz()">🔁 재시험</button>
        <button
          class="quiz-btn"
          id="submit-btn"
          ${canSubmit ? '' : 'disabled'}
          onclick="returnToTray()"
        >
          🍽 제출하러 가기
        </button>
      </div>
    </div>
  `;

  popup.style.display = 'flex';

  // 🔧 점수 미달 시 버튼 비주얼 비활성화 처리
  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn) {
    submitBtn.textContent = '다음 단계로!';
    if (!canSubmit) {
      submitBtn.style.opacity = '0.5';
      submitBtn.style.cursor = 'not-allowed';
    }
  }
}

function restartQuiz() {
  if (
    window.DishRetakeLock?.showLockPopup?.({
      quizKey: quizTitle,
      onStudy: () => {
        window.location.href = getDishLearnUrl();
      }
    })
  ) {
    return;
  }

  window.location.reload();
}

function returnToTray() {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('id') || '';
  const nextPage = document.body.matches('.wordflow-25d[data-word-stage="quiz1"]')
    ? 'dish-quiz2-25d.html'
    : 'dish-quiz2.html';

  // ✅ quizKey(=quizTitle)를 같이 들고 트레이로 복귀
  const url = `${nextPage}?id=${encodeURIComponent(userId)}&key=${encodeURIComponent(quizTitle)}&level=${encodeURIComponent(level)}&day=${encodeURIComponent(day)}`;

  // ✅ 뒤로 가기로 다시 퀴즈로 못 돌아오게 history 교체
  window.location.replace(url);
}
