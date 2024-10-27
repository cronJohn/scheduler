import Modal from "@lutaok/solid-modal";
import { Component, Show, createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { User } from "../../utils/types";

export const AddUserModal: Component<{
    isModalOpen: () => boolean;
    closeModal: () => void;
    handleAddFn: (data: User) => void;
}> = (props) => {
    const [state, setState] = createStore<User>({
        userId: "",
        name: "",
    })

    const [formError, setFormError] = createSignal(false)

    createEffect(() => {
        if (props.isModalOpen()) {
            setState({
                userId: "",
                name: "",
            });
        }
    });

    function getErrorMessage() {
        var errorsBuf: string[] = [];
        if (!state.userId) {errorsBuf.push("user id")}
        if (!state.name) {errorsBuf.push("name")}

        // Clear error display after a while
        setTimeout(() => {
            setFormError(false);
        }, 2000);

        return errorsBuf.length == 2
            ? `⚠️ ${errorsBuf[0]} and ${errorsBuf[1]} must be filled in ⚠️` 
            : `⚠️ ${errorsBuf[0]} must be filled in ⚠️`;
    }

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
                        <label for="userId" class="font-code ">Id</label>
                        <input
                            id="userId"
                            type="text"
                            placeholder="Enter ID"
                            onInput={(e) => setState("userId", e.currentTarget.value)}
                            class="py-2 px-4 b-2 b-solid b-primary rounded bg-offDark text-2xl text-white text-center iw"
                        />
                    </section>
                    
                    {/* User Name Input */}
                   <section class="flex justify-between items-center w-80%">
                        <label for="userName" class="font-code ">Name</label>
                        <input
                            id="userName"
                            type="text"
                            placeholder="Enter Name"
                            onInput={(e) => setState("name", e.currentTarget.value)}
                            class="py-2 px-4 b-2 b-solid b-primary rounded bg-offDark text-2xl text-white text-center iw"
                        />
                    </section>
                    <button
                        class="nm text-5 text-primary font-code rounded mt-4 px-4 py-2 w-100px
                               transition-transform transform hover:scale-105 hover:bg-slightDark hover:shadow-lg"
                        onClick={() => {
                            if (!state.name || !state.userId){setFormError(true); return}
                            props.handleAddFn(state);
                        }}
                    >Add
                    </button>
                    <Show when={formError()}>
                        <p class="text-[red] px-2 py-2 nm text-lg font-norm" style={{"text-transform": "capitalize"}}>{getErrorMessage()}</p>
                    </Show>
                </div>
            </div>
        </Modal>
    )
}

