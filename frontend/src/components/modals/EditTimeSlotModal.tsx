import Modal from "@lutaok/solid-modal";
import { Component, createEffect } from "solid-js";
import { fmtMT } from '../../utils/conv';
import { TimeEntry } from "../../utils/types";
import { createStore } from "solid-js/store";
import { DeleteScheduleData, UpdateScheduleData } from "../../utils/api";

export const EditTimeSlotModal: Component<{
    isModalOpen: () => boolean;
    closeModal: () => void;
    getStateFn: () => TimeEntry
    handleUpdate: (data: UpdateScheduleData) => void;
    handleDelete: (data: DeleteScheduleData) => void;
}> = (props) => {
    const [state, setState] = createStore<TimeEntry>({
        id: props.getStateFn().id,
        clockIn: props.getStateFn().clockIn,
        clockOut: props.getStateFn().clockOut,
    })

    createEffect(() => {
        setState({
            id: props.getStateFn().id,
            clockIn: props.getStateFn().clockIn,
            clockOut: props.getStateFn().clockOut,
        });
    })

    return <Modal isOpen={props.isModalOpen()} onCloseRequest={props.closeModal} closeOnOutsideClick overlayStyle={{ "background-color": 'rgba(14, 14, 14, 0.7)' }}>
        <h2 class='font-norm font-medium text-2xl text-light text-center'>Edit Time Slot</h2>
        <div class='flex font-code text-lg justify-center text-light mb-4'>
            <label for='start' class='text-center my-auto'>Start:</label>
            <input id='start' type="time" value={fmtMT(parseInt(state.clockIn))} 
            onChange={(e) => setState("clockIn", e.currentTarget.value)}
            class='bg-gray-500/20 ml-2 py-1.5 px-1 rounded font-code text-light text-sm'/>
        </div>
        <div class='flex font-code text-lg justify-center text-light'>
            <label for='end' class='my-auto'>End:</label>
            <input id='end' type="time" value={fmtMT(parseInt(state.clockOut))} 
            onChange={(e) => setState("clockOut", e.currentTarget.value)}
            class='bg-gray-500/20 ml-2 py-1.5 px-1 rounded font-code text-light text-sm'/>
        </div>

        <div class="flex mt-8 gap-4 justify-center pb-4">
            <button class="bg-blue text-sm font-code rounded px-4 py-2" 
            onClick={() => props.handleUpdate({entryId: state.id, clockIn: state.clockIn, clockOut: state.clockOut})}>Update</button>
            <button class="bg-red text-sm font-code rounded px-4 py-2" onClick={() => props.handleDelete({entryId: state.id})}>Delete</button>
        </div>
    </Modal>
}
