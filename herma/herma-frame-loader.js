(function () {
  "use strict";

  var LESSON_SEQUENCE = [
    "l1e1", "l1e2", "l1e3", "l1e4",
    "l2e1", "l2e2", "l2e3", "l2e4",
    "l3e1", "l3e2", "l3e3", "l3e4", "l3e5", "l3e6",
    "l4e1", "l4e2", "l4e3",
    "l5e1", "l5e1b", "l5e2",
    "l6e1", "l6e2", "l6e3", "l6e4", "l6e5"
  ];
  var DEFAULT_LESSON = "l1e1";
  var EXCEL_FILE = "herma_allq_chwi.xlsx";
  var EXCEL_SHEET = "round1_questions";
  var selectedLesson = pickSelectedLesson();
  var questionItems = [];
  var loadState = "엑셀에서 문제-답 불러오는 중";

  window.HermaFrameLoader = {
    lessons: LESSON_SEQUENCE.slice(),
    selectedLesson: selectedLesson,
    normalizeLesson: normalizeLesson,
    reloadQuestionList: loadQuestionDebugList
  };

  writeSelectedLessonScript();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFrame);
  } else {
    initFrame();
  }

  function readParams() {
    try {
      return new URLSearchParams(window.location.search || "");
    } catch (_) {
      return new URLSearchParams();
    }
  }

  function pickSelectedLesson() {
    var params = readParams();
    return normalizeLesson(
      params.get("lesson") ||
      params.get("slug") ||
      params.get("target") ||
      params.get("key") ||
      ""
    ) || DEFAULT_LESSON;
  }

  function normalizeLesson(raw) {
    var value = String(raw || "").trim().toLowerCase();
    if (!value) return "";

    value = value
      .replace(/^herma-/, "")
      .replace(/\.html?$/i, "")
      .replace(/\.js$/i, "");

    var direct = value.match(/^l(\d+)e(\d+[a-z]*)$/i);
    if (direct) return keepKnown("l" + Number(direct[1]) + "e" + direct[2].toLowerCase());

    var dashed = value.match(/^(\d+)\s*-\s*(\d+[a-z]*)$/i);
    if (dashed) return keepKnown("l" + Number(dashed[1]) + "e" + dashed[2].toLowerCase());

    var compact = value.match(/^(\d+)e(\d+[a-z]*)$/i);
    if (compact) return keepKnown("l" + Number(compact[1]) + "e" + compact[2].toLowerCase());

    return keepKnown(value);
  }

  function keepKnown(slug) {
    return LESSON_SEQUENCE.indexOf(slug) >= 0 ? slug : "";
  }

  function writeSelectedLessonScript() {
    var src = "herma-" + selectedLesson + ".js";
    if (document.readyState === "loading") {
      document.write('<script src="' + src + '"><\/script>');
      return;
    }

    var script = document.createElement("script");
    script.src = src;
    document.head.appendChild(script);
  }

  function initFrame() {
    initJumpControl();
    wireBackButton();
    renderDebugPanel();
    loadQuestionDebugList().catch(function (error) {
      console.error("Herma frame Excel debug load failed:", error);
      loadState = "엑셀 문제-답 로드 실패";
      renderDebugPanel();
    });
  }

  function initJumpControl() {
    var select = document.getElementById("herma-frame-lesson-select");
    if (!select) return;

    select.innerHTML = LESSON_SEQUENCE.map(function (slug) {
      return '<option value="' + slug + '">' + formatLessonLabel(slug) + '</option>';
    }).join("");
    select.value = selectedLesson;
    document.title = "Herma " + formatLessonLabel(selectedLesson) + " Frame";

    select.addEventListener("change", function () {
      var nextLesson = normalizeLesson(select.value) || DEFAULT_LESSON;
      var url = new URL(window.location.href);
      url.searchParams.set("lesson", nextLesson);
      url.searchParams.delete("slug");
      url.searchParams.delete("target");
      url.searchParams.delete("key");
      window.location.assign(url.toString());
    });
  }

  function wireBackButton() {
    var button = document.getElementById("back-btn");
    if (!button || button.dataset.hermaFrameWired === "1") return;
    button.dataset.hermaFrameWired = "1";
    button.addEventListener("click", function () {
      window.history.back();
    });
  }

  function getSelectedLessonParts() {
    var match = String(selectedLesson || "").match(/^l(\d+)e(\d+[a-z]*)$/i);
    if (!match) return null;
    return {
      lesson: Number(match[1]),
      exercise: match[2].toLowerCase()
    };
  }

  function getTutorialConfig() {
    var parts = getSelectedLessonParts();
    if (!parts || !window.HermaIntroFronts || typeof window.HermaIntroFronts.getConfig !== "function") return null;
    return window.HermaIntroFronts.getConfig({
      lesson: parts.lesson,
      exercise: parts.exercise,
      pageLabel: "Herma " + formatLessonLabel(selectedLesson)
    });
  }

  function renderDebugPanel() {
    var panel = document.getElementById("herma-dev-question-list");
    if (!panel) return;
    var body = panel.querySelector("[data-herma-dev-body]");
    var meta = panel.querySelector("[data-herma-dev-meta]");
    if (!body) return;

    var tutorial = getTutorialConfig();
    var tutorialSteps = tutorial && Array.isArray(tutorial.steps) ? tutorial.steps : [];
    if (meta) meta.textContent = formatLessonLabel(selectedLesson) + " / " + questionItems.length;

    var tutorialHtml = [
      '<div class="herma-dev-section-label">FRONT PAGE FLOW</div>',
      tutorialSteps.length
        ? '<ol class="herma-dev-tutorial-list">' + tutorialSteps.map(function (step, index) {
            return '<li class="herma-dev-tutorial-item"><span>' + (index + 1) + '</span><span>' + escapeHtml(stripStepNumber(step.title)) + '</span></li>';
          }).join("") + '</ol>'
        : '<div class="herma-dev-empty">튜토리얼 설정 없음</div>'
    ].join("");

    var questionHtml = '<div class="herma-dev-section-label">QUESTION / ANSWER</div>';
    if (!questionItems.length) {
      questionHtml += '<div class="herma-dev-empty">' + escapeHtml(loadState) + '</div>';
    } else {
      questionHtml += '<ol class="herma-dev-qa-list">' + questionItems.map(function (item, index) {
        return [
          '<li class="herma-dev-qa-item">',
          '  <div class="herma-dev-qa-q"><span class="herma-dev-qa-no">Q' + escapeHtml(item.no || index + 1) + '</span>' + escapeDebugText(item.question) + '</div>',
          '  <div class="herma-dev-qa-a">A. ' + escapeDebugText(item.answer) + '</div>',
          '</li>'
        ].join("");
      }).join("") + '</ol>';
    }

    body.innerHTML = tutorialHtml + questionHtml;
  }

  async function loadQuestionDebugList() {
    var parts = getSelectedLessonParts();
    if (!parts) {
      loadState = "선택한 lesson 형식 확인 필요";
      renderDebugPanel();
      return [];
    }
    if (!window.XLSX) throw new Error("XLSX library is not loaded");

    var response = await fetch(EXCEL_FILE, { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to fetch " + EXCEL_FILE + ": " + response.status);
    var buffer = await response.arrayBuffer();
    var workbook = XLSX.read(buffer, { type: "array" });
    var sheet = workbook.Sheets[EXCEL_SHEET] || workbook.Sheets[workbook.SheetNames[0]];
    var rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    questionItems = rows
      .filter(function (row) {
        return Number(row["Lesson"]) === parts.lesson && normalizeExercise(row["Exercise"]) === parts.exercise;
      })
      .sort(function (a, b) {
        return Number(a["QNumber"] || a["No"] || 0) - Number(b["QNumber"] || b["No"] || 0);
      })
      .map(function (row, index) {
        return {
          no: cleanDebugText(row["QNumber"] || row["No"] || index + 1),
          question: buildDebugQuestion(row),
          answer: cleanDebugText(row["Answer"] || row["정답"] || "")
        };
      });

    loadState = questionItems.length ? "" : "엑셀에 해당 Lesson/Exercise 데이터 없음";
    renderDebugPanel();
    return questionItems;
  }

  function normalizeExercise(value) {
    var clean = String(value == null ? "" : value).trim().toLowerCase();
    if (/^\d+\.0+$/.test(clean)) clean = clean.split(".")[0];
    return clean;
  }

  function buildDebugQuestion(row) {
    var title = cleanDebugText(row["Title"] || "");
    var instruction = cleanDebugText(row["Instruction"] || row["지시문"] || "");
    var question = cleanDebugText(row["Question"] || row["문제"] || "");
    return [title, instruction, question].filter(Boolean).join("\n") || "(문제 없음)";
  }

  function stripStepNumber(value) {
    return String(value || "").replace(/^\s*\d+단계[:.]\s*/, "").trim();
  }

  function cleanDebugText(value) {
    return String(value == null ? "" : value)
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/?(?:b|strong|em|i)>/gi, "")
      .replace(/\\n/g, "\n")
      .replace(/\r\n?/g, "\n")
      .replace(/\*\*/g, "")
      .trim();
  }

  function escapeDebugText(value) {
    return escapeHtml(value).replace(/\n/g, "<br>");
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatLessonLabel(slug) {
    var match = String(slug || "").match(/^l(\d+)e(\d+[a-z]*)$/i);
    if (!match) return slug;
    return Number(match[1]) + "-" + match[2].toLowerCase();
  }
})();
