const params = new URLSearchParams(window.location.search);
const userId = params.get('id');
document.getElementById('usernameDisplay').textContent = userId;

// 테스트 완료 후 결과 페이지로 이동하는 함수
function completeTest() {
    window.location.href = 'TestResult.html?result=success&userId=' + userId;
}
