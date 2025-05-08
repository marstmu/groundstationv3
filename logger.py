import os
import time


class Logger:
    def __init__(self, filename="flight_log.csv"):
        self.filename = filename

        if os.path.exists(filename):
            # Open in append mode
            self.file = open(filename, "a")
        else:
            self.file = open(filename, "w")
            self.write_header()

    def write_header(self):
        """Create a header for the CSV file"""
        header = "msg_type,timestamp,quat_w,quat_x,quat_y,quat_z,lat,long,alt,pressure,accel_x,accel_y,accel_z"
        self.file.write(header + "\n")

    def log(self, data=None):
        """Log flight data to CSV"""
        if data:
            self.file.write(data)
        else:
            empty_row = ",".join(["0"] * 15)  # Fill with zeros
            self.file.write(empty_row + "\n")

        self.file.close()
        self.file = open(self.filename, "a")
