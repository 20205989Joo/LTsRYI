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

// blackboard DOM을 가져오기
const blackboard = document.querySelector(".blackboard");

// 캔버스 생성 및 blackboard에 추가
const canvas = document.createElement("canvas");
canvas.width = blackboard.clientWidth; // blackboard 너비와 동일하게 설정
canvas.height = blackboard.clientHeight; // blackboard 높이와 동일하게 설정
canvas.style.position = "absolute"; // 상대 배치
canvas.style.left = 0;
canvas.style.top = 0;
canvas.style.width="100%";
canvas.style.height = "100%";
blackboard.appendChild(canvas);

// 기존 코드 이어서 적용
const ctx = canvas.getContext("2d");

// 기준 단어와 글자 박스 정의
const targetWord = highlightValue;
const letterBoxes = [];
const letterWidth = 40;
const letterHeight = 50;
const startX = 20;
const startY = 20;

// 중력 설정
const gravity = 0.05;


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

function placeRunefromURL() {
    // URL 파라미터를 파싱
    const urlParams = new URLSearchParams(window.location.search);
    const runesParam = urlParams.get('runes');

    // runes 파라미터가 없으면 함수 종료
    if (!runesParam) {
        console.log("No 'runes' parameter found in the URL.");
        return;
    }

    console.log(`Runes parameter found: ${runesParam}`);

    // runes 파라미터를 3자씩 끊어서 x-y 형식으로 처리
    const runePairs = [];
    for (let i = 0; i < runesParam.length; i += 3) {
        runePairs.push(runesParam.slice(i, i + 3));
    }
    console.log(`Parsed rune pairs: ${runePairs}`);

    // 각 rune pair에 맞는 스타일 업데이트
    runePairs.forEach((runePair, index) => {
        const runeId = `rune${index + 1}`; // id 값 생성 (rune1, rune2, ...)
        const runeElement = document.getElementById(runeId);

        if (runeElement) {
            console.log(`Updating ${runeId} with runePair: ${runePair}`);

            // runePair를 파싱하여 x, y 값 추출
            const xValue = parseInt(runePair[0], 10); // 첫 번째 문자 (x)
            const yValue = parseInt(runePair[2], 10); // 세 번째 문자 (y)

            if (isNaN(xValue) || isNaN(yValue)) {
                console.error(`Invalid runePair: ${runePair}. Skipping ${runeId}.`);
                return;
            }

            // y 값에 따른 o'clock 매핑
            let backgroundImage;
            switch (yValue) {
                case 1:
                    backgroundImage = 'rune_2oclock.png';
                    break;
                case 2:
                    backgroundImage = 'rune_4oclock.png';
                    break;
                case 3:
                    backgroundImage = 'rune_6oclock.png';
                    break;
                case 4:
                    backgroundImage = 'rune_8oclock.png';
                    break;
                case 5:
                    backgroundImage = 'rune_10oclock.png';
                    break;
                case 6:
                    backgroundImage = 'runes.png';
                    break;
                default:
                    console.error(`Invalid yValue: ${yValue}. Skipping ${runeId}.`);
                    return;
            }

            // 배경 이미지 설정
            runeElement.style.backgroundImage = `url('${backgroundImage}')`;

            // 스타일 업데이트: display 속성 변경
            runeElement.style.display = 'block';
            runeElement.style.backgroundPosition = 'center';

            console.log(`Applied background: ${backgroundImage} to ${runeId}`);
        } else {
            console.warn(`Element with ID ${runeId} not found.`);
        }
    });
}

// 페이지 로드 시 placeRunefromURL 호출
document.addEventListener('DOMContentLoaded', placeRunefromURL);










// 기준 글자 박스 재설정 (캔버스 크기에 맞게)
function setLetterBoxes() {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    fontSize = Math.min(canvasWidth / (targetWord.length + 1), canvasHeight / 4) * 1.2;

    ctx.font = `${fontSize}px Arial`;
    const textWidth = ctx.measureText(targetWord).width;
    const dynamicLetterWidth = Math.max(fontSize * 0.8, textWidth / targetWord.length);

    letterBoxes.length = 0;
    const startX = (canvasWidth - (dynamicLetterWidth * targetWord.length)) / 2;
    const startY = canvasHeight / 2 + fontSize / 3;

    // 메인 캔버스 초기화
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (let i = 0; i < targetWord.length; i++) {
        const x = startX + i * dynamicLetterWidth;

        // 글자 렌더링
        ctx.fillStyle = "white"; // 배경 흰색
        ctx.fillRect(x, startY - fontSize, dynamicLetterWidth, fontSize);

        ctx.fillStyle = "black"; // 글자 검정색
        ctx.font = `${fontSize}px Arial`;
        ctx.fillText(targetWord[i], x, startY);

        // 메인 캔버스에서 픽셀 데이터 가져오기
        const pixelData = ctx.getImageData(
            x,
            startY - fontSize,
            Math.ceil(dynamicLetterWidth),
            Math.ceil(fontSize)
        ).data;

        // 글자 픽셀 개수 계산
        let textPixelCount = 0;
        const totalPixelCount = Math.ceil(dynamicLetterWidth) * Math.ceil(fontSize);

        for (let j = 0; j < pixelData.length; j += 4) {
            const r = pixelData[j];
            const g = pixelData[j + 1];
            const b = pixelData[j + 2];
            // 글자 픽셀인지 확인 (흰색 배경 제외)
            if (!(r === 255 && g === 255 && b === 255)) {
                textPixelCount++;
            }
        }

        // 디버깅 로그: 텍스트 픽셀 비율 출력
        console.log(
            `Letter: ${targetWord[i]} - Text Pixel Count: ${textPixelCount}, Total Pixels: ${totalPixelCount}, Ratio: ${(textPixelCount / totalPixelCount * 100).toFixed(2)}%`
        );

        letterBoxes.push({
            letter: targetWord[i],
            x,
            y: startY,
            width: dynamicLetterWidth,
            height: fontSize,
            accuracy: 0,
            pixelData // 메인 캔버스 픽셀 데이터 저장
        });
    }
}



