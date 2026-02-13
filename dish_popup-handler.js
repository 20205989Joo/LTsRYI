// ✅ 팝업 핸들러 - dish_popup-handler.js

function buildFilename(item) {
  const subjectMap = {
    '단어': 'Vocabulary',
    '문법': 'Grammar',
    '구문': 'Syntax',
    '독해': 'Reading'
  };

  const subcategoryMap = {
    '단어': 'Words',
    '연어': 'Collocations',
    '문법': 'Grammar',
    '단계별 독해': 'Pattern',
    '파편의 재구성': 'Fragments'
  };

  const RANGES = {
    '단어': {
      'A1': [1, 45],
      'A2': [46, 89],
      'B1': [90, 130],
      'B2': [131, 201],
      'C1': [202, 266]
    },
    '연어': {
      '900핵심연어': [1, 42]
    },
    '문법': {
      'Basic': [1, 50]
    },
    '단계별 독해': {
      'RCStepper': [1, 50]
    }
  };

  if (!item.label && item.Subcategory) {
    const reverseLabelMap = {
      '단어': '단어',
      '연어': '단어',
      '기초문법': '문법',
      '단계별 독해': '구문',
      '파편의 재구성': '독해'
    };
    item.label = reverseLabelMap[item.Subcategory] || item.Subcategory;
  }

  const subject = subjectMap[item.label] || item.label;
  const sub = subcategoryMap[item.Subcategory] || item.Subcategory;
  const level = item.Level;
  const lessonNo = item.LessonNo;

  const [start] = RANGES[item.Subcategory]?.[item.Level] || [1];
  const day = lessonNo - start + 1;

  return `${subject}_${sub}_${level}_Day${day}_Lesson${lessonNo}_v1.pdf`;
}

