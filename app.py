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
srl: Serial


def read_from_serial():
    with Serial(port='COM3', baudrate=9600, timeout=5) as ser:
        global srl
        srl = ser
        while True:
            raw_data = ser.readline().decode("utf-8")
            logger.log(raw_data)

            data = raw_data.strip().split(',')
            if data:
                print(data)
                match data[0]:
                    case "tel":
                        data = data[1:]
                        socketio.emit('telemetry_push', data)
                    case "gs":
                        data = data[1:]
                        socketio.emit('ground_station_msg', data)
                    case _:
                        pass


@socketio.on('connect')
def accept_connection(auth):
    global worker_thread
    with thread_lock:
        if worker_thread is None:
            worker_thread = socketio.start_background_task(read_from_serial)
    send('Connected')


@socketio.on('gs_command')
def handle_command(data):
    if srl:
        srl.write(f"{data}\n".encode())


if __name__ == '__main__':
    try:
        socketio.run(app, host="::", port=80, allow_unsafe_werkzeug=True)
    except KeyboardInterrupt:
        print("Exiting...")
        logger.close()
