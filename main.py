import machine
from machine import Pin, SPI
import sys
import asyncio
import struct
from lib.rfm9x import *

RADIO_FREQ_MHZ = 915.0


def decode_data(data):
    try:
        format_string = "<1f5h1f1h"
        values = struct.unpack(format_string, data)
        return {
            "time": values[0],
            'quaternions': values[1:5],
            "alt": values[5],
            'pressure': values[6],
            'acceleration': values[7],
        }
    except Exception as e:
        print(f"Decoding error: {e}")
        return None


async def main():
    CS = Pin(17, Pin.OUT)
    RESET = Pin(16, Pin.OUT)
    spi = SPI(0,
              baudrate=1000000,
              polarity=0,
              phase=0,
              bits=8,
              firstbit=SPI.MSB,
              sck=Pin(18),
              mosi=Pin(19),
              miso=Pin(20)
              )

    rfm9x = RFM9x(spi, CS, RESET, RADIO_FREQ_MHZ)
    rfm9x.tx_power = 14

    # Configure for better reliability
    rfm9x.signal_bandwidth = 500000
    rfm9x.coding_rate = 5
    rfm9x.spreading_factor = 7
    rfm9x.enable_crc = True

    while True:
        await asyncio.sleep(0.04)

        packet = rfm9x.receive(timeout=5.0)
        if packet is not None:
            data = decode_data(packet)
            if data:
                q = data['quaternions']
                a = data['acceleration']
                p = data["pressure"]
                alt = data["alt"]
                sys.stdout.write(
                    f"{data['time']},{q[0] / 100},{q[1] / 100},{q[2] / 100},{q[3] / 100},{alt},{p},{a / 100},{rfm9x.last_rssi}\n")


if __name__ == "__main__":
    asyncio.run(main())

