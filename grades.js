window.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('id');
  if (!userId) return;

  try {
    const res = await fetch(`https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app/api/getHWImages?userId=${userId}`);
    const data = await res.json();

    const dateMap = {};
    const cumulativeMap = {};
    let cumulativeTotal = 0;
    let todayQGrade = 0;

    const todayStr = new Date().toISOString().slice(0, 10);

    data.forEach(item => {
      const date = new Date(item.Timestamp);
      const dateStr = date.toISOString().slice(0, 10); // 'YYYY-MM-DD'

      const qgrade = Number(item.QGrade);
      if (!isNaN(qgrade)) {
        if (!dateMap[dateStr]) dateMap[dateStr] = 0;
        dateMap[dateStr] += qgrade;

        if (dateStr === todayStr) todayQGrade += qgrade;
      }
    });

    // 누적 계산
    const sortedDates = Object.keys(dateMap).sort();
    const dailyGrades = [];
    const cumulativeGrades = [];

    sortedDates.forEach(date => {
      const value = dateMap[date];
      dailyGrades.push(value);
      cumulativeTotal += value;
      cumulativeGrades.push(cumulativeTotal);
    });

    // 오늘 점수 표시
    const todayEl = document.getElementById('todayPoint');
    if (todayEl) todayEl.textContent = `${todayQGrade}`;

    // 그래프 그리기
    const ctx = document.getElementById('submissionChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sortedDates,
        datasets: [
          {
            type: 'bar',
            label: '오늘의 점수',
            data: dailyGrades,
            backgroundColor: 'rgba(123, 200, 164, 0.7)',
            borderRadius: 4,
          },
          {
            type: 'line',
            label: '누적 점수',
            data: cumulativeGrades,
            borderColor: 'rgba(72, 100, 255, 0.8)',
            backgroundColor: 'rgba(72, 100, 255, 0.2)',
            tension: 0.3,
            fill: false,
            pointRadius: 3,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: '날짜별 점수 및 누적 성장 그래프'
          },
          legend: {
            display: true
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });

  } catch (err) {
    console.error("데이터 불러오기 실패:", err);
  }
});
