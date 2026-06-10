const idInput = document.querySelector(".join-quiz-input");
const notFoundTxt = document.querySelector(".quiz-id-not-found");

function onStartQuizButtonClick() {
  const id = document.querySelector("#publicQuizId").value;
  getQuiz(id.toUpperCase());
}

async function getQuiz(id) {
  const response = await fetch(
    window.apiIp +
      "/api/Quiz/getquiz?publicId=" +
      id +
      "&checkIfQuizExists=true",
  );
  if (response.status == "404" || response.status == "400") {
    idInput.style.borderColor = "#fc3d3d";
    notFoundTxt.style.display = "flex";
    return;
  }
  idInput.style.borderColor = "#1d1d24";
  notFoundTxt.style.display = "none";

  const link = "/quiz.html?id=" + id;
  window.location.href = link;
}

//Prevent reload from form
let form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
});
