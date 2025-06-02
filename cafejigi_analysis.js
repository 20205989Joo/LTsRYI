function subjectLabel(key) {
  return { vocab: "단어", grammar: "문법", pattern: "구문", reading: "독해" }[key] || key;
}

const CEFR_LEVELS = {
  vocab: { A1: [1, 50], A2: [51, 100], B1: [101, 150], B2: [151, 200], C1: [201, 250] },
  pattern: { A1: [0, 20], A2: [21, 40], B1: [41, 60], B2: [61, 80], C1: [81, 100] }
};

async function loadStudentProgress() {
  const userId = new URLSearchParams(location.search).get("id") || "Tester";
  const res = await fetch(`https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app/api/getProgressMatrixAll?UserId=${userId}`);
  const raw = await res.json();

  const lessons = {};
  for (const subject in raw) {
    if (subject === 'rc') continue;
    const alias = subject;
    lessons[alias] = {};
    for (const { LessonNo, Status } of raw[subject]) {
      lessons[alias][LessonNo.toString()] = Status;
    }
  }

  return lessons;
}

function expandLessonRange(key) {
  const result = [];
  if (/^\d+$/.test(key)) {
    result.push(parseInt(key));
  } else if (/^\d+~\d+(,\d+~\d+)*$/.test(key)) {
    const ranges = key.split(',');
    for (const range of ranges) {
      const [start, end] = range.split('~').map(Number);
      for (let i = start; i <= end; i++) result.push(i);
    }
  }
  return result;
}

function getProgressRate(subjectData) {
  if (!subjectData) return 0;
  const all = Object.keys(subjectData).flatMap(expandLessonRange);
  const done = Object.entries(subjectData)
    .filter(([_, v]) => v === 'done')
    .flatMap(([k]) => expandLessonRange(k));
  const doneSet = new Set(done);
  const total = new Set(all).size;
  const passed = [...doneSet].length;
  return total === 0 ? 0 : Math.round((passed / total) * 100);
}

function estimateLevel(subjectData, levels, subjectName) {
  if (!subjectData) return "-";

  if (subjectName === "vocab") {
    for (const [level, [start, end]] of Object.entries(levels)) {
      let passCount = 0;
      let total = 0;
      for (let i = start; i <= end; i++) {
        const status = subjectData[i.toString()];
        if (status) {
          total++;
          if (status === "done") passCount++;
        }
      }
      if (total > 0 && passCount / total >= 0.8) return level;
    }
    return "초입";
  }

  if (subjectName === "pattern") {
    const rate = getProgressRate(subjectData);
    for (const [level, [min, max]] of Object.entries(levels)) {
      if (rate >= min && rate <= max) return level;
    }
    return "초입";
  }

  if (subjectName === "grammar") {
    const rate = getProgressRate(subjectData);
    if (rate > 80) return "B2";
    if (rate > 50) return "B1";
    return "A1";
  }

  return "-";
}

function findNextLesson(subjectData) {
  if (!subjectData) return null;
  const entries = Object.entries(subjectData)
    .map(([k, v]) => ({ num: parseInt(k), status: v }))
    .filter(e => !isNaN(e.num))
    .sort((a, b) => a.num - b.num);
  const next = entries.find(e => e.status === "notyet");
  return next ? next.num : null;
}

function analyzeStudentProgress(progressData) {
  const result = {};
  for (const subject of Object.keys(progressData)) {
    const subjectData = progressData[subject];
    const levelMap = CEFR_LEVELS[subject];

    if (subject === 'reading') {
      result[subject] = {
        rate: 0,
        level: '-',
        next: null,
        message: '아직 준비 중이에요!'
      };
      continue;
    }

    result[subject] = {
      rate: getProgressRate(subjectData),
      level: estimateLevel(subjectData, levelMap, subject),
      next: findNextLesson(subjectData)
    };
  }
  return result;
}

