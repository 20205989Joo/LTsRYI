(function () {
  "use strict";

  var FULL_TOUR_STORAGE_KEY = "AisthFullTourState";
  var FLOW_STORAGE_KEY = "AisthRound2FlowMap";
  var FULL_TOUR_SEQUENCE = [
    "l0e1", "l0e2",
    "l1e1", "l1e2", "l1e3", "l1e4",
    "l2e1", "l2e2", "l2e3",
    "l3e1", "l3e2", "l3e3", "l3e4", "l3e5",
    "l4e1", "l4e2", "l4e3",
    "l5e1", "l5e2", "l5e3", "l5e4",
    "l6e1", "l6e2", "l6e3", "l6e4", "l6e5",
    "l7e1", "l7e2", "l7e3",
    "l8e1", "l8e2", "l8e3", "l8e4", "l8e5", "l8e6", "l8e7",
    "l9e1"
  ];

  var PAGE_BY_SLUG = FULL_TOUR_SEQUENCE.reduce(function (map, slug) {
    map[slug] = "aisth-" + slug + ".html";
    return map;
  }, {});

  var LESSON_CHOICES = FULL_TOUR_SEQUENCE.map(function (slug) {
    var m = slug.match(/^l(\d+)e(.+)$/i);
    var lesson = m ? m[1] : "";
    var exercise = m ? m[2].toUpperCase() : "";
    return {
      id: slug,
      short: lesson + "-" + String(exercise).toLowerCase(),
      label: "L" + lesson + "-E" + exercise,
      page: PAGE_BY_SLUG[slug]
    };
  });

  var state = {
    activeChoiceId: ""
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function readParams() {
    try {
      return new URLSearchParams(window.location.search || "");
    } catch (_) {
      return new URLSearchParams();
    }
  }

  function groupByLesson(choices) {
    var map = {};
    choices.forEach(function (choice) {
      var m = String(choice.id || "").match(/^l(\d+)e/i);
      var lesson = m ? Number(m[1]) : 0;
      if (!map[lesson]) map[lesson] = [];
      map[lesson].push(choice);
    });

    function parseExerciseOrder(id) {
      var m = String(id || "").match(/^l\d+e(\d+)([a-z]*)$/i);
      if (!m) return { n: 0, suffix: "" };
      return {
        n: Number(m[1]) || 0,
        suffix: String(m[2] || "").toLowerCase()
      };
    }

    return Object.keys(map)
      .map(function (k) { return Number(k); })
      .sort(function (a, b) { return a - b; })
      .map(function (lessonNo) {
        var items = map[lessonNo].slice().sort(function (a, b) {
          var ao = parseExerciseOrder(a.id);
          var bo = parseExerciseOrder(b.id);
          if (ao.n !== bo.n) return ao.n - bo.n;
          return ao.suffix.localeCompare(bo.suffix);
        });
        return { lessonNo: lessonNo, items: items };
      });
  }

  function buildTargetUrl(choice) {
    var target = new URL(choice.page, window.location.href);
    var params = readParams();
    var userId = String(params.get("id") || "").trim();
    if (userId) target.searchParams.set("id", userId);
    target.searchParams.delete("round2");
    target.searchParams.delete("round2Script");
    target.searchParams.delete("fullTour");
    target.searchParams.delete("imsi_qcap");
    target.searchParams.delete("alphaRound2");
    target.searchParams.delete("alphaFrom");
    target.searchParams.delete("dishQuizKey");
    return target.toString();
  }

  function getTourStartIndexBySlug(slug) {
    var s = String(slug || "").trim().toLowerCase();
    if (!s) return -1;
    return FULL_TOUR_SEQUENCE.indexOf(s);
  }

  function safeJsonSetSession(key, value) {
    try {
      sessionStorage.setItem(String(key || ""), JSON.stringify(value || {}));
    } catch (_) {}
  }

  function safeLocalRemove(key) {
    try {
      localStorage.removeItem(String(key || ""));
    } catch (_) {}
  }

  function safeSessionRemove(key) {
    try {
      sessionStorage.removeItem(String(key || ""));
    } catch (_) {}
  }

  function parsePositiveIntOr(raw, fallback) {
    var n = Number(raw);
    if (!isFinite(n) || n <= 0) return Number(fallback || 1);
    return Math.max(1, Math.floor(n));
  }

  function readDefaultTourQCap() {
    try {
      var raw = localStorage.getItem("alphaTourQCap");
      return parsePositiveIntOr(raw, 1);
    } catch (_) {
      return 1;
    }
  }

  function buildTourStartUrl(startSlug) {
    var slug = String(startSlug || "").trim().toLowerCase();
    if (!slug) slug = FULL_TOUR_SEQUENCE[0];
    var target = new URL(PAGE_BY_SLUG[slug] || ("aisth-" + slug + ".html"), window.location.href);
    var params = readParams();
    var userId = String(params.get("id") || "").trim();
    var qcap = readDefaultTourQCap();
    if (userId) target.searchParams.set("id", userId);
    target.searchParams.set("fullTour", "1");
    target.searchParams.set("imsi_qcap", String(qcap));
    target.searchParams.delete("key");
    target.searchParams.delete("round2");
    target.searchParams.delete("round2Script");
    target.searchParams.delete("alphaRound2");
    target.searchParams.delete("alphaFrom");
    target.searchParams.delete("dishQuizKey");
    return target.toString();
  }

  function startTourFromSlug(startSlug) {
    var slug = String(startSlug || "").trim().toLowerCase();
    var startIndex = getTourStartIndexBySlug(slug);
    if (startIndex < 0) {
      slug = FULL_TOUR_SEQUENCE[0];
      startIndex = 0;
    }

    var qcap = readDefaultTourQCap();
    var initialState = {
      active: true,
      mode: "full-tour",
      index: startIndex,
      phase: "learn",
      qcap: qcap,
      startSlug: slug,
      sequence: FULL_TOUR_SEQUENCE.slice(),
      updatedAt: new Date().toISOString()
    };

    safeSessionRemove(FULL_TOUR_STORAGE_KEY);
    safeLocalRemove(FLOW_STORAGE_KEY);
    safeJsonSetSession(FULL_TOUR_STORAGE_KEY, initialState);
    setStatus("Starting Tour " + String(slug).toUpperCase() + "...");
    window.location.assign(buildTourStartUrl(slug));
  }

  function startFullTour() {
    startTourFromSlug(FULL_TOUR_SEQUENCE[0]);
  }

  function setStatus(message) {
    var statusEl = byId("leveljump-status");
    if (!statusEl) return;
    statusEl.textContent = message || "";
  }

  function goToLesson(choice) {
    if (!choice) return;
    state.activeChoiceId = choice.id;
    render();
    startTourFromSlug(choice.id);
  }

  function render() {
    var area = byId("quiz-area");
    if (!area) return;

    var grouped = groupByLesson(LESSON_CHOICES);
    var rowsHtml = grouped.map(function (group) {
      var buttonsHtml = group.items.map(function (choice) {
        var activeClass = state.activeChoiceId === choice.id ? " is-active" : "";
        return [
          '<button type="button" class="hex-btn' + activeClass + '" data-choice-id="' + choice.id + '" title="' + choice.label + '">',
          '  <span class="hex-main">' + choice.short + "</span>",
          "</button>"
        ].join("\n");
      }).join("\n");

      return [
        '<div class="lesson-row">',
        '  <div class="lesson-tag">L' + group.lessonNo + "</div>",
        '  <div class="hex-row">' + buttonsHtml + "</div>",
        "</div>"
      ].join("\n");
    }).join("\n");

    area.innerHTML = [
      '<div class="sheet-box">',
      '  <div class="sheet-head">Round1 Level Jump</div>',
      '  <div class="guide">Select a lesson to start tour.</div>',
      '  <div class="tour-row">',
      '    <button type="button" class="tour-btn" id="full-tour-btn">Full Tour</button>',
      "  </div>",
      '  <div class="lesson-grid">',
      rowsHtml,
      "  </div>",
      '  <div class="status-line" id="leveljump-status">Ready.</div>',
      "</div>"
    ].join("\n");

    Array.from(area.querySelectorAll("[data-choice-id]")).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = String(btn.getAttribute("data-choice-id") || "");
        var choice = LESSON_CHOICES.find(function (x) { return x.id === id; });
        goToLesson(choice);
      });
    });

    var fullTourBtn = byId("full-tour-btn");
    if (fullTourBtn) {
      fullTourBtn.addEventListener("click", function () {
        startFullTour();
      });
    }
  }

  function wireBackButton() {
    var backBtn = byId("back-btn");
    if (!backBtn) return;
    backBtn.addEventListener("click", function () {
      window.history.back();
    });
  }

  function start() {
    wireBackButton();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
