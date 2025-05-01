import {ComponentProps} from "react";

const Message = (props: ComponentProps<any>) => {
    return (
        <p className={(props.severity === "warning" ? "text-red-500 order-1" : props.severity === "caution" ? "text-yellow-500 order-2" : "text-white order-3") + " font-mono text-xl"}>
            {props.text}
        </p>
    )
}

export default Message;