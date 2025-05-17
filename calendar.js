window.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('id');
  if (!userId) return;

  try {
    const res = await fetch(`https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app/api/getHWImages?userId=${userId}`);
    const data = await res.json();

    const submissionSet = new Set();
data.forEach(item => {
  const d = new Date(item.Timestamp);
  const kstDate = new Date(d.getTime() + 9 * 60 * 60 * 1000); // ★ KST 보정
  const key = `${kstDate.getFullYear()}-${(kstDate.getMonth() + 1)
    .toString().padStart(2, '0')}-${kstDate.getDate().toString().padStart(2, '0')}`;
  submissionSet.add(key);
});

    const today = new Date();
    const calendarTable = document.getElementById('calendarTable');
    calendarTable.innerHTML = "";

    const weekLabels = ['일', '월', '화', '수', '목', '금', '토'];
    const weekRow = document.createElement('tr');
    for (let i = 0; i < 7; i++) {
      const th = document.createElement('td');
      th.innerText = weekLabels[i];
      th.style.fontWeight = 'bold';
      weekRow.appendChild(th);
    }
    calendarTable.appendChild(weekRow);

    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay() - 14); // 2주 전 일요일부터

    for (let week = 0; week < 4; week++) {
      const row = document.createElement('tr');
      for (let day = 0; day < 7; day++) {
        const cellDate = new Date(start);
        cellDate.setDate(start.getDate() + week * 7 + day);

        const key = `${cellDate.getFullYear()}-${(cellDate.getMonth() + 1)
          .toString().padStart(2, '0')}-${cellDate.getDate().toString().padStart(2, '0')}`;

        const td = document.createElement('td');
        td.innerText = cellDate.getDate();

        if (submissionSet.has(key)) {
          td.classList.add('submitted');
          td.title = "숙제 제출됨";
        } else {
          td.classList.add('not-submitted');
          td.title = "미제출";
        }
        row.appendChild(td);
      }
      calendarTable.appendChild(row);
    }
  } catch (err) {
    console.error("캘린더 데이터 오류:", err);
  }
});
