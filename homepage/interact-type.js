const interactionTypeText = document.querySelector("#interact-type");
const mediaQuery = window.matchMedia("(pointer: coarse)");
isTouch = mediaQuery.matches;

if (!isTouch) {
  interactionTypeText.innerHTML = "hover over";
} else {
  interactionTypeText.innerHTML = "click on";
}
