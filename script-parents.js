const params = new URLSearchParams(window.location.search);
const userId = params.get('id');
const API_URL = 'https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app/api/getHWImages?userId=' + userId;

// 오늘 날짜 판별 함수
function isToday(timestampStr) {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000; // 분 → ms
  const todayKST = new Date(now.getTime() - tzOffset + 9 * 60 * 60 * 1000); // UTC → KST 기준 오늘

  const submitted = new Date(new Date(timestampStr).getTime() + 9 * 60 * 60 * 1000); // KST로 변환

  return (
    todayKST.getFullYear() === submitted.getFullYear() &&
    todayKST.getMonth() === submitted.getMonth() &&
    todayKST.getDate() === submitted.getDate()
  );
}

// YYYY-MM-DD 형식으로 변환
function formatDate(timestampStr) {
  const date = new Date(timestampStr);
  return (
    date.getFullYear() +
    '-' +
    String(date.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(date.getDate()).padStart(2, '0')
  );
}

fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    console.log('[📦 전체 데이터]', data);

    const container = document.getElementById('recentHomework');
    const todayStatus = document.getElementById('todayStatus');

    const todayHomework = data.filter(entry => isToday(entry.Timestamp));

    if (todayHomework.length > 0) {
      todayStatus.textContent = '✅ 오늘 숙제 제출됨';

      todayHomework.forEach(entry => {
  if (!entry.HWImageURL) {
    console.warn('⚠️ 이미지 URL이 없어서 건너뜀:', entry);
    return;
  }

  const titleText = entry.WhichHW ?? '제목 없음'; // null 또는 undefined일 경우 대체

  const card = document.createElement('div');
  card.className = 'image-card';
  card.innerHTML = `
    <div><b>${titleText}</b> (${formatDate(entry.Timestamp)})</div>
    <img src="${entry.HWImageURL}" alt="숙제 이미지" />
  `;
  container.appendChild(card);
});

    } else {
      todayStatus.textContent = '❌ 오늘 숙제 없음';
    }
  })
  .catch(err => {
    console.error('불러오기 실패:', err);
    document.getElementById('todayStatus').textContent = '데이터를 불러오지 못했습니다.';
  });

document.getElementById('goGrades').addEventListener('click', () => {
  window.location.href = `grades-calendar.html?id=${userId}`;
});
