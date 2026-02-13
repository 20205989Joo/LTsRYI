// kiosk_subpopup.js

window.selectedItems = [];

function updateSelectedDisplay() {
  const list = document.getElementById('selectedList');
  if (!list) return;
  list.innerHTML = '';

  const RANGES = {
    '단어': {
      'A1': [1, 45],
      'A2': [46, 89],
      'B1': [90, 130],
      'B2': [131, 201],
      'C1': [202, 266],
    },
    '연어': {
      '900핵심연어': [1, 42],
    },
    '문법': {
      'Basic': [1, 50],
    },
    '단계별 독해': {
      'RCStepper': [1, 50],
    },
  };

  selectedItems.forEach((item, index) => {
    const tag = document.createElement('div');
    tag.className = 'selected-tag';

    let dayStr = '';
    if (item.Level && item.LessonNo !== undefined) {
      const range = RANGES[item.Subcategory]?.[item.Level];
      if (range) {
        const [start] = range;
        const day = item.LessonNo - start + 1;
        dayStr = ` - Day ${day}`;
      }
    }

    tag.innerHTML = `
      ${item.label}${item.Subcategory ? ' - ' + item.Subcategory : ''}
      ${item.Level ? ' - ' + item.Level : ''}
      ${dayStr}
      <span class="remove-tag" data-index="${index}">✖</span>
    `;
    list.appendChild(tag);
  });

  document.querySelectorAll('.remove-tag').forEach(span => {
    span.onclick = () => {
      const idx = parseInt(span.dataset.index, 10);
      selectedItems.splice(idx, 1);
      updateSelectedDisplay();
    };
  });
}

// ✅ 기본 서브팝업 (단어/문법/독해/구문)
function renderBasicSubPopup(label) {
  const subPopup = document.getElementById('sub-popup');
  const container = document.querySelector('.sub-popup-inner');
  if (!subPopup || !container) return;

  subPopup.classList.remove('hidden');
  container.innerHTML = '';

  const temp = { label };

  container.innerHTML = `
    <div style="position: relative; min-height: 290px; padding-bottom: 70px;">
      <div class="sub-section" id="subcategorySection"></div>
      <div class="sub-section" id="levelSection"></div>
      <div class="sub-section" id="lessonSection"></div>

      <div class="sub-footer" style="position:absolute; bottom:16px; width:100%; text-align:center;">
        <button class="order-btn confirm-btn" id="subPopupAddBtn">🛒 담기</button>
      </div>
    </div>
  `;

  document.getElementById('subPopupCloseBtn').onclick = () => {
    subPopup.classList.add('hidden');
  };

  document.getElementById('subPopupAddBtn').onclick = () => {
    if (temp.Subcategory && temp.Level && temp.LessonNo !== undefined) {
      const duplicate = selectedItems.some(
        item =>
          item.label === temp.label &&
          item.Subcategory === temp.Subcategory &&
          item.Level === temp.Level &&
          item.LessonNo === temp.LessonNo
      );

      if (!duplicate) {
        selectedItems.push({ ...temp });
        updateSelectedDisplay();
      }
      subPopup.classList.add('hidden');
    } else {
      alert('모든 항목을 선택해주세요!');
    }
  };

  renderSubcategoryOptions(label, temp);
}

