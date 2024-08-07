import type { Component } from 'solid-js';
import { RandomImage } from '../components/RandomImage';

const Home: Component = () => {
    return (
        <div class='bg-dark text-light font-code h-screen flex items-center'>
            <div class='w-40vw m-auto text-center nm flex gap-4 p-3rem flex-col items-center justify-center'>
                <RandomImage />
                <a href="/schedules" class="w-170px bg-offDark text-primary py-2 px-4 rounded hover:bg-opacity-75">View schedules</a>
                <a href="/admin" class="w-170px bg-offDark text-primary py-2 px-4 rounded hover:bg-opacity-75">Admin stuff</a>
                <a href="/overview" class="w-170px bg-offDark text-primary py-2 px-4 rounded hover:bg-opacity-75">Overview</a>
            </div>
        </div>
    );
};

export default Home;
