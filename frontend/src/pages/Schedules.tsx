import { For, Match, Show, Switch, createResource, createSignal, onMount, type Component } from 'solid-js';
import { Spinner, SpinnerType } from 'solid-spinner';
import Modal from '@lutaok/solid-modal';
import { itd, mtr } from '../utils/conv';
import { fetchUserSchedules } from '../utils/api';
import { NavBar } from '../components/NavBar';

let inputBuf: string = "";

const Schedules: Component = () => {
    const [id, setId] = createSignal<string>();
    const [fetchData] = createResource(id, fetchUserSchedules);

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
            <NavBar />
            <div class='nm flex flex-col w-30vw mx-auto mt-20vh p-3rem flex-col items-center justify-center'>
                <input ref={setInputEl} autofocus type="text" name="id" class='py-2 px-4 text-size-1.5rem rounded bg-offDark text-light' 
                placeholder='Enter ID' onKeyPress={(e) => e.key === 'Enter' && findUser()}/>
                <button type="submit" class="bg-offDark text-primary font-semibold mt-4 py-3 px-5 text-size-1.5rem rounded hover:bg-opacity-75"
                onClick={findUser}>Find</button>
            </div>

            <Show when={fetchData.loading}>
                <div class='flex align-center justify-center'>
                    <Spinner type={SpinnerType.tailSpin} color="white" />
                </div>
            </Show>
            <Switch>
                <Match when={fetchData.error}>
                    <Modal isOpen={fetchData.error} closeOnOutsideClick onCloseRequest={() => {}}>
                        <p class='font-code'>Invalid ID</p>
                    </Modal>
                </Match>

                <Match when={fetchData()}>
                    <div class="nm w-30vw mx-auto my-12 pb-8 flex flex-col items-center font-code">
                        <h1 class="text-3xl mt-8 mb-1rem text-center">Schedules for {id()}</h1>
                        <For each={Object.entries(fetchData() ?? {})}>
                            {([week_start_date, schedules]) => (
                             <div class='nm w-70% bg-slightDark px-5 py-2 mb-8 rounded-lg shadow-md'>
                                <h2 class='font-norm text-2xl text-center mb-2'>Week of {week_start_date}</h2>
                                <hr class='border-primary border-2 w-80% border-solid rd-lg mb-4'/>
                                <For each={Object.entries(schedules as any)}>
                                    {([day, data]) => (
                                        <div class='mb-4 text-center font-norm'>
                                            <h3 class='text-xl mb-1'>{itd(Number(day))}</h3>
                                            <For each={data as any}>
                                                {({ClockIn, ClockOut}) => (
                                                    <p class='mt-0 mb-1'>{`${mtr(ClockIn)} - ${mtr(ClockOut)}`}</p>
                                                )}
                                            </For>
                                        </div>
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

