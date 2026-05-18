// dish-retake-lock.js

(function () {
  const STORAGE_KEY = "DishQuizRetakeLocks";
  const DEFAULT_LOCK_MS = 10 * 60 * 1000;
  const POPUP_ID = "dish-retake-lock-popup";
  const DEBUG_BUTTON_ID = "dish-retake-timer-reset";

  let activeTimer = null;
  let activePopupOptions = null;

  function normalizeQuizKey(quizKey) {
    return String(quizKey || "").trim();
  }

  function now() {
    return Date.now();
  }

  function readLocks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch (_) {
      return {};
    }
  }

  function writeLocks(locks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(locks));
  }

  function cleanupExpiredLocks(locks = readLocks()) {
    const current = now();
    let changed = false;

    Object.keys(locks).forEach(key => {
      const until = Number(locks[key]?.until || 0);
      if (!until || until <= current) {
        delete locks[key];
        changed = true;
      }
    });

    if (changed) writeLocks(locks);
    return locks;
  }

  function getLock(quizKey) {
    const key = normalizeQuizKey(quizKey);
    if (!key) return null;

    const locks = cleanupExpiredLocks();
    const lock = locks[key];
    if (!lock || Number(lock.until || 0) <= now()) return null;

    return {
      ...lock,
      quizKey: key,
      until: Number(lock.until),
      durationMs: Number(lock.durationMs || DEFAULT_LOCK_MS)
    };
  }

  function setLock(quizKey, durationMs = DEFAULT_LOCK_MS, meta = {}) {
    const key = normalizeQuizKey(quizKey);
    if (!key) return null;

    const duration = Number(durationMs) > 0 ? Number(durationMs) : DEFAULT_LOCK_MS;
    const locks = cleanupExpiredLocks();
    const lock = {
      ...meta,
      until: now() + duration,
      durationMs: duration,
      updatedAt: new Date().toISOString()
    };

    locks[key] = lock;
    writeLocks(locks);
    return { ...lock, quizKey: key };
  }

  function clearLock(quizKey) {
    const key = normalizeQuizKey(quizKey);
    if (!key) return;

    const locks = readLocks();
    if (!locks[key]) return;
    delete locks[key];
    writeLocks(locks);
  }

  function shortenLock(quizKey, remainingMs = 5000) {
    const key = normalizeQuizKey(quizKey);
    if (!key) return null;

    const currentLock = getLock(key);
    if (!currentLock) return null;

    const locks = cleanupExpiredLocks();
    locks[key] = {
      ...locks[key],
      until: now() + remainingMs,
      durationMs: Math.min(Number(locks[key]?.durationMs || DEFAULT_LOCK_MS), remainingMs),
      debugShortenedAt: new Date().toISOString()
    };
    writeLocks(locks);
    return getLock(key);
  }

  function isLocked(quizKey) {
    return !!getLock(quizKey);
  }

  function formatRemaining(ms) {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  function buildStudyUrlFromQuizKey(quizKey, userId = "") {
    const key = normalizeQuizKey(quizKey);
    const parts = key.split("_");
    const subcategory = parts[1] || "Words";
    const level = parts.find(part => /^[ABC][12]$/i.test(part)) || "A1";
    const day = parts.find(part => /^Day\d+$/i.test(part)) || "Day1";
    const routingKey = `quiz_${subcategory}_${String(level).toUpperCase()}_${day}`;
    const params = new URLSearchParams();
    if (userId) params.set("id", userId);
    params.set("key", routingKey);
    params.set("dishQuizKey", key);
    return `dish-learn.html?${params.toString()}`;
  }

  function clearPopup() {
    if (activeTimer) {
      clearInterval(activeTimer);
      activeTimer = null;
    }
    activePopupOptions = null;
    document.getElementById(POPUP_ID)?.remove();
  }

  function clearDebugButton() {
    document.getElementById(DEBUG_BUTTON_ID)?.remove();
  }

  function isTesterId() {
    return String(new URLSearchParams(window.location.search).get("id") || "").toLowerCase() === "tester";
  }

  function ensureDebugButton() {
    if (!isTesterId()) return;
    if (document.getElementById(DEBUG_BUTTON_ID)) return;

    const btn = document.createElement("button");
    btn.id = DEBUG_BUTTON_ID;
    btn.type = "button";
    btn.textContent = "timer reset";
    btn.style.cssText = `
      position: fixed;
      top: 96px;
      right: 14px;
      z-index: 10050;
      padding: 8px 10px;
      border: none;
      border-radius: 9px;
      background: #111827;
      color: #fff;
      font-size: 12px;
      font-weight: 900;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.28);
    `;

    btn.addEventListener("click", () => {
      const quizKey = normalizeQuizKey(activePopupOptions?.quizKey);
      if (!quizKey) return;
      shortenLock(quizKey, 5000);
      showLockPopup(activePopupOptions);
    });

    document.body.appendChild(btn);
  }

  function showLockPopup(options = {}) {
    const quizKey = normalizeQuizKey(options.quizKey);
    const lock = getLock(quizKey);
    if (!lock) return false;

    clearPopup();
    activePopupOptions = { ...options, quizKey };
    ensureDebugButton();
    const studyLabel = options.studyLabel || "외우러 가기";

    const overlay = document.createElement("div");
    overlay.id = POPUP_ID;
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 18px;
      box-sizing: border-box;
      background: rgba(0, 0, 0, 0.42);
    `;

    const box = document.createElement("div");
    box.style.cssText = `
      width: min(292px, 100%);
      border-radius: 18px;
      background: #fffaf2;
      border: 2px solid #7e3106;
      box-shadow: 0 18px 42px rgba(0, 0, 0, 0.28);
      padding: 18px 16px 16px;
      box-sizing: border-box;
      text-align: center;
      color: #3a2a22;
      font-family: inherit;
    `;

    box.innerHTML = `
      <div style="font-size:16px; font-weight:900; color:#7e3106; margin-bottom:10px;">재시험 준비 시간</div>
      <div class="retake-clock" style="
        --retake-deg: 360deg;
        width: 118px;
        height: 118px;
        margin: 0 auto 12px;
        border-radius: 999px;
        background: conic-gradient(#2e7d32 var(--retake-deg), #ead8c7 0deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: inset 0 0 0 8px rgba(255,255,255,0.88), 0 6px 18px rgba(46, 125, 50, 0.18);
      ">
        <div class="retake-time" style="
          width: 82px;
          height: 82px;
          border-radius: 999px;
          background: #fffaf2;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 25px;
          font-weight: 900;
          color: #2e7d32;
          font-variant-numeric: tabular-nums;
        ">--:--</div>
      </div>
      <div class="retake-message" style="font-size:13px; font-weight:800; line-height:1.45; margin-bottom:14px;">
        조금 더 외운 뒤 다시 시험볼 수 있어요.
      </div>
      <div style="display:flex; gap:8px;">
        <button class="retake-study-btn" type="button" style="
          width: 100%;
          height: 36px;
          border: none;
          border-radius: 10px;
          background: #f2c94c;
          color: #5a4300;
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
        ">${studyLabel}</button>
      </div>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const clock = box.querySelector(".retake-clock");
    const timeEl = box.querySelector(".retake-time");
    const messageEl = box.querySelector(".retake-message");
    const studyBtn = box.querySelector(".retake-study-btn");

    const unlock = () => {
      clearLock(quizKey);
      if (activeTimer) {
        clearInterval(activeTimer);
        activeTimer = null;
      }
      document.getElementById(POPUP_ID)?.remove();
      activePopupOptions = null;
      clearDebugButton();
    };

    const render = () => {
      const remaining = Math.max(0, lock.until - now());
      const ratio = Math.max(0, Math.min(1, remaining / lock.durationMs));
      if (clock) clock.style.setProperty("--retake-deg", `${Math.round(360 * ratio)}deg`);
      if (timeEl) timeEl.textContent = formatRemaining(remaining);
      if (remaining <= 0) unlock();
    };

    studyBtn?.addEventListener("click", () => {
      clearPopup();
      clearDebugButton();
      if (typeof options.onStudy === "function") {
        options.onStudy();
      }
    });

    render();
    activeTimer = setInterval(render, 500);
    return true;
  }

  window.DishRetakeLock = {
    DEFAULT_LOCK_MS,
    getLock,
    setLock,
    clearLock,
    shortenLock,
    isLocked,
    showLockPopup,
    buildStudyUrlFromQuizKey
  };
})();
