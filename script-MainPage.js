// Updated script-mainpage.js to reflect HTML changes

// 각 버튼 클릭 시 추가될 모듈들
const modules = {
    "rcbutton": { className: "rcmodule", label: "독해 연습" }, // 독해 연습 모듈
    "wordtestbutton": { className: "wordtestmodule", label: "Word Test" }, // Word Test 모듈
    "lcbutton": { className: "lcmodule", label: "LC" }, // LC 모듈
    "handbutton": { className: "handmodule", label: "Hand" } // Hand 모듈
};

// URL 파라미터를 가져오는 함수
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(window.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// id 파라미터 가져오기
const userId = getUrlParameter('id');

// mp_window에 모듈을 추가하거나 제거하는 함수
function toggleModuleInWindow(buttonId) {
    const moduleInfo = modules[buttonId];
    const windowContainer = document.querySelector('#mp_window');
    const existingModule = document.querySelector(`.${moduleInfo.className}`);

    // 모듈이 이미 존재하면 제거, 그렇지 않으면 추가
    if (existingModule) {
        windowContainer.removeChild(existingModule.parentElement);
    } else {
        // 모듈을 담을 컨테이너 생성 (모듈과 레이블 함께)
        const moduleContainer = document.createElement('div');
        moduleContainer.className = 'module-container';

         // 모듈 자체 생성
         const moduleElement = document.createElement('div');
         moduleElement.className = 'subjectmodule';
         moduleElement.id = buttonId.replace('button', 'module');

        // 레이블 생성 (모듈 내부에 추가)
        const labelElement = document.createElement('div');
        labelElement.className = 'module-label';
        labelElement.innerText = moduleInfo.label;

        // 레이블을 모듈 내부에 추가
        moduleElement.appendChild(labelElement);

        // 모듈을 모듈 컨테이너에 추가
        moduleContainer.appendChild(moduleElement);

        // mp_window에 모듈을 추가
        windowContainer.appendChild(moduleContainer);

        // Word Test 모듈 클릭 시 페이지 이동
        if (buttonId === 'wordtestbutton') {
            moduleElement.addEventListener('click', () => {
                window.location.href = `CasualWordtest1.html?id=${userId}`;
            });
        }
    }
}

// 각 버튼에 클릭 이벤트 추가
Object.keys(modules).forEach(buttonId => {
    document.querySelector(`#${buttonId}`).addEventListener('click', () => toggleModuleInWindow(buttonId));
});
