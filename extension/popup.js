const ext = globalThis.browser ?? globalThis.chrome;

const status = document.querySelector("#status");

let level = "plain";
let theme = "system";
let busy = false;

function applyTheme() {
  if (theme === "system") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.dataset.theme = theme;
  for (const button of document.querySelectorAll("[data-theme]")) {
    button.setAttribute("aria-checked", button.dataset.theme === theme ? "true" : "false");
  }
}

function revealDracula() {
  const button = document.querySelector("[data-theme='dracula']");
  if (button) button.hidden = false;
}

async function paintPage() {
  try {
    const [tab] = await ext.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;
    await ext.tabs.sendMessage(tab.id, { type: "plainly-theme", theme });
  } catch {
    /* The summary is not open. */
  }
}

function markLevel(next) {
  level = next;
  for (const button of document.querySelectorAll("[data-level]")) {
    button.removeAttribute("aria-checked");
    button.disabled = busy;
  }
  ext.storage.local.set({ level });
}

async function simplifyPage() {
  if (busy) return;
  busy = true;
  markLevel(level);
  status.textContent = "";
  try {
    const [tab] = await ext.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error("no tab");
    try {
      await ext.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["simplify.js", "license.js", "page.js"],
      });
    } catch {
      /* Already injected on this page. */
    }
    const result = await ext.tabs.sendMessage(tab.id, { type: "plainly-open", level, theme });
    status.textContent = result?.ok
      ? "Done. Close the panel to see the original."
      : result?.reason || "This page can't be simplified.";
  } catch {
    status.textContent = "This page can't be simplified.";
  } finally {
    busy = false;
    markLevel(level);
  }
}

function setTheme(next) {
  theme = next;
  ext.storage.local.set({ theme });
  applyTheme();
  paintPage();
}

let secretClicks = 0;
let secretTimer = 0;
document.querySelector("#unlock").addEventListener("click", () => {
  secretClicks += 1;
  window.clearTimeout(secretTimer);
  secretTimer = window.setTimeout(() => {
    secretClicks = 0;
  }, 1600);
  if (secretClicks < 4) return;
  secretClicks = 0;
  revealDracula();
  ext.storage.local.set({ dracula: true });
  setTheme("dracula");
});

const licenseApi = globalThis.PlainlyLicense;
const pay = document.querySelector("#pay");
const codeInput = document.querySelector("#code");
let licensed = false;

function paid(levelName) {
  return levelName === "context" || levelName === "points";
}

function showPay(message) {
  pay.hidden = false;
  if (message) status.textContent = message;
}

document.querySelector("#buy").addEventListener("click", () => {
  if (!licenseApi.checkoutUrl) {
    status.textContent = "The payment link is not connected yet.";
    return;
  }
  ext.tabs.create({ url: licenseApi.checkoutUrl });
});

document.querySelector("#redeem").addEventListener("click", async () => {
  const key = codeInput.value.trim();
  if (!(await licenseApi.verify(key))) {
    status.textContent = "That code doesn't work.";
    return;
  }
  await ext.storage.local.set({ license: { key, at: Date.now() } });
  licensed = true;
  pay.hidden = true;
  codeInput.value = "";
  status.textContent = "Unlocked on this browser.";
});

document.querySelectorAll("[data-level]").forEach((button) => {
  button.addEventListener("click", () => {
    const next = button.dataset.level;
    if (paid(next) && !licensed) {
      showPay("That one is part of the $4.99 unlock.");
      return;
    }
    markLevel(next);
    simplifyPage();
  });
});

document.querySelectorAll("[data-theme]").forEach((button) => {
  button.addEventListener("click", () => setTheme(button.dataset.theme));
});

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (theme === "system") applyTheme();
});

ext.storage.local.get(["level", "theme", "dracula", "license"]).then(async (saved) => {
  if (saved.level === "plain" || saved.level === "context" || saved.level === "points") {
    level = saved.level;
  }
  licensed = Boolean(await licenseApi.verify(saved.license?.key));
  if (!licensed && paid(level)) level = "plain";
  pay.hidden = licensed;
  if (saved.dracula) revealDracula();
  if (
    saved.theme === "system" ||
    saved.theme === "light" ||
    saved.theme === "dark" ||
    (saved.theme === "dracula" && saved.dracula)
  ) {
    theme = saved.theme;
  }
  markLevel(level);
  applyTheme();
});
