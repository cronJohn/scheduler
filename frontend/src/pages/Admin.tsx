import { For, Show, createEffect, createResource, createSignal, type Component } from 'solid-js';
import { fetchSchedules, updateExistingSchedule, deleteExistingSchedule, createNewSchedule, deleteUserWeekStartDate, updateUserWeekStartDate } from '../utils/api';
import { itd } from '../utils/conv';
import { DaySchedule, ScheduleRequest } from '../utils/types';
import { TimeSlot } from '../components/TimeSlot';
import { createStore, produce } from 'solid-js/store';
import { EditTimeSlot } from '../components/modals/EditTimeSlot';
import { SelectUser } from '../components/SelectUser';
import { AddEntry } from '../components/modals/AddEntry';
import { UpdateWeekStart } from '../components/modals/UpdateWeekStart';

const Admin: Component = () => {
    const [isTimeSlotModalOpen, setIsTimeSlotModalOpen] = createSignal<boolean>(false);
    const [isAddEntryModalOpen, setIsAddEntryModalOpen] = createSignal<boolean>(false);
    const [isUpdateWeekStartModalOpen, setIsUpdateWeekStartModalOpen] = createSignal<boolean>(false);
    const openUpdateWeekStartModal = (week_start_date: string) => {
        setIsUpdateWeekStartModalOpen(true);
        setHoveredWeek(week_start_date);
        setCurrentSelectData("old_week_start_date", week_start_date);
    }

    const [hoveredWeek, setHoveredWeek] = createSignal<string | null>(null);

    const [currentSelectData, setCurrentSelectData] = createStore<ScheduleRequest>();
    const [schedules, { refetch }] = createResource(() => currentSelectData.user_id, fetchSchedules);

    const calculateTotalWeekHours = (data: DaySchedule): number => {
        if (!data) return 0;

        let totalHours = 0;
        const MS_PER_HOUR = 1000 * 60 * 60;

        for (const daySchedule of Object.values(data)) {
            for (const entry of Object.values(daySchedule)) {
                const [inHours, inMinutes] = entry?.ClockIn.split(":")
                const [outHours, outMinutes] = entry?.ClockOut.split(":")

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

    const handleTimeSlotEdit = (id: number, clockIn: string, clockOut: string) => {
        setCurrentSelectData(
            produce((state) => {
                state.id = id;
                state.clock_in = clockIn;
                state.clock_out = clockOut;
            })
        );
    };

    const handleAddNewSchedule = async (input: ScheduleRequest) => {
        try {
            if (!currentSelectData) return;
            await createNewSchedule(input);
            refetch();
            setIsAddEntryModalOpen(false);
        } catch (error) {
            console.error("Failed to update schedule", error);
        }
    };

    const handleUpdateExistingSchedule = async () => {
        try {
            if (!currentSelectData) return;
            await updateExistingSchedule(currentSelectData);
            refetch();
            setIsTimeSlotModalOpen(false);
        } catch (error) {
            console.error("Failed to update schedule", error);
        }
    };

    const handleUpdateUserWeekStart = async (week_start_date: string) => {
        try {
            if (!currentSelectData) return;
            await updateUserWeekStartDate({
                user_id: currentSelectData.user_id,
                week_start_date,
                old_week_start_date: currentSelectData.old_week_start_date
            });
            refetch();
            setIsUpdateWeekStartModalOpen(false);
        } catch (error) {
            console.error("Failed to update week start date", error);
        }
    }

    const handleDeleteExistingSchedule = async () => {
        try {
            if (!currentSelectData) return;
            await deleteExistingSchedule(currentSelectData);
            refetch();
            setIsTimeSlotModalOpen(false);
        } catch (error) {
            console.error("Failed to delete schedule", error);
        }
    };

    const handleDeleteUserWeekStartDate = async () => {
        try {
            await deleteUserWeekStartDate({
                user_id: currentSelectData.user_id,
                week_start_date: hoveredWeek() ?? ""
            })
            refetch();
        } catch (error) {
            console.error("Failed to delete week start date", error);
        }
    }

    return (
        <>
            <div class='mt-20 mb-10 w-100wv flex gap-4 justify-center'>
                <label for="user_id" class="text-2xl font-code my-auto">User ID: </label>
                <SelectUser setFn={setCurrentSelectData} />

                <button class='bg-dark color-light border-light border-solid border-1px px-4 py-2 rounded text-lg
                hover:bg-light hover:text-dark hover:border-dark transition duration-100' onClick={() => setIsAddEntryModalOpen(true)}>Add entry</button>
            </div>

            <Show when={currentSelectData.user_id && !schedules.loading}>
                <For each={Object.entries(schedules() ?? {})}>
                {([start_of_week, week_data]) => (
                    <div class='mx-auto mb-30px w-50vw bg-offDark px-5 py-4 rounded font-norm' 
                    onMouseEnter={() => !isUpdateWeekStartModalOpen() && setHoveredWeek(start_of_week)}
                    onMouseLeave={() => !isUpdateWeekStartModalOpen() && setHoveredWeek(null)}
                    >
                        <h1 class='mb-2 mt-0'><span class='underline underline-offset-5'>Week of: {start_of_week}</span>
                            <span class='text-lg font-light ml-10px'>(Total Hours: {calculateTotalWeekHours(week_data)})</span>
                            <Show when={hoveredWeek() === start_of_week}>
                                <button class="ml-2 i-mdi:edit-box-outline w-7 h-7" 
                                onClick={() => openUpdateWeekStartModal(start_of_week)}></button>
                                <button class="i-mdi:trash-can w-7 h-7" onClick={handleDeleteUserWeekStartDate}></button>
                            </Show>
                        </h1>
                        <div>
                            <For each={Object.entries(week_data)}>
                            {([day_of_week, schedule_entries]) => (
                                <div class='ml-25px'>
                                    <h2 class='font-medium my-0'>{itd(Number(day_of_week))}</h2>
                                    <div class='flex gap-10 border-solid border-light border-1px rounded px-5 py-5 mb-5'>
                                        <For each={schedule_entries}>
                                        {(entry) => (
                                            <TimeSlot id={entry.ID} clockIn={entry.ClockIn} clockOut={entry.ClockOut} openModal={() => setIsTimeSlotModalOpen(true)}
                                            editFn={handleTimeSlotEdit}/>
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

            <EditTimeSlot isModalOpen={isTimeSlotModalOpen} closeModal={() => setIsTimeSlotModalOpen(false)} handleUpdate={handleUpdateExistingSchedule} handleDelete={handleDeleteExistingSchedule} 
            setFn={setCurrentSelectData} getFn={() => currentSelectData}/>

            <AddEntry isModalOpen={isAddEntryModalOpen} closeModal={() => setIsAddEntryModalOpen(false)} handleAdd={handleAddNewSchedule}
            defaultUser={currentSelectData.user_id}/>

            <UpdateWeekStart isModalOpen={isUpdateWeekStartModalOpen} closeModal={() => setIsUpdateWeekStartModalOpen(false)} 
            handleUpdateWeekStart={handleUpdateUserWeekStart} previousWeekStart={hoveredWeek() ?? ""} />

        </>
    );
};

export default Admin;
