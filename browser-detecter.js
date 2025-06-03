// 📦 browser-detecter.js

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

// ✅ 환경 안내만 표시, 기능은 막지 않음
window.addEventListener('DOMContentLoaded', () => {
  const problem = detectBrowserIssue();
  if (problem) {
    showEnvironmentTip(problem);
    // ❌ 아래는 제거: 기능 차단 없음
    // document.getElementById('loginButton')?.setAttribute('disabled', 'true');
    // document.getElementById('btnTStudentTutorial')?.setAttribute('disabled', 'true');
  }
});
