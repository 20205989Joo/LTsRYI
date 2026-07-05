(function () {
  "use strict";

  function enhance(sourceInput, options) {
    if (!sourceInput) return null;
    var existingId = sourceInput.dataset.aisthSlotControlId;
    if (existingId) {
      var existing = document.getElementById(existingId);
      if (existing) return makeApi(sourceInput, existing);
    }

    var slots = buildSlots(options && options.modelText);
    if (!slots.length) slots = [{ text: "", length: 1, offset: 0 }];
    applyOffsets(slots);

    var control = document.createElement("div");
    control.className = "aisth-slot-control";
    control.id = "aisth-slot-control-" + Math.random().toString(36).slice(2);
    control.dataset.totalChars = String(getTotalChars(slots));
    var placeholderText = pickModelText(options && options.placeholderText);
    if (placeholderText) {
      control.dataset.placeholderChars = Array.from(placeholderText.replace(/\s+/g, ""))
        .slice(0, getTotalChars(slots))
        .join("");
    }

    var input = document.createElement("input");
    input.className = "aisth-slot-input";
    input.type = "text";
    input.autocomplete = "off";
    input.inputMode = sourceInput.inputMode || "text";
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
    var text = pickModelText(modelText);
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
      cell.textContent = text || placeholder;
      cell.classList.toggle("is-filled", Boolean(text));
      cell.classList.toggle("is-placeholder", !text && Boolean(placeholder));
      cell.classList.toggle("is-active", hasFocus && idx === activeIndex);
    });
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

  window.AisthInputSlots = {
    enhance: enhance,
    setDisabled: setDisabled
  };
})();
