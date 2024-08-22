import { For, Show, createResource, createSignal, type Component } from 'solid-js';
import { fetchUsers } from '../utils/api';
import { NavBar } from '../components/NavBar';
import { UserResponse } from '../utils/types';
import { createStore } from 'solid-js/store';
import { useNavigate } from '@solidjs/router';

const Users: Component = () => {
    const navigate = useNavigate();
    const [users] = createResource(() => fetchUsers(navigate));
    const roles = ['inshop', 'driver', 'manager'];
    const [currentUserSelection, setCurrentUserSelection] = createStore<UserResponse>({
        id: '',
        name: '',
        role: ''
    });
    const [entryIndex, setEntryIndex] = createSignal<number>();

    const handleDelete = (userId: string) => {
        console.log('deleting user', userId);
    }

    const handleUpdate = (user: UserResponse) => {
        console.log('updating user', user);
    }

    return (
    <div>
        <NavBar />
        <h1 class="text-light font-code text-center">User admin</h1>

        <div class='flex flex-col gap-4 max-w-80vw mx-auto'>
            <For each={users()}>
                {(user, index) => (
                    <div class="flex bg-offDark py-1 px-2 rounded-lg flex-nowrap" onMouseEnter={() => {setEntryIndex(index())}}>
                        <input 
                            type="text" 
                            class="text-light font-code text-xl b-r-primary b-r-solid px-4 py-2 flex-1 flex-shrink-10 flex-basis-[80px] min-w-0 rd-tr-md rd-br-md" 
                            value={user.id} 
                            onChange={(e) => setCurrentUserSelection("id", e.currentTarget.value)}
                        />
                        <input 
                            type="text" 
                            class="text-light font-code text-xl px-4 py-2 flex-1 flex-shrink flex-basis-[200px] min-w-0"
                            value={user.name} 
                            onChange={(e) => setCurrentUserSelection("name", e.currentTarget.value)}
                        />
                        <select 
                            value={user.role} 
                            class="text-light font-code text-xl px-4 b-none py-2 min-w-0"
                            onChange={(e) => setCurrentUserSelection("role", e.currentTarget.value)}
                        >
                            <For each={roles}>
                                {(role) => (
                                    <option value={role}>{role}</option>
                                )}
                            </For>
                        </select>
                        <Show when={entryIndex() === index()}>
                            <div class="relative w-0 h-0 left-3">
                                <div class="absolute flex w-43px h-43px items-center" >
                                    <button class="i-mdi:trash-can-outline w-6 h-6 " onClick={[handleDelete, user.id]}></button>
                                    <button class="i-mdi-update w-6 h-6" onClick={[handleUpdate, user]}></button>
                                </div>
                            </div>
                        </Show>
                    </div>
                )}
            </For>
        </div>
    </div>
    );
};

export default Users;

