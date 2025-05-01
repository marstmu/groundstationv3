import {ComponentProps} from "react";

const TextGauge = (props: ComponentProps<any>) => {
    return (
        <div className={"border-2 border-gray-500 p-2 rounded-lg max-w-56 font-mono relative " + props.className}>
            <h2 className=" text-xs sm:text-sm lg:text-base absolute -top-2 sm:-top-3 bg-gray-900 h-fit px-2">{props.title}</h2>
            <p className={"text-xl sm:text-3xl lg:text-4xl text-right " + props.valueClassName}>{props.value}</p>
        </div>
    );
}

export default TextGauge;