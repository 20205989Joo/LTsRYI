const roller = document.getElementById('roller');
const container = document.getElementById('container');
const itemHeight = 50;
let startY_for_roller = 0; // Changed to prevent conflicts with other startY variables
let isSwiping_for_roller = false; // Changed to ensure swiping logic is isolated
let currentOffset_for_roller = 0; // Changed to avoid conflicts with other offset variables
let boundaryResistance = 15; // Resistance when at boundaries
let restrictBoundary = true; // Toggle for applying boundary logic

// URL에서 highlight 파라미터 값 가져오기
const urlParams = new URLSearchParams(window.location.search);
const highlightValue = urlParams.get('highlight'); // highlight 파라미터 값 읽기

// highlight 값이 존재할 경우
if (highlightValue) {
    // 모든 .item 요소 가져오기
    const items = document.querySelectorAll('.item');

    // 각 item 요소를 순회하며 처리
    items.forEach(item => {
        // item에 highlight 값을 넣기
        item.textContent = highlightValue;

        // highlight 값과 일치하는 경우 스타일 적용
        if (item.textContent.trim() === highlightValue) {
            item.style.fontSize = '1.5rem'; // 하이라이트된 폰트 크기
            item.style.color = 'rgba(59, 21, 6, 0.72)'; // 하이라이트된 색상
            item.style.opacity = '1'; // 강조 표시
            item.style.textAlign = 'center';
        } else {
            // 다른 요소는 기본 스타일
            item.style.fontSize = '10pt';
            item.style.color = '#aaa';
            item.style.opacity = '0.5';
        }
    });
}


function createrunesystem(parsedData) {
    const runeslot = document.querySelector('.runeslot');

    console.log("[createrune] Starting system creation...");

    for (let i = 0; i < 3; i++) {
        console.log(`[createrune] Creating runeprep${i + 1}`);


        const runepreptext = [ '어감', '어원', '용례'];

        // runeprep 생성
        const runeprep = document.createElement('div');
        runeprep.classList.add('runeprep');
        runeprep.style.top = `${10 + i * 46}px`;
        runeprep.style.left = '10px';
        runeprep.id = `runeprep${i + 1}`;
        runeprep.textContent = runepreptext[i];
        runeslot.appendChild(runeprep);

        console.log(`[createrune] Added runeprep${i + 1} to runeslot`);

        // runeprep_detail 생성
        const runeprepDetail = document.createElement('div');
        runeprepDetail.classList.add('runeprep_detail', 'label_runeprep_detail');
        runeprepDetail.style.top = `${10 + i * 46}px`;
        runeprepDetail.style.left = '60px';
        runeprepDetail.id = `runeprep_detail${i + 1}`;

        // 하드코딩된 텍스트 추가
        const labelText = [
            "왼쪽의 룬을 눌러 '연상'합니다",
            '올려진 룬을 누르면 선택지 등장!',
            '설정하고, carve하러갑시다.'
        ];
        runeprepDetail.textContent = labelText[i]; // 정적 텍스트 설정
        runeslot.appendChild(runeprepDetail);

        console.log(`[createrune] Set textContent of runeprep_detail${i + 1} to: ${labelText[i]}`);

        // rune_options 컨테이너 생성
        const rune = document.getElementById(`rune${i + 1}`);
        if (rune) {
            console.log(`[createrune] Found rune${i + 1}`);
            const runeOptionsContainer = document.createElement('div');
            runeOptionsContainer.classList.add('rune_options_container');
            runeOptionsContainer.style.display = 'none';

            for (let j = 0; j < 6; j++) {
                const runeOption = document.createElement('div');
                runeOption.classList.add('rune_option', 'label_rune_option');
                runeOption.id = `rune_option${i + 1}-${j + 1}`;

                // parsedData에서 값을 가져오되, 여전히 기본값을 유지
                runeOption.textContent = parsedData?.[runeOption.id] || `Option ${j + 1}`;
                console.log(`[createrune] Set ${runeOption.id} to: ${runeOption.textContent}`);
                runeOptionsContainer.appendChild(runeOption);
            }

            rune.appendChild(runeOptionsContainer);
            console.log(`[createrune] Added runeOptionsContainer to rune${i + 1}`);
        } else {
            console.warn(`[createrune] rune${i + 1} not found`);
        }
    }
}



