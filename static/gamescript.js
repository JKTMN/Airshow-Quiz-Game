const querystring = window.location.search;
const urlparams = new URLSearchParams(querystring);
const name = urlparams.get('nameInput');

let time = 0;
let intervalId = null;
let isProcessingAnswer = false;

let questions = [];
let currentQuestion = null;
let availableQuestions = [];
let correctAnswers = 0;
let totalQuestions = 0;
const totalQuestionsToWin = 5;
let incorrectAnswers = 0;
const originalImageSrc = '../static/images/barplane.png';
const incorrectImageSrc = '../static/images/explosion.gif';

const questionElement = document.getElementById('question');
const answerAElement = document.getElementById('answerA');
const answerBElement = document.getElementById('answerB');
const answerABtn = document.getElementById('answerABtn');
const answerBBtn = document.getElementById('answerBBtn');
const feedbackElement = document.getElementById('feedback');
const progressBar = document.querySelector('.progress');
const progressImage = document.getElementById('progress-image');


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


function showEndMessage(message) {
    const overlayElement = document.getElementById('overlay');
    const endMessageElement = document.getElementById('endMessage');

    endMessageElement.textContent = message;
    overlayElement.style.display = 'block';
    endMessageElement.style.display = 'block';

    setTimeout(() => {
        endMessageElement.style.display = 'none';
        overlayElement.style.display = 'none';
    }, 5000);
}


function checkIfQuizComplete() {
    if (correctAnswers >= 10) {
        stopStopWatch();
        updateLeaderboard(name, time);
        showEndMessage(`Quiz complete! It took you ${time} seconds.`);
        setTimeout(() => {
            window.location.href = "/";
        }, 5000);
    }
}


function loadQuestion() {
    if (availableQuestions.length === 0) {
        availableQuestions = [...questions];
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    
    currentQuestion = availableQuestions[randomIndex];
    
    availableQuestions.splice(randomIndex, 1);

    questionElement.textContent = currentQuestion.question;
    answerAElement.textContent = currentQuestion.answerA;
    answerBElement.textContent = currentQuestion.answerB;
    feedbackElement.textContent = '';
    
    enableAnswerButtons();
}


function checkAnswer(answer) {
    if (isProcessingAnswer) return;

    isProcessingAnswer = true;
    disableAnswerButtons();

    totalQuestions++;
    if (answer === currentQuestion.correct) {
        feedbackElement.textContent = "Correct! " + currentQuestion.feedback;
        correctAnswers++;
    } else {
        feedbackElement.textContent = "Incorrect: " + currentQuestion.feedback;
        incorrectAnswers++;
        if (correctAnswers > 0) {
            correctAnswers--;
        }

        if (incorrectAnswers >= 1) {
            progressImage.src = incorrectImageSrc;
            progressImage.style.height = "1500px";
            stopStopWatch();
            showEndMessage(`Quiz Failed! You answered 5 questions incorrectly`);
            setTimeout(() => {
                window.location.href = "/";
            }, 5000);
        }
    }

    updateStatusMessage();
    updateProgressBar(correctAnswers, totalQuestionsToWin);

    setTimeout(() => {
        isProcessingAnswer = false;
        loadQuestion();
    }, 3000);
}


function updateProgressBar(correctAnswers, totalQuestionsToWin) {
    const progressPercentage = (correctAnswers / totalQuestionsToWin) * 100;
    progressBar.style.width = `${progressPercentage}%`;

    const progressBarWidth = document.querySelector('.progress-bar').offsetWidth;
    const newImagePosition = (progressPercentage / 100) * progressBarWidth;

    progressImage.style.left = `${newImagePosition}px`;
}


function resetProgressImage() {
    progressImage.src = originalImageSrc;
    progressImage.style.height = "140px";
}


function nextQuestion() {
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
        availableQuestions = [...questions];
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
            statusMessageElement.style.color = "gold";
            progressBar.style.backgroundColor = "gold";
        } else if (correctAnswers >= 9) {
            statusMessageElement.textContent = "Secured";
            statusMessageElement.style.color = "green";
            progressBar.style.backgroundColor = "green";
        }
    }


function disableAnswerButtons() {
    answerABtn.disabled = true;
    answerBBtn.disabled = true;
}


function enableAnswerButtons() {
    answerABtn.disabled = false;
    answerBBtn.disabled = false;
}

answerABtn.addEventListener('click', () => checkAnswer('A'));
answerBBtn.addEventListener('click', () => checkAnswer('B'));

setTimeout(() => {
    startStopWatch();
}, 1000);

updateLeaderboardDisplay();
updateStatusMessage();
