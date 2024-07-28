import { Component, For } from "solid-js";
import { SetStoreFunction } from "solid-js/store";
import { UserRequest } from "../utils/types";

export const SelectUser: Component<{
    setFn: SetStoreFunction<any>;
    getFn: () => UserRequest[] | undefined;
}> = (props) => {
    return (
        <>
            <label for="user_id" class="text-size-1.5rem font-code my-auto">User ID: </label>
            <input
            id="user_id"
            type="text"
            list="users"
            onChange={(e) => props.setFn("user_id", e.currentTarget.value)}
            onKeyPress={(e) => e.key === 'Enter' && props.setFn("user_id", e.currentTarget.value)}
            class="py-2 px-4 border-2 border-solid border-primary text-size-1.5rem rounded bg-offDark text-light"
            placeholder="Enter ID"
            autofocus
            />

            <datalist id="users">
                <For each={props.getFn()}>
                {(user) => (
                    <option value={user.id} />
                )}
                </For>
            </datalist>
    </>
    );
};

