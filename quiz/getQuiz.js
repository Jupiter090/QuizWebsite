const quizNotFound = document.querySelector(".quiz-not-found");
const quizFound = document.querySelector(".quiz-found");
const idOfQuiz = document.querySelector("#quizId");
let publicId = "";
let quiz = null;

const questionTemplate = document.querySelector("#question-template");
const questionSection = document.querySelector("#question-section");

onLoad();

function onLoad() {
  const params = new URLSearchParams(window.location.search);
  publicId = params.get("id").toUpperCase();
  window.id = publicId;

  if (publicId.length != 6) {
    quizNotFound.style.display = "flex";
    idOfQuiz.innerHTML = publicId;
  }
  getQuiz();
}

async function getQuiz() {
  const response = await fetch(
    window.apiIp + "/api/Quiz/getquiz?publicid=" + publicId,
  );

  if (!response.ok) {
    quizNotFound.style.display = "flex";
    idOfQuiz.innerHTML = publicId;
    return;
  }
  quizFound.style.display = "flex";
  quiz = await response.json();

  window.questions = quiz.questions;
  AssignNameAndDescription();
  CreateQuestions();
}

function AssignNameAndDescription() {
  const quizIdTxt = document.querySelector(".quiz-id");
  const quizTitle = document.querySelector("#quiz-title");
  const quizDescription = document.querySelector("#quiz-description");

  quizIdTxt.innerHTML = "ID: #" + quiz.publicID;
  quizTitle.innerHTML = quiz.quizName;
  document.title = quiz.quizName;
  quizDescription.innerHTML = quiz.quizDescription;
}

function CreateQuestions() {
  quiz.questions.forEach((question, index) => {
    const wrapper = questionTemplate.content.cloneNode(true);
    const questionElements = wrapper.querySelector(".question");

    questionElements.dataset.id = question.questionId;
    questionElements.querySelector(".question-title").innerHTML =
      index + 1 + ". " + question.questionTitle;

    questionElements
      .querySelectorAll(".answer-text")
      .forEach((answerTxt, ind) => {
        answerTxt.innerHTML = question.answers[ind];
        answerTxt.dataset.id = question.questionId.toString() + ind;
      });
    questionElements
      .querySelectorAll(".question-checkbox")
      .forEach((checkbox, ind) => {
        checkbox.dataset.id = question.questionId.toString() + ind;
      });

    questionSection.appendChild(questionElements);
  });
}