function checkIf80Percent(userStrokes) {
    letterBoxes.forEach((box, index) => {
        const { pixelData, width, height, x: boxX, y: boxY } = box;

        let matchingPixels = 0;
        let totalPixels = 0;

        // 현재 박스 내부 stroke 필터링
        const relevantStrokes = userStrokes
            .map((stroke) => ({
                points: stroke.points.filter(({ x, y }) =>
                    x >= boxX &&
                    x < boxX + width &&
                    y >= boxY - height &&
                    y < boxY
                )
            }))
            .filter((stroke) => stroke.points.length > 0);

        if (relevantStrokes.length > 0) {
            console.log(
                `LetterBox ${index + 1} (Letter: '${box.letter}'): Relevant strokes found: ${relevantStrokes.length}`
            );
        }

        relevantStrokes.forEach((stroke) => {
            stroke.points.forEach(({ x, y }) => {
                const relativeX = Math.floor(x - boxX);
                const relativeY = Math.floor(y - (boxY - height));

                // Out-of-bounds 체크
                if (relativeX < 0 || relativeX >= width || relativeY < 0 || relativeY >= height) {
                    console.warn(
                        `Out of bounds: relativeX=${relativeX}, relativeY=${relativeY}, width=${width}, height=${height}`
                    );
                    return;
                }

                const pixelIndex = Math.floor((relativeY * width + relativeX) * 4);

                // pixelIndex 유효성 검사
                if (pixelIndex < 0 || pixelIndex + 3 >= pixelData.length) {
                    console.error(
                        `Invalid PixelIndex: ${pixelIndex}, PixelData Length: ${pixelData.length}`
                    );
                    return;
                }

                // RGB 값 확인 및 매칭 (글자 색이 검정이고 배경이 흰색인 경우 기준값 설정)
                const r = pixelData[pixelIndex];
                const g = pixelData[pixelIndex + 1];
                const b = pixelData[pixelIndex + 2];

                // 검정색 (텍스트)인지 확인
                const isTextPixel = r < 50 && g < 50 && b < 50;

                if (isTextPixel) {
                    matchingPixels++;
                }
                totalPixels++;
            });
        });

        box.accuracy = totalPixels > 0 ? matchingPixels / totalPixels : 0;

        if (totalPixels > 0) {
            console.log(
                `LetterBox ${index + 1} (Letter: '${box.letter}'): Matching Pixels: ${matchingPixels}, Total Pixels: ${totalPixels}, Accuracy: ${(box.accuracy * 100).toFixed(2)}%`
            );
        }
    });
}









