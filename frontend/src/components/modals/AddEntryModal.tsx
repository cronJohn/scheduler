import Modal from "@lutaok/solid-modal";
import { Component, createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { SelectUser } from "../SelectUser";
import { NewScheduleData } from "../../utils/api";

export const AddEntryModal: Component<{
    isModalOpen: () => boolean;
    closeModal: () => void;
    getStateFn: () => NewScheduleData;
    targetUser: string;
    handleAdd: (data: NewScheduleData, userId: string) => void;
}> = (props) => {
    const [state, setState] = createStore<NewScheduleData>({
        day: props.getStateFn().day,
        clockIn: props.getStateFn().clockIn,
        clockOut: props.getStateFn().clockOut
    });

    const [currentUser, setCurrentUser] = createSignal<string>(props.targetUser);
    const [isSelectDisabled, setIsSelectDisabled] = createSignal(false);

    createEffect(() => {
        if (isSelectDisabled()) {
            setCurrentUser(props.targetUser);
        }
    });

    return (
        <Modal
            isOpen={props.isModalOpen()}
            onCloseRequest={props.closeModal}
            closeOnOutsideClick
            overlayStyle={{ "background-color": 'rgba(14, 14, 14, 0.7)' }}
        >
            <div class="w-25vw">
                <h2 class='font-norm font-medium text-3xl text-light text-center'>Add time entry</h2>
                <div class="flex flex-col justify-center items-center gap-4 text-2xl font-code text-light color-light text-center">
                    {/* User ID Input */}
                    <section class="flex flex-col items-center sw">
                        <div class="flex items-center w-full">
                            <label for="user_id" class="text-2xl font-code">User ID: </label>
                            <input 
                                type="checkbox" 
                                class="ml-8px " 
                                id="toggle" 
                                onChange={() => setIsSelectDisabled(!isSelectDisabled())} 
                                checked={isSelectDisabled()}
                            />
                            <label for="toggle" class="ml-2 text-lg">Use Selection</label>
                        </div>
                        <SelectUser
                            width="100%"
                            setFn={(input: string) => setCurrentUser(input)}
                            isDisabled={isSelectDisabled()}
                            placeholder={isSelectDisabled() ? currentUser() : undefined}
                        />
                    </section>

                    {/* Day Input */}
                    <section class="flex justify-between items-center sw">
                        <label for="day" class="">Day:</label>
                        <input
                            id="day"
                            type="date"
                            value={state.day}
                            onInput={(e) => setState("day", e.currentTarget.value)}
                            class="py-2 px-4 border-2 border-solid border-primary rounded bg-offDark text-2xl text-white text-center iw"
                        />
                    </section>

                    {/* Clock In Time Input */}
                    <section class="flex justify-between items-center sw">
                        <label for="clock_in" class="">Clock In:</label>
                        <input
                            id="clock_in"
                            type="time"
                            value={state.clockIn}
                            onInput={(e) => setState("clockIn", e.currentTarget.value)}
                            class="py-2 px-4 border-2 border-solid border-primary rounded bg-offDark text-2xl text-white text-center iw"
                        />
                    </section>

                    {/* Clock Out Time Input */}
                    <section class="flex justify-between items-center sw">
                        <label for="clock_out" class="">Clock Out:</label>
                        <input
                            id="clock_out"
                            type="time"
                            value={state.clockOut}
                            onInput={(e) => setState("clockOut", e.currentTarget.value)}
                            class="py-2 px-4 border-2 border-solid border-primary rounded bg-offDark text-2xl text-white text-center iw"
                        />
                    </section>
                    
                    <button
                        class="bg-blue text-5 text-dark font-code rounded mt-4 px-4 py-2 w-100px"
                        onClick={() => props.handleAdd(state, currentUser() || "")}
                    >
                        Add
                    </button>
                </div>
            </div>
        </Modal>
    );
};

