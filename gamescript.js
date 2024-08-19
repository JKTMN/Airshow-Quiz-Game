function startCountdown(seconds) {
    var countdownElement = document.getElementById("countdown");
    var remainingTime = seconds;

    var countdownInterval = setInterval(function() {
        countdownElement.textContent = remainingTime;

        if (remainingTime <= 0) {
            clearInterval(countdownInterval);
            countdownElement.textContent = "Time's up!";
        } else {
            remainingTime--;
        }
    }, 1000);
}

startCountdown(60);


let questions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
const totalQuestionsToWin = 10;

const questionElement = document.getElementById('question');
const answerAElement = document.getElementById('answerA');
const answerBElement = document.getElementById('answerB');
const answerABtn = document.getElementById('answerABtn');
const answerBBtn = document.getElementById('answerBBtn');
const feedbackElement = document.getElementById('feedback');
const progressBar = document.querySelector('.progress');

function loadQuestion() {
    if (questions.length === 0) {
        console.error('No questions loaded.');
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    answerAElement.textContent = currentQuestion.answerA;
    answerBElement.textContent = currentQuestion.answerB;
    feedbackElement.textContent = '';
}

function checkAnswer(answer) {
    const currentQuestion = questions[currentQuestionIndex];
    if (answer === currentQuestion.correct) {
        feedbackElement.textContent = currentQuestion.feedback;
        correctAnswers++;
    } else {
        feedbackElement.textContent = "Incorrect. Try again!";
        if (correctAnswers > 0) {
            correctAnswers--;
        }
    }

    updateProgressBar();
    nextQuestion();
}

function updateProgressBar() {
    const progressPercentage = (correctAnswers / totalQuestionsToWin) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

function nextQuestion() {
    currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    loadQuestion();
}

fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        loadQuestion();
    })
    .catch(error => console.error('Error loading the questions:', error));

answerABtn.addEventListener('click', () => checkAnswer('A'));
answerBBtn.addEventListener('click', () => checkAnswer('B'));
