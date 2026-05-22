(function () {
  "use strict";

  const API_URL = "https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app/api/saveHWPlus";
  const SUBCATEGORY = "\uC5F0\uC5B4";
  const DEFAULT_LEVEL = "\uC5F0\uC5B4\uBED4 700";
  const HW_TYPE = "doneinweb";
  const WORKBOOK_FILE = "hommade_salmon_meaningsort_pickup_700_indexed.xlsx";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const els = {
    progress: $("#progress"),
    controls: $(".controls"),
    card: $("#card"),
    questionNo: $("#questionNo"),
    tapHint: $("#tapHint"),
    tokens: $("#tokens"),
    status: $("#status"),
    prevBtn: $("#prevBtn"),
    nextBtn: $("#nextBtn"),
    toast: $("#toast"),
    glossArea: $("#glossArea"),
    studentBox: $(".student-box"),
    studentAnswer: $("#studentAnswer"),
    saveBtn: $("#saveBtn"),
    savedState: $("#savedState"),
    bankList: $("#bank"),
    openDictBtn: $("#openDictBtn"),
    dictPanel: $("#dictPanel"),
    dictFrame: $("#dictFrame"),
    closeDictBtn: $("#closeDictBtn"),
    mobileBankBtn: $("#mobileBankBtn"),
    bankPanel: $("#bankPanel"),
    bankCloseBtn: $("#bankCloseBtn"),
    mobileBankBackdrop: $("#mobileBankBackdrop"),
    frontDaySelect: $("#frontDaySelect"),
    frontStartBtn: $("#frontStartBtn"),
    frontReloadBtn: $("#frontReloadBtn"),
    frontStatus: $("#frontStatus"),
    frontRouteInfo: $("#frontRouteInfo")
  };

  const route = getRouteContext();
  if (!route.hasExplicitDay) {
    bootFrontPage();
    return;
  }
  document.body.classList.remove("front-mode");
  document.body.classList.add("quiz-mode");

  let problems = [];
  let order = [];
  let idx = 0;
  let activeKey = null;
  let bankButtons = [];
  let solvedMap = loadSolved();
  let answerMap = loadAnswers();
  let foundSet = new Set();
  let submittedToday = false;
  let isSubmitting = false;
  let isCheckingSubmission = true;
  let isAdvancing = false;

  boot();

  async function boot() {
    try {
      els.progress.textContent = `Loading ${WORKBOOK_FILE}...`;
      els.tokens.textContent = "Loading...";

      const allItems = await loadWorkbookItems();
      const dayItems = allItems
        .filter((item) => Number(item.day) === route.day)
        .sort((a, b) => Number(a.id) - Number(b.id));

      problems = dayItems.map(normalizeProblem);
      order = problems.map((_, index) => index);
      shuffle(order);

      if (!problems.length) {
        renderFatal(`No salmon data for Day ${route.day}.`);
        return;
      }

      renderBank();
      bindEvents();
      renderTesterControls();
      updateProgress();
      renderCard();
      markUsedBankItems();
      renderSubmitStatus();

      submittedToday = await checkSubmittedToday();
      isCheckingSubmission = false;
      if (submittedToday) {
        setToast("\uC624\uB298\uC740 \uC774\uBBF8 \uC81C\uCD9C\uD588\uC2B5\uB2C8\uB2E4.", "var(--ok)");
      }
      renderSubmitStatus();
    } catch (error) {
      console.error(error);
      renderFatal(`Could not load ${WORKBOOK_FILE}.`);
    }
  }

  async function bootFrontPage() {
    document.body.classList.add("front-mode");
    document.body.classList.remove("quiz-mode");

    if (!els.frontDaySelect || !els.frontStartBtn || !els.frontReloadBtn) return;

    els.frontReloadBtn.addEventListener("click", loadFrontDays);
    els.frontStartBtn.addEventListener("click", openSelectedFrontDay);
    els.frontDaySelect.addEventListener("change", updateFrontStartState);
    await loadFrontDays();
  }

  async function loadFrontDays() {
    setFrontStatus("Loading workbook...", "var(--accent)");
    els.frontStartBtn.disabled = true;
    els.frontDaySelect.innerHTML = '<option value="">Loading...</option>';

    try {
      const allItems = await loadWorkbookItems();
      const days = getAvailableDays(allItems);
      if (!days.length) throw new Error("No Day rows found.");
      renderFrontDays(days);
      setFrontStatus("");
    } catch (error) {
      console.error(error);
      renderFrontDays(Array.from({ length: 36 }, (_, index) => index + 1));
      setFrontStatus("Workbook load failed. Fallback day list is shown.");
    }
  }

  function getAvailableDays(items) {
    return Array.from(new Set(items.map((item) => Number(item.day)).filter((day) => Number.isInteger(day) && day > 0)))
      .sort((a, b) => a - b);
  }

  function renderFrontDays(days) {
    els.frontDaySelect.innerHTML = "";
    days.forEach((day) => {
      const option = document.createElement("option");
      option.value = String(day);
      option.textContent = `Day ${day}`;
      els.frontDaySelect.appendChild(option);
    });

    const selected = days.includes(route.day) ? route.day : days[0];
    els.frontDaySelect.value = String(selected);
    if (els.frontRouteInfo) {
      els.frontRouteInfo.textContent = `${days.length} days available`;
    }
    updateFrontStartState();
  }

  function openSelectedFrontDay() {
    const day = toPositiveInt(els.frontDaySelect.value);
    if (!day) return;

    const target = new URL("salmon1.html", window.location.href);
    new URLSearchParams(window.location.search || "").forEach((value, key) => {
      target.searchParams.set(key, value);
    });
    target.searchParams.set("day", String(day));
    target.searchParams.set("lessonNo", String(day));
    window.location.href = target.toString();
  }

  function updateFrontStartState() {
    els.frontStartBtn.disabled = !toPositiveInt(els.frontDaySelect.value);
  }

  function setFrontStatus(message, color) {
    if (!els.frontStatus) return;
    els.frontStatus.textContent = message || "";
    els.frontStatus.style.color = color || "var(--warn)";
  }

  function getRouteContext() {
    const params = new URLSearchParams(window.location.search || "");
    const dishQuizKey = String(params.get("dishQuizKey") || "");
    const routeQuizKey = String(params.get("key") || "");
    const parsedDay = parseDayFromKey(dishQuizKey) || parseDayFromKey(routeQuizKey);
    const explicitDay = toPositiveInt(params.get("day")) || parsedDay || toPositiveInt(params.get("lessonNo"));
    const day = explicitDay || 1;
    const lessonNo = toPositiveInt(params.get("lessonNo")) || day;
    const level = String(params.get("level") || DEFAULT_LEVEL).trim() || DEFAULT_LEVEL;

    return {
      userId: getCurrentUserId(),
      subcategory: String(params.get("subcategory") || SUBCATEGORY).trim() || SUBCATEGORY,
      level,
      day,
      lessonNo,
      hasExplicitDay: !!explicitDay,
      routeQuizKey,
      dishQuizKey
    };
  }

  function getCurrentUserId() {
    return String(new URLSearchParams(window.location.search || "").get("id") || "").trim();
  }

  function toPositiveInt(value) {
    const n = Number(value);
    return Number.isInteger(n) && n > 0 ? n : null;
  }

  function parseDayFromKey(value) {
    const match = String(value || "").match(/Day(\d+)/i);
    return match ? toPositiveInt(match[1]) : null;
  }

  async function loadWorkbookItems() {
    if (!window.XLSX) {
      throw new Error("XLSX library is not loaded.");
    }

    const response = await fetch(`${WORKBOOK_FILE}?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load ${WORKBOOK_FILE} (${response.status})`);
    }

    const buffer = await response.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheetName = workbook.Sheets.SortedByMeaning ? "SortedByMeaning" : workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    return rows.map(rowToItem).filter((item) => item.id && item.day);
  }

  function rowToItem(row) {
    return {
      id: Number(readCell(row, "id", "ID")),
      day: Number(readCell(row, "day", "Day")),
      pattern: String(readCell(row, "pattern", "Pattern") || "").trim(),
      type: String(readCell(row, "type", "Type") || "").trim(),
      koreanGloss: String(readCell(row, "korean_gloss", "koreanGloss", "KoreanGloss") || "").trim(),
      exampleEn: String(readCell(row, "example_en", "exampleEn", "ExampleEn") || "").trim(),
      exampleKo: String(readCell(row, "example_ko", "exampleKo", "ExampleKo") || "").trim(),
      clozeEn: String(readCell(row, "cloze_en", "clozeEn", "ClozeEn") || "").trim(),
      targetIndices: parseTargetIndices(readCell(row, "index_from_example", "targetIndices", "TargetIndices")),
      pickupExample: String(readCell(row, "example_for_pickup", "exampleForPickup", "ExampleForPickup") || "").trim(),
      pickupPatternIndices: parseTargetIndices(readCell(row, "pickup_index_pattern", "pickupIndexPattern", "PickupIndexPattern")),
      pickupAffectedIndices: parseTargetIndices(readCell(row, "pickup_index_affected", "pickupIndexAffected", "PickupIndexAffected"))
    };
  }

  function readCell(row, ...names) {
    for (const name of names) {
      if (Object.prototype.hasOwnProperty.call(row, name)) {
        return row[name];
      }
    }
    return "";
  }

  function parseTargetIndices(value) {
    if (Array.isArray(value)) {
      return value.map(Number).filter(Number.isFinite);
    }
    return String(value || "")
      .split(",")
      .map((part) => Number(String(part).trim()))
      .filter(Number.isFinite);
  }

  function normalizeProblem(item) {
    const sourceSentence = item.pickupExample || item.exampleEn || item.clozeEn || item.pattern || "";
    const tokens = tokenizeSentence(sourceSentence);
    const targets = normalizeTargets(
      item.pickupPatternIndices && item.pickupPatternIndices.length ? item.pickupPatternIndices : item.targetIndices,
      tokens.length
    );
    const affected = normalizeTargets(item.pickupAffectedIndices, tokens.length);

    return {
      key: String(item.id),
      item,
      label: String(item.pattern || item.clozeEn || `Item ${item.id}`),
      gloss: String(item.koreanGloss || ""),
      tokens,
      targets,
      affected
    };
  }

  function tokenizeSentence(value) {
    return String(value || "").split(/\s+/).filter(Boolean);
  }

  function normalizeTargets(values, tokenCount) {
    if (!Array.isArray(values)) return [];
    return values
      .map((value) => Number(value) - 1)
      .filter((value, index, list) => (
        Number.isInteger(value) &&
        value >= 0 &&
        value < tokenCount &&
        list.indexOf(value) === index
      ));
  }

  function storageKey() {
    const user = route.userId || "anonymous";
    return `salmon_answers_v1_${user}_${route.level}_Day${route.day}`;
  }

  function markerKey() {
    const user = route.userId || "anonymous";
    return `salmon_submit_marker_v1_${user}_${route.level}_Day${route.day}`;
  }

  function currentProblem() {
    return problems[order[idx]];
  }

  function shuffle(items) {
    for (let i = items.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
  }

  function isMobileLayout() {
    return window.matchMedia("(max-width:640px)").matches;
  }

  function openMobileBank() {
    if (!isMobileLayout()) return;
    document.body.classList.remove("answer-open");
    document.body.classList.remove("mobile-answer-open");
  }

  function closeMobileBank() {
    document.body.classList.remove("mobile-bank-open");
  }

  function showAnswerBox() {
    document.body.classList.add("answer-open");
  }

  function hideAnswerBox() {
    document.body.classList.remove("answer-open");
    document.body.classList.remove("mobile-answer-open");
    closeNaverDict();
  }

  function setToast(message, color) {
    els.toast.textContent = message || "";
    els.toast.style.color = color || "var(--warn)";
    if (message) {
      els.toast.classList.add("shake");
      setTimeout(() => els.toast.classList.remove("shake"), 280);
    }
  }

  function isTesterUser() {
    return String(route.userId || "").trim().toLowerCase() === "tester";
  }

  function renderTesterControls() {
    if (!isTesterUser() || !els.controls || document.getElementById("salmonTesterFillBtn")) return;

    const button = document.createElement("button");
    button.className = "btn submit";
    button.id = "salmonTesterFillBtn";
    button.type = "button";
    button.textContent = "\uB2E4 \uB9DE\uAC8C \uD558\uAE30";
    button.addEventListener("click", fillAllForTester);
    els.controls.appendChild(button);
  }

  function fillAllForTester() {
    if (!isTesterUser()) return;

    problems.forEach((problem) => {
      solvedMap[problem.key] = true;
      answerMap[problem.key] = buildTesterAnswer(problem);
    });

    localStorage.setItem(storageKey(), JSON.stringify(answerMap));
    localStorage.setItem(`${storageKey()}_solved`, JSON.stringify(solvedMap));
    renderCard();
    markUsedBankItems();
    updateProgress();
    renderSubmitStatus();
    setToast("\uC804\uBD80 \uCC44\uC6E0\uC2B5\uB2C8\uB2E4.", "var(--ok)");
  }

  function buildTesterAnswer(problem) {
    const gloss = String(problem.gloss || "").trim();
    return gloss || String(problem.label || "").trim() || problem.tokens.join(" ");
  }

  function renderFatal(message) {
    if (els.progress) {
      els.progress.textContent = `${route.level} · Day ${route.day} · 0 / 0`;
    }
    if (els.tokens) {
      els.tokens.textContent = message || "No salmon data for this Day.";
    }
    [els.prevBtn, els.nextBtn, els.saveBtn, els.openDictBtn, els.mobileBankBtn].forEach((button) => {
      if (button) button.disabled = true;
    });
  }

  function renderBank() {
    els.bankList.innerHTML = "";

    getBankRenderItems().forEach((problem) => {
      const item = document.createElement("li");
      item.className = "bank-item";
      if (isLongBankLabel(problem.label)) {
        item.classList.add("wide");
      }

      const button = document.createElement("button");
      button.type = "button";
      button.dataset.key = problem.key;
      button.textContent = problem.label;
      button.addEventListener("click", () => {
        setActiveBank(button);
        setToast("");
        renderGloss();
      });

      item.appendChild(button);
      els.bankList.appendChild(item);
    });

    bankButtons = $$("#bank button[data-key]");
  }

  function getBankRenderItems() {
    const compact = [];
    const wide = [];

    problems.forEach((problem) => {
      if (isLongBankLabel(problem.label)) {
        wide.push(problem);
      } else {
        compact.push(problem);
      }
    });

    compact.sort(compareBankLabels);

    const orphan = compact.length % 2 ? compact.pop() : null;
    return orphan ? compact.concat(wide, orphan) : compact.concat(wide);
  }

  function compareBankLabels(a, b) {
    return String(a.label || "").localeCompare(String(b.label || ""), "en", {
      numeric: true,
      sensitivity: "base"
    });
  }

  function renderCard() {
    const problem = currentProblem();
    const isSolved = !!solvedMap[problem.key];
    const sourceIndex = getSourceTokenIndex(problem);

    els.card.dataset.solved = isSolved ? "true" : "false";
    if (els.questionNo) {
      els.questionNo.textContent = `Q ${idx + 1}/${problems.length}`;
    }
    hideTapHint();
    foundSet = new Set();
    els.tokens.innerHTML = "";

    problem.tokens.forEach((token, tokenIndex) => {
      const span = document.createElement("span");
      span.className = "token";
      span.textContent = token;
      span.dataset.idx = String(tokenIndex);
      span.dataset.target = String(problem.targets.includes(tokenIndex));
      span.dataset.affected = String(problem.affected.includes(tokenIndex));
      span.dataset.affectedVisible = "false";
      span.dataset.lassoEdge = "";
      span.dataset.sourceFade = "false";
      span.setAttribute("role", "button");
      span.setAttribute("tabindex", "0");

      if (isSolved && problem.targets.includes(tokenIndex)) {
        span.dataset.found = "true";
        foundSet.add(tokenIndex);
      }

      if (isSolved && problem.affected.includes(tokenIndex)) {
        span.dataset.affectedVisible = "true";
        span.dataset.lassoEdge = getLassoEdge(problem.affected, tokenIndex);
      }

      if (isSolved && tokenIndex === sourceIndex) {
        if (!problem.affected.length) {
          span.dataset.sourceFade = "true";
        }
      }

      span.addEventListener("click", () => onTokenClick(span));
      span.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onTokenClick(span);
        }
      });

      els.tokens.appendChild(span);
      if (tokenIndex < problem.tokens.length - 1) {
        els.tokens.appendChild(document.createTextNode(" "));
      }
    });

    els.studentAnswer.value = answerMap[problem.key] || "";
    setSavedState(els.studentAnswer.value.trim() ? "\uC800\uC7A5\uB428" : "\uC800\uC7A5 \uC804");
    els.glossArea.innerHTML = "";

    if (isSolved) {
      showAnswerBox();
    } else {
      hideAnswerBox();
    }

    updateStatus();
    renderSubmitStatus();
  }

  function updateStatus() {
    const problem = currentProblem();
    const need = problem.targets.length;
    const found = $$("#tokens .token[data-found=\"true\"]").length;
    els.status.textContent = `${found}/${need}`;
  }

  function onTokenClick(span) {
    const problem = currentProblem();

    if (els.card.dataset.solved === "true") return;

    if (!activeKey) {
      setToast("Bank \uBA3C\uC800");
      els.card.classList.add("shake");
      setTimeout(() => els.card.classList.remove("shake"), 280);
      return;
    }

    hideTapHint();

    if (activeKey !== problem.key) {
      markWrong(span);
      setToast("\uB2E4\uB978 chunk");
      return;
    }

    if (span.dataset.target !== "true") {
      markWrong(span);
      setToast("\uD574\uB2F9 \uB2E8\uC5B4 \uC544\uB2D8");
      return;
    }

    if (span.dataset.found === "true") return;

    span.dataset.found = "true";
    foundSet.add(Number(span.dataset.idx));
    pulseElement(els.card, "hit-pulse");
    updateStatus();

    if (foundSet.size >= problem.targets.length) {
      els.card.dataset.solved = "true";
      solvedMap[problem.key] = true;
      localStorage.setItem(`${storageKey()}_solved`, JSON.stringify(solvedMap));

      const button = bankButtons.find((candidate) => candidate.dataset.key === problem.key);
      if (button) button.classList.add("used");

      updateProgress();
      renderGloss();
      revealAffectedTokens();
      showAnswerBox();
      renderSubmitStatus();
      setToast("\uC815\uB2F5", "var(--ok)");
    }
  }

  function revealAffectedTokens() {
    const problem = currentProblem();
    const tokens = $$("#tokens .token[data-affected=\"true\"]")
      .sort((left, right) => Number(left.dataset.idx) - Number(right.dataset.idx));

    applySourceGlow(problem);

    tokens.forEach((token) => {
      token.dataset.affectedVisible = "false";
      token.dataset.lassoEdge = getLassoEdge(problem.affected, Number(token.dataset.idx));
      token.classList.remove("affected-reveal");
    });

    tokens.forEach((token, index) => {
      setTimeout(() => {
        token.dataset.affectedVisible = "true";
        token.classList.add("affected-reveal");
      }, index * 110);
    });
  }

  function applySourceGlow(problem) {
    const sourceIndex = getSourceTokenIndex(problem);
    const source = $(`#tokens .token[data-idx="${sourceIndex}"]`);
    if (!source) return;

    if (!problem.affected.length) {
      source.dataset.sourceFade = "true";
    }
  }

  function getSourceTokenIndex(problem) {
    return problem.targets.length ? Math.max(...problem.targets) : -1;
  }

  function getLassoEdge(indices, tokenIndex) {
    const values = Array.isArray(indices) ? indices : [];
    const hasPrev = values.includes(tokenIndex - 1);
    const hasNext = values.includes(tokenIndex + 1);
    if (!hasPrev && !hasNext) return "single";
    if (!hasNext) return "end";
    return "run";
  }

  function markWrong(element) {
    element.classList.add("wrong");
    setTimeout(() => element.classList.remove("wrong"), 220);
  }

  function renderGloss() {
    els.glossArea.innerHTML = "";
    if (!activeKey) return;

    const problem = problems.find((candidate) => candidate.key === activeKey);
    if (!problem) return;

    const mini = document.createElement("div");
    mini.className = "mini-card";
    mini.innerHTML = `
      <div class="head">
        <span class="tag">CHUNK</span>
        ${escapeHtml(problem.label)}
      </div>
      <div class="desc">${escapeHtml(problem.gloss)}</div>
    `;

    const wrap = document.createElement("div");
    wrap.className = "gloss-choice";

    const reselect = document.createElement("button");
    reselect.type = "button";
    reselect.className = "btn reselect-btn";
    reselect.textContent = "\uB2E4\uC2DC \uC120\uD0DD";
    reselect.addEventListener("click", clearBankSelection);

    wrap.appendChild(mini);
    wrap.appendChild(reselect);
    els.glossArea.appendChild(wrap);
  }

  function clearBankSelection() {
    setActiveBank(null);
    els.glossArea.innerHTML = "";
    setToast("");
  }

  function saveCurrentAnswer(silent) {
    const problem = currentProblem();
    answerMap[problem.key] = els.studentAnswer.value;
    localStorage.setItem(storageKey(), JSON.stringify(answerMap));
    setSavedState("\uC800\uC7A5\uB428");
    updateProgress();

    if (!silent) {
      setToast("\uC800\uC7A5\uB428", "var(--ok)");
    }
  }

  function loadAnswers() {
    try {
      const raw = localStorage.getItem(storageKey());
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (error) {
      return {};
    }
  }

  function loadSolved() {
    try {
      const raw = localStorage.getItem(`${storageKey()}_solved`);
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (error) {
      return {};
    }
  }

  function completedClickCount() {
    return problems.filter((problem) => solvedMap[problem.key]).length;
  }

  function filledAnswerCount() {
    return problems.filter((problem) => String(answerMap[problem.key] || "").trim()).length;
  }

  function setSavedState(text) {
    els.savedState.textContent = text;
    els.savedState.dataset.state = text === "\uC800\uC7A5\uB428" ? "saved" : text === "\uC218\uC815\uB428" ? "dirty" : "empty";
  }

  function updateProgress() {
    els.progress.textContent = `Day ${route.day} · \uC800\uC7A5 ${filledAnswerCount()} / ${problems.length}`;
  }

  function setActiveBank(button) {
    bankButtons.forEach((candidate) => candidate.classList.remove("active"));
    if (!button) {
      activeKey = null;
      if (els.bankPanel) els.bankPanel.dataset.selected = "false";
      hideTapHint();
      return;
    }
    button.classList.add("active");
    activeKey = button.dataset.key;
    if (els.bankPanel) els.bankPanel.dataset.selected = "true";
    showTapHint();
  }

  function showTapHint() {
    const problem = currentProblem();
    const shouldShow = problem && !solvedMap[problem.key] && foundSet.size === 0;
    els.card.dataset.tapHint = shouldShow ? "true" : "false";
  }

  function hideTapHint() {
    els.card.dataset.tapHint = "false";
  }

  function isLongBankLabel(label) {
    const text = String(label || "").trim();
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    return text.length > 30 || wordCount > 4;
  }

  function markUsedBankItems() {
    bankButtons.forEach((button) => {
      button.classList.toggle("used", !!solvedMap[button.dataset.key]);
    });
  }

  function go(delta) {
    saveCurrentAnswer(true);
    idx = (idx + delta + order.length) % order.length;
    setActiveBank(null);
    els.glossArea.innerHTML = "";
    hideAnswerBox();
    renderCard();
    markUsedBankItems();
    setToast("");
  }

  function isLastProblem() {
    return idx === order.length - 1;
  }

  function isSubmissionReady() {
    return problems.length > 0 &&
      completedClickCount() === problems.length &&
      filledAnswerCount() === problems.length &&
      els.savedState.dataset.state !== "dirty";
  }

  function saveAndGoNext() {
    if (isAdvancing) return;
    const savedIndex = idx + 1;
    const wasSubmitMode = els.saveBtn.classList.contains("submit");
    saveCurrentAnswer(true);
    pulseElement(els.studentBox, "save-pulse");
    if (!wasSubmitMode) {
      dispatchSavedToast(savedIndex);
    }

    if (wasSubmitMode) {
      isAdvancing = true;
      renderSubmitStatus();
      setTimeout(() => {
        isAdvancing = false;
        renderSubmitStatus();
        submitAllAnswers();
      }, 280);
      return;
    }

    if (isSubmissionReady()) {
      renderSubmitStatus();
      setToast("\uC81C\uCD9C\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.", "var(--accent)");
      return;
    }

    isAdvancing = true;
    renderSubmitStatus();
    setTimeout(() => {
      go(1);
      isAdvancing = false;
      renderSubmitStatus();
      setToast("\uC800\uC7A5\uB410\uC2B5\uB2C8\uB2E4", "var(--ok)");
    }, 280);
  }

  function dispatchSavedToast(index) {
    const remaining = Math.max(problems.length - filledAnswerCount(), 0);
    document.dispatchEvent(new CustomEvent("salmon:saved", {
      detail: {
        index,
        total: problems.length,
        remaining
      }
    }));
  }

  function renderSubmitStatus() {
    const last = isLastProblem();
    const submitMode = last || isSubmissionReady();
    els.saveBtn.classList.toggle("submit", submitMode && !submittedToday);
    els.saveBtn.classList.toggle("ok", !submitMode && !submittedToday);
    els.saveBtn.disabled = submittedToday || isSubmitting || isAdvancing || (submitMode && isCheckingSubmission);

    if (submittedToday) {
      els.saveBtn.textContent = "\uC81C\uCD9C \uC644\uB8CC";
    } else if (isSubmitting) {
      els.saveBtn.textContent = "\uC81C\uCD9C \uC911...";
    } else if (submitMode && isCheckingSubmission) {
      els.saveBtn.textContent = "\uD655\uC778 \uC911...";
    } else if (submitMode) {
      els.saveBtn.textContent = "\uC81C\uCD9C";
    } else {
      els.saveBtn.textContent = "\uC800\uC7A5";
    }
  }

  function summarizeLabels(labels) {
    const shown = labels.slice(0, 3).join(", ");
    const rest = labels.length - 3;
    return rest > 0 ? `${shown} \uC678 ${rest}\uAC1C` : shown;
  }

  function getMissingSubmissionItems() {
    return {
      missingClicks: problems.filter((problem) => !solvedMap[problem.key]).map((problem) => problem.label),
      missingAnswers: problems
        .filter((problem) => !String(answerMap[problem.key] || "").trim())
        .map((problem) => problem.label)
    };
  }

  function showMissingSubmissionNotice() {
    const missing = getMissingSubmissionItems();
    const parts = [];
    if (missing.missingClicks.length) {
      parts.push(`\uD074\uB9AD \uC548 \uD568: ${summarizeLabels(missing.missingClicks)}`);
    }
    if (missing.missingAnswers.length) {
      parts.push(`\uBE48\uCE78: ${summarizeLabels(missing.missingAnswers)}`);
    }
    if (!parts.length) return false;
    setToast(parts.join(" / "));
    return true;
  }

  async function submitAllAnswers() {
    if (isSubmitting) return;
    if (submittedToday) {
      setToast("\uC624\uB298\uC740 \uC774\uBBF8 \uC81C\uCD9C\uD588\uC2B5\uB2C8\uB2E4.");
      return;
    }

    saveCurrentAnswer(true);

    if (showMissingSubmissionNotice()) {
      return;
    }

    if (!route.userId) {
      setToast("id\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.");
      return;
    }

    isSubmitting = true;
    renderSubmitStatus();
    setToast("\uD2B8\uB808\uC774\uB85C \uB3CC\uC544\uAC11\uB2C8\uB2E4...", "var(--accent)");

    try {
      storeLocalQuizResult();
      clearLocalProgress();
      submittedToday = true;
      renderSubmitStatus();
      setTimeout(() => {
        window.location.replace(buildTrayUrl());
      }, 420);
    } catch (error) {
      console.error(error);
      submittedToday = false;
      setToast("\uC81C\uCD9C \uC900\uBE44 \uC2E4\uD328");
    } finally {
      isSubmitting = false;
      renderSubmitStatus();
    }
  }

  function clearLocalProgress() {
    localStorage.removeItem(storageKey());
    localStorage.removeItem(`${storageKey()}_solved`);
    clearSubmitMarker();
  }

  function storeLocalQuizResult() {
    const quizKeys = getResultQuizKeys();
    const primaryKey = quizKeys[0] || getFallbackQuizKey();
    const result = buildLocalQuizResult(primaryKey);

    localStorage.setItem("QuizResults", JSON.stringify(result));

    const map = readQuizResultsMap();
    quizKeys.forEach((quizKey) => {
      map[quizKey] = buildLocalQuizResult(quizKey);
    });
    localStorage.setItem("QuizResultsMap", JSON.stringify(map));
  }

  function readQuizResultsMap() {
    try {
      const raw = localStorage.getItem("QuizResultsMap");
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch (error) {
      return {};
    }
  }

  function getResultQuizKeys() {
    return Array.from(new Set([
      route.routeQuizKey,
      route.dishQuizKey,
      getFallbackQuizKey()
    ].map((value) => String(value || "").trim()).filter(Boolean)));
  }

  function getFallbackQuizKey() {
    return `quiz_Collocations_${route.level}_Day${route.day}`;
  }

  function buildLocalQuizResult(quizKey) {
    return {
      quiztitle: quizKey,
      subcategory: SUBCATEGORY,
      level: route.level,
      day: route.day,
      teststatus: "done",
      stage: "salmon",
      score: 100,
      correctCount: problems.length,
      totalQuestions: problems.length,
      canSubmit: true,
      testspecific: problems.map((problem, index) => ({
        no: index + 1,
        word: problem.label,
        meaning: problem.gloss,
        answer: String(answerMap[problem.key] || "").trim(),
        selected: String(answerMap[problem.key] || "").trim(),
        correct: true
      }))
    };
  }

  function getKstTodayString() {
    return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  }

  function buildSubmissionComment() {
    return `Salmon ${route.level} Day ${route.day}`;
  }

  function buildSubmissionText() {
    const lines = [
      `userId: ${route.userId}`,
      `date: ${getKstTodayString()}`,
      "source: salmon/salmon1.html",
      `subcategory: ${SUBCATEGORY}`,
      `level: ${route.level}`,
      `day: ${route.day}`,
      `lessonNo: ${route.lessonNo}`,
      `routeQuizKey: ${route.routeQuizKey || "-"}`,
      `dishQuizKey: ${route.dishQuizKey || "-"}`,
      `clickedChunks: ${completedClickCount()} / ${problems.length}`,
      `filledAnswers: ${filledAnswerCount()} / ${problems.length}`,
      ""
    ];

    problems.forEach((problem, problemIndex) => {
      const answer = String(answerMap[problem.key] || "").trim();
      const clicked = !!solvedMap[problem.key];
      const targetText = problem.targets.map((tokenIndex) => problem.tokens[tokenIndex]).join(" ");

      lines.push(`[problem ${problemIndex + 1}]`);
      lines.push(`id: ${problem.item.id}`);
      lines.push(`type: ${problem.item.type || ""}`);
      lines.push(`chunk: ${problem.label}`);
      lines.push(`gloss: ${problem.gloss}`);
      lines.push(`sentence: ${problem.tokens.join(" ")}`);
      lines.push(`targetTokens: ${targetText}`);
      lines.push(`affectedTokens: ${problem.affected.map((tokenIndex) => problem.tokens[tokenIndex]).join(" ")}`);
      lines.push(`target_indices: ${(problem.item.targetIndices || []).join(",")}`);
      lines.push(`pickup_index_pattern: ${(problem.item.pickupPatternIndices || []).join(",")}`);
      lines.push(`pickup_index_affected: ${(problem.item.pickupAffectedIndices || []).join(",")}`);
      lines.push(`clicked: ${clicked ? "yes" : "no"}`);
      lines.push(`studentAnswer: ${answer || "\uBBF8\uC751\uB2F5"}`);
      lines.push("");
    });

    return lines.join("\n");
  }

  function readSubmitMarker() {
    try {
      const raw = localStorage.getItem(markerKey());
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function writeSubmitMarker() {
    localStorage.setItem(markerKey(), JSON.stringify({
      userId: route.userId,
      date: getKstTodayString(),
      level: route.level,
      day: route.day,
      lessonNo: route.lessonNo
    }));
  }

  function clearSubmitMarker() {
    localStorage.removeItem(markerKey());
  }

  function hasLocalSubmittedToday() {
    const marker = readSubmitMarker();
    return !!marker &&
      String(marker.userId || "") === String(route.userId || "") &&
      String(marker.date || "") === getKstTodayString() &&
      Number(marker.day) === route.day;
  }

  async function fetchSubmittedTodayFromServer() {
    if (!route.userId) return false;
    const res = await fetch(`${API_URL.replace("/saveHWPlus", "/getHWPlus")}?userId=${encodeURIComponent(route.userId)}`);
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    if (!Array.isArray(data)) return false;

    const todayStr = getKstTodayString();
    const comment = buildSubmissionComment();
    return data.some((item) => {
      const timestamp = String(item.Timestamp || item.timestamp || "");
      const subcategory = String(item.Subcategory || item.subcategory || "").trim();
      const hwType = String(item.HWType || item.hwtype || "").trim();
      const itemComment = String(item.Comment || item.comment || "").trim();
      const lessonNo = Number(item.LessonNo ?? item.lessonNo ?? 0);
      return timestamp.startsWith(todayStr) &&
        subcategory === SUBCATEGORY &&
        hwType === HW_TYPE &&
        itemComment === comment &&
        lessonNo === route.lessonNo;
    });
  }

  async function waitForServerSubmission(attempts, delayMs) {
    for (let i = 0; i < attempts; i += 1) {
      try {
        if (await fetchSubmittedTodayFromServer()) return true;
      } catch (error) {
        if (i === attempts - 1) throw error;
      }
      await wait(delayMs);
    }
    return false;
  }

  async function checkSubmittedToday() {
    if (!route.userId) return false;
    const localSubmitted = hasLocalSubmittedToday();
    try {
      const serverSubmitted = await fetchSubmittedTodayFromServer();
      if (serverSubmitted) {
        if (!localSubmitted) writeSubmitMarker();
        return true;
      }
      if (localSubmitted) clearSubmitMarker();
      return false;
    } catch (error) {
      return localSubmitted;
    }
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function removeCompletedHomeworkFromLocalOrder() {
    try {
      const raw = localStorage.getItem("HWPlus");
      const list = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list)) return;

      const next = list.filter((entry) => {
        const sameSub = String(entry && entry.Subcategory || "").trim() === SUBCATEGORY;
        const sameLevel = !entry.Level || String(entry.Level).trim() === route.level;
        const entryLessonNo = Number(entry.LessonNo);
        const entryDay = Number(entry.Day);
        const sameProgress = entryLessonNo === route.lessonNo || entryDay === route.day;
        return !(sameSub && sameLevel && sameProgress);
      });

      if (next.length !== list.length) {
        localStorage.setItem("HWPlus", JSON.stringify(next));
      }
    } catch (error) {
      console.warn("Failed to update HWPlus after Salmon submit:", error);
    }
  }

  function buildTrayUrl() {
    const target = new URL("../homework-tray_v1.html", window.location.href);
    if (route.userId) target.searchParams.set("id", route.userId);
    target.searchParams.set("quizKey", getResultQuizKeys()[0] || getFallbackQuizKey());
    return target.toString();
  }

  function openNaverDict() {
    if (!document.body.classList.contains("answer-open")) return;
    document.body.classList.add("dict-open");
    els.dictPanel.classList.add("open");
    if (els.dictFrame.getAttribute("src") === "about:blank") {
      els.dictFrame.setAttribute("src", "https://en.dict.naver.com/");
    }
    setToast("");
  }

  function closeNaverDict() {
    document.body.classList.remove("dict-open");
    els.dictPanel.classList.remove("open");
  }

  function pulseElement(element, className) {
    if (!element) return;
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
    setTimeout(() => element.classList.remove(className), 380);
  }

  function bindEvents() {
    els.prevBtn.addEventListener("click", () => go(-1));
    els.nextBtn.addEventListener("click", () => go(1));
    els.saveBtn.addEventListener("click", saveAndGoNext);
    els.openDictBtn.addEventListener("click", openNaverDict);
    els.closeDictBtn.addEventListener("click", closeNaverDict);

    if (els.mobileBankBtn) {
      els.mobileBankBtn.addEventListener("click", openMobileBank);
    }
    if (els.bankCloseBtn) {
      els.bankCloseBtn.addEventListener("click", closeMobileBank);
    }
    if (els.mobileBankBackdrop) {
      els.mobileBankBackdrop.addEventListener("click", closeMobileBank);
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") hideAnswerBox();
    });

    els.studentAnswer.addEventListener("input", () => {
      setSavedState("\uC218\uC815\uB428");
      renderSubmitStatus();
    });

    window.addEventListener("beforeunload", () => {
      saveCurrentAnswer(true);
    });
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
