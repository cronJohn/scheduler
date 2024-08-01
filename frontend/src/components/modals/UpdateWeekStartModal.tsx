import Modal from "@lutaok/solid-modal";
import { Component, createSignal } from "solid-js";
import { UpdateWeekStartData } from "../../utils/api";

export const UpdateWeekStartModal: Component<{
    isModalOpen: () => boolean;
    closeModal: () => void;
    getStateFn: () => string; // old week start
    handleUpdateWeekStart: (data: UpdateWeekStartData) => void;
}> = (props) => {
    const [newWeekStartDate, setNewWeekStartDate] = createSignal("");
    return <Modal isOpen={props.isModalOpen()} onCloseRequest={props.closeModal} closeOnOutsideClick overlayStyle={{ "background-color": 'rgba(14, 14, 14, 0.7)' }}>
        <h2 class='font-norm font-medium text-2xl text-light text-center'>Update Week Start</h2>
        <section class="flex flex-col justify-center items-center gap-5">
            <input
                id="week_start_date"
                type="date"
                value={newWeekStartDate() || props.getStateFn()}
                onInput={(e) => setNewWeekStartDate(e.currentTarget.value)}
                class="py-2 px-4 border-2 border-solid border-primary rounded bg-offDark text-2xl text-white"
            />
            <button class="bg-blue text-4 font-code rounded px-4 py-2" 
            onClick={() => props.handleUpdateWeekStart({oldWeekStartDate: props.getStateFn(), newWeekStartDate: newWeekStartDate()})}>Update</button>
        </section>
    </Modal>
}

