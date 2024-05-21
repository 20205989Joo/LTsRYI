let userId;

document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    userId = params.get('id');
    document.getElementById('roomTitle').textContent = userId ? `${userId}호 사용자 방` : "사용자 ID가 제공되지 않았습니다.";

    if (!userId) alert("사용자 ID가 URL에 포함되어야 합니다.");
});

function openSubject(subject) {
    const vocabularyOptions = document.getElementById('vocabularyOptions');
    if (subject === '어휘') {
        vocabularyOptions.style.display = 'block'; // '단어'와 '숙어' 버튼 표시
    } else {
        vocabularyOptions.style.display = 'none'; // 그 외 선택시 숨김
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
        alert(`${vocabulary} 페이지로 이동합니다.`);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    fetchChartBValueAndDrawHexagonChart();
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('Grades').addEventListener('click', function() {
        const currentUserId = localStorage.getItem('currentUserId'); // 로컬 저장소에서 현재 사용자 ID를 가져옴
        if (currentUserId) { // 사용자 ID가 설정되어 있으면
            window.location.href = `grades-Vocabulary.html?id=${currentUserId}`; // grades 페이지로 이동
        } else { // 사용자 ID가 설정되어 있지 않으면
            alert("User ID is not set. Please check and try again."); // '사용자 ID가 설정되어 있지 않습니다. 확인 후 다시 시도하세요.'라는 알림창을 표시
        }
    });
});

async function fetchChartBValueAndDrawHexagonChart() {
    try {
        const response = await fetch(`https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app/api/getGrades?userId=${userId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const grades = await response.json();

        const today = new Date();
        const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const todayGrades = grades.filter(grade => grade.WhichDay && grade.WhichDay.split('T')[0] === formattedToday);

        if (!todayGrades || todayGrades.length === 0) {
            console.log('No grades found for today.');
            drawHexagonChart([0, 0, 0, 0, 0, 0]); // 오늘 날짜에 해당하는 성적이 없으면 기본 차트 그리기
            return;
        }

        const quizLabels = ['quiz 1', 'quiz 2', 'quiz 3'];
        const categories = ['Words', 'Idioms'];

        // 카테고리별로 퀴즈 점수 계산
        const scoresByCategory = categories.map(category => {
            const categoryGrades = todayGrades.filter(grade => grade.SubcategoryName === category);
            return quizLabels.map(label => {
                const quizNumber = parseInt(label.split(' ')[1]);
                const quizGrades = categoryGrades.filter(grade => grade.QuizNo === quizNumber && grade.TestScore);

                if (quizGrades.length === 0) return 0; // 퀴즈 데이터가 없으면 0점으로 처리

                const highestTestCountGrade = quizGrades.reduce((max, grade) => (max.TestCount > grade.TestCount ? max : grade), quizGrades[0]);
                return parseFloat(highestTestCountGrade.TestScore || 0); // 최고 점수 반영
            }).reduce((a, b) => a + b, 0); // 각 카테고리의 퀴즈 점수 합
        });

        // 카테고리별 점수 합계의 총합을 6으로 나눔
        const totalScore = scoresByCategory.reduce((a, b) => a + b, 0);
        const averageScore = totalScore / 6; // 고정된 숫자 6으로 나누기

        const hexagonData = [0, 0, 0, 0, 0, averageScore];

        drawHexagonChart(hexagonData);
    } catch (error) {
        console.error('Error fetching data:', error);
        console.log('Error fetching data. Please check your network and try again.');
        drawHexagonChart([0, 0, 0, 0, 0, 0]); // 에러 발생 시 기본 차트 그리기
    }
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
