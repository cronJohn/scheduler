import { For, Show, createResource, createSignal, onMount, type Component } from 'solid-js';
import { fetchUserSchedules, updateExistingSchedule, deleteExistingSchedule, createNewSchedule, NewScheduleData, UpdateScheduleData, DeleteScheduleData } from '../utils/api';
import { fmtDate, itd } from '../utils/conv';
import { TimeSlot } from '../components/TimeSlot';
import { createStore, produce } from 'solid-js/store';
import { EditTimeSlotModal } from '../components/modals/EditTimeSlotModal';
import { SelectUser } from '../components/SelectUser';
import { AddEntryModal } from '../components/modals/AddEntryModal';
import { ActiveState, DaySchedule, TimeEntry } from '../utils/types';
import { getDateISO, groupSchedulesByWeek } from '../utils/helper';
import { NavBar } from '../components/NavBar';
import { useNavigate } from '@solidjs/router';

const Admin: Component = () => {
    const navigate = useNavigate();

    onMount(async () => {
        const resp = await fetch(`${import.meta.env.VITE_SERV}/api/checkauth`);
        if (!resp.ok) {
            navigate('/login');
        }
    })

    const [isTimeSlotModalOpen, setIsTimeSlotModalOpen] = createSignal<boolean>(false);
    const [isAddEntryModalOpen, setIsAddEntryModalOpen] = createSignal<boolean>(false);

    const [currentSelection, setCurrentSelection] = createStore<ActiveState>({
        userId: null,
        entryId: 0,
        day: getDateISO(),
        clockIn: "11:00",
        clockOut: "12:00",
    });

    const [schedules, { refetch }] = createResource(() => currentSelection.userId, fetchUserSchedules);

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

    const handleTimeSlotEdit = (data: TimeEntry) => {
        setCurrentSelection(
            produce((state) => {
                state.entryId = data.id;
                state.day = data.day;
                state.clockIn = data.clockIn;
                state.clockOut = data.clockOut;
            })
        );
    };

    const handleAddNewSchedule = async (data: NewScheduleData, userId: string) => {
        try {
            if (!currentSelection) return;
            await createNewSchedule(userId, data, navigate);
            refetch();
            setIsAddEntryModalOpen(false);
        } catch (error) {
            console.error("Failed to update schedule", error);
        }
    };

    const handleUpdateExistingSchedule = async (data: UpdateScheduleData) => {
        try {
            if (!currentSelection) return;
            await updateExistingSchedule(data, navigate);
            refetch();
            setIsTimeSlotModalOpen(false);
        } catch (error) {
            console.error("Failed to update schedule", error);
        }
    };

    const handleDeleteExistingSchedule = async (data: DeleteScheduleData) => {
        try {
            if (!currentSelection) return;
            await deleteExistingSchedule(data, navigate);
            refetch();
            setIsTimeSlotModalOpen(false);
        } catch (error) {
            console.error("Failed to delete schedule", error);
        }
    };

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
                <For each={Object.entries(groupSchedulesByWeek(schedules() || []))}>
                {([weekStartDate, weekEntries]) => (
                    <div class='mx-auto mb-30px min-w-650px w-50vw bg-offDark px-5 py-4 rounded font-norm'>
                        <h1 class='mb-2 mt-0'><span class='underline underline-offset-5'>Week of: {fmtDate(weekStartDate)}</span>
                            <span class='text-lg font-light ml-10px'>(Total Hours: {calculateTotalWeekHours(weekEntries)})</span>
                        </h1>
                        <div>
                            <For each={Object.entries(weekEntries)}>
                            {([dayOfWeek, dayEntries]) => (
                                <div class='ml-25px'>
                                    <h2 class='font-medium my-0'>{itd(Number(dayOfWeek))}</h2>
                                    <div class='flex gap-10 overflow-x-scroll border-solid border-light border-1px rounded px-5 py-5 mb-5'>
                                        <For each={dayEntries}>
                                        {(entry) => (
                                            <div class='flex-shrink-0'>
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
                day: currentSelection.day,
                clockIn: currentSelection.clockIn,
                clockOut: currentSelection.clockOut
            })}
            handleUpdate={(data: UpdateScheduleData) => handleUpdateExistingSchedule(data)}
            handleDelete={(data: DeleteScheduleData) => handleDeleteExistingSchedule(data)}/>

            <AddEntryModal isModalOpen={isAddEntryModalOpen} closeModal={() => setIsAddEntryModalOpen(false)} 
            getStateFn={() => currentSelection}
            targetUser={currentSelection.userId ?? ""}
            handleAdd={(data: NewScheduleData, userId: string) => handleAddNewSchedule(data, userId)}/>
        </>
    );
};

export default Admin;

