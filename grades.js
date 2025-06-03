// grades.js
window.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('id');
  if (!userId) return;

  try {
    const res = await fetch(`https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app/api/getHWPlus?userId=${userId}`);
    const data = await res.json();

    const dateMap = {};
    let todayQGrade = 0;
    const todayItems = [];

    // ✅ 오늘 날짜 (KST 기준)
    const now = new Date();
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstNow = new Date(now.getTime() + kstOffset);
    const todayStr = kstNow.toISOString().slice(0, 10);
    console.log(`📌 오늘 (KST 기준): ${todayStr}`);

    data.forEach(item => {
      const date = new Date(item.Timestamp);
      const dateStr = new Date(date.getTime() + kstOffset).toISOString().slice(0, 10);
      const score = Number(item.Score);

      console.log(`📅 숙제 Timestamp: ${item.Timestamp} → ${dateStr} / ${item.Subcategory} / ${score}점`);

      if (!isNaN(score)) {
        if (!dateMap[dateStr]) dateMap[dateStr] = 0;
        dateMap[dateStr] += score;

        if (dateStr === todayStr) {
          todayQGrade += score;
          todayItems.push(item);
        }
      }
    });

    // ✅ 누적 계산
    const sortedDates = Object.keys(dateMap).sort();
    const dailyGrades = [];
    const cumulativeGrades = [];
    let cumulativeTotal = 0;

    sortedDates.forEach(date => {
      const value = dateMap[date];
      dailyGrades.push(value);
      cumulativeTotal += value;
      cumulativeGrades.push(cumulativeTotal);
    });

    // ✅ 오늘 점수 표시 + 숙제 요약 표시
// ✅ 오늘 점수 표시 + 숙제 요약 표시
const todayEl = document.getElementById('todayPoint');
const todayWrapper = todayEl?.parentElement;

if (todayEl) {
  todayEl.textContent = `${todayQGrade}`;

  // ✅ 숙제별 간단 요약 (점수 있는 항목만)
const details = todayItems
  .filter(item => (
    item.Subcategory &&
    item.Score !== null &&
    item.Score !== '' &&
    !isNaN(Number(item.Score)) &&
    Number(item.Score) > 0
  ))
  .map(item => `${item.Subcategory}: ${Number(item.Score)}점`);


  // ✅ summary element 추가 또는 갱신
  let detailEl = document.getElementById('todayPointDetails');
  if (!detailEl) {
    detailEl = document.createElement('div');
    detailEl.id = 'todayPointDetails';

    // ✅ 위치와 스타일 조정
    detailEl.style.position = 'absolute';
    detailEl.style.top = '-150px';
    detailEl.style.left = '20px';
    detailEl.style.fontSize = '11px';
    detailEl.style.color = '#fffde0';
    detailEl.style.lineHeight = '1.2';
    detailEl.style.whiteSpace = 'pre-line';
    detailEl.style.maxWidth = '130px';
    detailEl.style.pointerEvents = 'none';
    detailEl.style.opacity = '0.85';
    detailEl.style.zIndex = '6';

    todayWrapper?.appendChild(detailEl);
  }

  detailEl.textContent = details.join('\n');
}


    // ✅ 그래프 그리기
    const ctx = document.getElementById('submissionChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sortedDates,
        datasets: [
          {
            type: 'bar',
            label: '일일 점수',
            data: dailyGrades,
            backgroundColor: '#FFDBAC',
            borderColor: '#D28C45',
            borderWidth: 1,
            borderRadius: 6
          },
          {
            type: 'line',
            label: '누적 점수',
            data: cumulativeGrades,
            borderColor: '#FFF2C9',
            backgroundColor: 'transparent',
            tension: 0.3,
            fill: false,
            pointRadius: 3,
            pointHoverRadius: 5
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: false },
          legend: { display: false }
        },
        scales: {
          x: {
            ticks: {
              color: '#FFF9E2',
              font: { weight: 'bold' }
            },
            grid: { color: 'rgba(255,255,255,0.1)' }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#FFF9E2',
              stepSize: 1,
              font: { weight: 'bold' }
            },
            grid: { color: 'rgba(255,255,255,0.15)' }
          }
        }
      }
    });

  } catch (err) {
    console.error("데이터 불러오기 실패:", err);
  }
});
