let wordList = [];
let currentWordIndex = 0;
let uniqueDays = [];
let filteredWords = [];
let correctAnswers = 0; // 정답 수
let totalQuestions = 0; // 전체 문제 수
let startTime, endTime;
let testCount = 0;  // 전역 변수로 테스트 카운트를 추가
let isResultsSaved = false; // 결과 저장 여부
let choices = []; // 선택지 배열
let timerUpdate; // 타이머 업데이트 핸들러

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    if (!userId) {
        alert("No user ID provided.");
        return;
    }

    localStorage.setItem('currentUserId', userId);
    document.getElementById('currentUserId').textContent = userId;

    // 데이터 로드 및 테스트 시작
    loadJsonData();
});

// JSON 데이터 로드
function loadJsonData() {
    fetch('MID-A_jsonarray.json')
        .then(response => response.json())
        .then(data => {
            wordList = data.data;
            extractUniqueDays();
            populateDayOptions();
            initializeChoices();
        })
        .catch(error => console.error('Error loading the JSON data: ', error));
}

function extractUniqueDays() {
    const daysSet = new Set();
    wordList.forEach(item => daysSet.add(item[0]));
    uniqueDays = Array.from(daysSet);
    uniqueDays.sort();
}

function populateDayOptions() {
    const startDaySelect = document.getElementById('startDay');
    const endDaySelect = document.getElementById('endDay');
    startDaySelect.innerHTML = '';
    endDaySelect.innerHTML = '';

    uniqueDays.forEach(day => {
        const option = document.createElement('option');
        option.value = option.textContent = day;
        startDaySelect.appendChild(option.cloneNode(true));
        endDaySelect.appendChild(option);
    });
}

function initializeChoices() {
    const choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const button = document.createElement('button');
        button.textContent = `선택지 ${i}`;
        choicesContainer.appendChild(button);
    }
}

function startTest() {
    testCount = parseInt(localStorage.getItem('testCount') || '0') + 1;
    localStorage.setItem('testCount', testCount.toString());
    const startDay = document.getElementById('startDay').value;
    const endDay = document.getElementById('endDay').value;
    filteredWords = wordList.filter(word => {
        const day = parseInt(word[0].replace(/DAY /, ''));
        return day >= parseInt(startDay.replace(/DAY /, '')) && day <= parseInt(endDay.replace(/DAY /, ''));
    });
    shuffle(filteredWords);
    currentWordIndex = 0;
    correctAnswers = 0;
    totalQuestions = filteredWords.length;
    isResultsSaved = false;
    updateScoreboard();
    displayNextWord();
    startTimer();
    updateTimerDisplay();
}

function updateScoreboard() {
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.textContent = `정답률 : ${correctAnswers} / Total : ${totalQuestions}`; // 화면에 표시되는 텍스트 유지

    if (totalQuestions > 0) {
        const accuracyRate = ((correctAnswers / totalQuestions) * 100).toFixed(2); // 백분율로 계산하고 소수점 두 자리로 제한
        localStorage.setItem('currentTestScore', accuracyRate); // 로컬 저장소에 정답률 저장
    } else {
        localStorage.setItem('currentTestScore', '0.00'); // 문제가 없을 경우 정답률을 0.00%로 저장
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function displayNextWord() {
    const choicesContainer = document.getElementById('choices');
    const nextButton = document.getElementById('next');

    if (currentWordIndex < filteredWords.length) {
        const word = filteredWords[currentWordIndex];
        document.getElementById('question').textContent = `Q. "${word[1]}"의 뜻은 무엇인가요?`;

        choices = generateChoices(word[2], filteredWords);
        choicesContainer.innerHTML = '';
        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.textContent = choice;
            button.onclick = () => checkAnswer(index);
            choicesContainer.appendChild(button);
        });

        choicesContainer.style.visibility = 'visible';
        nextButton.style.display = 'none'; // next 버튼 숨기기
    } else {
        document.getElementById('question').textContent = '다음 Test로 넘어갑니다.';
        choicesContainer.style.visibility = 'hidden';
        nextButton.style.display = 'block'; // 다음 버튼을 표시
        stopTimerAndReset();
        if (!isResultsSaved) {
            saveResults();
            isResultsSaved = true;
        }
    }
}

