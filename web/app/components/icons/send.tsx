import {ComponentProps} from "react";

const Icon = (props: ComponentProps<any>) => {
    return (
        <svg className={props.className} xmlns="http://www.w3.org/2000/svg" height={props.size} viewBox="0 -960 960 960"
             width={props.size} fill="#ffffff">
            <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/>
        </svg>
    )
}

export default Icon