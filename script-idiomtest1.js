let idiomList = []; // 전역 변수로 숙어 목록을 저장할 배열 선언
let currentIdiomIndex = 0; // 현재 진행 중인 숙어의 인덱스를 저장할 변수 선언
let uniqueDays = []; // 고유한 날짜를 저장할 배열 선언
let filteredIdioms = []; // 선택된 날짜에 해당하는 숙어들을 저장할 배열 선언
let correctAnswers = 0; // 사용자의 정답 수를 저장할 변수 선언
let totalQuestions = 0; // 전체 문제 수를 저장할 변수 선언
let startTime, endTime; // 테스트의 시작 시간과 종료 시간을 저장할 변수 선언
let testCount = 0;  // 사용자가 시험을 치른 횟수를 저장할 변수 선언
let isResultsSaved = false; // 테스트 결과가 저장되었는지 여부를 저장할 변수 선언
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
    fetch('KSAT-Idioms-900.json')
        .then(response => response.json())
        .then(data => {
            idiomList = data;
            extractUniqueDays();
            populateDayOptions();
            initializeChoices();
        })
        .catch(error => console.error('Error loading the JSON data: ', error));
}

function extractUniqueDays() {
    const daysSet = new Set();
    idiomList.forEach(item => daysSet.add(item.Day));
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
    filteredIdioms = idiomList.filter(idiom => {
        const day = parseInt(idiom.Day.replace(/Day /, ''));
        return day >= parseInt(startDay.replace(/Day /, '')) && day <= parseInt(endDay.replace(/Day /, ''));
    });
    shuffle(filteredIdioms);
    currentIdiomIndex = 0;
    correctAnswers = 0;
    totalQuestions = filteredIdioms.length;
    isResultsSaved = false;
    updateScoreboard();
    displayNextIdiom();
    startTimer();
    updateTimerDisplay();
}


function updateScoreboard() {
    const scoreboard = document.getElementById('scoreboard');
    if (totalQuestions > 0) {
        const accuracyRate = ((correctAnswers / totalQuestions) * 100).toFixed(2); // 백분율로 계산하고 소수점 두 자리로 제한
        localStorage.setItem('currentTestScore', accuracyRate); // 로컬 저장소에 정답률 저장
    } else {
        localStorage.setItem('currentTestScore', '0.00'); // 문제가 없을 경우 정답률을 0.00%로 저장
    }
    scoreboard.textContent = `정답률 : ${correctAnswers} / Total : ${totalQuestions}`;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function displayNextIdiom() {
    if (currentIdiomIndex < filteredIdioms.length) {
        const idiom = filteredIdioms[currentIdiomIndex];
        const initials = idiom.BlankAnswer.split(',').map(word => word.trim().charAt(0)).join(', ');
        const questionHTML = idiom.ExWithBold.replace(/<strong>(.*?)<\/strong>/g, '<span style="color: teal;">$1</span>');
        document.getElementById('question').innerHTML = `Q. "${questionHTML}" `;

        choices = generateChoices(idiom.Translation, filteredIdioms);
        const choicesContainer = document.getElementById('choices');
        choicesContainer.innerHTML = '';
        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.textContent = choice;
            button.onclick = () => checkAnswer(index);
            choicesContainer.appendChild(button);
        });

        document.getElementById('choices').style.visibility = 'visible';
    } else {
        document.getElementById('question').textContent = '다음 Test로 넘어갑니다.';
        document.getElementById('choices').style.visibility = 'hidden';
        document.getElementById('next').style.display = 'block'; // 다음 버튼을 표시
        stopTimerAndReset();
        if (!isResultsSaved) {
            saveResults();
            isResultsSaved = true;
        }
    }
}


