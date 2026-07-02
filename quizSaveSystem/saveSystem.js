let quizes = [];
let quizIdToDelete = "";

const quizContainerTemplate = document.querySelector(
  "#my-quizes-container-template",
);
const noQuizesText = document.querySelector("#no-quizes-loaded");
const myQuizesContainer = document.querySelector(".my-quizes");

window.quizesToSave = quizes;
window.saveQuizesToStorage = saveQuizes;
window.editQuiz = editQuiz;

function saveQuizes(savedQuiz) {
  quizes.push(savedQuiz);
  localStorage.setItem("savedQuizes", JSON.stringify(quizes));

  createQuizElement(savedQuiz);
  noQuizesText.style.display = "none";
}
function editQuiz(savedQuiz) {
  const indexOfQuiz = quizes.findIndex((q) => q.editId == savedQuiz.editId);
  if (indexOfQuiz == -1) return;

  quizes[indexOfQuiz] = savedQuiz;

  localStorage.setItem("savedQuizes", JSON.stringify(quizes));
  document.querySelectorAll(".quiz-container").forEach((container) => {
    container.remove();
  });
  loadQuizes();
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
  const editId = element.querySelector(".quiz-container-editid");
  const copyButton = element.querySelector(".quiz-container-copy-button");
  const deleteButton = element.querySelector(".quiz-container-delete-button");
  const editButton = element.querySelector(".quiz-container-edit-button");

  quizContainer.dataset.id = savedQuiz.editId;
  quizName.innerHTML = savedQuiz.name;
  quizEdit.innerHTML = "Edited: " + savedQuiz.timeCreated;
  quizId.innerHTML = "ID: #" + savedQuiz.publicId;
  editId.innerHTML = "EditID: " + savedQuiz.editId;
  copyButton.addEventListener("click", (e) => {
    link = window.location.host + "/quiz.html?id=" + savedQuiz.publicId;
    navigator.clipboard.writeText(link);
  });
  deleteButton.addEventListener("click", (e) => {
    console.log(savedQuiz.editId);
    onDeleteButtonClick(savedQuiz.editId);
  });
  editButton.addEventListener("click", (e) => {
    link = "/editquiz.html?editid=" + savedQuiz.editId;
    window.location.href = link;
  });

  myQuizesContainer.appendChild(quizContainer);
}

function onDeleteButtonClick(editId) {
  quizIdToDelete = editId;

  const messageBox = document.querySelector("#delete-message");
  messageBox.style.display = "flex";
}
function onBackButtonClick() {
  quizIdToDelete = "";

  const messageBox = document.querySelector("#delete-message");
  messageBox.style.display = "none";
}

async function deleteQuiz() {
  const messageBox = (document.querySelector("#delete-message").style.display =
    "none");
  showMessageBox();
  const response = await fetch(
    window.apiIp + "/api/Quiz/deleteQuiz?editId=" + quizIdToDelete,
    {
      method: "DELETE",
      headers: { "ngrok-skip-browser-warning": "1" },
    },
  );
  const result = await response.json();
  if (!response.ok) {
    messageUnsuccessful();
    return;
  }

  messageSuccessful();
  document.querySelector("#delete-message-confirmation").style.display = "flex";
  quizes = quizes.filter((q) => q.editId != quizIdToDelete);
  if (quizes.length == 0) noQuizesText.style.display = "block";

  localStorage.setItem("savedQuizes", JSON.stringify(quizes));
  myQuizesContainer.querySelector(`[data-id=${quizIdToDelete}]`).remove();
}

window.addEventListener("load", loadQuizes);

class savedQuizes {
  name = "";
  timeCreated = "";
  publicId = "";
  editId = "";
}
