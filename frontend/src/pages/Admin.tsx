import { For, Show, createResource, createSignal, type Component } from 'solid-js';
import { fetchUsers, fetchSchedules, updateSchedule, deleteSchedule } from '../utils/api';
import { itd, fmtMT } from '../utils/conv';
import { DaySchedule, ScheduleRequest } from '../utils/types';
import Modal from '@lutaok/solid-modal';
import { TimeSlot } from '../components/TimeSlot';
import { createStore, produce } from 'solid-js/store';

const Admin: Component = () => {
    const [isModalOpen, setIsModalOpen] = createSignal<boolean>(false);
    const [users] = createResource(fetchUsers);

    const [currentSelectData, setCurrentSelectData] = createStore<ScheduleRequest>();
    const [schedules, { refetch }] = createResource(() => currentSelectData.user_id, fetchSchedules);

    const openModal = () => {setIsModalOpen(true)};
    const closeModal = () => {setIsModalOpen(false)};

    const calculateTotalWeekHours = (data: DaySchedule): number => {
        let totalHours = 0;
        const MS_PER_HOUR = 1000 * 60 * 60;

        for (const daySchedule of Object.values(data)) {
            for (const entry of Object.values(daySchedule)) {
                const [inHours, inMinutes] = entry.ClockIn.split(":")
                const [outHours, outMinutes] = entry.ClockOut.split(":")

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
                <label for="user_id" class="text-size-1.5rem font-code">User ID: </label>
                <input
                id="user_id"
                type="text"
                list="users"
                onChange={(e) => setCurrentSelectData("user_id", e.currentTarget.value)}
                onKeyPress={(e) => e.key === 'Enter' && setCurrentSelectData("user_id", e.currentTarget.value)}
                class="py-2 px-4 border-2 border-solid border-primary text-size-1.5rem rounded bg-offDark text-light"
                placeholder="Enter ID"
                autofocus
                />

                <datalist id="users">
                    <For each={users()}>
                    {(user) => (
                        <option value={user.id} />
                    )}
                    </For>
                </datalist>
            </div>

            <Show when={currentSelectData.user_id}>
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
                                                onEditFn={handleTimeSlotEdit}/>
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

            {/* Edit time slot */}
            <Modal isOpen={isModalOpen()} onCloseRequest={closeModal} closeOnOutsideClick overlayStyle={{ "background-color": 'rgba(14, 14, 14, 0.7)' }}>
                <h2 class='font-norm font-medium text-2xl text-light text-center'>Edit Time Slot</h2>
                <div class='flex font-code text-lg justify-center text-light mb-4'>
                    <label for='start' class='text-center my-auto'>Start:</label>
                    <input id='start' type="time" value={fmtMT(parseInt(currentSelectData.clock_in || "12"))} 
                    onChange={(e) => setCurrentSelectData('clock_in', e.currentTarget.value)}
                    class='bg-gray-500/20 ml-2 py-1.5 px-1 rounded font-code text-light text-sm'/>
                </div>
                <div class='flex font-code text-lg justify-center text-light'>
                    <label for='end' class='my-auto'>End:</label>
                    <input id='end' type="time" value={fmtMT(parseInt(currentSelectData.clock_out || "12"))} 
                    onChange={(e) => setCurrentSelectData('clock_out', e.currentTarget.value)}
                    class='bg-gray-500/20 ml-2 py-1.5 px-1 rounded font-code text-light text-sm'/>
                </div>

                <div class="flex mt-8 gap-4 justify-center pb-4">
                    <button class="bg-blue text-sm font-code rounded px-4 py-2" onClick={handleUpdate}>Update</button>
                    <button class="bg-red text-sm font-code rounded px-4 py-2" onClick={handleDelete}>Delete</button>
                </div>
            </Modal>

        </>
    );
};

export default Admin;
