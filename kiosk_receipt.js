// kiosk_receipt.js

function getDayManager() {
  return window.DayManager || null;
}

function resolveSubcategoryName(subcategory) {
  const dm = getDayManager();
  if (!subcategory || !dm || typeof dm.resolveSubcategoryName !== 'function') return subcategory;
  return dm.resolveSubcategoryName(subcategory) || subcategory;
}

function inferLevel(subcategory, level, lessonNo) {
  const dm = getDayManager();
  const canonicalSub = resolveSubcategoryName(subcategory);
  if (!dm || !level || lessonNo === undefined || lessonNo === null) return null;

  if (typeof dm.getDay !== 'function') return null;
  const day = dm.getDay(canonicalSub, level, lessonNo);
  if (day == null) return null;

  const range =
    typeof dm.getRange === 'function'
      ? dm.getRange(canonicalSub, level)
      : null;

  return {
    start: range?.start ?? null,
    day,
    subcategory: canonicalSub
  };
}

let redirectTimerId = null;

function clearRedirectTimer() {
  if (!redirectTimerId) return;
  clearTimeout(redirectTimerId);
  redirectTimerId = null;
}

function cleanupRedirectUI() {
  document.getElementById('redirect-toast')?.remove();
  document.getElementById('redirect-overlay')?.remove();
}

// ✅ 최종 주문 처리 (주문 담기 버튼)
window.handleFinalOrder = function () {
  const MAX_LIMIT = 6;

  if (!Array.isArray(window.selectedItems) || window.selectedItems.length === 0) {
    alert("선택된 항목이 없습니다.");
    return;
  }

  if (window.selectedItems.length > MAX_LIMIT) {
    alert(`❌ 하루 최대 ${MAX_LIMIT}개까지만 주문할 수 있어요!\n현재 ${window.selectedItems.length}개 담으셨습니다.`);
    return;
  }

  const hwPlusEntries = [];
  let receiptText = '';

  window.selectedItems.forEach(entry => {
    // Level/Day를 가진 일반 진도형
    if (entry.Subcategory && entry.Level && entry.LessonNo !== undefined && entry.LessonNo !== null) {
      const canonicalSub = resolveSubcategoryName(entry.Subcategory);
      const meta = inferLevel(canonicalSub, entry.Level, entry.LessonNo);
      const day = entry.Day ?? meta?.day ?? null;
      hwPlusEntries.push({
        Subcategory: canonicalSub,
        Level: entry.Level,
        LessonNo: entry.LessonNo,
        Day: day,
        Path: entry.Path || null,
        QuizKey: entry.QuizKey || null,
        LessonTag: entry.LessonTag || null
      });

      const dayStr = day != null ? `Day ${day}` : `Lesson ${entry.LessonNo}`;
      receiptText += `${entry.label || canonicalSub} > ${entry.Level} > ${dayStr}\n`;
      return;
    }

    // Subcategory만 있는 유형 (Level/Day 없음)
    if (entry.Subcategory) {
      const canonicalSub = resolveSubcategoryName(entry.Subcategory);
      hwPlusEntries.push({
        Subcategory: canonicalSub,
        Level: null,
        LessonNo: null
      });
      receiptText += `${entry.label || canonicalSub} > ${canonicalSub}\n`;
      return;
    }

    // label-only 항목 (오늘 내 숙제 / 시험지 만들어주세요 등)
    hwPlusEntries.push({
      Subcategory: entry.label,
      Level: null,
      LessonNo: null
    });
    receiptText += `${entry.label}\n`;
  });

  localStorage.setItem('HWPlus', JSON.stringify(hwPlusEntries));
  console.log("✅ [저장된 HWPlus]:", hwPlusEntries);

  const popup = document.getElementById('popup');
  if (popup) popup.style.display = 'none';

  const tray = document.getElementById('food-tray');
  if (tray) tray.style.display = 'block';

  if (!document.getElementById('receipt_icon')) {
    const icon = document.createElement('img');
    icon.src = 'receipt_icon.png';
    icon.id = 'receipt_icon';
    icon.className = 'nav-floating-icon nav-floating-icon--receipt-room';
    icon.onclick = () => window.showReceiptFromHWPlus(); // 나중에 보는 영수증
    document.querySelector('.main-page').appendChild(icon);
  }

  // ✅ 주문 직후: 영수증 + 1.5초 후 테이블로 이동
  showReceiptAgain(receiptText, { autoRedirect: true });
};


