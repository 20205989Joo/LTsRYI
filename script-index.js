const vapidPublicKey = 'BEvKBnLcnotYEeOBexk0i-_2oK5aU3epudG8lszhppdiGeiDT2JPbkXF-THFDYXcWjiGNktD7gIOj4mE_MC_9nE';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

document.getElementById('loginButton')?.addEventListener('click', async function () {
  const currentId = localStorage.getItem('currentUserId');
  const isFakeTutorialId = currentId && /^tutorial\d{8}$/.test(currentId);

  let permission = 'granted';

  // ✅ iOS가 아닌 경우에만 알림 권한 요청
  if (!isFakeTutorialId) {
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
        body: JSON.stringify({
          userId: enteredUsername,
          password: enteredPassword
        })
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      const userId = data.userId || enteredUsername;
      const userType = data.userType || 'student';
      localStorage.setItem('currentUserId', userId);

      // ✅ 푸시 등록은 iOS 아닌 경우만
      try {
        if (!isFakeTutorialId && permission === 'granted') {
          await navigator.serviceWorker.register('service-worker.js');
          const registration = await navigator.serviceWorker.ready;

          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
          });

          await fetch('https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app/api/login-subscription-check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              subscription
            })
          });
        }
      } catch (err) {
        console.warn("알림 등록 실패 (무시됨):", err);
      }

      // ✅ 로그인 성공 후 이동
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
  const currentId = localStorage.getItem('currentUserId');
  const isFakeTutorialId = currentId && /^tutorial\d{8}$/.test(currentId);

  if (isFakeTutorialId) {
    alert("⚠️ iOS에서는 알림이 작동하지 않습니다.\n경보 알림은 울리지 않으니 참고해주세요.");
    window.location.href = `tutorial/student-room_tutorial.html?id=${currentId}`;
    return;
  }

  // ✅ 정상 환경 → 알림 허용 팝업 열기
  document.getElementById('popup-student').style.display = 'block';
});


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

    // ✅ 팝업 닫고 바로 튜토리얼 페이지로 이동
    document.getElementById('popup-student').style.display = 'none';
    window.location.href = `tutorial/student-room_tutorial.html?id=${userId}`;

  } catch (err) {
    console.error("튜토리얼 ID 발급 실패:", err);
    alert("알림 설정에 실패했습니다. 다시 시도해주세요.");
  }
});

document.getElementById('launchStudentTutorial')?.addEventListener('click', () => {
  const userId = localStorage.getItem('currentUserId') || 'Tutorial';
  window.location.href = `tutorial/student-room_tutorial.html?id=${userId}`;
});

document.getElementById('btnTParentsTutorial')?.addEventListener('click', () => {
  window.location.href = 'tutorial/parents-room_tutorial.html?id=ParentsSample';
});

// ✅ 회원가입 버튼 → register.html로 이동
document.getElementById('signupButton')?.addEventListener('click', () => {
  window.location.href = 'register.html';
});
