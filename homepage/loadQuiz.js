const idInput = document.querySelector("#quiz-id-input>input");
const editIdInput = document.querySelector("#edit-id-input>input");
const loadingScreen = document.querySelector(".loading-screen");

idInput.addEventListener("input", (e) => {
  if (idInput.value.length > 6) idInput.value = idInput.value.slice(0, -1);
});
editIdInput.addEventListener("input", (e) => {
  if (editIdInput.value.length > 16)
    editIdInput.value = editIdInput.value.slice(0, -1);
});

async function loadQuiz() {
  if (idInput.value.length != 6) return;

  loadingScreen.style.display = "flex";
  const response = await fetch(
    window.apiIp +
      "/api/Quiz/getquiz?publicId=" +
      idInput.value +
      "&checkIfQuizExists=true",
  );

  if (response.status == "404" || response.status == "400") {
    document.querySelector(".not-found-text#quiz-id").style.display = "block";
    document.querySelector(".id-form#quiz-id-input ").style.boxShadow =
      "0 0 15px #f42b2b";
  } else {
    window.location.href = "quiz.html?id=" + idInput.value;
  }

  loadingScreen.style.display = "none";
}

async function editQuiz() {
  if (editIdInput.value.length != 16) return;

  loadingScreen.style.display = "flex";
  const response = await fetch(
    window.apiIp + "/api/Quiz/getquiz?editId=" + editIdInput.value,
  );

  if (response.status == "404" || response.status == "400") {
    document.querySelector(".not-found-text#edit-id").style.display = "block";
    document.querySelector(".id-form#edit-id-input").style.boxShadow =
      "0 0 15px #f42b2b";
  } else {
    window.location.href = "editquiz.html?editid=" + editIdInput.value;
  }

  loadingScreen.style.display = "none";
}
