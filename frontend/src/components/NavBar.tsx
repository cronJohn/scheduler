import { Component } from "solid-js";

export const NavBar: Component = () => {
    return (
        <div class="flex justify-center text-light font-code py-2 gap-5 rounded">
            <a href="/" class="nm py-2 px-4 rounded hover:bg-light hover:text-dark transition">Home</a>
            <a href="/schedules" class="nm py-2 px-4 rounded hover:bg-light hover:text-dark transition">Schedules</a>
            <a href="/admin" class="nm py-2 px-4 rounded hover:bg-light hover:text-dark transition">Admin</a>
            <a href="/overview" class="nm py-2 px-4 rounded hover:bg-light hover:text-dark transition">Overview</a>
        </div>
    );
};
