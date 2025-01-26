// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x000000, 0); // 투명도 0으로 설정

// DOM에서 .question-container 요소 찾기
const container = document.querySelector('.question-container');
if (!container) {
    console.error('Container not found: .question-container');
} else {
    container.appendChild(renderer.domElement);
    resizeRendererToDisplaySize();
}

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

// Load GLTF model
const loader = new THREE.GLTFLoader();
loader.load('./navigation_test.gltf', function (gltf) {
    scene.add(gltf.scene);
    console.log('GLTF Model Loaded:', gltf);
}, undefined, function (error) {
    console.error('An error occurred while loading the GLTF model:', error);
});

// Camera position
camera.position.set(0, 2, 5);

// Quaternion for camera rotation
const cameraQuaternion = new THREE.Quaternion();
const cameraEuler = new THREE.Euler(0, 0, 0, "YXZ"); // YXZ order for proper rotation

// Movement controls
const speed = 0.03;
const activeKeys = {
    forward: false,
    backward: false,
    left: false,
    right: false
};

const movePlayer = () => {
    const direction = new THREE.Vector3();
    const right = new THREE.Vector3();
    const forward = new THREE.Vector3();

    // Get the forward and right directions based on the camera's rotation
    camera.getWorldDirection(forward);
    forward.y = 0; // Keep the movement horizontal
    forward.normalize();

    right.crossVectors(forward, camera.up).normalize();

    // Move based on active keys
    if (activeKeys.forward) direction.add(forward);
    if (activeKeys.backward) direction.sub(forward);
    if (activeKeys.left) direction.sub(right);
    if (activeKeys.right) direction.add(right);

    // Apply movement
    direction.normalize().multiplyScalar(speed);
    camera.position.add(direction);
};

// Add keyboard event listeners for WASD keys
window.addEventListener('keydown', (event) => {
    switch (event.key.toLowerCase()) {
        case 'w':
            activeKeys.forward = true;
            break;
        case 's':
            activeKeys.backward = true;
            break;
        case 'a':
            activeKeys.left = true;
            break;
        case 'd':
            activeKeys.right = true;
            break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key.toLowerCase()) {
        case 'w':
            activeKeys.forward = false;
            break;
        case 's':
            activeKeys.backward = false;
            break;
        case 'a':
            activeKeys.left = false;
            break;
        case 'd':
            activeKeys.right = false;
            break;
    }
});

// Mouse controls for swiping
let isMouseDragging = false;
let previousMousePosition = { x: 0, y: 0 };

const onMouseDown = (event) => {
    isMouseDragging = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
};

const onMouseUp = () => {
    isMouseDragging = false;
};

const onMouseMove = (event) => {
    if (isMouseDragging) {
        const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y,
        };

        const rotationSpeed = 0.005;
        cameraEuler.y += deltaMove.x * rotationSpeed;
        cameraEuler.x += deltaMove.y * rotationSpeed;

        cameraEuler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraEuler.x));

        cameraQuaternion.setFromEuler(cameraEuler);
        camera.quaternion.copy(cameraQuaternion);

        previousMousePosition = { x: event.clientX, y: event.clientY };
    }
};

// Touch controls for swiping
let isTouchDragging = false;
let previousTouchPosition = { x: 0, y: 0 };

const onTouchStart = (event) => {
    isTouchDragging = true;
    previousTouchPosition = { x: event.touches[0].clientX, y: event.touches[0].clientY };
};

const onTouchEnd = () => {
    isTouchDragging = false;
};

const onTouchMove = (event) => {
    if (isTouchDragging) {
        const currentX = event.touches[0].clientX;
        const currentY = event.touches[0].clientY;

        const deltaMove = {
            x: currentX - previousTouchPosition.x,
            y: currentY - previousTouchPosition.y,
        };

        const rotationSpeed = 0.005;
        cameraEuler.y += deltaMove.x * rotationSpeed;
        cameraEuler.x += deltaMove.y * rotationSpeed;

        cameraEuler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraEuler.x));

        cameraQuaternion.setFromEuler(cameraEuler);
        camera.quaternion.copy(cameraQuaternion);

        previousTouchPosition = { x: currentX, y: currentY };
    }
};

// Add event listeners for mouse and touch controls
renderer.domElement.addEventListener('mousedown', onMouseDown);
renderer.domElement.addEventListener('mouseup', onMouseUp);
renderer.domElement.addEventListener('mousemove', onMouseMove);

renderer.domElement.addEventListener('touchstart', onTouchStart);
renderer.domElement.addEventListener('touchend', onTouchEnd);
renderer.domElement.addEventListener('touchmove', onTouchMove);

