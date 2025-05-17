// kiosk_screen.js

window.addEventListener('DOMContentLoaded', () => {
  const popupHTML = `
    <div id="popup" style="display: none;">
      <button class="popup-close" id="popupCloseBtn">✖</button>
      <div class="popup-content">

        <!-- ✅ 상단 안내 텍스트 -->
        <div class="popup-header-text">오늘의 숙제를 주문해주세요</div>

        <div class="tabs">
          <button class="tab active" data-tab="tukurry">
            <span class="tab-large">추천 숙제</span><br><span class="tab-small">주세요</span>
          </button>
          <button class="tab" data-tab="module">
            <span class="tab-large">시험</span><br><span class="tab-small">봐주세요</span>
          </button>
          <button class="tab" data-tab="etc">
            <span class="tab-large">내 숙제</span><br><span class="tab-small">할래요</span>
          </button>
          <button class="tab" data-tab="custom">
            <span class="tab-large">커스텀</span><br><span class="tab-small">주문</span>
          </button>
        </div>

        <div class="tab-content" id="tab-tukurry">
          <button class="menu-btn">단어</button>
          <button class="menu-btn">문법</button>
          <button class="menu-btn">독해</button>
        </div>

        <div class="tab-content hidden" id="tab-module">
          <button class="menu-btn">단어테스트</button>
          <button class="menu-btn">문법테스트</button>
          <button class="menu-btn">독해테스트</button>
        </div>

        <div class="tab-content hidden" id="tab-etc">
          <button class="menu-btn">숙제 사진</button>
        </div>

        <div class="tab-content hidden" id="tab-custom">
          <button class="menu-btn">📦 커스텀 준비 중</button>
        </div>

        <div class="quantity-control">
          <label>몇 번째 숙제?</label>
          <div class="counter">
            <button id="minusBtn">－</button>
            <span id="hwNumber">1</span>
            <button id="plusBtn">＋</button>
          </div>
        </div>

        <button class="order-btn">🛒 주문하기</button>
      </div>
    </div>
  `;

  const popupContainer = document.getElementById('popup-container');
  popupContainer.innerHTML = popupHTML;

  const kiosk = document.getElementById('kiosk');
  const popup = document.getElementById('popup');

  let closeButtonInitialized = false;

  if (kiosk && popup) {
    kiosk.addEventListener('click', () => {
      popup.style.display = 'flex';

      // ✅ 탭 로직 초기화
      document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
          document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
          document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
          tab.classList.add('active');
          document.getElementById('tab-' + tab.dataset.tab).classList.remove('hidden');
        });
      });

      // ✅ 숙제 번호 조절 로직
      let hwNum = 1;
      const hwNumberSpan = document.getElementById('hwNumber');
      document.getElementById('minusBtn').onclick = () => {
        if (hwNum > 1) hwNum--;
        hwNumberSpan.textContent = hwNum;
      };
      document.getElementById('plusBtn').onclick = () => {
        hwNum++;
        hwNumberSpan.textContent = hwNum;
      };

      // ✅ 닫기 버튼: 중복 연결 방지
      if (!closeButtonInitialized) {
        const closeBtn = document.getElementById('popupCloseBtn');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            popup.style.display = 'none';
          });
          closeButtonInitialized = true;
        }
      }
    });
  }
});