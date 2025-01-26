// 기본 Three.js 설정
function createSceneInCorkFrame(className, modelPath) {
    // 'corkframe' 클래스를 가진 DOM 요소를 가져옵니다.
    const container = document.querySelector(`.${className}`);
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Three.js Renderer 생성
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.id = 'corkframe-canvas';
    renderer.domElement.style.zIndex = '30';
    container.appendChild(renderer.domElement);

    // Scene, Camera 생성
    const scene = new THREE.Scene();
    const aspect = width / height;
    const d = 6; // 직교 카메라 크기
    const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 0.1, 1000);
    camera.position.set(0, 0, 20);
    camera.lookAt(0, 0, 0);

    // 조명 추가
    const light = new THREE.DirectionalLight(0xffffff, 0.1);
    light.position.set(5, 10, 7.5);
    scene.add(light);

    // GLTF 모델 로드 및 복제
    const loader = new THREE.GLTFLoader();
    loader.load(modelPath, (gltf) => {
    const baseModel = gltf.scene;

    // 같은 모델을 여러 개 복사하여 배치
    const rows = 2; // 행의 수
    const cols = 4; // 열의 수
    const spacingX = 5.2; // 좌우 간격
    const spacingY = 5.7; // 상하 간격

    const mixers = []; // 믹서를 배열로 저장하여 각 모델에 독립적인 애니메이션 추가

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const model = THREE.SkeletonUtils.clone(baseModel);
            model.position.set(
                col * spacingX - (cols - 1) * spacingX / 2, // X축 위치
                row * spacingY - (rows - 1) * spacingY / 2, // Y축 위치
                0 // Z축 위치
            );
            model.scale.set(1, 1, 1);
            model.rotation.set(0, -Math.PI / 2, 0);
            scene.add(model);

            const mixer = new THREE.AnimationMixer(model);
            const clip = gltf.animations[0]; // 첫 번째 애니메이션만 실행
            mixer.clipAction(clip).play();
            mixers.push(mixer);
        }
    }

    // 애니메이션 및 렌더링 루프
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        mixers.forEach((mixer) => mixer.update(delta));
        renderer.render(scene, camera);
    }
    animate();
});

}

// 'corkframe' 클래스 안에 모델 렌더링
createSceneInCorkFrame('corkframe', 'byuri_multi_actions_test.gltf');

function createSceneInMainCharacterWindow(className, modelPath) {
    const container = document.querySelector(`.${className}`);
    const width = container.clientWidth;
    const height = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0.4);
    renderer.setSize(width, height);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.id = 'main-character-canvas';
    renderer.domElement.style.zIndex = '30';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(-0.5, -0, 4);
    camera.lookAt(0, -0.5, 0);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    scene.add(light);

    const loader = new THREE.GLTFLoader();
    loader.load(modelPath, (gltf) => {
        const model = gltf.scene;
        model.scale.set(1, 1, 1);
        model.rotation.set(0, -Math.PI / 2, 0);
        scene.add(model);

        const mixers = [];
        const mixer = new THREE.AnimationMixer(model);
        const clip = gltf.animations[0];
        mixer.clipAction(clip).play();
        mixers.push(mixer);

        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();
            mixers.forEach((mixer) => mixer.update(delta));
            renderer.render(scene, camera);
        }
        animate();
    });
}


// 'main_character_window' 클래스 안에 모델 렌더링
createSceneInMainCharacterWindow('main_character_window', 'byuri_multi_actions_test.gltf');
