import { useNavigate } from '@solidjs/router';
import { Show, createSignal, type Component } from 'solid-js';
import { NavBar } from '../components/NavBar';

const Login: Component = () => {
    const navigate = useNavigate();
    const [error, setError] = createSignal<Error | null>(null);

    const handleSubmit = async (event: Event) => {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement);
        let response: Response;

        try {
            response = await fetch(`${import.meta.env.VITE_SERV}/api/auth/login`, {
                method: 'POST',
                body: formData,
                credentials: 'include', // need this for cookies to be set
            });

            if (!response.ok) {
                throw new Error("Invalid username or password");
            }

            navigate('/');
        } catch (error) {
            console.error('Error during login:', error);
            if (error instanceof Error) {
                setError(error);
            } else {
                setError(new Error('An unknown error occurred during login'));
            }
        }
    };

    return (
        <>
            <NavBar />
            <div class='bg-dark text-light font-code h-screen flex items-center'>
                <form class='w-30vw m-auto nm flex gap-4 p-3rem flex-col items-center justify-center' onSubmit={handleSubmit}>
                    <input type="text" name="username" class='py-2 px-4 text-size-1.5rem rounded bg-offDark text-light' placeholder='Username' />
                    <input type="password" name="password" class='py-2 px-4 text-size-1.5rem rounded bg-offDark text-light' placeholder='Password' />
                    <button type="submit" class="bg-offDark text-primary font-semibold mt-4 py-3 px-5 text-size-1.5rem rounded hover:bg-opacity-75">Login</button>
                    <Show when={error()}>
                        <h1 class='text-xl text-primary font-code'>{error()?.message}</h1>
                    </Show>
                </form>
            </div>
        </>
    );
};

export default Login;

