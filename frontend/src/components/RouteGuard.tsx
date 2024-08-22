import { Component, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { isUserAuthenticated } from "../utils/helper";

export const RouteGuard: Component<{ children: any }> = (props) => {
    const navigate = useNavigate();

    onMount(() => {
        if (!isUserAuthenticated()) {
            navigate("/login", { replace: true });
        }
    });

    return isUserAuthenticated() ? props.children : null;
};
