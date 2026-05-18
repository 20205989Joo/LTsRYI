const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];
const QUIZ_SIZE = 20;
const PREFS_KEY = 'DishSpellingQuizPrefs';

const workbookCache = new Map();

let quizArea = null;
let resultPopup = null;
let currentRows = [];
let currentQuestions = [];
let currentResults = [];
let currentIndex = 0;
let currentPuzzle = null;
let isAnswered = false;
let setupToken = 0;
let directMode = false;
let quizTitle = '';
let userId = '';
let debugAutoCompleting = false;
let currentConfig = {
  level: 'A1',
  day: '',
};

function readPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (_) {
    return {};
  }
}

function storePrefs() {
  localStorage.setItem(PREFS_KEY, JSON.stringify(currentConfig));
}

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

function getStoredQuizResult(quizKey) {
  const key = String(quizKey || '').trim();
  if (!key) return null;

  const map = readQuizResultsMap();
  const mapped = map[key];
  if (mapped && typeof mapped === 'object' && !Array.isArray(mapped)) {
    return mapped;
  }

  try {
    const raw = localStorage.getItem('QuizResults');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const parsedKey = String(parsed?.quiztitle || parsed?.quizTitle || '').trim();
    if (parsedKey === key && parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed;
    }
  } catch (_) {
    return null;
  }

  return null;
}

