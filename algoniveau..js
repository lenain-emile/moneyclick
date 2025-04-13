const level = document.getElementById("level");
const counterDisplay = document.getElementById("counter");
const clickButton = document.getElementById("bed");
const resetButton = document.getElementById("resetButton");

let count = parseInt(localStorage.getItem("clickCount")) || 0;
let clickValue = parseInt(localStorage.getItem("clickValue")) || 1;
let nextMilestone = Math.ceil(count / 100) * 100;
let levelValue = parseInt(localStorage.getItem("levelValue")) || 1;

counterDisplay.textContent = `Nombre d'XP : ${count}`;
level.textContent = `Niveau : ${levelValue}`;

clickButton.addEventListener("click", () => {
  count += clickValue;

  if (count >= nextMilestone) {
    clickValue++;
    levelValue++;
    nextMilestone += 100;

    localStorage.setItem("clickValue", clickValue);
    localStorage.setItem("levelValue", levelValue);

    level.textContent = `Niveau : ${levelValue}`;
  }

  localStorage.setItem("clickCount", count);
  counterDisplay.textContent = `Nombre d'XP : ${count}`;
});

resetButton.addEventListener("click", () => {
  
  count = 0;
  clickValue = 1;
  nextMilestone = 100;
  levelValue = 1;

  localStorage.setItem("clickCount", count);
  localStorage.setItem("clickValue", clickValue);
  localStorage.setItem("levelValue", levelValue);

  counterDisplay.textContent = `Nombre d'XP : ${count}`;
  level.textContent = `Niveau : ${levelValue}`;
});