function generateChoices(correctAnswer, filteredWords) {
    const choices = [correctAnswer];
    while (choices.length < 5) {
        const randomIndex = Math.floor(Math.random() * filteredWords.length);
        const choice = filteredWords[randomIndex][2];
        if (!choices.includes(choice)) {
            choices.push(choice);
        }
    }
    return shuffle(choices);
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
    
    let whichDay = localStorage.getItem('currentTestWhichDay'); // 로컬 스토리지에서 저장된 최신 날짜를 가져옵니다.
    let resultsArray = JSON.parse(storedResults);
    let formattedResults = resultsArray.map(result => {
        return {
            subjectName: 'Vocabulary',
            subcategoryName: 'Words',
            quizNo: 1,  // QuizNo는 1로 설정합니다.
            userResponse: result.UserResponse,
            correctAnswer: result.CorrectAnswer,
            correctness: result.Correctness,
            timestamp: result.Timestamp,
            testCount: result.TestCount
        };
    }).filter(result => result != null);

    const requestBody = JSON.stringify({
        userId: currentUserId,
        results: formattedResults
    });

    fetch('https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app/api/saveResults', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: requestBody
    })
    .then(response => response.json())
    .then(data => {
        console.log('Results saved successfully:', data);
        let testScore = localStorage.getItem('currentTestScore'); // 현재 테스트 점수를 로컬 스토리지에서 가져옵니다.
        let testCount = resultsArray[0].TestCount; // 첫 번째 결과 항목의 TestCount를 사용합니다.
        let gradesData = {
            userId: currentUserId,
            grades: [{
                subcategoryName: 'Words',
                quizNo: 1, // 결과 배열의 첫 번째 항목의 QuizNo를 사용합니다.
                testScore: testScore,
                testCount: testCount,
                whichDay: whichDay // 로컬 스토리지에서 가져온 최신 날짜를 사용합니다.
            }]
        };

        return fetch('https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app/api/saveGrades', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gradesData)
        });
    })
    .then(response => response.json())
    .then(data => {
        console.log('Grades saved successfully:', data);
        localStorage.removeItem('testResults'); // 결과 데이터를 로컬 스토리지에서 삭제합니다.
        localStorage.removeItem('currentTestScore'); // 현재 테스트 점수를 로컬 스토리지에서 삭제합니다.
        localStorage.removeItem('currentTestWhichDay'); // 저장된 날짜 정보를 로컬 스토리지에서 삭제합니다.
        alert('성적 등록이 완료되었습니다!');
    })
    .catch(error => {
        console.error('Error saving results and grades:', error);
        alert('Failed to save results and grades.');
    });
}

function getMySqlDateTime(dateInput) {
    // 로컬 시간대 기반으로 날짜 및 시간 설정
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
        console.error("Invalid date input:", dateInput);
        return null;
    }
    return date.toLocaleString("sv-SE").replace(' ', 'T');
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

function updateTimerDisplay() {
    let currentTime = new Date();
    let timeDiff = currentTime - startTime;
    let seconds = Math.floor((timeDiff / 1000) % 60);
    let minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
    let timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.textContent = `${pad(minutes)}:${pad(seconds)}`;
        timerUpdate = setTimeout(updateTimerDisplay, 500);
    }
}

function pad(value) {
    return value.toString().padStart(2, '0');
}

function stopTimerAndReset() {
    clearTimeout(timerUpdate);
    document.getElementById('timer').textContent = '-- : --';
}

function pad(value) {
    return value.toString().padStart(2, '0');
}

function updateResultsList() {
    const resultsList = document.getElementById('results');
    resultsList.innerHTML = '';
    const storedResults = JSON.parse(localStorage.getItem('testResults') || '[]');

    storedResults.filter(result => result.TestCount === testCount).forEach((result, index) => {
        const listItem = document.createElement('li');
        const correctnessIcon = result.Correctness ? '✔️' : '❌';
        const section = result.QuizNo === 1 ? 'A' : 'B';

        listItem.textContent = `#${index + 1}. - (${result.CorrectAnswer}) ${correctnessIcon} - ${result.Seconds}초 `;
        resultsList.appendChild(listItem);
    });
}

function checkAnswer(selectedIndex) {
    const isCorrect = choices[selectedIndex] === filteredWords[currentWordIndex][2];
    const feedbackElement = document.getElementById('feedback');
    const seconds = stopTimer(); // 걸린 시간을 stopTimer 함수에서 가져옴
    const correctAnswer = filteredWords[currentWordIndex][2]; // 올바른 답안 가져오기
    const userResponse = choices[selectedIndex];
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

    const quizNo = 1; // 문제 번호를 2로 고정
    let timestamp = getMySqlDateTime(new Date());
    let whichDay = timestamp.split('T')[0]; // 'T'를 기준으로 날짜 부분만 추출

    let results = localStorage.getItem('testResults');
    results = results ? JSON.parse(results) : [];
    results.push({
        UserId: localStorage.getItem('currentUserId'),
        SubcategoryId: 1,
        QuizNo: quizNo,
        UserResponse: userResponse,
        CorrectAnswer: correctAnswer,
        Correctness: correctness,
        Seconds: seconds,
        Timestamp: getMySqlDateTime(new Date()),
        TestCount: testCount
    });

    localStorage.setItem('testResults', JSON.stringify(results));
    localStorage.setItem('currentTestWhichDay', whichDay); // 최신 날짜 정보 저장
    updateResultsList();

    currentWordIndex++;
    displayNextWord();
    updateScoreboard();
    fadeOutEffect();
    startTimer(); // 타이머를 재시작합니다.
}

function fadeOutEffect() {
    const feedback = document.getElementById('feedback');
    feedback.style.display = '';
    let opacity = 1;
    const timer = setInterval(function() {
        if (opacity <= 0) {
            clearInterval(timer);
            feedback.style.opacity = 0;
        } else {
            opacity -= 0.05;
            feedback.style.opacity = opacity;
        }
    }, 100);
}

// 다음 버튼 클릭 시 새로운 테스트 페이지로 이동하는 이벤트 리스너
document.getElementById('next').addEventListener('click', function() {
    const currentUserId = localStorage.getItem('currentUserId'); // 로컬 저장소에서 현재 사용자 ID를 가져옴
    if (currentUserId) { // 사용자 ID가 설정되어 있으면
        window.location.href = `wordTest2.html?id=${currentUserId}`; // 새로운 테스트 페이지로 이동
    } else { // 사용자 ID가 설정되어 있지 않으면
        alert("User ID is not set. Please check and try again."); // '사용자 ID가 설정되어 있지 않습니다. 확인 후 다시 시도하세요.'라는 알림창을 표시
    }
});

window.onload = function() {
    loadJsonData();
};
