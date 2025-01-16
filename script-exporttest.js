// 병렬적으로 3개씩 셀에 Scene 추가
async function batchLoadScene(modelPath, batchSize = 3) {
    const totalCells = 12;
    for (let i = 0; i < totalCells; i += batchSize) {
        const batch = [];
        for (let j = 0; j < batchSize && i + j < totalCells; j++) {
            batch.push(new Promise((resolve) => {
                createSceneInCell(`cell${i + j + 1}`, modelPath, resolve);
            }));
        }
        await Promise.all(batch); // 한 번에 batchSize 개의 셀을 로드
    }
}

function createSceneInCell(containerId, modelPath, onComplete) {
    const container = document.getElementById(containerId);

    // Scene, Camera, Renderer 생성
    const scene = new THREE.Scene();
    const aspect = container.clientWidth / container.clientHeight;
    const d = 2; // 직교 카메라 뷰 크기
    const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 0.1, 1000);
    camera.position.set(0, 0, 20);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 조명
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    scene.add(light);

    // GLTF 모델 로드
    const loader = new THREE.GLTFLoader();
    loader.load(modelPath, (gltf) => {
        const model = gltf.scene;
        model.scale.set(1, 1, 1); // 크기 설정
        model.rotation.set(0, 4.7, 0); // 정면 보기
        scene.add(model);

        // 애니메이션
        const mixer = new THREE.AnimationMixer(model);
        mixer.clipAction(gltf.animations[0]).play();

        // 애니메이션 및 렌더링
        const clock = new THREE.Clock();
        const animate = () => {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();
            mixer.update(delta);
            renderer.render(scene, camera);
        };
        animate();

        // 모델 로드 완료 후 다음으로 넘어감
        if (onComplete) onComplete();
    });
}

// GLTF 파일 크기 확인
const loader = new THREE.FileLoader();
loader.load('byuri_multi_actions_test.gltf', (data) => {
    const sizeInBytes = new Blob([data]).size;
    const sizeInKB = (sizeInBytes / 1024).toFixed(2);
    console.log(`GLTF 파일 크기: ${sizeInKB} KB`);
});

// 3개씩 병렬로 모델 로드 실행
const modelPath = 'byuri_multi_actions_test.gltf';
batchLoadScene(modelPath, 3);
