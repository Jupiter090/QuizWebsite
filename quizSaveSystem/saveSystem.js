let quizes = [];
let quizIdToDelete = "";

const quizContainerTemplate = document.querySelector(
  "#my-quizes-container-template",
);
const noQuizesText = document.querySelector("#no-quizes-loaded");
const myQuizesContainer = document.querySelector(".my-quizes");

window.quizesToSave = quizes;
window.saveQuizesToStorage = saveQuizes;
function saveQuizes(savedQuiz) {
  quizes.push(savedQuiz);
  localStorage.setItem("savedQuizes", JSON.stringify(quizes));

  createQuizElement(savedQuiz);
  noQuizesText.style.display = "none";
}

function loadQuizes() {
  const stored = localStorage.getItem("savedQuizes");
  quizes = stored ? JSON.parse(stored) : [];
  window.quizesToSave = quizes;
  if (quizes.length == 0) {
    noQuizesText.style.display = "block";
    console.log(quizes);

    return;
  }
  console.log(quizes);

  quizes.forEach((quiz) => {
    createQuizElement(quiz);
  });
}

function createQuizElement(savedQuiz) {
  const element = quizContainerTemplate.content.cloneNode(true);
  const quizContainer = element.querySelector(".quiz-container");
  const quizName = element.querySelector(".quiz-container-name");
  const quizEdit = element.querySelector(".quiz-container-edit");
  const quizId = element.querySelector(".quiz-container-id");
  const copyButton = element.querySelector(".quiz-container-copy-button");
  const deleteButton = element.querySelector(".quiz-container-delete-button");

  quizContainer.dataset.id = savedQuiz.publicId;
  quizName.innerHTML = savedQuiz.name;
  quizEdit.innerHTML = "Edited: " + savedQuiz.timeCreated;
  quizId.innerHTML = "ID: #" + savedQuiz.publicId;
  copyButton.addEventListener("click", (e) => {
    link = window.location.host + "/quiz.html?id=" + savedQuiz.publicId;
    navigator.clipboard.writeText(link);
  });
  deleteButton.addEventListener("click", (e) => {
    onDeleteButtonClick(savedQuiz.publicId);
  });

  myQuizesContainer.appendChild(quizContainer);
}

function onDeleteButtonClick(quizID) {
  quizIdToDelete = quizID;

  const messageBox = document.querySelector("#delete-message");
  messageBox.style.display = "flex";
}
function onBackButtonClick() {
  quizIdToDelete = "";

  const messageBox = document.querySelector("#delete-message");
  messageBox.style.display = "none";
}

async function deleteQuiz() {
  const response = await fetch(
    window.apiIp + "/api/Quiz/deleteQuiz?quizId=" + quizIdToDelete,
  );
  const result = await response.json();
  console.log(result);

  if (!response.ok) {
    return;
  }

  quizes = quizes.filter((q) => q.publicId != quizIdToDelete);
  if (quizes.length == 0) noQuizesText.style.display = "block";

  localStorage.setItem("savedQuizes", JSON.stringify(quizes));
  myQuizesContainer.querySelector(`[data-id=${quizIdToDelete}]`).remove();

  onBackButtonClick();
}

window.addEventListener("load", loadQuizes);

class savedQuizes {
  name = "";
  timeCreated = "";
  publicId = "";
}
