import Modal from "@lutaok/solid-modal";
import { Component, createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { SelectUser } from "../SelectUser";
import { NewScheduleData } from "../../utils/api";
import { getDateISO } from "../../utils/helper";

export const AddEntryModal: Component<{
    isModalOpen: () => boolean;
    closeModal: () => void;
    getStateFn: () => NewScheduleData;
    targetUser: string;
    handleAdd: (data: NewScheduleData, userId: string) => void;
}> = (props) => {
    const [state, setState] = createStore<NewScheduleData>(
        {
            weekStartDate: getDateISO(),
            dayOfWeek: props.getStateFn().dayOfWeek,
            clockIn: props.getStateFn().clockIn,
            clockOut: props.getStateFn().clockOut
        }
    )

    createEffect(() => {
        const buf = currentUser(); // Prevent losing previous state
        if (isSelectDisabled()){
            setCurrentUser(props.targetUser);
        } else {setCurrentUser(buf)}
    })

    const [currentUser, setCurrentUser] = createSignal<string>("");
    const [isSelectDisabled, setIsSelectDisabled] = createSignal(false);

    return <Modal isOpen={props.isModalOpen()} onCloseRequest={props.closeModal} closeOnOutsideClick 
    overlayStyle={{ "background-color": 'rgba(14, 14, 14, 0.7)' }}>
        <div class="w-25vw ">
            <h2 class='font-norm font-medium text-3xl text-light text-center'>Add time entry</h2>
            <div class="flex flex-col justify-center items-center gap-4 text-2xl font-code text-light color-light text-center">
                {/* User ID Input */}
                <section class="flex flex-col items-center sw">
                    <div class="flex items-center w-full">
                        <label for="user_id" class="text-2xl font-code">User ID: </label>
                        <input 
                        type="checkbox" 
                        class="ml-auto " 
                        id="toggle" 
                        onChange={() => setIsSelectDisabled(!isSelectDisabled())} 
                        checked={isSelectDisabled()}
                        />
                        <label for="toggle" class="ml-2 text-lg">Use Selection</label>
                    </div>
                    <SelectUser width="100%" setFn={(input: string) => setCurrentUser(input)} isDisabled={isSelectDisabled()} placeholder={isSelectDisabled() ? currentUser() : undefined}/>
                </section>

                {/* Week Start Date Input */}
                <section class="flex justify-between items-center sw">
                    <label for="week_start_date" class="">Week Start:</label>
                    <input
                        id="week_start_date"
                        type="date"
                        value={state.weekStartDate}
                        onInput={(e) => setState("weekStartDate", e.currentTarget.value)}
                        class="py-2 px-4 border-2 border-solid border-primary rounded bg-offDark text-2xl text-white iw"
                    />
                </section>

                {/* Day of the Week Select */}
                <section class="flex justify-between items-center sw">
                    <label for="day_of_week" class="">Week day:</label>
                    <select
                        id="day_of_week"
                        value={state.dayOfWeek}
                        onChange={(e) => setState("dayOfWeek", parseInt(e.currentTarget.value))}
                        class="border-2 border-solid border-primary rounded bg-offDark text-2xl text-white iw h-12"
                    >
                        <option value="0">Sunday</option>
                        <option value="1">Monday</option>
                        <option value="2">Tuesday</option>
                        <option value="3">Wednesday</option>
                        <option value="4">Thursday</option>
                        <option value="5">Friday</option>
                        <option value="6">Saturday</option>
                    </select>
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
                <button class="bg-blue text-5 font-code rounded mt-4 px-4 py-2 w-100px" onClick={() => props.handleAdd(state, currentUser())}>Add</button>
            </div>
        </div>
    </Modal>
};
