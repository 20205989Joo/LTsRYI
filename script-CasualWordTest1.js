// 정답 개수와 전체 문제 수 추적 변수
let correctCount = 0;
let totalQuestions = 0;

function saveResults(userId, subjectName, subcategoryName, quizNo, userResponse, correctAnswer, correctness, testCount, testRange) {
    const timestamp = getMySqlDateTime(new Date()); // 변환된 timestamp 적용

    // TestCount가 문자열이라면 숫자로 변환
    if (typeof testCount === 'string') {
        testCount = parseInt(testCount, 10);
    }

    const newResult = {
        userId: getUserIdFromURL(),
        subjectName: "Vocabulary",
        subcategoryName: "Words",
        quizNo: 1,
        userResponse: userResponse,
        correctAnswer: correctAnswer,
        correctness: correctness,
        timestamp: timestamp,
        testCount: testCount,
        testRange: testRange
    };

    // 로컬 스토리지에서 기존 결과를 가져오고, 없으면 빈 배열로 초기화
    let results = JSON.parse(localStorage.getItem('results'));
    
    // results가 null일 경우 빈 배열로 초기화
    if (!Array.isArray(results)) {
        results = [];
    }

    results.push(newResult); // 배열에 새로운 결과 추가

    // 로컬 스토리지에 저장하기 전에 로그로 출력
    console.log('현재 저장된 results:', results);

    localStorage.setItem('results', JSON.stringify(results)); // 로컬 스토리지에 저장
}

function getMySqlDateTime(dateInput) {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
        console.error("Invalid date input:", dateInput);
        return null;
    }
    return date.toLocaleString("sv-SE").replace('T', ' ');
}


// URL 파라미터에서 userId (실제로는 id) 읽어오기
function getUserIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // 'id' 파라미터 값을 가져오기
    const userId = urlParams.get('id');
    
    // URL 파라미터에 'id'가 없으면 'defaultUserId' 반환
    if (!userId) {
        console.warn('userId가 URL 파라미터에 없습니다. 기본 값인 "defaultUserId"를 사용합니다.');
        return 'defaultUserId';
    }

    console.log('userId 파라미터 값:', userId);  // 디버깅을 위한 로그
    return userId;
}



