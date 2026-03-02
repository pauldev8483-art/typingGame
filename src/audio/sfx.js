let audioCtx;
let masterVolume = 0.6;

function getContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playTone({
  frequency,
  durationMs,
  type = "sine",
  gain = 0.08,
  decayMs = 80,
  detuneRangeCents = 0,
}) {
  const ctx = getContext();
  const oscillator = ctx.createOscillator();
  const amp = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;

  if (detuneRangeCents) {
    const detune = (Math.random() * 2 - 1) * detuneRangeCents;
    oscillator.detune.value = detune;
  }

  const now = ctx.currentTime;
  const durationSec = durationMs / 1000;
  const decaySec = decayMs / 1000;

  const scaledGain = gain * masterVolume;
  amp.gain.setValueAtTime(scaledGain, now);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + durationSec + decaySec);

  oscillator.connect(amp).connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + durationSec + decaySec);
}

export function playHit() {
  // Low, muted click with slight pitch variation for typewriter feel.
  playTone({
    frequency: 220 + Math.random() * 40,
    durationMs: 55,
    decayMs: 70,
    type: "triangle",
    gain: 0.05 + Math.random() * 0.01,
    detuneRangeCents: 15,
  });
}

export function playMiss() {
  playTone({ frequency: 170, durationMs: 150, type: "sine", gain: 0.06, detuneRangeCents: 10 });
}

export function playComplete() {
  playTone({ frequency: 480, durationMs: 110, type: "triangle", gain: 0.06, detuneRangeCents: 8 });
  setTimeout(
    () => playTone({ frequency: 720, durationMs: 110, type: "triangle", gain: 0.06, detuneRangeCents: 8 }),
    80,
  );
}

export function setVolume(volume) {
  const normalized = Math.min(Math.max(volume, 0), 1);
  masterVolume = normalized;
}

export function getVolume() {
  return masterVolume;
}
