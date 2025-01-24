// script-main-nav.js

document.addEventListener("DOMContentLoaded", () => {
    const mainButton = document.querySelector(".mainbutton");
    const mainButtonExpand = document.querySelector(".mainbutton_expand");
    const buttonTos = document.querySelectorAll(".button_to");

    let isHidden = true; // 현재 상태 추적 (true: 숨김, false: 표시)

    // 초기 상태 설정
    mainButtonExpand.style.clipPath = "circle(0% at 50% 50%)"; // 중앙에서 완전히 숨김
    mainButtonExpand.style.transition = "clip-path 0.5s ease"; // 닦아내기 애니메이션

    buttonTos.forEach(button => {
        button.style.opacity = "0"; // 버튼 숨김
        button.style.transform = "scale(0.8)"; // 축소된 상태
        button.style.transition = "opacity 0.5s ease, transform 0.5s ease"; // 애니메이션 설정
    });

    // mainButton 클릭 이벤트
    mainButton.addEventListener("click", () => {
        if (isHidden) {
            // 나타나는 애니메이션
            mainButtonExpand.style.clipPath = "circle(75% at 50% 50%)"; // 중앙에서 바깥으로 확장
            buttonTos.forEach(button => {
                button.style.opacity = "1"; // 버튼 나타남
                button.style.transform = "scale(1)"; // 원래 크기
            });

            // 애니메이션이 끝난 후 최종 상태 설정
            setTimeout(() => {
                mainButtonExpand.style.clipPath = "inset(0 0 18% 0)"; // 최종 상태로 고정
            }, 155); // clip-path 애니메이션 시간(0.5s) 이후 적용
        } else {
            // 사라지는 애니메이션
            mainButtonExpand.style.clipPath = "circle(0% at 50% 50%)"; // 중앙으로 축소
            buttonTos.forEach(button => {
                button.style.opacity = "0"; // 버튼 숨김
                button.style.transform = "scale(0.8)"; // 축소
            });

            // 사라질 때 최종 상태는 숨김
            setTimeout(() => {
                mainButtonExpand.style.clipPath = "circle(0% at 50% 50%)"; // 초기 상태 유지
            }, 500);
        }
        isHidden = !isHidden; // 상태 반전
    });



    // 버튼별 클릭 이벤트
    document.getElementById("mine_to").addEventListener("click", () => {
        window.location.href = "minefield.html";
    });

    document.getElementById("inven_to").addEventListener("click", () => {
        window.location.href = "inventory.html";
    });

    document.getElementById("crevasse_to").addEventListener("click", () => {
        window.location.href = "crevasse.html";
    });

    document.getElementById("raid_to").addEventListener("click", () => {
        window.location.href = "inopyraid.html";
    });
});