window.showDishPopup = function (item) {
  const cafeInt = document.getElementById('cafe_int');
  if (!cafeInt) {
    console.warn('❌ cafe_int가 없습니다.');
    return;
  }

  // ✅ 현재 URL에서 사용자 id 가져오기
  const userId = new URLSearchParams(window.location.search).get('id');

  // ✅ label 보정
  if (!item.label && item.Subcategory) {
    const reverseLabelMap = {
      '단어': '단어',
      '연어': '단어',
      '기초문법': '문법',
      '단계별 독해': '구문',
      '파편의 재구성': '독해'
    };
    item.label = reverseLabelMap[item.Subcategory] || item.Subcategory;
  }

  const old = document.getElementById('popup-container');
  if (old) old.remove();

  const popupContainer = document.createElement('div');
  popupContainer.id = 'popup-container';
  popupContainer.style = `
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 999;
    pointer-events: none;
  `;

  const popup = document.createElement('div');
  popup.style = `
    position: absolute;
    top: 160px;
    left: 50%;
    transform: translateX(-50%);
    width: 280px;
    min-height: 140px;
    background: #fffaf2;
    border: 2px solid #7e3106;
    border-radius: 14px;
    padding: 16px;
    font-size: 14px;
    color: #333;
    box-shadow: 0 4px 10px rgba(0,0,0,0.25);
    z-index: 1001;
    text-align: center;
    pointer-events: auto;
  `;

  const hw = item.Subcategory;
  const key = `downloaded_HW_${hw}_${item.Level}_${item.LessonNo}`;
  const downloaded = localStorage.getItem(key) === 'true';

  let content = `<div style="font-weight:bold; font-size: 15px; margin-bottom: 10px;">📥 ${hw}</div>`;

  const filename = buildFilename(item);
  const baseFile = filename.replace(/\.pdf$/, '');
  const folder = {
    '단어': 'words',
    '연어': 'words',
    '문법': 'grammar',
    '단계별 독해': 'syntax',
    '파편의 재구성': 'fragments'
  }[hw] || 'misc';
  const fileURL =
    `https://yslwgaephsnbfoiqnpuw.supabase.co/storage/v1/object/public/hw-datasets/${folder}/${filename}`;
  const previewImageURL =
    `https://yslwgaephsnbfoiqnpuw.supabase.co/storage/v1/object/public/hw-datasets/${folder}/${baseFile}.png`;

  const isRegularHW = ["단어", "연어", "문법", "단계별 독해"].includes(hw);

  // ✅ 이미지로 미리보기
  if (isRegularHW) {
    content += `
      <div style="margin-bottom: 8px; height: 180px; overflow-y: auto; border: 1px solid #aaa; border-radius: 6px;">
        <img src="${previewImageURL}" style="width: 100%;" />
      </div>
    `;
  }

  if (isRegularHW) {
    const quizResult = JSON.parse(localStorage.getItem('QuizResults') || '{}');
    const quizKey = baseFile;
    const isDone = quizResult.quiztitle === quizKey && quizResult.teststatus === 'done';

    if (isDone) {
      content += `
        <div style="margin-bottom: 10px;">이미 시험을 완료했어요. 다운로드도 가능해요.</div>
        <div style="display: flex; gap: 6px; justify-content: center;">
          <a href="${fileURL}" download class="room-btn" id="download-a"
            style="flex: 1; text-decoration: none; height: 18px;
          display: inline-flex; align-items: center; justify-content: center;">📂 다시 다운로드</a>
          <button class="room-btn" style="background: #1976d2; flex: 1;" id="upload-btn">✅ 완료했어요</button>
        </div>
      `;
    } else if (downloaded) {
      if (item.label === '단어') {
        content += `
          <div style="margin-bottom: 10px;">숙제를 다시 다운로드하거나, 시험을 보러 갈 수 있어요.</div>
          <div style="display: flex; gap: 6px; justify-content: center;">
            <a href="${fileURL}" download class="room-btn" id="download-a"
              style="flex: 1; text-decoration: none; height: 18px;
            display: inline-flex; align-items: center; justify-content: center;">📂 다시 다운로드</a>
            <button class="room-btn" style="background: #2e7d32; flex: 1;" id="quiz-btn">📝 시험볼게요</button>
          </div>
        `;
      } else {
        content += `
          <div style="margin-bottom: 10px;">숙제를 다운로드하셨네요. 바로 완료 처리할 수 있어요.</div>
          <div style="display: flex; gap: 6px; justify-content: center;">
            <a href="${fileURL}" download class="room-btn" id="download-a"
              style="flex: 1; text-decoration: none; height: 18px;
            display: inline-flex; align-items: center; justify-content: center;">📂 다시 다운로드</a>
            <button class="room-btn" style="background: #1976d2; flex: 1;" id="upload-btn">✅ 완료했어요</button>
          </div>
        `;
      }
    } else {
      content += `
        <div style="margin-bottom: 10px;">해당 숙제를 다운로드하세요.</div>
        <a href="${fileURL}" download class="room-btn" id="download-btn"
          style="flex: 1; text-decoration: none; height: 18px;
        display: inline-flex; align-items: center; justify-content: center;">📂 다운로드</a>
      `;
    }
  } else if (hw === "오늘 내 숙제") {
    // ✅ '오늘 내 숙제' 전용 커스텀 팝업 + 드롭다운 + 단일 코멘트창
    const requestTypes = [
      "오늘 내 숙제",
      "시험지 만들어주세요",
      "채점만 해주세요",
      "이거 잘 모르겠어요"
    ];

    const optionsHtml = requestTypes
      .map(type => `<option value="${type}">${type}</option>`)
      .join("");

    content += `
      <label for="custom_hwcategory">어떤 종류의 요청인가요?</label>
      <select id="custom_hwcategory" style="width:100%; margin-bottom:6px;">
        ${optionsHtml}
      </select>

      <label for="custom_hwcomment">요청 사항이 있다면 적어주세요 (선택)</label>
      <textarea
        id="custom_hwcomment"
        rows="3"
        style="width:100%; resize:none;"
        placeholder="필요할 때만 적어주세요. 예: 사진으로 보낼 자료 설명, 채점 기준, 모르는 부분 메모 등"
      ></textarea>

      <button class="room-btn" style="background: #1976d2; margin-top: 6px;" id="custom-complete-btn">
        ✅ 완료했어요!
      </button>
    `;
  } else {
    content += `<div style="margin: 12px 0;">단어 퀴즈를 풀어보아요!</div>`;
  }

  content += `
    <button id="close-popup" class="room-btn" style="margin-top:14px; width:100%; background:#f17b2a;">닫기</button>
  `;

  popup.innerHTML = content;

  // ✅ 중앙 토스트 + 진행바 표시
  function showRedirectToast() {
    const existing = document.getElementById('redirect-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'redirect-toast';
    toast.style = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 14px 18px;
      border-radius: 12px;
      background: rgba(40, 40, 40, 0.92);
      color: #fff;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      z-index: 3000;
      box-shadow: 0 4px 14px rgba(0,0,0,0.35);
      min-width: 220px;
      text-align: center;
    `;

    toast.innerHTML = `
      <span style="margin-bottom: 4px;">반납함으로 이동 중입니다...</span>
      <div style="width: 180px; height: 8px; border-radius: 6px; background: rgba(255,255,255,0.25); overflow: hidden;">
        <div class="redirect-toast-bar" style="
          width: 0%;
          height: 100%;
          background: #ffcc80;
          border-radius: 6px;
          transition: width 1.9s linear;
        "></div>
      </div>
    `;

    document.body.appendChild(toast);

    const bar = toast.querySelector('.redirect-toast-bar');
    requestAnimationFrame(() => {
      bar.style.width = '100%';
    });
  }

  // ✅ 이벤트 바인딩
  popup.querySelector('#close-popup')?.addEventListener('click', () => popupContainer.remove());

  popup.querySelector('#download-btn')?.addEventListener('click', () => {
    localStorage.setItem(key, 'true');
    showDishPopup(item);
  });

  popup.querySelector('#download-a')?.addEventListener('click', () => {
    localStorage.setItem(key, 'true');
  });

  popup.querySelector('#quiz-btn')?.addEventListener('click', () => {
    const quizKey = buildFilename(item).replace(/\.pdf$/, '');
    window.location.href =
      `dish-quiz.html?id=${encodeURIComponent(userId || '')}&key=${encodeURIComponent(quizKey)}`;
  });

  // ✅ 일반 숙제 "완료했어요" → 영수증 + 2초 로딩바 + 제출함 이동
  popup.querySelector('#upload-btn')?.addEventListener('click', () => {
    const isWord = item.label === '단어';
    const hwType = isWord ? "doneinweb" : "pdf사진";

    console.log('✅ [제출] 라벨:', item.label);
    console.log('✅ [제출] Subcategory:', item.Subcategory);
    console.log('✅ [제출] 저장될 HWType:', hwType);

    window.storePendingHomework({
      Subcategory: item.Subcategory,
      HWType: hwType,
      LessonNo: item.LessonNo,
      Status: "readyToBeSent",
      comment: "시험 완료 후 제출"
    });

    popupContainer.remove();
    window.showReceiptFromQordered(item.Subcategory);

    showRedirectToast();

    setTimeout(() => {
      window.location.href =
        `homework-submit.html?id=${encodeURIComponent(userId || '')}`;
    }, 2000);
  });

  // ✅ 커스텀 요청형도 동일하게 로딩바 + 이동
  popup.querySelector('#custom-complete-btn')?.addEventListener('click', () => {
    const typeSelect = document.getElementById('custom_hwcategory');
    const selectedType =
      (typeSelect && typeSelect.value) ? typeSelect.value : "오늘 내 숙제";

    const explanation = document.getElementById('custom_hwcomment')?.value.trim() || '';

    // [선택 타입] + (선택적) 코멘트
    const pieces = [`[${selectedType}]`];
    if (explanation) pieces.push(explanation);

    const combinedComment = pieces.join(' ');

    window.storePendingHomework({
      // 🔥 드롭다운에서 고른 값을 Subcategory로 저장
      Subcategory: selectedType,
      HWType: "사진촬영",
      LessonNo: null,
      Status: "readyToBeSent",
      comment: combinedComment
    });

    popupContainer.remove();
    // 영수증에는 기존 접시 이름(오늘 내 숙제)이 찍히는 구조 유지
    window.showReceiptFromQordered(item.Subcategory);

    showRedirectToast();

    setTimeout(() => {
      window.location.href =
        `homework-submit.html?id=${encodeURIComponent(userId || '')}`;
    }, 2000);
  });

  popupContainer.appendChild(popup);
  cafeInt.appendChild(popupContainer);
};
