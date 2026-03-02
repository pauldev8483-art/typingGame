import "./style.css";

import { playComplete, playHit, playMiss, setVolume } from "./audio/sfx";
import { buildMetrics } from "./logic/metrics";
import { getNextText } from "./logic/textSources";
import { createTypingSession, updateTypedValue } from "./state/typingSession";
import { addSession, loadHistory } from "./storage/sessionStore";
import { flashSuccess, shakeError } from "./ui/effects";
import { spawnFloatingWord } from "./ui/floatingWords";
import { renderHistoryChart } from "./ui/historyChart";
import { spawnRipple } from "./ui/ripple";
import { buildUI, renderState } from "./ui/render";

const SETTINGS_KEY = "typing_game_settings";
const defaultSettings = {
  volume: 0.6,
  flashStrength: 1,
};

const ui = buildUI(document.querySelector("#app"));
let settings = loadSettings();
let history = loadHistory();
let session = createNewSession();

attachEvents();
render(session, { historyList: history, updateHistory: true });
focusInput();
applySettings(settings);

function attachEvents() {
  ui.hiddenInput.addEventListener("input", (event) => {
    const previousSession = session;
    session = updateTypedValue(session, event.target.value);
    handleFeedback(previousSession, session);
    render(session);
  });

  ui.newTextButton.addEventListener("click", () => {
    session = createNewSession();
    render(session);
    focusInput();
  });

  ui.focusSurface.addEventListener("click", () => {
    focusInput();
  });

  window.addEventListener("keydown", (event) => {
    if (event.metaKey || event.ctrlKey) return;
    if (document.activeElement !== ui.hiddenInput) {
      focusInput();
    }
  });

  ui.volumeSlider.addEventListener("input", (event) => {
    const volume = Number(event.target.value) / 100;
    settings = { ...settings, volume };
    applySettings(settings);
    saveSettings(settings);
  });

  ui.flashSlider.addEventListener("input", (event) => {
    const flashStrength = Number(event.target.value) / 100;
    settings = { ...settings, flashStrength };
    applySettings(settings);
    saveSettings(settings);
  });
}

function createNewSession() {
  const nextSession = createTypingSession(getNextText());
  ui.hiddenInput.value = "";
  ui.hiddenInput.maxLength = nextSession.targetText.length;
  return nextSession;
}

function render(currentSession, { historyList = history, updateHistory = false } = {}) {
  const metrics = buildMetrics(currentSession);
  renderState({ session: currentSession, metrics, ui, history: historyList, updateHistory });
  if (updateHistory) {
    renderHistoryChart(ui.historyChart, historyList);
  }
}

function focusInput() {
  ui.hiddenInput.focus({ preventScroll: true });
}

function handleFeedback(previousSession, nextSession) {
  const added = nextSession.typedText.length - previousSession.typedText.length;

  const completedWord = detectCompletedWord(previousSession, nextSession);
  if (completedWord) {
    spawnFloatingWord({ ...completedWord, ui });
  }

  if (added > 0) {
    const startIndex = previousSession.typedText.length;
    for (let offset = 0; offset < added; offset += 1) {
      const index = startIndex + offset;
      const typedChar = nextSession.typedText[index];
      const targetChar = nextSession.targetText[index];

      if (typedChar === undefined) continue;

      if (typedChar === targetChar) {
        if (settings.flashStrength > 0) {
          flashSuccess(ui.textShell);
        }
        playHit();
        spawnRipple({ index, ui });
      } else {
        shakeError(ui.textShell);
        playMiss();
      }
    }
  }

  if (!previousSession.endedAt && nextSession.endedAt) {
    if (settings.flashStrength > 0) {
      flashSuccess(ui.textShell);
    }
    playComplete();
    history = recordCompletion(nextSession);
    render(nextSession, { historyList: history, updateHistory: true });
  }
}

function recordCompletion(nextSession) {
  const metrics = buildMetrics(nextSession);
  const summary = {
    id: Date.now(),
    completedAt: new Date().toISOString(),
    accuracy: Number(metrics.accuracy.toFixed(2)),
    wpm: Number(metrics.wpm.toFixed(2)),
    elapsedSeconds: metrics.elapsedSeconds,
    targetLength: nextSession.targetText.length,
    textPreview: nextSession.targetText.slice(0, 80),
  };
  return addSession(summary);
}

function applySettings(nextSettings) {
  const volumePercent = Math.round(nextSettings.volume * 100);
  ui.volumeSlider.value = volumePercent;
  ui.volumeValue.textContent = `${volumePercent}%`;
  setVolume(nextSettings.volume);

  const flashPercent = Math.round(nextSettings.flashStrength * 100);
  ui.flashSlider.value = flashPercent;
  ui.flashValue.textContent = `${flashPercent}%`;
  ui.textShell.style.setProperty("--flash-strength", nextSettings.flashStrength.toString());
}

function loadSettings() {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) return { ...defaultSettings };
    const parsed = JSON.parse(stored);
    return {
      ...defaultSettings,
      ...parsed,
    };
  } catch (error) {
    console.warn("Failed to load settings; using defaults.", error);
    return { ...defaultSettings };
  }
}

function saveSettings(nextSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(nextSettings));
  } catch (error) {
    console.warn("Failed to save settings", error);
  }
}

function detectCompletedWord(prevSession, nextSession) {
  const prevLen = prevSession.typedText.length;
  const nextLen = nextSession.typedText.length;
  if (nextLen <= prevLen) return null;

  const endsWithSpace = nextSession.typedText.endsWith(" ");
  const reachedEnd = nextLen === nextSession.targetText.length;

  if (!endsWithSpace && !reachedEnd) return null;

  const boundaryIndex = nextLen - 1;

  if (endsWithSpace && nextSession.targetText[boundaryIndex] !== " ") {
    return null;
  }

  const wordEndIndex = endsWithSpace ? boundaryIndex - 1 : boundaryIndex;
  if (wordEndIndex < 0) return null;

  let wordStartIndex = wordEndIndex;
  while (wordStartIndex > 0 && nextSession.targetText[wordStartIndex - 1] !== " ") {
    wordStartIndex -= 1;
  }

  const typedWord = nextSession.typedText.slice(wordStartIndex, wordEndIndex + 1);
  const targetWord = nextSession.targetText.slice(wordStartIndex, wordEndIndex + 1);

  if (!typedWord || typedWord !== targetWord) return null;

  return { word: typedWord, startIndex: wordStartIndex, endIndex: wordEndIndex };
}
