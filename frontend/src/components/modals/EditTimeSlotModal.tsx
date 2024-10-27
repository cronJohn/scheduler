import Modal from "@lutaok/solid-modal";
import { Component, createEffect } from "solid-js";
import { fmtMT } from '../../utils/conv';
import { createStore } from "solid-js/store";
import { UpdateScheduleRequestData } from "../../utils/api";
import { Schedule } from "../../utils/types";
import { SelectRole } from "../SelectRole";

export const EditTimeSlotModal: Component<{
    isModalOpen: () => boolean;
    closeModal: () => void;
    getStateFn: () => Schedule;
    handleUpdate: (data: UpdateScheduleRequestData) => void;
    handleDelete: (entryId: number) => void;
}> = (props) => {
    const [state, setState] = createStore<Schedule>({
        scheduleId: props.getStateFn().scheduleId,
        userId: props.getStateFn().userId,
        role: props.getStateFn().role,
        day: props.getStateFn().day,
        clockIn: props.getStateFn().clockIn,
        clockOut: props.getStateFn().clockOut,
    });

    createEffect(() => {
        setState({
            scheduleId: props.getStateFn().scheduleId,
            userId: props.getStateFn().userId,
            role: props.getStateFn().role,
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
            <div class='flex flex-col font-norm text-2xl text-light mb-4 w-300px'>
                {/* Day Input */}
                <div class='flex justify-between mb-4'>
                    <label for='day' class='text-center my-auto font-code'>Day</label>
                    <input
                        id='day'
                        type="date"
                        value={state.day}
                        onChange={(e) => setState("day", e.currentTarget.value)}
                        class='bg-gray-500/20 ml-2 h-56px py-1.5 px-1 b-2 b-solid b-primary rounded text-white text-2xl iw'
                    />
                </div>
                {/* Clock In Time Input */}
                <div class='flex justify-between mb-4'>
                    <label for='start' class='text-center my-auto font-code'>Start</label>
                    <input
                        id='start'
                        type="time"
                        value={fmtMT(parseInt(state.clockIn))}
                        onChange={(e) => setState("clockIn", e.currentTarget.value)}
                        class='bg-gray-500/20 ml-2 h-56px py-1.5 px-1 b-2 b-solid b-primary rounded text-white text-2xl iw'
                    />
                </div>
                {/* Clock Out Time Input */}
                <div class='flex justify-between mb-4'>
                    <label for='end' class='text-center my-auto font-code'>End</label>
                    <input
                        id='end'
                        type="time"
                        value={fmtMT(parseInt(state.clockOut))}
                        onChange={(e) => setState("clockOut", e.currentTarget.value)}
                        class='bg-gray-500/20 ml-2 py-1.5 h-56px px-1 b-2 b-solid b-primary rounded text-white text-2xl iw'
                    />
                </div>

                {/* Select role Input */}
                <div class='flex justify-between items-center mb-4'>
                    <label for="role-select" class="font-code ">Role</label>
                    <SelectRole defaultVal={state.role} setFn={(value: string) => setState("role", value)} />
                </div>
            </div>

            <div class="flex mt-8 gap-4 text-dark justify-center pb-4">
                <button
                    class="text-lg text-light font-code rounded px-4 py-2 bt bb-primary bg-dark"
                    onClick={() => props.handleUpdate(state)}
                >
                    Update
                </button>
                <button
                    class="text-lg text-light font-code rounded px-4 py-2 bt bb-primary bg-dark"
                    onClick={() => props.handleDelete(state.scheduleId)}
                >
                    Delete
                </button>
            </div>
        </Modal>
    );
};

