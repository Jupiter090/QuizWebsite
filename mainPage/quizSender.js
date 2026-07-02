let quizQuestions = [];
const messageBox = document.querySelector(".message-div");
let link = "";

async function onPublishQuizClick(isEdit = false) {
  quiz = await createQuizObject();
  if (quiz === null) return;
  if (isEdit) {
    sendEditedQuiz(quiz);
    return;
  }
  await sendQuiz(quiz);
}

function createQuizObject() {
  let quiz = new Quiz();

  const quizTitle = document.getElementById("quizTitle");
  //Style for the title of the quiz input based on if it was filled in or not
  //If not then the quiz cannot be created
  if (quizTitle.value == "") {
    quizTitle.style.borderColor = "#fc3d3d";
    quizTitle.style.borderWidth = "0.2rem";
    return null;
  }
  quizTitle.style.borderColor = "#32323f";
  quizTitle.style.borderWidth = "2px";
  quiz.quizTitle = quizTitle.value;

  const quizDescription = document.getElementById("quizDescription");
  quiz.quizDescription = quizDescription.value;

  //Get the qiestions from the quiz
  window.getAnswers();
  questions = window.questionsOfQuiz;
  //Check if there are any questions
  //If not then the questions section box has red outline and the quiz cannot be created
  if (questions === undefined || questions.length == 0) {
    const questionSection = document.querySelector("#question-section");
    questionSection.style.borderColor = "#fc3d3d";
    return null;
  }
  questionSection.style.borderColor = "#2a2a33";

  let isValid = true;
  questions.forEach((q) => {
    const question = new QuizQuestion();
    question.questionId = q.id;
    if (q.correctAnswer == -1) {
      document.querySelector(`[data-id='${q.id}'].question`).style.borderColor =
        "#fc3d3d";
      isValid = false;
    } else {
      document.querySelector(`[data-id='${q.id}'].question`).style.borderColor =
        "#32323f";
    }
    question.correctAnswer = q.correctAnswer;

    //Checks if for every question user has inputed a title for the question
    const questionTitleInput = document
      .querySelector(`[data-id='${q.id}'].question`)
      .querySelector("#question-title");
    if (q.questionTitle == "") {
      isValid = false;
      questionTitleInput.style.borderColor = "#fc3d3d";
    } else {
      questionTitleInput.style.borderColor = "#32323f";
    }
    question.questionTitle = q.questionTitle;

    //Resets all of the answer's input field to the normal color
    q.questionAnswers.forEach((ans, index) => {
      document
        .querySelector(`[data-id='${q.id}'].question`)
        .querySelector(`[data-id='${q.id.toString() + index}']`)
        .querySelector("#question-answer").style.borderColor = "#32323f";
    });
    //Checks if there is at least one answer not typed in
    //If so it highlights that input field in document and stop the quiz creation
    if (q.questionAnswers.includes("")) {
      const index = q.questionAnswers.findIndex((a) => a == "");
      document
        .querySelector(`[data-id='${q.id}'].question`)
        .querySelector(`[data-id='${q.id.toString() + index}']`)
        .querySelector("#question-answer").style.borderColor = "#fc3d3d";
      isValid = false;
    }
    question.answers = q.questionAnswers;
    quiz.questions.push(question);
  });

  if (!isValid) return null;

  return quiz;
}
async function sendQuiz(quiz) {
  showMessageBox();
  const response = await fetch(window.apiIp + "/api/Quiz", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      publicID: "",
      editID: "",
      quizName: quiz.quizTitle,
      quizDescription: quiz.quizDescription,
      questions: quiz.questions,
    }),
  });
  const result = await response.json();

  if (response.status != 200) {
    messageUnsuccessful();
    console.log("There was a problem trying to create new quiz!");
    return;
  }

  messageSuccessful();

  const date = new Date();
  const quizToSave = new savedQuizes();
  quizToSave.name = quiz.quizTitle;
  quizToSave.publicId = result.id;
  quizToSave.editId = result.editId;
  quizToSave.timeCreated = `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()} - ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

  console.log(result.editId);
  console.log(quizToSave);
  window.saveQuizesToStorage(quizToSave);
  showQuizInfo(result);
}

async function sendEditedQuiz(quiz) {
  showMessageBox();

  const editId = new URLSearchParams(window.location.search).get("editid");
  const response = await fetch(
    window.apiIp + "/api/Quiz/editQuiz?editId=" + editId,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        publicId: "",
        editId: editId,
        quizName: quiz.quizTitle,
        quizDescription: quiz.quizDescription,
        questions: quiz.questions,
      }),
    },
  );

  if (response.status != 200) {
    messageUnsuccessful();
    console.log("There was a problem trying to edit new quiz!");
    return;
  }

  messageSuccessful();
  const result = await response.json();
  const date = new Date();
  const quizToSave = new savedQuizes();
  quizToSave.name = quiz.quizTitle;
  quizToSave.publicId = result.publicId;
  quizToSave.editId = editId;
  quizToSave.timeCreated = `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()} - ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

  console.log(result);
  showQuizInfo({ id: result.publicId, editId: editId });

  window.editQuiz(quizToSave);
}
function onCopyLinkClick() {
  const copyBtn = messageBox.querySelector(".copy-link-button");
  copyBtn.innerHTML = "Copied!";
  navigator.clipboard.writeText(window.location.host.toString() + link);
  setTimeout(setCopyButtonTextBack, 3000);
}
function setCopyButtonTextBack(copyBtn) {
  messageBox.querySelector(".copy-link-button").innerHTML =
    "<i class='fa fa-clipboard'></i> Copy link";
}

class Quiz {
  quizTitle = "";
  quizDescription = "";
  questions = [];
}

class QuizQuestion {
  id = 0;
  publicQuizId = "";
  questionId = 0;
  questionTitle = "";
  answers = [];
  correctAnswer = 0;
}