function generateChoices(correctAnswer, filteredIdioms) {
    const choices = [correctAnswer];
    while (choices.length < 5) {
        const randomIndex = Math.floor(Math.random() * filteredIdioms.length);
        const choice = filteredIdioms[randomIndex].Translation;
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

    let resultsArray = JSON.parse(storedResults);
    let formattedResults = resultsArray.map(result => ({
        subjectName: 'Vocabulary',
        subcategoryName: 'Idioms',
        quizNo: result.QuizNo,
        userResponse: result.UserResponse,
        correctAnswer: result.CorrectAnswer,
        correctness: result.Correctness,
        timestamp: result.Timestamp,
        testCount: result.TestCount
    }));

    let whichDay = localStorage.getItem('currentTestWhichDay'); // 로컬 스토리지에서 저장된 최신 날짜를 가져옵니다.

    // Prepare the request body for saving results and grades
    const resultsRequestBody = JSON.stringify({
        userId: currentUserId,
        results: formattedResults
    });

    // Prepare grades data
    let testScore = localStorage.getItem('currentTestScore'); // Get the current test score from localStorage
    const gradesRequestBody = JSON.stringify({
        userId: currentUserId,
        grades: [{
           subcategoryName: 'Idioms',
            quizNo: resultsArray[0].QuizNo, // Assuming quiz number is consistent within the results
            testScore: testScore,
            testCount: resultsArray[0].TestCount,
            whichDay: whichDay // Include the extracted whichDay
        }]
    });

    // Save Results
    fetch('https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app/api/saveResults', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: resultsRequestBody
    })
    .then(response => response.json())
    .then(() => {
        // Now save grades
        return fetch('https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app/api/saveGrades', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: gradesRequestBody
        });
    })
    .then(response => response.json())
    .then(data => {
        console.log('Grades saved successfully:', data);
        localStorage.removeItem('testResults'); // Clear the results from local storage
        localStorage.removeItem('currentTestScore'); // Clear the score from local storage
        localStorage.removeItem('currentTestWhichDay'); // Clear the saved date from local storage
        alert('성적 등록이 완료되었습니다!');
    })
    .catch(error => {
        console.error('Error saving results and grades:', error);
        alert('Failed to save results and grades.');
        isResultsSaved = false;
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

function updateResultsList() {
    const resultsList = document.getElementById('results');
    resultsList.innerHTML = '';
    const storedResults = JSON.parse(localStorage.getItem('testResults') || '[]');

    storedResults.filter(result => result.TestCount === testCount).forEach((result, index) => {
        const listItem = document.createElement('li');
        const correctnessIcon = result.Correctness ? '✔️' : '❌';

        listItem.textContent = `#${index + 1}. ${result.UserResponse} - (${result.CorrectAnswer}) ${correctnessIcon} - ${result.Seconds}초 `;
        resultsList.appendChild(listItem);
    });
}

function checkAnswer(selectedIndex) {
    const isCorrect = choices[selectedIndex] === filteredIdioms[currentIdiomIndex].Translation;
    const feedbackElement = document.getElementById('feedback');
    const seconds = stopTimer(); // 걸린 시간을 stopTimer 함수에서 가져옴
    const correctAnswer = filteredIdioms[currentIdiomIndex].Translation; // 올바른 답안 가져오기
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
    const timestamp = getMySqlDateTime(new Date());
    const whichDay = timestamp.split('T')[0]; // 'T'를 기준으로 날짜 부분만 추출

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
    localStorage.setItem('currentTestWhichDay', whichDay); // 최신 whichDay 정보 저장

    updateResultsList();

    currentIdiomIndex++;
    displayNextIdiom();
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
        window.location.href = `idiomTest2.html?id=${currentUserId}`; // 새로운 테스트 페이지로 이동
    } else { // 사용자 ID가 설정되어 있지 않으면
        alert("User ID is not set. Please check and try again."); // '사용자 ID가 설정되어 있지 않습니다. 확인 후 다시 시도하세요.'라는 알림창을 표시
    }
});

window.onload = function() {
    loadJsonData();
};
