// returns same str argument with first char in string capitalized (uppercase)
function capitalize(str) {
  return str.slice(0, 1).toUpperCase().concat(str.slice(1));
}

// Player choice first, computer choice second
// Example to get outcome: rpsOutcomes[playerChoice][compChoice]
const rpsOutcomes = {
  rock: {
    rock: "tie",
    paper: "lose",
    scissors: "win",
  },
  paper: {
    rock: "win",
    paper: "tie",
    scissors: "lose",
  },
  scissors: {
    rock: "lose",
    paper: "win",
    scissors: "tie",
  },
};

// Where score is kept for current game of rock paper scissors until reset
// TODO: Game can easily be hacked in console to add wins/losses/ties, hide it from global object in closure if security is wanted
const scoreTracker = {
  wins: 0,
  losses: 0,
  ties: 0,
  win: function () {
    this.wins++;
  },
  lose: function () {
    this.losses++;
  },
  tie: function () {
    this.ties++;
  },
  reset: function () {
    this.wins = 0;
    this.losses = 0;
    this.ties = 0;
  },
};

// Use map to find emojiChoice array index for given choice
const emojiChoiceMap = {
  rock: 0,
  paper: 1,
  scissors: 2,
};

// map of body background colors to use depending on state
// lose is light red, win is light green, default is light blue/purple
const backgroundStateColor = {
  lose: "#ffcccc",
  win: "#ccffcc",
  default: "#ddddff",
};

// Use game state (win, lose or default) to set background color on body
function setBodyBackground(state) {
  document.body.style.backgroundColor = backgroundStateColor[state];
}

// Returns the stylesheet that contains styles.css in the name
function getOwnStylesheet() {
  const stylesheets = document.styleSheets;
  let ownStylesheet;
  for (let i = 0; i < stylesheets.length; i++) {
    if (stylesheets[i].href.indexOf("styles.css") >= 0) {
      ownStylesheet = stylesheets[i];
    }
  }
  return ownStylesheet;
}

// Uses provided stylesheet (should only be used with own stylesheet)
// Finds cssRule for .rps class, uses animationDuration and animationIterationCount applied styles to determine total animation time
// Returns total time in ms to be used in rockPaperScissors function setTimeout duration length
// If animationDuration or animationIterationCount change in css stylesheet, this will automatically update necessary timeout length
function getRpsAnimationLength(stylesheet) {
  if (!stylesheet) {
    return 2100; //If stylesheet undefined, return default
  }
  let animationDuration;
  let animationIterationCount;
  const cssRulesOrRules = stylesheet.cssRules
    ? stylesheet.cssRules
    : stylesheet.rules
    ? stylesheet.rules
    : null;
  if (!cssRulesOrRules) {
    return 2100; // If stylesheet doesn't contain cssRules or rules property, return default value of 2100
  }
  for (let i = 0; i < cssRulesOrRules.length; i++) {
    if (stylesheet.cssRules[i].selectorText === ".rps") {
      animationDuration = stylesheet.cssRules[i].style.animationDuration;
      animationIterationCount =
        stylesheet.cssRules[i].style.animationIterationCount;
    }
  }
  let animationDurationMS = Number(animationDuration.slice(0, -1)) * 1000; //convert to ms from seconds
  animationIterationCount = Number(animationIterationCount);
  const totalAnimationTime = animationDurationMS * animationIterationCount;
  return isNaN(totalAnimationTime) ? 2100 : totalAnimationTime; // If calculation ended as NaN, return default value of 2100, else return calculated value
}

const ownStylesheet = getOwnStylesheet();
const totalAnimationTime = getRpsAnimationLength(ownStylesheet);

// Element that shows animation and players current/last move
const player = document.querySelector(".player");
// Element that shows animation and computers current/last move
const computer = document.querySelector(".computer");
// Element that shows win, loss, tie message to player
const messageEl = document.querySelector(".message");
// Element that shows current totals for wins, losses and ties
const scoreEl = document.querySelector(".score");
// Nodelist of buttons player clicks to make a move
const playerChoiceBtns = document.querySelectorAll(".player-choice");

// Challenge button to restart game after player or computer reaches 5 wins
const challengeBtn = document.createElement("button");
challengeBtn.classList.add("reset");
challengeBtn.addEventListener("click", () => {
  scoreTracker.reset();
  updateScore();
  enablePlayerChoiceBtns();
  setBodyBackground("default");
  messageContainer.removeChild(challengeBtn);
});
challengeBtn.textContent = "Challenge Accepted";

// Container where messages and challengeBtn go
const messageContainer = document.querySelector(".message-container");

