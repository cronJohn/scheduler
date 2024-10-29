import { Component, For, JSXElement, Show, createEffect, createMemo, onMount } from "solid-js";
import { itd, mtr } from "../utils/conv";
import { fetchAllSchedules, updateExistingSchedule } from "../utils/api";
import { getDateISO, getDateWithOffset } from "../utils/helper";
import { useNavigate } from "@solidjs/router";
import { createStore } from "solid-js/store";
import { Schedule } from "../utils/types";
import Sortable from 'sortablejs';

const [allSchedules, setAllSchedules] = createStore<Schedule[]>([]);

export const SchedulesOverview: Component<{
    week: () => string | undefined;
}> = (props) => {
    const navigate = useNavigate();
    const [selectedSchedule, setSelectedSchedule] = createStore<Schedule>({
        userId: "",
        scheduleId: 0,
        day: "",
        role: "",
        clockIn: "",
        clockOut: "",
    });

    const fetchNewSchedules = async () => {
        const schedules = await fetchAllSchedules(navigate);
        setAllSchedules(schedules);
    }


    onMount(() => {
        fetchNewSchedules();
    });

    createEffect(() => {
        if (props.week()){ // If week changes
            fetchNewSchedules(); // Fetch new schedules
        }
    });

    const weekDates = createMemo(() => {
        return [0, 1, 2, 3, 4, 5, 6].map(offset => {
            const date = getDateWithOffset(props.week() || getDateISO(), offset);
            return {
                dayName: itd(new Date(date).getUTCDay()),
                date: date,
            };
        });
    })

    const uniqueRoles = createMemo(() => {
        return Array.from(new Set(allSchedules.map(schedule => schedule.role)));
    });
    
    return (
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
                {Array.from(new Set(allSchedules.map(schedule => schedule.role))).map((role) => ( // Get all unique roles
                    <>
                        <tr>
                            <td colspan={7} class="ol outline-solid outline-white print-outline-dark bg-black print-bg-white p-2 font-bold text-xl text-primary">
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                            </td>
                        </tr>
                        <tr>
                            <For each={weekDates()}>
                                {({ date }) => {
                                    const schedulesForDay = allSchedules.filter(schedule => 
                                        schedule.day === date && 
                                        schedule.role.toLowerCase() === role
                                    );
                                    const amSchedules = schedulesForDay.filter(schedule => Number(schedule.clockIn.slice(0, 2)) < 12);
                                    const pmSchedules = schedulesForDay.filter(schedule => Number(schedule.clockIn.slice(0, 2)) >= 12);

                                    return (
                                        <td class="ol p-0 outline-solid outline-white print-outline-dark bg-dark print-bg-white"
                                        data-day={date} data-role={role}>
                                            <ScheduleDroppable currentSelection={selectedSchedule}>
                                                <Show when={amSchedules.length > 0}>
                                                    <h3 class="font-bold text-lg">AM</h3>
                                                        <For each={amSchedules}>
                                                            {(schedule) => (
                                                                <ScheduleEntry schedule={schedule} 
                                                                onMouseEnter={() => setSelectedSchedule(schedule)} 
                                                                onMouseLeave={() => setSelectedSchedule({})}/>
                                                            )}
                                                        </For>
                                                </Show>

                                                <Show when={pmSchedules.length > 0}>
                                                    <h3 class="font-bold text-lg">PM</h3>
                                                        <For each={pmSchedules}>
                                                            {(schedule) => (
                                                                <ScheduleEntry schedule={schedule} 
                                                                onMouseEnter={() => setSelectedSchedule(schedule)} 
                                                                onMouseLeave={() => setSelectedSchedule({})}/>
                                                            )}
                                                        </For>
                                                </Show>
                                            </ScheduleDroppable>
                                        </td>
                                    );
                                }}
                            </For>
                        </tr>
                    </>
                ))}
            </tbody>
        </table>
    );
};

type ScheduleDroppableProps = {
  children: JSXElement | JSXElement[];
  currentSelection: Schedule;
};

const ScheduleDroppable: Component<ScheduleDroppableProps> = (props) => {
    let myRef: HTMLElement;
    const navigate = useNavigate();

    const setRef = (el: HTMLElement) => {
        myRef = el;
    };

    onMount(() => {
        Sortable.create(myRef, {
            group: "shared",
            animation: 150,
            draggable: ".draggable",
            onEnd: (e) => {
                const scheduleId = Number(e.item.dataset.scheduleid);
                const targetCell = e.to.closest("td");
                const newDay = targetCell?.dataset.day || "";
                const newRole = targetCell?.dataset.role || ""; // Use the role of the target cell
                const clockIn = e.item.dataset.clockin || "";
                const clockOut = e.item.dataset.clockout || "";
                
                updateExistingSchedule({ scheduleId, day: newDay, role: newRole, clockIn, clockOut }, navigate);

                setAllSchedules(schedules => 
                    schedules.map(schedule =>
                        schedule.scheduleId === scheduleId
                            ? { ...schedule, day: newDay, role: newRole } // Update both day and role
                            : schedule
                    )
                );
            },

        });
    })
  return (
      <div ref={setRef} class="flex flex-col w-full ol droppable items-center flex-justify-between">
          {props.children}
      </div>
  );
};

const ScheduleEntry: Component<{
    schedule: Schedule;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}> = (props) => {
    return (
        <div class="p-2 flex ol w-full draggable outline-solid outline-white outline-print-outline-dark flex-justify-between"
        onMouseEnter={() => props.onMouseEnter()}
        onMouseLeave={() => props.onMouseLeave()}
        data-scheduleid={props.schedule.scheduleId}
        data-clockin={props.schedule.clockIn}
        data-clockout={props.schedule.clockOut}
        >
            <div class="pr-2 outline-none b-r-1px b-r-solid print-border-dark">
                {props.schedule.userId}
            </div>
            <div class="pl-auto">
                {mtr(props.schedule.clockIn)} - {mtr(props.schedule.clockOut)}
            </div>
        </div>
    );
}
