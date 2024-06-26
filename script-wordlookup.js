document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('id');
    const grade = params.get('grade');
    const year = params.get('year');
    const month = params.get('month');
    const number = params.get('number');

    fetch('Paragraphes_mk1.json')
        .then(response => response.json())
        .then(data => {
            initializeDropdowns(data);
            initializeFields(); // 필드 초기화 함수 호출
            setDropdownValues(grade, year, month, number); // 드롭다운 값을 설정
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
        });
    }

    function setDropdownValues(grade, year, month, number) {
        if (grade) {
            document.getElementById('gradeDropdown').value = grade;
            document.getElementById('gradeDropdown').dispatchEvent(new Event('change'));
        }
        if (year) {
            document.getElementById('yearDropdown').value = year;
            document.getElementById('yearDropdown').dispatchEvent(new Event('change'));
        }
        if (month) {
            document.getElementById('monthDropdown').value = month;
            document.getElementById('monthDropdown').dispatchEvent(new Event('change'));
        }
        if (number) {
            document.getElementById('numberDropdown').value = number;
            document.getElementById('numberDropdown').dispatchEvent(new Event('change'));
        }
    }

    function initializeFields() {
        const paragraphField = document.getElementById('paragraphField');
        const choicesField = document.getElementById('choicesField');
        const nonqField = document.getElementById('nonqField');
        
        nonqField.innerHTML = `
            <p>Instruction</p>
        `;
        
        paragraphField.innerHTML = `
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
        const nonqField = document.getElementById('nonqField');
        
        nonqField.innerHTML = `
            <p class="question-number">${data.문제번호}. ${data.문제질문}</p>
        `;
        
        paragraphField.innerHTML = `
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

        // 각 필드에 대해 개별적으로 단어 래핑 및 클릭 이벤트 추가
        wrapWordsWithSpans(paragraphField);
        wrapWordsWithSpans(choicesField);

        addWordClickEvents(paragraphField);
        addWordClickEvents(choicesField);
    }

    function wrapWordsWithSpans(container) {
        const words = container.innerText.split(' ');
        container.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(' ');
    }

    function addWordClickEvents(container) {
        container.querySelectorAll('.word').forEach(wordElement => {
            wordElement.addEventListener('click', function() {
                const cleanWord = wordElement.innerText.replace(/[^\w\s]/gi, '');
                if (wordElement.classList.contains('selected')) {
                    wordElement.classList.remove('selected');
                    removeWordFromCustomList(cleanWord);
                } else {
                    wordElement.classList.add('selected');
                    addWordToCustomList(cleanWord);
                }
            });
        });
    }

    function addWordToCustomList(word) {
        const customWordList = document.getElementById('customWordList');
        const listItem = document.createElement('div');
        listItem.classList.add('word-list-item');
        listItem.dataset.word = word;
        listItem.innerHTML = `
            <p>${word.replace(/[^\w\s]/gi, '')}</p>
            <input type="text" placeholder="Enter meaning">
        `;
        customWordList.appendChild(listItem);
    }

    function removeWordFromCustomList(word) {
        const customWordList = document.getElementById('customWordList');
        const listItem = customWordList.querySelector(`.word-list-item[data-word="${word}"]`);
        if (listItem) {
            customWordList.removeChild(listItem);
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

    async function saveCustomWordsList() {
        const customWordList = document.getElementById('customWordList');
        const items = Array.from(customWordList.getElementsByClassName('word-list-item'));
    
        // 각 단어 항목을 개별적으로 서버에 전송
        for (const item of items) {
            const wordData = {
                UserId: userId,
                QLevel: grade,
                QYear: year,
                QMonth: month,
                QNo: number,
                CustomWord: item.dataset.word,
                CustomMeaning: item.querySelector('input').value
            };
    
            try {
                const response = await fetch('https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app/api/saveCustomWordsList', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(wordData)  // 단일 객체 전송
                });
    
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Failed to save custom word:', errorText);
                    alert('Failed to save custom word: ' + errorText);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while saving the custom word.');
            }
        }
    
        alert('All custom words saved successfully.');
    }

    window.saveCustomWordsList = saveCustomWordsList;

    function goToNextPage() {
        const nextPageUrl = `grammarTest3.html?id=${userId}&grade=${grade}&year=${year}&month=${month}&number=${number}`;
        location.href = nextPageUrl;
    }

    window.goToNextPage = goToNextPage;

    // Save button event listener
    const saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', saveCustomWordsList);
});
