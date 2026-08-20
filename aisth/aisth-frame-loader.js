(function () {
  "use strict";

  var LESSON_SEQUENCE = [
    "l0e1", "l0e2",
    "l1e1", "l1e2", "l1e3", "l1e4",
    "l2e1", "l2e2", "l2e3",
    "l3e1", "l3e2", "l3e3", "l3e4",
    "l4e1", "l4e2", "l4e3",
    "l5e1", "l5e2", "l5e3", "l5e4",
    "l6e1", "l6e2", "l6e3", "l6e4", "l6e5",
    "l7e1", "l7e2", "l7e3",
    "l8e1", "l8e2", "l8e3", "l8e4", "l8e5", "l8e6", "l8e7",
    "l9e1"
  ];

  var DEFAULT_LESSON = "l0e1";
  var EXCEL_FILE = "LTRYI-grammar-lesson-questions.xlsx";
  var selectedLesson = pickSelectedLesson();
  var debugListState = { items: [], meta: null, emptyText: "문제 로드 대기 중" };
  var fallbackDebugPromise = null;

  window.AisthFrameLoader = {
    lessons: LESSON_SEQUENCE.slice(),
    selectedLesson: selectedLesson,
    normalizeLesson: normalizeLesson,
    setQuestionDebugList: setQuestionDebugList,
    clearQuestionDebugList: clearQuestionDebugList,
    loadExcelQuestionDebugList: loadExcelQuestionDebugList,
    requestQuestionJump: requestQuestionJump
  };

  writeSelectedLessonScript();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initJumpControl);
  } else {
    initJumpControl();
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
      .replace(/^aisth-/, "")
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

  function lessonScriptSrc(slug) {
    return "aisth-" + slug + ".js";
  }

  function writeSelectedLessonScript() {
    var src = lessonScriptSrc(selectedLesson);
    if (document.readyState === "loading") {
      document.write('<script src="' + src + '"><\/script>');
      return;
    }

    var script = document.createElement("script");
    script.src = src;
    document.head.appendChild(script);
  }

  function initJumpControl() {
    var select = document.getElementById("aisth-frame-lesson-select");
    if (!select) return;

    select.innerHTML = LESSON_SEQUENCE.map(function (slug) {
      return '<option value="' + slug + '">' + formatLessonLabel(slug) + '</option>';
    }).join("");
    select.value = selectedLesson;

    select.addEventListener("change", function () {
      var nextLesson = normalizeLesson(select.value) || DEFAULT_LESSON;
      var url = new URL(window.location.href);
      url.searchParams.set("lesson", nextLesson);
      url.searchParams.delete("slug");
      url.searchParams.delete("target");
      url.searchParams.delete("key");
      window.location.assign(url.toString());
    });

    renderQuestionDebugList();
    wireQuestionDebugJumps();
    ensureFallbackQuestionDebugList();
  }


  function setQuestionDebugList(items, meta) {
    debugListState.items = Array.isArray(items) ? items.slice() : [];
    debugListState.meta = meta || null;
    debugListState.emptyText = meta && meta.emptyText ? String(meta.emptyText) : "문제 로드 대기 중";
    renderQuestionDebugList();
    ensureFallbackQuestionDebugList();
  }
  function clearQuestionDebugList() {
    debugListState.items = [];
    debugListState.meta = null;
    debugListState.emptyText = "문제 로드 대기 중";
    renderQuestionDebugList();
    ensureFallbackQuestionDebugList();
  }
  function renderQuestionDebugList() {
    var panel = document.getElementById("aisth-dev-question-list");
    if (!panel) return;

    var body = panel.querySelector("[data-aisth-dev-body]");
    var metaEl = panel.querySelector("[data-aisth-dev-meta]");
    if (!body) return;

    var items = debugListState.items || [];
    if (metaEl) {
      var label = debugListState.meta && debugListState.meta.label ? String(debugListState.meta.label) : formatLessonLabel(selectedLesson);
      metaEl.textContent = label + " / " + items.length;
    }

    if (!items.length) {
      body.innerHTML = '<div class="aisth-dev-empty">' + escapeHtml(debugListState.emptyText || "문제 로드 대기 중") + '</div>';
      return;
    }

    body.innerHTML = '<ol class="aisth-dev-qa-list">' + items.map(function (item, idx) {
      var no = item && item.no ? item.no : idx + 1;
      var question = item && item.question ? item.question : "";
      var answer = item && item.answer ? item.answer : "";
      return [
        '<li class="aisth-dev-qa-item" role="button" tabindex="0" data-aisth-dev-jump-index="' + idx + '">',
        '  <div class="aisth-dev-qa-q"><span class="aisth-dev-qa-no">Q' + escapeHtml(no) + '</span>' + escapeDebugText(question) + '</div>',
        '  <div class="aisth-dev-qa-a">A. ' + escapeDebugText(answer) + '</div>',
        '</li>'
      ].join("");
    }).join("") + '</ol>';
  }

  function wireQuestionDebugJumps() {
    var panel = document.getElementById("aisth-dev-question-list");
    if (!panel || panel.dataset.aisthJumpWired === "1") return;
    panel.dataset.aisthJumpWired = "1";

    panel.addEventListener("click", function (ev) {
      var item = findJumpItem(ev.target);
      if (!item) return;
      requestQuestionJump(Number(item.getAttribute("data-aisth-dev-jump-index")));
    });

    panel.addEventListener("keydown", function (ev) {
      if (ev.key !== "Enter" && ev.key !== " ") return;
      var item = findJumpItem(ev.target);
      if (!item) return;
      ev.preventDefault();
      requestQuestionJump(Number(item.getAttribute("data-aisth-dev-jump-index")));
    });
  }

  function findJumpItem(target) {
    if (!target || !target.closest) return null;
    return target.closest("[data-aisth-dev-jump-index]");
  }

  function requestQuestionJump(index) {
    if (!Number.isFinite(index) || index < 0) return false;

    var handled = false;
    if (window.AisthQuestionNavigator && typeof window.AisthQuestionNavigator.goTo === "function") {
      handled = window.AisthQuestionNavigator.goTo(index) === true;
    }

    if (!handled) {
      window.dispatchEvent(new CustomEvent("aisth:question-jump", {
        detail: { index: index, lesson: selectedLesson }
      }));
    }

    return true;
  }


  function ensureFallbackQuestionDebugList() {
    if (debugListState.items && debugListState.items.length) return;

    if (loadLocalQuestionDebugList()) return;
    if (fallbackDebugPromise) return;

    debugListState.emptyText = "엑셀에서 문제-답 불러오는 중";
    renderQuestionDebugList();

    fallbackDebugPromise = loadExcelQuestionDebugList().catch(function (err) {
      console.error("Aisth frame Excel debug load failed:", err);
      if (!debugListState.items.length) {
        debugListState.meta = { label: formatLessonLabel(selectedLesson), source: "excel" };
        debugListState.emptyText = "엑셀 문제-답 로드 실패";
        renderQuestionDebugList();
      }
    });
  }

  function loadLocalQuestionDebugList() {
    var parts = getSelectedLessonParts();
    if (!parts || !window.AisthLocalQuestionData || typeof window.AisthLocalQuestionData.getRows !== "function") return false;

    var rows = window.AisthLocalQuestionData.getRows(parts.lesson, parts.exercise);
    if (!rows || !rows.length) return false;

    var items = rows.map(function (row, idx) {
      return {
        no: cleanDebugText(row["QNumber"] || row["No"] || row["번호"] || row["Q"] || idx + 1),
        question: buildExcelDebugQuestion(row),
        answer: cleanDebugText(row["Answer"] || row["정답"] || "")
      };
    });

    setQuestionDebugList(items, {
      label: formatLessonLabel(selectedLesson),
      source: "local",
      title: "aisth-local-question-data.js"
    });
    return true;
  }
  async function loadExcelQuestionDebugList() {
    var parts = getSelectedLessonParts();
    if (!parts) {
      debugListState.emptyText = "선택한 lesson 형식 확인 필요";
      renderQuestionDebugList();
      return [];
    }

    var rows = await loadExcelRows(EXCEL_FILE);
    var items = buildExcelDebugItems(rows, parts);
    if (debugListState.items && debugListState.items.length) return items;

    if (!items.length) {
      debugListState.items = [];
      debugListState.meta = { label: formatLessonLabel(selectedLesson), source: "excel" };
      debugListState.emptyText = "엑셀에 해당 Lesson/Exercise 데이터 없음";
      renderQuestionDebugList();
      return items;
    }

    setQuestionDebugList(items, {
      label: formatLessonLabel(selectedLesson),
      source: "excel",
      title: EXCEL_FILE
    });
    return items;
  }

  function getSelectedLessonParts() {
    var m = String(selectedLesson || "").match(/^l(\d+)e(\d+)$/i);
    if (!m) return null;
    return { lesson: Number(m[1]), exercise: Number(m[2]) };
  }

  async function loadExcelRows(filename) {
    if (!window.XLSX) throw new Error("XLSX library is not loaded");
    var res = await fetch(filename, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch " + filename + ": " + res.status);
    var buffer = await res.arrayBuffer();
    var wb = XLSX.read(buffer, { type: "array" });
    var sheet = wb.Sheets[wb.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet, { defval: "" });
  }

  function buildExcelDebugItems(rows, parts) {
    return rows
      .filter(function (row) {
        return Number(row["Lesson"]) === parts.lesson && Number(row["Exercise"]) === parts.exercise;
      })
      .map(function (row, idx) {
        return {
          no: cleanDebugText(row["No"] || row["번호"] || row["Q"] || idx + 1),
          question: buildExcelDebugQuestion(row),
          answer: cleanDebugText(row["Answer"] || row["정답"] || "")
        };
      });
  }

  function buildExcelDebugQuestion(row) {
    var instruction = cleanDebugText(row["Instruction"] || row["지시문"] || "");
    var question = cleanDebugText(row["Question"] || row["문제"] || "");
    if (instruction && question) return instruction + "\n" + question;
    return question || instruction || "(문제 없음)";
  }

  function cleanDebugText(value) {
    return String(value == null ? "" : value)
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
    var m = String(slug || "").match(/^l(\d+)e(\d+[a-z]*)$/i);
    if (!m) return slug;
    return Number(m[1]) + "-" + m[2].toLowerCase();
  }
})();
