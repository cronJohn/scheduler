import { Component, For, createSignal } from "solid-js";
import config from "../../../config.json";

export const SelectRole: Component<{
    setFn: (input: string) => void;
    defaultVal?: string
    isDisabled?: boolean
    width?: string
    placeholder?: string
}> = (props) => {
    const roles: string[] = config.frontend.ROLES;

    const [currentRole, setCurrentRole] = createSignal<string>(props.defaultVal ?? "");

    if (props.defaultVal === "") {
        setCurrentRole(roles[0]);
        props.setFn(roles[0]);
    }
    
    return (
        <select id="role-select" name="role-select" class="bg-gray-500/20 iw h-56px bb-primary text-2xl rounded text-light"
        onChange={(e) => props.setFn(e.currentTarget.value)}>
            <For each={roles}>
            {(role) => (
                <option value={role} selected={currentRole() === role}>{role}</option>
            )}
            </For>
        </select>
    );
};


