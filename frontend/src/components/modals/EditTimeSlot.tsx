import Modal from "@lutaok/solid-modal";
import { Component } from "solid-js";
import { SetStoreFunction } from "solid-js/store";
import { fmtMT } from '../../utils/conv';
import { ScheduleRequest } from "../../utils/types";

export const EditTimeSlot: Component<{
    isModalOpen: () => boolean;
    closeModal: () => void;
    handleUpdate: () => void;
    handleDelete: () => void;
    setFn: SetStoreFunction<any>
    getFn: () => ScheduleRequest
}> = (props) => {
    return <Modal isOpen={props.isModalOpen()} onCloseRequest={props.closeModal} closeOnOutsideClick overlayStyle={{ "background-color": 'rgba(14, 14, 14, 0.7)' }}>
        <h2 class='font-norm font-medium text-2xl text-light text-center'>Edit Time Slot</h2>
        <div class='flex font-code text-lg justify-center text-light mb-4'>
            <label for='start' class='text-center my-auto'>Start:</label>
            <input id='start' type="time" value={fmtMT(parseInt(props.getFn().clock_in || "12"))} 
            onChange={(e) => props.setFn('clock_in', e.currentTarget.value)}
            class='bg-gray-500/20 ml-2 py-1.5 px-1 rounded font-code text-light text-sm'/>
        </div>
        <div class='flex font-code text-lg justify-center text-light'>
            <label for='end' class='my-auto'>End:</label>
            <input id='end' type="time" value={fmtMT(parseInt(props.getFn().clock_out || "12"))} 
            onChange={(e) => props.setFn('clock_out', e.currentTarget.value)}
            class='bg-gray-500/20 ml-2 py-1.5 px-1 rounded font-code text-light text-sm'/>
        </div>

        <div class="flex mt-8 gap-4 justify-center pb-4">
            <button class="bg-blue text-sm font-code rounded px-4 py-2" onClick={props.handleUpdate}>Update</button>
            <button class="bg-red text-sm font-code rounded px-4 py-2" onClick={props.handleDelete}>Delete</button>
        </div>
    </Modal>
}
