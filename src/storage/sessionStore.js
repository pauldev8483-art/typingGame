const HISTORY_KEY = "typing_game_history_v1";
const MAX_ENTRIES = 200;

export function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (error) {
    console.warn("Failed to load history", error);
    return [];
  }
}

export function addSession(summary) {
  const history = loadHistory();
  history.push(summary);
  const trimmed = history.slice(-MAX_ENTRIES);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.warn("Failed to save history", error);
  }
  return trimmed;
}

export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.warn("Failed to clear history", error);
  }
}
