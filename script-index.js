const vapidPublicKey = 'BEvKBnLcnotYEeOBexk0i-_2oK5aU3epudG8lszhppdiGeiDT2JPbkXF-THFDYXcWjiGNktD7gIOj4mE_MC_9nE';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

// ✅ 로그인 버튼 클릭 시
document.getElementById('loginButton')?.addEventListener('click', async function () {
  const iosTutorialId = localStorage.getItem('tutorialIdForSubscription');
  const isIOS = Boolean(iosTutorialId);

  let permission = 'granted';
  if (!isIOS) {
    permission = await Notification.requestPermission();
    if (permission === 'denied') {
      alert("🚫 브라우저 알림이 차단되어 있습니다.\n설정에서 직접 알림 허용을 해주세요.");
      return;
    }
  }

  const enteredUsername = document.getElementById('username').value.trim();
  const enteredPassword = document.getElementById('password').value.trim();
  if (!enteredUsername || !enteredPassword) {
    alert("ID와 비밀번호를 모두 입력해주세요.");
    return;
  }

  try {
    const response = await fetch(
      'https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app/api/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: enteredUsername, password: enteredPassword })
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      const userId = data.userId || enteredUsername;
      const userType = data.userType || 'student';
      localStorage.setItem('currentUserId', userId);

      if (isIOS && iosTutorialId) {
        try {
          await fetch('https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app/api/append-tutorial-id-fromios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, tutorialId: iosTutorialId })
          });
        } catch (err) {
          console.warn("iOS tutorialId append 실패:", err);
        }
      } else if (!isIOS && permission === 'granted') {
        try {
          await navigator.serviceWorker.register('service-worker.js');
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
          });

          await fetch('https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app/api/login-subscription-check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, subscription })
          });
        } catch (err) {
          console.warn("알림 등록 실패 (무시됨):", err);
        }
      }

      if (userType === 'student') {
        window.location.href = `student-room.html?id=${userId}`;
      } else if (userType === 'parent') {
        window.location.href = `parents-room.html?id=${userId}`;
      } else if (userType === 'teacher') {
        window.location.href = `teacher-room.html?id=${userId}`;
      } else {
        alert("🚨 알 수 없는 사용자 유형입니다. 관리자에게 문의해주세요.");
      }

    } else if (response.status === 401) {
      alert("잘못된 ID 또는 비밀번호입니다.");
    } else {
      alert("로그인 중 오류가 발생했습니다.");
    }

  } catch (error) {
    console.error(error);
    alert("네트워크 오류로 로그인할 수 없습니다.");
  }
});

document.getElementById('password')?.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    document.getElementById('loginButton')?.click();
  }
});

// ✅ 튜토리얼 진입 버튼 클릭 시
document.getElementById('btnTStudentTutorial')?.addEventListener('click', () => {
  const iosTutorialId = localStorage.getItem('tutorialIdForSubscription');
  const isIOS = Boolean(iosTutorialId);

  if (isIOS) {
    alert("⚠️ iOS에서는 푸시알림이 불안정할 수 있습니다. \n 경보기 파트에서 주의해주세요!");
    const idToUse = iosTutorialId || 'Tutorial';
    window.location.href = `tutorial/student-room_tutorial.html?id=${idToUse}`;
    return;
  }

  document.getElementById('popup-student').style.display = 'block';
});

// ✅ 알림 권한 팝업에서 허용 클릭 시
document.getElementById('confirmStudentPermission')?.addEventListener('click', async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      alert("알림 권한이 필요합니다.");
      return;
    }

    await navigator.serviceWorker.register('service-worker.js');
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
    });

    const res = await fetch('https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app/api/grant-tutorial-id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription })
    });

    const data = await res.json();
    const userId = data.userId;
    localStorage.setItem('currentUserId', userId);

    document.getElementById('popup-student').style.display = 'none';
    window.location.href = `tutorial/student-room_tutorial.html?id=${userId}`;

  } catch (err) {
    console.error("튜토리얼 ID 발급 실패:", err);
    alert("알림 설정에 실패했습니다. 다시 시도해주세요.");
  }
});

// ✅ 튜토리얼 바로 실행 버튼
document.getElementById('launchStudentTutorial')?.addEventListener('click', () => {
  const userId = localStorage.getItem('currentUserId') || 'Tutorial';
  window.location.href = `tutorial/student-room_tutorial.html?id=${userId}`;
});

// ✅ 부모 튜토리얼 진입
document.getElementById('btnTParentsTutorial')?.addEventListener('click', () => {
  window.location.href = 'tutorial/parents-room_tutorial.html?id=ParentsSample';
});

// ✅ 회원가입
document.getElementById('signupButton')?.addEventListener('click', () => {
  window.location.href = 'register.html';
});
