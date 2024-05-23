document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const currentUserId = urlParams.get('id');  // URL에서 사용자 ID를 가져옵니다.
    const subjectName = urlParams.get('subject'); // URL에서 subjectName을 가져옵니다.

    if (!currentUserId) {
        alert('사용자 ID가 설정되지 않았습니다.');
        return;
    }

    document.getElementById('pageTitle').textContent = `Exam Results : ${subjectName}`; // 제목 업데이트

    async function fetchGrades(userId) {
        try {
            const response = await fetch(`https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app/api/getGrades?userId=${userId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching grades:', error);
            alert('Error fetching grades. Please check your network and try again.');
            return [];
        }
    }

    fetchGrades(currentUserId).then(grades => {
        if (!grades.length) {
            console.log('No grades available for this user.');
            alert('No grades found for this user.');
            return;
        }

        // 현지 시간대의 오늘 날짜 가져오기
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 필요
        const day = String(today.getDate()).padStart(2, '0'); // 일자를 두 자리로 표시
        const formattedToday = `${year}-${month}-${day}`;
        console.log('formattedToday:', formattedToday);

        // Chart A 생성
        const quizLabels = ['quiz 1', 'quiz 2', 'quiz 3'];
        const quizScores = quizLabels.map(label => {
            const quizNumber = parseInt(label.split(' ')[1]);
            const todayQuizGrades = grades.filter(grade => {
                if (!grade.WhichDay || !grade.TestScore) return false; // null 값 검사 추가
                const gradeDate = grade.WhichDay.split('T')[0];
                console.log(`Comparing ${gradeDate} with ${formattedToday} for ${label}`);
                return gradeDate === formattedToday && grade.SubcategoryName === 'Words' && grade.QuizNo === quizNumber;
            });

            console.log(`todayQuizGrades for ${label}:`, todayQuizGrades);

            if (todayQuizGrades.length === 0) return 0; // 오늘 해당 퀴즈 점수가 없다면 0을 반환

            // testcount가 가장 높은 요소를 찾아 testscore를 반환
            const highestTestCountGrade = todayQuizGrades.reduce((max, grade) => (max.TestCount > grade.TestCount ? max : grade), todayQuizGrades[0]);
            console.log(`highestTestCountGrade for ${label}:`, highestTestCountGrade);
            return parseFloat(highestTestCountGrade.TestScore || 0);
        });

        console.log('quizScores:', quizScores);

        const ctxA = document.getElementById('chartA').getContext('2d');
        new Chart(ctxA, {
            type: 'bar',
            data: {
                labels: quizLabels,
                datasets: [{
                    label: `Words - 최종 점수`,
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

        // Chart C 생성
        const idiomsGrades = grades.filter(grade => grade.SubcategoryName === 'Idioms');
        const idiomsQuizScores = quizLabels.map(label => {
            const quizNumber = parseInt(label.split(' ')[1]);
            const todayQuizGrades = idiomsGrades.filter(grade => {
                if (!grade.WhichDay || !grade.TestScore) return false; // null 값 검사 추가
                const gradeDate = grade.WhichDay.split('T')[0];
                console.log(`Comparing ${gradeDate} with ${formattedToday} for ${label}`);
                return gradeDate === formattedToday && grade.QuizNo === quizNumber;
            });

            console.log(`todayQuizGrades for ${label}:`, todayQuizGrades);

            if (todayQuizGrades.length === 0) return 0; // 오늘 해당 퀴즈 점수가 없다면 0을 반환

            // testcount가 가장 높은 요소를 찾아 testscore를 반환
            const highestTestCountGrade = todayQuizGrades.reduce((max, grade) => (max.TestCount > grade.TestCount ? max : grade), todayQuizGrades[0]);
            console.log(`highestTestCountGrade for ${label}:`, highestTestCountGrade);
            return parseFloat(highestTestCountGrade.TestScore || 0);
        });

        console.log('idiomsQuizScores:', idiomsQuizScores);

        const ctxC = document.getElementById('chartC').getContext('2d');
        new Chart(ctxC, {
            type: 'bar',
            data: {
                labels: quizLabels,
                datasets: [{
                    label: 'Idioms - 최종 점수',
                    data: idiomsQuizScores,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
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
        const allScores = []; // 모든 점수를 저장할 배열
        grades.forEach(grade => {
            if (!grade.WhichDay || !grade.TestScore) return; // null 값 검사 추가
            const date = grade.WhichDay.split('T')[0];
            allScores.push({ date: date, score: parseFloat(grade.TestScore), category: grade.SubcategoryName });
        });

        const scoresByDate = {}; // 날짜별 점수 집계
        allScores.forEach(item => {
            if (!scoresByDate[item.date]) {
                scoresByDate[item.date] = [];
            }
            scoresByDate[item.date].push(item.score);
        });

        const dateLabels = Object.keys(scoresByDate).sort(); // 날짜 순서대로 정렬
        const dateScores = dateLabels.map(date => {
            const scores = scoresByDate[date];
            const total = scores.reduce((a, b) => a + b, 0);
            return total / 6; // 각 날짜의 점수 합계를 6으로 나눔
        });

        const ctxB = document.getElementById('chartB').getContext('2d');
        new Chart(ctxB, {
            type: 'line',
            data: {
                labels: dateLabels,
                datasets: [{
                    label: 'Vocabulary - 오늘의 평균',
                    data: dateScores,
                    fill: false,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'category',
                        offset: true,
                        grid: {
                            offset: true
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
