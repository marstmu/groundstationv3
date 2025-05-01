import {ComponentProps} from "react";

const Icon = (props: ComponentProps<any>) => {
    return (
        <svg className={props.className} xmlns="http://www.w3.org/2000/svg" height={props.size} viewBox="0 -960 960 960" width={props.size} fill={props.isConnected ? "#ffffff" : "#ef4444"}>
            {props.isConnected
                ? <path d="M80-160v-120h80v-440q0-33 23.5-56.5T240-800h600v80H240v440h240v120H80Zm520 0q-17 0-28.5-11.5T560-200v-400q0-17 11.5-28.5T600-640h240q17 0 28.5 11.5T880-600v400q0 17-11.5 28.5T840-160H600Zm40-120h160v-280H640v280Zm0 0h160-160Z"/>
                : <path d="m354-720-80-80h566v80H354Zm526 520-80-80v-280H640v126l-80-80v-86q0-17 11.5-28.5T600-640h240q17 0 28.5 11.5T880-600v400ZM792-56 688-160h-88q-17 0-28.5-11.5T560-200v-88L240-608v328h240v120H80v-120h80v-408L56-792l56-56 736 736-56 56Zm-72-301Z"/>
            }
        </svg>
    )
}

export default Icon