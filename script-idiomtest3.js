let currentWordIndex = 0;
let filteredWords = [];
let choices = [];
let correctAnswers = 0;
let totalQuestions = 0;
let startTime, endTime;
let testCount = 0;
let isResultsSaved = false;
let timerUpdate;

document.addEventListener('DOMContentLoaded', function() {
    loadLocalData();
});

function loadLocalData() {
    fetch('Paragraphes_idiom_mk1.json')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('idiomList', JSON.stringify(data)); // 데이터를 문자열로 변환하여 저장
            populateAllDropdowns();
        })
        .catch(error => {
            console.error('데이터를 불러오지 못했습니다:', error);
        });
}

function populateAllDropdowns() {
    const data = JSON.parse(localStorage.getItem('idiomList')); // localStorage에서 데이터 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const selectedLevel = urlParams.get('grade');
    const selectedYear = urlParams.get('year');
    const selectedMonth = urlParams.get('month');
    const selectedNumber = urlParams.get('number');

    if (data) {
        populateDropdown('QLevel', data.map(item => item.학년.toString()));
        populateDropdown('QYear', data.map(item => item.연도.toString()));
        populateDropdown('QMonth', data.map(item => item.월.toString()));
        populateDropdown('QNo', data.map(item => item.문제번호.toString()));
        
        setDropdownValue('QLevel', selectedLevel);
        setDropdownValue('QYear', selectedYear);
        setDropdownValue('QMonth', selectedMonth);
        setDropdownValue('QNo', selectedNumber);

        document.getElementById('startTestButton').disabled = false;
    }
}

// 드롭다운을 특정 값으로 설정하는 함수
function setDropdownValue(dropdownId, value) {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
        dropdown.value = value;
    }
}

// 특정 드롭다운을 채우는 함수
function populateDropdown(level, values) {
    const dropdown = document.getElementById(level);
    const uniqueValues = [...new Set(values)]; // 중복 없는 값만 추출
    resetDropdown(dropdown, `Select ${level}`);
    addOptionsToSelect(dropdown, uniqueValues);
    dropdown.disabled = false;
}

// 드롭다운에 옵션을 추가하는 함수
function addOptionsToSelect(selectElement, options) {
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        selectElement.appendChild(optionElement);
    });
}

// 드롭다운을 초기화하는 함수
function resetDropdown(selectElement, placeholder) {
    selectElement.innerHTML = `<option value="" disabled selected>${placeholder}</option>`;
    selectElement.disabled = true;
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

    const selectedLevel = document.getElementById('QLevel').value;
    const selectedYear = document.getElementById('QYear').value;
    const selectedMonth = document.getElementById('QMonth').value;
    const selectedNumber = document.getElementById('QNo').value;

    const testRange = selectedLevel + selectedYear + selectedMonth + selectedNumber;

    localStorage.setItem('testRange', testRange);

    const storedWords = JSON.parse(localStorage.getItem('idiomList'));
    console.log('Stored Words:', storedWords);

    if (!storedWords || storedWords.length === 0) {
        console.error('No words loaded from storage.');
        return;
    }

    filteredWords = storedWords.filter(item => {
        return item.학년.toString() === selectedLevel &&
               item.연도.toString() === selectedYear &&
               item.월.toString() === selectedMonth &&
               item.문제번호.toString() === selectedNumber;
    });

    if (filteredWords.length === 0) {
        alert("No data available for the selected criteria.");
        return;
    }

    shuffle(filteredWords);
    // 문제 출제 시작
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
        document.getElementById('question').textContent = `Q. "${word.Idiom}"의 뜻은 무엇인가요?`;

        choices = generateChoices(word.Translation, filteredWords);
        choicesContainer.innerHTML = '';
        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.textContent = choice;
            button.onclick = () => checkAnswer(index);
            choicesContainer.appendChild(button);
        });

        choicesContainer.style.visibility = 'visible';
    } else {
        document.getElementById('question').textContent = '모든 단계가 끝났습니다, 고생하셨어요!';
        choicesContainer.style.visibility = 'hidden';
        stopTimerAndReset();
        if (!isResultsSaved) {
            saveResults();
            isResultsSaved = true;
        }
    }
}

