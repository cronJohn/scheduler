import Modal from "@lutaok/solid-modal";
import { Component, createEffect } from "solid-js";
import { fmtMT } from '../../utils/conv';
import { TimeEntry } from "../../utils/types";
import { createStore } from "solid-js/store";
import { UpdateScheduleData } from "../../utils/api";

export const EditTimeSlotModal: Component<{
    isModalOpen: () => boolean;
    closeModal: () => void;
    getStateFn: () => TimeEntry;
    handleUpdate: (data: UpdateScheduleData) => void;
    handleDelete: (entryId: number) => void;
}> = (props) => {
    const [state, setState] = createStore<TimeEntry>({
        id: props.getStateFn().id,
        day: props.getStateFn().day,
        clockIn: props.getStateFn().clockIn,
        clockOut: props.getStateFn().clockOut,
    });

    createEffect(() => {
        setState({
            id: props.getStateFn().id,
            day: props.getStateFn().day,
            clockIn: props.getStateFn().clockIn,
            clockOut: props.getStateFn().clockOut,
        });
    });

    return (
        <Modal
            isOpen={props.isModalOpen()}
            onCloseRequest={props.closeModal}
            closeOnOutsideClick
            overlayStyle={{ "background-color": 'rgba(14, 14, 14, 0.7)' }}
        >
            <h2 class='font-norm font-medium text-3xl text-light text-center'>Edit Time Slot</h2>
            <div class='flex flex-col font-norm text-2xl text-light mb-4'>
                {/* Day Input */}
                <div class='flex justify-between mb-4'>
                    <label for='day' class='text-center my-auto font-code'>Day:</label>
                    <input
                        id='day'
                        type="date"
                        value={state.day}
                        onChange={(e) => setState("day", e.currentTarget.value)}
                        class='bg-gray-500/20 ml-2 py-1.5 px-1 b-2 b-solid b-primary rounded text-white text-2xl iw'
                    />
                </div>
                {/* Clock In Time Input */}
                <div class='flex justify-between mb-4'>
                    <label for='start' class='text-center my-auto font-code'>Start:</label>
                    <input
                        id='start'
                        type="time"
                        value={fmtMT(parseInt(state.clockIn))}
                        onChange={(e) => setState("clockIn", e.currentTarget.value)}
                        class='bg-gray-500/20 ml-2 py-1.5 px-1 b-2 b-solid b-primary rounded text-white text-2xl iw'
                    />
                </div>
                {/* Clock Out Time Input */}
                <div class='flex justify-between mb-4'>
                    <label for='end' class='text-center my-auto font-code'>End:</label>
                    <input
                        id='end'
                        type="time"
                        value={fmtMT(parseInt(state.clockOut))}
                        onChange={(e) => setState("clockOut", e.currentTarget.value)}
                        class='bg-gray-500/20 ml-2 py-1.5 px-1 b-2 b-solid b-primary rounded text-white text-2xl iw'
                    />
                </div>
            </div>

            <div class="flex mt-8 gap-4 text-dark justify-center pb-4">
                <button
                    class="bg-blue text-lg text-dark font-code rounded px-4 py-2"
                    onClick={() => props.handleUpdate({ entryId: state.id, day: state.day, clockIn: state.clockIn, clockOut: state.clockOut })}
                >
                    Update
                </button>
                <button
                    class="bg-red text-lg text-dark font-code rounded px-4 py-2"
                    onClick={() => props.handleDelete(state.id)}
                >
                    Delete
                </button>
            </div>
        </Modal>
    );
};

