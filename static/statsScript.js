const startedCount = parseInt(localStorage.getItem('playerCounter')) || 0;
const completedCount = parseInt(localStorage.getItem('quizCompleteCounter')) || 0;
let averageTime = '0:00';

let completionRate = 0;
if (startedCount > 0) {
    completionRate = ((completedCount / startedCount) * 100).toFixed(2);
}

document.getElementById('started').textContent = startedCount;
document.getElementById('completed').textContent = completedCount;
document.getElementById('completionRate').textContent = `${completionRate}%`;

function exportCSV() {
    const csvData = `Started,Completed,Completion Rate,Average Leaderboard Time\n${startedCount},${completedCount},${completionRate}%,${averageTime}`;
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'game_stats.csv');
    a.click();
}

function exportJSON() {
    const jsonData = {
        started: startedCount,
        completed: completedCount,
        completionRate: `${completionRate}%`,
        averageLeaderboardTime: averageTime
    };
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'game_stats.json');
    a.click();
}

function loadLeaderboard() {
    fetch('/leaderboard')
        .then(response => response.json())
        .then(data => {
            const times = data.map(entry => {
                const timeString = entry.time;
                const seconds = parseInt(timeString.split(' ')[0], 10);
                return seconds;
            });

            if (times.length > 0) {
                const totalSeconds = times.reduce((total, time) => total + time, 0);
                const avgSeconds = totalSeconds / times.length;

                const minutes = Math.floor(avgSeconds / 60);
                const seconds = Math.floor(avgSeconds % 60);
                averageTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                document.getElementById('averageTime').textContent = averageTime;
            }
        })
        .catch(error => {
            console.error('Error loading leaderboard data:', error);
        });
}

window.onload = loadLeaderboard;