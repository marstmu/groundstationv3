"use client";

import { io } from "socket.io-client";

export const socket = io("ws://127.0.0.1:5000", {
    reconnectionDelayMax: 10000
    }
);