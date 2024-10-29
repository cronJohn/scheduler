import { Component, createEffect, createSignal, onMount } from "solid-js";
import { SchedulesOverview } from "../components/SchedulesOverview";
import { getDateISO, nearestStartOfWeek } from "../utils/helper";
import { NavBar } from "../components/NavBar";
import config from "../../../config.json";

const Overview: Component = () => {
    const [weekSelection, setWeekSelection] = createSignal<string>();

    onMount(() => {
        setWeekSelection(nearestStartOfWeek(getDateISO(), Number(config.frontend.WEEK_START) || 3) || getDateISO());
    });

    const addWeek = () => {
        const date = new Date(weekSelection() || "");
        date.setDate(date.getDate() + 7);
        setWeekSelection(date.toISOString().split('T')[0]);
    }

    const subtractWeek = () => {
        const date = new Date(weekSelection() || "");
        date.setDate(date.getDate() - 7);
        setWeekSelection(date.toISOString().split('T')[0]);
    }

    return (
        <>
            <header class="w-full mx-auto mt-4 mb-4 font-code flex justify-center items-center gap-2 print-hidden">
                <label for="week_start_date" class="">Week Start:</label>
                <button title="Go back 1 week" class="i-mdi:arrow-left-bold-box-outline w-7 h-7 bg-[white] hover:bg-gray transition-transform duration-200 ease-in-out hover:scale-110" 
                onClick={() => subtractWeek()}></button>
                <input
                id="week_start_date"
                type="date"
                value={weekSelection()}
                onChange={(e) => setWeekSelection(e.currentTarget.value)}
                class="py-2 px-4 border-2 border-solid border-primary rounded bg-offDark text-2xl text-white iw"
                />
                <button title="Go forward 1 week" class="i-mdi:arrow-right-bold-box-outline w-7 h-7 bg-[white] mr-4 hover:bg-gray transition-transform duration-200 ease-in-out hover:scale-110" 
                onClick={() => addWeek()}></button>
                <NavBar />
            </header>

            <SchedulesOverview week={weekSelection}/>
        </>
    );
};

export default Overview;

