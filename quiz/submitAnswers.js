let answersToSubmit = [];
const answerManager = document.querySelector("#answer-manager");
const confimartionMenu = document.querySelector(".message-div");
const submitButton = document.querySelector(".submit-button");
const resultTxt = document.querySelector(".results-text");

function openConfirmationMenu() {
  answersToSubmit = [];
  let isValid = false;
  for (const question of document.querySelectorAll(".question")) {
    const answerToSubmit = new submittedAnswers();
    answerToSubmit.questionId = question.dataset.id;

    let isValid = false;

    question.querySelectorAll("input").forEach((answer, index) => {
      if (answer.checked) {
        answerToSubmit.answerIndex = index;
        isValid = true;
      }
    });

    if (!isValid) {
      question.style.borderColor = "#fc3d3d";
      return;
    }

    question.style.borderColor = "#202025";
    question.style.borderTopColor = "#3a3a42";
    answersToSubmit.push(answerToSubmit);
  }
  confimartionMenu.style.display = "flex";
}
function closeConfirmationMenu() {
  confimartionMenu.style.display = "none";
}

function onSubmitAnswersClick() {
  sendAnswers();
  confimartionMenu.style.display = "none";
}

async function sendAnswers() {
  const response = await fetch(
    window.apiIp + "/api/Quiz/checkQuiz?quizId=" + window.id,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(answersToSubmit),
    },
  );

  const result = await response.json();
  console.log(result);
  showResults(result);
}

function showResults(result) {
  //Disables all of the checkboxes
  result.answersCorrections.forEach((correction, index) => {
    document
      .querySelector(`[data-id='${result.questionIds[index]}']`)
      .querySelectorAll("input")
      .forEach((input) => {
        input.disabled = true;
      });
    //If the answer was correct there isn't anything to change
    if (correction) return;

    //Marks the one which was wrongly selected
    document
      .querySelector(`[data-id='${result.questionIds[index]}']`)
      .querySelectorAll("input")
      .forEach((input) => {
        if (input.checked == false) return;
        input.style.setProperty("--input-color", "red");
      });
    //Marks out the right answer
    const inputOfCorrectAnswer = document.querySelector(
      `[data-id='${result.questionIds[index].toString() + result.correctAnswers[index]}']`,
    );
    inputOfCorrectAnswer.checked = true;
  });

  document.removeEventListener("click", window.handleClick);

  //Removes the pointer cursor when hovering over answers
  document.querySelectorAll("input").forEach((element) => {
    element.style.setProperty("--cursor-over-answers", "default");
  });
  document.querySelectorAll(".answer-text").forEach((element) => {
    element.style.setProperty("--cursor-over-answers", "default");
  });

  //Hides the submit button
  submitButton.style.display = "none";
  resultTxt.style.display = "inherit";
  const resultingPercentage =
    (result.amountOfCorrectAnswers / answersToSubmit.length) * 100;
  resultTxt.innerHTML =
    "Result: " +
    Math.round(resultingPercentage * 100) / 100 +
    "% - " +
    result.amountOfCorrectAnswers +
    "/" +
    answersToSubmit.length;
}

class submittedAnswers {
  questionId = "";
  answerIndex = 0;
}
