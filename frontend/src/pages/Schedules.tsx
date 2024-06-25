import { For, Match, Switch, createResource, createSignal, onMount, type Component } from 'solid-js';
import { Spinner, SpinnerType } from 'solid-spinner';
import Modal from 'solid-dialog';

// convert day index to day name
// itd: integer to day
const itd = (dayIndex: number) => {
  return ["Sunday", "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dayIndex] || '';
}

const fetchSchedules = async (id: string) => {
  const response = await fetch(`${import.meta.env.VITE_SERV}/api/users/${id}/schedule`);
  return response.json();
}

let inputBuf: string = "";

const Schedules: Component = () => {
    const [id, setId] = createSignal<string>();
    const [fetchData] = createResource(id, fetchSchedules);

    const [inputEl, setInputEl] = createSignal<HTMLInputElement>();

    const findUser = () => {
        if (inputEl()?.value === inputBuf) {
            throw new Error('No change detected');
        }
        setId(inputEl()?.value || '');
        inputBuf = inputEl()?.value || '';
    }

    onMount(() => {
        const params = new URLSearchParams(location.search);
        const idParam = params.get('id');
        if (idParam) {
            setId(idParam);
        }
    });

    return (
        <div>
            <div class='nm flex flex-col w-30vw mx-auto mt-200px p-3rem flex-col items-center justify-center'>
                <input ref={setInputEl} type="text" name="id" class='py-2 px-4 text-size-1.5rem rounded bg-offDark text-light' 
                placeholder='Enter ID' onKeyPress={(e) => e.key === 'Enter' && findUser()}/>
                <button type="submit" class="bg-offDark text-primary font-semibold mt-4 py-3 px-5 text-size-1.5rem rounded hover:bg-opacity-75"
                onClick={findUser}>Find</button>
            </div>

            <Switch>
                <Match when={fetchData.loading}>
                    <div class='flex align-center justify-center'>
                        <Spinner type={SpinnerType.tailSpin} color="white" />
                    </div>
                </Match>

                <Match when={fetchData.error}>
                    <Modal isShown={fetchData.error} closeModal={() => {}}>
                        <p class='font-code'>Invalid ID</p>
                    </Modal>
                </Match>

                <Match when={id()}>
                    <div class="nm w-30vw mx-auto my-12 pb-8 flex flex-col items-center font-code">
                        <h1 class="text-3xl mt-8 text-center">Schedules for {id()}</h1>
                        <For each={fetchData.latest}>
                            {(schedule) => (
                                <div class='bg-offDark w-80% py-2 px-4 mb-4 text-center rounded'>
                                    <h2>{itd(schedule.day_of_week)}</h2>
                                    <For each={schedule.times.split(',')}>
                                        {(time) => (
                                            <p>{time}</p>
                                        )}
                                    </For>
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

