(() => {
  "use strict";

  const RANGE_ORDER = ["day", "week", "month", "year"];
  const RANGE_LOOP_MS = 6200;
  const API_ROOT = "https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app";
  const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const CALENDAR_DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const MONTH_LABELS = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
  ];
  const state = {
    range: "day",
    loopTimer: null,
    switchTimer: null,
    recordsByDate: new Map(),
    selectedDate: new Date(),
    loaded: false,
    now: new Date()
  };

  const pad = value => String(value).padStart(2, "0");
  const dayStart = date => new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dateKey = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const addDays = (date, amount) => {
    const next = new Date(date);
    next.setDate(next.getDate() + amount);
    return dayStart(next);
  };
  const formatNumber = value => new Intl.NumberFormat("en-US").format(Math.round(value || 0));

  function parseDateKey(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ""));
    if (!match) return null;
    const parsed = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    return dateKey(parsed) === value ? parsed : null;
  }

  function recordDateKey(timestamp) {
    const parsed = new Date(timestamp);
    if (!Number.isNaN(parsed.getTime())) return dateKey(parsed);
    const fallback = String(timestamp || "").slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(fallback) ? fallback : "";
  }

  function getRangeMatches(subcategory, lessonNo) {
    const manager = window.DayManager;
    if (!manager || !subcategory || !Number.isInteger(lessonNo) || lessonNo < 1) return [];

    return manager.listLevels(subcategory).flatMap(level => {
      const range = manager.getRange(subcategory, level);
      if (!range || lessonNo < range.start || lessonNo > range.end) return [];
      return [{
        level,
        day: lessonNo - range.start + 1
      }];
    });
  }

  function classifySubject(category, subcategory) {
    const value = `${category || ""} ${subcategory || ""}`.toLowerCase();
    if (value.includes("\uB2E8\uC5B4") || value.includes("\uC5F0\uC5B4") || value.includes("vocab")) return "word";
    if (value.includes("\uBB38\uBC95") || value.includes("grammar")) return "grammar";
    if (value.includes("\uAD6C\uBB38") || value.includes("syntax") || value.includes("pattern")) return "syntax";
    if (value.includes("\uB3C5\uD574") || value.includes("reading")) return "reading";
    if (value.includes("\uC4F0\uAE30") || value.includes("writing")) return "writing";
    if (value.includes("\uBAA8\uC758") || value.includes("mock")) return "mock";
    return "misc";
  }

  function createActivity(item, order) {
    const manager = window.DayManager;
    const rawSubcategory = String(item?.Subcategory || "").trim();
    const canonical = manager?.resolveSubcategoryName(rawSubcategory) || rawSubcategory || "MISC";
    const category = manager?.getCategoryBySubcategory(canonical) || "";
    const lessonValue = Number(item?.LessonNo);
    const lessonNo = Number.isInteger(lessonValue) && lessonValue > 0 ? lessonValue : null;
    const matches = getRangeMatches(canonical, lessonNo);
    const preciseMatch = matches.length === 1 ? matches[0] : null;
    const timestamp = new Date(item?.Timestamp).getTime();
    const scoreValue = item?.Score !== null && item?.Score !== "" ? Number(item.Score) : NaN;
    const hasScore = Number.isFinite(scoreValue);
    const fallbackId = item?.HWIPId || item?.id || `${item?.Timestamp || "record"}-${order}`;

    return {
      unitKey: lessonNo ? `${canonical}|${lessonNo}` : `row|${fallbackId}`,
      subject: rawSubcategory || canonical,
      canonical,
      category,
      subjectClass: classifySubject(category, canonical),
      lessonNo,
      level: preciseMatch?.level || "",
      day: preciseMatch?.day || null,
      hwType: String(item?.HWType || "").trim(),
      timestamp: Number.isFinite(timestamp) ? timestamp : order,
      hasScore,
      score: hasScore ? scoreValue : 0,
      scoreTimestamp: hasScore && Number.isFinite(timestamp) ? timestamp : order,
      rows: [item]
    };
  }

  function mergeActivity(current, incoming) {
    current.rows.push(...incoming.rows);
    if (incoming.timestamp >= current.timestamp) {
      current.timestamp = incoming.timestamp;
      current.hwType = incoming.hwType || current.hwType;
    }
    if (incoming.hasScore && (!current.hasScore || incoming.scoreTimestamp >= current.scoreTimestamp)) {
      current.hasScore = true;
      current.score = incoming.score;
      current.scoreTimestamp = incoming.scoreTimestamp;
    }
    return current;
  }

  function indexRecords(items) {
    const buckets = new Map();

    items.forEach((item, order) => {
      const key = recordDateKey(item?.Timestamp);
      if (!key) return;
      const activity = createActivity(item, order);
      const bucket = buckets.get(key) || new Map();
      const current = bucket.get(activity.unitKey);
      bucket.set(activity.unitKey, current ? mergeActivity(current, activity) : activity);
      buckets.set(key, bucket);
    });

    state.recordsByDate.clear();
    buckets.forEach((bucket, key) => {
      const activities = Array.from(bucket.values()).sort((a, b) => {
        if (a.subject !== b.subject) return a.subject.localeCompare(b.subject);
        if ((a.lessonNo || 0) !== (b.lessonNo || 0)) return (a.lessonNo || 0) - (b.lessonNo || 0);
        return a.timestamp - b.timestamp;
      });
      const scored = activities.filter(activity => activity.hasScore);
      state.recordsByDate.set(key, {
        activities,
        count: activities.length,
        subjects: new Set(activities.map(activity => activity.subject)).size,
        scoredCount: scored.length,
        score: scored.reduce((sum, activity) => sum + activity.score, 0)
      });
    });
  }

  function selectInitialDate(requestedDate) {
    if (requestedDate) {
      state.selectedDate = requestedDate;
      return;
    }

    const todayKey = dateKey(state.now);
    if (state.recordsByDate.has(todayKey)) {
      state.selectedDate = dayStart(state.now);
      return;
    }

    const latestKey = Array.from(state.recordsByDate.keys())
      .filter(key => key <= todayKey)
      .sort()
      .at(-1);
    state.selectedDate = parseDateKey(latestKey) || dayStart(state.now);
  }

  function startOfWeek(date) {
    const current = dayStart(date);
    const mondayOffset = (current.getDay() + 6) % 7;
    return addDays(current, -mondayOffset);
  }

  function rangeBounds(range) {
    const anchor = state.selectedDate;
    if (range === "year") {
      return {
        start: new Date(anchor.getFullYear(), 0, 1),
        end: new Date(anchor.getFullYear(), 11, 31)
      };
    }
    if (range === "month") {
      return {
        start: new Date(anchor.getFullYear(), anchor.getMonth(), 1),
        end: new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0)
      };
    }
    if (range === "week") {
      const start = startOfWeek(anchor);
      return { start, end: addDays(start, 6) };
    }
    return { start: dayStart(anchor), end: dayStart(anchor) };
  }

  function dateState(date, { outside = false } = {}) {
    if (outside) return "outside";
    if (!state.loaded) return "unknown";
    if (state.recordsByDate.has(dateKey(date))) return "active";

    const current = dayStart(date);
    const today = dayStart(state.now);
    if (current < today) return "missed";
    if (current.getTime() === today.getTime()) return "today";
    return "future";
  }

  function metricsBetween(start, end) {
    const metrics = {
      activityCount: 0,
      activeDays: 0,
      scoredCount: 0,
      score: 0,
      subjects: new Set()
    };

    for (let date = dayStart(start); date <= end; date = addDays(date, 1)) {
      const entry = state.recordsByDate.get(dateKey(date));
      if (!entry) continue;
      metrics.activityCount += entry.count;
      metrics.activeDays += 1;
      metrics.scoredCount += entry.scoredCount;
      metrics.score += entry.score;
      entry.activities.forEach(activity => metrics.subjects.add(activity.subject));
    }
    return metrics;
  }

  function activitiesBetween(start, end) {
    const activities = [];
    for (let date = dayStart(start); date <= end; date = addDays(date, 1)) {
      const entry = state.recordsByDate.get(dateKey(date));
      if (entry) activities.push(...entry.activities);
    }
    return activities;
  }

  function averageActiveDayUnits() {
    const counts = Array.from(state.recordsByDate.values())
      .map(entry => entry.count)
      .filter(count => count > 0);
    if (!counts.length) return 0;
    return counts.reduce((sum, count) => sum + count, 0) / counts.length;
  }

  function averageActiveWeekUnits() {
    const weeks = new Map();
    state.recordsByDate.forEach((entry, key) => {
      const date = parseDateKey(key);
      if (!date) return;
      const weekKey = dateKey(startOfWeek(date));
      weeks.set(weekKey, (weeks.get(weekKey) || 0) + entry.count);
    });
    const counts = Array.from(weeks.values()).filter(count => count > 0);
    if (!counts.length) return 0;
    return counts.reduce((sum, count) => sum + count, 0) / counts.length;
  }

  function averageWordLevel(activities) {
    const scale = ["A1", "A2", "B1", "B2", "C1"];
    const values = activities
      .filter(activity => activity.subjectClass === "word")
      .map(activity => scale.indexOf(activity.level))
      .filter(index => index >= 0);
    if (!values.length) return "\u2014";
    const average = values.reduce((sum, value) => sum + value, 0) / values.length;
    return scale[Math.round(average)];
  }

  function rankForPercent(percent, activityCount) {
    if (!activityCount) return { label: "\u2014", className: "none" };
    if (percent >= 140) return { label: "S", className: "s" };
    if (percent >= 100) return { label: "A", className: "a" };
    if (percent >= 70) return { label: "B", className: "b" };
    return { label: "C", className: "c" };
  }

  function rankForDailyCount(activityCount) {
    if (!activityCount) return { label: "\u2014", className: "none" };
    if (activityCount >= 6) return { label: "S", className: "s" };
    if (activityCount === 5) return { label: "A", className: "a" };
    if (activityCount >= 3) return { label: "B", className: "b" };
    return { label: "C", className: "c" };
  }

  function renderPerformanceHologram(view, range) {
    const bounds = rangeBounds(range);
    const metrics = metricsBetween(bounds.start, bounds.end);
    const activities = activitiesBetween(bounds.start, bounds.end);
    const baseline = range === "week" ? averageActiveWeekUnits() : averageActiveDayUnits();
    const percent = baseline
      ? Math.round((metrics.activityCount / baseline) * 100)
      : metrics.activityCount
        ? 100
        : 0;
    const rank = range === "day"
      ? rankForDailyCount(metrics.activityCount)
      : rankForPercent(percent, metrics.activityCount);
    const hologram = document.createElement("section");
    hologram.className = `grades-rank-hologram is-${range} rank-${rank.className}`;

    const rankPanel = document.createElement("div");
    rankPanel.className = "grades-holo-rank";
    appendText(rankPanel, "span", "", range === "week" ? "WEEKLY RANK" : "DAILY RANK");
    appendText(rankPanel, "strong", "", rank.label);
    appendText(
      rankPanel,
      "small",
      "",
      range === "week" ? "\uC8FC\uAC04 \uC131\uC2E4\uB3C4" : "\uC774 \uB0A0\uC758 \uC131\uC2E4\uB3C4"
    );
    hologram.appendChild(rankPanel);

    const data = document.createElement("div");
    data.className = "grades-holo-data";
    const comparison = document.createElement("article");
    appendText(comparison, "span", "", range === "week" ? "\uD3C9\uC18C \uD65C\uB3D9 \uC8FC\uAC04 \uB300\uBE44" : "\uD3C9\uC18C \uD65C\uB3D9\uC77C \uB300\uBE44");
    appendText(comparison, "strong", "", metrics.activityCount ? `${percent}%` : "\u2014");
    data.appendChild(comparison);

    const difficulty = document.createElement("article");
    appendText(difficulty, "span", "", "\uD3C9\uADE0 \uB2E8\uC5B4 \uB09C\uC774\uB3C4");
    appendText(difficulty, "strong", "", averageWordLevel(activities));
    data.appendChild(difficulty);

    const volume = document.createElement("article");
    appendText(volume, "span", "", range === "week" ? "\uD65C\uB3D9\uC77C" : "\uD559\uC2B5 \uC644\uB8CC");
    appendText(
      volume,
      "strong",
      "",
      range === "week" ? `${metrics.activeDays}\uC77C` : `${metrics.activityCount}\uAC1C`
    );
    data.appendChild(volume);
    hologram.appendChild(data);
    view.appendChild(hologram);
  }

  function periodLabel(range) {
    const bounds = rangeBounds(range);
    if (range === "day") {
      return `${MONTH_LABELS[bounds.start.getMonth()]} ${bounds.start.getDate()} \u00B7 ${DAY_LABELS[bounds.start.getDay()]}`;
    }
    if (range === "week") {
      return `${bounds.start.getMonth() + 1}.${bounds.start.getDate()} \u2014 ${bounds.end.getMonth() + 1}.${bounds.end.getDate()}`;
    }
    if (range === "month") {
      return `${MONTH_LABELS[bounds.start.getMonth()]} ${bounds.start.getFullYear()}`;
    }
    return `${bounds.start.getFullYear()} YEAR`;
  }

  function updateSummary() {
    const bounds = rangeBounds(state.range);
    const metrics = metricsBetween(bounds.start, bounds.end);
    const label = document.getElementById("gradesPeriodLabel");
    const score = document.getElementById("gradesPeriodScore");
    const count = document.getElementById("gradesPeriodCount");

    if (label) label.textContent = periodLabel(state.range);
    if (score) {
      const hasScore = state.loaded && metrics.scoredCount;
      score.textContent = hasScore ? `${formatNumber(metrics.score)}\uC810` : "";
      score.hidden = !hasScore;
    }
    if (count) {
      if (!state.loaded) {
        count.textContent = "\uAE30\uB85D\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694";
      } else if (state.range === "day") {
        count.textContent = `${metrics.activityCount}\uAC1C \uD559\uC2B5 \u00B7 ${metrics.subjects.size}\uACFC\uBAA9`;
      } else {
        count.textContent = `${metrics.activityCount}\uAC1C \uD559\uC2B5 \u00B7 ${metrics.activeDays}\uC77C \uD65C\uB3D9`;
      }
    }
  }

  function appendText(parent, tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    element.textContent = text;
    parent.appendChild(element);
    return element;
  }

  function activityDetail(activity) {
    if (activity.level && activity.day) return `${activity.level} \u00B7 DAY ${activity.day}`;
    if (activity.lessonNo) return `LESSON ${activity.lessonNo}`;
    return activity.hwType || "\uD559\uC2B5 \uAE30\uB85D";
  }

  function setSelectedDate(date, { drillDown = true } = {}) {
    state.selectedDate = dayStart(date);
    setRange(drillDown ? "day" : state.range);
  }

  function renderDay(view) {
    const date = dayStart(state.selectedDate);
    const entry = state.recordsByDate.get(dateKey(date));
    renderPerformanceHologram(view, "day");
    const wrapper = document.createElement("section");
    wrapper.className = "grades-day-detail";

    const navigator = document.createElement("div");
    navigator.className = "grades-day-navigator";
    const previous = appendText(navigator, "button", "grades-day-arrow", "\u2039");
    previous.type = "button";
    previous.setAttribute("aria-label", "Previous day");
    previous.addEventListener("click", () => setSelectedDate(addDays(date, -1), { drillDown: false }));

    const heading = document.createElement("div");
    appendText(heading, "span", "", "DAILY RESULT");
    appendText(
      heading,
      "strong",
      "",
      `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`
    );
    navigator.appendChild(heading);

    const next = appendText(navigator, "button", "grades-day-arrow", "\u203A");
    next.type = "button";
    next.setAttribute("aria-label", "Next day");
    next.disabled = date >= dayStart(state.now);
    next.addEventListener("click", () => setSelectedDate(addDays(date, 1), { drillDown: false }));
    wrapper.appendChild(navigator);

    const list = document.createElement("div");
    list.className = "grades-day-list";

    if (!state.loaded || !entry?.count) {
      const empty = document.createElement("div");
      empty.className = "grades-day-empty";
      appendText(empty, "i", "", state.loaded ? "\u00B7" : "!");
      appendText(
        empty,
        "strong",
        "",
        state.loaded
          ? "\uC774 \uB0A0\uC5D0 \uC644\uB8CC\uD55C \uD559\uC2B5\uC774 \uC5C6\uC5B4\uC694"
          : "\uD559\uC2B5 \uAE30\uB85D\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694"
      );
      appendText(empty, "span", "", state.loaded ? "NO ACTIVITY RECORDED" : "CONNECTION ERROR");
      list.appendChild(empty);
    } else {
      entry.activities.forEach((activity, index) => {
        const item = document.createElement("article");
        item.className = `grades-day-item subject-${activity.subjectClass}`;
        item.style.setProperty("--record-index", String(index));

        appendText(item, "i", "grades-subject-marker", "");
        const copy = document.createElement("div");
        copy.className = "grades-day-item-copy";
        appendText(copy, "strong", "", activity.subject);
        appendText(copy, "span", "", activityDetail(activity));
        item.appendChild(copy);

        const result = document.createElement("div");
        result.className = `grades-day-item-result${activity.hasScore ? " has-score" : ""}`;
        appendText(result, "strong", "", activity.hasScore ? formatNumber(activity.score) : "\u2713");
        appendText(result, "small", "", activity.hasScore ? "\uC810" : "\uC644\uB8CC");
        item.appendChild(result);
        list.appendChild(item);
      });
    }

    wrapper.appendChild(list);
    view.appendChild(wrapper);
  }

  function renderWeek(view) {
    const bounds = rangeBounds("week");
    renderPerformanceHologram(view, "week");
    const grid = document.createElement("div");
    grid.className = "grades-week-grid";

    for (let index = 0; index < 7; index += 1) {
      const date = addDays(bounds.start, index);
      const entry = state.recordsByDate.get(dateKey(date));
      const kind = dateState(date);
      const card = document.createElement("button");
      card.type = "button";
      const weekendClass = date.getDay() === 0
        ? "is-sunday"
        : date.getDay() === 6
          ? "is-saturday"
          : "";
      card.className = `grades-week-day is-${kind} ${weekendClass}`.trim();
      card.style.setProperty("--record-index", String(index));
      card.title = dateKey(date);
      card.setAttribute("aria-label", `${dateKey(date)} ${entry?.count || 0}`);
      card.addEventListener("click", () => setSelectedDate(date));

      appendText(card, "span", "grades-week-name", DAY_LABELS[date.getDay()]);
      appendText(card, "strong", "grades-week-number", String(date.getDate()));

      const stack = document.createElement("div");
      stack.className = "grades-week-stack";
      const visible = (entry?.activities || []).slice(0, 12);
      visible.forEach((activity, blockIndex) => {
        const block = document.createElement("i");
        block.className = `grades-week-block subject-${activity.subjectClass}${activity.hasScore ? " has-score" : ""}`;
        block.style.setProperty("--drop-index", String(blockIndex));
        block.style.setProperty("--day-index", String(index));
        stack.appendChild(block);
      });
      if ((entry?.count || 0) > visible.length) {
        appendText(stack, "b", "", `+${entry.count - visible.length}`);
      }
      if (!entry?.count) appendText(stack, "i", "grades-week-empty-mark", "");
      card.appendChild(stack);

      appendText(card, "small", "grades-week-count", entry?.count ? `${entry.count}` : "\u2014");
      grid.appendChild(card);
    }

    view.appendChild(grid);
  }

  function bubbleSize(count, compact = false) {
    if (compact) {
      if (count < 1) return 3;
      if (count === 1) return 5;
      if (count === 2) return 7;
      return 8.5;
    }
    if (count < 1) return 7;
    if (count === 1) return 14;
    if (count === 2) return 19;
    if (count === 3) return 24;
    return 30;
  }

  function primarySubjectClass(entry) {
    return entry?.activities?.[0]?.subjectClass || "misc";
  }

  function shiftSelectedMonth(amount) {
    const anchor = state.selectedDate;
    const targetStart = new Date(anchor.getFullYear(), anchor.getMonth() + amount, 1);
    const targetEnd = new Date(targetStart.getFullYear(), targetStart.getMonth() + 1, 0);
    state.selectedDate = new Date(
      targetStart.getFullYear(),
      targetStart.getMonth(),
      Math.min(anchor.getDate(), targetEnd.getDate())
    );
    setRange("month");
  }

  function renderMonth(view) {
    const year = state.selectedDate.getFullYear();
    const month = state.selectedDate.getMonth();
    const first = new Date(year, month, 1);
    const start = startOfWeek(first);
    const wrapper = document.createElement("section");
    wrapper.className = "grades-month-view";
    const navigator = document.createElement("div");
    navigator.className = "grades-month-navigator";
    const previous = appendText(navigator, "button", "", "\u2039");
    previous.type = "button";
    previous.setAttribute("aria-label", "Previous month");
    previous.addEventListener("click", () => shiftSelectedMonth(-1));
    appendText(navigator, "span", "", "MONTH");
    const next = appendText(navigator, "button", "", "\u203A");
    next.type = "button";
    next.setAttribute("aria-label", "Next month");
    next.addEventListener("click", () => shiftSelectedMonth(1));
    wrapper.appendChild(navigator);

    const calendar = document.createElement("div");
    calendar.className = "grades-month-grid";

    CALENDAR_DAY_LABELS.forEach((label, index) => {
      const weekday = appendText(calendar, "span", "grades-month-weekday", label.slice(0, 1));
      if (index === 5) weekday.classList.add("is-saturday");
      if (index === 6) weekday.classList.add("is-sunday");
    });

    for (let index = 0; index < 42; index += 1) {
      const date = addDays(start, index);
      const outside = date.getMonth() !== month;
      const entry = state.recordsByDate.get(dateKey(date));
      const visibleEntry = outside ? null : entry;
      const count = visibleEntry?.count || 0;
      const kind = dateState(date, { outside });
      const cell = document.createElement("button");
      cell.type = "button";
      const weekendClass = date.getDay() === 0
        ? "is-sunday"
        : date.getDay() === 6
          ? "is-saturday"
          : "";
      cell.className = `grades-month-day is-${kind} ${weekendClass}`.trim();
      cell.style.setProperty("--record-index", String(index));
      cell.title = `${dateKey(date)} \u00B7 ${count}`;
      cell.setAttribute("aria-label", `${dateKey(date)} ${count}`);
      cell.addEventListener("click", () => setSelectedDate(date));

      appendText(cell, "span", "grades-month-number", String(date.getDate()));
      const bubble = appendText(cell, "i", `grades-activity-bubble subject-${primarySubjectClass(visibleEntry)}`, count > 1 ? String(count) : "");
      bubble.style.setProperty("--bubble-size", `${bubbleSize(count)}px`);
      bubble.classList.toggle("has-score", Boolean(visibleEntry?.scoredCount));
      cell.appendChild(bubble);
      calendar.appendChild(cell);
    }

    wrapper.appendChild(calendar);
    view.appendChild(wrapper);
  }

  function renderYear(view) {
    const year = state.selectedDate.getFullYear();
    const grid = document.createElement("div");
    grid.className = "grades-year-grid";

    for (let month = 0; month < 12; month += 1) {
      const card = document.createElement("section");
      card.className = "grades-year-month";
      card.style.setProperty("--record-index", String(month));
      appendText(card, "strong", "grades-year-label", MONTH_LABELS[month]);

      const dots = document.createElement("div");
      dots.className = "grades-year-dots";
      const first = new Date(year, month, 1);
      const start = startOfWeek(first);

      for (let index = 0; index < 42; index += 1) {
        const date = addDays(start, index);
        const outside = date.getMonth() !== month;
        const entry = state.recordsByDate.get(dateKey(date));
        const count = outside ? 0 : entry?.count || 0;
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = [
          "grades-year-dot",
          outside ? "is-outside" : `is-${dateState(date)}`,
          `subject-${primarySubjectClass(entry)}`,
          entry?.scoredCount ? "has-score" : ""
        ].join(" ");
        dot.title = `${dateKey(date)} \u00B7 ${count}`;
        dot.setAttribute("aria-label", `${dateKey(date)} ${count}`);
        dot.style.setProperty("--bubble-size", `${bubbleSize(count, true)}px`);
        dot.disabled = outside;
        if (!outside) dot.addEventListener("click", () => setSelectedDate(date));
        dots.appendChild(dot);
      }

      card.appendChild(dots);
      grid.appendChild(card);
    }

    view.appendChild(grid);
  }

  function renderLegend() {
    const legend = document.getElementById("gradesRecordLegend");
    if (!legend) return;
    legend.replaceChildren();
    legend.hidden = state.range === "day";
    if (legend.hidden) return;

    if (state.range === "week") {
      const bounds = rangeBounds("week");
      const subjects = new Map();
      for (let date = dayStart(bounds.start); date <= bounds.end; date = addDays(date, 1)) {
        const entry = state.recordsByDate.get(dateKey(date));
        entry?.activities.forEach(activity => {
          if (!subjects.has(activity.subjectClass)) {
            subjects.set(activity.subjectClass, activity.subject);
          }
        });
      }

      appendText(legend, "span", "grades-legend-caption", "\uACFC\uBAA9");
      Array.from(subjects.entries()).slice(0, 4).forEach(([subjectClass, label]) => {
        const item = document.createElement("span");
        item.className = `grades-legend-subject subject-${subjectClass}`;
        appendText(item, "i", "", "");
        item.appendChild(document.createTextNode(label));
        legend.appendChild(item);
      });
      if (!subjects.size) appendText(legend, "span", "grades-legend-empty", "\uD65C\uB3D9 \uC5C6\uC74C");
      if (subjects.size > 4) appendText(legend, "span", "grades-legend-more", `+${subjects.size - 4}`);
      return;
    }

    const caption = appendText(legend, "span", "grades-legend-caption", "\uD559\uC2B5 \uC218");
    caption.setAttribute("aria-hidden", "true");
    [["is-one", "1"], ["is-two", "2"], ["is-many", "4+"]].forEach(([className, label]) => {
      const item = document.createElement("span");
      item.className = `grades-legend-size ${className}`;
      appendText(item, "i", "", "");
      item.appendChild(document.createTextNode(label));
      legend.appendChild(item);
    });

    const scored = document.createElement("span");
    scored.className = "grades-legend-scored";
    appendText(scored, "i", "", "");
    scored.appendChild(document.createTextNode("\uC810\uC218 \uC788\uC74C"));
    legend.appendChild(scored);
  }

  function renderRange() {
    const view = document.getElementById("gradesPeriodView");
    if (!view) return;
    view.replaceChildren();
    view.dataset.range = state.range;

    if (state.range === "year") renderYear(view);
    else if (state.range === "month") renderMonth(view);
    else if (state.range === "week") renderWeek(view);
    else renderDay(view);

    updateSummary();
    renderLegend();
    document.querySelectorAll("[data-record-range]").forEach(button => {
      const active = button.dataset.recordRange === state.range;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });
  }

  function restartCycleBar() {
    const bar = document.querySelector(".grades-record-cycle span");
    if (!bar) return;
    bar.classList.remove("is-running");
    void bar.offsetWidth;
    bar.classList.add("is-running");
  }

  function setRange(range, { animate = true, restartLoop = true } = {}) {
    if (!RANGE_ORDER.includes(range)) return;
    const shell = document.getElementById("gradesRecordShell");
    const changed = state.range !== range;
    state.range = range;

    window.clearTimeout(state.switchTimer);
    if (animate && changed && shell) {
      shell.classList.add("is-switching");
      state.switchTimer = window.setTimeout(() => {
        renderRange();
        shell.classList.remove("is-switching");
        restartCycleBar();
      }, 150);
    } else {
      renderRange();
      restartCycleBar();
    }

    if (restartLoop) startRangeLoop();
  }

  function startRangeLoop() {
    window.clearInterval(state.loopTimer);
    state.loopTimer = window.setInterval(() => {
      const currentIndex = RANGE_ORDER.indexOf(state.range);
      const next = RANGE_ORDER[(currentIndex + 1) % RANGE_ORDER.length];
      setRange(next, { restartLoop: false });
    }, RANGE_LOOP_MS);
    restartCycleBar();
  }

  function bindControls() {
    document.querySelectorAll("[data-record-range]").forEach(button => {
      button.addEventListener("click", () => setRange(button.dataset.recordRange));
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) window.clearInterval(state.loopTimer);
      else startRangeLoop();
    });
  }

  async function loadItems(userId) {
    if (!userId) throw new Error("Missing user id");
    const response = await fetch(`${API_ROOT}/api/getHWPlus?userId=${encodeURIComponent(userId)}`);
    if (!response.ok) throw new Error(`Grades request failed (${response.status})`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Grades response is not an array");
    return data;
  }

  async function init() {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id") || "";
    const requestedRange = RANGE_ORDER.includes(params.get("range")) ? params.get("range") : "day";
    const requestedDate = parseDateKey(params.get("date"));
    state.now = new Date();
    bindControls();

    try {
      const items = await loadItems(userId);
      indexRecords(items);
      state.loaded = true;
    } catch (error) {
      console.error(error);
      state.loaded = false;
    }

    selectInitialDate(requestedDate);
    setRange(requestedRange, { animate: false, restartLoop: false });
    startRangeLoop();
  }

  window.addEventListener("DOMContentLoaded", init);
})();
