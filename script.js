let wordList = []; // 전역 변수로 단어 목록을 저장할 배열 선언
let currentWordIndex = 0; // 현재 진행 중인 단어의 인덱스를 저장할 변수 선언
let uniqueDays = []; // 고유한 날짜를 저장할 배열 선언
let filteredWords = []; // 선택된 날짜에 해당하는 단어들을 저장할 배열 선언
let correctAnswers = 0; // 사용자의 정답 수를 저장할 변수 선언
let totalQuestions = 0; // 전체 문제 수를 저장할 변수 선언
let startTime, endTime; // 테스트의 시작 시간과 종료 시간을 저장할 변수 선언
let testCount = 0;  // 사용자가 시험을 치른 횟수를 저장할 변수 선언
let isResultsSaved = false; // 테스트 결과가 저장되었는지 여부를 저장할 변수 선언

// 웹 페이지가 로드될 때 JSON 데이터를 비동기적으로 불러오는 함수
function loadJsonData() {
    fetch('MID-A_jsonarray.json') // 주어진 URL에서 JSON 데이터를 요청
        .then(response => response.json()) // 응답을 JSON으로 변환
        .then(data => {
            wordList = data.data; // 변환된 JSON 데이터 중 data 필드를 wordList 배열에 저장
            extractUniqueDays(); // 고유한 날짜를 추출하는 함수 호출
            populateDayOptions(); // 드롭다운 메뉴를 생성하는 함수 호출
        })
        .catch(error => console.error('Error loading the JSON data: ', error)); // 데이터 로드 중 에러 발생 시 콘솔에 에러 로깅
}

// wordList 배열에서 고유한 날짜 값을 추출하여 uniqueDays 배열에 저장하는 함수
function extractUniqueDays() {
    const daysSet = new Set(); // 중복을 허용하지 않는 Set 객체 생성
    wordList.forEach(item => daysSet.add(item[0])); // wordList의 각 항목에서 날짜 부분(첫 번째 요소)을 추출하여 Set에 추가
    uniqueDays = Array.from(daysSet); // Set 객체를 배열로 변환하여 uniqueDays에 저장
    uniqueDays.sort(); // uniqueDays 배열을 정렬
}

// 사용자가 선택할 수 있는 날짜 옵션을 드롭다운 메뉴에 동적으로 추가하는 함수
function populateDayOptions() {
    const startDaySelect = document.getElementById('startDay'); // 시작 날짜를 선택하는 드롭다운 요소를 가져옴
    const endDaySelect = document.getElementById('endDay'); // 종료 날짜를 선택하는 드롭다운 요소를 가져옴
    startDaySelect.innerHTML = ''; // 시작 날짜 드롭다운의 기존 옵션을 비움
    endDaySelect.innerHTML = ''; // 종료 날짜 드롭다운의 기존 옵션을 비움

    uniqueDays.forEach(day => { // uniqueDays 배열의 각 날짜에 대하여
        const option = document.createElement('option'); // 새로운 option 요소를 생성
        option.value = option.textContent = day; // option 요소의 값과 텍스트를 해당 날짜로 설정
        startDaySelect.appendChild(option.cloneNode(true)); // 시작 날짜 선택 드롭다운에 option 요소를 추가 (깊은 복사로 클론 생성)
        endDaySelect.appendChild(option); // 종료 날짜 선택 드롭다운에 option 요소를 추가
    });
}

