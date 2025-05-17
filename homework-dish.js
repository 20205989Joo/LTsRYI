window.addEventListener('DOMContentLoaded', () => {
  const trayArea = document.getElementById('tray-area');
  const qordered = JSON.parse(localStorage.getItem('Qordered') || '[]');

  const baseOffset = 10;
  const gap = 90;

  qordered.forEach((item, index) => {
    const dish = document.createElement('div');
    dish.className = 'dish';
    dish.style.left = `${baseOffset + (index % 3) * gap}px`;
    dish.style.top = `${baseOffset + Math.floor(index / 3) * gap}px`;
    dish.textContent = item.WhichHW;

    dish.addEventListener('click', () => {
      showDishPopup(item);
    });

    trayArea.appendChild(dish);
  });

  function showDishPopup(item) {
    // 기존 팝업 제거
    const old = document.getElementById('popup-container');
    if (old) old.remove();

    // 팝업 컨테이너 생성
    const popupContainer = document.createElement('div');
    popupContainer.id = 'popup-container';
    popupContainer.style = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 999;
      pointer-events: none;
    `;

    // 팝업 내용 생성
    const popup = document.createElement('div');
    popup.style = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 240px;
      background: white;
      border: 2px solid #333;
      border-radius: 12px;
      padding: 16px;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 1000;
      text-align: center;
      pointer-events: auto;
    `;

    popup.innerHTML = `
      <div style="font-weight:bold; font-size: 16px; margin-bottom: 10px;">📚 ${item.WhichHW}</div>
      <div style="margin: 12px 0;">단어 퀴즈를 풀어보아요!</div>
      <button style="
        margin-top: 12px;
        padding: 6px 12px;
        font-weight: bold;
        border: none;
        background: #f44336;
        color: white;
        border-radius: 8px;
        cursor: pointer;
      ">닫기</button>
    `;

    // 닫기 버튼 이벤트
    popup.querySelector('button').addEventListener('click', () => {
      popupContainer.remove();
    });

    popupContainer.appendChild(popup);
    document.querySelector('.main-page').appendChild(popupContainer);
  }
});
