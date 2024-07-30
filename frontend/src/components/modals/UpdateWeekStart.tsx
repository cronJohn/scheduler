import Modal from "@lutaok/solid-modal";
import { Component, createEffect, createSignal } from "solid-js";

export const UpdateWeekStart: Component<{
    isModalOpen: () => boolean;
    closeModal: () => void;
    previousWeekStart: string;
    handleUpdateWeekStart: (input: string) => void;
}> = (props) => {
    const [weekStart, setWeekStart] = createSignal(props.previousWeekStart);
    createEffect(() => {
        setWeekStart(props.previousWeekStart);
    })
    return <Modal isOpen={props.isModalOpen()} onCloseRequest={props.closeModal} closeOnOutsideClick overlayStyle={{ "background-color": 'rgba(14, 14, 14, 0.7)' }}>
        <h2 class='font-norm font-bold text-2xl text-light text-center'>Update Week Start</h2>
        <section class="flex flex-col justify-center items-center gap-5">
            <input
                id="week_start_date"
                type="date"
                value={weekStart()}
                onInput={(e) => setWeekStart(e.currentTarget.value)}
                class="py-2 px-4 border-2 border-solid border-primary rounded bg-offDark text-2xl text-white"
            />
            <button class="bg-blue text-lg font-code rounded px-4 py-2" onClick={() => props.handleUpdateWeekStart(weekStart())}>Update</button>
        </section>
    </Modal>
}

