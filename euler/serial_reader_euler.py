import serial
import requests
import time

# Serial port configuration
SERIAL_PORT = '/dev/tty.usbmodem101'
BAUD_RATE = 9600

# Flask server URL
FLASK_SERVER_URL = 'http://127.0.0.1:5000/update_euler'

def read_serial_data():
    try:
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
        print(f"Connected to {SERIAL_PORT} at {BAUD_RATE} baud.")

        while True:
            if ser.in_waiting > 0:
                line = ser.readline().decode('utf-8').strip()
                if line:
                    # Assuming the data is in the format: heading,roll,pitch
                    try:
                        heading, roll, pitch = map(float, line.split(','))
                        print(f"Euler Angles: heading={heading}, roll={roll}, pitch={pitch}")

                        # Send data to Flask server
                        data = {'heading': heading, 'roll': roll, 'pitch': pitch}
                        response = requests.post(FLASK_SERVER_URL, json=data)
                        if response.status_code != 200:
                            print("Failed to send data to server.")
                    except ValueError:
                        print("Invalid data format.")
            time.sleep(0.01)  # Small delay to avoid overloading the CPU

    except serial.SerialException as e:
        print(f"Error opening serial port: {e}")

if __name__ == "__main__":
    read_serial_data()