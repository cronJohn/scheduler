import { For, Show, createResource, createSignal, type Component } from 'solid-js';
import { fetchSchedules, updateExistingSchedule, deleteExistingSchedule, createNewSchedule, deleteUserWeekStartDate, updateUserWeekStartDate, NewScheduleData, UpdateScheduleData, UpdateWeekStartData, DeleteScheduleData, DeleteUserWeekStartDateData } from '../utils/api';
import { fmtDate, itd } from '../utils/conv';
import { TimeSlot } from '../components/TimeSlot';
import { createStore, produce } from 'solid-js/store';
import { EditTimeSlotModal } from '../components/modals/EditTimeSlotModal';
import { SelectUser } from '../components/SelectUser';
import { AddEntryModal } from '../components/modals/AddEntryModal';
import { UpdateWeekStartModal } from '../components/modals/UpdateWeekStartModal';
import { ActiveState, DaySchedule, TimeEntry } from '../utils/types';
import { getDateISO } from '../utils/helper';
import { NavBar } from '../components/NavBar';

const Admin: Component = () => {
    const [isTimeSlotModalOpen, setIsTimeSlotModalOpen] = createSignal<boolean>(false);
    const [isAddEntryModalOpen, setIsAddEntryModalOpen] = createSignal<boolean>(false);
    const [isUpdateWeekStartModalOpen, setIsUpdateWeekStartModalOpen] = createSignal<boolean>(false);

    const [hoveredWeek, setHoveredWeek] = createSignal<string | null>(null);
    const [currentSelection, setCurrentSelection] = createStore<ActiveState>({
        userId: null,
        entryId: 0,
        weekStartDate: getDateISO(),
        dayOfWeek: 0,
        clockIn: "11:00",
        clockOut: "12:00",
    });

    const [schedules, { refetch }] = createResource(() => currentSelection.userId, fetchSchedules);

    const openUpdateWeekStartModal = (weekStart: string) => {
        setIsUpdateWeekStartModalOpen(true);
        setHoveredWeek(weekStart);
    }

    const calculateTotalWeekHours = (data: DaySchedule): number => {
        if (!data) return 0;

        let totalHours = 0;
        const MS_PER_HOUR = 1000 * 60 * 60;

        for (const dayEntries of Object.values(data)) {
            for (const entry of Object.values(dayEntries)) {
                const [inHours, inMinutes] = entry.clockIn.split(":")
                const [outHours, outMinutes] = entry.clockOut.split(":")

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
    }

    const handleTimeSlotEdit = (data: TimeEntry) => {
        setCurrentSelection(
            produce((state) => {
                state.entryId = data.id;
                state.clockIn = data.clockIn;
                state.clockOut = data.clockOut;
            })
        );
    };

    const handleAddNewSchedule = async (data: NewScheduleData, userId: string) => {
        try {
            if (!currentSelection) return;
            await createNewSchedule(userId, data);
            refetch();
            setIsAddEntryModalOpen(false);
        } catch (error) {
            console.error("Failed to update schedule", error);
        }
    };

    const handleUpdateExistingSchedule = async (data: UpdateScheduleData) => {
        try {
            if (!currentSelection) return;
            await updateExistingSchedule(data);
            refetch();
            setIsTimeSlotModalOpen(false);
        } catch (error) {
            console.error("Failed to update schedule", error);
        }
    };

    const handleUpdateUserWeekStart = async (data: UpdateWeekStartData) => {
        try {
            if (!currentSelection) return;
            await updateUserWeekStartDate(currentSelection.userId ?? "", data)
            refetch();
            setIsUpdateWeekStartModalOpen(false);
        } catch (error) {
            console.error("Failed to update week start date", error);
        }
    }

    const handleDeleteExistingSchedule = async (data: DeleteScheduleData) => {
        try {
            if (!currentSelection) return;
            await deleteExistingSchedule(data);
            refetch();
            setIsTimeSlotModalOpen(false);
        } catch (error) {
            console.error("Failed to delete schedule", error);
        }
    };

    const handleDeleteUserWeekStartDate = async (data: DeleteUserWeekStartDateData) => {
        try {
            await deleteUserWeekStartDate(currentSelection.userId ?? "", data);
            refetch();
        } catch (error) {
            console.error("Failed to delete week start date", error);
        }
    }

    return (
        <>
            <NavBar />
            <div class='mt-20 mb-10 w-100wv flex gap-4 justify-center'>
                <label for="user_id" class="text-2xl font-code my-auto">User ID: </label>
                <SelectUser setFn={(input: string) => setCurrentSelection("userId", input)} />

                <button class='bg-dark color-light border-light border-solid border-1px px-4 py-2 rounded text-lg
                hover:bg-light hover:text-dark hover:border-dark transition duration-100' onClick={() => setIsAddEntryModalOpen(true)}>Add entry</button>
            </div>

            <Show when={currentSelection.userId && !schedules.loading}>
                <For each={Object.entries(schedules() ?? {})}>
                {([start_of_week, week_data]) => (
                    <div class='mx-auto mb-30px w-45vw bg-offDark px-5 py-4 rounded font-norm'
                    onMouseEnter={() => !isUpdateWeekStartModalOpen() && setHoveredWeek(start_of_week)}
                    onMouseLeave={() => !isUpdateWeekStartModalOpen() && setHoveredWeek(null)}
                    >
                        <h1 class='mb-2 mt-0'><span class='underline underline-offset-5'>Week of: {fmtDate(start_of_week)}</span>
                            <span class='text-lg font-light ml-10px'>(Total Hours: {calculateTotalWeekHours(week_data)})</span>
                            <Show when={hoveredWeek() === start_of_week}>
                                <button class="ml-2 i-mdi:add-circle-outline w-7 h-7" onClick={() => {
                                    setCurrentSelection("weekStartDate", start_of_week);
                                    setIsAddEntryModalOpen(true);
                                }}></button>
                                <button class="i-mdi:edit-box-outline w-7 h-7" 
                                onClick={() => openUpdateWeekStartModal(start_of_week)}></button>
                                <button class="i-mdi:trash-can-outline w-7 h-7" onClick={() => handleDeleteUserWeekStartDate({weekStartDate: start_of_week})}></button>
                            </Show>
                        </h1>
                        <div>
                            <For each={Object.entries(week_data)}>
                            {([day_of_week, schedule_entries]) => (
                                <div class='ml-25px'>
                                    <h2 class='font-medium my-0'>{itd(Number(day_of_week))}</h2>
                                    <div class='flex gap-10 overflow-x-scroll border-solid border-light border-1px rounded px-5 py-5 mb-5'>
                                        <For each={schedule_entries}>
                                        {(entry) => (
                                            <div class='flex-shrink-0 '>
                                                <TimeSlot openModal={() => setIsTimeSlotModalOpen(true)} getStateFn={() => entry}
                                                updateFn={handleTimeSlotEdit}/>
                                            </div>
                                        )}
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
                id: currentSelection.entryId,
                clockIn: currentSelection.clockIn,
                clockOut: currentSelection.clockOut
            })}
            handleUpdate={(data: UpdateScheduleData) => handleUpdateExistingSchedule(data)}
            handleDelete={(data: DeleteScheduleData) => handleDeleteExistingSchedule(data)}/>

            <AddEntryModal isModalOpen={isAddEntryModalOpen} closeModal={() => setIsAddEntryModalOpen(false)} 
            getStateFn={() => currentSelection}
            targetUser={currentSelection.userId ?? ""}
            handleAdd={(data: NewScheduleData, userId: string) => handleAddNewSchedule(data, userId)}/>

            <UpdateWeekStartModal isModalOpen={isUpdateWeekStartModalOpen} closeModal={() => setIsUpdateWeekStartModalOpen(false)} 
            getStateFn={() => (hoveredWeek() || "2024-01-01")}
            handleUpdateWeekStart={(data) => handleUpdateUserWeekStart(data)} />

        </>
    );
};

export default Admin;
