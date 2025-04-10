const level = document.getElementById("level");
const counterDisplay = document.getElementById("counter");
const clickButton = document.getElementById("clickButton");
const resetButton = document.getElementById("resetButton");
const toast = new bootstrap.Toast(document.getElementById('leveltoast'));

let count = parseInt(localStorage.getItem("clickCount")) || 0;
let clickvalue = parseInt(localStorage.getItem("clickValue")) || 1;
let nextMilestone = Math.ceil(count / 100) * 100; 
let levelValue = parseInt(localStorage.getItem("levelValue")) || 1;

counterDisplay.textContent = "Nombre de clics : " + count;

clickButton.addEventListener("click", () => {
  count += clickvalue;

  if (count >= nextMilestone) {
    clickvalue++;
    levelValue++;
    level.textContent = "Niveau : " + levelValue;
    nextMilestone += 100; 
    localStorage.setItem("clickValue", clickvalue);
    localStorage.setItem("levelValue", levelValue);
    toast.show();
    
  }

  localStorage.setItem("clickCount", count);
  counterDisplay.textContent = "Nombre de clics : " + count;

});


resetButton.addEventListener("click", () => {
  count = 0;
  clickvalue = 1;
  nextMilestone = 100; 
  levelValue = 0;
  localStorage.setItem("clickCount", count);
  localStorage.setItem("clickValue", clickvalue);
  counterDisplay.textContent = "Nombre de clics : " + count;
});




