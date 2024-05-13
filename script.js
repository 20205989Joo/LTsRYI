let wordList = [];
let currentWordIndex = 0;
let uniqueDays = [];
let filteredWords = [];
let correctAnswers = 0; // 정답 수
let totalQuestions = 0; // 전체 문제 수
let startTime, endTime;
let testCount = 0;  // 전역 변수로 테스트 카운트를 추가

// JSON 데이터 로드
function loadJsonData() {
    fetch('MID-A_jsonarray.json')
        .then(response => response.json())
        .then(data => {
            wordList = data.data;  // 데이터 배열 저장
            extractUniqueDays();  // 고유한 'DAY' 값을 추출
            populateDayOptions(); // 드롭다운 옵션 채우기
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
    isResultsSaved = false; // 초기화
    updateScoreboard();
    displayNextWord();
    startTimer();
    updateTimerDisplay();
}

function updateScoreboard() {
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.textContent = `정답률 : ${correctAnswers} / Total : ${totalQuestions}`;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function displayNextWord() {
    if (currentWordIndex < filteredWords.length) {
        const word = filteredWords[currentWordIndex];
        document.getElementById('question').textContent = `Q. "${word[2]}"를 영어로 하면?`;
        document.getElementById('answer').style.visibility = 'visible'; // 답 입력 필드 다시 보이도록 설정
    } else {
        document.getElementById('question').textContent = '끝! 고생하셨습니다!';
        document.getElementById('answer').style.visibility = 'hidden';
        document.getElementById('submit').style.display = 'none'; // Submit 버튼 숨기기
        stopTimerAndReset(); // 스톱워치 멈추기 및 리셋
        if (!isResultsSaved) {
            saveResults(); // 테스트 결과 저장
            isResultsSaved = true; // 결과 저장 상태 갱신
        }
    }
}

function saveResults() {
    // 결과 데이터를 HTML 요소에서 추출
    let resultsHtml = document.getElementById('results').innerHTML;
    localStorage.setItem(`testResults-${testCount}`, resultsHtml);  // 각 테스트 결과를 개별적으로 저장


    // 사용자에게 데이터 전송 전에 확인 받기
    if (confirm("테스트 결과를 저장하시겠습니까?")) {
        // JSON 형태로 서버에 데이터 전송
        fetch('https://web-ltryi-1ru12mlw3glz2u.sel5.cloudtype.app/saveResults', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ results: resultsHtml })
        })
        .then(response => {
            if (!response.ok) { // 응답 상태 확인
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            alert('Results saved successfully!');
            isResultsSaved = true;  // 성공적으로 데이터를 저장했음을 표시
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Failed to save results.');
            isResultsSaved = false;  // 실패했을 경우 상태를 false로 설정
        });
    } else {
        alert("결과 전송이 취소되었습니다.");
        isResultsSaved = false;  // 사용자가 취소한 경우 false 유지
    }
}


function startTimer() {
    startTime = new Date();
}

function stopTimer() {
    endTime = new Date();
    let timeDiff = endTime - startTime;
    let seconds = Math.floor(timeDiff / 1000);
    return seconds;
}

function updateTimerDisplay() {
    let currentTime = new Date();
    let timeDiff = currentTime - startTime;
    let seconds = Math.floor((timeDiff / 1000) % 60);
    let minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
    document.getElementById('timer').textContent = `${pad(minutes)}:${pad(seconds)}`;
    timerUpdate = setTimeout(updateTimerDisplay, 500);
}

function stopTimerAndReset() {
    clearTimeout(timerUpdate);
    document.getElementById('timer').textContent = '-- : --';
}

function pad(value) {
    return value.toString().padStart(2, '0');
}

function updateResultsList(questionIndex, isCorrect, correctAnswer, seconds) {
    const resultList = document.getElementById('results');
    if (!resultList) {
        const container = document.createElement('div');
        container.id = 'resultList';
        container.style.cssText = 'position: fixed; right: 10px; top: 50px; width: 200px; background-color: #fff; padding: 10px; border: 1px solid #ccc; border-radius: 5px;';
        document.body.appendChild(container);

        const list = document.createElement('ul');
        list.id = 'results';
        container.appendChild(list);
    }

    const resultItem = document.createElement('li');
    resultItem.textContent = `${questionIndex + 1}. ${correctAnswer} (${isCorrect ? '✔️' : '❌'}, ${seconds}초)`;
    resultList.appendChild(resultItem);
}

function checkAnswer() {
    const userInputElement = document.getElementById('answer');
    const userInputValue = userInputElement.value;
    const correctAnswer = filteredWords[currentWordIndex][1];
    const feedbackElement = document.getElementById('feedback');
    const seconds = stopTimer();

    feedbackElement.style.display = '';
    feedbackElement.style.opacity = 1;
    feedbackElement.classList.remove('correct', 'wrong');

    let isCorrect = userInputValue.toLowerCase() === correctAnswer.toLowerCase();
    if (isCorrect) {
        feedbackElement.textContent = '✔️ Correct!';
        feedbackElement.classList.add('correct');
        correctAnswers++;
    } else {
        feedbackElement.textContent = `❌ Wrong! 정답은 : ${correctAnswer}`;
        feedbackElement.classList.add('wrong');
    }

    userInputElement.value = '';
    updateResultsList(currentWordIndex, isCorrect, correctAnswer, seconds);
    currentWordIndex++;
    displayNextWord();
    updateScoreboard();
    fadeOutEffect();
    startTimer();
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

document.getElementById('answer').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        checkAnswer();
    }
});

window.onload = function() {
    loadJsonData();
    const form = document.getElementById('resultForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();  // 기본 제출 방지
        saveResults();  // 사용자 정의 결과 저장 및 제출 함수 호출
    });
};
