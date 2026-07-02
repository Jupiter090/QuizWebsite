const menu = document.querySelector(".nav");

function onHamburgerClick() {
  DoHamburgerAnimation(menu.querySelector(".hamburger"));
  if (menu.style.left == "-60%" || menu.style.left == "") {
    menu.style.left = "0%";
    menu
      .querySelector("button")
      .style.setProperty("--join-quiz-blur-show", "flex");
    menu
      .querySelector(".create-new-quiz-button")
      .style.setProperty("--join-quiz-blur-show", "flex");
    return;
  }
  menu.style.left = "-60%";
  menu.querySelector("button").style.boxShadow = "0 0 0";
  menu
    .querySelector(".create-new-quiz-button")
    .style.setProperty("--join-quiz-blur-show", "none");
}

function DoHamburgerAnimation(hamburgerDiv) {
  //From hamburger to cross
  if (hamburgerDiv.style.gap != "0px") {
    hamburgerDiv.style.gap = "0";
    hamburgerDiv.querySelector(".line1").style.transform =
      "translateY(100%) rotate(45deg)";
    hamburgerDiv.querySelector(".line2").style.transform = "rotate(45deg)";
    hamburgerDiv.querySelector(".line3").style.transform =
      "translateY(-100%) rotate(-45deg)";
    return;
  }
  //From cross to hamburger
  hamburgerDiv.style.gap = "0.33em";
  hamburgerDiv.querySelector(".line1").style.transform = "";
  hamburgerDiv.querySelector(".line2").style.transform = "";
  hamburgerDiv.querySelector(".line3").style.transform = "";
}
