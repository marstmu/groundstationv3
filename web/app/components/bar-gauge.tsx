import {ComponentProps} from "react";

const BarGauge = (props: ComponentProps<any>) => {
    return (
        <div className={"border-2 border-gray-500 p-1 rounded-lg max-w-36 font-mono relative " + props.className} id={props.title}>
            <div className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 w-full max-h-px p-1 rounded-sm"/>
            <h2 className="text-xs sm:text-sm lg:text-base absolute -top-2 sm:-top-3 bg-gray-900 h-fit px-2">{props.title}</h2>
            <p className={"text-xl sm:text-3xl lg:text-4xl text-right " + props.valueClassName}>{props.value}</p>
        </div>
    );
}

export default BarGauge;