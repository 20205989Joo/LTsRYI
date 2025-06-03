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
  if (isIos && !isStandalone) return 'ios-safari';
  if (isSamsung) return 'samsung-browser';
  return null;
}

function showEnvironmentTip(type) {
  const messageMap = {
    'kakao': "\uD558\uB098\uC758 \uC77C\uBD80 \uAE30\uB2A5\uC774 \uAC1C\uD589\uC801\uC774\uC9C0 \uC54A\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uC544\uB798 \uBC84\uD2BC\uC744 \uB204\uB974\uC5B4 Chrome\uC73C\uB85C \uC5F4\uC5B4\uC8FC\uC138\uC694.",
    'ios-safari': "📲 iPhone\uC5D0\uC11C\uB294 Safari \uD558\uB2E8 \uACF5\uC720\uBC84\uD2BC \uD074\uB9AD \u2192 '홈화면에 추가'를 눌러주세요!",
    'samsung-browser': "Samsung Internet \uC5EC\uB860\uC5D0\uC11C\uB294 \uC77C\uBD80 \uAE30\uB2A5\uC774 \uBD88\uC548\uC815\uD560 \uC218 \uC788\uC5B4\uC694. Chrome \uC0AC\uC6A9\uC744 \uAD8C\uC7A5\uB4DC\uB9BD\uB2C8\uB2E4."
  };

  console.log("⚠️ 문제 감지됨:", type);

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
      ${messageMap[type] || "\uD658\uACBD \uC815\uBCF4\uC5D0 \uB530\uB77C \uC548\uB0B4\uB97C \uB4DC\uB9BD\uB2C8\uB2E4."}
      ${type === 'kakao' ? `<br><a href="intent://ltryi.world#Intent;scheme=https;package=com.android.chrome;end" style="color: #1a73e8;">📎 Chrome\uC73C\uB85C \uC5F4\uAE30</a>` : ''}
    </div>
  `;
  document.body.appendChild(tip);
}

// ✅ 카카오 브라우저는 즉시 Chrome 인텐트 전환 (Android only)
const ua = navigator.userAgent.toLowerCase();
if (ua.includes('kakaotalk') && ua.includes('android')) {
  alert("카카오 브라우저는 제한적입니다. Chrome으로 이동합니다.");
  window.location.href = "intent://ltryi.world#Intent;scheme=https;package=com.android.chrome;end";
}

window.addEventListener('DOMContentLoaded', () => {
  const problem = detectBrowserIssue();
  if (problem) {
    showEnvironmentTip(problem);
    document.getElementById('loginButton')?.setAttribute('disabled', 'true');
    document.getElementById('btnTStudentTutorial')?.setAttribute('disabled', 'true');
  }
});
