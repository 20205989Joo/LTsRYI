function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

function detectBrowserIssue() {
  const ua = navigator.userAgent.toLowerCase();
  const isIos = /iphone|ipad|ipod/.test(ua);
  const isSafari = isIos && ua.includes("safari") && !ua.includes("crios") && !ua.includes("fxios");
  const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
  const isKakao = /kakaotalk/.test(ua);
  const isSamsung = /samsungbrowser/.test(ua);
  const isChrome = /chrome/.test(ua) && !isSamsung;

  console.log("🔍 감지된 브라우저 환경:", navigator.userAgent);

  if (isKakao) return 'kakao';
  if (isSafari && !isStandalone) return 'ios-safari';
  if (isSamsung) return 'samsung-browser';
  return null;
}

function showEnvironmentTip(type) {
  const messageMap = {
    'kakao': "일부 기능이 카카오 브라우저에서는 정상 작동하지 않을 수 있습니다. 아래 버튼을 눌러 Chrome으로 열어주세요.",
    'ios-safari': "📲 iPhone에서는 Safari 하단 공유버튼 → '홈 화면에 추가'로 설치 시 알림이 가능해집니다.",
    'samsung-browser': "Samsung 브라우저에서는 알림 기능이 제한될 수 있습니다. Chrome 사용을 권장합니다."
  };

  const tip = document.createElement('div');
  tip.innerHTML = `
    <div style="
      position: fixed;
      bottom: 10px;
      left: 10px;
      right: 10px;
      background: #fff8e1;
      color: #333;
      padding: 14px 18px;
      border-radius: 10px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.2);
      font-size: 14px;
      line-height: 1.5;
      z-index: 9999;
    ">
      ${messageMap[type] || "이 브라우저 환경에서는 일부 기능에 제한이 있을 수 있습니다."}
      ${type === 'kakao' ? `<br><a href="intent://ltryi.world#Intent;scheme=https;package=com.android.chrome;end" style="color: #1a73e8;">📎 Chrome으로 열기</a>` : ''}
    </div>
  `;
  document.body.appendChild(tip);
}

function insertPwaOverlay() {
  const blocker = document.createElement('div');
  blocker.id = 'pwa-overlay-blocker';
  blocker.style = `
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.75);
    color: white;
    z-index: 99999;
    font-family: sans-serif;
  `;

  const msg = document.createElement('div');
  msg.textContent = "📲 알림 기능을 위해 요청을 허용해주세요.";
  msg.style = `
    text-align: center;
    font-size: 16px;
    margin-top: 300px;
  `;

  const button = document.createElement('button');
  button.textContent = '🔔 알림 허용';
  button.id = 'pwa-noti-btn';
  button.style = `
    position: absolute;
    left: 50%;
    top: 400px;
    width: 150px;
    height: 30px;
    transform: translateX(-50%);
    padding: 20px 20px;
    font-size: 15px;
    font-weight: bold;
    background: #ffee99;
    color: #333;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    line-height: .2;
  `;

  button.onclick = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert("🚫 알림 권한이 허용되지 않았습니다.\n설정에서 수동으로 허용해주세요.");
        return;
      }

      await navigator.serviceWorker.register('service-worker.js');
      const registration = await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      const response = await fetch('https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app/api/grant-tutorial-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription })
      });

      const data = await response.json();
      if (data.userId) {
        localStorage.setItem('tutorialIdForSubscription', data.userId);
        console.log('✅ tutorial ID 저장됨:', data.userId);
        blocker.remove();
      } else {
        alert("❌ tutorialId 발급 실패: 서버 응답 이상");
      }

    } catch (err) {
      console.error("❌ 알림 권한 또는 tutorial ID 발급 실패:", err);
      alert("⚠️ 알림 설정 중 오류가 발생했습니다.");
    }
  };

  blocker.appendChild(msg);
  blocker.appendChild(button);

document.body.appendChild(blocker);
}

window.addEventListener('DOMContentLoaded', () => {
  const problem = detectBrowserIssue();
  if (problem) showEnvironmentTip(problem);

  const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

  if (isStandalone && Notification.permission !== 'granted') {
    insertPwaOverlay();
  }
});