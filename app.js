// User choice first, computer choice second
// Example to get outcome: rpsOutcomes[userChoice][compChoice]
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

// Randomly select computers choice from array of choices
function getCompChoice() {
  const choiceArr = ["rock", "paper", "scissors"];
  return choiceArr[Math.floor(Math.random() * choiceArr.length)];
}

function getUserChoice() {
  const userChoice = prompt(
    "Rock, paper, scissors! Which is your option? (type rock, paper, or scissors)"
  ).toLowerCase();
  return rpsOutcomes[userChoice] ? userChoice : getUserChoice();
}

function capitalize(str) {
  return str.slice(0, 1).toUpperCase().concat(str.slice(1));
}

function rockPaperScissors(userChoice, compChoice) {
  const outcome = rpsOutcomes[userChoice][compChoice];
  userChoice = capitalize(userChoice);
  compChoice = capitalize(compChoice);
  console.log(
    outcome === "win"
      ? `You Win! ${userChoice} beats ${compChoice}`
      : outcome === "lose"
      ? `You Lose! ${compChoice} beats ${userChoice}`
      : `You Tied! ${userChoice} ties ${userChoice}`
  );
  return outcome;
}

function game(numOfGames) {
  let wins = 0;
  let losses = 0;
  let ties = 0;
  for (let i = 0; i < numOfGames; i++) {
    const outcome = rockPaperScissors(getUserChoice(), getCompChoice());
    if (outcome === "win") {
      wins++;
    } else if (outcome === "lose") {
      losses++;
    } else {
      ties++;
    }
  }
  const finalScore = `Final score
  wins: ${wins}
  losses: ${losses}
  ties: ${ties}`;
  const message =
    wins > losses
      ? `You beat the computer!`
      : losses > wins
      ? `You lost to the computer!`
      : `You tied the computer!`;
  alert(`${message}
  ${finalScore}`);
}

function getNumOfGames() {
  const num = parseInt(
    prompt("How many games of rock, paper, scissors would you like to play?")
  );
  return isNaN(num) || num <= 0 ? getNumOfGames() : num;
}

game(getNumOfGames());
