const counterDisplay = document.getElementById("counter");
const clickButton = document.getElementById("clickButton");
const resetButton = document.getElementById("resetButton");

let count = parseInt(localStorage.getItem("clickCount")) || 0;
let clickvalue = parseInt(localStorage.getItem("clickValue")) || 1;
let nextMilestone = Math.ceil(count / 100) * 100; 

counterDisplay.textContent = "Nombre de clics : " + count;

clickButton.addEventListener("click", () => {
  count += clickvalue;

  if (count >= nextMilestone) {
    clickvalue++;
    nextMilestone += 100; 
    localStorage.setItem("clickValue", clickvalue);
    alert("Vous avez débloqué un nouveau niveau ! Votre valeur de clic est maintenant : " + clickvalue);
  }

  localStorage.setItem("clickCount", count);
  counterDisplay.textContent = "Nombre de clics : " + count;
});

resetButton.addEventListener("click", () => {
  count = 0;
  clickvalue = 1;
  nextMilestone = 100; 
  localStorage.setItem("clickCount", count);
  localStorage.setItem("clickValue", clickvalue);
  counterDisplay.textContent = "Nombre de clics : " + count;
});





