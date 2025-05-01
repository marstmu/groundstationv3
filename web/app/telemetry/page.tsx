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
import dynamic from "next/dynamic";
import Message from "@/app/components/message";


export default function Telemetry() {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");

    const [speed, setSpeed] = useState("52 m/s");
    const [mcuTemp, setMcuTemp] = useState(0);
    const [altitude, setAltitude] = useState(0);
    const [quaternion, setQuaternion] = useState([0,0,0,0]);


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
            setQuaternion(value.slice(0,4))

            setMcuTemp(value[4]);
        });

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    }, []);

    return (
        <div>
            <div className="flex flex-col min-h-dvh bg-gradient-to-b from-gray-900 to-black font-sans text-white">
                <header className="px-2 sm:px-8 py-2 font-bold text-2xl">MARS Telemetry Terminal</header>
                <div className="md:grow flex flex-col px-2 sm:px-8 sm:pb-8 min-h-full">
                    <div className="mb-2 border-2 border-gray-800 relative flex justify-between rounded-lg p-2 col-span-full h-12 gap-2">
                        <div className="h-full flex justify-start gap-2">
                            {/*<TextGauge title="STATE" value="IN FLIGHT" valueClassName="text-green-500"/>*/}
                            <p className="font-mono text-l sm:text-xl lg:text-2xl text-right text-green-500">IN FLIGHT</p>
                        </div>
                        <div className="h-full flex justify-end gap-2">
                            <Connection isConnected={isConnected} size={28} title="Server Connection"/>
                            <Signal strength={isConnected ? 4 : 0} size={28}/>
                        </div>
                    </div>
                    <div className="flex-1 grid grid-rows-3 grid-cols-1 sm:grid-rows-2 sm:grid-cols-2 lg:grid-rows-1 lg:grid-cols-5 flex-wrap gap-y-2 sm:gap-2 min-h-fit justify-stretch">
                        <Window title="Flight Data" className="">
                            <div className="grid grid-cols-3 lg:grid-cols-1 relative py-2 gap-x-2 gap-y-4 justify-center">
                                <TextGauge id="SPD" title="SPD" value="52 m/s"/>
                                <TextGauge title="ALT" value="621 ft"/>
                                <TextGauge title="HDG" value="195°"/>
                                <TextGauge title="FLT TIME" value="3.20s"/>
                                <TextGauge title="AIR TEMP" value="16 °C"/>
                                <TextGauge title="MCU TEMP" value={`${mcuTemp} °C`}/>
                                <TextGauge title="BATT" value="4.1 V"/>
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
                                <div className="grid grid-cols-3 lg:grid-cols-1 relative py-2 gap-x-2 gap-y-4 justify-center">
                                    <BarGauge title="RSSI" value="1"/>
                                    <BarGauge title="SNR" value="1"/>
                                    <BarGauge title="LINK BDGT." value="1"/>
                                </div>
                            </Window>
                            <Window title="Advisory"
                                    className="backdrop-blur sm:backdrop-blur-0 sm:bg-transparent flex-auto">
                                <div className="flex flex-col">
                                    <Message severity="" text="sigma"/>
                                    <Message severity="caution" text="the"/>
                                    <Message severity="warning" text="what"/>
                                </div>
                            </Window>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}