renderer.domElement.addEventListener('click', (event) => {
    if (!isMouseDragging) checkIntersection(event);
});


// Function to resize the renderer to fit its container
function resizeRendererToDisplaySize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    const needResize = renderer.domElement.width !== width || renderer.domElement.height !== height;
    if (needResize) {
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}

// Add resize event listener
window.addEventListener('resize', resizeRendererToDisplaySize);

// Animation loop
function animate() {
    resizeRendererToDisplaySize();
    requestAnimationFrame(animate);
    movePlayer();
    renderer.render(scene, camera);
}
animate();

// Add sphere interaction for creating ellipses
const balls = [];
const gravity = 0.15;
const bounceHeight = -4; // Initial velocity for upward bounce
const horizontalSpeedRange = 1.8; // Maximum horizontal speed in either direction

class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dy = bounceHeight; // Start with upward velocity
        this.dx = (Math.random() - 0.5) * horizontalSpeedRange * 1.3; // Random horizontal speed
        this.createdAt = Date.now(); // Timestamp when ball is created
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update(canvas, ctx) {
        this.dy += gravity; // Apply gravity
        this.y += this.dy;
        this.x += this.dx;

        // Bounce off the bottom
        if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
            this.dy *= -0.4; // Reverse vertical velocity with energy loss
        }

        // Bounce off the sides
        if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
            this.dx *= -1; // Reverse horizontal direction
        }

        this.draw(ctx);
    }

    isExpired() {
        return Date.now() - this.createdAt > 1300; // Ball expires after 2 seconds
    }
}

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.pointerEvents = 'none'; // Ignore clicks on the canvas
document.body.appendChild(canvas);

const createEllipse = (x, y) => {
    const radius = 15;
    const color = `hsl(${Math.random() * 360}, 60%, 70%)`;
    balls.push(new Ball(x, y, radius, color));
};

const animateBalls = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = balls.length - 1; i >= 0; i--) {
        const ball = balls[i];
        if (ball.isExpired()) {
            balls.splice(i, 1); // Remove expired balls
        } else {
            ball.update(canvas, ctx);
        }
    }
    requestAnimationFrame(animateBalls);
};

animateBalls();

const makeQuestionBox = () => {
    // 이미 박스가 존재하면 생성하지 않음
    if (document.querySelector('.question-box')) return;

    // main-page 요소 찾기
    const mainPage = document.querySelector('.main-page');
    if (!mainPage) {
        console.error("main-page 요소를 찾을 수 없습니다.");
        return;
    }

    // 새로 박스 생성
    const box = document.createElement('div');
    box.className = 'question-box';
    box.style.position = 'absolute';
    box.style.left = '40px';
    box.style.top = '122px';
    box.style.width = '295px';
    box.style.height = '253px';
    box.style.backgroundImage = 'url("/obfuscate.png")'; // 이미지 경로 설정
    box.style.backgroundRepeat = 'no-repeat';
    box.style.backgroundSize = 'contain';
    box.style.border = '1px solid #ccc';
    box.style.borderRadius = '5px';
    box.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
    box.style.zIndex = '1000';
    box.style.position = 'absolute';

    // 닫기 버튼 생성
    const closeButton = document.createElement('button');
    closeButton.textContent = '✖';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.color = '#333';
    closeButton.style.fontSize = '16px';
    closeButton.style.cursor = 'pointer';

    // 닫기 버튼 클릭 시 박스 제거
    closeButton.addEventListener('click', () => {
        box.remove();
    });

    // 박스에 닫기 버튼 추가
    box.appendChild(closeButton);

    // main-page에 박스 추가
    mainPage.appendChild(box);
};

const checkIntersection = (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width * 2 - 1;
    const y = -(event.clientY - rect.top) / rect.height * 2 + 1;

    const mouse = new THREE.Vector2(x, y);

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    intersects.forEach(intersect => {
        if (intersect.object.name === 'Sphere026') {
            console.log('Sphere.026 clicked or touched.');
            createEllipse(event.clientX, event.clientY);
        }

        if (intersect.object.name === 'Cube002') {
            console.log('Cube002 clicked or touched.');
            makeQuestionBox(); // 박스 생성
        }
    });
};

// 특정 버튼 요소 가져오기 (유니크한 변수명 사용)
const navigateToMemPageButton = document.getElementById('wg_a_option5');

if (navigateToMemPageButton) {
    // 클릭 이벤트 리스너 추가
    navigateToMemPageButton.addEventListener('click', () => {
        // CasualWordMem1.html로 이동
        window.location.href = 'CasualWordMem1.html';
    });
} else {
    console.error("버튼 요소를 찾을 수 없습니다: #wg_a_option5");
}

