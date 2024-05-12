document.getElementById('userJeongA').addEventListener('click', function() {
    window.location.href = 'wordTest.html?id=JeongA';
});

document.getElementById('userRooT').addEventListener('click', function() {
    const password = prompt("비밀번호를 입력하세요:");
    if (password === "thepassword") {  // 실제 비밀번호로 대체 필요
        window.location.href = 'TestResult.html';
    } else {
        alert("잘못된 비밀번호입니다.");
    }
});

document.getElementById('resetResults').addEventListener('click', function() {
    // 모든 테스트 결과 삭제
    const testCount = parseInt(localStorage.getItem('testCount') || '0');
    for (let i = 1; i <= testCount; i++) {
        localStorage.removeItem(`testResults-${i}`);
    }
    localStorage.removeItem('testCount');
    alert('모든 테스트 결과가 초기화되었습니다.');
});
