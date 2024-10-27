import { Component, For, Show, createEffect, createMemo, createResource } from "solid-js";
import { itd, mtr } from "../utils/conv";
import { fetchAllSchedules } from "../utils/api";
import { getDateISO, getDateWithOffset } from "../utils/helper";
import { useNavigate } from "@solidjs/router";
import { createStore } from "solid-js/store";
import { Schedule } from "../utils/types";

export const SchedulesOverview: Component<{
    week: () => string | undefined;
}> = (props) => {
    const navigate = useNavigate();
    const [allSchedules] = createResource(() => fetchAllSchedules(navigate));
    const [selectedSchedule, setSelectedSchedule] = createStore<Schedule>({
        userId: "",
        scheduleId: 0,
        day: "",
        role: "",
        clockIn: "",
        clockOut: "",
    });

    createEffect(() => {
        console.log('user id', selectedSchedule.userId);
        console.log('schedule id', selectedSchedule.scheduleId);
    })

    const weekDates = createMemo(() => {
        return [0, 1, 2, 3, 4, 5, 6].map(offset => {
            const date = getDateWithOffset(props.week() || getDateISO(), offset);
            return {
                dayName: itd(new Date(date).getUTCDay()),
                date: date,
            };
        });
    })
    
    return (
        <Show when={allSchedules()} fallback={<div>Loading...</div>}>
            <table class="w-full text-center text-light print-text-dark font-norm bg-white border-collapse">
                <thead>
                    <tr>
                        <For each={weekDates()}>
                            {({ dayName, date }) => (
                                <th class="ol outline-solid outline-white print-outline-dark bg-dark print-bg-white p-2 min-w-240px w-260px text-xl">
                                    {dayName} <br /> {date}
                                </th>
                            )}
                        </For>
                    </tr>
                </thead>
                <tbody>
                    {Array.from(new Set(allSchedules()?.map(schedule => schedule.role))).map((role) => ( // Get all unique roles
                        <>
                            <tr>
                                <td colspan={7} class="ol outline-solid outline-white print-outline-dark bg-black print-bg-white p-2 font-bold text-xl text-primary">
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </td>
                            </tr>
                            <tr>
                                <For each={weekDates()}>
                                    {({ date }) => {
                                        const schedulesForDay = (allSchedules() || []).filter(schedule => 
                                            schedule.day === date && 
                                            schedule.role.toLowerCase() === role
                                        );

                                        const amSchedules = schedulesForDay.filter(schedule => Number(schedule.clockIn.slice(0, 2)) < 12);
                                        const pmSchedules = schedulesForDay.filter(schedule => Number(schedule.clockIn.slice(0, 2)) >= 12);

                                        return (
                                            <td class="ol outline-solid outline-white print-outline-dark bg-dark print-bg-white">
                                                <div>
                                                    {amSchedules.length > 0 && (
                                                        <>
                                                            <h3 class="font-bold text-lg">AM</h3>
                                                            <div class="ol outline-solid outline-white print-outline-dark">
                                                                <For each={amSchedules}>
                                                                    {(schedule) => (
                                                                        <div class="p-2 flex ol even-outline-0px outline-solid outline-white print-outline-dark items-center flex-justify-between"
                                                                        onMouseEnter={() => setSelectedSchedule(schedule)}
                                                                        onMouseLeave={() => setSelectedSchedule({})}>
                                                                            <div class="pr-2 outline-none b-r-1px b-r-solid print-border-dark">
                                                                                {schedule.userId}
                                                                            </div>
                                                                            <div class="pl-auto">
                                                                                {mtr(schedule.clockIn)} - {mtr(schedule.clockOut)}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </For>
                                                            </div>
                                                        </>
                                                    )}
                                                    {pmSchedules.length > 0 && (
                                                        <>
                                                            <h3 class="font-bold text-lg">PM</h3>
                                                            <div class="ol outline-solid outline-white print-outline-dark">
                                                                <For each={pmSchedules}>
                                                                    {(schedule) => (
                                                                        <div class="p-2 flex ol even-outline-0px outline-solid outline-white print-outline-dark items-center flex-justify-between"
                                                                        onMouseEnter={() => setSelectedSchedule(schedule)}
                                                                        onMouseLeave={() => setSelectedSchedule({})}>
                                                                            <div class="pr-2 outline-none b-r-1px b-r-solid print-border-dark">
                                                                                {schedule.userId}
                                                                            </div>
                                                                            <div class="pl-auto">
                                                                                {mtr(schedule.clockIn)} - {mtr(schedule.clockOut)}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </For>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    }}
                                </For>
                            </tr>
                        </>
                    ))}
                </tbody>
            </table>
        </Show>
    );
};

