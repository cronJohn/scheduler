import Modal from "@lutaok/solid-modal";
import { Component, For } from "solid-js";
import { createStore } from "solid-js/store";
import { UserResponse } from "../../utils/types";

export const AddUserModal: Component<{
    isModalOpen: () => boolean;
    closeModal: () => void;
    handleAddFn: (data: UserResponse) => void;
    roles?: string[];
}> = (props) => {
    const [state, setState] = createStore<UserResponse>({
        id: "",
        name: "",
        role: props.roles?.[0] || "inshop",
    })

    return (
        <Modal
            isOpen={props.isModalOpen()}
            onCloseRequest={props.closeModal}
            closeOnOutsideClick
            overlayStyle={{ "background-color": 'rgba(14, 14, 14, 0.7)' }}
        >
            <div class="w-360px ">
                <h2 class='font-norm font-medium text-3xl text-light text-center'>Add User</h2>
                <div class="flex flex-col justify-center items-center gap-4 text-2xl text-light color-light text-center"
                onKeyDown={(e) => e.key === 'Enter' && props.handleAddFn(state)}>
                    {/* User ID Input */}
                   <section class="flex justify-between items-center w-80%">
                        <label for="userId" class="font-code ">Id:</label>
                        <input
                            id="userId"
                            type="text"
                            placeholder="Enter ID"
                            onInput={(e) => setState("id", e.currentTarget.value)}
                            class="py-2 px-4 b-2 b-solid b-primary rounded bg-offDark text-2xl text-white text-center iw"
                        />
                    </section>
                    
                    {/* User Name Input */}
                   <section class="flex justify-between items-center w-80%">
                        <label for="userName" class="font-code ">Name:</label>
                        <input
                            id="userName"
                            type="text"
                            placeholder="Enter Name"
                            onInput={(e) => setState("name", e.currentTarget.value)}
                            class="py-2 px-4 b-2 b-solid b-primary rounded bg-offDark text-2xl text-white text-center iw"
                        />
                    </section>

                    {/* User Role Input */}
                   <section class="flex justify-between items-center w-80%">
                        <label for="userRole" class="font-code ">Role:</label>

                        <select 
                            id="userRole"
                            class="text-light font-code text-xl px-4 b-none py-2 min-w-0 iw h-52px"
                            onChange={(e) => setState("role", e.currentTarget.value)}
                        >
                            <For each={props.roles}>
                                {(role) => (
                                    <option value={role}>{role}</option>
                                )}
                            </For>
                        </select>
                    </section>

                    <button
                        class="nm text-5 text-primary font-code rounded hover:bg-slightDark mt-4 px-4 py-2 w-100px"
                        onClick={() => {props.handleAddFn(state)}}
                    >Add
                    </button>
                </div>
            </div>
        </Modal>
    )
}

