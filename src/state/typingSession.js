export function createTypingSession(targetText) {
  return {
    targetText,
    typedText: "",
    startedAt: null,
    endedAt: null,
  };
}

export function updateTypedValue(session, nextValue, now = Date.now()) {
  const normalized = normalizeInput(nextValue, session.targetText.length);
  const next = {
    ...session,
    typedText: normalized,
  };

  if (!session.startedAt && normalized.length > 0) {
    next.startedAt = now;
  }

  const isComplete = normalized.length >= session.targetText.length;
  if (isComplete && !session.endedAt) {
    next.endedAt = now;
  }

  if (!isComplete) {
    next.endedAt = null;
  }

  return next;
}

function normalizeInput(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.slice(0, maxLength);
}
