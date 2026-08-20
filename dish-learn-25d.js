(async function () {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("id") || "";
  const routingKey = params.get("key") || "quiz_Words_A1_Day1";
  const dishQuizKey = params.get("dishQuizKey") || "Vocabulary_Words_A1_Day1_Lesson1_v1";

  function readStoredQuizResult(quizKey) {
    const key = String(quizKey || "").trim();
    if (!key) return null;

    try {
      const rawMap = localStorage.getItem("QuizResultsMap");
      const map = rawMap ? JSON.parse(rawMap) : {};
      if (map && typeof map === "object" && map[key]) return map[key];
    } catch (_) {}

    try {
      const raw = localStorage.getItem("QuizResults");
      const parsed = raw ? JSON.parse(raw) : null;
      const parsedKey = String(parsed?.quiztitle || parsed?.quizTitle || "").trim();
      if (parsedKey === key) return parsed;
    } catch (_) {}

    return null;
  }

  function hasStage1Ready(result) {
    if (result?.stage1 && hasStage1Ready(result.stage1)) return true;
    if (!result || result.teststatus !== "stage1") return false;
    if (result.stage && result.stage !== "dish-quiz1") return false;
    if (result.canSubmit === true) return true;
    const rows = Array.isArray(result.testspecific) ? result.testspecific : [];
    if (!rows.length) return false;
    const correct = rows.filter(row => row && row.correct).length;
    return Math.round((correct / rows.length) * 100) >= 80;
  }

  const levelMatch = routingKey.match(/_([ABC][12])_/i);
  const dayMatch = routingKey.match(/Day(\d+)/i);
  const level = levelMatch ? levelMatch[1].toUpperCase() : "A1";
  const dayNo = dayMatch ? Number(dayMatch[1]) : 1;
  const quizTarget = () =>
    hasStage1Ready(readStoredQuizResult(dishQuizKey))
      ? `dish-quiz2-25d.html?id=${encodeURIComponent(userId)}&key=${encodeURIComponent(dishQuizKey)}&level=${encodeURIComponent(level)}&day=${encodeURIComponent(dayNo)}`
      : `dish-quiz-25d.html?id=${encodeURIComponent(userId)}&key=${encodeURIComponent(dishQuizKey)}`;

  const workbookFile = `${level}.xlsx`;
  const statusEl = document.getElementById("status");
  const mainEl = document.getElementById("main");
  const dayTitleEl = document.getElementById("day-title");
  const learnContentEl = document.getElementById("learn-content");
  const maskBtn = document.getElementById("mask-btn");
  if (dayTitleEl) dayTitleEl.textContent = `Day ${dayNo}`;

  let isMeaningHidden = false;
  let hasShownQuickTip = false;

  function openQuizWithRetakeGate() {
    if (
      window.DishRetakeLock?.showLockPopup?.({
        quizKey: dishQuizKey,
        studyLabel: "Keep studying",
        onStudy: () => {}
      })
    ) {
      return;
    }

    window.location.href = quizTarget();
  }

  function setMeaningHidden(hidden) {
    isMeaningHidden = !!hidden;
    if (learnContentEl) {
      learnContentEl.classList.toggle("hide-all", isMeaningHidden);
      if (!isMeaningHidden) {
        learnContentEl
          .querySelectorAll(".card.hide-meaning-local, .card.hide-translation-local")
          .forEach(card => {
            card.classList.remove("hide-meaning-local", "hide-translation-local");
          });
      }
    }
    if (maskBtn) {
      maskBtn.textContent = isMeaningHidden ? "뜻 보기" : "뜻 가리기";
      maskBtn.setAttribute("aria-pressed", String(isMeaningHidden));
      maskBtn.classList.toggle("active", isMeaningHidden);
    }
  }

  function toggleMeaningHidden() {
    setMeaningHidden(!isMeaningHidden);
  }

  function showQuickMeaningTip() {
    if (hasShownQuickTip) return;
    hasShownQuickTip = true;

    const target = mainEl?.querySelector(".card .meaning");
    if (!target) return;

    const tip = document.createElement("div");
    tip.className = "quick-tip";
    tip.textContent = "Tap to hide";
    document.body.appendChild(tip);

    const place = () => {
      const targetRect = target.getBoundingClientRect();
      const tipRect = tip.getBoundingClientRect();
      const margin = 8;

      let left = targetRect.left + targetRect.width / 2 - tipRect.width / 2;
      left = Math.max(margin, Math.min(window.innerWidth - tipRect.width - margin, left));

      let top = targetRect.top - tipRect.height - 10;
      top = Math.max(margin, top);

      tip.style.left = `${Math.round(left)}px`;
      tip.style.top = `${Math.round(top)}px`;
    };

    place();
    requestAnimationFrame(() => {
      tip.classList.add("show");
    });

    setTimeout(() => {
      tip.classList.remove("show");
      tip.classList.add("hide");
    }, 900);

    setTimeout(() => {
      tip.remove();
      window.removeEventListener("resize", place);
    }, 1300);

    window.addEventListener("resize", place, { passive: true });
  }

  function parseDayNumber(raw) {
    if (raw === null || raw === undefined) return null;
    const digits = String(raw).replace(/[^0-9]/g, "");
    if (!digits) return null;
    const number = Number(digits);
    return Number.isFinite(number) ? number : null;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  try {
    const response = await fetch(workbookFile, { cache: "no-store" });
    if (!response.ok) throw new Error(`Workbook load failed: ${response.status}`);

    const buffer = await response.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    const selected = rows
      .filter(row => parseDayNumber(row["Day"]) === dayNo)
      .slice(0, 20);

    if (statusEl) {
      statusEl.textContent = `${level} Day ${dayNo} · ${selected.length} cards`;
    }

    if (selected.length === 0) {
      mainEl.innerHTML = '<div class="card"><div class="word-title">No cards found.</div></div>';
      return;
    }

    selected.forEach((row, index) => {
      if (index > 0) {
        const divider = document.createElement("div");
        divider.className = "vine-divider";
        mainEl.appendChild(divider);
      }

      const card = document.createElement("div");
      const word = String(row["Word"] || "").trim();
      const wordLength = word.replace(/[^A-Za-z]/g, "").length;
      const wordSizeClass = wordLength >= 13
        ? " is-long is-very-long"
        : wordLength >= 10
          ? " is-long"
          : "";
      card.className = "card";
      card.innerHTML = `
        <div class="card-watermark">${index + 1}</div>
        <div class="card-top">
          <div class="word-wrap">
            <div class="word-title${wordSizeClass}">${escapeHtml(word)}</div>
          </div>
          <div class="meaning">${escapeHtml(row["Korean Meaning"])}</div>
        </div>
        <div class="pos">(${escapeHtml(row["Part of Speech"])})</div>
        <div class="example-block">
          <div class="example-en">${escapeHtml(row["Example Sentence"])}</div>
          <div class="example-kr">${escapeHtml(row["예문"])}</div>
        </div>
      `;
      mainEl.appendChild(card);
    });

    setTimeout(showQuickMeaningTip, 140);
  } catch (error) {
    console.error(error);
    if (statusEl) statusEl.textContent = "Could not load cards.";
    mainEl.innerHTML = '<div class="card"><div class="word-title">Check the workbook file.</div></div>';
  }

  document.getElementById("back-btn")?.addEventListener("click", () => {
    history.back();
  });

  maskBtn?.addEventListener("click", toggleMeaningHidden);

  mainEl?.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const meaningEl = target.closest(".meaning");
    if (meaningEl) {
      const card = meaningEl.closest(".card");
      if (card) card.classList.toggle("hide-meaning-local");
      return;
    }

    const translationEl = target.closest(".example-kr");
    if (translationEl) {
      const card = translationEl.closest(".card");
      if (card) card.classList.toggle("hide-translation-local");
    }
  });

  document.getElementById("quiz-btn")?.addEventListener("click", () => {
    openQuizWithRetakeGate();
  });
})();
