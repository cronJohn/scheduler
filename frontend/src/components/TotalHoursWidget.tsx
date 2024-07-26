import { Component } from "solid-js";

type TotalHoursWidgetProps = {
    totalHours: number;
}

export const TotalHoursWidget: Component<TotalHoursWidgetProps> = (props) => {
    return (
        <div class="fixed top-10px right-10px bg-offDark font-code px-5 border-solid border-light border-1px rounded z-1000">
            <h2 class="color-light font-light">
            Total Hours Worked: <span class="color-primary ">{props.totalHours}</span>
            </h2>
        </div>
    );
};
