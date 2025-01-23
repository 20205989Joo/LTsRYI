const roller = document.getElementById('roller');
const container = document.getElementById('container');
const items = Array.from(roller.children).slice(1, -1); // Ignore spacers
const itemHeight = 50;
const totalItems = items.length;
let startY_for_roller = 0; // Changed to prevent conflicts with other startY variables
let isSwiping_for_roller = false; // Changed to ensure swiping logic is isolated
let currentOffset_for_roller = 0; // Changed to avoid conflicts with other offset variables
let boundaryResistance = 15; // Resistance when at boundaries
let restrictBoundary = true; // Toggle for applying boundary logic

function restrictOffset(offset) {
    // Restrict offset for normal scrolling behavior (first item only)
    const minOffset = restrictBoundary ? 0 : -itemHeight;
    const maxOffset = (totalItems - 1) * itemHeight;
    if (offset < minOffset) return minOffset;
    if (offset > maxOffset) return maxOffset;
    return offset;
}

function updateRoller(offset) {
    roller.style.transform = `translateY(${-offset}px)`;

    // Highlight the center item
    const centerIndex = Math.round(offset / itemHeight);
    items.forEach((item, index) => {
        if (index === centerIndex) {
            item.style.fontSize = '1.5rem';
            item.style.color = 'rgb(196, 64, 12)';
            item.style.opacity = '1';
        } else {
            item.style.fontSize = '10pt';
            item.style.color = '#aaa';
            item.style.opacity = '0.5';
        }
    });

    // Toggle restrictBoundary if the first item is highlighted
    restrictBoundary = currentOffset_for_roller !== 0;
}

function finalizeSwipe() {
    const closestIndex = Math.round(currentOffset_for_roller / itemHeight);
    currentOffset_for_roller = closestIndex * itemHeight;

    // Check if highlight is on the spacer above the first item
    if (currentOffset_for_roller === -itemHeight) {
        upButtonPressed();
        return;
    }

    updateRoller(currentOffset_for_roller);
}

container.addEventListener('touchstart', (e) => { if (!e.target.closest('.container')) return;
    startY_for_roller = e.touches[0].clientY; // Use roller-specific startY
    isSwiping_for_roller = true; // Use roller-specific swiping flag
});

document.addEventListener('touchmove', (e) => {
    if (!isSwiping_for_roller) return; // Check roller-specific swiping flag
    const deltaY_for_roller = e.touches[0].clientY - startY_for_roller; // Use roller-specific deltaY

    // Adjust offset and apply restrictOffset only when necessary
    currentOffset_for_roller -= deltaY_for_roller;
    currentOffset_for_roller = restrictOffset(currentOffset_for_roller);

    updateRoller(currentOffset_for_roller);
    startY_for_roller = e.touches[0].clientY; // Update roller-specific startY
});

document.addEventListener('touchend', () => {
    if (isSwiping_for_roller) {
        finalizeSwipe();
    }
    isSwiping_for_roller = false; // Reset roller-specific swiping flag
});

container.addEventListener('mousedown', (e) => { if (!e.target.closest('.container')) return;
    startY_for_roller = e.clientY; // Use roller-specific startY
    isSwiping_for_roller = true; // Use roller-specific swiping flag
});

document.addEventListener('mousemove', (e) => {
    if (!isSwiping_for_roller) return; // Check roller-specific swiping flag
    const deltaY_for_roller = e.clientY - startY_for_roller; // Use roller-specific deltaY

    // Adjust offset and apply restrictOffset only when necessary
    currentOffset_for_roller -= deltaY_for_roller;
    currentOffset_for_roller = restrictOffset(currentOffset_for_roller);

    updateRoller(currentOffset_for_roller);
    startY_for_roller = e.clientY; // Update roller-specific startY
});

document.addEventListener('mouseup', () => {
    if (isSwiping_for_roller) {
        finalizeSwipe();
    }
    isSwiping_for_roller = false; // Reset roller-specific swiping flag
});

function upButtonPressed() {
    if (currentOffset_for_roller > 0) {
        currentOffset_for_roller -= itemHeight;
    } else {
        currentOffset_for_roller = (totalItems - 1) * itemHeight; // Jump to the last item
    }
    updateRoller(currentOffset_for_roller);
}

function downButtonPressed() {
    const maxOffset = (totalItems - 1) * itemHeight;
    if (currentOffset_for_roller < maxOffset) {
        currentOffset_for_roller += itemHeight;
    } else {
        currentOffset_for_roller = 0; // Jump to the first item
    }
    updateRoller(currentOffset_for_roller);
}

updateRoller(currentOffset_for_roller);





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
const targetWord = "testin";
const letterBoxes = [];
const letterWidth = 40;
const letterHeight = 50;
const startX = 20;
const startY = 20;

// 중력 설정
const gravity = 0.05;

// 기준 글자 박스 재설정 (캔버스 크기에 맞게)
function updateLetterBoxes() {
    const canvasWidth = canvas.width; // 현재 캔버스 너비
    const canvasHeight = canvas.height; // 현재 캔버스 높이

    const dynamicLetterWidth = canvasWidth / (targetWord.length + 2); // 캔버스 크기에 따라 글자 너비 계산
    const dynamicLetterHeight = canvasHeight / 6; // 캔버스 높이에 기반한 글자 높이
    const startX = dynamicLetterWidth / 1.5; // 첫 글자의 X 시작 위치
    const startY = canvasHeight / 2.3; // 기준 Y 위치

    letterBoxes.length = 0; // 기존 배열 초기화
    for (let i = 0; i < targetWord.length; i++) {
        const x = startX + i * (dynamicLetterWidth + 2);
        const y = startY - dynamicLetterHeight;
        letterBoxes.push({
            letter: targetWord[i],
            x,
            y,
            width: dynamicLetterWidth,
            height: dynamicLetterHeight,
        });
    }
}

// 박스와 글자 초기 그리기
function drawBoxes() {
    ctx.font = "40px Arial";
    ctx.fillStyle = "gray";
    letterBoxes.forEach(({ letter, x, y }) => {
        ctx.strokeRect(x, y, letterWidth, letterHeight);
        ctx.fillText(letter, x + 10, y + letterHeight - 4);
    });
}

// 캔버스 크기를 부모 요소에 맞게 동적으로 설정
function resizeCanvas() {
    canvas.width = blackboard.clientWidth; // 부모 요소의 실제 너비로 설정
    canvas.height = blackboard.clientHeight; // 부모 요소의 실제 높이로 설정
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 기존 내용 초기화
    drawBoxes(); // 캔버스를 초기화한 후 다시 박스를 그리기
    updateLetterBoxes(); // 캔버스 크기에 맞게 letterBox 재조정
}

// 윈도우 리사이즈 이벤트에 대응
window.addEventListener("resize", resizeCanvas);

// 처음에 캔버스 크기 설정
resizeCanvas();

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

    drawBoxes();
    drawStrokes();
    drawParticles();
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

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoxes();
    drawStrokes();
    drawParticles();
    requestAnimationFrame(animate);
}

resizeCanvas();
animate();

