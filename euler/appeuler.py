from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Store the latest Euler angles
latest_euler = {'heading': 0, 'roll': 0, 'pitch': 0}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/update_euler', methods=['POST'])
def update_euler():
    global latest_euler
    data = request.json
    latest_euler = data
    return jsonify({"status": "success"})

@app.route('/get_euler', methods=['GET'])
def get_euler():
    return jsonify(latest_euler)

if __name__ == "__main__":
    app.run(debug=True)