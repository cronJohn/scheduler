import { Component, For, JSXElement, Show, createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { itd, mtr } from "../utils/conv";
import { CreateNewScheduleRequestData, UpdateScheduleRequestData, createNewSchedule, deleteExistingSchedule, fetchAllSchedules, updateExistingSchedule } from "../utils/api";
import { getDateISO, getDateWithOffset, setUpKeybindings } from "../utils/helper";
import { useNavigate } from "@solidjs/router";
import { createStore, produce } from "solid-js/store";
import { Schedule } from "../utils/types";
import Sortable from 'sortablejs';
import config from "../../../config.json";
import { EditTimeSlotModal } from "./modals/EditTimeSlotModal";
import { AddEntryModal } from "./modals/AddEntryModal";

const [allSchedules, setAllSchedules] = createStore<Schedule[]>([]);

const [selectedSchedule, setSelectedSchedule] = createStore<Schedule>({
    userId: "",
    scheduleId: 0,
    day: "",
    role: "",
    clockIn: "",
    clockOut: "",
});

const ContextMenu: Component<{
    handleDelete: () => void;
    handleEdit: () => void;
}> = (props) => {
    const [show, setShow] = createSignal(false);
    const [position, setPosition] = createSignal({ x: 0, y: 0 });

    const handleContextMenu = (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        //                                    Can really be any data attribute specific to the Schedule type
        const nearestElement = target.closest('[data-userid]') as HTMLElement;

        setSelectedSchedule(produce((state) => {
            state.userId = nearestElement?.dataset.userid || "";
            state.scheduleId = Number(nearestElement?.dataset.scheduleid) || 0;
            state.day = nearestElement?.dataset.day || "";
            state.role = nearestElement?.dataset.role || "";
            state.clockIn = nearestElement?.dataset.clockin || "";
            state.clockOut = nearestElement?.dataset.clockout || "";
        }));

        // Check if the target or any of its ancestors has the class 'open-context-menu'
        if (target.closest('.open-context-menu')) {
            event.preventDefault(); // Prevent the default context menu from appearing
            setPosition({ x: event.pageX, y: event.pageY });
            setShow(true);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (show() && !(event.target as HTMLElement).closest(".context-menu")) {
            setShow(false);
        }
    };

    // Add event listeners for context menu and click outside
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("click", handleClickOutside);

    // Cleanup event listeners on component unmount
    onCleanup(() => {
        document.removeEventListener("contextmenu", handleContextMenu);
        document.removeEventListener("click", handleClickOutside);
    });

    const handleDelete = () => {
        props.handleDelete();
        setShow(false);
    };

    const handleEdit = () => {
        props.handleEdit();
        setShow(false);
    };
    
    return (
        <>
            <Show when={show()}>
                <div
                    class="context-menu absolute bg-dark text-white b-primary b-solid rounded z-1000 px-2 text-sm"
                    style={{
                        top: `${position().y}px`,
                        left: `${position().x}px`,
                    }}
                >
                    <h1 class="bg-dark text-light font-code mb-2">Edit Schedule</h1>
                    <div class="flex flex-col items-center mb-2">
                        <div class="flex space-between items-center w-full px-1 py-2 hover:bg-slightDark transition-colors duration-100 rounded"
                        onClick={handleDelete}
                        >
                            <div class="i-mdi:trash-outline bg-white w-6 h-6 cursor-pointer"></div>
                            <button class="bg-transparent font-code text-light text-lg">Delete</button>
                        </div>
                        <div class="flex space-between items-center w-full px-1 py-2 hover:bg-slightDark transition-colors duration-100 rounded"
                        onClick={handleEdit}
                        >
                            <div class="i-mdi:square-edit-outline bg-white w-6 h-6 cursor-pointer"></div>
                            <button class="bg-transparent font-code text-light text-lg">Edit</button>
                        </div>
                    </div>
                </div>
            </Show>
        </>
    );
};

export const SchedulesOverview: Component<{
    week: () => string | undefined;
}> = (props) => {
    const navigate = useNavigate();

    const fetchNewSchedules = async () => {
        const schedules = await fetchAllSchedules(navigate);
        setAllSchedules(schedules);
    }

    const [isEditTimeSlotModalOpen, setIsEditTimeSlotModalOpen] = createSignal<boolean>(false);
    const [isAddEntryModalOpen, setIsAddEntryModalOpen] = createSignal<boolean>(false);

    onMount(() => {
        fetchNewSchedules();
        setUpKeybindings({"a": () => {setTimeout(() => {
            setIsAddEntryModalOpen(true)
        }, 0)}}, ["INPUT", "TEXTAREA"]);
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

    const roleOrder: { [key: string]: number } = config.frontend.ROLES.reduce<{ [key: string]: number }>(
        (acc, role: string, index: number) => {
            acc[role] = index + 1;
            return acc;
        },
        {}
    );

    const handleScheduleDelete = async () => {
        await deleteExistingSchedule(selectedSchedule.scheduleId, navigate);
        setAllSchedules(allSchedules.filter(schedule => schedule.scheduleId !== selectedSchedule.scheduleId));
    }

    const handleScheduleEdit = async (data: UpdateScheduleRequestData) => {
        await updateExistingSchedule(data, navigate);

        setAllSchedules(allSchedules.map(schedule => 
            schedule.scheduleId === data.scheduleId 
                ? { ...schedule, day: data.day, role: data.role, clockIn: data.clockIn, clockOut: data.clockOut }
                : schedule
        ));
    }

    const handleScheduleAdd = async (data: CreateNewScheduleRequestData) => {
        await createNewSchedule(data, navigate);

        fetchNewSchedules();
    }

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
                {Array.from(new Set(allSchedules.map(schedule => schedule.role.toLowerCase())))
                .sort((a, b) => (roleOrder[a] || Infinity) - (roleOrder[b] || Infinity))
                .map((role) => (
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
                                            onMouseEnter={() => setSelectedSchedule(produce(state => {state.day = date; state.role = role}))}
                                            data-day={date}
                                            data-role={role}>
                                                <ScheduleDroppable>
                                                    <Show when={allSchedules && amSchedules.length > 0}>
                                                        <h3 class="font-bold text-lg">AM</h3>
                                                        <For each={amSchedules}>
                                                            {(schedule) => (
                                                                <ScheduleEntry schedule={schedule} />
                                                            )}
                                                        </For>
                                                    </Show>

                                                    <Show when={allSchedules && pmSchedules.length > 0}>
                                                        <h3 class="font-bold text-lg">PM</h3>
                                                        <For each={pmSchedules}>
                                                            {(schedule) => (
                                                                <ScheduleEntry schedule={schedule} />
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
            <ContextMenu handleDelete={handleScheduleDelete} handleEdit={() => setIsEditTimeSlotModalOpen(true)} />
            <EditTimeSlotModal isModalOpen={isEditTimeSlotModalOpen} closeModal={() => setIsEditTimeSlotModalOpen(false)} getStateFn={() => ({
                scheduleId: selectedSchedule.scheduleId,
                userId: selectedSchedule.userId,
                role: selectedSchedule.role,
                day: selectedSchedule.day,
                clockIn: selectedSchedule.clockIn,
                clockOut: selectedSchedule.clockOut
            })}
            handleUpdate={(data: UpdateScheduleRequestData) => {handleScheduleEdit(data); setIsEditTimeSlotModalOpen(false)}}
            handleDelete={(_: number) => {handleScheduleDelete(); setIsEditTimeSlotModalOpen(false)}}/>


            {/* Put in Show component so initial state gets reset */}
            <Show when={isAddEntryModalOpen()}>
                <AddEntryModal isModalOpen={() => isAddEntryModalOpen()} closeModal={() => setIsAddEntryModalOpen(false)}
                getStateFn={() => ({
                    userId: "",
                    role: selectedSchedule.role,
                    day: selectedSchedule.day,
                    clockIn: "11:00",
                    clockOut: "12:00",
                })} 
                targetUser="" handleAdd={(data: CreateNewScheduleRequestData) => {handleScheduleAdd(data); setIsAddEntryModalOpen(false)}}/>
            </Show>

        </table>
    );
};

type ScheduleDroppableProps = {
  children: JSXElement | JSXElement[];
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
            const clockIn = e.item.dataset.clockin || "";
            const clockOut = e.item.dataset.clockout || "";

            // Currently dragged schedule
            const previousCell = e.from.closest("td");
            const prevDay = previousCell?.dataset.day || "";
            const prevRole = previousCell?.dataset.role || "";

            // New cell
            const targetCell = e.to.closest("td");
            const newDay = targetCell?.dataset.day || "";
            const newRole = targetCell?.dataset.role || "";

            // Only proceed if the day or role has changed
            if (prevDay !== newDay || prevRole !== newRole) {
                updateExistingSchedule({ scheduleId, day: newDay, role: newRole, clockIn, clockOut }, navigate);

                const newSchedules = allSchedules.map(schedule => 
                schedule.scheduleId === scheduleId 
                    ? { ...schedule, day: newDay, role: newRole, clockIn, clockOut }
                    : schedule
                );

                setAllSchedules(newSchedules);

            }
            },
        });
    });


    return (
      <div ref={setRef} class="flex flex-col w-full ol droppable items-center flex-justify-between">
          {props.children}
      </div>
    );
};

const ScheduleEntry: Component<{
    schedule: Schedule;
}> = (props) => {
    return (
        <div class="p-2 flex ol w-full draggable outline-solid outline-white print-outline-dark flex-justify-between open-context-menu"
        data-scheduleid={props.schedule.scheduleId}
        data-userid={props.schedule.userId}
        data-role={props.schedule.role}
        data-day={props.schedule.day}
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
