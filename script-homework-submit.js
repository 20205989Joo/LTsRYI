const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');

const kstOffset = 9 * 60 * 60 * 1000;
const now = new Date(Date.now() + kstOffset);
const year = now.getFullYear();
const month = now.getMonth() + 1;
const day = now.getDate();

// ✅ 오늘 날짜 판별 함수 (KST 기준)
function isToday(timestampStr) {
  const kstTime = new Date(new Date(timestampStr).getTime() + kstOffset);
  return (
    kstTime.getFullYear() === year &&
    kstTime.getMonth() + 1 === month &&
    kstTime.getDate() === day
  );
}

// ✅ 오늘 숙제 제출 여부 확인
window.addEventListener('DOMContentLoaded', async () => {
  const checkbox = document.getElementById('hwDoneCheck'); // 현재는 제거 예정
  const statusBox = document.getElementById('submissionStatus'); // 새로 추가한 표시 박스

  try {
    const res = await fetch(`https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app/api/getHWImages?userId=${userId}`);
    const data = await res.json();

    console.log('📦 받아온 숙제 데이터:', data); // ✅ 로그 출력

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형태

    const hasToday = data.some(item => item.Timestamp?.startsWith(todayStr));
    console.log('📆 오늘 날짜:', todayStr);
    console.log('✅ 오늘 숙제 제출 여부:', hasToday);

    if (hasToday) {
      statusBox.textContent = "✅ 오늘 숙제 제출됨";
      statusBox.style.backgroundColor = "#a7e9af"; // 연초록
    } else {
      statusBox.textContent = "❌ 오늘 숙제 미제출";
      statusBox.style.backgroundColor = "#f9c0c0"; // 연빨강
    }
  } catch (err) {
    console.warn("❗ 오늘 숙제 확인 실패:", err);
  }
});


// ✅ 숙제 제출
async function submitHomework() {
  const fileInput = document.getElementById('hwImage');
  const comment = document.getElementById('hwComment').value;
  const file = fileInput.files[0];

  if (!file) {
    alert("숙제 파일을 업로드해주세요!");
    return;
  }

  const formData = new FormData();
  formData.append("UserId", userId);
  formData.append("QLevel", "7");
  formData.append("QYear", year.toString());
  formData.append("QMonth", month.toString());
  formData.append("QNo", "1");
  formData.append("WhichHW", "done");
  formData.append("Comment", comment); // ✅ 코멘트 전송
  formData.append("HWImage", file);

  try {
    const res = await fetch("https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app/api/saveHWImages", {
      method: "POST",
      body: formData
    });

    const result = await res.json();

    if (res.ok) {
      alert("제출 성공! 🎉\nURL: " + result.url);
    } else {
      console.error(result);
      alert("제출 실패: " + result.message);
    }
  } catch (err) {
    console.error("요청 중 에러:", err);
    alert("서버와 통신 중 오류가 발생했습니다.");
  }
}
