import { Component, For, createResource } from "solid-js";
import { fetchUsers } from "../utils/api";

export const SelectUser: Component<{
    setFn: (input: string) => void;
    isDisabled?: boolean
    width?: string
    autofocus?: boolean
    placeholder?: string
}> = (props) => {
    const [users] = createResource(fetchUsers);
    return (
        <>
            <input
            id="user_id"
            type="text"
            list="users"
            disabled={props.isDisabled}
            onChange={(e) => props.setFn(e.currentTarget.value)}
            onKeyPress={(e) => e.key === 'Enter' && props.setFn(e.currentTarget.value)}
            class="py-2 px-4 border-2 border-solid border-primary text-2xl rounded bg-offDark text-light disabled-text-gray-500"
            placeholder={props.placeholder || "Enter ID"}
            style={{width: props.width}}
            autofocus={props.autofocus}
            />

            <datalist id="users">
                <For each={users.latest}>
                {(user) => (
                    <option value={user.id} />
                )}
                </For>
            </datalist>
        </>
    );
};

