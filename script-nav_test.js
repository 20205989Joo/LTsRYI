// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
renderer.setClearColor(0x000000, 0); // 투명도 0으로 설정
document.body.appendChild(renderer.domElement);

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

// Add sphere interaction for creating ellipses
const createEllipse = (x, y) => {
    const ellipse = document.createElement('div');
    ellipse.style.position = 'absolute';
    ellipse.style.width = '20px';
    ellipse.style.height = '10px';
    ellipse.style.backgroundColor = 'white';
    ellipse.style.borderRadius = '50%';
    ellipse.style.left = `${x - 10}px`;
    ellipse.style.top = `${y - 5}px`;
    ellipse.style.transition = 'top 0.5s ease-out';
    document.body.appendChild(ellipse);

    setTimeout(() => {
        ellipse.style.top = `${window.innerHeight - 20}px`;
    }, 50);

    setTimeout(() => {
        document.body.removeChild(ellipse);
    }, 1000);
};

const checkIntersection = (event) => {
    const x = event.touches ? event.touches[0].clientX : event.clientX;
    const y = event.touches ? event.touches[0].clientY : event.clientY;

    const mouse = new THREE.Vector2(
        (x / renderer.domElement.clientWidth) * 2 - 1,
        -(y / renderer.domElement.clientHeight) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    intersects.forEach(intersect => {
        if (intersect.object.name === 'Sphere026') {
            console.log('Sphere.026 clicked or touched.');
            createEllipse(x, y);
        }
    });
};

renderer.domElement.addEventListener('mousedown', onMouseDown);
renderer.domElement.addEventListener('mouseup', onMouseUp);
renderer.domElement.addEventListener('mousemove', onMouseMove);

renderer.domElement.addEventListener('touchstart', onTouchStart);
renderer.domElement.addEventListener('touchend', onTouchEnd);
renderer.domElement.addEventListener('touchmove', onTouchMove);

renderer.domElement.addEventListener('click', (event) => {
    if (!isMouseDragging) checkIntersection(event);
});

function animate() {
    requestAnimationFrame(animate);
    movePlayer();
    renderer.render(scene, camera);
}
animate();