// 테스트를 시작하는 함수
function startTest() {
    testCount = parseInt(localStorage.getItem('testCount') || '0') + 1; // 로컬 스토리지에서 testCount를 가져와 1을 더함 (없으면 0으로 시작)
    localStorage.setItem('testCount', testCount.toString()); // 새로운 testCount 값을 문자열로 변환하여 로컬 스토리지에 저장
    const startDay = document.getElementById('startDay').value; // 사용자가 선택한 시작 날짜를 가져옴
    const endDay = document.getElementById('endDay').value; // 사용자가 선택한 종료 날짜를 가져옴
    filteredWords = wordList.filter(word => { // wordList 배열을 필터링
        const day = parseInt(word[0].replace(/DAY /, '')); // 각 단어의 날짜 부분에서 'DAY ' 문자를 제거하고 정수로 변환
        return day >= parseInt(startDay.replace(/DAY /, '')) && day <= parseInt(endDay.replace(/DAY /, '')); // 사용자가 선택한 시작과 종료 날짜 사이에 있는지 판단
    });
    shuffle(filteredWords); // 필터링된 단어 목록을 무작위로 섞음
    currentWordIndex = 0; // 현재 단어 인덱스를 0으로 초기화
    correctAnswers = 0; // 정답 수를 0으로 초기화
    totalQuestions = filteredWords.length; // 전체 문제 수를 필터링된 단어 목록의 길이로 설정
    isResultsSaved = false; // 결과 저장 여부를 거짓으로 초기화
    updateScoreboard(); // 점수판을 업데이트하는 함수 호출
    displayNextWord(); // 다음 단어를 표시하는 함수 호출
    startTimer(); // 타이머를 시작하는 함수 호출
    updateTimerDisplay(); // 타이머 디스플레이를 업데이트하는 함수 호출
}

// 점수판을 업데이트하는 함수
function updateScoreboard() {
    const scoreboard = document.getElementById('scoreboard'); // 점수판 요소를 가져옴
    scoreboard.textContent = `정답률 : ${correctAnswers} / Total : ${totalQuestions}`; // 점수판의 텍스트를 현재 정답률과 전체 문제 수로 설정
}

// 주어진 배열을 무작위로 섞는 함수
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) { // 배열의 마지막 요소부터 시작하여 첫 요소 직전까지 반복
        const j = Math.floor(Math.random() * (i + 1)); // 0부터 i까지의 무작위 인덱스
        [array[i], array[j]] = [array[j], array[i]]; // 현재 인덱스(i)의 요소와 무작위 인덱스(j)의 요소를 교환
    }
}

// 다음 단어를 화면에 표시하고 관련 설정을 하는 함수
function displayNextWord() {
    if (currentWordIndex < filteredWords.length) { // 현재 인덱스가 필터링된 단어 목록의 길이보다 작은 경우 (다음 단어가 존재하는 경우)
        const word = filteredWords[currentWordIndex]; // 현재 단어를 가져옴
        const initial = word[1].split(' ').map(w => w.charAt(0).toLowerCase()).join('___'); // 단어의 각 부분을 공백으로 분할하고, 각 부분의 첫 글자를 소문자로 변환한 후 '___'로 연결
        document.getElementById('question').textContent = `Q. "${word[2]}"를 영어로 하면? ( ${initial}_________ )`; // 문제 텍스트를 설정
        document.getElementById('answer').style.visibility = 'visible'; // 답변 입력 필드를 보이도록 설정
    } else { // 모든 단어를 다 표시했을 경우
        document.getElementById('question').textContent = '다음 Test로 넘어갑니다.'; // 질문 영역에 '끝! 고생하셨습니다!' 표시
        document.getElementById('answer').style.visibility = 'hidden'; // 답변 입력 필드를 숨김
        document.getElementById('submit').style.display = 'none'; // 제출 버튼을 숨김
        document.getElementById('next').style.display = 'block'; // 다음 버튼을 표시
        stopTimerAndReset(); // 타이머를 멈추고 리셋하는 함수 호출
        if (!isResultsSaved) { // 결과가 아직 저장되지 않았다면
            saveResults(); // 결과를 저장하는 함수 호출
            isResultsSaved = true; // 결과 저장 여부를 참으로 설정
        }
    }
}

// MySQL DATETIME 형식에 맞게 날짜를 변환하는 함수
function getMySqlDateTime(dateInput) {
    // 로컬 시간대 기반으로 날짜 및 시간 설정
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
        console.error("Invalid date input:", dateInput);
        return null;
    }
    return date.toLocaleString("sv-SE").replace(' ', 'T');
}


