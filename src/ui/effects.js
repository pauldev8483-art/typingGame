export function flashSuccess(element) {
  runAnimation(element, "flash");
}

export function shakeError(element) {
  runAnimation(element, "shake");
}

function runAnimation(element, className) {
  if (!element) return;
  element.classList.remove(className);
  // Force reflow so the animation can restart.
  void element.offsetWidth; // eslint-disable-line no-unused-expressions
  element.classList.add(className);
  const handleEnd = () => {
    element.classList.remove(className);
    element.removeEventListener("animationend", handleEnd);
  };
  element.addEventListener("animationend", handleEnd);
}
