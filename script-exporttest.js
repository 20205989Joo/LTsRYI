// 기본 Three.js 설정
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 조명 설정
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);

// 애니메이션 믹서 변수 선언
let mixer; 

// GLTF 모델 로드
const loader = new THREE.GLTFLoader();
loader.load(
  'byuri_flame_texture_comp.gltf',
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    // 애니메이션이 포함된 경우 처리
    if (gltf.animations && gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(model);
      const action = mixer.clipAction(gltf.animations[0]); // 첫 번째 애니메이션 실행
      action.play();
    }

    console.log('Model and animations loaded:', gltf);
  },
  (xhr) => {
    console.log(`Loading model: ${(xhr.loaded / xhr.total) * 100}%`);
  },
  (error) => {
    console.error('Error loading model:', error);
  }
);

// 카메라 위치 설정
// 카메라 위치를 X축 기준으로 설정
camera.position.set(5, 0, 0); // X축 양의 방향으로 이동
camera.up.set(0, 1, 0);       // Y축을 위쪽으로 설정 (기본값)
camera.lookAt(0, 0, 0);       // 원점을 바라보도록 설정

// 애니메이션 루프
function animate() {
  requestAnimationFrame(animate);

  // 애니메이션 업데이트
  if (mixer) {
    const delta = clock.getDelta();
    mixer.update(delta);
  }

  renderer.render(scene, camera);
}

const clock = new THREE.Clock(); // 시간 계산용 시계
animate();
