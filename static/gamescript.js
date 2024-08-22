const querystring = window.location.search;
const urlparams = new URLSearchParams(querystring);
const name = urlparams.get('nameInput');

let time = 0;
let intervalId = null;

function startStopWatch() {
    intervalId = setInterval(() => {
        time++;
        document.getElementById("stopwatch").textContent = time;
        checkIfQuizComplete();
    }, 1000);
}

function stopStopWatch() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

async function getLeaderboard() {
    try {
        const response = await fetch('/leaderboard');
        if (!response.ok) {
            throw new Error('Failed to retrieve leaderboard');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }
}

async function saveLeaderboard(leaderboard) {
    try {
        const response = await fetch('/leaderboard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(leaderboard)
        });
        if (!response.ok) {
            throw new Error('Failed to save leaderboard');
        }
        console.log('Leaderboard updated successfully');
    } catch (error) {
        console.error('Error saving leaderboard:', error);
    }
}

async function updateLeaderboard(name, time) {
    const newEntry = { "position": 0, "name": name, "time": `${time} seconds` };

    await fetch('/leaderboard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEntry)
    });

    updateLeaderboardDisplay();
}


function updateLeaderboardDisplay() {
    getLeaderboard().then(leaderboard => {
        const leaderboardList = document.getElementById('leaderboard-list');
        leaderboardList.innerHTML = '';

        leaderboard.forEach(entry => {
            const listItem = document.createElement('li');
            listItem.textContent = `${entry.position}. ${entry.name}: ${entry.time}`;
            leaderboardList.appendChild(listItem);
        });
    }).catch(error => {
        console.error('Failed to update leaderboard display:', error);
    });
}

function checkIfQuizComplete() {
    if (correctAnswers >= 10) {
        stopStopWatch();
        updateLeaderboard(name, time);
        alert(`Quiz complete! It took you ${time} seconds.`);
        window.location.href = "/";
    }
}

let questions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let totalQuestions = 0;
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
    totalQuestions++;
    const currentQuestion = questions[currentQuestionIndex];
    if (answer === currentQuestion.correct) {
        feedbackElement.textContent = "Correct! " + currentQuestion.feedback;
        correctAnswers++;
    } else {
        feedbackElement.textContent = "Incorrect: " + currentQuestion.feedback;
        if (correctAnswers > 0) {
            correctAnswers--;
        }
    }

    updateStatusMessage();
    updateProgressBar();
    setTimeout(() => {
        nextQuestion();
    }, 3000);
}

function updateProgressBar() {
    const progressPercentage = (correctAnswers / totalQuestionsToWin) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

function nextQuestion() {
    currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    loadQuestion();
}

fetch('/static/questions.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Questions loaded:', data);
        questions = data;
        loadQuestion();
    })
    .catch(error => console.error('Error loading the questions:', error));

function updateStatusMessage() {
    const statusMessageElement = document.getElementById("statusMessage");

    if (correctAnswers >= 0 && correctAnswers <= 2) {
        statusMessageElement.textContent = "Unsecured";
        statusMessageElement.style.color = "red";
        progressBar.style.backgroundColor = "red";
    } else if (correctAnswers >= 3 && correctAnswers <= 5) {
        statusMessageElement.textContent = "Securing";
        statusMessageElement.style.color = "orange";
        progressBar.style.backgroundColor = "orange";
    } else if (correctAnswers >= 6 && correctAnswers <= 8) {
        statusMessageElement.textContent = "Securing";
        statusMessageElement.style.color = "mustard";
        progressBar.style.backgroundColor = "mustard";
    } else if (correctAnswers <= 9) {
        statusMessageElement.textContent = "Secured";
        statusMessageElement.style.color = "green";
        progressBar.style.backgroundColor = "green";
    }
}

answerABtn.addEventListener('click', () => checkAnswer('A'));
answerBBtn.addEventListener('click', () => checkAnswer('B'));

setTimeout(() => {
    startStopWatch();
}, 1000);

updateLeaderboardDisplay();
updateStatusMessage();