async function summaryMain() {
  const userId = new URLSearchParams(location.search).get("id");
  const progress = await loadStudentProgress();
  const analysis = analyzeStudentProgress(progress);

  let diligenceText = '';
  try {
    const res = await fetch(`https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app/api/getDiligenceStats?userId=${userId}`);
    const d = await res.json();
    const latestDay = d.recent7Days?.reverse().find(e => e.count > 0)?.date || null;

    diligenceText = `
      <br><br>
      🕒 <b>성실도 분석</b><br>
      총 <b>${d.totalSubmissions}</b>건 제출, 지각 <b>${d.lateCount}</b>회 (${d.lateRate}% 지각률)<br>
      평균 지각시간: <b>${d.averageLateMinutes}분</b><br>
      가장 자주 제출한 과목: <b>${d.mostFrequentSubject}</b><br>
      최근 7일 중 <b>${d.recent7Days.filter(e => e.count > 0).length}</b>일 제출<br>
      가장 최근 제출일: <b>${latestDay || '없음'}</b>
    `;
  } catch (err) {
    diligenceText = "<br><br>🚨 성실도 분석 불러오기 실패";
    console.error("getDiligenceStats 에러:", err);
  }

  const display = document.getElementById('displayArea');
  display.innerHTML = `
    <div class="summary-grid">
      ${Object.entries(analysis).map(([subject, data]) => `
        <div class="stat-box">
          <div class="label">${subjectLabel(subject)}</div>
          <div class="bar"><div class="fill" style="width: ${data.rate}%;"></div></div>
        </div>
      `).join('')}
    </div>
  `;

  const dialogueBox = document.getElementById('dialogueBox');
  dialogueBox.innerHTML = `
    <div>📋 <b>저 지금 잘하고있나요?</b></div>
    <div style="font-size: 13px; max-height: 240px; overflow-y: auto; padding-right: 6px;">
      ${Object.entries(analysis).map(([subject, data]) => {
        const label = subjectLabel(subject);

        if (data.message) {
          return `<b>${label}</b>: ${data.message}<br><br>`;
        }

        if (data.rate === 0) {
          return `<b>${label}</b>: 아직 통계낼 수 있는 데이터가 없어요. 레벨테스트나 초기 숙제를 기다려봅시다!<br><br>`;
        }

        const levelText = data.level === "-" || data.level === "초입"
          ? "초입 단계에 있어요. 지금부터 차근차근 시작해볼까요?"
          : `${data.level} 수준이에요.`;

        const nextText = data.next
          ? `다음 추천 진도는 Lesson ${data.next}번이에요.`
          : `이 과목은 현재까지 모든 숙제를 완료하셨어요. 멋져요!`;

        return `<b>${label}</b>: ${levelText}<br>${nextText}<br><br>`;
      }).join('')}

      ${diligenceText}
    </div>
    <button id="backBtn">← 돌아가기</button>
  `;
  document.getElementById('backBtn').onclick = () => location.reload();
}

window.recommendMain = async function () {
  const userId = new URLSearchParams(location.search).get("id") || "Tester";
  const display = document.getElementById('displayArea');
  const dialogueBox = document.getElementById('dialogueBox');

  display.innerHTML = "🤖 학습 데이터를 분석 중입니다...";

  try {
    const progress = await loadStudentProgress();

    const simpleNextLesson = (subject, subjectData) => {
      if (!subjectData) return null;
      const allNums = [];

      for (const [k, v] of Object.entries(subjectData)) {
        if (v !== 'done') {
          const expanded = expandLessonRange(k);
          allNums.push(...expanded);
        }
      }

      const next = allNums.sort((a, b) => a - b)[0];
      return next || null;
    };

    const recommended = [];

    for (const subject of ['vocab', 'grammar', 'pattern']) {
      const subjectData = progress[subject];
      if (!subjectData) continue;
      const next = simpleNextLesson(subject, subjectData);
      if (next != null) {
        recommended.push({
          subject,
          label: subjectLabel(subject),
          lesson: next
        });
      }
    }

    if (recommended.length === 0) {
      dialogueBox.innerHTML = `
        <div>✅ 이미 모든 과목의 숙제를 완료하셨어요!</div>
        <button id="backBtn">← 돌아가기</button>
      `;
      display.innerHTML = '';
      document.getElementById('backBtn').onclick = () => location.reload();
      return;
    }

    let resultHTML = `
      <div>📋 <b>저 뭐하면 좋죠?</b></div>
      <div style="font-size: 13px;">
        학습 데이터를 분석해<br>
        <b>다음 진도를 추천</b>해드릴게요!<br><br>
    `;

    recommended.forEach(r => {
      resultHTML += `👉 <b>${r.label}</b> 과목의 Lesson <b>${r.lesson}</b>을 해보세요!<br>`;
    });

    resultHTML += `</div><button id="backBtn">← 돌아가기</button>`;

    dialogueBox.innerHTML = resultHTML;
    display.innerHTML = '';
    document.getElementById('backBtn').onclick = () => location.reload();

  } catch (err) {
    console.error('❌ 추천 분석 실패:', err);
    display.innerHTML = "🚨 추천 분석 중 오류가 발생했습니다.";
  }
};

window.loadedCafejigiAnalysis = true;
