const quizData = [
  { question: "What does 'let' declare in JavaScript?", options: ["A constant", "A changeable variable", "A function", "An array"], correct: 1 },
  { question: "Which is the strict equality operator?", options: ["==", "=", "===", "!="], correct: 2 },
  { question: "What keyword is used to define a constant?", options: ["var", "constant", "let", "const"], correct: 3 },
  { question: "How do you select an element by ID?", options: ["getElementById()", "querySelector()", "getById()", "select()"], correct: 0 },
  { question: "Which method is used to write text to the console?", options: ["console.print()", "console.log()", "log.print()", "document.write()"], correct: 1 },
  { question: "What symbol begins a comment in JS?", options: ["//", "#", "<!--", "**"], correct: 0 },
  { question: "Which data type is NOT primitive?", options: ["number", "boolean", "object", "string"], correct: 2 },
  { question: "How can you convert a string to an integer?", options: ["parseInt()", "stringToInt()", "Number.parse()", "convertInt()"], correct: 0 },
  { question: "What event fires when a button is clicked?", options: ["onhover", "onload", "onclick", "onpress"], correct: 2 },
  { question: "Which statement stops a loop?", options: ["exit", "stop", "break", "return"], correct: 2 }
];

let currentQuestion = 0, score = 0, selectedAnswer = -1, timerInterval, timeLeft = 30;
const totalQuestions = quizData.length;
let highScore = localStorage.getItem("jsQuizHighScore") || 0;

const correctSound = new Audio("music/correct.mp3");
const wrongSound = new Audio("music/wrong.mp3");

function updateProgress() {
  document.getElementById("progress-fill").style.width = ((currentQuestion + 1) / totalQuestions) * 100 + "%";
  document.getElementById("current-q").textContent = currentQuestion + 1;
  document.getElementById("total-q").textContent = totalQuestions;
}

function startTimer() {
  timeLeft = 30;
  document.getElementById("timer-text").textContent = timeLeft;
  document.getElementById("timer-fill").style.width = "100%";
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer-text").textContent = timeLeft;
    document.getElementById("timer-fill").style.width = (timeLeft / 30 * 100) + "%";
    if (timeLeft <= 0) { clearInterval(timerInterval); nextQuestion(); }
  }, 1000);
}

function loadQuestion() {
  clearInterval(timerInterval);
  selectedAnswer = -1;
  const q = quizData[currentQuestion];
  document.getElementById("question").textContent = q.question;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  q.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.classList.add("option");
    btn.addEventListener("click", () => selectOption(index));
    optionsDiv.appendChild(btn);
  });

  document.getElementById("next-btn").style.display = "none";
  updateProgress();
  startTimer();
}

function selectOption(index) {
  if (selectedAnswer !== -1) return;
  selectedAnswer = index;
  clearInterval(timerInterval);

  const options = document.querySelectorAll(".option");
  options.forEach((opt, i) => {
    opt.disabled = true;
    if (i === quizData[currentQuestion].correct) opt.classList.add("correct");
    else if (i === index) opt.classList.add("incorrect");
  });

  if (index === quizData[currentQuestion].correct) {
    correctSound.play();
    score++;
  } else {
    wrongSound.play();
  }

  document.getElementById("next-btn").style.display = "block";
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < totalQuestions) loadQuestion();
  else showScore();
}

function showScore() {
  document.getElementById("question-container").style.display = "none";
  document.getElementById("score-container").style.display = "block";
  document.getElementById("score").textContent = score;
  document.getElementById("total").textContent = totalQuestions;

  const percentage = (score / totalQuestions) * 100;
  let feedback = "";
  if (percentage >= 80) feedback = "Outstanding! You're a JS pro!";
  else if (percentage >= 50) feedback = "Not bad! Keep practicing.";
  else feedback = "Keep learning — you’ll get it!";

  document.getElementById("feedback").textContent = feedback;

  // Confetti for high score or perfect score
  if (score >= highScore || percentage === 100) {
    highScore = score;
    localStorage.setItem("jsQuizHighScore", highScore);
    document.getElementById("high-score").style.display = "block";
    document.getElementById("high-score-val").textContent = highScore;

    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
  }
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  document.getElementById("score-container").style.display = "none";
  document.getElementById("question-container").style.display = "block";
  loadQuestion();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("next-btn").addEventListener("click", nextQuestion);
  document.getElementById("restart-btn").addEventListener("click", restartQuiz);
  loadQuestion();
});