function storeQuizResultWithMap(resultObject) {
  localStorage.setItem('QuizResults', JSON.stringify(resultObject));

  const quizKey = String(resultObject?.quiztitle || resultObject?.quizTitle || '').trim();
  if (!quizKey) return;

  const map = readQuizResultsMap();
  map[quizKey] = resultObject;
  localStorage.setItem('QuizResultsMap', JSON.stringify(map));
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseDayNumber(raw) {
  if (raw === null || raw === undefined) return null;
  const digits = String(raw).replace(/[^0-9]/g, '');
  if (!digits) return null;
  const parsed = Number(digits);
  return Number.isFinite(parsed) ? parsed : null;
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function normalizeAnswer(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/\s*-\s*/g, '-')
    .replace(/\s+/g, ' ');
}

function describeResultSource(result) {
  if (result?.source !== 'review') return '본시험';
  const level = result.reviewLevel ? ` ${result.reviewLevel}` : '';
  const day = result.reviewDay ? ` Day ${result.reviewDay}` : '';
  return `복습${level}${day}`;
}

function toSubmitSpecificRows(rows, stageLabel) {
  if (!Array.isArray(rows)) return [];

  return rows.map((result, index) => {
    const sourceLabel = describeResultSource(result);
    const word = result.word || result.answer || '';
    const selected = result.selected || result.attempt || '';

    return {
      no: index + 1,
      stage: stageLabel,
      source: result.source || 'main',
      reviewLevel: result.reviewLevel || null,
      reviewDay: result.reviewDay || null,
      meaning: result.meaning || '',
      answer: result.answer || result.word || '',
      word: `[${stageLabel} ${sourceLabel}] ${word}`,
      selected,
      correct: !!result.correct,
    };
  });
}

function cloneResultRows(rows) {
  return Array.isArray(rows) ? rows.map(row => ({ ...row })) : [];
}

function isTesterUser() {
  return String(userId || '').trim().toLowerCase() === 'tester';
}

function renderTesterDebugControls() {
  if (!isTesterUser() || document.getElementById('dish2-debug-controls')) return;

  const controls = document.createElement('div');
  controls.id = 'dish2-debug-controls';
  controls.style.cssText = `
    position: fixed;
    right: 10px;
    top: 96px;
    z-index: 10020;
    width: 88px;
  `;
  controls.innerHTML = `
    <button type="button" id="dish2-debug-correct" style="
      width: 100%;
      border: 0;
      border-radius: 6px;
      padding: 7px 6px;
      background: #2e7d32;
      color: #fff;
      font-size: 11px;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.18);
    ">다맞기</button>
  `;

  controls.querySelector('#dish2-debug-correct')?.addEventListener('click', () => {
    completeQuizForDebug().catch(error => {
      console.error(error);
      alert('Failed to complete the quiz.');
    });
  });

  document.body.appendChild(controls);
}

async function loadWorkbookRows(level) {
  if (workbookCache.has(level)) {
    return workbookCache.get(level);
  }

  const response = await fetch(`${level}.xlsx`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load ${level}.xlsx (${response.status})`);
  }

  const buffer = await response.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  workbookCache.set(level, rows);
  return rows;
}

function getAvailableDays(rows) {
  const uniqueDays = new Set();

  rows.forEach(row => {
    const dayNumber = parseDayNumber(row.Day);
    if (dayNumber != null) {
      uniqueDays.add(dayNumber);
    }
  });

  return [...uniqueDays].sort((a, b) => a - b);
}

function closeResultPopup() {
  if (!resultPopup) return;
  resultPopup.style.display = 'none';
  resultPopup.innerHTML = '';
}

function createPuzzle(word) {
  const trimmed = String(word ?? '').trim();
  const layout = [];
  const slotAnswers = [];
  let firstLetterGiven = false;

  Array.from(trimmed).forEach(char => {
    const isLetter = /[A-Za-z]/.test(char);

    if (isLetter && !firstLetterGiven) {
      layout.push({ type: 'fixed', char });
      firstLetterGiven = true;
      return;
    }

    if (isLetter) {
      const slotIndex = slotAnswers.length;
      slotAnswers.push(char);
      layout.push({ type: 'slot', slotIndex });
      return;
    }

    layout.push({ type: 'separator', char });
  });

  const bankItems = shuffle(
    slotAnswers.map((char, index) => ({
      id: index,
      char,
    }))
  );

  return {
    answer: trimmed,
    layout,
    slotAnswers,
    bankItems,
    slotValues: Array(slotAnswers.length).fill(null),
    activeSlotIndex: slotAnswers.length > 0 ? 0 : -1,
  };
}

function getBankItemById(puzzle, itemId) {
  return puzzle.bankItems.find(item => item.id === itemId) || null;
}

function findNextEmptySlotIndex(puzzle, startIndex = 0) {
  for (let i = startIndex; i < puzzle.slotValues.length; i += 1) {
    if (puzzle.slotValues[i] == null) return i;
  }

  for (let i = 0; i < startIndex; i += 1) {
    if (puzzle.slotValues[i] == null) return i;
  }

  return -1;
}

function syncActiveSlot(puzzle) {
  if (!puzzle) return;
  if (!puzzle.slotValues.length) {
    puzzle.activeSlotIndex = -1;
    return;
  }

  if (
    Number.isInteger(puzzle.activeSlotIndex) &&
    puzzle.activeSlotIndex >= 0 &&
    puzzle.slotValues[puzzle.activeSlotIndex] == null
  ) {
    return;
  }

  puzzle.activeSlotIndex = findNextEmptySlotIndex(puzzle, 0);
}

function updateAnswerChipScale(answerEl, puzzle) {
  const itemCount = Math.max(1, puzzle.layout.length);
  const styles = getComputedStyle(answerEl);
  const padding =
    parseFloat(styles.paddingLeft || '0') +
    parseFloat(styles.paddingRight || '0');
  const measuredWidth = answerEl.clientWidth || answerEl.parentElement?.clientWidth || 0;
  const innerWidth = Math.max(0, measuredWidth - padding - 2);
  const gap = itemCount > 10 ? 2 : itemCount > 7 ? 3 : 7;
  const chipWidth = Math.max(
    14,
    Math.min(42, Math.floor((innerWidth - gap * (itemCount - 1)) / itemCount))
  );
  const chipHeight = Math.max(28, Math.min(52, Math.round(chipWidth * 1.24)));
  const fontSize = Math.max(11, Math.min(25, Math.round(chipWidth * 0.6)));

  answerEl.style.setProperty('--answer-chip-gap', `${gap}px`);
  answerEl.style.setProperty('--answer-chip-width', `${chipWidth}px`);
  answerEl.style.setProperty('--answer-chip-height', `${chipHeight}px`);
  answerEl.style.setProperty('--answer-chip-font', `${fontSize}px`);
  answerEl.style.setProperty('--answer-separator-font', `${Math.max(10, Math.min(20, fontSize))}px`);
}

function buildAttemptString(puzzle, emptyPlaceholder = '') {
  return puzzle.layout
    .map(part => {
      if (part.type === 'fixed' || part.type === 'separator') {
        return part.char;
      }

      const itemId = puzzle.slotValues[part.slotIndex];
      const item = itemId == null ? null : getBankItemById(puzzle, itemId);
      return item ? item.char : emptyPlaceholder;
    })
    .join('');
}

function hasAllSlotsFilled(puzzle) {
  return puzzle.slotValues.every(value => value != null);
}

function renderSetupShell() {
  quizArea.innerHTML = `
    <div class="start-card">
      <div class="start-title">Spelling Scramble Quiz</div>
      <div class="start-subtitle">뜻을 보고 알맞은 영어 단어를 글자 단위로 조립합니다.</div>
      <div class="start-guide">
        <div class="start-guide-item">
          <span class="start-guide-number">1</span>
          <span>아래에 섞여 나온 글자를 하나씩 눌러 빈칸을 채워보세요.</span>
        </div>
        <div class="start-guide-item">
          <span class="start-guide-number">2</span>
          <span>잘못 넣은 글자는 채워진 칸을 다시 누르면 아래로 돌아갑니다.</span>
        </div>
      </div>
      <div class="setup-grid">
        <label class="setup-field">
          Level
          <select id="level-select"></select>
        </label>
        <label class="setup-field">
          Day
          <select id="day-select"></select>
        </label>
      </div>
      <div class="setup-status" id="setup-status">Loading workbook...</div>
      <button class="quiz-btn" style="width: 100%;" id="start-btn" type="button">Start Quiz</button>
    </div>
  `;

  const levelSelect = document.getElementById('level-select');
  levelSelect.innerHTML = LEVELS
    .map(level => `<option value="${level}">${level}</option>`)
    .join('');
  levelSelect.value = currentConfig.level;
}

function renderDirectStartShell() {
  quizArea.innerHTML = `
    <div class="start-card">
      <div class="start-title">Spelling Scramble Quiz</div>
      <div class="start-subtitle">뜻을 보고 알맞은 영어 단어를 글자 단위로 조립합니다.</div>
      <div class="start-summary-card">
        <div class="start-badge-row">
          <span class="start-badge">Level ${escapeHtml(currentConfig.level)}</span>
          <span class="start-badge day">Day ${escapeHtml(currentConfig.day)}</span>
        </div>
        <div class="start-stat-grid">
          <div class="start-stat">
            <strong>30</strong>
            <span>Total</span>
          </div>
          <div class="start-stat">
            <strong>20</strong>
            <span>Current</span>
          </div>
          <div class="start-stat review">
            <strong>10</strong>
            <span>Review</span>
          </div>
        </div>
      </div>
      <div class="start-guide">
        <div class="start-guide-item">
          <span class="start-guide-number">1</span>
          <span>아래에 섞여 나온 글자를 하나씩 눌러 빈칸을 채워보세요.</span>
        </div>
        <div class="start-guide-item">
          <span class="start-guide-number">2</span>
          <span>잘못 넣은 글자는 채워진 칸을 다시 누르면 아래로 돌아갑니다.</span>
        </div>
      </div>
      <button class="quiz-btn" style="width: 100%;" id="direct-start-btn" type="button">Start Quiz</button>
    </div>
  `;

  document.getElementById('direct-start-btn')?.addEventListener('click', () => {
    startQuiz().catch(error => {
      console.error(error);
      alert('Failed to start the quiz.');
    });
  });
}

async function hydrateSetupOptions() {
  renderSetupShell();

  const levelSelect = document.getElementById('level-select');
  const daySelect = document.getElementById('day-select');
  const statusEl = document.getElementById('setup-status');
  const startBtn = document.getElementById('start-btn');

  const applyDays = async preferredDay => {
    const token = ++setupToken;
    startBtn.disabled = true;
    daySelect.disabled = true;
    statusEl.textContent = `Loading ${currentConfig.level}.xlsx...`;

    try {
      const rows = await loadWorkbookRows(currentConfig.level);
      if (token !== setupToken) return;

      currentRows = rows;
      const availableDays = getAvailableDays(rows);

      if (!availableDays.length) {
        currentConfig.day = '';
        daySelect.innerHTML = '<option value="">Unavailable</option>';
        daySelect.disabled = true;
        statusEl.textContent = `${currentConfig.level}.xlsx has no Day data.`;
        return;
      }

      daySelect.innerHTML = availableDays
        .map(dayNumber => `<option value="${dayNumber}">Day ${dayNumber}</option>`)
        .join('');

      const preferred = preferredDay && availableDays.includes(Number(preferredDay))
        ? Number(preferredDay)
        : availableDays[0];

      currentConfig.day = String(preferred);
      daySelect.value = String(preferred);
      daySelect.disabled = false;
      startBtn.disabled = false;
      statusEl.textContent = `${currentConfig.level}.xlsx ready / ${availableDays.length} days`;
      storePrefs();
    } catch (error) {
      console.error(error);
      currentRows = [];
      currentConfig.day = '';
      daySelect.innerHTML = '<option value="">Unavailable</option>';
      daySelect.disabled = true;
      startBtn.disabled = true;
      statusEl.textContent = `Could not load ${currentConfig.level}.xlsx`;
    }
  };

  levelSelect.addEventListener('change', async event => {
    currentConfig.level = event.target.value;
    currentConfig.day = '';
    storePrefs();
    await applyDays('');
  });

  daySelect.addEventListener('change', event => {
    currentConfig.day = event.target.value;
    storePrefs();
  });

  startBtn.addEventListener('click', () => {
    startQuiz().catch(error => {
      console.error(error);
      alert('Failed to start the quiz.');
    });
  });

  await applyDays(currentConfig.day);
}

function mapQuestion(row) {
  return {
    word: String(row.Word).trim(),
    meaning: String(row['Korean Meaning']).trim(),
    partOfSpeech: String(row['Part of Speech'] ?? '').trim(),
    source: row.__review ? 'review' : 'main',
    reviewLevel: row.__reviewLevel || null,
    reviewDay: row.__reviewDay || null,
  };
}

async function buildQuestions(rows, dayNumber) {
  const selectedRows = rows
    .filter(row => parseDayNumber(row.Day) === dayNumber)
    .filter(row => String(row.Word ?? '').trim() && String(row['Korean Meaning'] ?? '').trim());

  const mainRows = shuffle(selectedRows)
    .slice(0, Math.min(QUIZ_SIZE, selectedRows.length));
  const excludeWords = new Set(
    mainRows.map(row => String(row.Word || '').trim().toLowerCase()).filter(Boolean)
  );
  const reviewRows = await window.DishReview?.buildReviewRows?.({
    userId,
    quizKey: quizTitle,
    level: currentConfig.level,
    day: dayNumber,
    loadRows: loadWorkbookRows,
    excludeWords
  }) || [];

  return shuffle([...mainRows, ...reviewRows]).map(mapQuestion);
}

async function startQuiz(options = {}) {
  closeResultPopup();

  const dayNumber = Number(currentConfig.day);
  if (!Number.isFinite(dayNumber)) {
    alert('Pick a day first.');
    return;
  }

  const rows = currentRows.length > 0 ? currentRows : await loadWorkbookRows(currentConfig.level);
  const questions = await buildQuestions(rows, dayNumber);

  if (!questions.length) {
    alert('No quiz data was found for that day.');
    return;
  }

  currentQuestions = questions;
  currentResults = [];
  currentIndex = 0;
  isAnswered = false;
  if (options.render !== false) {
    renderQuestion();
  }
}

async function completeQuizForDebug() {
  if (!isTesterUser() || debugAutoCompleting) return;
  debugAutoCompleting = true;

  try {
    if (!currentQuestions.length) {
      await startQuiz({ render: false });
    }

    if (!currentQuestions.length) {
      alert('No quiz data was found.');
      return;
    }

    currentResults = currentQuestions.map((question, index) => ({
      no: index + 1,
      meaning: question.meaning,
      selected: question.word,
      answer: question.word,
      source: question.source || 'main',
      reviewLevel: question.reviewLevel || null,
      reviewDay: question.reviewDay || null,
      correct: true,
    }));

    currentIndex = currentQuestions.length;
    currentPuzzle = null;
    isAnswered = true;
    showResults();
  } finally {
    debugAutoCompleting = false;
  }
}

function renderQuestion() {
  if (currentIndex >= currentQuestions.length) {
    showResults();
    return;
  }

  isAnswered = false;
  const question = currentQuestions[currentIndex];
  currentPuzzle = createPuzzle(question.word);

  quizArea.innerHTML = `
    <div class="quiz-question-screen">
      <div class="question-top">
        <div>${currentIndex + 1}. ${escapeHtml(currentConfig.level)} / Day ${escapeHtml(currentConfig.day)}</div>
        <div>${currentIndex + 1} / ${currentQuestions.length}</div>
      </div>
      <div class="meaning-card">
        <div class="question-wording">${escapeHtml(question.meaning)}</div>
      </div>
      <div id="scramble-answer" class="scramble-wrap"></div>
      <div class="bank-label">Scrambled letters</div>
      <div id="scramble-bank" class="bank-grid"></div>
      <div id="feedback"></div>
      <button class="quiz-btn check-btn" id="check-btn" type="button">Check</button>
      <div id="answer-toast" class="answer-toast"></div>
    </div>
  `;

  document.getElementById('scramble-answer')?.addEventListener('click', event => {
    if (isAnswered || !currentPuzzle) return;
    const target = event.target.closest('[data-slot-index]');
    if (!target) return;

    const slotIndex = Number(target.getAttribute('data-slot-index'));
    if (!Number.isInteger(slotIndex)) return;

    if (currentPuzzle.slotValues[slotIndex] != null) {
      currentPuzzle.slotValues[slotIndex] = null;
    }

    currentPuzzle.activeSlotIndex = slotIndex;
    renderPuzzleState();
  });

  document.getElementById('scramble-bank')?.addEventListener('click', event => {
    if (isAnswered || !currentPuzzle) return;
    const target = event.target.closest('[data-bank-id]');
    if (!target) return;

    const itemId = Number(target.getAttribute('data-bank-id'));
    if (!Number.isInteger(itemId)) return;
    if (currentPuzzle.slotValues.includes(itemId)) return;

    syncActiveSlot(currentPuzzle);
    const slotIndex =
      currentPuzzle.activeSlotIndex >= 0
        ? currentPuzzle.activeSlotIndex
        : findNextEmptySlotIndex(currentPuzzle, 0);

    if (slotIndex < 0) return;

    currentPuzzle.slotValues[slotIndex] = itemId;
    currentPuzzle.activeSlotIndex = findNextEmptySlotIndex(currentPuzzle, slotIndex + 1);
    renderPuzzleState();
  });

  document.getElementById('check-btn')?.addEventListener('click', () => {
    submitCurrentPuzzle();
  });

  renderPuzzleState();
}

function renderPuzzleState() {
  if (!currentPuzzle) return;
  syncActiveSlot(currentPuzzle);

  const answerEl = document.getElementById('scramble-answer');
  const bankEl = document.getElementById('scramble-bank');
  if (!answerEl || !bankEl) return;

  updateAnswerChipScale(answerEl, currentPuzzle);

  answerEl.innerHTML = currentPuzzle.layout
    .map(part => {
      if (part.type === 'fixed') {
        return `<span class="slot-chip fixed">${escapeHtml(String(part.char).toUpperCase())}</span>`;
      }

      if (part.type === 'separator') {
        return `<span class="slot-chip separator">${escapeHtml(part.char)}</span>`;
      }

      const itemId = currentPuzzle.slotValues[part.slotIndex];
      const item = itemId == null ? null : getBankItemById(currentPuzzle, itemId);
      const isFilled = Boolean(item);
      const classes = ['slot-chip'];
      if (!isFilled) classes.push('empty');
      if (!isFilled && currentPuzzle.activeSlotIndex === part.slotIndex) classes.push('active');

      return `
        <button class="${classes.join(' ')}" type="button" data-slot-index="${part.slotIndex}">
          ${isFilled ? escapeHtml(String(item.char).toUpperCase()) : '&nbsp;'}
        </button>
      `;
    })
    .join('');

  bankEl.innerHTML = currentPuzzle.bankItems
    .map(item => {
      const used = currentPuzzle.slotValues.includes(item.id);
      return `
        <button
          class="bank-letter${used ? ' used' : ''}"
          type="button"
          data-bank-id="${item.id}"
          ${used ? 'disabled' : ''}
        >
          ${escapeHtml(String(item.char).toUpperCase())}
        </button>
      `;
    })
    .join('');
}

function showAnswerToast(message, tone = 'success') {
  const toast = document.getElementById('answer-toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.remove('show', 'error');
  if (tone === 'error') {
    toast.classList.add('error');
  }
  void toast.offsetWidth;
  toast.classList.add('show');
}

function submitCurrentPuzzle() {
  if (isAnswered) return;
  isAnswered = true;

  const question = currentQuestions[currentIndex];
  if (!question || !currentPuzzle) return;

  const attemptDisplay = buildAttemptString(currentPuzzle, '_');
  const attemptValue = buildAttemptString(currentPuzzle, '');
  const fullyFilled = hasAllSlotsFilled(currentPuzzle);
  const correct = fullyFilled && normalizeAnswer(attemptValue) === normalizeAnswer(question.word);
  const selectedLabel = attemptDisplay || 'EMPTY';

  currentResults.push({
    no: currentIndex + 1,
    meaning: question.meaning,
    selected: selectedLabel,
    answer: question.word,
    source: question.source || 'main',
    reviewLevel: question.reviewLevel || null,
    reviewDay: question.reviewDay || null,
    correct,
  });

  const feedback = document.getElementById('feedback');
  if (feedback) {
    feedback.textContent = '';
  }

  if (correct) {
    document.getElementById('scramble-answer')?.classList.add('correct-glow');
    showAnswerToast('Correct!');
  } else {
    document.getElementById('scramble-answer')?.classList.add('incorrect-glow');
    showAnswerToast(`Answer: ${question.word}`, 'error');
  }

  document.querySelectorAll('#quiz-area button').forEach(button => {
    button.disabled = true;
  });

  window.setTimeout(() => {
    currentIndex += 1;
    renderQuestion();
  }, correct ? 1150 : 900);
}

function buildResultsTable() {
  return `
    <table style="width:100%; border-collapse: collapse; font-size: 13px;">
      <thead>
        <tr style="background:#f6f6f6;">
          <th style="padding: 6px; border-bottom: 1px solid #ccc;">번호</th>
          <th style="padding: 6px; border-bottom: 1px solid #ccc;">구분</th>
          <th style="padding: 6px; border-bottom: 1px solid #ccc;">뜻</th>
          <th style="padding: 6px; border-bottom: 1px solid #ccc;">내 답안</th>
          <th style="padding: 6px; border-bottom: 1px solid #ccc;">정답</th>
          <th style="padding: 6px; border-bottom: 1px solid #ccc;">결과</th>
        </tr>
      </thead>
      <tbody>
        ${currentResults
          .map(result => `
            <tr>
              <td style="padding:6px; border-bottom: 1px solid #eee;">${result.no}</td>
              <td style="padding:6px; border-bottom: 1px solid #eee;">${describeResultSource(result)}</td>
              <td style="padding:6px; border-bottom: 1px solid #eee;">${escapeHtml(result.meaning)}</td>
              <td style="padding:6px; border-bottom: 1px solid #eee;">${escapeHtml(result.selected)}</td>
              <td style="padding:6px; border-bottom: 1px solid #eee;">${escapeHtml(result.answer)}</td>
              <td style="padding:6px; border-bottom: 1px solid #eee;">${result.correct ? 'O' : 'X'}</td>
            </tr>
          `)
          .join('')}
      </tbody>
    </table>
  `;
}

function showResults() {
  isAnswered = true;

  const total = currentResults.length;
  const correctCount = currentResults.filter(result => result.correct).length;
  const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const canSubmit = score >= 80;

  if (quizTitle) {
    const storedStage1 = getStoredQuizResult(quizTitle);
    const resultDay = currentConfig.day ? `Day${currentConfig.day}` : '';
    const stage1Rows = storedStage1?.stage === 'dish-quiz1' || storedStage1?.teststatus === 'stage1'
      ? cloneResultRows(storedStage1.testspecific)
      : cloneResultRows(storedStage1?.stage1?.testspecific);
    const stage2Rows = cloneResultRows(currentResults);
    const finalSpecificRows = [
      ...toSubmitSpecificRows(stage1Rows, 'Quiz1'),
      ...toSubmitSpecificRows(stage2Rows, 'Quiz2')
    ].map((row, index) => ({ ...row, no: index + 1 }));

    storeQuizResultWithMap({
      quiztitle: quizTitle,
      subcategory: 'Words',
      level: currentConfig.level,
      day: resultDay,
      teststatus: canSubmit ? 'done' : 'stage2',
      stage: 'dish-quiz2',
      score,
      correctCount,
      totalQuestions: total,
      canSubmit,
      testspecific: finalSpecificRows.length ? finalSpecificRows : toSubmitSpecificRows(stage2Rows, 'Quiz2'),
      stage1: stage1Rows.length
        ? {
            ...(storedStage1?.stage === 'dish-quiz1' || storedStage1?.teststatus === 'stage1' ? storedStage1 : storedStage1?.stage1 || {}),
            testspecific: stage1Rows
          }
        : null,
      stage2: {
        score,
        correctCount,
        totalQuestions: total,
        canSubmit,
        testspecific: stage2Rows
      }
    });
  }

  resultPopup.innerHTML = `
    <div class="popup-content">
      <div style="font-weight: bold; font-size:16px; margin-bottom: 8px;">📄 단어 조립 결과</div>
      <div style="margin-bottom: 8px; font-size: 14px;">
        총 점수: <b>${score}점</b> (${correctCount} / ${total})
      </div>
      <div style="margin-bottom: 10px; font-size: 12px; color:${canSubmit ? '#2e7d32' : '#c62828'}; font-weight: bold;">
        ${canSubmit ? '80점 이상입니다. 제출하러 갈 수 있어요.' : '80점 이상부터 제출할 수 있어요. 다시 한 번 풀어볼까요?'}
      </div>
      <div style="max-height: 260px; overflow-y: auto; margin-bottom: 14px;">
        ${buildResultsTable()}
      </div>
      <div style="display:flex; justify-content: space-between; gap: 10px; margin-top:8px;">
        <button class="quiz-btn" id="retry-btn" type="button" style="flex: 1; margin-top: 0;">재도전</button>
        ${
          directMode
            ? `<button class="quiz-btn" id="submit-btn" type="button" style="flex: 1; margin-top: 0; background:#1976d2;" ${canSubmit && quizTitle ? '' : 'disabled'}>제출하러 가기</button>`
            : `<button class="quiz-btn secondary" id="setup-btn" type="button" style="flex: 1; margin-top: 0;">Change Set</button>`
        }
      </div>
    </div>
  `;

  resultPopup.style.display = 'flex';

  document.getElementById('retry-btn')?.addEventListener('click', () => {
    closeResultPopup();
    startQuiz().catch(error => {
      console.error(error);
      alert('Failed to restart the quiz.');
    });
  });

  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn && (!canSubmit || !quizTitle)) {
    submitBtn.style.opacity = '0.5';
    submitBtn.style.cursor = 'not-allowed';
  }

  submitBtn?.addEventListener('click', () => {
    returnToTray();
  });

  document.getElementById('setup-btn')?.addEventListener('click', () => {
    closeResultPopup();
    hydrateSetupOptions().catch(error => {
      console.error(error);
      alert('Failed to load the setup screen.');
    });
  });
}

function returnToTray() {
  const url = `homework-tray_v1.html?id=${encodeURIComponent(userId)}&quizKey=${encodeURIComponent(quizTitle)}`;
  window.location.replace(url);
}

window.addEventListener('DOMContentLoaded', async () => {
  quizArea = document.getElementById('quiz-area');
  resultPopup = document.getElementById('result-popup');

  const params = new URLSearchParams(window.location.search);
  const prefs = readPrefs();
  userId = params.get('id') || '';
  quizTitle = String(params.get('key') || '').trim();
  directMode = Boolean(quizTitle);
  renderTesterDebugControls();

  const keyMeta = window.DishReview?.parseQuizKey?.(quizTitle) || {};
  const requestedLevel = String(params.get('level') || keyMeta.level || prefs.level || currentConfig.level).toUpperCase();
  const requestedDay = parseDayNumber(params.get('day') || keyMeta.day || prefs.day || '');

  currentConfig.level = LEVELS.includes(requestedLevel) ? requestedLevel : 'A1';
  currentConfig.day = requestedDay ? String(requestedDay) : '';
  storePrefs();

  document.getElementById('back-btn')?.addEventListener('click', () => {
    history.back();
  });

  resultPopup?.addEventListener('click', event => {
    if (event.target === resultPopup) {
      closeResultPopup();
    }
  });

  try {
    if (directMode && currentConfig.day) {
      currentRows = await loadWorkbookRows(currentConfig.level);
      renderDirectStartShell();
    } else {
      await hydrateSetupOptions();
    }
  } catch (error) {
    console.error(error);
    quizArea.innerHTML = `
      <div style="
        background: #fff3e0;
        padding: 16px;
        border-radius: 12px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        font-size: 14px;
      ">
        <div style="font-size:18px; font-weight:bold; color:#7e3106; margin-bottom:12px;">Setup failed</div>
        <div>Reload the page and try again.</div>
      </div>
    `;
  }
});
