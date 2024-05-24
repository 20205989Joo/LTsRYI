document.addEventListener('DOMContentLoaded', function() {
    let extractedKeywords = [];
    let userInputs = [];

    fetch('Paragraphlet_mk1.json')
    .then(response => response.json())
    .then(data => {
        initializeDropdowns(data);
        initializePrompts(data);
        extractedKeywords = extractKeywords(data[0]);
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
            initializePrompts([selectedData]);
            extractedKeywords = extractKeywords(selectedData);
            window.initializeMindmap(extractedKeywords);
        });
    }

    function initializePrompts(data) {
        const promptsContainer = document.getElementById('promptsContainer');
        promptsContainer.innerHTML = ''; // 기존 제시문 초기화

        for (let i = 1; i <= 5; i++) {
            const promptDiv = document.createElement('div');
            promptDiv.classList.add('prompt');

            const keyword = data[0][`키워드${i}`] ? `Keyword ${i}: ${data[0][`키워드${i}`]}` : `Keyword ${i}:`;
            const promptText = document.createElement('p');
            promptText.innerHTML = `<strong>${keyword}</strong>`; // 볼드 처리

            const text = data[0][`지문렛${i}`] || '미니 지문이 표시됩니다.';
            const promptContent = document.createElement('p');
            promptContent.textContent = text;

            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.placeholder = '내 말투와 표현으로 한줄 요약 해보자!';
            inputField.addEventListener('blur', function() {
                saveUserInput(i, inputField.value);
            });
            inputField.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    saveUserInput(i, inputField.value);
                    inputField.value = ''; // 엔터 치면 입력 필드 초기화
                }
            });

            promptDiv.appendChild(promptText);
            promptDiv.appendChild(promptContent);
            promptDiv.appendChild(inputField);
            promptsContainer.appendChild(promptDiv);
        }
    }

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

    function extractKeywords(data) {
        let keywords = [];
        for (let i = 1; i <= 5; i++) {
            const keyword = data[`키워드${i}`] ? `${i}. ${data[`키워드${i}`].split('(')[0].trim()}` : `Keyword ${i}`;
            keywords.push(keyword);
        }
        return keywords;
    }

    function saveUserInput(keywordIndex, userInput) {
        if (userInput) {
            const keyword = extractedKeywords[keywordIndex - 1];
            const newUserInput = { keyword: keyword, input: userInput };
            userInputs.push(newUserInput);
            importUserInputs([newUserInput]); // 새로운 입력만 전달
        }
    }

    function importUserInputs(data) {
        window.importAndAddKeywords(data);
    }
});
