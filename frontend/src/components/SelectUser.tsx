import { Component, For } from "solid-js";
import { useUsersCtx } from "../context/Users";

export const SelectUser: Component<{
    setFn: (input: string) => void;
    isDisabled?: boolean
    placeholder?: string
}> = (props) => {
    return (
        <>
            <input
            id="user_id"
            type="text"
            list="users"
            disabled={props.isDisabled}
            onChange={(e) => props.setFn(e.currentTarget.value)}
            onKeyPress={(e) => e.key === 'Enter' && props.setFn(e.currentTarget.value)}
            class="py-2 px-4 border-2 border-solid border-primary text-2xl rounded bg-offDark text-light"
            placeholder={props.placeholder || "Enter ID"}
            autofocus
            />

            <datalist id="users">
                <For each={useUsersCtx().latest}>
                {(user) => (
                    <option value={user.id} />
                )}
                </For>
            </datalist>
        </>
    );
};