function generateChoices(correctMeaning, wordsList) {
    const choices = [correctMeaning];
    while (choices.length < 4) {
        const randomIndex = Math.floor(Math.random() * wordsList.length);
        const randomChoice = wordsList[randomIndex].Translation;
        if (!choices.includes(randomChoice)) {
            choices.push(randomChoice);
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
    let testRange = localStorage.getItem('testRange');
    let resultsArray = JSON.parse(storedResults);
    let formattedResults = resultsArray.map(result => {
        return {
            subjectName: 'Vocabulary',
            subcategoryName: 'Idioms',
            quizNo: 3,  // QuizNo는 3으로 설정합니다.
            userResponse: result.UserResponse,
            correctAnswer: result.CorrectAnswer,
            correctness: result.Correctness,
            timestamp: result.Timestamp,
            testCount: result.TestCount,
            testRange: testRange
        };
    }).filter(result => result != null);

    const requestBody = JSON.stringify({
        userId: currentUserId,
        results: formattedResults
    });

    console.log('Request Body for saveResults:', requestBody); // 로그 출력

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
                subcategoryName: 'Idioms',
                quizNo: 3, // 결과 배열의 첫 번째 항목의 QuizNo를 사용합니다.
                testScore: testScore,
                testCount: testCount,
                whichDay: whichDay // 로컬 스토리지에서 가져온 최신 날짜를 사용합니다.
            }]
        };

        const gradesRequestBody = JSON.stringify(gradesData);

        console.log('Request Body for saveGrades:', gradesRequestBody); // 로그 출력

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
        localStorage.removeItem('testResults'); // 결과 데이터를 로컬 스토리지에서 삭제합니다.
        localStorage.removeItem('currentTestScore'); // 현재 테스트 점수를 로컬 스토리지에서 삭제합니다.
        localStorage.removeItem('currentTestWhichDay'); // 저장된 날짜 정보를 로컬 스토리지에서 삭제합니다.
        localStorage.removeItem('testRange');
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

function updateResultsList() {
    const resultsList = document.getElementById('results');
    resultsList.innerHTML = '';
    const storedResults = JSON.parse(localStorage.getItem('testResults') || '[]');

    storedResults.filter(result => result.TestCount === testCount).forEach((result, index) => {
        const listItem = document.createElement('li');
        const correctnessIcon = result.Correctness ? '✔️' : '❌';
        const section = result.QuizNo === 3 ? 'A' : 'B';

        listItem.textContent = `#${index + 1}. - (${result.CorrectAnswer}) ${correctnessIcon} - ${result.Seconds}초 `;
        resultsList.appendChild(listItem);
    });
}

function checkAnswer(selectedIndex) {
    const isCorrect = choices[selectedIndex] === filteredWords[currentWordIndex].Translation;
    const feedbackElement = document.getElementById('feedback');
    const seconds = stopTimer(); // 걸린 시간을 stopTimer 함수에서 가져옴
    const correctAnswer = filteredWords[currentWordIndex].Translation; // 올바른 답안 가져오기
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

    const quizNo = 3; // 문제 번호를 3으로 고정
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

function goToRoom() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    if (userId) {
        window.location.href = `Room.html?id=${userId}`;
    } else {
        alert("User ID가 설정되지 않았습니다.");
    }
}

document.getElementById('Grades').addEventListener('click', function() {
    const currentUserId = localStorage.getItem('currentUserId');
    if (currentUserId) {
        window.location.href = `grades-Vocabulary.html?id=${currentUserId}`;
    } else {
        alert("User ID is not set. Please check and try again.");
    }
});

function saveButton() {
    alert('Save button coming up!');
}