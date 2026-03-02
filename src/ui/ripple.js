export function spawnRipple({ index, ui }) {
  if (!ui.floatLayer) return;
  const glyph = ui.textDisplay.querySelector(`[data-idx="${index}"]`);
  const anchor = glyph ?? ui.textShell;
  if (!anchor) return;

  const hostRect = ui.floatLayer.getBoundingClientRect();
  const rect = anchor.getBoundingClientRect();

  const ripple = document.createElement("div");
  ripple.className = "ripple";

  const left = rect.left - hostRect.left + rect.width / 2;
  const top = rect.top - hostRect.top + rect.height / 2;

  ripple.style.left = `${left}px`;
  ripple.style.top = `${top}px`;

  ui.floatLayer.appendChild(ripple);

  const remove = () => ripple.remove();
  ripple.addEventListener("animationend", remove);
  setTimeout(remove, 800);
}
