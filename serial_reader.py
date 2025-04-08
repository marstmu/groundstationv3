import serial
import requests
import time

# serial port
SERIAL_PORT = '/dev/tty.usbmodem1101'
BAUD_RATE = 9600

# url
FLASK_SERVER_URL = 'http://127.0.0.1/update_data'  # Updated endpoint


def read_serial_data():
    try:
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
        print(f"Connected to {SERIAL_PORT} at {BAUD_RATE} baud.")

        while True:
            if ser.in_waiting > 0:
                line = ser.readline().decode('utf-8').strip()
                if line:
                    # format: w,x,y,z,sys_cal,gyro_cal,accel_cal,mag_cal
                    try:
                        parts = line.split(',')
                        if len(parts) == 15:
                            w, x, y, z, long, lat, alt, pressure, ax, ay, az, gx, gy, gz, rssi = map(float, parts)
                            print(f"Quaternion: w={w}, x={x}, y={y}, z={z}")
                            print(f"Calibration: sys={0}, gyro={0}, accel={0}, mag={0}")

                            # send to flask
                            data = {
                                'w': w, 'x': x, 'y': y, 'z': z,
                                'sys_cal': 3, 'gyro_cal': 3,
                                'accel_cal': 3, 'mag_cal': 3
                            }
                            response = requests.post(FLASK_SERVER_URL, json=data)
                            if response.status_code != 200:
                                print("Failed to send data to server.")
                        else:
                            print("Invalid data format: expected 8 values.")
                    except ValueError:
                        print("Invalid data format: could not convert to float.")
            time.sleep(0.01)  # delay

    except serial.SerialException as e:
        print(f"Error opening serial port: {e}")


if __name__ == "__main__":
    read_serial_data()