// dish-review.js

(function () {
  const API_BASE = "https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app";
  const REVIEW_SIZE = 10;
  const RECENT_DAY_LIMIT = 3;

  function parseDayNumber(raw) {
    if (raw === null || raw === undefined) return null;
    const digits = String(raw).replace(/[^0-9]/g, "");
    if (!digits) return null;
    const parsed = Number(digits);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function shuffle(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function getDayManager() {
    return window.DayManager || null;
  }

  function findSubcategoryByToken(token) {
    const dm = getDayManager();
    const target = String(token || "").trim();
    if (!target || !dm) return target;

    const subcategories =
      typeof dm.listSubcategories === "function" ? dm.listSubcategories() : [];

    return (
      subcategories.find(subcategory => {
        if (typeof dm.getSubcategoryToken !== "function") return false;
        return String(dm.getSubcategoryToken(subcategory) || "") === target;
      }) || target
    );
  }

  function getSubcategoryToken(subcategory) {
    const dm = getDayManager();
    if (!subcategory || !dm || typeof dm.getSubcategoryToken !== "function") {
      return String(subcategory || "");
    }
    return String(dm.getSubcategoryToken(subcategory) || subcategory);
  }

  function resolveSubcategory(subcategory) {
    const dm = getDayManager();
    if (!subcategory || !dm || typeof dm.resolveSubcategoryName !== "function") {
      return subcategory;
    }
    return dm.resolveSubcategoryName(subcategory) || subcategory;
  }

  function parseQuizKey(quizKey) {
    const raw = String(quizKey || "").trim();
    const parts = raw.split("_").filter(Boolean);
    const level = parts.find(part => /^[ABC][12]$/i.test(part)) || "";
    const dayPart = parts.find(part => /^Day\d+$/i.test(part)) || "";
    const day = parseDayNumber(dayPart);
    const subToken =
      parts.find(part => !/^(Vocabulary|quiz|Grammar|Reading|Syntax|Misc)$/i.test(part) &&
        !/^[ABC][12]$/i.test(part) &&
        !/^Day\d+$/i.test(part) &&
        !/^Lesson\d+$/i.test(part) &&
        !/^v\d+$/i.test(part)) || "Words";

    return {
      quizKey: raw,
      subToken,
      subcategory: findSubcategoryByToken(subToken),
      level: String(level || "").toUpperCase(),
      day
    };
  }

  async function fetchSubmittedRecords(userId) {
    const id = String(userId || "").trim();
    if (!id) return [];

    try {
      const response = await fetch(`${API_BASE}/api/getHWPlus?userId=${encodeURIComponent(id)}`);
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn("Review source load failed:", error);
      return [];
    }
  }

  function inferSubmittedDay(record, currentMeta) {
    const dm = getDayManager();
    const lessonNo = Number(record?.LessonNo);
    if (!Number.isFinite(lessonNo)) return null;

    const recordSubcategory = resolveSubcategory(record?.Subcategory || currentMeta.subcategory);
    const recordToken = getSubcategoryToken(recordSubcategory);
    if (recordToken !== currentMeta.subToken) return null;

    if (dm && typeof dm.inferLevel === "function") {
      const inferred = dm.inferLevel(recordSubcategory, lessonNo);
      if (inferred?.level && inferred?.day) {
        return {
          subcategory: inferred.subcategory || recordSubcategory,
          level: inferred.level,
          day: Number(inferred.day),
          lessonNo,
          timestamp: String(record?.Timestamp || "")
        };
      }
    }

    return null;
  }

  async function getRecentSubmittedDays({ userId, currentMeta, limit = RECENT_DAY_LIMIT }) {
    const records = await fetchSubmittedRecords(userId);
    const sorted = records
      .map(record => inferSubmittedDay(record, currentMeta))
      .filter(Boolean)
      .sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)));

    const picked = [];
    const seen = new Set();
    const currentKey = `${currentMeta.level}|${currentMeta.day}`;

    sorted.forEach(item => {
      const key = `${item.level}|${item.day}`;
      if (key === currentKey || seen.has(key)) return;
      seen.add(key);
      picked.push(item);
    });

    return picked.slice(0, limit);
  }

  async function buildReviewRows({
    userId,
    quizKey,
    level,
    day,
    loadRows,
    excludeWords = new Set(),
    limit = REVIEW_SIZE
  }) {
    const keyMeta = parseQuizKey(quizKey);
    const currentMeta = {
      ...keyMeta,
      level: String(level || keyMeta.level || "").toUpperCase(),
      day: parseDayNumber(day) ?? keyMeta.day
    };

    if (!currentMeta.level || !currentMeta.day || typeof loadRows !== "function") {
      return [];
    }

    const days = await getRecentSubmittedDays({ userId, currentMeta });
    const candidates = [];
    const seenWords = new Set(
      [...excludeWords].map(word => String(word || "").trim().toLowerCase()).filter(Boolean)
    );

    for (const dayMeta of days) {
      let rows = [];
      try {
        rows = await loadRows(dayMeta.level);
      } catch (error) {
        console.warn("Review workbook load failed:", error);
        continue;
      }
      rows
        .filter(row => parseDayNumber(row.Day) === Number(dayMeta.day))
        .filter(row => String(row.Word ?? "").trim() && String(row["Korean Meaning"] ?? "").trim())
        .forEach(row => {
          const word = String(row.Word).trim();
          const wordKey = word.toLowerCase();
          if (seenWords.has(wordKey)) return;
          seenWords.add(wordKey);
          candidates.push({
            ...row,
            __review: true,
            __reviewLevel: dayMeta.level,
            __reviewDay: dayMeta.day,
            __reviewLessonNo: dayMeta.lessonNo
          });
        });
    }

    return shuffle(candidates).slice(0, limit);
  }

  window.DishReview = {
    REVIEW_SIZE,
    RECENT_DAY_LIMIT,
    parseDayNumber,
    parseQuizKey,
    buildReviewRows,
    shuffle
  };
})();