// LetterBox를 정확도에 따라 동적으로 그리기
function displayScoredBoxes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize}px Arial`;
    letterBoxes.forEach(({ letter, x, y, width, height, accuracy }) => {
        // 정확도에 따라 테두리 색상 변경
        ctx.strokeStyle = accuracy >= 0.8 ? "blue" : "red";
        ctx.lineWidth = 1;
        ctx.shadowColor = accuracy >= 0.8 ? "rgba(0, 0, 255, 0.4)" : "rgba(255, 0, 0, 0.4)";
        ctx.shadowBlur = 10;

        // 테두리와 글자 그리기
        ctx.strokeRect(x, y - height, width, height);
        ctx.fillStyle = "gray";
        ctx.fillText(letter, x + width * 0.1, y);
    });
}

// mousemove 이벤트에서 정확도 계산 및 업데이트
canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;

    const { x, y } = getEventPosition(e);
    userStrokes[userStrokes.length - 1].points.push({ x, y });

    createParticle(x, y);

    // 정확도 계산 및 LetterBox 스타일 업데이트
    checkIf80Percent(userStrokes);

    // LetterBox와 stroke를 새로 그리기
    displayScoredBoxes();
    drawStrokes();
    drawParticles();
});

// 캔버스 크기를 부모 요소에 맞게 동적으로 설정
function resizeCanvas() {
    canvas.width = blackboard.clientWidth; // 부모 요소의 실제 너비로 설정
    canvas.height = blackboard.clientHeight; // 부모 요소의 실제 높이로 설정
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 기존 내용 초기화
    
    setLetterBoxes(); // 캔버스 크기에 맞게 letterBox 재조정
    displayScoredBoxes(); // 캔버스를 초기화한 후 다시 박스를 그리기
}

// 윈도우 리사이즈 이벤트에 대응
window.addEventListener("resize", resizeCanvas);

// 처음에 캔버스 크기 설정



function getEventPosition(e) {
    const rect = canvas.getBoundingClientRect(); // 캔버스의 위치와 크기

    if (e.touches) {
        const touch = e.touches[0]; // 첫 번째 터치 포인트 사용
        return {
            x: touch.clientX - rect.left, // 캔버스 내부 X 좌표
            y: touch.clientY - rect.top,  // 캔버스 내부 Y 좌표
        };
    }

    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
    };
}


let isDrawing = false;
let userStrokes = [];
let particles = [];










// 나머지 기존 코드도 이어서 사용
function drawStrokes() {
    const currentTime = Date.now();
    userStrokes.forEach((stroke) => {
        ctx.beginPath();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = "rgba(241, 114, 42, .8)";
        ctx.shadowColor = "rgb(224, 15, 0)";
        ctx.shadowBlur = 3.2;
        ctx.shadowOffsetY = 0;

        for (let i = 1; i < stroke.points.length; i++) {
            ctx.moveTo(stroke.points[i - 1].x, stroke.points[i - 1].y);
            ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        ctx.stroke();
        ctx.closePath();

        const elapsedTime = currentTime - stroke.timestamp;
        const duration = 4000;
        const startColor = "rgba(250, 235, 188,1)";
        const endColor = "rgba(255, 133, 133, 0.95)";
        const strokeColor = interpolateColor(startColor, endColor, elapsedTime, duration);

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = strokeColor;
        ctx.shadowColor = "transparent";

        for (let i = 1; i < stroke.points.length; i++) {
            ctx.moveTo(stroke.points[i - 1].x, stroke.points[i - 1].y);
            ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        ctx.stroke();
        ctx.closePath();
    });
}

function interpolateColor(startColor, endColor, elapsedTime, duration) {
    const factor = Math.min(1, elapsedTime / duration);
    const [r1, g1, b1, a1] = startColor.match(/\d+(\.\d+)?/g).map(Number);
    const [r2, g2, b2, a2] = endColor.match(/\d+(\.\d+)?/g).map(Number);

    const red = Math.round(r1 + (r2 - r1) * factor);
    const green = Math.round(g1 + (g2 - g1) * factor);
    const blue = Math.round(b1 + (b2 - b1) * factor);
    const alpha = a1 + (a2 - a1) * factor;

    return `rgba(${red}, ${green}, ${blue}, ${alpha.toFixed(2)})`;
}

function createParticle(x, y) {
    const particle = {
        x,
        y,
        radius: Math.random() * 3 + 1,
        color: `rgba(241, ${Math.floor(Math.random() * 50 + 114)}, 42, 1)`,
        alpha: 1,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
        life: 60,
    };
    particles.push(particle);
}

function drawParticles() {
    particles.forEach((particle, index) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace(/, 1\)$/, `, ${particle.alpha})`);
        ctx.fill();
        ctx.closePath();

        particle.x += particle.dx;
        particle.y += particle.dy;

        if (particle.life < 20) {
            particle.dy += gravity;
        }

        particle.alpha -= 0.02;
        particle.life--;

        if (particle.life <= 0 || particle.alpha <= 0) {
            particles.splice(index, 1);
        }
    });
}


canvas.addEventListener("mousedown", () => {
    isDrawing = true;
    userStrokes.push({ points: [], timestamp: Date.now() });
});
canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    isDrawing = true;
    userStrokes.push({ points: [], timestamp: Date.now() });
});

canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;

    const { x, y } = getEventPosition(e);
    userStrokes[userStrokes.length - 1].points.push({ x, y });

    createParticle(x, y);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    displayScoredBoxes();
    drawStrokes();
    drawParticles();
});
canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const { x, y } = getEventPosition(e);
    userStrokes[userStrokes.length - 1].points.push({ x, y });

    createParticle(x, y);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    displayScoredBoxes();
    drawStrokes();
    drawParticles();
});

canvas.addEventListener("mouseup", () => {
    isDrawing = false;
});
canvas.addEventListener("touchend", () => {
    isDrawing = false;
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    displayScoredBoxes();
    drawStrokes();
    drawParticles();
    requestAnimationFrame(animate);
}

resizeCanvas();
animate();

