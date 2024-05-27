document.addEventListener('DOMContentLoaded', function() {
    fetch('Paragraphes_mk1.json')
        .then(response => response.json())
        .then(data => {
            initializeDropdowns(data);
        })
        .catch(error => console.error('Failed to load data:', error));

    let currentIdiomIndex = 0;
    let idioms = [];

    document.getElementById('switchButton').addEventListener('click', function() {
        const field1 = document.getElementById('field1');
        const field2 = document.getElementById('field2');
        if (field1.style.display === 'none') {
            field1.style.display = 'block';
            field2.style.display = 'none';
        } else {
            field1.style.display = 'none';
            field2.style.display = 'block';
        }
    });

    document.getElementById('prevButton').addEventListener('click', function() {
        if (currentIdiomIndex > 0) {
            currentIdiomIndex--;
            displayCurrentIdiom();
        }
    });

    document.getElementById('nextButton').addEventListener('click', function() {
        if (currentIdiomIndex < idioms.length - 1) {
            currentIdiomIndex++;
            displayCurrentIdiom();
        }
    });

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
            loadIdioms(selectedGrade, selectedYear, selectedMonth, selectedNumber);
        });
    }

    function displayContent(data) {
        const paragraphField = document.getElementById('paragraphField');
        const choicesField = document.getElementById('choicesField');
        const nonqField = document.getElementById('nonqField');
        const sentenceContainer = document.getElementById('sentenceContainer');

        nonqField.innerHTML = `
            <p class="question-number">${data.문제번호}. ${data.문제질문}</p>
        `;
        
        paragraphField.innerHTML = `
            <p>${data.제시문WithBold}</p>
        `;
        
        const choicesHtml = `
            <p>&#9312; ${data['선택지 1'] || ''}</p>
            <p>&#9313; ${data['선택지 2'] || ''}</p>
            <p>&#9314; ${data['선택지 3'] || ''}</p>
            <p>&#9315; ${data['선택지 4'] || ''}</p>
            <p>&#9316; ${data['선택지 5'] || ''}</p>
        `;
        choicesField.innerHTML = choicesHtml;

        // 문장별로 나누어 표시하고 입력 필드 추가
        const sentences = data.제시문WithBold.split('. ');
        sentenceContainer.innerHTML = sentences.map((sentence, index) => `
            <div class="sentence-block">
                <p>${sentence}.</p>
                <input type="text" placeholder="Enter your input">
            </div>
        `).join('');

        // 우측 패널의 문장에 띄어쓰기 클릭 이벤트 추가
        addSpaceClickEvent(sentenceContainer);

        // 좌측 패널의 <strong> 태그 클릭 이벤트 추가
        highlightStrongTags(paragraphField);
        // 우측 패널의 <strong> 태그 클릭 이벤트 추가
        highlightStrongTags(sentenceContainer);
    }

    function loadIdioms(selectedGrade, selectedYear, selectedMonth, selectedNumber) {
        fetch('Paragraphes_idiom_mk1.json')
            .then(response => response.json())
            .then(idiomData => {
                idioms = idiomData.filter(item => 
                    item.학년 === selectedGrade && 
                    item.연도 === selectedYear && 
                    item.월 === selectedMonth && 
                    item.문제번호 === selectedNumber
                );
                currentIdiomIndex = 0;
                displayCurrentIdiom();
            })
            .catch(error => console.error('Failed to load idiom data:', error));
    }

    function displayCurrentIdiom() {
        if (idioms.length > 0) {
            const idiom = idioms[currentIdiomIndex];
            document.getElementById('explanationTitle').textContent = `#${idiom.Idiom}`;
            document.getElementById('idiomContent').textContent = idiom.Translation;
        } else {
            document.getElementById('explanationTitle').textContent = 'No idioms found';
            document.getElementById('idiomContent').textContent = '';
        }
    }

    function highlightStrongTags(container) {
        const strongElements = container.querySelectorAll('strong');
        strongElements.forEach(strong => {
            strong.classList.add('strong-word');
        });
    }

    function addSpaceClickEvent(container) {
        container.querySelectorAll('.sentence-block p').forEach(paragraph => {
            const fragment = document.createDocumentFragment();
            paragraph.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const words = node.textContent.split(' ');
                    words.forEach((word, index) => {
                        if (index > 0) {
                            const space = document.createElement('span');
                            space.className = 'space';
                            space.textContent = ' ';
                            
                            const tooltip = document.createElement('span');
                            tooltip.className = 'tooltip';
                            tooltip.innerText = 'add slash?';
                            space.appendChild(tooltip);
                            
                            space.addEventListener('mouseover', function() {
                                space.style.cursor = 'pointer';
                                tooltip.style.display = 'block';
                                tooltip.style.top = `-${tooltip.offsetHeight + 5}px`;
                                tooltip.style.left = '50%';
                                tooltip.style.transform = 'translateX(-50%)';
                            });
                            
                            space.addEventListener('mouseout', function() {
                                tooltip.style.display = 'none';
                            });

                            space.addEventListener('click', function() {
                                if (space.classList.contains('bold-space')) {
                                    space.classList.remove('bold-space');
                                    space.innerText = ' ';
                                    space.appendChild(tooltip);
                                } else {
                                    space.classList.add('bold-space');
                                    space.innerText = ' / ';
                                    space.appendChild(tooltip);
                                }
                            });
                            fragment.appendChild(space);
                        }
                        const textNode = document.createTextNode(word);
                        fragment.appendChild(textNode);
                    });
                } else {
                    fragment.appendChild(node.cloneNode(true));
                }
            });
            paragraph.innerHTML = '';
            paragraph.appendChild(fragment);
        });
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

    function goToNextPage() {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get('id');
        const grade = params.get('grade');
        const year = params.get('year');
        const month = params.get('month');
        const number = params.get('number');

        const nextPageUrl = `wordTest3.html?id=${userId}&grade=${grade}&year=${year}&month=${month}&number=${number}`;
        location.href = nextPageUrl;
    }

    window.goToNextPage = goToNextPage;
});
