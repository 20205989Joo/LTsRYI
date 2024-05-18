document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const currentUserId = urlParams.get('id');  // URL에서 사용자 ID를 가져옵니다.

    if (!currentUserId) {
        alert('사용자 ID가 설정되지 않았습니다.');
        return;
    }

    async function fetchData(userId) {
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
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Error fetching data. Please check your network and try again.');
            return [];
        }
    }

    fetchData(currentUserId).then(data => {
        if (!data.length) {
            console.log('No data available for this user.');
            alert('No results found for this user.');
            return;
        }

        const quizLabels = ['quiz 1', 'quiz 2', 'quiz 3'];
        const quizScores = [0, 0, 0];

        // 오늘 날짜 가져오기, 시간대를 'Asia/Seoul'로 명시
        const options = { timeZone: 'Asia/Seoul', hour12: false };
        const today = new Date().toLocaleDateString('en-CA', options);

        const todayResults = data.filter(result => {
            const timestamp = result.Timestamp.replace('T', ' ').replace('.000Z', '');
            const resultDate = new Date(timestamp).toLocaleDateString('en-CA', options);
            return resultDate === today;
        });

        // Quiz 1
        const quiz1Results = todayResults.filter(result => result.QuizNo === 1);
        if (quiz1Results.length) {
            const latestTestCount1 = Math.max(...quiz1Results.map(result => result.TestCount));
            const latestQuiz1Results = quiz1Results.filter(result => result.TestCount === latestTestCount1);
            const correctAnswers1 = latestQuiz1Results.filter(result => result.Correctness === 1).length;
            const totalAnswers1 = latestQuiz1Results.length;
            if (totalAnswers1 > 0) {
                const scorePercentage1 = (correctAnswers1 / totalAnswers1) * 100;
                quizScores[0] = scorePercentage1;
            }
        }

        // Quiz 2
        const quiz2Results = todayResults.filter(result => result.QuizNo === 2);
        if (quiz2Results.length) {
            const latestTestCount2 = Math.max(...quiz2Results.map(result => result.TestCount));
            const latestQuiz2Results = quiz2Results.filter(result => result.TestCount === latestTestCount2);
            const correctAnswers2 = latestQuiz2Results.filter(result => result.Correctness === 1).length;
            const totalAnswers2 = latestQuiz2Results.length;
            if (totalAnswers2 > 0) {
                const scorePercentage2 = (correctAnswers2 / totalAnswers2) * 100;
                quizScores[1] = scorePercentage2;
            }
        }

        // Quiz 3
        const quiz3Results = todayResults.filter(result => result.QuizNo === 3);
        if (quiz3Results.length) {
            const latestTestCount3 = Math.max(...quiz3Results.map(result => result.TestCount));
            const latestQuiz3Results = quiz3Results.filter(result => result.TestCount === latestTestCount3);
            const correctAnswers3 = latestQuiz3Results.filter(result => result.Correctness === 1).length;
            const totalAnswers3 = latestQuiz3Results.length;
            if (totalAnswers3 > 0) {
                const scorePercentage3 = (correctAnswers3 / totalAnswers3) * 100;
                quizScores[2] = scorePercentage3;
            }
        }

        const ctxA = document.getElementById('chartA').getContext('2d');
        new Chart(ctxA, {
            type: 'bar',
            data: {
                labels: quizLabels,
                datasets: [{
                    label: 'Quiz Scores',
                    data: quizScores,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(0,0,0,0.5)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 10
                        }
                    }
                }
            }
        });

        // Chart B 설정 및 데이터 처리
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

        // 날짜별로 전체 퀴즈 점수의 평균을 계산
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

        const ctxB = document.getElementById('chartB').getContext('2d');
        new Chart(ctxB, {
            type: 'line',
            data: {
                labels: dateLabels,
                datasets: [{
                    label: 'Overall Accuracy Over Time',
                    data: dateData,
                    fill: false,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'category',
                        offset: true, // 이 옵션을 추가하여 x축의 시작 지점을 떨어뜨립니다.
                        grid: {
                            offset: true // x축의 그리드도 동일하게 조정합니다.
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 10
                        }
                    }
                }
            }
        });
    });
});
