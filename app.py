import os

from flask_socketio import SocketIO, emit, send
from flask import Flask
from serial import Serial
from threading import Lock
from logger import Logger

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins=['http://localhost:3000'])

worker_thread = None
thread_lock = Lock()
logger = Logger()


def read_from_serial():
    with Serial(port='/dev/tty.usbmodem101', baudrate=9600, timeout=5) as ser:
        while True:
            raw_data = ser.readline().decode()
            data = raw_data.strip().split(',')
            if data:
                print(data)
                logger.log(raw_data)
                socketio.emit('telemetry_push', data)


@socketio.on('connect')
def accept_connection(auth):
    global worker_thread
    with thread_lock:
        if worker_thread is None:
            worker_thread = socketio.start_background_task(read_from_serial)
    send('Connected')


@socketio.on('message')
def handle_message(data):
    emit('telemetry_push', "yo")


if __name__ == '__main__':
    try:
        socketio.run(app, host="::", port=80, allow_unsafe_werkzeug=True)
    except KeyboardInterrupt:
        print("Exiting...")
        logger.close()
