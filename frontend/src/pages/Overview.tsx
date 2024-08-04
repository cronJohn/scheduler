import { Component, createSignal } from "solid-js";
import { SchedulesOverview } from "../components/SchedulesOverview";
import { CacheBoundary } from "solid-cache";

const Overview: Component = () => {
    const [weekSelection, setWeekSelection] = createSignal<string>();

    return (
        <>
            <header class="w-full mx-auto mt-4 font-code flex justify-center items-center gap-4 print-hidden">
                <label for="week_start_date" class="">Week Start:</label>
                <input
                id="week_start_date"
                type="date"
                value={weekSelection() || ""}
                onChange={(e) => setWeekSelection(e.currentTarget.value)}
                class="py-2 px-4 border-2 border-solid border-primary rounded bg-offDark text-2xl text-white iw"
                />
            </header>

            <CacheBoundary>
                <SchedulesOverview week={weekSelection}/>
            </CacheBoundary>
        </>
    );
};

export default Overview;

