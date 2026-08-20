// kiosk_mainpopup.js

function getDayManager() {
  return window.DayManager || null;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isKioskTesterUser() {
  const id = new URLSearchParams(window.location.search).get('id');
  return String(id || '').trim().toLowerCase() === 'tester';
}

function isKioskTesterUnlockedMenu(label) {
  return isKioskTesterUser() && label === '문법';
}

const KIOSK_UI_COPY = Object.freeze({
  header: '원하시는 메뉴를 주문해주세요',
  problemTitle: '문제',
  problemSubtitle: 'quiz & tests',
  checkTitle: '진단 도구',
  checkSubtitle: 'checks',
  todayHomework: '오늘 내 숙제',
  comingSoon: '준비중',
  updating: '업데이트 중'
});

const KIOSK_MENU_HELP = Object.freeze({
  '단어': '단어와 연어 학습 문제를 골라 접시에 담습니다.',
  '문법': '문법 학습 메뉴입니다. 현재 준비 중입니다.',
  '구문': '문장 구조를 익히는 학습 메뉴입니다. 현재 준비 중입니다.',
  '독해': '독해 학습 메뉴입니다. 현재 준비 중입니다.',
  'misc': 'tester 전용 실험 메뉴입니다.',
  '셀프 체크': '베이스 체커와 셀프 단어시험 등의 진단 도구를 선택합니다.'
});

function closeKioskMenuHelp(exceptTile = null) {
  document.querySelectorAll('.kiosk-menu-tile.help-open').forEach(tile => {
    if (tile === exceptTile) return;
    tile.classList.remove('help-open');
    tile.querySelector('.kiosk-menu-help')?.setAttribute('aria-expanded', 'false');
    const tooltip = tile.querySelector('.kiosk-menu-tooltip');
    if (tooltip) tooltip.hidden = true;
  });
}

function decorateKioskMenu(container) {
  if (!container) return;

  const header = container.querySelector('.popup-header-text');
  if (header) header.textContent = KIOSK_UI_COPY.header;

  const problemTab = container.querySelector('[data-tab="tukurry"]');
  if (problemTab) {
    problemTab.innerHTML =
      `<span class="tab-large">${KIOSK_UI_COPY.problemTitle}</span>` +
      `<span class="tab-small">${KIOSK_UI_COPY.problemSubtitle}</span>`;
  }

  const checkTab = container.querySelector('[data-tab="etc"]');
  if (checkTab) {
    checkTab.innerHTML =
      `<span class="tab-large">${KIOSK_UI_COPY.checkTitle}</span>` +
      `<span class="tab-small">${KIOSK_UI_COPY.checkSubtitle}</span>`;
  }

  container.querySelectorAll('#tab-etc .menu-btn').forEach(button => {
    if (button.textContent.trim() === KIOSK_UI_COPY.todayHomework) {
      button.remove();
    }
  });

  const unavailableLabels = new Set([
    '문법',
    '구문',
    '독해'
  ]);

  container.querySelectorAll('.menu-btn.square').forEach((menuButton, index) => {
    const label = menuButton.textContent.trim();
    const tile = document.createElement('div');
    tile.className = 'kiosk-menu-tile';
    menuButton.parentNode.insertBefore(tile, menuButton);
    tile.appendChild(menuButton);

    if (unavailableLabels.has(label)) {
      const isTesterUnlocked = isKioskTesterUnlockedMenu(label);
      const isUpdating = label === '문법';
      if (isTesterUnlocked) {
        tile.classList.add('is-tester-preview');
      } else {
        tile.classList.add('is-coming-soon');
        menuButton.disabled = true;
        menuButton.setAttribute('aria-disabled', 'true');
      }
      if (isUpdating) tile.classList.add('is-updating');

      const ribbon = document.createElement('span');
      ribbon.className = 'kiosk-coming-soon';
      ribbon.textContent = isUpdating
        ? KIOSK_UI_COPY.updating
        : KIOSK_UI_COPY.comingSoon;
      ribbon.setAttribute('aria-hidden', 'true');
      tile.appendChild(ribbon);
    }

    const tooltipId = `kiosk-menu-tooltip-${index + 1}`;
    const helpButton = document.createElement('button');
    helpButton.type = 'button';
    helpButton.className = 'kiosk-menu-help';
    helpButton.textContent = '?';
    helpButton.title = 'Help';
    helpButton.setAttribute('aria-label', `${label} help`);
    helpButton.setAttribute('aria-controls', tooltipId);
    helpButton.setAttribute('aria-expanded', 'false');

    const tooltip = document.createElement('div');
    tooltip.id = tooltipId;
    tooltip.className = 'kiosk-menu-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    tooltip.textContent =
      KIOSK_MENU_HELP[label] ||
      `${label} 메뉴의 세부 도구를 확인합니다.`;
    tooltip.hidden = true;

    helpButton.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();

      const willOpen = !tile.classList.contains('help-open');
      closeKioskMenuHelp(tile);
      tile.classList.toggle('help-open', willOpen);
      helpButton.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      tooltip.hidden = !willOpen;
    });

    tile.appendChild(helpButton);
    tile.appendChild(tooltip);
  });
}

