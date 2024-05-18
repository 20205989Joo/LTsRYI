// 사용자 버튼 클릭 이벤트 리스너
const userButtons = [
    { id: 'user301', userId: '301' },
    { id: 'user302', userId: '302' },
    { id: 'user303', userId: '303' },
    { id: 'user304', userId: '304' },
    { id: 'user305', userId: '305' },
    { id: 'userTester', userId: 'Tester' }
];

userButtons.forEach(button => {
    document.getElementById(button.id).addEventListener('click', function() {
        localStorage.setItem('currentUserId', button.userId);
        window.location.href = `room.html?id=${button.userId}`;
    });
});

// 관리자 버튼 클릭 이벤트 리스너
document.getElementById('adminLT').addEventListener('click', function() {
    const password = prompt("비밀번호를 입력하세요:");
    if (password === "pwpw") {  // 실제 비밀번호로 대체 필요
        localStorage.setItem('currentUserId', 'adminLT');
        window.location.href = 'TestResult.html';
    } else {
        alert("잘못된 비밀번호입니다.");
    }
});

