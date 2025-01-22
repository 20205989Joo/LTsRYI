const canvas = document.getElementById("learningCanvas");
const ctx = canvas.getContext("2d");

// 기준 단어와 글자 박스 정의
const targetWord = "exhausted";
const letterBoxes = [];
const letterWidth = 60;
const letterHeight = 80;
const startX = 50;
const startY = 150;

// 중력 설정
const gravity = 0.05; // 약간의 중력 효과

// 기준 글자 박스 생성
ctx.font = "48px Arial";
ctx.fillStyle = "gray";
for (let i = 0; i < targetWord.length; i++) {
    const x = startX + i * (letterWidth + 10);
    letterBoxes.push({
        letter: targetWord[i],
        x,
        y: startY - letterHeight,
        width: letterWidth,
        height: letterHeight,
    });

    // 글자를 박스에 그림
    ctx.fillText(targetWord[i], x + 10, startY - 10);
}

// 박스와 글자 초기 그리기
function drawBoxes() {
    ctx.font = "48px Arial";
    ctx.fillStyle = "gray";
    letterBoxes.forEach(({ letter, x, y }) => {
        ctx.strokeRect(x, y, letterWidth, letterHeight);
        ctx.fillText(letter, x + 10, y + letterHeight - 10);
    });
}

let isDrawing = false;
let userStrokes = [];
let particles = []; // 불꽃 효과 저장

function drawStrokes() {
    const currentTime = Date.now(); // 현재 시각
    userStrokes.forEach((stroke) => {
        // 1. 주황색 라인 (아래쪽)
        ctx.beginPath();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = "rgba(241, 114, 42, .8)"; // 오렌지색
        ctx.shadowColor = "rgb(224, 15, 0)"; // 그림자 색상
        ctx.shadowBlur = 3.2; // 그림자 블러
        ctx.shadowOffsetY = 0; // 그림자 Y축 오프셋

        for (let i = 1; i < stroke.points.length; i++) {
            ctx.moveTo(stroke.points[i - 1].x, stroke.points[i - 1].y);
            ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        ctx.stroke();
        ctx.closePath();

        // 2. 색상 변화 (위쪽)
        const elapsedTime = currentTime - stroke.timestamp; // 경과 시간
        const duration = 4000; // 3초 동안 변화
        const startColor = "rgba(252, 230, 157,1)"; // Yellow
        const endColor = "rgba(252, 159, 159, 0.87)"; // White
        const strokeColor = interpolateColor(startColor, endColor, elapsedTime, duration);

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = strokeColor; // 계산된 색상 적용
        ctx.shadowColor = "transparent"; // 그림자 없음

        for (let i = 1; i < stroke.points.length; i++) {
            ctx.moveTo(stroke.points[i - 1].x, stroke.points[i - 1].y);
            ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        ctx.stroke();
        ctx.closePath();
    });
}

// 색상 변화 함수
function interpolateColor(startColor, endColor, elapsedTime, duration) {
    const factor = Math.min(1, elapsedTime / duration); // 0 ~ 1 사이 비율

    // 시작 색상과 끝 색상에서 각 채널 추출
    const [r1, g1, b1, a1] = startColor.match(/\d+(\.\d+)?/g).map(Number);
    const [r2, g2, b2, a2] = endColor.match(/\d+(\.\d+)?/g).map(Number);

    // 각 채널 계산
    const red = Math.round(r1 + (r2 - r1) * factor);
    const green = Math.round(g1 + (g2 - g1) * factor);
    const blue = Math.round(b1 + (b2 - b1) * factor);
    const alpha = a1 + (a2 - a1) * factor;

    // 색상 문자열 생성
    return `rgba(${red}, ${green}, ${blue}, ${alpha.toFixed(2)})`;
}


// 불꽃 효과 생성
function createParticle(x, y) {
    const particle = {
        x,
        y,
        radius: Math.random() * 3 + 1, // 랜덤 크기 (1~4px)
        color: `rgba(241, ${Math.floor(Math.random() * 50 + 114)}, 42, 1)`, // 랜덤 주황색 계열
        alpha: 1, // 투명도
        dx: (Math.random() - 0.5) * 2, // X축 이동 방향
        dy: (Math.random() - 0.5) * 2, // Y축 이동 방향
        life: 60, // 수명 (프레임)
    };
    particles.push(particle);
}

// 불꽃 효과 그리기
function drawParticles() {
    particles.forEach((particle, index) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace(/, 1\)$/, `, ${particle.alpha})`); // alpha 값 적용
        ctx.fill();
        ctx.closePath();

        // 이동 및 수명 감소
        particle.x += particle.dx;
        particle.y += particle.dy;

        // 끝에 약간 떨어지는 효과 추가
        if (particle.life < 20) {
            particle.dy += gravity; // 중력 효과 (작게 설정)
        }

        particle.alpha -= 0.02; // 서서히 사라짐
        particle.life--;

        // 수명이 다하거나 alpha가 0이 되면 입자 제거
        if (particle.life <= 0 || particle.alpha <= 0) {
            particles.splice(index, 1);
        }
    });
}

// 이벤트 좌표 계산 (마우스/터치 공통)
function getEventPosition(e) {
    if (e.touches) {
        const touch = e.touches[0];
        return { x: touch.clientX - canvas.offsetLeft, y: touch.clientY - canvas.offsetTop };
    }
    return { x: e.offsetX, y: e.offsetY };
}

// 이벤트 좌표 계산 (마우스/터치 공통)
function getEventPosition(e) {
    if (e.touches) {
        const touch = e.touches[0];
        return { x: touch.clientX - canvas.offsetLeft, y: touch.clientY - canvas.offsetTop };
    }
    return { x: e.offsetX, y: e.offsetY };
}

// 마우스/터치 이벤트 처리
canvas.addEventListener("mousedown", () => {
    isDrawing = true;
    userStrokes.push({ points: [], timestamp: Date.now() }); // 새로운 Stroke 추가
});
canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    isDrawing = true;
    userStrokes.push({ points: [], timestamp: Date.now() });
});

canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;

    const { x, y } = getEventPosition(e);
    userStrokes[userStrokes.length - 1].points.push({ x, y }); // 현재 Stroke에 점 추가

    createParticle(x, y); // 불꽃 효과 생성

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBoxes(); // 글자 박스 다시 그리기
    drawStrokes(); // Stroke 다시 그리기
    drawParticles(); // 불꽃 효과 그리기
});
canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const { x, y } = getEventPosition(e);
    userStrokes[userStrokes.length - 1].points.push({ x, y });

    createParticle(x, y);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoxes();
    drawStrokes();
    drawParticles();
});

canvas.addEventListener("mouseup", () => {
    isDrawing = false;
});
canvas.addEventListener("touchend", () => {
    isDrawing = false;
});

// 애니메이션 루프
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 글자 박스와 기준 단어 다시 그리기
    drawBoxes();

    // 기존 Stroke 다시 그리기
    drawStrokes();

    // 불꽃 효과 갱신
    drawParticles();

    requestAnimationFrame(animate);
}
animate();