// Use to disable ability to play moves, i.e. until current move animation is complete, until reset after player or computer wins 5 games
function disablePlayerChoiceBtns() {
  playerChoiceBtns.forEach((choiceBtn) => {
    choiceBtn.disabled = true;
  });
}
// Use to re-enable ability to play moves
function enablePlayerChoiceBtns() {
  playerChoiceBtns.forEach((choiceBtn) => {
    choiceBtn.disabled = false;
  });
}

// Format message to tell player if they won, lost or tied the current round
function getGameMessage(playerChoice, compChoice, outcome) {
  playerChoice = capitalize(playerChoice);
  compChoice = capitalize(compChoice);
  const message =
    outcome === "win"
      ? `You Win! ${playerChoice} beats ${compChoice}`
      : outcome === "lose"
      ? `You Lose! ${compChoice} beats ${playerChoice}`
      : `You Tied! ${playerChoice} ties ${playerChoice}`;
  return message;
}

// check if there is a winner, set body background to appropriate state and return state message
function checkWinner() {
  if (scoreTracker.wins >= 5) {
    setBodyBackground("win");
    return "Impossible! You reached 5 wins first and won. This is unacceptable, challenge me again!";
  } else if (scoreTracker.losses >= 5) {
    setBodyBackground("lose");
    return " You lose, as expected, I reached 5 wins first. Dare to challenge me again?";
  } else {
    return "";
  }
}

// Use to update current score on page and show game messages
function updateScore(message) {
  messageEl.textContent = message ? message : "Ready to be defeated?";

  scoreEl.innerHTML = `<div><p>Wins</p><p>${scoreTracker.wins}</p></div><div><p>Losses</p><p>${scoreTracker.losses}</p></div><div><p>Ties</p><p>${scoreTracker.ties}</p></div>`;
}
// Set initial state
updateScore();

// Randomly select computers choice of "rock", "paper", or "scissors"
function getCompChoice() {
  return ["rock", "paper", "scissors"][Math.floor(Math.random() * 3)]; // choose random item from array, 3 is used because the array length is 3
}

// Take playerChoice and determine winner and state
function rockPaperScissors(playerChoice) {
  // Once someone wins (5 wins or losses), prevent playing until game is reset with challengeBtn
  if (scoreTracker.wins >= 5 || scoreTracker.losses >= 5) {
    return;
  }
  // Don't allow player to play again while current round is being played
  disablePlayerChoiceBtns();
  const choiceEmoji = ["✊", "✋", "✌️"];
  const compChoice = getCompChoice();
  const outcome = rpsOutcomes[playerChoice][compChoice]; //determine win, loss or tie
  // determine final emoji to display based on player and computer choice
  const compEmoji = choiceEmoji[emojiChoiceMap[compChoice]];
  const playerEmoji = choiceEmoji[emojiChoiceMap[playerChoice]];
  let message = getGameMessage(playerChoice, compChoice, outcome);
  // set initial emoji (players show rock for 3 fist shakes before showing actual choice)
  player.textContent = "✊";
  computer.textContent = "✊";
  // add .rps class to begin fist shake animations
  player.classList.add("rps");
  computer.classList.add("rps");
  // If error caused animation time set to default, try to update animation time
  if (totalAnimationTime === 2100) {
    totalAnimationTime = getRpsAnimationLength(getOwnStylesheet());
  }
  // use setTimeout to delay showing results until animation is complete
  setTimeout(() => {
    // After animation is complete
    // show player and computers actual choice emoji
    computer.textContent = compEmoji;
    player.textContent = playerEmoji;
    // remove animation class now that it is complete
    computer.classList.remove("rps");
    player.classList.remove("rps");
    // update score tracker to new score
    scoreTracker[outcome]();
    const winnerMessage = checkWinner();
    // If there is a winner (5 wins or losses), show winnerMessage and leave playerChoiceBtns disabled until game reset
    if (winnerMessage) {
      message = winnerMessage;
      messageContainer.appendChild(challengeBtn);
    }
    // No winner yet
    else {
      // Wait an extra .3s before enabling playerChoiceBtns so user sees final state of this round before playing again
      setTimeout(() => {
        enablePlayerChoiceBtns();
      }, 300);
    }
    //show game state message and new current scores
    updateScore(message);
  }, totalAnimationTime); // timeout should last as long as totalAnimationTime
}

// Add event listener to each player choice button emoji to play game with playerChoice set to their button selection ("rock", "paper", or "scissors")
["rock", "paper", "scissors"].forEach((choice) => {
  document.querySelector(`.${choice}`).addEventListener("click", () => {
    rockPaperScissors(choice);
  });
});