function renderSubcategoryOptions(label, temp) {
  const section = document.getElementById('subcategorySection');
  if (!section) return;

  const map = {
    '단어': ['단어', '연어'],
    '문법': ['문법'],
    '구문': ['단계별 독해'],
  };

  section.innerHTML = '세부 유형을 골라주세요:<br>';
  (map[label] || []).forEach(sub => {
    const btn = document.createElement('button');
    btn.className = 'menu-btn small';
    btn.innerText = sub;
    btn.onclick = () => {
      temp.Subcategory = sub;
      document.querySelectorAll('#subcategorySection .menu-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderLevelOptions(temp);
    };
    section.appendChild(btn);
  });
}

function renderLevelOptions(temp) {
  const section = document.getElementById('levelSection');
  if (!section) return;

  const levelMap = {
    '단어': ['A1', 'A2', 'B1', 'B2', 'C1'],
    '연어': ['900핵심연어'],
    '문법': ['Basic'],
    '단계별 독해': ['RCStepper'], // ✅ 따옴표 수정됨
  };

  section.innerHTML = '난이도를 골라주세요:<br>';
  const levels = levelMap[temp.Subcategory] || [];
  levels.forEach(level => {
    const btn = document.createElement('button');
    btn.className = 'menu-btn small';
    btn.innerText = level;
    btn.onclick = () => {
      temp.Level = level;
      document.querySelectorAll('#levelSection .menu-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderLessonOptions(temp);
    };
    section.appendChild(btn);
  });
}

function renderLessonOptions(temp) {
  const section = document.getElementById('lessonSection');
  if (!section) return;

  section.innerHTML = 'Day를 골라주세요:<br>';
  const RANGES = {
    '단어': {
      'A1': [1, 45],
      'A2': [46, 89],
      'B1': [90, 130],
      'B2': [131, 201],
      'C1': [202, 266],
    },
    '연어': { '900핵심연어': [1, 42] },
    '문법': { 'Basic': [1, 50] },
    '단계별 독해': { 'RCStepper': [1, 50] },
  };

  const range = RANGES[temp.Subcategory]?.[temp.Level];
  if (!range) return;
  const [start, end] = range;
  const total = end - start + 1;

  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.alignItems = 'center';
  wrapper.style.gap = '8px';
  wrapper.style.marginTop = '8px';

  const minus = document.createElement('button');
  minus.textContent = '－';
  const plus = document.createElement('button');
  plus.textContent = '＋';
  const input = document.createElement('input');
  input.type = 'number';
  input.value = 1;
  input.min = 1;
  input.max = total;
  input.style.width = '60px';
  input.style.textAlign = 'center';

  const updateValue = () => {
    let v = parseInt(input.value, 10);
    if (isNaN(v)) v = 1;
    v = Math.min(Math.max(v, 1), total);
    input.value = v;
    temp.LessonNo = start + (v - 1);
  };
  minus.onclick = () => { input.value = Math.max(1, parseInt(input.value) - 1); updateValue(); };
  plus.onclick = () => { input.value = Math.min(total, parseInt(input.value) + 1); updateValue(); };
  input.oninput = updateValue;
  updateValue();

  wrapper.appendChild(minus);
  wrapper.appendChild(input);
  wrapper.appendChild(plus);
  section.appendChild(wrapper);
}

// ✅ 셀프 체크 전용 팝업
function renderSelfCheckSubPopup() {
  const container = document.querySelector('.sub-popup-inner');
  const subPopup = document.getElementById('sub-popup');
  if (!container || !subPopup) return;

  subPopup.classList.remove('hidden');
  container.innerHTML = `
    <div style="position: relative; min-height: 240px; padding-bottom: 70px;">
      <div style="margin: 12px 0 18px; font-size: 14px;">
        어떤 셀프 체크를 할지 골라주세요.
      </div>

      <div style="display:flex; gap:10px; justify-content:center; margin-bottom:12px;">
        <button class="menu-btn small" data-selfcheck="베이스 체커">베이스 체커</button>
        <button class="menu-btn small" data-selfcheck="셀프 단어시험">셀프 단어시험</button>
      </div>

      <div class="sub-footer" style="position:absolute; bottom:16px; width:100%; text-align:center;">
        <button class="order-btn confirm-btn" id="subPopupAddBtn">🛒 담기</button>
      </div>
    </div>
  `;

  document.getElementById('subPopupCloseBtn').onclick = () => {
    subPopup.classList.add('hidden');
  };

  let choice = null;
  container.querySelectorAll('[data-selfcheck]').forEach(btn => {
    btn.addEventListener('click', () => {
      choice = btn.getAttribute('data-selfcheck');
      container.querySelectorAll('[data-selfcheck]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  document.getElementById('subPopupAddBtn').onclick = () => {
    if (!choice) {
      alert('먼저 항목을 선택해주세요!');
      return;
    }
    const duplicate = selectedItems.some(item => item.label === choice);
    if (!duplicate) {
      selectedItems.push({ label: choice });
      updateSelectedDisplay();
    }
    subPopup.classList.add('hidden');
  };
}

// ✅ 기본 renderSubPopup 확장
function renderSubPopup(label) {
  if (label === '셀프 체크') {
    renderSelfCheckSubPopup();
    return;
  }

  const container = document.querySelector('.sub-popup-inner');
  const subPopup = document.getElementById('sub-popup');
  if (!container || !subPopup) return;

  subPopup.classList.remove('hidden');
  container.innerHTML = `
    <div style="position: relative; min-height: 240px; padding-bottom: 70px;">
      <div class="info-message" style="margin-top: 50px;">*상세 내용은 테이블에서 작성해주세요</div>
      <div class="sub-footer" style="position:absolute; bottom:16px; width:100%; text-align:center;">
        <button class="order-btn confirm-btn" id="subPopupAddBtn">🛒 담기</button>
      </div>
    </div>
  `;

  document.getElementById('subPopupCloseBtn').onclick = () => {
    subPopup.classList.add('hidden');
  };

  document.getElementById('subPopupAddBtn').onclick = () => {
    const duplicate = selectedItems.some(item => item.label === label);
    if (!duplicate) {
      selectedItems.push({ label });
      updateSelectedDisplay();
    }
    subPopup.classList.add('hidden');
  };
}
