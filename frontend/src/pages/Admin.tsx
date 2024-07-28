import { For, Show, createResource, createSignal, type Component } from 'solid-js';
import { fetchUsers, fetchSchedules, updateSchedule, deleteSchedule } from '../utils/api';
import { itd } from '../utils/conv';
import { DaySchedule, ScheduleRequest, UserResponse } from '../utils/types';
import { TimeSlot } from '../components/TimeSlot';
import { createStore, produce } from 'solid-js/store';
import { EditTimeSlot } from '../components/modals/EditTimeSlot';
import { SelectUser } from '../components/SelectUser';

const Admin: Component = () => {
    const [isModalOpen, setIsModalOpen] = createSignal<boolean>(false);
    const [users] = createResource<UserResponse[]>(fetchUsers);

    const [currentSelectData, setCurrentSelectData] = createStore<ScheduleRequest>();
    const [schedules, { refetch }] = createResource(() => currentSelectData.user_id, fetchSchedules);

    const openModal = () => {setIsModalOpen(true)};
    const closeModal = () => {setIsModalOpen(false)};

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

    const handleUpdate = async () => {
        try {
            if (!currentSelectData) return;
            await updateSchedule(currentSelectData);
            refetch();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to update schedule", error);
        }
    };

    const handleDelete = async () => {
        try {
            if (!currentSelectData) return;
            await deleteSchedule(currentSelectData);
            refetch();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to delete schedule", error);
        }
    };

    return (
        <>
            <div class='mt-20 mb-10 w-100wv flex gap-4 justify-center'>
                <SelectUser setFn={setCurrentSelectData} getFn={users} />
            </div>

            <Show when={currentSelectData.user_id && !schedules.loading}>
                <For each={Object.entries(schedules() ?? {})}>
                {([start_of_week, week_data]) => (
                    <div class='mx-auto mb-30px w-50vw bg-offDark px-5 py-4 rounded font-norm'>
                        <h1 class='mb-2 mt-0'><span class='underline underline-offset-5'>Week of: {start_of_week}</span>
                            <span class='text-lg font-light ml-10px'>(Total Hours: {calculateTotalWeekHours(week_data)})</span>
                        </h1>
                        <div>
                            <For each={Object.entries(week_data)}>
                            {([day_of_week, schedule_entries]) => (
                                <div class='ml-25px'>
                                    <h2 class='font-medium my-0'>{itd(Number(day_of_week))}</h2>
                                    <div class='flex gap-10 border-solid border-light border-1px rounded px-5 py-5 mb-5'>
                                        <For each={schedule_entries}>
                                        {(entry) => (
                                            <>
                                                <TimeSlot id={entry.ID} clockIn={entry.ClockIn} clockOut={entry.ClockOut} openModal={openModal}
                                                editFn={handleTimeSlotEdit}/>
                                            </>
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

            <EditTimeSlot isModalOpen={isModalOpen} closeModal={closeModal} handleUpdate={handleUpdate} handleDelete={handleDelete} 
            setFn={setCurrentSelectData} getFn={() => currentSelectData}/>

        </>
    );
};

export default Admin;
