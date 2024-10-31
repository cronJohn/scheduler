import Modal from "@lutaok/solid-modal";
import { Component, Show, createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { SelectUser } from "../SelectUser";
import { CreateNewScheduleRequestData } from "../../utils/api";
import { SelectRole } from "../SelectRole";

export const AddEntryModal: Component<{
    isModalOpen: () => boolean;
    closeModal: () => void;
    getStateFn: () => CreateNewScheduleRequestData;
    targetUser: string;
    handleAdd: (data: CreateNewScheduleRequestData) => void;
}> = (props) => {
    const [state, setState] = createStore<CreateNewScheduleRequestData>({
        userId: props.getStateFn().userId,
        role: props.getStateFn().role,
        day: props.getStateFn().day,
        clockIn: props.getStateFn().clockIn,
        clockOut: props.getStateFn().clockOut
    });

    const [isSelectDisabled, setIsSelectDisabled] = createSignal(false);

    createEffect(() => {
        if (isSelectDisabled()) {
            setState("userId", props.targetUser);
        }

        if (props.getStateFn().userId === "") {
            setIsSelectDisabled(false);
        }
    });

    return (
        <Modal
            isOpen={props.isModalOpen()}
            onCloseRequest={props.closeModal}
            closeOnOutsideClick
            overlayStyle={{ "background-color": 'rgba(14, 14, 14, 0.7)' }}
        >
            <div class="w-360px ">
                <h2 class='font-norm font-medium text-3xl text-light text-center'>Add time entry</h2>
                <div class="flex flex-col justify-center items-center gap-4 text-2xl text-light color-light text-center">
                    {/* User ID Input */}
                    <section class="flex flex-col items-center sw">
                        <div class="flex items-center w-full">
                            <label for="user_id" class="text-2xl font-code">User ID </label>
                            <Show when={props.getStateFn().userId}>
                                <input 
                                    type="checkbox" 
                                    class="ml-8px font-code" 
                                    id="toggle" 
                                    onChange={() => setIsSelectDisabled(!isSelectDisabled())} 
                                    checked={isSelectDisabled()}
                                />
                                <label for="toggle" class="ml-2 font-code text-lg">Use Selection</label>
                            </Show>
                        </div>
                        <SelectUser
                            width="100%"
                            setFn={(input: string) => setState("userId", input)}
                            isDisabled={isSelectDisabled()}
                            placeholder={isSelectDisabled() ? state.userId : undefined}
                        />
                    </section>

                    {/* Day Input */}
                    <section class="flex justify-between items-center sw">
                        <label for="day" class="font-code ">Day</label>
                        <input
                            id="day"
                            type="date"
                            value={state.day}
                            onInput={(e) => setState("day", e.currentTarget.value)}
                            class="py-2 px-4 bb-primary rounded bg-offDark text-2xl text-white text-center iw"
                        />
                    </section>

                    {/* Clock In Time Input */}
                    <section class="flex justify-between items-center sw">
                        <label for="clock_in" class="font-code ">Clock In</label>
                        <input
                            id="clock_in"
                            type="time"
                            value={state.clockIn}
                            onInput={(e) => setState("clockIn", e.currentTarget.value)}
                            class="py-2 px-4 bb-primary rounded bg-offDark text-2xl text-white text-center iw"
                        />
                    </section>

                    {/* Clock Out Time Input */}
                    <section class="flex justify-between items-center sw">
                        <label for="clock_out" class="font-code ">Clock Out</label>
                        <input
                            id="clock_out"
                            type="time"
                            value={state.clockOut}
                            onInput={(e) => setState("clockOut", e.currentTarget.value)}
                            class="py-2 px-4 bb-primary rounded bg-offDark text-2xl text-white text-center iw"
                        />
                    </section>

                    {/* Select role input */}
                    <section class="flex justify-between items-center sw">
                        <label for="role-select" class="font-code ">Select role</label>
                        <SelectRole defaultVal={props.getStateFn().role} setFn={(value: string) => setState("role", value)} />
                    </section>
                    
                    <button
                        class="bb-primary text-5 bg-dark text-light font-code rounded mt-4 px-4 py-2 w-100px bt"
                        onClick={() => props.handleAdd(state)}
                    >
                        Add
                    </button>
                </div>
            </div>
        </Modal>
    );
};

