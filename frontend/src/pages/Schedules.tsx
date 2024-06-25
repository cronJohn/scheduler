import { For, Match, Show, Switch, createResource, createSignal, onMount, type Component } from 'solid-js';

// convert day index to day name
// integer to day
function itd(dayIndex: number) {
  return ["Sunday", "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dayIndex] || '';
}

// convert XX:XX to XX:XX AM/PM
// military to regular
function mtr(timeString: string) {
    const [hours, minutes] = timeString.split(':');
    const time = new Date(0, 0, 0, parseInt(hours), parseInt(minutes));
    const formattedTime = time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    return formattedTime;
};

const fetchSchedules = async (id: string) => {
  const response = await fetch(`${import.meta.env.VITE_SERV}/api/users/${id}/schedule`);
  return response.json();
}


const Schedules: Component = () => {
    const [id, setId] = createSignal<string>();
    const [fetchData] = createResource(id, fetchSchedules);

    const [inputEl, setInputEl] = createSignal<HTMLInputElement>();

    const findUser = () => {
        setId(inputEl()?.value || '');
    }

    onMount(() => {
        const params = new URLSearchParams(location.search);
        const idParam = params.get('id');
        if (idParam) {
            setId(idParam);
        }
    });

    return (
        <div class="w-screen h-screen flex flex-col items-center justify-center">
            <input ref={setInputEl} type="text" name="id" class='py-2 px-4 text-size-1.5rem rounded bg-offDark text-light' 
            placeholder='Enter ID'/>
            <button type="submit" class="bg-offDark text-primary font-semibold mt-4 py-3 px-5 text-size-1.5rem rounded hover:bg-opacity-75"
            onClick={findUser}>Find</button>

            <Show when={fetchData.loading}>
                <p>Loading...</p>
            </Show>
            <Switch>
                <Match when={fetchData.error}>
                    <span>Error: {fetchData.error}</span>
                </Match>
                <Match when={id()}>
                    <div class="nm w-30vw mt-8">
                        <For each={fetchData.latest}>
                            {(item) => (
                            <div class="bg-offDark flex flex-col align-center m-8 p-4 rounded">
                                <h2 class="text-xl font-code">{itd(item.day_of_week)}</h2>
                                <p class="font-code">{mtr(item.clock_in)} - {mtr(item.clock_out)}</p>
                            </div>
                            )}
                        </For>
                    </div>
                </Match>
            </Switch>
        </div>
    );
};

export default Schedules;

