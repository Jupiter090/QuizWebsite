let questions = [];
window.questions = questions;

const handleClick = (e) => {
  questions = window.questions;
  if (
    !e.target.matches(".question-checkbox") &&
    !e.target.matches(".answer-text")
  ) {
    return;
  }
  const id = e.target.dataset.id;
  const question = questions.find(
    (q) => q.questionId == id.toString().slice(0, -1),
  );
  const questionElement = e.target.closest(".question");
  questionElement.querySelectorAll("#answer").forEach((element) => {
    if (element.nodeName == "INPUT") {
      element.checked = false;
    }

    if (e.target.nodeName == "INPUT") {
      //When checkbox is clicked
      e.target.checked = true;
    } else {
      //When text is clicked
      e.target.previousElementSibling.checked = true;
    }
  });
};
window.handleClick = handleClick;

document.addEventListener("click", handleClick);
