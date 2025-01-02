// 사용자의 이름과 비밀번호에 따른 방 ID를 설정
const users = [
    { username: 'user301', password: 'pw301', roomId: '301' },
    { username: 'user302', password: 'pw302', roomId: '302' },
    { username: 'user303', password: 'pw303', roomId: '303' },
    { username: 'user304', password: 'pw304', roomId: '304' },
    { username: 'user305', password: 'pw305', roomId: '305' },
    { username: 'userTester', password: 'testpw', roomId: 'Tester' },
    { username: 'adminLT', password: 'pwpw', roomId: 'adminLT' }
];

// 로그인 버튼 클릭 이벤트 리스너
document.getElementById('loginButton').addEventListener('click', function() {
    const enteredUsername = document.getElementById('username').value;
    const enteredPassword = document.getElementById('password').value;

    const user = users.find(u => u.username === enteredUsername && u.password === enteredPassword);

    if (user) {
        if (user.username === 'adminLT') {
            // 관리자는 TestResult.html로 이동
            localStorage.setItem('currentUserId', 'adminLT');
            window.location.href = 'TestResult.html';
        } else {
            // 일반 사용자는 Room.html로 이동
            localStorage.setItem('currentUserId', user.roomId);
            window.location.href = `Room.html?id=${user.roomId}`;
        }
    } else {
        alert("잘못된 사용자 이름 또는 비밀번호입니다.");
    }
});

// Tester 버튼 클릭 이벤트 리스너 (room_alt.html로 이동)
document.getElementById('testerButton').addEventListener('click', function() {
    const userId = 'Tester';
    window.location.href = `MainPage.html?id=${userId}`; // id 파라미터와 함께 room_alt.html로 이동
});
