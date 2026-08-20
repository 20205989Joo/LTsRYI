(function () {
  const STAGES = [
    { id: "learn", code: "MEM", label: "MEMORIZE", prompt: "외워봅시다!" },
    { id: "quiz1", code: "Q1", label: "QUIZ 1", prompt: "뜻을 맞혀봅시다!" },
    { id: "quiz2", code: "Q2", label: "QUIZ 2", prompt: "단어를 조립해봅시다!" }
  ];
  const STAGE_VISIT_MESSAGES = {
    learn: "1\uB2E8\uACC4 \u00B7 \uB2E8\uC5B4\uC640 \uB73B\uC744 \uC678\uC6CC\uC694",
    quiz1: "2\uB2E8\uACC4 \u00B7 \uC54C\uB9DE\uC740 \uB73B\uC744 \uACE8\uB77C\uC694",
    quiz2: "3\uB2E8\uACC4 \u00B7 \uCCA0\uC790\uB97C \uC870\uB9BD\uD574\uC694"
  };

  function currentStage() {
    const explicit = String(document.body?.dataset.wordStage || "").trim();
    if (STAGES.some(item => item.id === explicit)) return explicit;

    const file = String(window.location.pathname || "").split("/").pop().toLowerCase();
    if (file.includes("quiz2")) return "quiz2";
    if (file.includes("quiz")) return "quiz1";
    return "learn";
  }

  function readResult(key) {
    const normalizedKey = String(key || "").trim();
    try {
      const rawMap = localStorage.getItem("QuizResultsMap");
      const map = rawMap ? JSON.parse(rawMap) : {};
      if (normalizedKey && map && typeof map === "object" && map[normalizedKey]) {
        return map[normalizedKey];
      }
    } catch (_) {}

    try {
      const raw = localStorage.getItem("QuizResults");
      const result = raw ? JSON.parse(raw) : null;
      const resultKey = String(result?.quiztitle || result?.quizTitle || "").trim();
      if (!normalizedKey || resultKey === normalizedKey) return result;
    } catch (_) {}

    return null;
  }

  function hasStage1(result) {
    if (!result || typeof result !== "object") return false;
    if (result.stage1 && hasStage1(result.stage1)) return true;
    if (result.stage === "dish-quiz2") return true;
    if (result.teststatus === "done" || result.teststatus === "stage2") return true;
    if (result.stage !== "dish-quiz1" && result.teststatus !== "stage1") return false;
    if (result.canSubmit === true) return true;
    if (Number.isFinite(Number(result.score))) return Number(result.score) >= 80;
    const rows = Array.isArray(result.testspecific) ? result.testspecific : [];
    const scoredRows = rows.filter(row => String(row?.source || "").toLowerCase() !== "review");
    const scoreRows = scoredRows.length ? scoredRows : rows;
    if (!scoreRows.length) return false;
    const correct = scoreRows.filter(row => row?.correct).length;
    return Math.round((correct / scoreRows.length) * 100) >= 80;
  }

  function hasStage2(result) {
    if (!result || typeof result !== "object") return false;
    if (result.teststatus === "done") return true;
    if (result.stage === "dish-quiz2" && result.canSubmit === true) return true;
    return result.stage2?.canSubmit === true;
  }

  function readContext() {
    const params = new URLSearchParams(window.location.search);
    const rawKey = params.get("key") || params.get("dishQuizKey") || "";
    const key = rawKey.startsWith("quiz_") ? params.get("dishQuizKey") || rawKey : rawKey;
    const level = params.get("level") || key.match(/_([ABC][12])_/i)?.[1] || "";
    const day = params.get("day") || key.match(/_Day(\d+)/i)?.[1] || "";
    return {
      params,
      key,
      label: [level && String(level).toUpperCase(), day && `DAY ${String(day).replace(/\D/g, "")}`]
        .filter(Boolean)
        .join(" · ") || "STUDY PATH"
    };
  }

  function hasStage1Failure(result) {
    if (!result || typeof result !== "object") return false;
    if (result.stage1) return hasStage1Failure(result.stage1);
    const isStage1Result = result.stage === "dish-quiz1" || result.teststatus === "stage1";
    return isStage1Result && !hasStage1(result);
  }

  function hasActiveRetakeLock(key) {
    const normalizedKey = String(key || "").trim();
    if (!normalizedKey) return false;
    try {
      const raw = localStorage.getItem("DishQuizRetakeLocks");
      const locks = raw ? JSON.parse(raw) : {};
      return Number(locks?.[normalizedKey]?.until || 0) > Date.now();
    } catch (_) {
      return false;
    }
  }

  function isQuiz1QuestionTimerRunning(current) {
    if (current !== "quiz1") return false;
    return Boolean(document.querySelector("#quiz-area #timer-bar"));
  }

  function stageState(stage, current, result, key) {
    if (stage === "learn") {
      return current === "learn" ? "is-current" : "is-done";
    }
    if (stage === "quiz1") {
      if (hasStage1(result)) return "is-done";
      if (isQuiz1QuestionTimerRunning(current)) return "is-timed";
      if (hasActiveRetakeLock(key)) return "is-failed";
      if (current === "quiz1") return "is-current";
      return "is-upcoming";
    }
    if (stage === "quiz2" && hasStage2(result)) return "is-done";
    if (stage === current) return "is-current";
    return "is-upcoming";
  }

  function createTopbar() {
    const main = document.querySelector(".main-page");
    if (!main || main.querySelector(".wordflow-topbar")) return;

    const stage = currentStage();
    const context = readContext();
    const result = readResult(context.key);
    const header = document.createElement("header");
    header.className = "wordflow-topbar cafe25-topbar";
    header.innerHTML = `
      <button class="wf-header-back cafe25-back" type="button" aria-label="Back">‹</button>
      <div class="wf-heading cafe25-heading">
        <div class="wf-stage-track" aria-label="Study progress">
          ${STAGES.map(item => `
            <span class="wf-stage ${stageState(item.id, stage, result, context.key)}" data-stage="${item.id}" aria-label="${item.label}">
              <span class="wf-stage-code">${item.code}</span>
              <span class="wf-stage-dialog" role="status">${STAGE_VISIT_MESSAGES[item.id] || item.prompt}</span>
            </span>
          `).join("")}
        </div>
      </div>
      <div class="wf-header-mark cafe25-mark" aria-hidden="true">W</div>
    `;
    main.insertBefore(header, main.firstChild);
    header.querySelector(".wf-header-back")?.addEventListener("click", () => history.back());
    const stageDialog = header.querySelector(`.wf-stage[data-stage="${stage}"] .wf-stage-dialog`);
    if (stageDialog) {
      window.setTimeout(() => stageDialog.classList.add("is-stage-visit"), 80);
      window.setTimeout(() => stageDialog.classList.add("is-stage-leaving"), 3300);
      window.setTimeout(() => stageDialog.classList.remove("is-stage-visit", "is-stage-leaving"), 3600);
    }
  }

  function refreshStages() {
    const context = readContext();
    const result = readResult(context.key);
    const current = currentStage();
    document.querySelectorAll(".wf-stage").forEach(node => {
      const stage = node.getAttribute("data-stage");
      node.classList.remove("is-current", "is-done", "is-upcoming", "is-failed", "is-timed");
      node.classList.add(stageState(stage, current, result, context.key));
    });
  }

  function syncQuizView() {
    const area = document.getElementById("quiz-area");
    if (!area) return;
    const question = area.querySelector("#timer-bar, .quiz-question-screen");
    area.dataset.wfView = question ? "question" : "intro";
    if (currentStage() === "quiz1") enhanceQuiz1(area);
    if (currentStage() === "quiz2") enhanceQuiz2(area);
  }

  function enhanceQuiz1(area) {
    const timer = area.querySelector("#timer-bar");
    if (!timer) {
      area.classList.remove("is-correct", "is-wrong");
      const card = area.firstElementChild;
      if (!(card instanceof HTMLElement)) return;
      card.classList.add("wf-q1-start");
      card.querySelector(":scope > div:first-child")?.classList.add("wf-q1-start-title");
      card.querySelector("ul")?.classList.add("wf-q1-rules");
      card.querySelector("button.quiz-btn")?.classList.add("wf-q1-start-button");
      card.querySelectorAll("li").forEach(item => emphasizeQuiz1Rule(item));
      const directDivs = Array.from(card.children).filter(node => node.tagName === "DIV");
      directDivs.at(-1)?.classList.add("wf-q1-meta");
      return;
    }

    const directChildren = Array.from(area.children);
    const wordCard = directChildren.find(node => node !== timer && node.tagName === "DIV");
    if (wordCard instanceof HTMLElement && !wordCard.classList.contains("wf-q1-word-card")) {
      const match = wordCard.textContent.trim().match(/^(\d+)\.\s*(.+)$/s);
      const currentNumber = wordCard.dataset.questionCurrent || match?.[1] || "1";
      const totalNumber = wordCard.dataset.questionTotal || currentNumber;
      wordCard.className = "wf-q1-word-card";
      if (match) {
        const index = document.createElement("span");
        index.className = "wf-q1-word-index";
        index.textContent = "WORD";
        const progress = buildQuestionProgress(currentNumber, totalNumber);
        const word = document.createElement("strong");
        word.className = "wf-q1-word";
        word.textContent = match[2];
        wordCard.replaceChildren(index, progress, word);
      }
    }

    if (!timer.closest(".wf-q1-timer-shell")) {
      const shell = document.createElement("div");
      shell.className = "wf-q1-timer-shell";
      const caption = document.createElement("div");
      caption.className = "wf-q1-timer-caption";
      caption.innerHTML = "<span>TIME</span><strong>3 SEC</strong>";
      const track = document.createElement("div");
      track.className = "wf-q1-timer-track";
      timer.before(shell);
      shell.append(caption, track);
      track.appendChild(timer);
    }

    const options = Array.from(area.children).find(node =>
      node instanceof HTMLElement && node.querySelector(":scope > button.quiz-btn")
    );
    if (options instanceof HTMLElement) {
      options.classList.add("wf-q1-options");
      options.querySelectorAll(":scope > button.quiz-btn").forEach((button, index) => {
        button.setAttribute("data-choice", String.fromCharCode(65 + index));
      });
    }

    const feedback = area.querySelector("#feedback");
    if (!feedback) return;
    feedback.classList.add("wf-q1-feedback");
    const text = String(feedback.textContent || "").trim();
    area.classList.toggle("is-correct", text.startsWith("정답"));
    area.classList.toggle("is-wrong", text.startsWith("오답"));

    if (text) {
      const correct = text.startsWith("정답");
      const picked = area.querySelector(".wf-q1-options .is-picked");
      picked?.classList.add(correct ? "is-correct-choice" : "is-wrong-choice");
    }
  }

  function enhanceQuiz2(area) {
    if (area.dataset.wfView === "question") {
      const questionTop = area.querySelector(".question-top");
      if (!(questionTop instanceof HTMLElement) || questionTop.dataset.wfProgress === "true") return;
      questionTop.dataset.wfProgress = "true";
      questionTop.firstElementChild?.classList.add("wf-question-context");
      const countText = String(questionTop.lastElementChild?.textContent || "");
      const countMatch = countText.match(/(\d+)\s*\/\s*(\d+)/);
      if (countMatch) {
        questionTop.lastElementChild?.replaceWith(buildQuestionProgress(countMatch[1], countMatch[2]));
      }
      return;
    }
    if (area.dataset.wfView !== "intro") return;
    const card = area.querySelector(":scope > .start-card");
    if (!(card instanceof HTMLElement) || card.dataset.wfQ2Enhanced === "true") return;
    card.dataset.wfQ2Enhanced = "true";

    const title = card.querySelector(".start-title");
    if (title) title.textContent = "SPELLING SCRAMBLE";

    card.querySelector(".start-stat-grid")?.remove();

    const startButton = card.querySelector("#start-btn, #direct-start-btn");
    if (startButton) startButton.textContent = "PRESS START";
  }

  function buildQuestionProgress(current, total) {
    const progress = document.createElement("div");
    progress.className = "wf-question-progress";
    progress.setAttribute("aria-label", `Current question ${current} of ${total}`);
    progress.innerHTML = `
      <span class="is-current-count">
        <small>CURRENT</small>
        <strong>${String(current).padStart(2, "0")}</strong>
      </span>
      <i aria-hidden="true">/</i>
      <span>
        <small>TOTAL</small>
        <strong>${String(total).padStart(2, "0")}</strong>
      </span>
    `;
    return progress;
  }

  function emphasizeQuiz1Rule(item) {
    if (!(item instanceof HTMLElement) || item.dataset.wfEmphasis === "true") return;
    item.dataset.wfEmphasis = "true";
    const text = String(item.textContent || "");
    const parts = text.split(/(\b30\b|\b20\b|\b10\b|3\uCD08|\uC790\uB3D9 \uC624\uB2F5 \uCC98\uB9AC|current|review)/gi);
    const fragment = document.createDocumentFragment();
    parts.forEach(part => {
      if (!part) return;
      if (/^(\b30\b|\b20\b|\b10\b|3\uCD08|\uC790\uB3D9 \uC624\uB2F5 \uCC98\uB9AC|current|review)$/i.test(part)) {
        const accent = document.createElement("strong");
        accent.className = "wf-q1-rule-accent";
        accent.textContent = part;
        fragment.appendChild(accent);
      } else {
        fragment.appendChild(document.createTextNode(part));
      }
    });
    item.replaceChildren(fragment);
  }

  function showQuiz1AnswerToast(detail) {
    if (currentStage() !== "quiz1") return;
    const area = document.getElementById("quiz-area");
    if (!area) return;
    const correct = detail?.correct === true;
    enhanceQuiz1(area);
    area.querySelector(".wf-q1-answer-toast")?.remove();
    const picked = area.querySelector(".wf-q1-options .is-picked");
    picked?.classList.add(correct ? "is-correct-choice" : "is-wrong-choice");
    const toast = document.createElement("div");
    toast.className = `wf-q1-answer-toast ${correct ? "correct" : "wrong"}`;
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "assertive");
    toast.innerHTML = `
      <strong>${correct ? "✓" : "×"}</strong>
      <span>${correct ? "CORRECT!" : detail?.timedOut ? "TIME OUT!" : "WRONG!"}</span>
    `;
    area.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
  }

  function buildLearnUrl() {
    const context = readContext();
    const params = context.params;
    const userId = params.get("id") || "";
    const key = context.key;
    const parts = key.split("_");
    const subcategory = parts[1] || "Words";
    const level = parts.find(part => /^[ABC][12]$/i.test(part)) || "A1";
    const day = parts.find(part => /^Day\d+$/i.test(part)) || "Day1";
    const routingKey = `quiz_${subcategory}_${String(level).toUpperCase()}_${day}`;
    const next = new URLSearchParams();
    if (userId) next.set("id", userId);
    next.set("key", routingKey);
    if (key) next.set("dishQuizKey", key);
    return `dish-learn-25d.html?${next.toString()}`;
  }

  function patchRetakeRoute() {
    if (!window.DishRetakeLock?.buildStudyUrlFromQuizKey) return;
    window.DishRetakeLock.buildStudyUrlFromQuizKey = function (quizKey, userId) {
      const current = new URL(window.location.href);
      current.searchParams.set("key", quizKey || "");
      if (userId) current.searchParams.set("id", userId);
      return buildLearnUrl();
    };
  }

  function routeStageSubmit(event) {
    const button = event.target instanceof Element ? event.target.closest("#submit-btn") : null;
    if (!button || button.disabled) return;

    const stage = currentStage();
    const context = readContext();
    if (stage === "quiz1") {
      event.preventDefault();
      event.stopImmediatePropagation();
      const next = new URLSearchParams();
      const userId = context.params.get("id") || "";
      const level = context.params.get("level") || context.key.match(/_([ABC][12])_/i)?.[1] || "";
      const day = context.params.get("day") || context.key.match(/_Day(\d+)/i)?.[1] || "";
      if (userId) next.set("id", userId);
      if (context.key) next.set("key", context.key);
      if (level) next.set("level", level);
      if (day) next.set("day", day);
      window.location.replace(`dish-quiz2-25d.html?${next.toString()}`);
      return;
    }

    if (stage === "quiz2") {
      event.preventDefault();
      event.stopImmediatePropagation();
      const next = new URLSearchParams();
      const userId = context.params.get("id") || "";
      if (userId) next.set("id", userId);
      if (context.key) next.set("quizKey", context.key);
      window.location.replace(`homework-tray_v1-25d.html?${next.toString()}`);
    }
  }

  function observeContent() {
    const area = document.getElementById("quiz-area");
    if (!area) return;
    syncQuizView();
    new MutationObserver(() => {
      syncQuizView();
      refreshStages();
    }).observe(area, { childList: true, characterData: true, subtree: true });
  }

  function initialize() {
    createTopbar();
    patchRetakeRoute();
    observeContent();
    refreshStages();
    document.addEventListener("click", routeStageSubmit, true);
    document.addEventListener("click", event => {
      if (currentStage() !== "quiz1") return;
      const button = event.target instanceof Element
        ? event.target.closest('#quiz-area[data-wf-view="question"] .quiz-btn')
        : null;
      if (!button) return;
      document.querySelectorAll(".wf-q1-options .is-picked").forEach(node => node.classList.remove("is-picked"));
      button.classList.add("is-picked");
    }, true);
    window.addEventListener("storage", refreshStages);
    window.addEventListener("pageshow", refreshStages);
    window.addEventListener("dish:result-saved", refreshStages);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
