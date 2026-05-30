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
    <div style="font-weight:bold; font-size:18px; margin-bottom:10px;">
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

  // ✅ quizKey(=quizTitle)를 같이 들고 트레이로 복귀
  const url = `dish-quiz2.html?id=${encodeURIComponent(userId)}&key=${encodeURIComponent(quizTitle)}&level=${encodeURIComponent(level)}&day=${encodeURIComponent(day)}`;

  // ✅ 뒤로 가기로 다시 퀴즈로 못 돌아오게 history 교체
  window.location.replace(url);
}