function getCurriculumCategories() {
  const dm = getDayManager();

  if (
    !dm ||
    typeof dm.listCategories !== 'function' ||
    typeof dm.listSubcategories !== 'function'
  ) {
    return ['단어', '문법', '구문', '독해'];
  }

  const categories = dm.listCategories();
  const selectable = categories.filter(category => {
    if (String(category).toLowerCase() === 'misc' && !isKioskTesterUser()) return false;
    if (category === '기타') return false;
    const subs = dm.listSubcategories(category) || [];
    return subs.length > 0;
  });

  return selectable.length > 0 ? selectable : ['단어', '문법', '구문', '독해'];
}

// 팝업 HTML 구조 삽입
function injectKioskPopupHTML() {
  const curriculumButtonsHtml = getCurriculumCategories()
    .map(category => (
      `<button class="menu-btn square" data-menu-type="curriculum">${escapeHtml(category)}</button>`
    ))
    .join('');

  const html = `
    <div id="popup" class="popup" style="display: none;">
      <button class="popup-close" id="popupCloseBtn">✖</button>
      <div class="popup-content">
        <div class="popup-header-text">오늘의 숙제를 주문해주세요</div>

        <div class="tabs">
          <button class="tab active" data-tab="tukurry">
            <span class="tab-large">숙제</span><br><span class="tab-small">주세요</span>
          </button>
          <button class="tab" data-tab="etc">
            <span class="tab-large">내 숙제</span><br><span class="tab-small">할래요</span>
          </button>
        </div>

        <div class="tab-content" id="tab-tukurry">
          ${curriculumButtonsHtml}
        </div>

        <div class="tab-content hidden" id="tab-etc">
          <button class="menu-btn square" data-menu-type="etc">오늘 내 숙제</button>
          <button class="menu-btn square" data-menu-type="etc">셀프 체크</button>
        </div>

        <div id="sub-popup" class="sub-popup hidden">
          <button class="popup-close" id="subPopupCloseBtn">✖</button>
          <div class="sub-popup-inner"></div>
        </div>

        <div class="selection-status">
          <div class="selection-status-title"><span>선택된 항목</span></div>
          <div id="selectedList" class="selected-list"></div>
        </div>

        <button class="order-btn" id="finalOrderBtn">🛒 주문하기</button>
      </div>
    </div>
  `;

  const container = document.getElementById('popup-container');
  if (container) {
    container.innerHTML = html;
    decorateKioskMenu(container);
  }
}

// 팝업 UI 초기 설정
function setupKioskUI() {
  const kiosk = document.getElementById('kiosk');
  if (!kiosk) return;

  kiosk.addEventListener('click', () => {
    const popup = document.getElementById('popup');
    if (!popup) return;

    popup.style.display = 'flex';

    // ⬇️ 전역 함수 (kiosk_subpopup.js에서 정의)
    updateSelectedDisplay();
    setupTabs();
    bindMenuButtons();

    document.getElementById('popupCloseBtn').onclick = () => {
      popup.style.display = 'none';
    };

    // ⬇️ 최종 주문 → kiosk_receipt.js의 handleFinalOrder
    document.getElementById('finalOrderBtn').onclick = handleFinalOrder;
  });
}

// 탭 전환 처리
function setupTabs() {
  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.add('hidden'));

      tab.classList.add('active');
      const targetId = 'tab-' + tab.dataset.tab;
      const content = document.getElementById(targetId);
      if (content) content.classList.remove('hidden');
    });
  });
}

// 메뉴 버튼 클릭 처리
function bindMenuButtons() {
  document.querySelectorAll('#tab-tukurry .menu-btn, #tab-etc .menu-btn').forEach(btn => {
    btn.onclick = () => {
      const label = btn.textContent.trim();
      const menuType = btn.dataset.menuType;
      if (menuType === 'curriculum') {
        // ⬇️ 세부 유형 + Level + Day까지 고르는 기본 서브팝업
        renderBasicSubPopup(label);
      } else {
        // ⬇️ 그 외 (오늘 내 숙제, 셀프 체크 등)
        renderSubPopup(label);
      }
    };
  });

  const subPopupClose = document.getElementById('subPopupCloseBtn');
  if (subPopupClose) {
    subPopupClose.onclick = () => {
      document.getElementById('sub-popup')?.classList.add('hidden');
    };
  }
}

// 최초 실행
window.addEventListener('DOMContentLoaded', () => {
  injectKioskPopupHTML();
  setupKioskUI();
  document.addEventListener('click', () => closeKioskMenuHelp());
});
