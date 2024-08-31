# Cyber Defense: Protect the Aircraft

## Overview

"Cyber Defense: Protect the Aircraft" is an interactive web-based quiz game created for use at the Bournemouth Air-festival, where players must answer cybersecurity-related questions to protect an aircraft from a cyberattack. The game challenges the player to correctly answer 10 questions to secure the aircraft while avoiding 5 incorrect answers, which would lead to the plane becoming vulnerable... and exploding.

The game features a leaderboard that records the fastest players, encouraging speed and accuracy.

## Features

- **Interactive Quiz**: Players answer multiple-choice questions to secure the aircraft.
- **Dynamic Progress Bar**: The progress bar and accompanying image dynamically update based on the player's performance.
- **Leaderboard**: Records and displays the top players based on the time taken to complete the quiz.
- **Player Statistics**: Tracks the number of quizzes started, completed, the completion rate, and the average time on the leaderboard.
- **Data Export**: Allows players to export their stats as CSV or JSON files.

## Setup Instructions

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, etc.).
- A local or remote server environment to host the game (e.g., Flask, Node.js, etc.).

### Running the Game

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/JKTMN/Airshow-quiz-game.git
    ```
    
2. **Navigate to the Project Directory**:
    ```bash
    cd Airshow-quiz-game
    ```

3. **Start the Server**:
   If using a Python Flask server:
   ```bash
   flask run

## Access the Game

Open your browser and go to `http://127.0.0.1:5000` (or your server's address).

## Gameplay Instructions

1. **Starting the Game**:
   * Enter your name in the input field on the main page.
   * Click "Begin" to start the quiz.

2. **Answering Questions**:
   * Read the question displayed on the screen.
   * Choose the correct answer by clicking on either "A" or "B".
   * If correct, you'll receive positive feedback, and the progress bar will advance.
   * If incorrect, you'll receive feedback, and the plane's security will decrease.

3. **Winning and Losing**:
   * Answer 10 questions correctly to secure the aircraft and win the game.
   * If you answer 5 questions incorrectly, the game ends, and the aircraft is compromised.

4. **Leaderboard**:
   * After completing the quiz, your time is recorded and added to the leaderboard if it qualifies.
   * The leaderboard displays the top players and their times.

5. **Exporting Statistics**:
   * On the statistics page, you can export your game data as a CSV or JSON file.

## Leaderboard and Statistics

* The leaderboard tracks the top players based on the time taken to complete the quiz.
* The statistics page displays:
  * **Total Quizzes Started**: The number of times players have started the quiz.
  * **Total Quizzes Completed**: The number of quizzes successfully completed.
  * **Completion Rate**: The percentage of started quizzes that were completed.
  * **Average Leaderboard Time**: The average time of all leaderboard entries.

## Code Structure

* **HTML Files**:
  * `home.html`: Landing page containing the leaderboard.
  * `game.html`: Main game page.
  * `stats.html`: Game statistics page.

* **CSS Files**:
  * `styles.css`: Styles for the landing page.
  * `gamestyles.css`: Styles for the main game page.
  * `statsStyles.css`: Styles for the statistics page.

* **JavaScript Files**:
  * `gamescript.js`: Handles game logic, question loading, and leaderboard updates.
  * `statsScript.js`: Handles the statistics calculations and data export.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
