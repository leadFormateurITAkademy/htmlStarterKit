// Select the div via it's id and store the selected element
// inside gameContainer var.
let gameContainer;
let turnCounter = 0;
const variante = true;
const caseNumber = 10;

function init() {
  // gameContainer is the dom object.
  let gameContainerDiv = document.createElement('div');
  gameContainerDiv.id = "game-container";
  for (var i = 1; i <= caseNumber; i++) {
    let tempDiv = document.createElement('div');
    tempDiv.className = "green-color";
    gameContainerDiv.appendChild(tempDiv);
  }
  document.querySelector('[data-use="gameBoard-container"]').appendChild(gameContainerDiv);

  // Creation of reinit button
  let reinitButton = document.createElement('input');
  reinitButton.setAttribute('type', 'button');
  reinitButton.setAttribute('value', 'Reinit');
  reinitButton.setAttribute('data-action', 'reinit');
  document.querySelector('[data-use="gameBoard-container"]').appendChild(reinitButton);

  // Creation of turnCounter div
  let counterDiv = document.createElement('div');
  counterDiv.setAttribute('data-use', 'turnCounter');
  counterDiv.innerHTML = 0;
  document.querySelector('[data-use="gameBoard-container"]').appendChild(counterDiv);

  load();
  // Resume normal operations
  gameContainer = document.querySelector('#game-container');
  document.querySelector('[data-action="reinit"]').addEventListener('click', function() {
    reinit();
  })
  // When someone clicks on anything inside the game container, it triggers
  // the anonymous function
  gameContainer.addEventListener('click', function(el) {
    let childDivs = document.querySelectorAll('#game-container>div');

    // We get the target of the click event, which is the specific div and not
    // the container div
    let clickedElement = el.target;

    for(let i = 0; i < childDivs.length; i++)
    {
      // childDivs[i] allow us to display every value of the childDivs array
      // because we select it via the array key [i]
      if (childDivs[i] == clickedElement) {
        if(i > 0 && i < (childDivs.length - 1)) {
          invertColor(childDivs[i + 1]);
          invertColor(childDivs[i - 1]);
          if(variante) {
            invertColor(childDivs[i]);
          }
        } else if(i == 0) {
          invertColor(childDivs[i + 1]);
          if(variante) {
            invertColor(childDivs[i]);
          }
        } else if(i == (childDivs.length - 1)) {
          invertColor(childDivs[i - 1]);
          if(variante) {
            invertColor(childDivs[i]);
          }
        }
      }
    }
    incrementTurnCounter(document.querySelector('[data-use="turnCounter"]'));
    checkVictory(childDivs);
    checkDefeat();
    save();
  });
}
function save() {
  // Saving the turn counter
  localStorage.setItem('turnCounter', turnCounter);
  let childDivsToSave = document.querySelectorAll('#game-container>div');
  let saveJson = {};
  for (var i = 0; i < childDivsToSave.length; i++) {
    saveJson[i] = childDivsToSave[i].className;
  }
  localStorage.setItem('gameContainerStatus', JSON.stringify(saveJson));
}
function load() {
  document.querySelector('[data-use="turnCounter"]').innerHTML = localStorage.getItem('turnCounter') ? localStorage.getItem('turnCounter') : 0;
  if(localStorage.getItem('gameContainerStatus')) {
    let gameStatusJson = JSON.parse(localStorage.getItem('gameContainerStatus'));
    let childDivs = document.querySelectorAll('#game-container>div');
    for (var i = 0; i < childDivs.length; i++) {
      childDivs[i].className = gameStatusJson[i];
    }
  } else {
    console.log('Ya rien');
  }
}
function checkDefeat() {
  if(turnCounter >= 10) {
    alert('Tu as loosé');
    reinit();
  }
}
function reinit() {
  let childDivs = document.querySelectorAll('#game-container>div');
  for (var i = 0; i < childDivs.length; i++) {
    childDivs[i].className = 'green-color';
  }
  document.querySelector('[data-use="turnCounter"]').innerHTML = 0;
  turnCounter = 0;
  localStorage.setItem('turnCounter', turnCounter);
  localStorage.setItem('gameContainerStatus', "");

}
function incrementTurnCounter(selector) {
  turnCounter ++;
  selector.innerHTML = turnCounter;
}
function invertColor(div) {
  let green = "green-color";
  let red = "red-color";
  if(div.classList.contains(green)) {
    div.classList.remove(green);
    div.classList.add(red);
  } else {
    div.classList.remove(red);
    div.classList.add(green);
  };
};
function checkVictory(divs) {
  let victoryState = true;
  for(let i = 0; i < divs.length; i++) {
    if(divs[i].classList.contains('green-color')) {
      victoryState = false;
      break;
    }
  }
  if(victoryState == true) {
    setTimeout(function(){
      alert('Vous avez gagné');
      reinit();
    }, 500);
  }
  // Si toute les div sont rouge, on a gagné
  // Si aucune div n'est verte, on a gagné
};
init();
