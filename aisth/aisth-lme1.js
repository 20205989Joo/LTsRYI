(function () {
  "use strict";

  const PAGE_LABEL = "Aisth LME-1";

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  window.addEventListener("DOMContentLoaded", () => {
    if (window.HermaToastFX) {
      window.HermaToastFX.init({ hostId: "cafe_int", top: 10 });
    }

    wireBackButton();
    renderIntro();
  });

  function wireBackButton() {
    const btn = document.getElementById("back-btn");
    if (!btn) return;
    btn.addEventListener("click", goBack);
  }

  function goBack() {
    if (history.length > 1) {
      history.back();
      return;
    }
    window.location.href = "aisth-round1_leveljump.html";
  }

  function renderIntro() {
    const area = document.getElementById("quiz-area");
    if (!area || !window.LessonIntroPlayer) return;

    const rendered = window.LessonIntroPlayer.render(area, {
      pageLabel: PAGE_LABEL,
      title: "의문사",
      nextLabel: "다음",
      primaryLabel: "돌아가기",
      onPrimary: goBack,
      steps: [
        {
          title: "의문사는 질문에서 비어 있는 자리를 가리키는 말입니다.",
          body: "무엇이 궁금한지 먼저 찍어줍니다.",
          exampleHtml: buildQuestionSlotHtml(),
        },
        {
          title: "궁금한 종류에 따라 의문사가 달라집니다.",
          body: "무엇, 누구, 어디, 언제, 왜, 어떻게를 구분합니다.",
          exampleHtml: buildWhGridHtml(),
        },
        {
          title: "의문사는 답이 들어갈 자리를 먼저 알려주는 신호입니다.",
          body: "질문을 보면 어떤 답을 기다리는지 바로 보입니다.",
          exampleHtml: buildSignalHtml(),
        },
      ],
    });

    if (rendered) {
      const root = area.querySelector(".lip-intro");
      if (root) root.classList.add("aisth-intro-lme1");
    }
  }

  function buildQuestionSlotHtml() {
    return `
      <div class="aisth-lme1-stack">
        <div class="aisth-lme1-sentence">
          <span>I bought</span>
          <span class="aisth-lme1-slot">?</span>
        </div>
        <div class="aisth-lme1-arrow" aria-hidden="true">↓</div>
        <div class="aisth-lme1-chip is-main">what</div>
        <div class="aisth-lme1-note">무엇을 샀는지 묻는 자리</div>
      </div>
    `;
  }

  function buildWhGridHtml() {
    const items = [
      ["what", "무엇"],
      ["who", "누구"],
      ["where", "어디"],
      ["when", "언제"],
      ["why", "왜"],
      ["how", "어떻게"],
    ];
    return `
      <div class="aisth-lme1-grid">
        ${items.map(([word, meaning], index) => `
          <div class="aisth-lme1-pair" style="--lme-delay:${(index * 0.08).toFixed(2)}s;">
            <span class="aisth-lme1-chip">${escapeHtml(word)}</span>
            <span class="aisth-lme1-meaning">${escapeHtml(meaning)}</span>
          </div>
        `).join("")}
      </div>
    `;
  }

  function buildSignalHtml() {
    return `
      <div class="aisth-lme1-stack">
        <div class="aisth-lme1-question-line">
          <span class="aisth-lme1-chip is-main">where</span>
          <span>did you put it?</span>
        </div>
        <div class="aisth-lme1-answer-line">
          <span class="aisth-lme1-slot">장소</span>
          <span>를 기다리는 질문</span>
        </div>
      </div>
    `;
  }
})();