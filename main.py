import machine
import sys
import asyncio
import struct
from lib import rfm9x


def decode_data(data):
    try:
        format_string = '<14f'  # 4 quaternions, lat, lon, alt, satellites (int), pressure
        values = struct.unpack(format_string, data)
        return {
            'quaternions': values[0:4],
            'latitude': values[4],
            'longitude': values[5],
            'altitude': values[6],
            'pressure': values[7],
            'acceleration': values[8:10],
            'gyroscope': values[11:13]
        }
    except Exception as e:
        print(f"Decoding error: {e}")
        return None


async def main():
    while True:
        await asyncio.sleep(0.04)

        packet = rfm9x.receive(timeout=5.0)
        if packet is not None:
            data = decode_data(packet)
            if data:
                q = data['quaternions']
                a = data['acceleration']
                g = data['gyroscope']
                sys.stdout.write(
                    f"{q[0]},{q[1]},{q[2]},{q[3]},{data['longitude']},{data['latitude']},{data['altitude']},{data['pressure']},{a[8]},{a[9]},{a[10]},{g[11]},{g[12]},{g[13]},{rfm9x.last_rssi}\n")
