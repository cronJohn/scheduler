import { For, Show, createResource, createSignal, type Component } from 'solid-js';
import { createNewUser, deleteExistingUser, fetchUsers, updateExistingUser } from '../utils/api';
import { NavBar } from '../components/NavBar';
import { UserResponse } from '../utils/types';
import { useNavigate } from '@solidjs/router';
import { AddUserModal } from '../components/modals/AddUserModal';

const Users: Component = () => {
    const navigate = useNavigate();
    const [users, { refetch }] = createResource(() => fetchUsers(navigate));
    const roles = ['inshop', 'driver', 'manager'];
    const [entryIndex, setEntryIndex] = createSignal<number>();
    const [isAddUserModalOpen, setIsAddUserModalOpen] = createSignal(false);

    const getRowValue = (index: number | undefined): UserResponse | null => {
        if (index === undefined || index === null) return null;

        const idInput = document.getElementById(`userId-${index}`) as HTMLInputElement | null;
        const nameInput = document.getElementById(`userName-${index}`) as HTMLInputElement | null;
        const roleSelect = document.getElementById(`userRole-${index}`) as HTMLSelectElement | null;

        if (!idInput || !nameInput || !roleSelect) return null;

        return {
            id: idInput.value,
            name: nameInput.value,
            role: roleSelect.value
        };
    };

    const handleAddUser = async (data: UserResponse) => {
        setIsAddUserModalOpen(true);
        try {
            if (!data.id || !data.name || !data.role) {return;}
            await createNewUser({ ...data}, navigate);
            refetch();
            setIsAddUserModalOpen(false);
        } catch (error) {
            console.error("Failed to add user", error);
        }
    }

    const handleChange = async (oldID: string) => {
        if (!oldID) return;

        const rowData = getRowValue(entryIndex());

        if (!rowData) {
            console.error("Failed to get row data.");
            return;
        }
        
        try {
            await updateExistingUser(oldID, {name: rowData.name, role: rowData.role}, navigate);
            refetch();
        } catch (error) {
            console.error("Failed to update user", error);
        }
    }

    const handleDelete = async (userId: string) => {
        try {
            if (!userId) return;
            await deleteExistingUser(userId, navigate);
            refetch();
        } catch (error) {
            console.error("Failed to delete user", error);
        }
    }

    const resetRowValue = (index: number, data: UserResponse) => {
        const idInput = document.getElementById(`userId-${index}`) as HTMLInputElement;
        const nameInput = document.getElementById(`userName-${index}`) as HTMLInputElement;
        const roleSelect = document.getElementById(`userRole-${index}`) as HTMLSelectElement;

        idInput.value = data.id;
        nameInput.value = data.name;
        roleSelect.value = data.role;
    }

    return (
    <div>
        <NavBar />
        <h1 class="text-light font-code text-center">User admin</h1>

        <div class='flex flex-col gap-4 max-w-70vw mx-auto mb-20'>
            <For each={users()}>
                {(user, index) => (
                    <div class="flex bg-offDark py-1 px-2 rounded-lg flex-nowrap"
                        onMouseEnter={() => setEntryIndex(index())}>
                        <input 
                            type="text" 
                            disabled={true}
                            id={`userId-${index()}`}
                            class="text-light font-code text-xl opacity-60 b-r-primary b-r-solid px-4 py-2 flex-1 flex-shrink-50 min-w-0 rd-tr-md rd-br-md" 
                            value={user.id}
                        />
                        <input 
                            type="text" 
                            id={`userName-${index()}`}
                            class="text-light font-code text-xl px-4 py-2 flex-1 flex-shrink flex-basis-[200px] min-w-0"
                            value={user.name} 
                        />
                        <select 
                            value={user.role} 
                            id={`userRole-${index()}`}
                            class="text-light font-code text-xl px-4 b-none py-2 min-w-0"
                        >
                            <For each={roles}>
                                {(role) => (
                                    <option value={role}>{role}</option>
                                )}
                            </For>
                        </select>
                        <Show when={entryIndex() === index()}>
                            <div class="relative w-0 h-0 left-3">
                                <div class="absolute flex w-69px h-43px items-center" >
                                    <button class="i-mdi:trash-can-outline w-6 h-6 " onClick={[handleDelete, user.id]}></button>
                                    <button class="i-mdi:refresh w-6 h-6" onClick={() => resetRowValue(index(), user)}></button>
                                    <button class="i-mdi:content-save-outline w-6 h-6" onClick={[handleChange, user.id]}></button>
                                </div>
                            </div>
                        </Show>
                    </div>
                )}
            </For>
        </div>

        <button 
        class="nm fixed bottom-16 right-16 p-3 text-lg font-code text-primary rounded-full flex items-center justify-center 
               transition-transform transform hover:scale-105 hover:bg-slightDark hover:shadow-lg"
        onClick={() => setIsAddUserModalOpen(true)}
        >
            <i class="i-mdi:plus w-6 h-6 mr-2"></i>Add user
        </button>

        <AddUserModal isModalOpen={isAddUserModalOpen} closeModal={() => setIsAddUserModalOpen(false)} roles={roles} handleAddFn={(data: UserResponse) => handleAddUser(data)}/>
    </div>
    );
};

export default Users;

