document.addEventListener('DOMContentLoaded', function() {
    fetch('Paragraphes_mk1.json')
        .then(response => response.json())
        .then(data => {
            initializeDropdowns(data);
            initializeFields(); // 필드 초기화 함수 호출
            setDropdownFromURL(data); // URL에서 값 설정
        })
        .catch(error => console.error('Failed to load data:', error));

    function initializeDropdowns(data) {
        const gradeDropdown = document.getElementById('gradeDropdown');
        const yearDropdown = document.getElementById('yearDropdown');
        const monthDropdown = document.getElementById('monthDropdown');
        const numberDropdown = document.getElementById('numberDropdown');

        const grades = [...new Set(data.map(item => item.학년))];

        addOptionsToSelect(gradeDropdown, grades, '학년 선택');

        gradeDropdown.addEventListener('change', function() {
            const selectedGrade = parseInt(this.value);
            const years = [...new Set(data.filter(item => item.학년 === selectedGrade).map(item => item.연도))];
            
            resetDropdown(yearDropdown, '연도 선택');
            resetDropdown(monthDropdown, '월 선택');
            resetDropdown(numberDropdown, '번호 선택');
            
            addOptionsToSelect(yearDropdown, years, '연도 선택');
            yearDropdown.disabled = false;
        });

        yearDropdown.addEventListener('change', function() {
            const selectedGrade = parseInt(gradeDropdown.value);
            const selectedYear = parseInt(this.value);
            const months = [...new Set(data.filter(item => item.학년 === selectedGrade && item.연도 === selectedYear).map(item => item.월))];
            
            resetDropdown(monthDropdown, '월 선택');
            resetDropdown(numberDropdown, '번호 선택');
            
            addOptionsToSelect(monthDropdown, months, '월 선택');
            monthDropdown.disabled = false;
        });

        monthDropdown.addEventListener('change', function() {
            const selectedGrade = parseInt(gradeDropdown.value);
            const selectedYear = parseInt(yearDropdown.value);
            const selectedMonth = parseInt(this.value);
            const numbers = [...new Set(data.filter(item => item.학년 === selectedGrade && item.연도 === selectedYear && item.월 === selectedMonth).map(item => item.문제번호))];
            
            resetDropdown(numberDropdown, '번호 선택');
            
            addOptionsToSelect(numberDropdown, numbers, '번호 선택');
            numberDropdown.disabled = false;
        });

        numberDropdown.addEventListener('change', function() {
            const selectedGrade = parseInt(gradeDropdown.value);
            const selectedYear = parseInt(yearDropdown.value);
            const selectedMonth = parseInt(monthDropdown.value);
            const selectedNumber = parseInt(this.value);
            const selectedData = data.filter(item => item.학년 === selectedGrade && item.연도 === selectedYear && item.월 === selectedMonth && item.문제번호 === selectedNumber)[0];
            displayContent(selectedData);
            startTimer();
            populateQuestions();
        });
    }

    function initializeFields() {
        const paragraphField = document.getElementById('paragraphField');
        const choicesField = document.getElementById('choicesField');
        
        paragraphField.innerHTML = `
            <p class="question-number">Instruction</p>
            <p>Instruction content goes here.</p>
        `;
        
        const choicesHtml = `
            <p>&#9312; 선택지 1번</p>
            <p>&#9313; 선택지 2번</p>
            <p>&#9314; 선택지 3번</p>
            <p>&#9315; 선택지 4번</p>
            <p>&#9316; 선택지 5번</p>
        `;
        choicesField.innerHTML = choicesHtml;
    }

    function displayContent(data) {
        const paragraphField = document.getElementById('paragraphField');
        const choicesField = document.getElementById('choicesField');
        
        paragraphField.innerHTML = `
            <p class="question-number">${data.문제번호}. ${data.문제질문}</p>
            <p>${data.제시문}</p>
        `;
        
        const choicesHtml = `
            <p>&#9312; ${data['선택지 1'] || ''}</p>
            <p>&#9313; ${data['선택지 2'] || ''}</p>
            <p>&#9314; ${data['선택지 3'] || ''}</p>
            <p>&#9315; ${data['선택지 4'] || ''}</p>
            <p>&#9316; ${data['선택지 5'] || ''}</p>
        `;
        choicesField.innerHTML = choicesHtml;
    }

    function startTimer() {
        const timerElement = document.getElementById('timer');
        const timerText = timerElement.querySelector('.timer-text');
        let timeLeft = 30;
        const totalDuration = 30;
        
        const interval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(interval);
                showQuestionsPanel();
            }
            const progress = (timeLeft / totalDuration) * 100;
            timerElement.querySelector('.circle').style.strokeDasharray = `${progress}, 100`;
            timerText.textContent = timeLeft;
            timeLeft -= 1;
        }, 1000);
        
        document.getElementById('hideButton').onclick = function() {
            clearInterval(interval);
            timeLeft = 0;
            timerElement.querySelector('.circle').style.strokeDasharray = `0, 100`;
            timerText.textContent = timeLeft;
            showQuestionsPanel();
        };
    }

    function showQuestionsPanel() {
        document.querySelector('.right-panel .questions-container').style.display = 'flex';
        const coverRectangle = document.getElementById('coverRectangle');
        coverRectangle.style.backgroundColor = 'rgba(244, 244, 244, 1)';
        coverRectangle.style.visibility = 'visible';
    }

    function populateQuestions() {
        const questionsContainer = document.getElementById('questionsContainer');
        questionsContainer.innerHTML = ''; // Clear previous questions
        questionsContainer.innerHTML = `
            <div class="question">
                <p>1. 특이한 단어는 무엇이었나요? <span class="hint">(가장 자주 보이는 단어들, 의미심장한 단어 etc)</span></p>
                <textarea name="quiz1" rows="2" cols="50"></textarea>
            </div>
            <div class="question">
                <p>2. 어떤 분야의 글이었을까요?</p>
                <select name="quiz2-1">
                    <option value="" disabled selected>대분류</option>
                    <!-- 추가 옵션들을 여기에 추가할 수 있습니다 -->
                </select>
                <select name="quiz2-2">
                    <option value="" disabled selected>소분류</option>
                    <!-- 추가 옵션들을 여기에 추가할 수 있습니다 -->
                </select>
            </div>
            <div class="question">
                <p>3. 합해서, Topic은 무엇이었을까요?</p>
                <textarea name="quiz3" rows="1" cols="50"></textarea>
            </div>
            <div class="question">
                <p>4. 이 Topic 관련 아는 Cliche'는?</p>
                <textarea name="quiz4" rows="2" cols="50"></textarea>
            </div>
            <div class="question">
                <p>5. Main Idea를 예측해봅시다.</p>
                <textarea name="quiz5" rows="1" cols="50"></textarea>
            </div>
            <div class="question">
                <p>6. 그 외, 알 수 있던 내용은?</p>
                <textarea name="quiz6" rows="4" cols="50"></textarea>
            </div>
            <div class="question">
            <p>7. 정답은 몇 번일까요?</p>
            <textarea name="quiz7" rows="1" cols="50"></textarea>
        </div>
        `;

        // Hint guide 기능 추가
        document.querySelectorAll('textarea').forEach(textarea => {
            const hint = textarea.previousElementSibling.querySelector('.hint');
            if (hint) {
                textarea.placeholder = hint.textContent;
            }
            textarea.addEventListener('focus', function() {
                if (textarea.value === '') {
                    hint.style.display = 'none';
                }
            });
            textarea.addEventListener('blur', function() {
                if (textarea.value === '') {
                    hint.style.display = 'inline';
                }
            });
        });
    }

    // Drawing on coverRectangle using SVG lines
    const coverRectangle = document.getElementById('coverRectangle');
    let isDrawing = false;
    let x = 0;
    let y = 0;

    coverRectangle.addEventListener('mousedown', (e) => {
        isDrawing = true;
        x = e.offsetX;
        y = e.offsetY;
    });

    coverRectangle.addEventListener('mousemove', (e) => {
        if (isDrawing) {
            const newX = e.offsetX;
            const newY = e.offsetY;
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute('x1', x);
            line.setAttribute('y1', y);
            line.setAttribute('x2', newX);
            line.setAttribute('y2', newY);
            line.setAttribute('stroke', 'rgba(137, 119, 173, 0.8)'); // 연한 보라색
            line.setAttribute('stroke-width', '1.5'); // 선 두께
            coverRectangle.appendChild(line);
            x = newX;
            y = newY;
        }
    });

    coverRectangle.addEventListener('mouseup', () => {
        isDrawing = false;
    });

    coverRectangle.addEventListener('mouseleave', () => {
        isDrawing = false;
    });

    function addOptionsToSelect(selectElement, options, placeholder) {
        selectElement.innerHTML = `<option value="" disabled selected>${placeholder}</option>`; // 초기 옵션 설정
        options.forEach(option => {
            if (option !== null) { // null 값을 제외하고 추가
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                selectElement.appendChild(optionElement);
            }
        });
        selectElement.disabled = false; // 드롭다운 활성화
    }

    function resetDropdown(selectElement, placeholder) {
        selectElement.innerHTML = `<option value="" disabled selected>${placeholder}</option>`;
        selectElement.disabled = true;
    }

    function setDropdownFromURL(data) {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get('id');
        const QLevel = params.get('grade');
        const QYear = params.get('year');
        const QMonth = params.get('month');
        const QNo = params.get('number');

        if (QLevel) {
            const gradeDropdown = document.getElementById('gradeDropdown');
            gradeDropdown.value = QLevel;
            gradeDropdown.dispatchEvent(new Event('change'));

            if (QYear) {
                const yearDropdown = document.getElementById('yearDropdown');
                yearDropdown.value = QYear;
                yearDropdown.dispatchEvent(new Event('change'));

                if (QMonth) {
                    const monthDropdown = document.getElementById('monthDropdown');
                    monthDropdown.value = QMonth;
                    monthDropdown.dispatchEvent(new Event('change'));

                    if (QNo) {
                        const numberDropdown = document.getElementById('numberDropdown');
                        numberDropdown.value = QNo;
                        numberDropdown.dispatchEvent(new Event('change'));
                    }
                }
            }
        }
    }
    
    window.startTest = function() {
        document.getElementById('overlayContainer').style.display = 'none';
    };

    window.navigateToNextPage = function() {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get('id');
        const QLevel = params.get('grade');
        const QYear = params.get('year');
        const QMonth = params.get('month');
        const QNo = params.get('number');
        const url = `analysisTest3.html?id=${userId}&grade=${QLevel}&year=${QYear}&month=${QMonth}&number=${QNo}`;
        window.location.href = url;
    };
});
