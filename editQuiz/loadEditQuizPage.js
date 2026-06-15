const params = new URLSearchParams(window.location.search);
const nameTextBox = document.querySelector("#quizTitle");
const descriptionTextBox = document.querySelector("#quizDescription");
const questionTemplateToCopy = document.querySelector("#question-template");
const questionEditSection = document.querySelector("#question-section");

document.addEventListener("load", onLoad());

function onLoad() {
  const editId = params.get("editId");
  if (editId == "") return;
  getQuiz(editId);
}

async function getQuiz(editId) {
  showMessageBox();
  const response = await fetch(
    window.apiIp + "/api/Quiz/getquiz?editId=" + editId,
  );

  if (!response.ok) {
    document.title = "Quiz not found!";
    document.querySelector(".quiz-not-found").style.display = "flex";
    messageUnsuccessful();
    return;
  }
  closeMessageBox();
  document.querySelector(".quiz-found").style.display = "flex";
  const result = await response.json();
  loadQuiz(result);
}

function loadQuiz(quiz) {
  nameTextBox.value = quiz.quizName;
  document.title = "Editing " + quiz.quizName;
  descriptionTextBox.value = quiz.quizDescription;

  quiz.questions.forEach((quest, indx) => {
    createQuizQuestion(quest, indx);
  });
}

function createQuizQuestion(question, index) {
  const template = questionTemplateToCopy.content.cloneNode(true);
  const questionSection = template.querySelector(".question");

  questionSection.dataset.id = question.questionId;
  questionSection.querySelector("#number").innerHTML = index + 1 + ". ";
  questionSection.querySelector("#question-title").value =
    question.questionTitle;

  const questionToAdd = new Question();
  questionToAdd.id = question.questionId;
  questionToAdd.correctAnswer = question.correctAnswer;

  questionSection
    .querySelectorAll("#question-answer")
    .forEach((questionElement, i) => {
      questionElement.value = question.answers[i];
    });
  questionSection
    .querySelectorAll(".question-checkbox")
    .forEach((element, idx) => {
      questionToAdd.questionCheckboxes.push(element);
      const idOfAnswer = question.questionId.toString() + idx;
      element.dataset.id = idOfAnswer;
    });
  questionSection
    .querySelectorAll(".question-answer")
    .forEach((element, idx) => {
      const idOfAnswer = question.questionId.toString() + idx;
      element.dataset.id = idOfAnswer;
    });
  questionSection
    .closest(".question")
    .querySelector(".delete-button")
    .addEventListener("click", () => {
      removeQuestion(question.questionId);
    });
  questionToAdd.questionCheckboxes[question.correctAnswer].checked = true;
  const input = questionToAdd.questionCheckboxes[question.correctAnswer]
    .closest(".question-answer")
    .querySelector("input[type='text']");
  input.style.boxShadow = "0 0 10px green";
  input.style.borderColor = "green";

  window.questionsOfQuiz.push(questionToAdd);
  window.nextQuestionId =
    window.questionsOfQuiz.reduce((maxId, q) => {
      return q.id > maxId.id ? q : maxId;
    }).id + 1;

  questionEditSection.appendChild(questionSection);
}
