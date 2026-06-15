const spinningCircle = document.querySelector(".spinning-circle");
const messageDiv = document.querySelector(".message-div");

function messageSuccessful() {
  messageDiv.querySelector("#sending-message").style.display = "none";

  spinningCircle.style.borderColor = "#09c929";
  spinningCircle.style.color = "#09c929";
  spinningCircle.classList.add("stop-animation");
  spinningCircle.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i>';
}

function messageUnsuccessful() {
  messageDiv.querySelector("#sending-message").style.display = "none";
  document.querySelector(".unsuccessful-message").style.display = "flex";

  spinningCircle.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>';
  spinningCircle.style.borderColor = "#fc3d3d";
  spinningCircle.style.color = "#fc3d3d";
  spinningCircle.classList.add("stop-animation");
}

function closeMessageBox() {
  document.querySelector(".message-div").style.display = "none";
  spinningCircle.classList.remove("stop-animation");
  spinningCircle.style.borderColor = "#3b3b44";
  spinningCircle.style.color = "#3b3b44";
  spinningCircle.innerHTML = "";
}

function showMessageBox() {
  document.querySelector(".unsuccessful-message").style.display = "none";
  document.querySelector("#delete-message-confirmation").style.display = "none";

  messageDiv.style.display = "flex";
  messageDiv.querySelector("#sending-message").style.display = "flex";
}

function showQuizInfo(response) {
  document.querySelector("#publish-message").style.display = "flex";
  messageBox.querySelector("#id-text").innerHTML =
    "ID: #" + response.id.toLowerCase();
  link = "/quiz.html?id=" + response.id.toLowerCase();
  messageBox.querySelector("#edit-id-text").innerHTML =
    "EditID: " +
    response.editId.toLowerCase() +
    "<span class='red'> (DO NOT SHARE!)</span>";
  messageBox.querySelector("#link-text").innerHTML =
    "Link: <a target='_blank' href='" +
    link +
    "'>" +
    window.location.host +
    link +
    "</a>";

  messageBox
    .querySelector(".edit-quiz-button")
    .addEventListener("click", (e) => {
      window.location.replace("/editQuiz.html?editId=" + response.editId);
    });
  messageBox
    .querySelector(".new-quiz-button")
    .addEventListener("click", (e) => {
      window.location.href = "/";
    });
}
