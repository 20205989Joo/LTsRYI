(function () {
  "use strict";

  const SUBCATEGORY = "\uC5F0\uC5B4";
  const DEFAULT_LEVEL = "\uB098\uBB47\uC78E\uC5F0\uC5B42";
  const WORKBOOK_FILE = "leaf_salmon2.xlsx";
  const ITEMS_PER_DAY = 10;

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  let route = getRouteContext();
  let problems = [];
  let order = [];
  let idx = 0;
  let foundSet = new Set();
  let answerMap = {};
  let solvedMap = {};
  let isSubmitting = false;
  let isAdvancing = false;

  const els = {};

  injectShell();
  injectStyles();
  bindStaticEvents();
  boot();

  async function boot() {
    try {
      setProgress(`Loading ${WORKBOOK_FILE}...`);
      const all = await loadWorkbookItems();
      problems = all
        .filter((item) => item.day === route.day)
        .map(normalizeProblem);
      order = problems.map((_, index) => index);
      shuffle(order);
      answerMap = loadAnswers();
      solvedMap = loadSolved();

      if (!problems.length) {
        renderFatal(`No Leaf Salmon2 data for Day ${route.day}.`);
        return;
      }

      renderTesterControls();
      updateProgress();
      renderCard();
      renderSubmitStatus();
    } catch (error) {
      console.error(error);
      renderFatal(`Could not load ${WORKBOOK_FILE}.`);
    }
  }

  function injectShell() {
    const host = $(".main-page");
    if (!host) return;
    host.classList.add("leaf-salmon-page");
    host.innerHTML = `
      <div class="leaf-wrap">
        <header class="leaf-header">
          <div class="leaf-title">Leaf Salmon2</div>
          <div class="leaf-progress" id="progress">Day</div>
        </header>

        <main class="leaf-grid">
          <section class="leaf-panel leaf-left-panel">
            <div class="leaf-top-row">
              <div class="leaf-controls" id="controls">
                <button class="leaf-btn" id="prevBtn" type="button">\uC774\uC804</button>
                <button class="leaf-btn" id="nextBtn" type="button">\uB2E4\uC74C</button>
              </div>
              <span class="leaf-toast" id="toast" aria-live="polite"></span>
            </div>

            <div class="leaf-card" id="card" data-solved="false">
              <div class="leaf-question-no" id="questionNo">Q 1/10</div>
              <div class="leaf-status" id="status">0/0</div>
              <div class="leaf-tokens" id="tokens"></div>
            </div>

            <div class="leaf-student-box" id="studentBox">
              <textarea id="studentAnswer" placeholder="\uBC88\uC5ED \uC785\uB825"></textarea>
              <div class="leaf-save-wrap">
                <button class="leaf-btn leaf-ok" id="saveBtn" type="button">\uC800\uC7A5</button>
                <div class="leaf-saved-state" id="savedState">\uC800\uC7A5 \uC804</div>
              </div>
            </div>
          </section>

          <aside class="leaf-panel leaf-bank">
            <div class="leaf-bank-head">
              <h2>Catch</h2>
            </div>
            <div id="chunkArea"></div>
            <div class="leaf-translation" id="translationArea"></div>
          </aside>
        </main>
      </div>
    `;

    Object.assign(els, {
      progress: $("#progress"),
      controls: $("#controls"),
      card: $("#card"),
      questionNo: $("#questionNo"),
      status: $("#status"),
      tokens: $("#tokens"),
      toast: $("#toast"),
      prevBtn: $("#prevBtn"),
      nextBtn: $("#nextBtn"),
      studentBox: $("#studentBox"),
      studentAnswer: $("#studentAnswer"),
      saveBtn: $("#saveBtn"),
      savedState: $("#savedState"),
      chunkArea: $("#chunkArea"),
      translationArea: $("#translationArea")
    });
  }

  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      html,body{overflow:hidden}
      :root{
        --warn:#ff9d76;
        --ok:#5dd39e;
        --accent:#8fd3ff;
      }
      body{
        background:
          radial-gradient(circle at 18% 16%, rgba(143,211,255,.12), transparent 28%),
          radial-gradient(circle at 84% 70%, rgba(91,141,111,.18), transparent 30%),
          linear-gradient(120deg,#081017,#0b1420 52%,#081017);
      }
      .leaf-salmon-page{
        width:100%;
        height:100dvh;
        max-width:1200px;
        max-height:none;
        border:0;
        border-radius:0;
        box-shadow:none;
        background:transparent;
      }
      .leaf-wrap{
        width:100%;
        height:100%;
        padding:16px;
        display:flex;
        flex-direction:column;
        gap:12px;
      }
      .leaf-header{
        flex:0 0 38px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
      }
      .leaf-title{
        font-size:21px;
        font-weight:900;
        color:#e7edf5;
      }
      .leaf-progress{
        color:#cfeeff;
        font-size:14px;
        font-weight:850;
        white-space:nowrap;
      }
      .leaf-grid{
        flex:1 1 auto;
        min-height:0;
        display:grid;
        grid-template-columns:minmax(0,1.1fr) minmax(320px,.9fr);
        gap:14px;
      }
      .leaf-panel{
        min-height:0;
        border-radius:16px;
        background:#121821;
        box-shadow:0 10px 30px rgba(0,0,0,.25);
        padding:14px;
        overflow:hidden;
      }
      .leaf-left-panel{
        position:relative;
        display:flex;
        flex-direction:column;
        gap:10px;
      }
      .leaf-top-row{
        min-height:36px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
      }
      .leaf-controls{
        display:flex;
        flex-wrap:wrap;
        gap:8px;
      }
      .leaf-btn{
        appearance:none;
        border:1px solid #223042;
        border-radius:10px;
        background:#101722;
        color:#e7edf5;
        padding:7px 11px;
        font-weight:800;
        cursor:pointer;
        white-space:nowrap;
      }
      .leaf-btn:hover{border-color:#2f4157}
      .leaf-btn:disabled{opacity:.58;cursor:not-allowed}
      .leaf-btn.leaf-ok{
        border-color:#226046;
        background:#0e2018;
        color:#baf5d8;
      }
      .leaf-btn.leaf-submit{
        border-color:#6f5db7;
        background:#17122a;
        color:#ddd6fe;
      }
      .leaf-toast{
        min-width:100px;
        text-align:right;
        color:#ff9d76;
        font-size:13px;
      }
      .leaf-card{
        flex:0 0 205px;
        min-height:205px;
        position:relative;
        display:flex;
        align-items:center;
        border:2px solid #9ee6b5;
        border-radius:14px;
        background:#151d28;
        padding:22px 18px;
        box-shadow:
          0 0 0 2px rgba(158,230,181,.14) inset,
          0 0 18px rgba(158,230,181,.28),
          0 0 42px rgba(143,211,255,.16);
      }
      .leaf-card[data-solved="true"]{
        border-color:#5dd39e;
        box-shadow:
          0 0 0 2px rgba(93,211,158,.18) inset,
          0 0 24px rgba(93,211,158,.38),
          0 0 54px rgba(93,211,158,.18);
      }
      .leaf-question-no,.leaf-status{
        position:absolute;
        top:8px;
        font-size:12px;
        font-weight:900;
      }
      .leaf-question-no{
        left:10px;
        color:#d7ffe9;
      }
      .leaf-status{
        right:10px;
        color:#7b8a9a;
      }
      .leaf-tokens{
        width:100%;
        color:#e6f7c9;
        font-size:20px;
        line-height:1.9;
        word-wrap:anywhere;
      }
      .leaf-token{
        display:inline-block;
        position:relative;
        margin:0 1px;
        padding:2px 4px;
        border-radius:8px;
        cursor:pointer;
        transition:background .16s, color .16s, transform .1s;
      }
      .leaf-token:hover{background:#1a2533}
      .leaf-token[data-found="true"]{
        color:#d6ffe9;
        background:rgba(93,211,158,.2);
        box-shadow:
          0 0 0 1px rgba(93,211,158,.24) inset,
          0 0 13px rgba(93,211,158,.28);
      }
      .leaf-token.wrong{
        background:rgba(255,107,107,.16);
        transform:translateY(-1px);
      }
      .leaf-student-box{
        display:none;
        gap:8px;
        min-height:86px;
        padding:9px;
        border:1px solid rgba(143,211,255,.32);
        border-radius:14px;
        background:#0f1621;
        box-shadow:
          0 0 0 1px rgba(143,211,255,.08) inset,
          0 0 18px rgba(143,211,255,.14);
      }
      body.leaf-answer-open .leaf-student-box{
        display:flex;
      }
      #studentAnswer{
        flex:1 1 auto;
        min-height:66px;
        resize:none;
        border:1px solid rgba(143,211,255,.52);
        border-radius:12px;
        background:linear-gradient(180deg,#07111d,#0b1623);
        color:#e7edf5;
        padding:9px 10px;
        font:14px/1.35 system-ui,-apple-system,Segoe UI,Roboto,Apple SD Gothic Neo,Malgun Gothic,Helvetica,Arial,sans-serif;
        outline:none;
      }
      .leaf-save-wrap{
        flex:0 0 76px;
        display:flex;
        flex-direction:column;
        gap:5px;
      }
      .leaf-save-wrap .leaf-btn{
        flex:1 1 auto;
      }
      .leaf-saved-state{
        padding:4px 7px;
        border:1px solid rgba(255,157,118,.42);
        border-radius:999px;
        background:rgba(255,107,107,.1);
        color:#ffd1bf;
        font-size:11px;
        font-weight:850;
        text-align:center;
        white-space:nowrap;
      }
      .leaf-saved-state[data-state="saved"]{
        border-color:rgba(93,211,158,.5);
        background:rgba(93,211,158,.12);
        color:#c7fbe0;
      }
      .leaf-saved-state[data-state="dirty"]{
        border-color:rgba(255,213,77,.5);
        background:rgba(255,213,77,.1);
        color:#ffeaa0;
      }
      .leaf-bank{
        display:flex;
        flex-direction:column;
        gap:10px;
      }
      .leaf-bank-head{
        flex:0 0 24px;
        display:flex;
        align-items:center;
        justify-content:space-between;
      }
      .leaf-bank h2{
        margin:0;
        font-size:16px;
      }
      #chunkArea{
        display:grid;
        grid-template-columns:1fr;
        gap:8px;
      }
      .leaf-chunk{
        border:1px solid #254132;
        border-radius:12px;
        background:#0e1b15;
        padding:10px;
        color:#d7ffe9;
      }
      .leaf-chunk .label{
        font-size:14px;
        font-weight:900;
      }
      .leaf-chunk .desc{
        margin-top:4px;
        color:#a7e7c9;
        font-size:13px;
        line-height:1.25;
      }
      .leaf-chunk .pattern{
        margin-top:4px;
        color:#7b8a9a;
        font-size:11px;
        line-height:1.2;
      }
      .leaf-translation{
        margin-top:auto;
        border:1px solid rgba(143,211,255,.28);
        border-radius:12px;
        background:#0f1621;
        padding:10px;
        color:#cfeeff;
        font-size:14px;
        line-height:1.45;
        min-height:64px;
      }
      .leaf-translation:empty{display:none}
      .shake{animation:leafShake .3s}
      @keyframes leafShake{
        10%,90%{transform:translateX(-1px)}
        20%,80%{transform:translateX(2px)}
        30%,50%,70%{transform:translateX(-4px)}
        40%,60%{transform:translateX(4px)}
      }
      @media (max-width:820px){
        html,body{overflow:auto}
        .leaf-salmon-page{height:auto;min-height:100dvh}
        .leaf-wrap{min-height:100dvh;height:auto;padding:10px}
        .leaf-grid{display:flex;flex-direction:column}
        .leaf-card{flex:0 0 auto;min-height:235px}
        .leaf-bank{max-height:none}
        body.leaf-answer-open .leaf-student-box{display:flex}
        #studentAnswer{min-height:112px;font-size:15px}
        .leaf-save-wrap{flex-basis:66px}
      }
    `;
    document.head.appendChild(style);
  }

  function bindStaticEvents() {
    els.prevBtn.addEventListener("click", () => go(-1));
    els.nextBtn.addEventListener("click", () => go(1));
    els.saveBtn.addEventListener("click", saveAndGoNext);
    els.studentAnswer.addEventListener("input", () => {
      setSavedState("\uC218\uC815\uB428");
      renderSubmitStatus();
    });
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
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    return rows.map(rowToItem).filter((item) => item.id && item.example);
  }

  function rowToItem(row) {
    const id = Number(readCell(row, "id", "ID"));
    return {
      id,
      day: Math.floor((id - 1) / ITEMS_PER_DAY) + 1,
      salmonType: String(readCell(row, "salmon_type") || "").trim(),
      coreKey: String(readCell(row, "core_key") || "").trim(),
      example: String(readCell(row, "example_for_pickup") || "").trim(),
      translation: String(readCell(row, "translation_ko") || "").trim(),
      patterns: [1, 2, 3].map((slot) => ({
        slot,
        label: String(readCell(row, `pattern_${slot}`) || "").trim(),
        gloss: String(readCell(row, `pattern_${slot}_ko`) || "").trim(),
        indices: parseIndices(readCell(row, `pickup_index_pattern_${slot}`))
      })).filter((pattern) => pattern.label && pattern.indices.length),
      combined: parseIndices(readCell(row, "pickup_index_combined"))
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

  function parseIndices(value) {
    return String(value || "")
      .split(",")
      .map((part) => Number(String(part).trim()))
      .filter(Number.isFinite);
  }

  function normalizeProblem(item) {
    const tokens = tokenize(item.example);
    const patternTargets = item.patterns.flatMap((pattern) => pattern.indices);
    const combined = item.combined.length ? item.combined : patternTargets;
    const targets = normalizeTargets(combined, tokens.length);

    return {
      key: String(item.id),
      item,
      tokens,
      targets,
      patterns: item.patterns.map((pattern) => ({
        ...pattern,
        targets: normalizeTargets(pattern.indices, tokens.length)
      })).map((pattern) => ({
        ...pattern,
        surface: extractSurface(tokens, pattern.targets)
      }))
    };
  }

  function tokenize(value) {
    return String(value || "").split(/\s+/).filter(Boolean);
  }

  function extractSurface(tokens, targets) {
    return targets
      .map((index) => tokens[index])
      .filter(Boolean)
      .join(" ");
  }

  function normalizeTargets(values, tokenCount) {
    return Array.from(new Set(values
      .map((value) => Number(value) - 1)
      .filter((value) => Number.isInteger(value) && value >= 0 && value < tokenCount)));
  }

  function renderCard() {
    const problem = currentProblem();
    const solved = !!solvedMap[problem.key];
    foundSet = new Set();

    els.card.dataset.solved = solved ? "true" : "false";
    els.questionNo.textContent = `Q ${idx + 1}/${problems.length}`;
    els.tokens.innerHTML = "";

    problem.tokens.forEach((token, tokenIndex) => {
      const span = document.createElement("span");
      span.className = "leaf-token";
      span.textContent = token;
      span.dataset.idx = String(tokenIndex);
      span.dataset.target = String(problem.targets.includes(tokenIndex));
      span.setAttribute("role", "button");
      span.setAttribute("tabindex", "0");

      if (solved && problem.targets.includes(tokenIndex)) {
        span.dataset.found = "true";
        foundSet.add(tokenIndex);
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
    renderChunks(problem, solved);
    renderTranslation(problem, solved);
    document.body.classList.toggle("leaf-answer-open", solved);
    updateStatus();
    renderSubmitStatus();
  }

  function renderChunks(problem, solved) {
    els.chunkArea.innerHTML = "";
    problem.patterns.forEach((pattern) => {
      const card = document.createElement("div");
      card.className = "leaf-chunk";
      const found = solved || pattern.targets.every((target) => foundSet.has(target));
      card.dataset.found = found ? "true" : "false";
      card.innerHTML = `
        <div class="label">${escapeHtml(pattern.surface || pattern.label)}</div>
        <div class="desc">${escapeHtml(pattern.gloss)}</div>
        <div class="pattern">${escapeHtml(pattern.label)}</div>
      `;
      els.chunkArea.appendChild(card);
    });
  }

  function renderTranslation(problem, solved) {
    els.translationArea.textContent = solved ? problem.item.translation : "";
  }

  function onTokenClick(span) {
    const problem = currentProblem();
    if (els.card.dataset.solved === "true") return;

    if (span.dataset.target !== "true") {
      span.classList.add("wrong");
      setTimeout(() => span.classList.remove("wrong"), 220);
      setToast("\uD574\uB2F9 \uB2E8\uC5B4 \uC544\uB2D8");
      return;
    }

    if (span.dataset.found === "true") return;
    span.dataset.found = "true";
    foundSet.add(Number(span.dataset.idx));
    updateStatus();
    renderChunks(problem, false);

    if (problem.targets.every((target) => foundSet.has(target))) {
      solveCurrent();
    }
  }

  function solveCurrent() {
    const problem = currentProblem();
    solvedMap[problem.key] = true;
    localStorage.setItem(`${storageKey()}_solved`, JSON.stringify(solvedMap));
    els.card.dataset.solved = "true";
    document.body.classList.add("leaf-answer-open");
    renderChunks(problem, true);
    renderTranslation(problem, true);
    updateProgress();
    renderSubmitStatus();
    setToast("\uC815\uB2F5. \uBC88\uC5ED\uD574\uBD05\uC2DC\uB2E4.", "var(--ok)");
  }

  function updateStatus() {
    const problem = currentProblem();
    const found = $$(".leaf-token[data-found=\"true\"]").length;
    els.status.textContent = `${found}/${problem.targets.length}`;
  }

  function saveAndGoNext() {
    if (isAdvancing) return;
    const savedIndex = idx + 1;
    const wasSubmitMode = els.saveBtn.classList.contains("leaf-submit");
    saveCurrentAnswer();

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
      }, 180);
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
    }, 180);
  }

  function saveCurrentAnswer() {
    const problem = currentProblem();
    answerMap[problem.key] = els.studentAnswer.value;
    localStorage.setItem(storageKey(), JSON.stringify(answerMap));
    setSavedState("\uC800\uC7A5\uB428");
    updateProgress();
  }

  function submitAllAnswers() {
    if (isSubmitting) return;
    saveCurrentAnswer();
    if (showMissingSubmissionNotice()) return;
    if (!route.userId) {
      setToast("id\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.");
      return;
    }

    isSubmitting = true;
    renderSubmitStatus();
    setToast("\uD2B8\uB808\uC774\uB85C \uB3CC\uC544\uAC11\uB2C8\uB2E4...", "var(--accent)");

    try {
      storeLocalQuizResult();
      writeSubmitMarker();
      setTimeout(() => {
        window.location.replace(buildTrayUrl());
      }, 420);
    } catch (error) {
      console.error(error);
      setToast("\uC81C\uCD9C \uC900\uBE44 \uC2E4\uD328");
    } finally {
      isSubmitting = false;
      renderSubmitStatus();
    }
  }

  function showMissingSubmissionNotice() {
    const missingClicks = problems.filter((problem) => !solvedMap[problem.key]).length;
    const missingAnswers = problems.filter((problem) => !String(answerMap[problem.key] || "").trim()).length;
    if (!missingClicks && !missingAnswers) return false;
    setToast(`catch ${missingClicks} / answer ${missingAnswers}`);
    return true;
  }

  function isSubmissionReady() {
    return problems.length > 0 &&
      problems.every((problem) => solvedMap[problem.key]) &&
      problems.every((problem) => String(answerMap[problem.key] || "").trim()) &&
      els.savedState.dataset.state !== "dirty";
  }

  function renderSubmitStatus() {
    const submitMode = isSubmissionReady();
    els.saveBtn.classList.toggle("leaf-submit", submitMode);
    els.saveBtn.classList.toggle("leaf-ok", !submitMode);
    els.saveBtn.disabled = isSubmitting || isAdvancing;
    if (isSubmitting) {
      els.saveBtn.textContent = "\uC81C\uCD9C \uC911...";
    } else if (submitMode) {
      els.saveBtn.textContent = "\uC81C\uCD9C";
    } else {
      els.saveBtn.textContent = "\uC800\uC7A5";
    }
  }

  function go(delta) {
    saveCurrentAnswer();
    idx = (idx + delta + order.length) % order.length;
    renderCard();
    setToast("");
  }

  function renderTesterControls() {
    if (!isTesterUser() || document.getElementById("leafTesterFillBtn")) return;
    const button = document.createElement("button");
    button.id = "leafTesterFillBtn";
    button.className = "leaf-btn leaf-submit";
    button.type = "button";
    button.textContent = "\uB2E4 \uB9DE\uAC8C \uD558\uAE30";
    button.addEventListener("click", fillAllForTester);
    els.controls.appendChild(button);
  }

  function fillAllForTester() {
    if (!isTesterUser()) return;
    problems.forEach((problem) => {
      solvedMap[problem.key] = true;
      answerMap[problem.key] = problem.item.translation;
    });
    localStorage.setItem(storageKey(), JSON.stringify(answerMap));
    localStorage.setItem(`${storageKey()}_solved`, JSON.stringify(solvedMap));
    renderCard();
    updateProgress();
    renderSubmitStatus();
    setToast("\uC804\uBD80 \uCC44\uC6E0\uC2B5\uB2C8\uB2E4.", "var(--ok)");
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

  function buildLocalQuizResult(quizKey) {
    return {
      quiztitle: quizKey,
      subcategory: SUBCATEGORY,
      level: route.level,
      day: route.day,
      teststatus: "done",
      stage: "salmon2",
      score: 100,
      correctCount: problems.length,
      totalQuestions: problems.length,
      canSubmit: true,
      testspecific: problems.map((problem, index) => ({
        no: index + 1,
        word: problem.patterns.map((pattern) => pattern.surface || pattern.label).join(" / "),
        meaning: problem.patterns.map((pattern) => pattern.gloss).join(" / "),
        pattern: problem.patterns.map((pattern) => pattern.label).join(" / "),
        sentence: problem.item.example,
        answer: String(answerMap[problem.key] || "").trim(),
        selected: String(answerMap[problem.key] || "").trim(),
        correct: true
      }))
    };
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

  function buildTrayUrl() {
    const target = new URL("../homework-tray_v1.html", window.location.href);
    if (route.userId) target.searchParams.set("id", route.userId);
    target.searchParams.set("quizKey", getResultQuizKeys()[0] || getFallbackQuizKey());
    return target.toString();
  }

  function dispatchSavedToast(index) {
    const remaining = Math.max(problems.length - filledAnswerCount(), 0);
    document.dispatchEvent(new CustomEvent("salmon:saved", {
      detail: { index, total: problems.length, remaining }
    }));
  }

  function updateProgress() {
    setProgress(`Day ${route.day} · \uC800\uC7A5 ${filledAnswerCount()} / ${problems.length}`);
  }

  function setProgress(value) {
    if (els.progress) els.progress.textContent = value;
  }

  function completedCount() {
    return problems.filter((problem) => solvedMap[problem.key]).length;
  }

  function filledAnswerCount() {
    return problems.filter((problem) => String(answerMap[problem.key] || "").trim()).length;
  }

  function setSavedState(text) {
    els.savedState.textContent = text;
    els.savedState.dataset.state = text === "\uC800\uC7A5\uB428" ? "saved" : text === "\uC218\uC815\uB428" ? "dirty" : "empty";
  }

  function setToast(message, color) {
    els.toast.textContent = message || "";
    els.toast.style.color = color || "var(--warn)";
    if (message) {
      els.toast.classList.add("shake");
      setTimeout(() => els.toast.classList.remove("shake"), 280);
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

  function storageKey() {
    const user = route.userId || "anonymous";
    return `salmon2_answers_v1_${user}_${route.level}_Day${route.day}`;
  }

  function markerKey() {
    const user = route.userId || "anonymous";
    return `salmon2_submit_marker_v1_${user}_${route.level}_Day${route.day}`;
  }

  function writeSubmitMarker() {
    localStorage.setItem(markerKey(), JSON.stringify({
      userId: route.userId,
      date: getKstTodayString(),
      level: route.level,
      day: route.day
    }));
  }

  function getKstTodayString() {
    return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  }

  function getRouteContext() {
    const params = new URLSearchParams(window.location.search || "");
    const dishQuizKey = String(params.get("dishQuizKey") || "");
    const routeQuizKey = String(params.get("key") || "");
    const parsedDay = parseDayFromKey(dishQuizKey) || parseDayFromKey(routeQuizKey);
    const explicitDay = toPositiveInt(params.get("day")) || parsedDay || toPositiveInt(params.get("lessonNo"));
    return {
      userId: String(params.get("id") || "").trim(),
      level: String(params.get("level") || DEFAULT_LEVEL).trim() || DEFAULT_LEVEL,
      day: explicitDay || 1,
      lessonNo: toPositiveInt(params.get("lessonNo")) || explicitDay || 1,
      routeQuizKey,
      dishQuizKey
    };
  }

  function parseDayFromKey(value) {
    const match = String(value || "").match(/Day(\d+)/i);
    return match ? toPositiveInt(match[1]) : null;
  }

  function toPositiveInt(value) {
    const n = Number(value);
    return Number.isInteger(n) && n > 0 ? n : null;
  }

  function currentProblem() {
    return problems[order[idx]];
  }

  function isTesterUser() {
    return String(route.userId || "").trim().toLowerCase() === "tester";
  }

  function renderFatal(message) {
    setProgress(`${route.level} · Day ${route.day} · 0 / 0`);
    if (els.tokens) els.tokens.textContent = message;
    [els.prevBtn, els.nextBtn, els.saveBtn].forEach((button) => {
      if (button) button.disabled = true;
    });
  }

  function shuffle(items) {
    for (let i = items.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
})();