function saveResults() {
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) {
        alert('사용자 ID가 설정되지 않았습니다.');
        return;
    }

    let storedResults = localStorage.getItem('testResults');
    if (!storedResults) {
        alert('No results to submit.');
        return;
    }

    let resultsArray = JSON.parse(storedResults);
    // 이미 로컬 저장소에 저장된 timestamp를 그대로 사용합니다.
    let formattedResults = resultsArray.map(result => {
        // 유효성 검사를 통해 timestamp가 유효한지 확인합니다.
        if (!result.Timestamp) {
            console.error("Skipping result due to missing timestamp:", result);
            return null;
        }
        return {
            subjectName: 'Vocabulary',
            subcategoryName: 'Words',
            quizNo: result.QuizNo,
            userResponse: result.UserResponse,
            correctAnswer: result.CorrectAnswer,
            correctness: result.Correctness,
            timestamp: result.Timestamp, // 로컬 저장된 timestamp를 그대로 사용
            testCount: result.TestCount
        };
    }).filter(result => result !== null);

    const requestBody = JSON.stringify({
        userId: currentUserId,
        results: formattedResults
    });

    console.log("Request Body:", requestBody); // 서버로 보내는 요청 데이터 확인

    fetch('https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app/api/saveResults', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: requestBody
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('성적 등록이 완료되었습니다!');
        localStorage.removeItem('testResults');
        isResultsSaved = true;
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to save results.');
        isResultsSaved = false;
    });
}



// 타이머를 시작하는 함수
function startTimer() {
    startTime = new Date(); // startTime을 현재 날짜와 시간으로 설정
}

// 타이머를 정지하고 결과를 로컬 저장소에 저장하는 함수
function stopTimer() {
    endTime = new Date(); // 현재 시간을 endTime에 저장
    let timeDiff = endTime - startTime; // 시작 시간과 끝 시간의 차이 계산
    let seconds = Math.floor(timeDiff / 1000); // 초 단위로 변환

    return seconds; // 걸린 시간 반환
}

// 타이머 디스플레이를 업데이트하는 함수
function updateTimerDisplay() {
    let currentTime = new Date(); // 현재 시간을 가져옴
    let timeDiff = currentTime - startTime; // 시작 시간부터 현재까지의 시간 차이 계산
    let seconds = Math.floor((timeDiff / 1000) % 60); // 초 단위로 변환하여 가져옴
    let minutes = Math.floor((timeDiff / (1000 * 60)) % 60); // 분 단위로 변환하여 가져옴
    document.getElementById('timer').textContent = `${pad(minutes)}:${pad(seconds)}`; // 시간을 표시하는 태그의 내용을 업데이트
    timerUpdate = setTimeout(updateTimerDisplay, 500); // 0.5초마다 업데이트되도록 재귀적으로 함수 호출
}
// 타이머를 멈추고 리셋하는 함수
function stopTimerAndReset() {
    clearTimeout(timerUpdate); // 설정된 타이머 업데이트를 취소
    document.getElementById('timer').textContent = '-- : --'; // 타이머 표시를 초기화
}

// 숫자를 두 자리로 표시하는 함수 (예: 1 -> 01)
function pad(value) {
    return value.toString().padStart(2, '0'); // 주어진 값의 문자열 표현을 2자리로 만들고, 필요하면 '0'을 앞에 추가
}

function updateResultsList() {
    const resultsList = document.getElementById('results');
    resultsList.innerHTML = '';
    const storedResults = JSON.parse(localStorage.getItem('testResults') || '[]');

    storedResults.filter(result => result.TestCount === testCount).forEach((result, index) => {
        const listItem = document.createElement('li');
        const correctnessIcon = result.Correctness ? '✔️' : '❌';
        const section = result.QuizNo === 1 ? 'A' : 'B';

        listItem.textContent = `#${index + 1}.  ${result.UserResponse} - (${result.CorrectAnswer}) ${correctnessIcon} - ${result.Seconds}초 `;
        resultsList.appendChild(listItem);
    });
}




