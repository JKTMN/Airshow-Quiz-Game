from flask import Flask, jsonify, request, render_template
import json
import os

app = Flask(__name__)

LEADERBOARD_FILE = 'leaderboard.json'

def read_leaderboard():
    if not os.path.exists(LEADERBOARD_FILE):
        with open(LEADERBOARD_FILE, 'w') as f:
            json.dump([], f, indent=4)

    with open(LEADERBOARD_FILE, 'r') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []


def write_leaderboard(leaderboard):
    with open(LEADERBOARD_FILE, 'w') as f:
        json.dump(leaderboard, f, indent=4)


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/game')
def game():
    return render_template('game.html')


@app.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    leaderboard = read_leaderboard()
    return jsonify(leaderboard)


@app.route('/leaderboard', methods=['POST'])
def update_leaderboard():
    new_entry = request.json

    if not new_entry or 'name' not in new_entry or 'time' not in new_entry:
        return jsonify({'error': 'Invalid data: Missing "name" or "time"'}), 400

    leaderboard = read_leaderboard()

    leaderboard.append(new_entry)

    try:
        leaderboard.sort(key=lambda x: int(x['time'].split()[0]))
    except ValueError:
        return jsonify({'error': 'Invalid time format in leaderboard data'}), 400

    leaderboard = leaderboard[:10]

    for i, entry in enumerate(leaderboard):
        entry['position'] = i + 1

    write_leaderboard(leaderboard)
    return jsonify({'status': 'success'})


if __name__ == '__main__':
    app.run(debug=True)