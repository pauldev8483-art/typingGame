const samples = [
  "Accuracy beats speed until accuracy is automatic.",
  "Small pauses to reset posture and wrist angle can prevent sloppy keystrokes.",
  "Type with intent, not tension; smooth motion keeps errors low.",
  "function sum(list) { return list.reduce((carry, value) => carry + value, 0); }",
  "Clean habits compound: eyes on the screen, light touch on the keys.",
  "Focus on breathing and steady rhythm; haste introduces noise.",
  "Refactor your form like code: remove reaches, repeat the comfortable path.",
  "const config = { retries: 3, timeoutMs: 800 };",
  "Consistent accuracy builds confidence, and confidence brings speed.",
];

export function getNextText() {
  const index = Math.floor(Math.random() * samples.length);
  return samples[index];
}
