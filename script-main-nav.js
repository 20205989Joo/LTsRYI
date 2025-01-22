// script-main-nav.js

document.addEventListener("DOMContentLoaded", () => {
    const mainButton = document.querySelector(".mainbutton");
    const mainButtonExpand = document.querySelector(".mainbutton_expand");
    const buttonTos = document.querySelectorAll(".button_to");

    // 초기 상태: 숨기기
    mainButtonExpand.style.display = "none";
    buttonTos.forEach(button => button.style.display = "none");

    // mainbutton 클릭 이벤트
    mainButton.addEventListener("click", () => {
        const isHidden = mainButtonExpand.style.display === "none";

        // 요소 가시성 토글
        mainButtonExpand.style.display = isHidden ? "block" : "none";
        buttonTos.forEach(button => {
            button.style.display = isHidden ? "block" : "none";
        });
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
