export function spawnFloatingWord({ word, startIndex, endIndex, ui }) {
  if (!ui.floatLayer) return;

  const startGlyph = ui.textDisplay.querySelector(`[data-idx="${startIndex}"]`);
  const endGlyph = ui.textDisplay.querySelector(`[data-idx="${endIndex}"]`);
  const anchor = endGlyph || startGlyph;
  if (!anchor) return;

  const hostRect = ui.floatLayer.getBoundingClientRect();
  const startRect = startGlyph?.getBoundingClientRect() ?? anchor.getBoundingClientRect();
  const endRect = endGlyph?.getBoundingClientRect() ?? anchor.getBoundingClientRect();

  const bubble = document.createElement("div");
  bubble.className = "float-word";
  bubble.textContent = word;

  const left = (startRect.left + endRect.right) / 2 - hostRect.left;
  const top = Math.min(startRect.top, endRect.top) - hostRect.top;

  bubble.style.left = `${left}px`;
  bubble.style.top = `${top}px`;

  ui.floatLayer.appendChild(bubble);

  const remove = () => bubble.remove();
  bubble.addEventListener("animationend", remove);
  setTimeout(remove, 1200);
}
