import { For, Show, createEffect, createResource, createSignal, onMount, type Component } from 'solid-js';
import { Spinner, SpinnerType } from 'solid-spinner';
import { itd, mtr, fmtDate } from '../utils/conv';
import { fetchUserSchedules } from '../utils/api';
import { NavBar } from '../components/NavBar';
import { displayCurrentOrPrevWeek, getColorFromString, groupSchedulesByWeek } from '../utils/helper';

var inputRef: HTMLInputElement;

const Schedules: Component = () => {
    const [id, setId] = createSignal<string>();
    const [schedules] = createResource(id, fetchUserSchedules);

    // order/priority
    // query string -> local storage -> default
    onMount(() => {
        const params = new URLSearchParams(location.search);
        const idParam = params.get('id');
        if (idParam) {
            setId(idParam);
            return;
        }
        const storedId = localStorage.getItem('id');
        if (storedId) {
            setId(storedId);
        }
    });

    createEffect(() => {
        localStorage.setItem('id', id() || '');
    });

    return (
        <div>
            <NavBar />
            <div class='nm flex flex-col min-w-250px max-w-400px w-30vw mx-auto mt-20vh p-8 flex-col items-center justify-center'>
                <h1 class="font-norm m-0 mb-2 text-light text-2xl">Enter your ID</h1>
                <input
                type="text"
                onChange={(e) => setId(e.currentTarget.value)}
                onKeyPress={(e) => e.key === 'Enter' && setId(e.currentTarget.value)}
                class="py-2 px-4 border-2 border-solid border-primary text-2xl rounded bg-offDark text-light disabled-text-gray-500"
                placeholder={"Enter ID"}
                ref={inputRef}
                autofocus
                />
                <Show when={id() && id() !== ''}>
                    <div class="flex items-center gap-3 h-50px mt-2">
                        <h2 class="font-norm text-sm m-0">Selected user: {id()}</h2>
                        <button class="text-sm h-70% bt px-1 m-0 rounded bg-dark bb-primary" onClick={() => {localStorage.removeItem('id'); setId(''); inputRef.value = ""}}>Clear</button>
                    </div>
                </Show>
            </div>

            <Show when={schedules.loading}>
                <div class='flex align-center justify-center'>
                    <Spinner type={SpinnerType.tailSpin} color="white" />
                </div>
            </Show>
            <div class="nm min-w-100px max-w-700px mx-auto my-12 flex flex-col items-center font-code">
                <Show when={id() && schedules()}>
                    <Show when={(schedules() || []).length > 0} fallback={<h1 class="text-3xl text-center">No schedules found</h1>}>
                        <h1 class="text-3xl mt-8 mb-1rem rt text-center">Schedules for {id()}</h1>
                        {/* Schedules */ }
                        <For each={Object.entries(groupSchedulesByWeek(schedules() || []))}>
                            {([weekStartDate, schedules]) => (
                                <div class="nm w-70% px-8 py-3 mb-8 rounded-lg"> {/* Week schedules */}
                                    <h2 class="font-norm font-light text-center rt">
                                    <span class="font-bold rt">{displayCurrentOrPrevWeek(weekStartDate)}: </span>
                                    {fmtDate(weekStartDate)}</h2>
                                    <For each={Object.entries(schedules)}>
                                    {([dayOfWeek, timeEntries]) => (
                                        <div> {/* Day of week */}
                                            <h3 class='text-lg font-norm font-light mb-1' title={fmtDate(timeEntries[0].day)}>{itd(Number(dayOfWeek))}</h3>
                                            <div class='mb-4 flex lt-otherSm:flex-col lt-maxSm:gap-0 gap-5 justify-center text-center font-norm b-solid b-light b-1px rd-lg'>
                                                {/* Day entries */}
                                                <For each={timeEntries}>
                                                {({ role, clockIn, clockOut }) => ( 
                                                    <div class='flex flex-col m-2'> {/* Time entry */}
                                                        <p class='my-0 '>{`${mtr(clockIn)} - ${mtr(clockOut)}`}</p>
                                                        <p class='my-0 text-dark rounded font-500' style={{'background-color': getColorFromString(role),
                                                        'text-transform': "uppercase"}}>{role}</p>
                                                    </div>
                                                )}
                                                </For>
                                            </div>
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

