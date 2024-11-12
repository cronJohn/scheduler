import { For, Show, createResource, createSignal, onMount, type Component } from 'solid-js';
import { fetchUserSchedules, updateExistingSchedule, deleteExistingSchedule, createNewSchedule, CreateNewScheduleRequestData, UpdateScheduleRequestData, shiftSchedules, deleteExistingSchedules } from '../utils/api';
import { fmtDate, itd } from '../utils/conv';
import { TimeSlot } from '../components/TimeSlot';
import { createStore, produce } from 'solid-js/store';
import { EditTimeSlotModal } from '../components/modals/EditTimeSlotModal';
import { SelectUser } from '../components/SelectUser';
import { AddEntryModal } from '../components/modals/AddEntryModal';
import { DaySchedule, Schedule } from '../utils/types';
import { displayCurrentOrPrevWeek, getDateISO, groupSchedulesByWeek, setUpKeybindings } from '../utils/helper';
import { NavBar } from '../components/NavBar';
import { useNavigate } from '@solidjs/router';

const Admin: Component = () => {
    const navigate = useNavigate();

    const [isTimeSlotModalOpen, setIsTimeSlotModalOpen] = createSignal<boolean>(false);
    const [isAddEntryModalOpen, setIsAddEntryModalOpen] = createSignal<boolean>(false);

    const [weekSelectionId, setWeekSelectionId] = createSignal<string>("");

    const [currentSchedule, setCurrentSchedule] = createStore<Schedule>({
        userId: "",
        role: "",
        scheduleId: 0,
        day: getDateISO(),
        clockIn: "11:00",
        clockOut: "12:00",
    });

    const shortcuts: {
        [key: string]: () => void;
    }= {
        "a" : () => setTimeout(() => {setIsAddEntryModalOpen(true)}, 50),
    }

    onMount(() => {setUpKeybindings(shortcuts)})

    const [schedules, { refetch }] = createResource(() => currentSchedule.userId, fetchUserSchedules);

    const calculateTotalWeekHours = (data: DaySchedule): number => {
        if (!data) return 0;

        let totalHours = 0;
        const MS_PER_HOUR = 1000 * 60 * 60;

        for (const dayEntries of Object.values(data)) {
            for (const entry of dayEntries) {
                const [inHours, inMinutes] = entry.clockIn.split(":");
                const [outHours, outMinutes] = entry.clockOut.split(":");

                const inDate = new Date();
                inDate.setHours(parseInt(inHours), parseInt(inMinutes));

                const outDate = new Date();
                outDate.setHours(parseInt(outHours), parseInt(outMinutes));

                const durationMs = outDate.getTime() - inDate.getTime();
                const durationHours = durationMs / MS_PER_HOUR;

                totalHours += durationHours;
            }
        }

        return Math.round(Math.abs(totalHours));
    };

    const handleTimeSlotEdit = (data: Schedule) => {
        setCurrentSchedule(
            produce((state) => {
                state.scheduleId = data.scheduleId;
                state.role = data.role;
                state.day = data.day;
                state.clockIn = data.clockIn;
                state.clockOut = data.clockOut;
            })
        );
    };

    const handleAddNewSchedule = async (data: CreateNewScheduleRequestData) => {
        try {
            if (!currentSchedule) return;
            await createNewSchedule(data, navigate);
            refetch();
            setIsAddEntryModalOpen(false);
        } catch (error) {
            console.error("Failed to update schedule", error);
        }
    };

    const handleUpdateExistingSchedule = async (data: UpdateScheduleRequestData) => {
        try {
            if (!currentSchedule) return;
            await updateExistingSchedule(data, navigate);
            refetch();
            setIsTimeSlotModalOpen(false);
        } catch (error) {
            console.error("Failed to update schedule", error);
        }
    };

    const handleDeleteExistingSchedule = async (scheduleId: number) => {
        try {
            if (!currentSchedule) return;
            await deleteExistingSchedule(scheduleId, navigate);
            refetch();
            setIsTimeSlotModalOpen(false);
        } catch (error) {
            console.error("Failed to delete schedule", error);
        }
    };

    const getScheduleIds = (weeks: DaySchedule): number[] => {
        return Object.values(weeks)
            .map(schedules => schedules.map(schedule => schedule.scheduleId))
            .flat();
    }

    const handlePreviousWeekShift = async (weeks: DaySchedule) => {
        try {
            // Use to set selection week to previous week
            // to preserve the <Snow> component
            const weekBuf = new Date(weekSelectionId());
            weekBuf.setDate(weekBuf.getDate() - 7);

            await shiftSchedules({
                scheduleIdList: getScheduleIds(weeks),
                shiftAmount: "-7 days"
            }, navigate)

            refetch();
            setWeekSelectionId(weekBuf.toISOString().split('T')[0]);
        } catch (error) {
            console.error("Failed to shift schedules to previous week", error);
        }
    }

    const handleNextWeekShift = async (weeks: DaySchedule) => {
        try {
            // Use to set selection week to next week
            // to preserve the <Snow> component
            const weekBuf = new Date(weekSelectionId());
            weekBuf.setDate(weekBuf.getDate() + 7);

            await shiftSchedules({
                scheduleIdList: getScheduleIds(weeks),
                shiftAmount: "+7 days"
            }, navigate)

            refetch();
            setWeekSelectionId(weekBuf.toISOString().split('T')[0]);
        } catch (error) {
            console.error("Failed to shift schedules to next week", error);
        }
    }

    const handleWeekDeletion = async (weeks: DaySchedule) => {
        try {
            await deleteExistingSchedules(getScheduleIds(weeks), navigate);
            refetch();
        } catch (error) {
            console.error("Failed to delete schedules", error);
        }
    }

    return (
        <>
            <NavBar />
            <div class='mt-20 mb-10 w-100wv flex gap-4 justify-center'>
                <label for="user_id" class="text-2xl font-code my-auto">User ID: </label>
                <SelectUser setFn={(input: string) => setCurrentSchedule("userId", input)} />

                <button class='bg-dark color-light bb-primary px-4 py-2 rounded text-lg bt' onClick={() => setIsAddEntryModalOpen(true)}>Add entry</button>
            </div>

            <Show when={currentSchedule.userId && schedules()}>
                <For each={Object.entries(groupSchedulesByWeek(schedules() || []))}>
                {([weekStartDate, weekEntries]) => (
                    <div class='mx-auto mb-30px min-w-650px w-50vw bg-offDark px-5 py-4 rounded font-norm'
                    onMouseEnter={() => {setWeekSelectionId(weekStartDate)}}
                    >
                        <h1 class='mb-2 mt-0'><span class='underline underline-offset-5'>{displayCurrentOrPrevWeek(weekStartDate)}: {fmtDate(weekStartDate)}</span>
                            <span class='text-lg font-light ml-10px mr-2'>(Total Hours: {calculateTotalWeekHours(weekEntries)})</span>
                            <Show when={weekSelectionId() === weekStartDate}>
                                <button title="Move schedules to previous week" class="bg-light i-mdi:calendar-arrow-left w-6 h-6"
                                onClick={() => handlePreviousWeekShift(weekEntries)}></button>
                                <button title="Move schedules to next week" class="bg-light i-mdi:calendar-arrow-right w-6 h-6"
                                onClick={() => handleNextWeekShift(weekEntries)}></button>
                                <button title="Delete schedules for week" class="bg-light i-mdi:delete-outline w-6 h-6"
                                onClick={() => handleWeekDeletion(weekEntries)}></button>
                            </Show>
                        </h1>
                        <div>
                            <For each={Object.entries(weekEntries)}>
                            {([dayOfWeek, dayEntries]) => (
                                <div class='ml-25px'>
                                    <h2 class='font-medium my-0' title={fmtDate(dayEntries[0].day)}>{itd(Number(dayOfWeek))}</h2>
                                    <div class='flex gap-10 overflow-x-scroll border-solid border-light border-1px rounded px-5 py-5 mb-5'>
                                        <For each={dayEntries}>
                                        {(entry) => {
                                            const updatedEntry = { ...entry, userId: currentSchedule.userId }; // Due to API, userId need to be set

                                            return (
                                                <div onMouseEnter={() => setCurrentSchedule(updatedEntry)}>
                                                    <TimeSlot openModal={() => setIsTimeSlotModalOpen(true)} getStateFn={() => updatedEntry}
                                                    updateFn={handleTimeSlotEdit}/>
                                                </div>
                                            );
                                        }}
                                        </For>
                                    </div>
                                </div>
                            )}
                            </For>
                        </div>
                    </div>
                )}
                </For>
            </Show>

            <EditTimeSlotModal isModalOpen={isTimeSlotModalOpen} closeModal={() => setIsTimeSlotModalOpen(false)} getStateFn={() => ({
                scheduleId: currentSchedule.scheduleId,
                userId: currentSchedule.userId,
                role: currentSchedule.role,
                day: currentSchedule.day,
                clockIn: currentSchedule.clockIn,
                clockOut: currentSchedule.clockOut
            })}
            handleUpdate={(data: UpdateScheduleRequestData) => handleUpdateExistingSchedule(data)}
            handleDelete={(scheduleId: number) => handleDeleteExistingSchedule(scheduleId)}/>

            <AddEntryModal isModalOpen={isAddEntryModalOpen} closeModal={() => setIsAddEntryModalOpen(false)} 
            getStateFn={() => currentSchedule}
            targetUser={currentSchedule.userId ?? ""}
            handleAdd={(data: CreateNewScheduleRequestData) => handleAddNewSchedule(data)}/>
        </>
    );
};

export default Admin;

