"use client";

import BarGauge from "@/app/components/bar-gauge";
import Viewer from "@/app/components/viewer";
import ViewerRocket from "@/app/components/viewer-rocket";
import TextGauge from "@/app/components/text-gauge";
import Window from "@/app/components/window";
import {useEffect, useState} from "react";
import {socket} from "@/app/components/socket"
import ViewerFdai from "@/app/components/viewer-fdai";
import Image from "next/image";
import Connection from "@/app/components/icons/connection";
import Signal from "@/app/components/icons/signal";
import Send from "@/app/components/icons/send"
import dynamic from "next/dynamic";
import Message from "@/app/components/message";
import TextInput from "@/app/components/text-input";


export default function Telemetry() {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");

    const [commandInput, setCommandInput] = useState("");
    const [gsMessages, setGsMessages] = useState<string[]>([]);

    const [speed, setSpeed] = useState("52 m/s");
    const [long, setLong] = useState(0);
    const [lat, setLat] = useState(0);
    const [altitude, setAltitude] = useState(0);
    const [flightTime, setFlightTime] = useState(3.20);
    const [airTemp, setAirTemp] = useState(16);
    const [quaternion, setQuaternion] = useState([0, 0, 0, 0]);
    const [lastRSSI, setLastRSSI] = useState(1);
    const [pressure, setPressure] = useState(0);


    useEffect(() => {
        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            setIsConnected(true);
            setTransport(socket.io.engine.transport.name);

            socket.io.engine.on("upgrade", (transport) => {
                setTransport(transport.name);
            });
        }

        function onDisconnect() {
            setIsConnected(false);
            setTransport("N/A");
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        socket.on("telemetry_push", (value) => {
            console.log(value);
            setQuaternion(value.slice(1, 5));

            if (value.length > 5) {
                // Speed we can determine as we have acceleration and a constant time step.
                const vx = (value[12] !== undefined ? value[12] / 100 : 0) * 0.05;
                const vy = (value[13] !== undefined ? value[13] / 100 : 0) * 0.05;
                const vz = (value[14] !== undefined ? value[14] / 100 : 0) * 0.05;
                const v = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2) + Math.pow(vz, 2));

                setSpeed(`${v.toFixed(3)} m/s`);
                setAltitude(value[7] !== undefined ? value[7] : altitude);
                setFlightTime(value[0] !== undefined ? value[0] : flightTime);
                setAirTemp(value[10] !== undefined ? value[10] : 16);
                setLat(value[6] !== undefined ? value[6] / 100 : lat);
                setLong(value[5] !== undefined ? value[5] / 100 : long);
                setLastRSSI(value[15] !== undefined ? value[15] : lastRSSI);
                setPressure(value[8] !== undefined ? value[8] : pressure);
            }
        });

        socket.on("ground_station_msg", (value) => {
            gsMessages.push(value);
        })

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    }, []);

    const sendCommand = () => {
        if (isConnected && commandInput !== "") {
            socket.emit('gs_command', commandInput);
            setCommandInput('');
        }
    }

    return (
        <div>
            <div className="flex flex-col min-h-dvh bg-gradient-to-b from-gray-900 to-black font-sans text-white">
                <header className="px-2 sm:px-8 py-2 font-bold text-2xl">MARS Telemetry Terminal</header>
                <div className="md:grow flex flex-col px-2 sm:px-8 sm:pb-8 min-h-full">
                    <div
                        className="mb-2 border-2 border-gray-800 relative flex justify-between rounded-lg p-2 col-span-full h-12 gap-2">
                        <div className="h-full flex justify-start gap-2">
                            {/*<TextGauge title="STATE" value="IN FLIGHT" valueClassName="text-green-500"/>*/}
                            <p className="font-mono text-l sm:text-xl lg:text-2xl text-right text-green-500">IN
                                FLIGHT</p>
                        </div>
                        <div className="h-full flex justify-end gap-2">
                            <Connection isConnected={isConnected} size={28} title="Server Connection"/>
                            <Signal strength={isConnected ? 4 : 0} size={28}/>
                        </div>
                    </div>
                    <div
                        className="flex-1 grid grid-rows-3 grid-cols-1 sm:grid-rows-2 sm:grid-cols-2 lg:grid-rows-1 lg:grid-cols-5 flex-wrap gap-y-2 sm:gap-2 min-h-fit justify-stretch">
                        <Window title="Flight Data" className="">
                            <div
                                className="grid grid-cols-3 lg:grid-cols-1 relative py-2 gap-x-2 gap-y-4 justify-center">
                                <TextGauge id="SPD" title="SPD" value={speed}/>
                                <TextGauge title="ALT" value={`${altitude} ft`}/>
                                <TextGauge title="FLT TIME" value={`${flightTime}s`}/>
                                <TextGauge title="AIR TEMP" value={`${airTemp} °C`}/>
                                <TextGauge title="PRESSURE" value={`${pressure}`}/>
                                <TextGauge title="LAT" value={`${lat}°N`}/>
                                <TextGauge title="LONG" value={`${long}°W`}/>
                            </div>
                        </Window>
                        <Window title="GPS" className="row-start-2 sm:row-auto lg:col-span-3">
                            <div className="w-full h-full">
                                <Viewer>
                                    {/*<ViewerRocket quat={quaternion}/>*/}
                                    <ViewerFdai quat={quaternion}/>
                                    {/*<gridHelper args={[10, 10, 0x1f2937, 0x1f2937]}/>*/}
                                </Viewer>
                            </div>
                        </Window>
                        <div className="col-span-2 lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-2">
                            <Window title="Radio" className="flex-auto">
                                <div
                                    className="grid grid-cols-3 lg:grid-cols-1 relative py-2 gap-x-2 gap-y-4 justify-center">
                                    <BarGauge title="RSSI" value={lastRSSI}/>
                                    <BarGauge title="SNR" value="1"/>
                                    <BarGauge title="LINK BDGT." value="1"/>
                                </div>
                                <div className="pt-5 flex flex-row">
                                    <div
                                        className={"flex-auto border-2 border-red-500 p-2 rounded-lg font-mono relative"}>
                                        <h2 className=" text-xs sm:text-sm lg:text-base absolute -top-2 sm:-top-3 bg-gray-900 h-fit px-2">COMMAND</h2>
                                        <input
                                            className={"appearance-none bg-transparent text-sm sm:text-lg lg:text-lg w-full rounded-none"}
                                            value={commandInput}
                                            onChange={(e) => setCommandInput(e.target.value)}
                                        />
                                    </div>
                                    <button className="pl-2" onClick={sendCommand}>
                                        <Send size={28}></Send>
                                    </button>
                                </div>
                            </Window>
                            <Window title="Advisory"
                                    className="backdrop-blur sm:backdrop-blur-0 sm:bg-transparent flex-auto">
                                <div className="flex flex-col">
                                    {gsMessages.map(message => (
                                        <Message severity="caution" text={message}/>
                                    ))}
                                </div>
                            </Window>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
