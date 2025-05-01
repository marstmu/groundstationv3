import {ComponentProps} from "react";

function renderSwitch(x: number) {
    switch (x) {
        case 0:
            return <path d="m676-100-56-56 84-84-84-84 56-56 84 84 84-84 56 56-83 84 83 84-56 56-84-83-84 83ZM80-80l800-799v427q-18-11-38-17.5T800-480v-206L273-160h257q8 23 20 43t27 37H80Zm193-80 527-526q-76 76-138 137.5t-121.5 121L417-304 273-160Z"/>;
        case 1:
            return <path d="m80-80 800-800v800H80Zm320-80h400v-526L400-286v126Z"/>;
        case 2:
            return <path d="m80-80 800-800v800H80Zm440-80h280v-526L520-406v246Z"/>;
        case 3:
            return <path d="m80-80 800-800v800H80Zm520-80h200v-526L600-486v326Z"/>;
        case 4:
            return <path d="m80-80 800-800v800H80Z"/>;
        default:
            return <path d="m80-80 800-800v800H80Zm193-80h527v-526L273-160Z"/>;
    }
}


const Icon = (props: ComponentProps<any>) => {
    return (
        <svg className={props.className} xmlns="http://www.w3.org/2000/svg" height={props.size} viewBox="0 -960 960 960" width={props.size} fill={props.strength === 0 ? "#ef4444" : "#ffffff"}>
            {renderSwitch(props.strength)}
        </svg>
    )
}

export default Icon