async function fetchRupitOptions(highlightValue) {
    try {
        // JSON 파일 로드
        const response = await fetch('DEM-S_rupit.json'); // JSON 파일 경로
        const data = await response.json();

        // highlightValue에 해당하는 단어 찾기
        const wordData = data.find(item => item.word === highlightValue);

        if (!wordData) {
            console.error(`단어 "${highlightValue}"를 JSON 데이터에서 찾을 수 없습니다.`);
            return;
        }

        // 찾은 데이터를 로그로 출력
        console.log(`단어 "${highlightValue}"에 대한 데이터:`, wordData);

        // 각 runeprep의 옵션 출력
        ['runeprep1', 'runeprep2', 'runeprep3'].forEach(prep => {
            console.log(`- ${wordData[prep].label}`);
            console.log(`  옵션: ${wordData[prep].options.join(', ')}`);
        });

        return wordData; // 필요한 경우 데이터를 반환
    } catch (error) {
        console.error('JSON 데이터를 로드하거나 파싱하는 중 오류 발생:', error);
    }
}



function rupitprep(wordData) {
    if (!wordData) {
        console.error("[rupitprep] 유효한 wordData가 없습니다.");
        return;
    }

    const parsedData = {}; // 파싱한 데이터를 저장할 객체

    console.log("[rupitprep] Parsing wordData:", wordData);

    // 각 runeprep 데이터를 처리
    ['runeprep1', 'runeprep2', 'runeprep3'].forEach((prepKey, prepIndex) => {
        const options = wordData[prepKey].options;

        options.forEach((optionText, optionIndex) => {
            const optionId = `rune_option${prepIndex + 1}-${optionIndex + 1}`;
            parsedData[optionId] = optionText; // ID와 텍스트를 매핑
            console.log(`[rupitprep] Mapped ${optionId} -> ${optionText}`);
        });
    });

    console.log("[rupitprep] Generated parsedData:", parsedData);

    return parsedData; // 파싱된 데이터를 반환
}


// runeprep 및 rune 리스너를 부여하는 함수
function runesnowtouchable() {
    const runepreps = document.querySelectorAll('.runeprep');
    const runes = document.querySelectorAll('[id^="rune"]');
    const runeOptions = document.querySelectorAll('.rune_option'); // 모든 rune_option 선택

    console.log("[runesnowtouchable] runepreps found:", runepreps.length);
    console.log("[runesnowtouchable] runes found:", runes.length);
    console.log("[runesnowtouchable] runeOptions found:", runeOptions.length);

    // runeprep 리스너 부여
    runepreps.forEach((runeprep, index) => {
        console.log(`[runesnowtouchable] Adding click listener to runeprep${index + 1}`);
        runeprep.addEventListener('click', () => {
            console.log(`[runesnowtouchable] Clicked runeprep${index + 1}`);
            runetoholderorslot(index + 1, runeprep);
        });
    });

    // rune 리스너 부여
    runes.forEach((rune, index) => {
        console.log(`[runesnowtouchable] Adding click listener to rune${index + 1}`);
        rune.addEventListener('click', () => {
            console.log(`[runesnowtouchable] Clicked rune${index + 1}`);
            toggleRuneOptionsContainer(index + 1, rune);
        });
    });

    // rune_option 리스너 부여
    runeOptions.forEach((option) => {
        console.log(`[runesnowtouchable] Adding click listener to option with ID: ${option.id}`);
        option.addEventListener('click', () => {
            console.log(`[runesnowtouchable] Clicked option with ID: ${option.id}`);
            runeoptionchoose(option.id);
        });
    });
}

// runetoholderorslot 함수: rune을 보이게 하거나 숨기는 로직
function runetoholderorslot(index, runeprep) {
    const rune = document.getElementById(`rune${index}`);
    const runeprepDetail = document.getElementById(`runeprep_detail${index}`);

    if (rune) {
        // rune이 보이는 상태라면 숨김 처리
        if (rune.style.display === 'block') {
            rune.style.display = 'none';
            runeprep.style.opacity = '1'; // 원래 상태로 복구

            if (runeprepDetail) {
                runeprepDetail.style.opacity = '1'; // 다시 보이게
            }
        } else {
            // rune이 숨겨진 상태라면 보이게 처리
            rune.style.display = 'block';
            runeprep.style.opacity = '0.5'; // 활성화 상태로 표시
   
            if (runeprepDetail) {
                runeprepDetail.style.opacity = '0.4'; // 투명하게 처리
            }
        }
    }
}

