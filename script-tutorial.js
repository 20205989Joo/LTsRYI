// script-tutorial.js

document.addEventListener("DOMContentLoaded", () => {
    // 현재 페이지를 index로 인식하고, 튜토리얼 오버레이 생성
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split("/").pop().replace(".html", "");
  
    // 설정 데이터 관리
    const tutorialConfig = {
      index: [
        { 
          x: "49%", y: "83%", size: "150px", 
          dialogOffsetX: 2, dialogOffsetY: -200, 
          characterOffsetX: -140, characterOffsetY:-180, 
          dialogContent: "Tutorial Overlay : 작성중",
          order: 1 
        },
      ],
      "main-nav": [
        { 
          x: "50%", y: "80%", size: "100px", 
          dialogOffsetX: 20, dialogOffsetY: -150, 
          characterOffsetX: -30, characterOffsetY: 50, 
          dialogContent: "Navigation을 열고, Crevasse (오른쪽)을 누릅니다.",
          order: 1 
        },
        { 
          x: "70%", y: "60%", size: "120px", 
          dialogOffsetX: 20, dialogOffsetY: -50, 
          characterOffsetX: -30, characterOffsetY: 50, 
          dialogContent: "This is the next step.",
          order: 2 
        },
      ],
    };
  
    if (tutorialConfig[currentPage]) {
      createFocusCircle(tutorialConfig[currentPage]);
      createNextButton();
      createDialogAndCharacter(tutorialConfig[currentPage]);
    }
  });
  
  let currentFocusIndex = 0; // 현재 포커스 순서를 추적
  
  function createFocusCircle(focusAreas) {
    const focusCircle = document.createElement("div");
    focusCircle.id = "focus-circle";
    focusCircle.style.position = "fixed";
    focusCircle.style.borderRadius = "50%";
    focusCircle.style.backgroundColor = "rgba(0, 0, 0, 0.1)"; // 외부 그림자처럼 어두운 영역
    focusCircle.style.boxShadow = "0 0 0 9999px rgba(0, 0, 0, 0.7)"; // 바깥 그림자 처리
    focusCircle.style.pointerEvents = "none"; // 포커스 내부 클릭 가능하도록 설정
    focusCircle.style.zIndex = "1000";
    focusCircle.style.opacity = "0"; // 초기 투명도 설정
    document.body.appendChild(focusCircle);
  

      // 페이드 인 효과
  setTimeout(() => {
    focusCircle.style.transition = "opacity 0.7s ease";
    focusCircle.style.opacity = "0.9";
  }, 0);


    // 포커스 영역 업데이트 함수
    function updateFocus(index) {
      if (index >= focusAreas.length) {
        focusCircle.style.display = "none"; // 모든 포커스가 끝나면 숨김
        return;
      }
  
      const { x, y, size } = focusAreas[index];
      focusCircle.style.width = size;
      focusCircle.style.height = size;
      focusCircle.style.top = `calc(${y} - ${parseInt(size) / 2}px)`;
      focusCircle.style.left = `calc(${x} - ${parseInt(size) / 2}px)`;
    }
  
    // 초기 포커스 표시
    updateFocus(currentFocusIndex);
  
    // 다음 포커스로 이동하는 트리거 함수
    window.goToNextFocus = function () {
      currentFocusIndex++;
      updateFocus(currentFocusIndex);
      updateDialogAndCharacter(currentFocusIndex);
    };
  }
  
  function createNextButton() {
    const nextButton = document.createElement("button");
    nextButton.id = "next-button";
    nextButton.textContent = "Next";
    nextButton.style.position = "fixed";
    nextButton.style.top = "10px";
    nextButton.style.right = "10px";
    nextButton.style.padding = "10px 20px";
    nextButton.style.zIndex = "1001";
    nextButton.style.backgroundColor = "#007BFF";
    nextButton.style.color = "white";
    nextButton.style.border = "none";
    nextButton.style.borderRadius = "5px";
    nextButton.style.cursor = "pointer";
    nextButton.addEventListener("click", () => {
      window.goToNextFocus();
    });
    document.body.appendChild(nextButton);
  }
  
  function createDialogAndCharacter(focusAreas) {
    const dialog = document.createElement("div");
    dialog.id = "dialog-box";
    dialog.style.position = "fixed";
    dialog.style.width = "160px";
    dialog.style.height = "60px";
    dialog.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    dialog.style.border = "3px solid rgba(197, 140, 35, 0.63)";
    dialog.style.borderRadius = "10px";
    dialog.style.padding = "10px";
    dialog.style.color = "white";
    dialog.style.zIndex = "1001";
    document.body.appendChild(dialog);

    dialog.style.fontSize = "14px"; // 폰트 크기
    dialog.style.textAlign = "center"; // 텍스트 정렬
  
    const character = document.createElement("div");
    character.id = "character";
    character.style.position = "fixed";
    character.style.width = "50px";
    character.style.height = "50px";
    character.style.backgroundColor = "rgba(0, 0, 255, 0.8)"; // Placeholder character color
    character.style.borderRadius = "50%";
    character.style.zIndex = "1001";
    document.body.appendChild(character);
  
    // 대화창 및 캐릭터 업데이트 함수
    function updateDialogAndCharacter(index) {
      if (index >= focusAreas.length) {
        dialog.style.display = "none";
        character.style.display = "none";
        return;
      }
  
      const { x, y, size, dialogOffsetX, dialogOffsetY, characterOffsetX, characterOffsetY, dialogContent } = focusAreas[index];
  
      const focusX = parseInt(x.replace('%', '')) / 100 * window.innerWidth;
      const focusY = parseInt(y.replace('%', '')) / 100 * window.innerHeight;
  
      dialog.style.top = `${focusY + dialogOffsetY}px`;
      dialog.style.left = `${focusX + dialogOffsetX}px`;
      dialog.textContent = dialogContent;
  
      character.style.top = `${focusY + characterOffsetY}px`;
      character.style.left = `${focusX + characterOffsetX}px`;
    }
  
    // 초기 대화창 및 캐릭터 표시
    updateDialogAndCharacter(currentFocusIndex);
  }
  