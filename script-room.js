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
        window.location.href = `wordTest.html?id=${userId}`; // 사용자 ID를 URL에 포함하여 이동
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
            window.location.href = `grades.html?id=${currentUserId}`; // grades 페이지로 이동
        } else { // 사용자 ID가 설정되어 있지 않으면
            alert("User ID is not set. Please check and try again."); // '사용자 ID가 설정되어 있지 않습니다. 확인 후 다시 시도하세요.'라는 알림창을 표시
        }
    });
});

async function fetchChartBValueAndDrawHexagonChart() {
    try {
        const response = await fetch(`https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app/api/getResults`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: userId })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const dateScores = {};
        const overallQuizScores = [];

        data.forEach(result => {
            const timestamp = result.Timestamp.replace('T', ' ').replace('.000Z', '');
            const date = new Date(timestamp).toISOString().split('T')[0];
            if (!dateScores[date]) {
                dateScores[date] = { total: 0, correct: 0 };
            }
            dateScores[date].total++;
            if (result.Correctness === 1) {
                dateScores[date].correct++;
            }
        });

        Object.keys(dateScores).forEach(date => {
            const quiz1Results = data.filter(result => result.QuizNo === 1 && new Date(result.Timestamp).toISOString().split('T')[0] === date);
            const quiz2Results = data.filter(result => result.QuizNo === 2 && new Date(result.Timestamp).toISOString().split('T')[0] === date);
            const quiz3Results = data.filter(result => result.QuizNo === 3 && new Date(result.Timestamp).toISOString().split('T')[0] === date);

            const getScore = (quizResults) => {
                if (quizResults.length) {
                    const latestTestCount = Math.max(...quizResults.map(result => result.TestCount));
                    const latestQuizResults = quizResults.filter(result => result.TestCount === latestTestCount);
                    const correctAnswers = latestQuizResults.filter(result => result.Correctness === 1).length;
                    const totalAnswers = latestQuizResults.length;
                    if (totalAnswers > 0) {
                        return (correctAnswers / totalAnswers) * 100;
                    }
                }
                return 0;
            };

            const score1 = getScore(quiz1Results);
            const score2 = getScore(quiz2Results);
            const score3 = getScore(quiz3Results);

            const overallScore = (score1 + score2 + score3) / 3;
            overallQuizScores.push({ date, overallScore });
        });

        const dateLabels = overallQuizScores.map(item => item.date);
        const dateData = overallQuizScores.map(item => item.overallScore);

        const lastDateScore = dateData.length > 0 ? dateData[dateData.length - 1] : 0;

        // 각 꼭지점의 데이터 값 (기본값을 0으로 설정)
        const hexagonData = [0, 0, 0, 0, 0, lastDateScore];

        drawHexagonChart(hexagonData);
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error fetching data. Please check your network and try again.');
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
