export function countCorrectChars(targetText, typedText) {
  const limit = Math.min(targetText.length, typedText.length);
  let correct = 0;
  for (let i = 0; i < limit; i += 1) {
    if (typedText[i] === targetText[i]) correct += 1;
  }
  return correct;
}

export function calculateAccuracy(targetText, typedText) {
  const basis = Math.max(targetText.length, typedText.length);
  if (!basis) return 100;
  const correct = countCorrectChars(targetText, typedText);
  return (correct / basis) * 100;
}

export function calculateWPM(targetText, typedText, elapsedSeconds) {
  if (!elapsedSeconds) return 0;
  const correct = countCorrectChars(targetText, typedText);
  const words = correct / 5;
  return (words / elapsedSeconds) * 60;
}

export function buildMetrics(session, now = Date.now()) {
  const elapsedSeconds = session.startedAt
    ? ((session.endedAt ?? now) - session.startedAt) / 1000
    : 0;
  const accuracy = calculateAccuracy(session.targetText, session.typedText);
  const wpm = calculateWPM(session.targetText, session.typedText, elapsedSeconds);
  const progress = session.targetText.length
    ? Math.min(session.typedText.length / session.targetText.length, 1)
    : 0;

  return {
    accuracy,
    wpm,
    progress,
    elapsedSeconds,
  };
}
