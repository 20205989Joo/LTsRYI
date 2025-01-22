const canvas = document.getElementById("learningCanvas");
const ctx = canvas.getContext("2d");

// 기준 단어와 글자 박스 정의
const targetWord = "booster";
const letterBoxes = [];
const letterWidth = 60;
const letterHeight = 80;
const startX = 50;
const startY = 150;

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

// 필기 곡선과 스타일 설정
function drawStrokes() {
    userStrokes.forEach((stroke) => {
        // 1. 주황색 라인 (아래쪽)
        ctx.beginPath();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = "rgba(241, 114, 42, .8)"; // 오렌지색
        ctx.shadowColor = "rgb(224, 15, 0)"; // 그림자 색상
        ctx.shadowBlur = 3.2; // 그림자 블러
        ctx.shadowOffsetY = 0; // 그림자 Y축 오프셋

        for (let i = 1; i < stroke.length; i++) {
            ctx.moveTo(stroke[i - 1].x, stroke[i - 1].y);
            ctx.lineTo(stroke[i].x, stroke[i].y);
        }
        ctx.stroke();
        ctx.closePath();

        // 2. 흰색 라인 (위쪽)
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgb(236, 236, 212)"; // 흰색
        ctx.shadowColor = "transparent"; // 그림자 없음

        for (let i = 1; i < stroke.length; i++) {
            ctx.moveTo(stroke[i - 1].x, stroke[i - 1].y);
            ctx.lineTo(stroke[i].x, stroke[i].y);
        }
        ctx.stroke();
        ctx.closePath();
    });
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
        gravityApplied: false, // 중력 적용 여부
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
        if (particle.life < 25) {
            particle.dy += 0.2; // 중력 효과 (작게 설정)
            particle.gravityApplied = true; // 중력이 적용된 상태 표시
        }

        particle.alpha -= 0.02; // 서서히 사라짐
        particle.life--;

        // 수명이 다하거나 alpha가 0이 되면 입자 제거
        if (particle.life <= 0 || particle.alpha <= 0) {
            particles.splice(index, 1);
        }
    });
}

// 사용자가 그린 점 기록
canvas.addEventListener("mousedown", () => {
    isDrawing = true;
    userStrokes.push([]); // 새로운 Stroke 추가
});

canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;

    const { offsetX: x, offsetY: y } = e;
    userStrokes[userStrokes.length - 1].push({ x, y }); // 현재 Stroke에 점 추가

    // 불꽃 효과 생성
    createParticle(x, y);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 글자 박스와 기준 단어 다시 그리기
    drawBoxes();

    // 기존 Stroke 다시 그리기
    drawStrokes();

    // 불꽃 효과 그리기
    drawParticles();
});

canvas.addEventListener("mouseup", () => {
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
