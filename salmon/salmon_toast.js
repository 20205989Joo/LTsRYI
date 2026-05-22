(function () {
  "use strict";

  const VISIBLE_MS = 870;
  const REMOVE_MS = 1130;
  const SAVED_TEXT = "\uC800\uC7A5\uB428";

  let stack = null;

  injectStyles();
  document.addEventListener("salmon:saved", (event) => showSaved(event.detail));

  window.SalmonToast = {
    show,
    saved: showSaved
  };

  function showSaved(detail) {
    const index = Number(detail && detail.index);
    const total = Number(detail && detail.total);
    const remaining = Number(detail && detail.remaining);

    if (!Number.isFinite(index) || !Number.isFinite(total) || total < 1) {
      show(SAVED_TEXT);
      return;
    }

    show({
      main: `Q ${index}/${total} ${SAVED_TEXT}`,
      sub: `\uB0A8\uC740 \uBB38\uC81C ${Number.isFinite(remaining) ? Math.max(remaining, 0) : Math.max(total - index, 0)}`
    });
  }

  function show(message) {
    if (!message) return;

    const host = ensureStack();
    positionStack(host);
    const item = document.createElement("div");
    item.className = "salmon-toast";
    item.setAttribute("role", "status");

    if (typeof message === "string") {
      item.textContent = message;
    } else {
      const main = document.createElement("div");
      main.className = "salmon-toast-main";
      main.textContent = message.main || SAVED_TEXT;

      const sub = document.createElement("div");
      sub.className = "salmon-toast-sub";
      sub.textContent = message.sub || "";

      item.append(main, sub);
    }

    host.appendChild(item);
    requestAnimationFrame(() => item.classList.add("visible"));

    setTimeout(() => {
      item.classList.remove("visible");
      item.classList.add("leaving");
    }, VISIBLE_MS);

    setTimeout(() => {
      item.remove();
    }, REMOVE_MS);
  }

  function ensureStack() {
    if (stack && document.body.contains(stack)) {
      return stack;
    }

    const panel = document.querySelector(".left-panel, .leaf-left-panel");
    stack = document.createElement("div");
    stack.className = "salmon-toast-stack";
    stack.setAttribute("aria-live", "polite");
    (panel || document.body).appendChild(stack);
    return stack;
  }

  function positionStack(host) {
    if (!host || host.parentElement === document.body) return;

    const card = document.getElementById("card");
    const answerBox = document.querySelector(".student-box, .leaf-student-box");
    if (!card || !answerBox) return;

    const hostRect = host.parentElement.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const answerRect = answerBox.getBoundingClientRect();
    const hasAnswerBox = answerRect.width > 0 && answerRect.height > 0;
    const midpoint = hasAnswerBox
      ? (cardRect.bottom + answerRect.top) / 2
      : cardRect.bottom + 18;

    host.style.setProperty("--salmon-toast-top", `${Math.round(midpoint - hostRect.top)}px`);
  }

  function injectStyles() {
    if (document.getElementById("salmonToastStyles")) return;

    const style = document.createElement("style");
    style.id = "salmonToastStyles";
    style.textContent = `
      .left-panel{
        position:relative;
      }

      .leaf-left-panel{
        position:relative;
      }

      .salmon-toast-stack{
        position:absolute;
        left:50%;
        top:var(--salmon-toast-top, 50%);
        width:min(92%, 520px);
        z-index:9999;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        gap:8px;
        pointer-events:none;
        transform:translate(-50%, -50%);
      }

      .salmon-toast{
        position:relative;
        min-width:min(100%, 360px);
        padding:24px 34px 22px;
        overflow:hidden;
        isolation:isolate;
        border:1px solid rgba(207,238,255,.78);
        border-radius:16px;
        background:
          radial-gradient(circle at 18% 18%, rgba(143,211,255,.24), transparent 34%),
          radial-gradient(circle at 82% 28%, rgba(167,139,250,.28), transparent 40%),
          radial-gradient(circle at 52% 92%, rgba(255,157,118,.16), transparent 44%),
          linear-gradient(135deg, rgba(7,12,34,.98), rgba(24,18,58,.98) 54%, rgba(5,29,42,.98));
        color:#eafff4;
        box-shadow:
          0 0 0 1px rgba(255,255,255,.08) inset,
          0 0 0 1px rgba(255,213,77,.18),
          0 20px 54px rgba(0,0,0,.5),
          0 0 18px rgba(207,238,255,.74),
          0 0 42px rgba(143,211,255,.68),
          0 0 82px rgba(167,139,250,.62),
          0 0 128px rgba(255,213,77,.3);
        font:950 34px/1.05 system-ui,-apple-system,Segoe UI,Roboto,Apple SD Gothic Neo,Malgun Gothic,Helvetica,Arial,sans-serif;
        letter-spacing:0;
        text-align:center;
        text-shadow:
          0 0 8px rgba(207,238,255,.68),
          0 0 18px rgba(143,211,255,.42);
        opacity:0;
        transform:translateY(14px) scale(.92);
        transition:opacity .2s ease, transform .22s cubic-bezier(.2,.8,.2,1);
      }

      .salmon-toast::before{
        content:"";
        position:absolute;
        inset:0;
        z-index:-1;
        background-image:
          radial-gradient(circle, rgba(255,255,255,.86) 0 .8px, transparent 1.6px),
          radial-gradient(circle, rgba(255,234,160,.72) 0 1px, transparent 1.9px);
        background-position:16px 14px, 58px 35px;
        background-size:92px 68px, 132px 96px;
        opacity:.36;
        mix-blend-mode:screen;
      }

      .salmon-toast-main{
        position:relative;
        z-index:1;
        display:inline-block;
        padding:0 5px;
        font-size:15px;
        font-weight:900;
        line-height:1.15;
        background:linear-gradient(90deg, #f8fbff, #cfeeff 34%, #ffeaa0 68%, #f8fbff);
        -webkit-background-clip:text;
        background-clip:text;
        color:transparent;
        white-space:nowrap;
        text-shadow:
          0 0 7px rgba(207,238,255,.72),
          0 0 18px rgba(143,211,255,.52),
          0 0 28px rgba(255,213,77,.32);
      }

      .salmon-toast-main::before,
      .salmon-toast-main::after{
        content:"";
        position:absolute;
        left:8%;
        right:8%;
        height:1px;
        pointer-events:none;
        background:
          linear-gradient(90deg, transparent, rgba(207,238,255,.72) 18%, transparent 18% 26%, rgba(255,234,160,.72) 26% 44%, transparent 44% 56%, rgba(207,238,255,.62) 56% 78%, transparent);
        box-shadow:
          0 0 8px rgba(207,238,255,.62),
          0 0 16px rgba(167,139,250,.36);
      }

      .salmon-toast-main::before{
        top:-7px;
        transform:rotate(-2deg);
      }

      .salmon-toast-main::after{
        bottom:-7px;
        transform:rotate(2deg);
      }

      .salmon-toast-sub{
        position:relative;
        z-index:1;
        margin-top:9px;
        color:#ffeaa0;
        font-size:35px;
        font-weight:950;
        line-height:1.05;
        text-shadow:
          0 0 10px rgba(255,213,77,.72),
          0 0 18px rgba(255,157,118,.42);
      }

      body > .salmon-toast-stack{
        position:fixed;
        top:50%;
        width:min(92vw, 520px);
      }

      .salmon-toast.visible{
        opacity:1;
        transform:translateY(0) scale(1);
      }

      .salmon-toast.leaving{
        opacity:0;
        transform:translateY(-8px) scale(.98);
      }

      @media (max-width:640px){
        .salmon-toast{
          border-radius:10px;
          min-width:min(100%, 286px);
          padding:18px 22px 17px;
          font-size:25px;
          transform:none;
          transition:opacity .2s ease;
        }

        .salmon-toast.visible,
        .salmon-toast.leaving{
          transform:none;
        }

        .salmon-toast-sub{
          font-size:26px;
        }
      }
    `;
    document.head.appendChild(style);
  }
})();