// ✅ 영수증 표시 공통 함수
function showReceiptAgain(text, options = {}) {
  const { autoRedirect = false } = options;

  clearRedirectTimer();
  cleanupRedirectUI();

  const existing = document.getElementById('temp-receipt');
  if (existing) existing.remove();

  const host = document.querySelector('.main-page') || document.body;

  // ░░ 영수증 박스 ░░
  const receipt = document.createElement('div');
  receipt.id = 'temp-receipt';
  receipt.className = 'receipt-box';
  receipt.innerHTML = `
    <div class="receipt-title">📄 주문 영수증</div>
    <div class="receipt-content">${text.trim().replace(/\n/g, '<br>')}</div>
    <div style="text-align: right;">
      <button class="room-btn" style="
        background-color : rgb(241, 96, 91);
        color: rgb(254, 254, 254);
        font-size: 12px;
        padding: 4px 8px;
        height: auto;
        box-shadow: none;
        border: 1px solid #ccc;
        border-radius: 6px;
        cursor: pointer;
      " id="cancelOrderBtn">🗑 주문 취소</button>
    </div>
  `;
  host.appendChild(receipt);

  // ░░ 자동 이동 토스트 (autoRedirect=true일 때만) ░░
  if (autoRedirect) {
    const overlay = document.createElement('div');
    overlay.id = 'redirect-overlay';
    overlay.style.position = 'absolute';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0, 0, 0, 0.45)';
    overlay.style.zIndex = '16';
    overlay.style.pointerEvents = 'auto';
    host.appendChild(overlay);

    const toast = document.createElement('div');
    toast.id = 'redirect-toast';
    toast.style.position = 'absolute';
    toast.style.left = '50%';
    toast.style.top = '50%';
    toast.style.transform = 'translate(-50%, -50%)';
    toast.style.background = 'rgba(20, 20, 20, 0.9)';
    toast.style.color = '#fff';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '16px';
    toast.style.fontSize = '13px';
    toast.style.zIndex = '18';
    toast.style.textAlign = 'center';
    toast.style.border = '1px solid rgba(255, 220, 150, 0.4)';
    toast.style.boxShadow = '0 0 0 1px rgba(255, 220, 150, 0.22), 0 0 18px rgba(255, 200, 100, 0.28), 0 10px 24px rgba(0,0,0,0.45)';
    toast.innerHTML = `
      <div style="margin-bottom: 6px;">☕ 테이블로 이동합니다...</div>
      <div style="
        width: 140px;
        height: 6px;
        border-radius: 999px;
        overflow: hidden;
        background: rgba(255,255,255,0.15);
        margin: 0 auto;
      ">
        <div id="redirect-progress-bar" style="
          width: 0%;
          height: 100%;
          background: #ffcc66;
          transition: width 1.5s linear;
        "></div>
      </div>
    `;
    host.appendChild(toast);

    // 진행바 애니메이션 시작
    requestAnimationFrame(() => {
      const bar = document.getElementById('redirect-progress-bar');
      if (bar) bar.style.width = '100%';
    });

    // 1.5초 후 테이블로 이동
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    redirectTimerId = setTimeout(() => {
      const target = `homework-tray_v1.html${userId ? `?id=${encodeURIComponent(userId)}` : ''}`;
      clearRedirectTimer();
      window.location.href = target;
    }, 1500);
  }

  // ░░ 주문 취소 버튼 ░░
  document.getElementById('cancelOrderBtn')?.addEventListener('click', () => {
    localStorage.removeItem('HWPlus');
    receipt.remove();

    const icon = document.getElementById('receipt_icon');
    if (icon) icon.remove();

    const toast = document.getElementById('redirect-toast');
    if (toast) toast.remove();
    const overlay = document.getElementById('redirect-overlay');
    if (overlay) overlay.remove();

    clearRedirectTimer();

    alert('🗑 주문이 취소되었습니다!');
    // 여기서는 student-room 그대로 유지 (테이블로 이동 취소)
  });

  // 영수증 자체는 3초 후 서서히 사라지게 유지 (이동이 막힌 경우 대비)
  setTimeout(() => {
    if (!document.getElementById('temp-receipt')) return;
    receipt.style.opacity = 0;
    setTimeout(() => {
      if (receipt.parentNode) receipt.parentNode.removeChild(receipt);
    }, 1000);
  }, 3000);
}


// ✅ 아이콘 눌렀을 때: 단순 영수증만 보기 (이동 없음)
window.showReceiptFromHWPlus = function () {
  const hwPlusEntries = JSON.parse(localStorage.getItem('HWPlus') || '[]');
  if (hwPlusEntries.length === 0) return;

  let receiptText = '';
  hwPlusEntries.forEach(entry => {
    if (entry.Subcategory && entry.Level && entry.LessonNo !== undefined && entry.LessonNo !== null) {
      const canonicalSub = resolveSubcategoryName(entry.Subcategory);
      const meta = inferLevel(canonicalSub, entry.Level, entry.LessonNo);
      const day = entry.Day ?? meta?.day ?? null;
      const dayStr = day != null ? `Day ${day}` : `Day ${entry.LessonNo}`;
      receiptText += `${canonicalSub} > ${entry.Level} > ${dayStr}\n`;
    } else {
      receiptText += `${entry.Subcategory || entry.label || '기타'}\n`;
    }
  });

  // autoRedirect: false → 그냥 보기만
  showReceiptAgain(receiptText, { autoRedirect: false });
};

window.addEventListener('DOMContentLoaded', cleanupRedirectUI);
window.addEventListener('pageshow', cleanupRedirectUI);
window.addEventListener('pagehide', () => {
  clearRedirectTimer();
  cleanupRedirectUI();
});
