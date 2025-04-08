from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # enable CORS

# store latest
latest_data = {
    'w': 1, 'x': 0, 'y': 0, 'z': 0,
    'sys_cal': 0, 'gyro_cal': 0, 'accel_cal': 0, 'mag_cal': 0
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/update_data', methods=['POST'])
def update_data():
    global latest_data
    data = request.json
    latest_data = data
    return jsonify({"status": "success"})

@app.route('/get_data', methods=['GET'])
def get_data():
    return jsonify(latest_data)

if __name__ == "__main__":
    app.run(host="::", debug=True, port=80)