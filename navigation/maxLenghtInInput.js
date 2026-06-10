const input = document.querySelector("#publicQuizId");

input.addEventListener("input", (e) => {
  if (input.value.length > 6) input.value = input.value.slice(0, -1);
});
