import { Component, For, createMemo } from "solid-js";
import { createCachedResource } from 'solid-cache';
import { fetchWeekSchedules } from "../utils/api";
import { itd, mtr } from "../utils/conv";
import { getDateISO, getDateWithOffset } from "../utils/helper";

export const SchedulesOverview: Component<{
    week: () => string | undefined;
}> = (props) => {
    const { data: scheduleDate } = createCachedResource({
        source: () => props.week(),  // Function returning the week value
        key: (week) => `schedules/${week}`,  // Generate a cache key based on the week
        get: (week) => fetchWeekSchedules(week),  // Fetch function
    });

    const weekDates = createMemo(() => {
        const startDate = props.week();
        return [0, 1, 2, 3, 4, 5, 6].map(offset => {
            const date = getDateWithOffset(startDate || getDateISO(), offset);
            return {
                dayName: itd(new Date(date).getUTCDay()),
                date: date,
            };
        });
    })

    return (
    <table class="w-full text-center text-light print-text-dark font-norm bg-white border-collapse">
        <thead>
            <tr>
                <For each={weekDates()}>
                    {({ dayName, date }) => (
                        <th class="b b-solid b-white print-b-dark bg-dark print-bg-white p-2 min-w-240px w-260px text-xl">
                            {dayName} <br /> {date}
                        </th>
                    )}
                </For>
            </tr>
        </thead>
        <tbody>
            {["Inshop", "Driver", "Manager"].map((role) => (
                <>
                    <tr>
                        <td colspan={7} class="b b-solid b-white print-b-dark bg-black print-bg-white p-2 font-bold text-xl text-primary">
                            {role}
                        </td>
                    </tr>
                    <tr>
                        <For each={weekDates()}>
                            {(_, i) => (
                                <td class="b b-solid b-white print-b-dark bg-dark print-bg-white">
                                    <For each={scheduleDate()?.filter(schedule => 
                                        schedule.dayOfWeek === i() && schedule.role === role.toLowerCase())}>
                                        {(schedule) => (
                                            <div class="p-2 flex b-b-1px b-b-solid b-b-white print-b-b-dark last:border-b-none items-center flex-justify-between">
                                                <div class="pr-2 b-r-1px b-r-solid b-r-white print-b-r-dark">
                                                    {schedule.name}
                                                </div>
                                                <div class="pl-auto">
                                                    {mtr(schedule.clockIn)} - {mtr(schedule.clockOut)}
                                                </div>
                                            </div>
                                        )}
                                    </For>
                                </td>
                            )}
                        </For>
                    </tr>
                </>
            ))}
        </tbody>
    </table>
    );
};

