export function buildUI(root) {
  root.innerHTML = `
    <div class="page">
      <header class="top-bar">
        <div class="title-block">
          <p class="eyebrow">Accuracy-first trainer</p>
          <h1>Typing game</h1>
        </div>
        <div class="controls">
          <button type="button" data-new-text>New text</button>
        </div>
      </header>

      <div class="grid">
        <section class="text-panel" data-focus-surface>
          <div class="panel-heading">
            <span>Target text</span>
            <span class="focus-cta">Click to focus and start typing</span>
          </div>
          <div class="text-display" data-text-shell tabindex="0">
            <div class="text-layer" data-text-display></div>
            <div class="float-layer" data-float-layer></div>
          </div>
        </section>

        <section class="metrics">
          <div class="metric-card">
            <div class="metric-label">Accuracy</div>
            <div class="metric-value" data-accuracy>100%</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">WPM</div>
            <div class="metric-value" data-wpm>0.0</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Time</div>
            <div class="metric-value" data-time>0.0s</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Progress</div>
            <div class="progress-bar">
              <div class="progress-fill" data-progress></div>
            </div>
            <div class="status" data-status>Waiting to start</div>
          </div>
        </section>

        <section class="settings">
          <div class="setting-card">
            <div class="setting-header">
              <span>Sound volume</span>
              <span class="setting-value" data-volume-value>60%</span>
            </div>
            <input type="range" min="0" max="100" value="60" class="slider" data-volume-slider />
          </div>
          <div class="setting-card">
            <div class="setting-header">
              <span>Flash intensity</span>
              <span class="setting-value" data-flash-value>100%</span>
            </div>
            <input type="range" min="0" max="100" value="100" class="slider" data-flash-slider />
          </div>
        </section>

        <section class="history">
          <div class="history-header">
            <div>
              <div class="eyebrow">Progress</div>
              <h3>Recent sessions</h3>
            </div>
          </div>
          <div class="history-grid">
            <div class="history-list" data-history-list></div>
            <div class="history-chart">
              <canvas data-history-chart></canvas>
            </div>
          </div>
        </section>
      </div>

      <input
        class="hidden-input"
        data-hidden-input
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
      />
    </div>
  `;

  return {
    textShell: root.querySelector("[data-text-shell]"),
    textDisplay: root.querySelector("[data-text-display]"),
    floatLayer: root.querySelector("[data-float-layer]"),
    hiddenInput: root.querySelector("[data-hidden-input]"),
    newTextButton: root.querySelector("[data-new-text]"),
    focusSurface: root.querySelector("[data-focus-surface]"),
    accuracyValue: root.querySelector("[data-accuracy]"),
    wpmValue: root.querySelector("[data-wpm]"),
    timeValue: root.querySelector("[data-time]"),
    progressFill: root.querySelector("[data-progress]"),
    status: root.querySelector("[data-status]"),
    volumeSlider: root.querySelector("[data-volume-slider]"),
    flashSlider: root.querySelector("[data-flash-slider]"),
    volumeValue: root.querySelector("[data-volume-value]"),
    flashValue: root.querySelector("[data-flash-value]"),
    historyList: root.querySelector("[data-history-list]"),
    historyChart: root.querySelector("[data-history-chart]"),
  };
}

export function renderState({ session, metrics, ui, history, updateHistory = false }) {
  renderText(session.targetText, session.typedText, ui.textDisplay);
  if (updateHistory) {
    renderHistory(history ?? [], ui.historyList);
  }

  ui.accuracyValue.textContent = `${metrics.accuracy.toFixed(1)}%`;
  ui.wpmValue.textContent = metrics.wpm.toFixed(1);
  ui.timeValue.textContent = `${metrics.elapsedSeconds.toFixed(1)}s`;

  const isPerfect = metrics.accuracy >= 100 && session.endedAt;
  const isLow = metrics.accuracy < 90 && session.endedAt;
  ui.accuracyValue.classList.toggle("perfect", isPerfect);
  ui.accuracyValue.classList.toggle("low", isLow);
  ui.accuracyValue.textContent = isPerfect
    ? `★ ${metrics.accuracy.toFixed(1)}%`
    : isLow
      ? `! ${metrics.accuracy.toFixed(1)}%`
      : `${metrics.accuracy.toFixed(1)}%`;

  const progressPercent = Math.round(metrics.progress * 1000) / 10;
  ui.progressFill.style.width = `${progressPercent}%`;

  ui.status.textContent = session.endedAt
    ? "Complete"
    : session.startedAt
      ? "Keep typing"
      : "Waiting to start";
  ui.status.classList.toggle("complete", Boolean(session.endedAt));
}

function renderHistory(history, listEl) {
  if (!listEl) return;
  listEl.innerHTML = "";
  const recent = history.slice(-5).reverse();

  if (!recent.length) {
    listEl.textContent = "Complete a session to see history.";
    return;
  }

  const fragment = document.createDocumentFragment();
  recent.forEach((entry) => {
    const row = document.createElement("div");
    row.className = "history-row";

    const left = document.createElement("div");
    left.className = "history-main";
    const title = document.createElement("div");
    title.className = "history-title";
    title.textContent = entry.textPreview || "Session";
    const sub = document.createElement("div");
    sub.className = "history-sub";
    sub.textContent = formatTimestamp(entry.completedAt);
    left.append(title, sub);

    const right = document.createElement("div");
    right.className = "history-metrics";
    const wpm = document.createElement("span");
    wpm.className = "pill";
    wpm.textContent = `${entry.wpm.toFixed(1)} WPM`;
    const acc = document.createElement("span");
    const accValue = entry.accuracy.toFixed(1);
    const isPerfect = entry.accuracy >= 100;
    const isLow = entry.accuracy < 90;
    acc.className = `pill pill-ghost${isPerfect ? " pill-perfect" : ""}${isLow ? " pill-low" : ""}`;
    acc.textContent = isPerfect ? `★ ${accValue}%` : isLow ? `! ${accValue}%` : `${accValue}%`;
    right.append(wpm, acc);

    row.append(left, right);
    fragment.appendChild(row);
  });

  listEl.appendChild(fragment);
}

function formatTimestamp(ts) {
  if (!ts) return "";
  const date = new Date(ts);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderText(targetText, typedText, container) {
  container.innerHTML = "";
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < targetText.length; i += 1) {
    const targetChar = targetText[i];
    const typedChar = typedText[i];
    const span = document.createElement("span");
    span.classList.add("glyph");
    span.dataset.idx = i;

    if (typedChar === undefined) {
      span.classList.add("pending");
    } else if (typedChar === targetChar) {
      span.classList.add("correct");
    } else {
      span.classList.add("wrong");
    }

    if (i === typedText.length) {
      span.classList.add("current");
    }

    span.textContent = targetChar;

    fragment.appendChild(span);
  }

  if (typedText.length >= targetText.length) {
    const caret = document.createElement("span");
    caret.classList.add("glyph", "current");
    caret.textContent = "|";
    fragment.appendChild(caret);
  }

  container.appendChild(fragment);
}