function runeoptionchoose(optionId) {
    const option = document.getElementById(optionId);
    if (!option) {
        console.error(`Option with ID ${optionId} not found.`);
        return;
    }

    // 이벤트 전파 방지
    event.stopPropagation();

    // 컨테이너 번호와 옵션 번호 추출
    const [containerId, optionNumber] = optionId.replace('rune_option', '').split('-');
    const rune = document.getElementById(`rune${containerId}`); // 대상 rune 요소 가져오기
    const optionsInContainer = document.querySelectorAll(`#rune${containerId} .rune_option`);

    // 모든 옵션 초기화
    optionsInContainer.forEach(opt => {
        opt.classList.remove('active');
        opt.style.opacity = '1'; // 기본 상태로 복원
    });

    // 클릭한 옵션 활성화
    option.classList.add('active');
    option.style.opacity = '0.5'; // 활성화 상태로 표시

    // 배경 이미지 변경 (ID에 맞게 처리)
    if (rune) {
        switch (optionNumber) {
            case '1':
                rune.style.backgroundImage = "url('rune_2oclock.png')";
                break;
            case '2':
                rune.style.backgroundImage = "url('rune_4oclock.png')";
                break;
            case '3':
                rune.style.backgroundImage = "url('rune_6oclock.png')";
                break;
            case '4':
                rune.style.backgroundImage = "url('rune_8oclock.png')";
                break;
            case '5':
                rune.style.backgroundImage = "url('rune_10oclock.png')";
                break;
            case '6':
                rune.style.backgroundImage = "url('runes.png')"; // 기본 배경
                break;
            default:
                console.error(`Invalid optionNumber: ${optionNumber}`);
                break;
        }
    }
}





function toggleRuneOptionsContainer(index, rune) {
    const runeOptionsContainer = rune.querySelector('.rune_options_container');

    if (runeOptionsContainer) {
        if (runeOptionsContainer.style.display === 'none' || runeOptionsContainer.style.display === '') {
            runeOptionsContainer.style.display = 'block'; // 옵션 컨테이너 열기
            rune.classList.add('active'); // rune 활성화 상태 추가
        } else {
            runeOptionsContainer.style.display = 'none'; // 옵션 컨테이너 닫기
            rune.classList.remove('active'); // rune 활성화 상태 제거
        }
    }
}

// 외부 클릭 시 옵션 컨테이너 닫기
document.addEventListener('click', (event) => {
    const activeRuneContainers = document.querySelectorAll('.rune.active'); // 활성화된 rune 요소 찾기
    activeRuneContainers.forEach(rune => {
        const optionsContainer = rune.querySelector('.rune_options_container');
        if (optionsContainer && !rune.contains(event.target)) {
            optionsContainer.style.display = 'none'; // 옵션 컨테이너 닫기
            rune.classList.remove('active'); // rune 활성화 상태 제거
        }
    });
});

fetchRupitOptions(highlightValue)
    .then(wordData => {
        // fetchRupitOptions가 데이터를 반환하면 실행
        const parsedData = rupitprep(wordData); // 데이터를 파싱
        createrunesystem(parsedData); // 화면 생성

        // 리스너 부여
        console.log("[main] Calling runesnowtouchable...");
        runesnowtouchable();
    })
    .catch(error => {
        // 에러 발생 시 처리
        console.error("[main] Error:", error);
    });

    // submitbutton 클릭 이벤트 처리
// submitbutton 클릭 이벤트 처리
document.querySelector('.submitbutton').addEventListener('click', () => {
    console.log("[submit] Submit button clicked");

    // 선택된 옵션 추출
    const selectedOptions = [];
    for (let i = 1; i <= 3; i++) {
        const activeOption = document.querySelector(`#rune${i} .rune_option.active`);
        if (activeOption) {
            const optionId = activeOption.id.replace('rune_option', ''); // ID에서 숫자만 추출
            selectedOptions.push(optionId);
        } else {
            selectedOptions.push("0"); // 선택되지 않은 경우 기본값 "0"
        }
    }

    // URL 파라미터 생성
    const runesParam = selectedOptions.join('');
    console.log("[submit] Selected runes:", runesParam);

    // highlightValue 추가
    const highlightParam = highlightValue || "default"; // highlightValue가 없으면 기본값 사용
    console.log("[submit] Highlight value:", highlightParam);

    // 다음 페이지로 이동
    const nextPageUrl = `CasualWordMem3.html?runes=${runesParam}&highlight=${highlightParam}`;
    console.log("[submit] Redirecting to:", nextPageUrl);
    window.location.href = nextPageUrl;
});

