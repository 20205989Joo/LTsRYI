let userId;

document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    userId = params.get('id');
    document.getElementById('roomTitle').textContent = userId ? `${userId}호 사용자 방` : "사용자 ID가 제공되지 않았습니다.";

    if (!userId) alert("사용자 ID가 URL에 포함되어야 합니다.");
});

function openSubcategory(subject) {
    const vocabularyOptions = document.getElementById('vocabularyOptions');
    const readingOptions = document.getElementById('readingOptions');
    const writingOptions = document.getElementById('writingOptions');
    const intuitionOptions = document.getElementById('intuitionOptions');

    vocabularyOptions.style.display = 'none';
    readingOptions.style.display = 'none';
    writingOptions.style.display = 'none';
    intuitionOptions.style.display = 'none';

    if (subject === '어휘') {
        document.getElementById('vocabularyTitle').textContent = `${subject}`;
        vocabularyOptions.style.display = 'block'; // '단어'와 '숙어' 버튼 표시
    } else if (subject === '독해') {
        document.getElementById('readingTitle').textContent = `${subject}`;
        readingOptions.style.display = 'block'; // '분해'와 '조립', 'grades' 버튼 표시
    } else if (subject === '쓰기') {
        document.getElementById('writingTitle').textContent = `${subject}`;
        writingOptions.style.display = 'block'; // '쓰기' 관련 버튼 표시
    } else if (subject === '직관') {
        document.getElementById('intuitionTitle').textContent = `${subject}`;
        intuitionOptions.style.display = 'block'; // '직관' 관련 버튼 표시
    } else {
        alert(`${subject} 페이지는 아직 준비중입니다.`);
    }
}

function openVocabulary(vocabulary) {
    if (!userId) {
        alert("사용자 ID가 필요합니다.");
        return;
    }
    if (vocabulary === '단어') {
        window.location.href = `wordTest1.html?id=${userId}`; // 사용자 ID를 URL에 포함하여 이동
    } else if (vocabulary === '숙어') {
        window.location.href = `idiomTest1.html?id=${userId}`; // 사용자 ID를 URL에 포함하여 idiomTest.html로 이동
    } else {
        openGrades('Vocabulary');
    }
}

function openReading(reading) {
    if (!userId) {
        alert("사용자 ID가 필요합니다.");
        return;
    }
    if (reading === '분해') {
        window.location.href = `analysisTest1.html?id=${userId}`; // 사용자 ID를 URL에 포함하여 이동
    } else if (reading === '조립') {
        window.location.href = `synthesisTest1.html?id=${userId}`; // 사용자 ID를 URL에 포함하여 이동
    } else {
        openGrades('RC');
    }
}

function openWriting(writing) {
    if (!userId) {
        alert("사용자 ID가 필요합니다.");
        return;
    }
    if (writing === '기초문법') {
        window.location.href = `grammarTest1.html?id=${userId}`; // 사용자 ID를 URL에 포함하여 이동
    } else if (writing === '작문') {
        window.location.href = `compositionTest1.html?id=${userId}`; // 사용자 ID를 URL에 포함하여 이동
    } else {
        openGrades('Writing');
    }
}

function openIntuition(intuition) {
    if (!userId) {
        alert("사용자 ID가 필요합니다.");
        return;
    }
    if (intuition === '기억') {
        window.location.href = `memorizeTest1.html?id=${userId}`; // 사용자 ID를 URL에 포함하여 이동
    } else if (intuition === '이미지화') {
        window.location.href = `imagifyTest1.html?id=${userId}`; // 사용자 ID를 URL에 포함하여 이동
    } else {
        openGrades('Intuition');
    }
}

function openGrades(subject) {
    if (!userId) {
        alert("사용자 ID가 필요합니다.");
        return;
    }
    window.location.href = `grades.html?id=${userId}&subject=${subject}`; // 사용자 ID와 과목 이름을 URL에 포함하여 이동
}

document.addEventListener('DOMContentLoaded', function() {
    fetchChartDataAndDrawHexagonChart();
});

async function fetchChartDataAndDrawHexagonChart() {
    try {
        const grades = await fetchGrades(userId);
        const hexagonData = processGrades(grades);
        drawHexagonChart(hexagonData);
    } catch (error) {
        console.error('Error fetching data:', error);
        console.log('Error fetching data. Please check your network and try again.');
        drawHexagonChart([0, 0, 0, 0, 0, 0]); // 에러 발생 시 기본 차트 그리기
    }

    // 작은 육각형을 가장 위에 그리기 위해 호출
    const svg = d3.select('svg');
    drawSmallHexagons(svg);
}