function checkAnswer() {
    const userInputElement = document.getElementById('answer');
    const userInputValue = userInputElement.value.trim().toLowerCase();
    const correctAnswer = filteredWords[currentWordIndex][1].toLowerCase(); // 올바른 답안 가져오기
    const feedbackElement = document.getElementById('feedback');

    const isCorrect = userInputValue === correctAnswer;
    const correctness = isCorrect ? 1 : 0;

    feedbackElement.style.display = '';
    feedbackElement.style.opacity = 1;
    feedbackElement.classList.remove('correct', 'wrong');

    if (isCorrect) {
        feedbackElement.textContent = '✔️ Correct!';
        feedbackElement.classList.add('correct');
        correctAnswers++;
    } else {
        feedbackElement.textContent = `❌ Wrong! 정답은 : ${correctAnswer}`;
        feedbackElement.classList.add('wrong');
    }

    let seconds = stopTimer(); // 걸린 시간을 stopTimer 함수에서 가져옵니다.
    startTimer(); // 타이머를 재시작합니다.

    const quizNo = 1; // 문제 번호를 1로 고정

    let results = localStorage.getItem('testResults');
    results = results ? JSON.parse(results) : [];
    results.push({
        UserId: localStorage.getItem('currentUserId'),
        SubcategoryId: 1,
        QuizNo: quizNo,
        UserResponse: userInputValue,
        CorrectAnswer: correctAnswer, // CorrectAnswer 필드 추가
        Correctness: correctness,
        Seconds: seconds,
        Timestamp: getMySqlDateTime(new Date()),
        TestCount: testCount
    });

    localStorage.setItem('testResults', JSON.stringify(results));
    updateResultsList();

    userInputElement.value = '';
    currentWordIndex++;
    displayNextWord();
    updateScoreboard();
    fadeOutEffect();
}




// 피드백 표시 효과를 서서히 사라지게 하는 함수
function fadeOutEffect() {
    const feedback = document.getElementById('feedback'); // 피드백 요소를 가져옴
    feedback.style.display = ''; // 피드백 요소를 표시
    let opacity = 1; // 투명도를 1로 설정
    const timer = setInterval(function() { // 일정 간격으로 반복 실행하는 타이머 설정
        if (opacity <= 0) { // 투명도가 0 이하이면
            clearInterval(timer); // 타이머 취소
            feedback.style.opacity = 0; // 피드백 요소의 투명도를 0으로 설정
        } else { // 그렇지 않으면
            opacity -= 0.05; // 투명도를 0.05 감소
            feedback.style.opacity = opacity; // 감소된 투명도를 피드백 요소에 적용
        }
    }, 100); // 100밀리초마다 반복
}

// 'Enter' 키 입력 시 답변을 확인하는 이벤트 리스너
document.getElementById('answer').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') { // 입력된 키가 'Enter'이면
        checkAnswer(); // 답변을 확인하는 함수 호출
    }
});

// 제출 버튼 클릭 시 기본 동작을 막고 답변을 확인하는 이벤트 리스너
document.getElementById('submit').addEventListener('click', function(event) {
    event.preventDefault(); // 이벤트의 기본 동작을 막음
    checkAnswer(); // 답변을 확인하는 함수 호출
});

// 다음 버튼 클릭 시 새로운 테스트 페이지로 이동하는 이벤트 리스너
document.getElementById('next').addEventListener('click', function() {
    const currentUserId = localStorage.getItem('currentUserId'); // 로컬 저장소에서 현재 사용자 ID를 가져옴
    if (currentUserId) { // 사용자 ID가 설정되어 있으면
        window.location.href = `wordtest2.html?id=${currentUserId}`; // 새로운 테스트 페이지로 이동
    } else { // 사용자 ID가 설정되어 있지 않으면
        alert("User ID is not set. Please check and try again."); // '사용자 ID가 설정되어 있지 않습니다. 확인 후 다시 시도하세요.'라는 알림창을 표시
    }
});

// 웹 페이지가 로드될 때 JSON 데이터를 로드하는 이벤트 리스너
window.onload = function() {
    loadJsonData(); // JSON 데이터를 로드하는 함수 호출
};
