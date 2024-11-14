import { For, Show, createResource, createSignal, onCleanup, onMount, type Component } from 'solid-js';
import { createNewUser, deleteExistingUser, fetchUsers, updateExistingUser } from '../utils/api';
import { NavBar } from '../components/NavBar';
import { useNavigate } from '@solidjs/router';
import { AddUserModal } from '../components/modals/AddUserModal';
import { User } from '../utils/types';
import { setUpKeybindings } from '../utils/helper';

const Users: Component = () => {
    const navigate = useNavigate();
    const [users, { refetch }] = createResource(() => fetchUsers(navigate));
    const [entryIndex, setEntryIndex] = createSignal<number>();
    const [isAddUserModalOpen, setIsAddUserModalOpen] = createSignal(false);

    const shortcuts: {
        [key: string]: () => void;
    }= {
        "a" : () => setTimeout(() => {setIsAddUserModalOpen(true)}, 0), // Wait for user to let go of a key
        "r" : () => resetRowValue(entryIndex() || 0),
        "d" : () => handleDelete(getRowValue(entryIndex())?.userId || "")
    }

    onMount(() => {setUpKeybindings(shortcuts, ["INPUT", "TEXTAREA"])})
    onCleanup(() => {document.removeEventListener("keydown", () => {})})

    const getRowValue = (index: number | undefined): User | null => {
        if (index === undefined || index === null) return null;

        const idInput = document.getElementById(`userId-${index}`) as HTMLInputElement | null;
        const nameInput = document.getElementById(`userName-${index}`) as HTMLInputElement | null;

        if (!idInput || !nameInput) return null;

        return {
            userId: idInput.value,
            name: nameInput.value,
        };
    };

    const handleAddUser = async (data: User) => {
        setIsAddUserModalOpen(true);
        try {
            if (!data.userId || !data.name) {return;}
            await createNewUser({ ...data}, navigate);
            refetch();
            setIsAddUserModalOpen(false);
        } catch (error) {
            console.error("Failed to add user", error);
        }
    }

    const handleChange = async (targetId: string) => {
        if (!targetId) return;

        const rowData = getRowValue(entryIndex());

        if (!rowData) {
            console.error("Failed to get row data.");
            return;
        }
        
        try {
            await updateExistingUser({userId: targetId, name: rowData.name}, navigate);
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

    const resetRowValue = (index: number) => {
        if (!index) return;

        const nameInput = document.getElementById(`userName-${index}`) as HTMLInputElement;
        nameInput.value = users()?.find((user) => user.userId === getRowValue(entryIndex())?.userId)?.name || "";
    }

    return (
    <div>
        <NavBar />
        <h1 class="text-light font-code text-center">User admin</h1>

        <div class='flex flex-col gap-3 max-w-70vw mx-auto mb-20'>
            {/* Headers */}
            <div class="flex gap-2 font-norm text-center">
                <h1 class="flex-1 flex-shrink-50 mb-0">User ID</h1>
                <h1 class="flex-1 flex-shrink flex-basis-[200px] mb-0">Name</h1>
            </div>
            <For each={users()}>
                {(user, index) => (
                    <div class="flex bg-offDark py-1 px-2 rounded-lg flex-nowrap"
                        onMouseEnter={() => setEntryIndex(index())}
                        onMouseLeave={() => setEntryIndex(undefined)}>
                        <input 
                            type="text" 
                            disabled={true}
                            id={`userId-${index()}`}
                            class="text-light font-code text-xl opacity-60 b-r-primary b-r-solid px-4 py-2 flex-1 flex-shrink-50 min-w-0 rd-tr-md rd-br-md" 
                            value={user.userId}
                        />
                        <input 
                            type="text" 
                            id={`userName-${index()}`}
                            class="text-light font-code text-xl px-4 py-2 flex-1 flex-shrink flex-basis-[200px] min-w-0"
                            value={user.name} 
                        />
                        <Show when={entryIndex() === index()}>
                            <div class="relative w-0 h-0 left-3">
                                <div class="absolute flex w-69px h-43px items-center" >
                                    <button class="i-mdi:trash-can-outline w-6 h-6 " onClick={[handleDelete, user.userId]}></button>
                                    <button class="i-mdi:refresh w-6 h-6" onClick={() => resetRowValue(index())}></button>
                                    <button class="i-mdi:content-save-outline w-6 h-6" onClick={[handleChange, user.userId]}></button>
                                </div>
                            </div>
                        </Show>
                    </div>
                )}
            </For>
        </div>

        <button 
        class="nm fixed bottom-14 right-14 p-3 text-lg font-code text-primary rounded-full flex items-center justify-center 
               transition-transform transform hover:scale-105 hover:bg-slightDark hover:shadow-lg"
        onClick={() => setIsAddUserModalOpen(true)}
        >
            <i class="i-mdi:plus w-6 h-6 mr-2"></i>Add user
        </button>

        <AddUserModal isModalOpen={isAddUserModalOpen} closeModal={() => setIsAddUserModalOpen(false)} handleAddFn={(data: User) => handleAddUser(data)}/>
    </div>
    );
};

export default Users;

