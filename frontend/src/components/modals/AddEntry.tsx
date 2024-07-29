import Modal from "@lutaok/solid-modal";
import { Component, createSignal } from "solid-js";
import { ScheduleRequest } from "../../utils/types";
import { createStore } from "solid-js/store";
import { SelectUser } from "../SelectUser";

export const AddEntry: Component<{
    isModalOpen: () => boolean;
    closeModal: () => void;
    handleAdd: (input: ScheduleRequest) => void;
    defaultUser?: string
}> = (props) => {
    const [state, setState] = createStore<ScheduleRequest>(
        {
            user_id: props.defaultUser,
            week_start_date: "",
            day_of_week: 0,
            clock_in: "11:00",
            clock_out: "12:00"
        }
    )
    const [isSelectDisabled, setIsSelectDisabled] = createSignal(false);

    return <Modal isOpen={props.isModalOpen()} onCloseRequest={props.closeModal} closeOnOutsideClick overlayStyle={{ "background-color": 'rgba(14, 14, 14, 0.7)' }}>
        <h2 class='font-norm font-bold text-2xl text-light text-center'>Add time entry</h2>
        <div class="flex flex-col justify-center items-center gap-4 text-2xl font-code text-light color-light text-center">
            {/* User ID Input */}
            <section class="flex items-center ">
                <label for="user_id" class="text-2xl font-code my-auto">User ID: </label>
                <SelectUser setFn={setState} isDisabled={isSelectDisabled()} placeholder={isSelectDisabled() ? props.defaultUser : undefined}/>
                <input 
                  type="checkbox" 
                  class="ml-4 " 
                  id="toggle" 
                  onChange={() => setIsSelectDisabled(!isSelectDisabled())} 
                  checked={isSelectDisabled()}
                />
                <label for="toggle" class="ml-2 ">Selection</label>
            </section>

            {/* Week Start Date Input */}
            <section>
                <label for="week_start_date" class="mr-4 ">Week Start:</label>
                <input
                    id="week_start_date"
                    type="date"
                    value={state.week_start_date}
                    onInput={(e) => setState("week_start_date", e.currentTarget.value)}
                    class="py-2 px-4 border-2 border-solid border-primary rounded bg-offDark text-2xl text-white"
                />
            </section>

            {/* Day of the Week Select */}
            <section>
                <label for="day_of_week" class="">Day of Week:</label>
                <select
                    id="day_of_week"
                    value={state.day_of_week}
                    onChange={(e) => setState("day_of_week", parseInt(e.currentTarget.value))}
                    class="w-full py-2 px-4 border-2 border-solid border-primary rounded bg-offDark text-2xl text-white"
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
            <section>
                <label for="clock_in" class="mr-auto ">Clock In:</label>
                <input
                    id="clock_in"
                    type="time"
                    value={state.clock_in}
                    onInput={(e) => setState("clock_in", e.currentTarget.value)}
                    class="py-2 px-4 border-2 border-solid border-primary rounded bg-offDark text-2xl text-white text-center"
                />
            </section>

            {/* Clock Out Time Input */}
            <section>
                <label for="clock_out" class="mr-auto ">Clock Out:</label>
                <input
                    id="clock_out"
                    type="time"
                    value={state.clock_out}
                    onInput={(e) => setState("clock_out", e.currentTarget.value)}
                    class="py-2 px-4 border-2 border-solid border-primary rounded bg-offDark text-2xl text-white text-center"
                />
            </section>
            <button class="bg-blue text-lg font-code rounded mt-4 px-4 py-2" onClick={[props.handleAdd, state]}>Add</button>
        </div>
    </Modal>
};