async function fetchGrades(userId) {
    const response = await fetch(`https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app/api/getGrades?userId=${userId}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const grades = await response.json();
    return grades;
}

function processGrades(grades) {
    if (!grades || grades.length === 0) {
        console.log('No data written under current userid');
        return [0, 0, 0, 0, 0, 0];
    }

    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const todayGrades = grades.filter(grade => grade.WhichDay && grade.WhichDay.split('T')[0] === formattedToday);

    if (!todayGrades || todayGrades.length === 0) {
        console.log('No grades found for today.');
        return [0, 0, 0, 0, 0, 0]; // 오늘 날짜에 해당하는 성적이 없으면 기본 차트 그리기
    }

    const quizLabels = ['quiz 1', 'quiz 2', 'quiz 3'];
    const categories = ['Words', 'Idioms'];

    // 카테고리별로 퀴즈 점수 계산
    const scoresByCategory = categories.map(category => {
        const categoryGrades = todayGrades.filter(grade => grade.SubcategoryName === category);
        return quizLabels.map(label => {
            const quizNumber = parseInt(label.split(' ')[1]);
            const quizGrades = categoryGrades.filter(grade => grade.QuizNo === quizNumber);

            if (quizGrades.length === 0) return 0; // 퀴즈 데이터가 없으면 0점으로 처리

            const highestTestCountGrade = quizGrades.reduce((max, grade) => (max.TestCount > grade.TestCount ? max : grade), quizGrades[0]);
            return parseFloat(highestTestCountGrade.TestScore || 0); // 최고 점수 반영, null은 0으로 치환
        }).reduce((a, b) => a + b, 0); // 각 카테고리의 퀴즈 점수 합
    });

    // 카테고리별 점수 합계의 총합을 6으로 나눔
    const totalScore = scoresByCategory.reduce((a, b) => a + b, 0);
    const averageScore = totalScore / 6; // 고정된 숫자 6으로 나누기

    return [0, 0, 0, 0, 0, averageScore];
}

function drawHexagonChart(data) {
    const svg = d3.select('svg').attr('viewBox', '0 0 800 720');

    const points = [
        { x: 685, y: 360 },
        { x: 543, y: 607 },
        { x: 257, y: 607 },
        { x: 115, y: 360 },
        { x: 257, y: 113 },
        { x: 543, y: 113 }
    ];

    const center = { x: 400, y: 360 };

    // 10점 단위마다 작고 얇은 육각형 그리기
    for (let j = 1; j <= 10; j++) {
        svg.append('polygon')
            .attr('points', points.map(p => `${center.x + (p.x - center.x) * j / 10}, ${center.y + (p.y - center.y) * j / 10}`).join(' '))
            .attr('fill', 'none')
            .attr('stroke', 'lightgrey')
            .attr('stroke-width', 0.5);

        // 눈금 값 표시
        points.forEach(p => {
            svg.append('text')
                .attr('x', center.x + (p.x - center.x) * j / 10)
                .attr('y', center.y + (p.y - center.y) * j / 10 - 5)
                .attr('fill', 'grey')
                .attr('font-size', '10px')
                .attr('text-anchor', 'middle')
                .text(j * 10);
        });
    }

    // 중앙에서 각 꼭지점까지의 구분선
    points.forEach(p => {
        svg.append('line')
            .attr('x1', center.x)
            .attr('y1', center.y)
            .attr('x2', p.x)
            .attr('y2', p.y)
            .attr('stroke', 'grey')
            .attr('stroke-width', 1);
    });

    // 데이터 기반 육각형 채우기
    const dataPoints = data.map((value, i) => {
        const displayValue = value === 0 ? 5 : value; // 0 값은 5로 대체하여 그리기
        return {
            x: center.x + (points[i].x - center.x) * displayValue / 100,
            y: center.y + (points[i].y - center.y) * displayValue / 100
        };
    });

    const lineGenerator = d3.line()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveLinearClosed);

    svg.append('path')
        .attr('d', lineGenerator(dataPoints))
        .attr('fill', 'rgba(218, 181, 37, 0.15)')
        .attr('stroke', 'rgba(164, 91, 30, 0.5)')
        .attr('stroke-width', 2);

    // 데이터 값을 꼭지점 근처에 표시
    dataPoints.forEach((p, i) => {
        svg.append('text')
            .attr('x', p.x)
            .attr('y', p.y - 10)
            .attr('fill', 'black')
            .attr('font-size', '16px')
            .attr('text-anchor', 'middle')
            .text(data[i] === 5 ? 0 : data[i]); // 실제 값을 표시 (0은 5로 대체되어 그려졌으므로 다시 0으로 표시)
    });
}

document.addEventListener('click', function(event) {
    // 모든 subcategory 창을 선택
    const subcategoryOptions = document.querySelectorAll('.subcategoryOptions');

    // 클릭된 요소가 subcategory 창 내부의 요소가 아니고 subcategory 창이 열려 있을 때만 창을 닫음
    if (!event.target.closest('.subcategoryOptions') && !event.target.matches('button')) {
        subcategoryOptions.forEach(function(div) {
            div.style.display = 'none'; // 창을 닫음
        });
    }
});

function drawSmallHexagons(svg) {
    const center = { x: 400, y: 360 }; // 대형 육각형의 중심점
    const size = 50; // 작은 육각형의 반경
    const angles = [0, 60, 120, 180, 240, 300].map(deg => (deg * Math.PI) / 180); // 각도를 라디안으로 변환

    // 각도에 따라 육각형의 꼭짓점 계산
    const points = angles.map(angle => ({
        x: center.x + size * Math.cos(angle),
        y: center.y + size * Math.sin(angle)
    }));

    // 포인트를 문자열로 변환
    const pointsAttr = points.map(p => `${p.x},${p.y}`).join(' ');

    // SVG에 육각형 추가
    svg.append('polygon')
        .attr('points', pointsAttr)
        .attr('fill', 'rgba(137,109,173,0.5)')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('cursor', 'pointer')
        .on('click', function() {
            window.location.href = `imagifyTest3.html?id=${userId}`; // 클릭 시 이동할 페이지 URL
        }) 
        .on('mouseover', function() {
            d3.select(this).attr('fill', 'rgba(45,149,175,0.6)'); // 호버 시 색상 변경
        })
        .on('mouseout', function() {
            d3.select(this).attr('fill', 'rgba(137,109,173,0.5)'); // 호버 아웃 시 원래 색상 복구
        });
    // 텍스트 추가
    svg.append('text')
        .attr('x', center.x)
        .attr('y', center.y + 5) // 중심에서 약간 아래로 조정
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-size', '24px')
        .text('L-try!');
}

document.addEventListener('DOMContentLoaded', function() {
    const svg = d3.select('svg');
    fetchChartDataAndDrawHexagonChart();
});
