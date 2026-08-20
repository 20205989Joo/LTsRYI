(function () {
  "use strict";

  function enhance(sourceInput, options) {
    if (!sourceInput) return null;
    var existingId = sourceInput.dataset.aisthSlotControlId;
    if (existingId) {
      var existing = document.getElementById(existingId);
      if (existing) return makeApi(sourceInput, existing);
    }

    var modelText = pickModelText(options && options.modelText);
    var slots = buildSlots(modelText);
    if (!slots.length) slots = [{ text: "", length: 1, offset: 0 }];
    applyOffsets(slots);

    var control = document.createElement("div");
    control.className = "aisth-slot-control";
    if (shouldUseLatinSlotStyle(modelText, sourceInput)) {
      control.classList.add("aisth-slot-control--latin");
    }
    control.id = "aisth-slot-control-" + Math.random().toString(36).slice(2);
    control.dataset.totalChars = String(getTotalChars(slots));
    var placeholderText = pickModelText(options && options.placeholderText);
    if (placeholderText) {
      if (Array.from(placeholderText.replace(/\s+/g, "")).length > 1) {
        control.classList.add("is-full-hint");
      }
      control.dataset.placeholderChars = Array.from(placeholderText.replace(/\s+/g, ""))
        .slice(0, getTotalChars(slots))
        .join("");
    }

    var input = document.createElement("input");
    input.className = "aisth-slot-input";
    input.type = "text";
    input.autocomplete = "off";
    input.inputMode = sourceInput.inputMode || (control.classList.contains("aisth-slot-control--latin") ? "latin" : "text");
    input.lang = sourceInput.lang || "";
    input.autocapitalize = sourceInput.autocapitalize || "none";
    input.spellcheck = sourceInput.spellcheck;
    input.maxLength = getTotalChars(slots);
    input.setAttribute("aria-label", "answer");
    control.appendChild(input);

    slots.forEach(function (slot, slotIndex) {
      var shell = document.createElement("span");
      shell.className = "aisth-slot-shell";
      shell.dataset.slotIndex = String(slotIndex);
      shell.dataset.offset = String(slot.offset);
      shell.dataset.maxChars = String(slot.length);

      for (var i = 0; i < slot.length; i += 1) {
        var cell = document.createElement("span");
        cell.className = "aisth-slot-cell";
        cell.dataset.charIndex = String(i);
        cell.dataset.flowIndex = String(slot.offset + i);
        shell.appendChild(cell);
      }

      control.appendChild(shell);
      if (slotIndex < slots.length - 1) {
        var gap = document.createElement("span");
        gap.className = "aisth-slot-word-gap";
        gap.textContent = " ";
        control.appendChild(gap);
      }
    });

    sourceInput.classList.add("aisth-slot-source");
    sourceInput.tabIndex = -1;
    sourceInput.setAttribute("aria-hidden", "true");
    sourceInput.dataset.aisthSlotControlId = control.id;
    sourceInput.insertAdjacentElement("afterend", control);

    wireControl(sourceInput, control, options || {});
    syncSourceValue(sourceInput, control);
    return makeApi(sourceInput, control);
  }

  function makeApi(sourceInput, control) {
    return {
      focus: function () {
        var input = getFlowInput(control);
        if (input) {
          input.focus();
          setCaret(input, getChars(input).length);
          updateSlotDisplay(control);
        }
      },
      setDisabled: function (disabled) {
        setDisabled(sourceInput, disabled);
      },
      control: control
    };
  }

  function wireControl(sourceInput, control, options) {
    var input = getFlowInput(control);
    if (!input) return;

    updateSlotDisplay(control);

    input.addEventListener("compositionstart", function () {
      input.dataset.composing = "1";
      updateSlotDisplay(control);
    });
    input.addEventListener("compositionend", function () {
      input.dataset.composing = "0";
      window.setTimeout(function () {
        normalizeInput(input);
        updateSlotDisplay(control);
        syncSourceValue(sourceInput, control);
      }, 0);
    });
    input.addEventListener("input", function (ev) {
      if (!(ev.isComposing || input.dataset.composing === "1")) {
        normalizeInput(input);
      }
      updateSlotDisplay(control);
      syncSourceValue(sourceInput, control);
    });
    input.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" && typeof options.onEnter === "function") {
        ev.preventDefault();
        options.onEnter();
      }
    });
    ["focus", "blur", "keyup", "click", "select"].forEach(function (type) {
      input.addEventListener(type, function () {
        updateSlotDisplay(control);
      });
    });

    Array.prototype.slice.call(control.querySelectorAll(".aisth-slot-shell")).forEach(function (shell) {
      shell.addEventListener("pointerdown", function (ev) {
        ev.preventDefault();
        var cell = ev.target.closest(".aisth-slot-cell");
        var offset = Number(shell.dataset.offset || 0);
        var max = Number(shell.dataset.maxChars || 1);
        var chars = getChars(input);
        var nextIndex = offset + Math.min(max, chars.slice(offset, offset + max).length);
        if (cell) {
          nextIndex = Number(cell.dataset.flowIndex || nextIndex);
          if (cell.classList.contains("is-filled")) nextIndex += 1;
        }
        input.focus();
        setCaret(input, nextIndex);
        updateSlotDisplay(control);
      });
    });
  }

  function buildSlots(modelText) {
    var text = String(modelText || "");
    return text.split(/\s+/).map(function (part) {
      var token = part.replace(/\s+/g, "");
      return { text: token, length: Array.from(token).length };
    }).filter(function (slot) { return slot.length > 0; });
  }

  function pickModelText(modelText) {
    var text = String(modelText || "").replace(/\*\*(.*?)\*\*/gs, "$1").trim();
    if (!text) return "";
    var line = text.split(/\r?\n/).map(function (x) { return x.trim(); }).filter(Boolean)[0] || text;
    line = line.split("||").map(function (x) { return x.trim(); }).filter(Boolean)[0] || line;
    if (/\bor\b/i.test(line)) line = line.split(/\bor\b/i).map(function (x) { return x.trim(); }).filter(Boolean)[0] || line;
    if (line.indexOf("/") >= 0) line = line.split("/").map(function (x) { return x.trim(); }).filter(Boolean)[0] || line;
    if (line.indexOf(",") >= 0) line = line.split(",").map(function (x) { return x.trim(); }).filter(Boolean)[0] || line;
    return line.replace(/[.?!~]+$/g, "").trim();
  }

  function shouldUseLatinSlotStyle(modelText, sourceInput) {
    var text = String(modelText || "");
    if (/^en\b/i.test(String(sourceInput && sourceInput.lang || ""))) return true;
    if (String(sourceInput && sourceInput.inputMode || "").toLowerCase() === "latin") return true;
    return /[A-Za-z]/.test(text) && !/[가-힣]/.test(text);
  }

  function applyOffsets(slots) {
    var offset = 0;
    slots.forEach(function (slot) {
      slot.offset = offset;
      offset += slot.length;
    });
  }

  function getTotalChars(slots) {
    return slots.reduce(function (sum, slot) { return sum + slot.length; }, 0);
  }

  function getFlowInput(control) {
    return control && control.querySelector(".aisth-slot-input");
  }

  function normalizeInput(input) {
    var chars = getChars(input).slice(0, getMax(input));
    input.value = chars.join("");
  }

  function getChars(input) {
    return Array.from(String(input && input.value || "").replace(/\s+/g, ""));
  }

  function getMax(input) {
    var control = input && input.closest(".aisth-slot-control");
    var max = Number(control && control.dataset.totalChars || input && input.maxLength || 0);
    return Number.isFinite(max) && max > 0 ? max : 1;
  }

  function getCaretCharIndex(input) {
    var raw = String(input && input.value || "");
    var end = Number.isInteger(input && input.selectionStart) ? input.selectionStart : raw.length;
    return Array.from(raw.slice(0, end).replace(/\s+/g, "")).length;
  }

  function updateSlotDisplay(control) {
    var input = getFlowInput(control);
    if (!input) return;
    var chars = getChars(input);
    var placeholderChars = getPlaceholderChars(control);
    var cells = Array.prototype.slice.call(control.querySelectorAll(".aisth-slot-cell"));
    var hasFocus = document.activeElement === input;
    var activeIndex = Math.min(getCaretCharIndex(input), Math.max(0, cells.length - 1));

    cells.forEach(function (cell) {
      var idx = Number(cell.dataset.flowIndex || 0);
      var text = chars[idx] || "";
      var placeholder = !text ? placeholderChars[idx] || "" : "";
      setSlotCellContent(cell, text, placeholder);
      cell.classList.toggle("is-filled", Boolean(text));
      cell.classList.toggle("is-placeholder", !text && Boolean(placeholder));
      cell.classList.toggle("is-active", hasFocus && idx === activeIndex);
    });
  }

  function setSlotCellContent(cell, text, placeholder) {
    if (text) {
      if (cell.textContent !== text || cell.querySelector(".aisth-slot-placeholder-char")) {
        cell.textContent = text;
      }
      return;
    }

    if (!placeholder) {
      if (cell.textContent) cell.textContent = "";
      return;
    }

    var placeholderNode = cell.querySelector(".aisth-slot-placeholder-char");
    if (!placeholderNode) {
      placeholderNode = document.createElement("span");
      placeholderNode.className = "aisth-slot-placeholder-char";
      cell.textContent = "";
      cell.appendChild(placeholderNode);
    }
    if (placeholderNode.textContent !== placeholder) placeholderNode.textContent = placeholder;
  }

  function getPlaceholderChars(control) {
    return Array.from(String(control && control.dataset.placeholderChars || ""));
  }

  function syncSourceValue(sourceInput, control) {
    var input = getFlowInput(control);
    var chars = getChars(input);
    var values = Array.prototype.slice.call(control.querySelectorAll(".aisth-slot-shell")).map(function (shell) {
      var offset = Number(shell.dataset.offset || 0);
      var max = Number(shell.dataset.maxChars || 1);
      return chars.slice(offset, offset + max).join("");
    });
    sourceInput.value = values.join(" ").trim();
    sourceInput.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function setCaret(input, index) {
    var max = getMax(input);
    var next = Math.max(0, Math.min(max, Number(index) || 0));
    try { input.setSelectionRange(next, next); } catch (_) {}
  }

  function setDisabled(sourceInput, disabled) {
    if (!sourceInput) return;
    sourceInput.disabled = Boolean(disabled);
    var control = document.getElementById(sourceInput.dataset.aisthSlotControlId || "");
    if (!control) return;
    var input = getFlowInput(control);
    if (input) input.disabled = Boolean(disabled);
    control.classList.toggle("is-disabled", Boolean(disabled));
  }

  function installKeyboardViewportAssist() {
    if (window.__aisthKeyboardViewportAssistInstalled) return;
    window.__aisthKeyboardViewportAssistInstalled = true;

    var style = document.createElement("style");
    style.textContent = [
      "html.aisth-keyboard-active,html.aisth-keyboard-active body{align-items:flex-start!important;overflow:hidden!important;}",
      "html.aisth-keyboard-active #quiz-area{scroll-behavior:auto!important;overscroll-behavior:contain;}",
      ".aisth-keyboard-spacer{display:block;width:1px;min-height:0;pointer-events:none;}",
    ].join("");
    document.head.appendChild(style);

    var viewport = window.visualViewport;
    var baselineHeight = viewport ? viewport.height : window.innerHeight;
    var activeEditable = null;
    var updateTimer = 0;

    function isEditable(node) {
      if (!node || !node.matches) return false;
      return node.matches("input:not([type='button']):not([type='submit']):not([type='checkbox']):not([type='radio']),textarea,[contenteditable='true']");
    }

    function scheduleUpdate(delay) {
      if (updateTimer) window.clearTimeout(updateTimer);
      updateTimer = window.setTimeout(updateLayout, typeof delay === "number" ? delay : 70);
    }

    function viewportMetrics() {
      if (!viewport) return { top: 0, bottom: window.innerHeight, height: window.innerHeight };
      return {
        top: Number(viewport.offsetTop || 0),
        bottom: Number(viewport.offsetTop || 0) + Number(viewport.height || window.innerHeight),
        height: Number(viewport.height || window.innerHeight),
      };
    }

    function ensureSpacer(quizArea, height) {
      var spacer = quizArea.querySelector(":scope > .aisth-keyboard-spacer");
      if (!spacer) {
        spacer = document.createElement("div");
        spacer.className = "aisth-keyboard-spacer";
        spacer.setAttribute("aria-hidden", "true");
        quizArea.appendChild(spacer);
      }
      spacer.style.height = Math.max(36, Math.ceil(height)) + "px";
    }

    function removeSpacers() {
      Array.prototype.slice.call(document.querySelectorAll(".aisth-keyboard-spacer")).forEach(function (spacer) {
        spacer.remove();
      });
    }

    function updateLayout() {
      updateTimer = 0;
      var metrics = viewportMetrics();
      var hasFocus = isEditable(activeEditable) && document.contains(activeEditable);
      if (!hasFocus) baselineHeight = Math.max(baselineHeight, metrics.height);
      var keyboardOpen = hasFocus && metrics.height < baselineHeight - 90;

      if (!keyboardOpen) {
        document.documentElement.classList.remove("aisth-keyboard-active");
        removeSpacers();
        return;
      }

      document.documentElement.classList.add("aisth-keyboard-active");
      var quizArea = activeEditable.closest("#quiz-area") || document.getElementById("quiz-area");
      if (!quizArea) return;
      var target = activeEditable.closest(".aisth-slot-control") || activeEditable;
      var quizRect = quizArea.getBoundingClientRect();
      var hiddenBottom = Math.max(0, quizRect.bottom - metrics.bottom);
      ensureSpacer(quizArea, hiddenBottom + 52);

      window.requestAnimationFrame(function () {
        if (!document.contains(target)) return;
        var nextQuizRect = quizArea.getBoundingClientRect();
        var targetRect = target.getBoundingClientRect();
        var visibleTop = Math.max(nextQuizRect.top, metrics.top) + 10;
        var visibleBottom = Math.min(nextQuizRect.bottom, metrics.bottom) - 18;
        var answerBox = target.closest(".box,.aisth-letter-answer-box,.l63-pair-answer-box,.l71-file");
        var questionBox = answerBox && answerBox.previousElementSibling && answerBox.previousElementSibling.classList.contains("box")
          ? answerBox.previousElementSibling
          : null;
        var blockTop = questionBox ? questionBox.getBoundingClientRect().top : targetRect.top;
        var blockBottom = targetRect.bottom;
        var available = Math.max(0, visibleBottom - visibleTop);
        var blockHeight = blockBottom - blockTop;
        var delta = 0;

        if (blockHeight <= available && blockBottom > visibleBottom) {
          delta = blockBottom - visibleBottom;
        } else if (targetRect.bottom > visibleBottom) {
          delta = targetRect.bottom - visibleBottom + 12;
        } else if (targetRect.top < visibleTop) {
          delta = targetRect.top - visibleTop - 8;
        }
        if (delta) quizArea.scrollTop += delta;
      });
    }

    document.addEventListener("focusin", function (event) {
      if (!isEditable(event.target)) return;
      activeEditable = event.target;
      baselineHeight = Math.max(baselineHeight, viewportMetrics().height);
      scheduleUpdate(90);
      window.setTimeout(function () { scheduleUpdate(0); }, 280);
    });

    document.addEventListener("focusout", function () {
      window.setTimeout(function () {
        if (isEditable(document.activeElement)) {
          activeEditable = document.activeElement;
          return;
        }
        activeEditable = null;
        scheduleUpdate(0);
      }, 80);
    });

    if (viewport) {
      viewport.addEventListener("resize", function () { scheduleUpdate(45); });
      viewport.addEventListener("scroll", function () { scheduleUpdate(45); });
    }
    window.addEventListener("resize", function () { scheduleUpdate(60); });
  }

  installKeyboardViewportAssist();

  window.AisthInputSlots = {
    enhance: enhance,
    setDisabled: setDisabled
  };
})();
