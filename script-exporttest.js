function createSceneInCell(containerId, modelPath) {
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
    });
  }
  
  // 3x4 셀에 각 Scene 추가
  const modelPath = 'byuri_multi_actions_test.gltf';
  for (let i = 1; i <= 12; i++) {
    createSceneInCell(`cell${i}`, modelPath);
  }
  
  const loader = new THREE.FileLoader();
loader.load('byuri_multi_actions_test.gltf', (data) => {
  const sizeInBytes = new Blob([data]).size;
  const sizeInKB = (sizeInBytes / 1024).toFixed(2);
  console.log(`GLTF 파일 크기: ${sizeInKB} KB`);
});
