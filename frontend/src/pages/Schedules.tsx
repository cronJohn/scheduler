import { For, Show, createResource, createSignal, onMount, type Component } from 'solid-js';
import { Spinner, SpinnerType } from 'solid-spinner';
import { itd, mtr, fmtDate } from '../utils/conv';
import { fetchUserSchedules } from '../utils/api';
import { NavBar } from '../components/NavBar';
import { groupSchedulesByWeek } from '../utils/helper';

const Schedules: Component = () => {
    const [id, setId] = createSignal<string>();
    const [schedules] = createResource(id, fetchUserSchedules);

    onMount(() => {
        const params = new URLSearchParams(location.search);
        const idParam = params.get('id');
        if (idParam) {
            setId(idParam);
        }
    });

    return (
        <div>
            <NavBar />
            <div class='nm flex flex-col min-w-300px max-w-400px w-30vw mx-auto mt-20vh p-3rem flex-col items-center justify-center'>
                <input
                type="text"
                onChange={(e) => setId(e.currentTarget.value)}
                onKeyPress={(e) => e.key === 'Enter' && setId(e.currentTarget.value)}
                class="py-2 px-4 border-2 border-solid border-primary text-2xl rounded bg-offDark text-light disabled-text-gray-500"
                placeholder={"Enter ID"}
                autofocus
                />
            </div>

            <Show when={schedules.loading}>
                <div class='flex align-center justify-center'>
                    <Spinner type={SpinnerType.tailSpin} color="white" />
                </div>
            </Show>
            <div class="nm min-w-400px w-40vw mx-auto my-12 flex flex-col items-center font-code">
                <Show when={id()}>
                    <Show when={(schedules() || []).length > 0} fallback={<h1 class="text-3xl text-center">No schedules found</h1>}>
                        <h1 class="text-3xl mt-8 mb-1rem text-center">Schedules for {id()}</h1>
                        <For each={Object.entries(groupSchedulesByWeek(schedules() || []))}>
                            {([weekStartDate, schedules]) => (
                                <div class='nm w-70% bg-slightDark px-5 py-2 mb-8 rounded-lg shadow-md'>
                                    <h2 class='font-norm text-2xl text-center mb-2'>Week of {fmtDate(weekStartDate)}</h2>
                                    <hr class='border-primary border-2 w-80% border-solid rd-lg mb-4' />
                                    <For each={Object.entries(schedules)}>
                                        {([dayOfWeek, timeEntries]) => (
                                            <div class='mb-4 text-center font-norm'>
                                                <h3 class='text-xl mb-1'>{itd(Number(dayOfWeek))}</h3>
                                                <For each={timeEntries}>
                                                    {({ clockIn, clockOut }) => (
                                                        <p class='mt-0 mb-1'>{`${mtr(clockIn)} - ${mtr(clockOut)}`}</p>
                                                    )}
                                                </For>
                                            </div>
                                        )}
                                    </For>
                                </div>
                            )}
                        </For>
                    </Show>
                </Show>
            </div>
        </div>
    );
};

export default Schedules;

