import { Component, Resource, createContext, createResource, useContext } from "solid-js";
import { UserResponse } from "../utils/types";
import { fetchUsers } from "../utils/api";

interface UsersContextValue {
  users: Resource<UserResponse[]>;
}

const usersCtx = createContext<UsersContextValue>();

export const UsersProvider: Component<{ children: any }> = (props) => {
    const [users] = createResource<UserResponse[]>(fetchUsers);

    return (
        <usersCtx.Provider value={{ users }}>
            {props.children}
        </usersCtx.Provider>
    );
};

export const useUsersCtx = (): Resource<UserResponse[]> => {
    const users = useContext(usersCtx);
    
    if (!users) {
        throw new Error("useUsers must be used within a UsersProvider");
    }
    return users.users;
};
