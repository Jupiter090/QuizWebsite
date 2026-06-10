let id = 1;
const questionTemplate = document.getElementById("question-template");
const questionSection = document.getElementById("question-section");
let questions = [];
window.questionsOfQuiz = questions;
window.getAnswers = getAllQuestionsAnswers;

function createQuestion() {
  const wrapper = questionTemplate.content.cloneNode(true);
  const questionElements = wrapper.querySelector(".question");

  questionElements.dataset.id = id;
  questionElements.querySelector("#number").textContent =
    questions.length + 1 + ".";

  const question = new Question();
  question.id = id;
  question.correctAnswer = -1;

  //Sets data for checkboxes and divs of the answers
  questionElements
    .querySelectorAll(".question-checkbox")
    .forEach((element, idx) => {
      question.questionCheckboxes.push(element);
      const idOfAnswer = id.toString() + idx;
      element.dataset.id = idOfAnswer;
    });
  questionElements
    .querySelectorAll(".question-answer")
    .forEach((element, idx) => {
      const idOfAnswer = id.toString() + idx;
      element.dataset.id = idOfAnswer;
    });
  questionElements
    .closest(".question")
    .querySelector(".delete-button")
    .addEventListener("click", () => {
      removeQuestion(question.id);
    });

  questions.push(question);
  window.questionsOfQuiz = questions;
  questionSection.appendChild(questionElements);
  id++;
}

function removeQuestion(idOfQuestion) {
  questions = questions.filter((q) => q.id != idOfQuestion);
  window.questionsOfQuiz = questions;
  document.querySelector(`[data-id='${idOfQuestion}']`).remove();

  document.querySelectorAll(".question").forEach((el) => {
    const questionId = el.dataset.id;
    const index = questions.findIndex((e) => e.id == questionId);
    el.querySelector("#number").innerHTML = index + 1 + ".";
  });
}

//When a answer checkbox is clicked
document.addEventListener("click", (e) => {
  if (!e.target.matches(".question-checkbox")) return;
  const questionDiv = e.target.closest(".question");
  const id = questionDiv.dataset.id;

  //Find the question with the same id as the checkbox which was clicked
  const question = questions.find((q) => q.id == id);
  question.questionCheckboxes.forEach((el, idx) => {
    //Get's the input element
    const input = el
      .closest(".question-answer")
      .querySelector("input[type='text']");

    if (el.checked && el !== e.target) {
      el.checked = false;
      input.style.boxShadow = "";
      input.style.borderColor = "";
      return;
    }
    if (el != e.target) return;
    input.style.boxShadow = "0 0 10px green";
    input.style.borderColor = "green";
  });
});

function getAllQuestionsAnswers() {
  questions.forEach((question) => {
    const id = question.id;
    const questionDiv = document.querySelector(`[data-id='${id}']`);

    question.questionTitle = questionDiv.querySelector("#question-title").value;
    questionDiv
      .querySelectorAll("#question-answer")
      .forEach((answer, index) => {
        question.questionAnswers[index] = answer.value;
      });

    questionDiv
      .querySelectorAll(".question-checkbox")
      .forEach((checkBox, index) => {
        if (checkBox.checked === true) question.correctAnswer = index;
      });
  });

  window.questionsOfQuiz = questions;
}

class Question {
  id = 0;
  questionTitle = "";
  questionAnswers = ["", "", "", ""];
  questionCheckboxes = [];
  correctAnswer = 0;
}