// 드롭다운 메뉴 생성 및 이벤트 처리
window.addEventListener('DOMContentLoaded', (event) => {
    const mainPage = document.querySelector('.main-page');
    const mpWindow = document.querySelector('.mp_window');

    // Wordbook 드롭다운 가져오기
    const wordbookSelect = document.getElementById('wordbookSelect');
    const startDaySelect = document.getElementById('startDaySelect');
    const endDaySelect = document.getElementById('endDaySelect');

    // Start Test 버튼 가져오기
    const startTestButton = document.getElementById('startTestButton');

    // 드롭다운 값 변경 이벤트 처리
    wordbookSelect.addEventListener('change', function() {
        const selectedWordbook = wordbookSelect.value;

        if (selectedWordbook === 'MID-A') {
            fetch('MID-A_jsonarray.json')
                .then(response => response.json())
                .then(data => {
                    // DAY 값 추출하여 Start Day와 End Day에 추가
                    const days = [...new Set(data.data.map(item => item[0]))];
                    startDaySelect.innerHTML = '';
                    endDaySelect.innerHTML = '';

                    startDaySelect.appendChild(new Option('Select Start Day', ''));
                    endDaySelect.appendChild(new Option('Select End Day', ''));

                    days.forEach(day => {
                        startDaySelect.appendChild(new Option(day, day));
                        endDaySelect.appendChild(new Option(day, day));
                    });
                })
                .catch(error => console.error('Error fetching wordbook:', error));
        } else {
            // Start Day와 End Day 초기화
            startDaySelect.innerHTML = '<option>Select Start Day</option>';
            endDaySelect.innerHTML = '<option>Select End Day</option>';
        }
    });

    // Start Day와 End Day 값 변경 시 Start Test 버튼 활성화 여부 체크
    function checkStartTestButton() {
        if (startDaySelect.value && endDaySelect.value && startDaySelect.value !== 'Select Start Day' && endDaySelect.value !== 'Select End Day') {
            startTestButton.disabled = false;
        } else {
            startTestButton.disabled = true;
        }
    }

    startDaySelect.addEventListener('change', checkStartTestButton);
    endDaySelect.addEventListener('change', checkStartTestButton);

    // 선택된 텍스트를 표시할 새로운 컨테이너 가져오기
    const selectionContainer = document.getElementById('selectionContainer');

    // 문제 출제 영역 가져오기
    const questionContainer = document.querySelector('.question-container');
    const questionText = questionContainer.querySelector('p');

    // 정답/오답 메시지 컨테이너 가져오기
    const messageContainer = document.getElementById('messageContainer');

    // 문제 데이터를 저장할 배열
    let quizData = [];
    let currentQuestionIndex = 0;

    function fetchQuizData() {
        return new Promise((resolve, reject) => {
            const selectedWordbook = wordbookSelect.value; // 선택된 단어집을 가져옴
            const selectedStartDay = startDaySelect.value;  // 선택된 Start Day
            const selectedEndDay = endDaySelect.value;      // 선택된 End Day
    
            if (selectedWordbook === 'MID-A') {  // 'MID-A'가 선택된 경우
                fetch('MID-A_jsonarray.json')  // 'MID-A_jsonarray.json' 파일을 불러옴
                    .then(response => response.json())  // 응답을 JSON으로 파싱
                    .then(data => {
                        // Day 범위에 맞는 데이터만 필터링
                        quizData = data.data.filter(item => {
                            const day = item[0]; // item[0]이 Day 값
                            return day >= selectedStartDay && day <= selectedEndDay;
                        });
    
                        // 필터링된 데이터만 퀴즈 데이터로 설정
                        quizData = quizData.map(item => ({
                            word: item[1],  // 단어
                            meaning: item[2],  // 뜻
                        }));
    
                        quizData = shuffleArray(quizData);  // 퀴즈 데이터 순서를 셔플
    
                         // 전체 문제 수 설정
                    totalQuestions = quizData.length;

                        // 전체 퀴즈 데이터 로그 출력
                        console.log("필터링된 퀴즈 데이터:", quizData);

                        // 정답률 초기화
                    correctRateUpdater();
    
                        resolve();  // 데이터가 정상적으로 로드되었으면 resolve 호출
                    })
                    .catch(error => {
                        reject(error);  // 오류 발생 시 reject 호출
                    });
            }
        });
    }
    

// 선택지 생성 함수 (올바른 뜻 + 틀린 뜻 4개)
function generateOptions(correctAnswer) {
    let options = [correctAnswer];

    // 임의로 틀린 뜻 추가
    while (options.length < 5) {
        const randomIndex = Math.floor(Math.random() * quizData.length);
        const randomAnswer = quizData[randomIndex];
        if (!options.includes(randomAnswer)) {
            options.push(randomAnswer);
        }
    }

    // 정답을 무작위 위치에 배치
    const correctIndex = Math.floor(Math.random() * options.length);
    [options[0], options[correctIndex]] = [options[correctIndex], options[0]];

    // 옵션 순서 섞기
    return shuffleArray(options);
}

    // 배열을 섞는 함수 (셔플)
    function shuffleArray(array) {
        let shuffledArray = array.slice();
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // 두 요소 교환
        }
        return shuffledArray;
    }

// 선택지 클릭 이벤트 리스너 함수
function optionClickListener(option, currentQuestion) {
    console.log('optionClickListener 호출됨');  // optionClickListener 호출 시 로그

    // 정답 확인 후, 다음 문제 출제
    checkAnswer(option, currentQuestion);  // 정답/오답 확인
}

// 문제 출제 함수
function displayQuestion() {
    console.log('displayQuestion 호출됨');  // displayQuestion 호출 시 로그

    // 모든 문제를 다 출제한 경우
    if (currentQuestionIndex >= quizData.length) {
        // 선택지 텍스트를 모두 없애고 opacity를 흐리게 설정
        const optionElements = document.querySelectorAll('.option');  // 모든 옵션 div들 선택
        optionElements.forEach(option => {
            option.querySelector('.option-label').textContent = '';  // 선택지 텍스트를 비우기
            option.style.opacity = '0.3';  // 선택지의 불투명도를 낮춰 흐리게 설정
        });

        // 문제 영역에 "테스트 끝!" 메시지 표시하고 opacity를 낮추기
        const questionText = document.querySelector('.question-container p');
        questionText.textContent = "테스트 끝!";
        document.querySelector('.question-container').style.opacity = '0.3';  // 문제 영역도 흐리게 설정

        return;  // 더 이상 문제를 출제하지 않음
    }

    const currentQuestion = quizData[currentQuestionIndex];
    console.log('출제 문제:', currentQuestion);

    // 문제 영역에 단어 표시
    questionText.textContent = currentQuestion.word;

    // 선택지 섹션에 선택지 텍스트를 설정
    const options = generateOptions(currentQuestion);  // 셔플된 선택지 배열을 받아옴

    // 선택지 버튼을 적절한 위치에 배치
    const optionElements = document.querySelectorAll('.option');  // 모든 옵션 div들 선택

    // 선택지 클릭 이벤트 리스너 추가 (매번 갱신)
    options.forEach((option, index) => {
        const optionLabel = optionElements[index].querySelector('.option-label');
        optionLabel.textContent = option.meaning;  // 의미를 옵션 라벨에 삽입
        optionElements[index].style.display = 'block';  // 선택지 영역을 보이게 설정

        // 기존 리스너가 있다면 제거하고 새 리스너 등록
        const optionDiv = optionElements[index];
        
        // 기존 리스너 제거
        const oldListener = optionDiv.listener;
        if (oldListener) {
            optionDiv.removeEventListener('click', oldListener); // 기존 리스너 제거
        }

        // 새로운 리스너 생성하여 등록
        const newListener = function() {
            optionClickListener(option, currentQuestion);  // 선택지 클릭 시 정답 확인
        };

        optionDiv.addEventListener('click', newListener);  // 새로운 리스너 등록
        optionDiv.listener = newListener;  // 리스너를 div에 저장 (중복 방지)
    });

    // 나머지 선택지 숨기기 (미사용 옵션은 숨기기)
    const remainingOptions = Array.from(optionElements).slice(options.length);
    remainingOptions.forEach(optionDiv => optionDiv.style.display = 'none');
}





// 정답 확인 함수
function checkAnswer(selectedOption, correctAnswer) {
    console.log('checkAnswer 호출됨');  // checkAnswer 호출 시 로그

    let correctness = 0;  // 기본적으로 오답
    if (selectedOption.meaning === correctAnswer.meaning) {
        messageContainer.textContent = 'Correct!';
        messageContainer.style.backgroundColor = 'green';
        correctness = 1;  // 정답
        correctCount++;  // 정답 개수 증가
    } else {
        messageContainer.textContent = 'Wrong!';
        messageContainer.style.backgroundColor = 'red';
    }

    // 메시지 즉시 보이게 설정
    messageContainer.style.display = 'block';

    // 문제 인덱스를 증가시키고 바로 다음 문제 출제
    currentQuestionIndex++;  // 문제 인덱스 증가

    // testCount 갱신 (이전 testCount에서 새로 가져와야 하므로 updateTestCount 호출)
    const userId = getUserIdFromURL();  // URL에서 userId 가져오기
    const testCount = localStorage.getItem('testCount'); // 로컬 저장소에서 testCount 가져오기

    // 선택된 텍스트 (testRange)를 축약
    const testRange = abbreviateTestRange(selectionContainer.textContent);

    // timestamp는 현재 시간
    const timestamp = new Date().toISOString();  // 현재 시간 (ISO 8601 형식)

    // saveResults 호출하여 결과 저장
    saveResults(
        userId,               // 사용자 ID
        'Vocabulary',         // 고정값
        'Words',              // 고정값
        1,                    // 고정값 (quizNo)
        selectedOption.meaning,  // 사용자가 선택한 답
        correctAnswer.meaning,  // 정답
        correctness,          // 정답 여부
        testCount,            // testCount (로컬에서 갱신된 값)
        testRange,            // testRange (선택된 텍스트)
        timestamp             // timestamp (현재 시간)
    );

    // 정답률 업데이트
    correctRateUpdater();

    // 1. 모든 리스너 제거
    const optionElements = document.querySelectorAll('.option');  // 모든 옵션 div들 선택
    optionElements.forEach(option => {
        option.removeEventListener('click', option.clickHandler);  // 기존 리스너 제거
    });

    // 2. 일정 시간 후에 메시지 숨기기
    setTimeout(() => {
        messageContainer.style.display = 'none';  // 메시지 숨기기
        displayQuestion();  // 2초 후에 다음 문제 출제
    }, 300);  // 2초 후에 문제 전환
}

// 정답률을 업데이트하는 함수
function correctRateUpdater() {
    // 정답률 계산 (백분율)
    const correctRate = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    
    // UI에 정답률 표시
    const correctRateElement = document.getElementById('correctRate');
    correctRateElement.textContent = `${correctCount} / ${totalQuestions} (${correctRate.toFixed(2)}%)`;
}

// testRange 축약 함수
function abbreviateTestRange(testRange) {
    // "MID-A", "MID-B", "MID-C"를 "MA", "MB", "MC"로 변환
    let abbreviated = testRange.replace("MID-A", "MA")
                               .replace("MID-B", "MB")
                               .replace("MID-C", "MC");
    
    // "DAY " 부분을 제거하고 숫자만 남기기
    abbreviated = abbreviated.replace(/DAY\s/g, "");
    
    return abbreviated;
}

// testCount 값을 로컬 스토리지에서 가져오거나, 없으면 기본값 1을 할당한 후 +1 증가시키는 함수
function updateTestCount() {
    let testCount = localStorage.getItem('testCount');

    // 로컬 스토리지에 testCount가 없으면 기본값 1 할당
    if (!testCount) {
        console.log("testCount가 로컬에 없으므로 기본값 1을 할당합니다.");
        testCount = 1;
        localStorage.setItem('testCount', testCount);  // 로컬 스토리지에 1 저장
    } else {
        testCount = parseInt(testCount, 10);  // 문자열로 저장된 값을 숫자로 변환

        // 만약 parseInt 결과가 NaN이면 기본값 1 할당
        if (isNaN(testCount)) {
            console.log('testCount가 NaN으로 변환되었습니다. 기본값 1을 할당합니다.');
            testCount = 1;
            localStorage.setItem('testCount', testCount);  // NaN일 경우 다시 1로 저장
        } else {
            console.log('현재 testCount:', testCount);
        }
    }

    // testCount를 1 증가시켜서 저장
    testCount += 1;
    localStorage.setItem('testCount', testCount);  // 증가한 값을 로컬 스토리지에 저장

    // 증가된 testCount를 반환
    console.log('testCount가 증가되었습니다:', testCount);
    return testCount;
}

function sendToServer() {
    // 로컬 스토리지에서 results 가져오기
    const results = JSON.parse(localStorage.getItem('results'));

    // results가 null이거나 빈 배열일 경우 처리
    if (!results || results.length === 0) {
        console.log("저장된 결과가 없습니다.");
        return;
    }

    // userId를 로컬 스토리지에서 가져오기 또는 URL 등에서 추출
    const userId = getUserIdFromURL();  // getUserIdFromURL() 함수가 이미 존재한다고 가정

    // 서버로 전송할 데이터 객체
    const requestBody = JSON.stringify({
        userId: userId,  // userId를 추가
        results: results  // results는 기존대로 배열 형식
    });

    // 서버로 전송
    fetch('https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app/api/saveResults', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: requestBody, // 요청 본문에 userId와 results를 함께 포함
    })
    .then(response => response.json())
    .then(data => {
        // 성공적으로 전송되었으면 메시지 표시
        console.log('서버 응답:', data);
        alert('제출되었습니다!');
        
        // 로컬 스토리지 비우기
        localStorage.setItem('results', JSON.stringify([]));  // 서버로 전송 후 로컬 저장소 비우기
    })
    .catch(error => {
        // 오류 발생 시 실패 메시지 표시
        console.error('서버로 데이터를 보내는 중 오류 발생:', error);
        alert('뭔가 오류가 있는 것 같아요');
    });

    // 무엇을 보냈는지 로그로 출력
    console.log('서버로 전송된 데이터:', requestBody);
}


