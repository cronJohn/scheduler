import { Component, For, onMount } from "solid-js";

export const SelectRole: Component<{
    setFn: (input: string) => void;
    defaultVal?: string
    isDisabled?: boolean
    width?: string
    placeholder?: string
}> = (props) => {
    const roles: string[] = import.meta.env.VITE_ROLES.split(",");

    onMount(() => {
        if (!props.defaultVal) {
            props.setFn(roles[0]);
        }
    })
    
    return (
        <select id="role-select" name="role-select" class="bg-gray-500/20 iw h-56px bb-primary text-2xl rounded text-light"
        onChange={(e) => props.setFn(e.currentTarget.value)}>
            <For each={roles}>
            {(role) => (
                <option value={role} selected={props.defaultVal === role}>{role}</option>
            )}
            </For>
        </select>
    );
};


