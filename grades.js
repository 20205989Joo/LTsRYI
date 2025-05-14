window.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('id');
  if (!userId) return;

  try {
    const res = await fetch(`https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app/api/getHWImages?userId=${userId}`);
    const data = await res.json();

    // 날짜별로 누적 count
    const dateMap = {};

    data.forEach(item => {
      const date = new Date(item.Timestamp);
      const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

      if (!dateMap[dateStr]) dateMap[dateStr] = 0;
      dateMap[dateStr]++;
    });

    const labels = Object.keys(dateMap).sort();
    const counts = labels.map(date => dateMap[date]);

    const ctx = document.getElementById('submissionChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: '숙제 제출 횟수',
          data: counts,
          backgroundColor: 'rgba(123, 200, 164, 0.7)',
          borderRadius: 4,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: '날짜별 숙제 제출 수'
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