// Submit 버튼 클릭 시 서버로 결과 전송
document.querySelector('.submit').addEventListener('click', function() {
    sendToServer();  // 서버로 결과 전송
});




// Start Test 버튼 클릭 시, 텍스트 표시 및 문제 영역 보이기
startTestButton.addEventListener('click', () => {
    const selectedWordbook = wordbookSelect.value;
    const selectedStartDay = startDaySelect.value;
    const selectedEndDay = endDaySelect.value;

    localStorage.setItem('results', JSON.stringify([])); // 빈 배열로 초기화

    // 선택된 텍스트를 선택된 컨테이너에 표시
    selectionContainer.textContent = `${selectedWordbook} ${selectedStartDay} ${selectedEndDay}`;

    // 드롭다운 메뉴와 Start Test 버튼 숨기기 
    wordbookSelect.style.display = 'none';
    startDaySelect.style.display = 'none';
    endDaySelect.style.display = 'none';
    startTestButton.style.display = 'none';

    // 문제 영역 보이기
    questionContainer.style.display = 'flex';  // 문제 영역 보이게 설정

    // userId를 URL에서 가져오기
    const userId = getUserIdFromURL(); // URL에서 id 파라미터를 userId로 가져옵니다.

    // testCount 갱신
    updateTestCount(userId);

    // 퀴즈 데이터 불러오기
    fetchQuizData()
        .then(() => {
            // 첫 번째 문제 출제
            displayQuestion();
        })
        .catch(error => console.error("퀴즈 데이터를 불러오는 중 오류가 발생했습니다.", error));
});
});





