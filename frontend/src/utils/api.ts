import { AllScheduleResponse, NavigateFunction, TimeEntry, UserResponse } from "./types";

const handleResponse = (response: Response, nav: NavigateFunction) => {
    if (response.status === 401) {
        console.error("Need to be logged in! Redirecting...");
        nav('/login');
    }
}

export type NewUserData = {
    id: string;
    name: string;
    role: string;
}
export const createNewUser = async (data: NewUserData, nav: NavigateFunction) => {
    const response = await fetch(`${import.meta.env.VITE_SERV}/api/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    handleResponse(response, nav);
}

export const fetchUsers = async (nav: NavigateFunction): Promise<UserResponse[]> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_SERV}/api/users`);
        if (response.ok) {
            return response.json();
        }
        handleResponse(response, nav);
        return [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export type UpdateUserData = {
    name: string;
    role: string;
}
export const updateExistingUser = async (userId: string, data: UpdateUserData, nav: NavigateFunction) => {
    if (!userId) return;

    const response = await fetch(`${import.meta.env.VITE_SERV}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    handleResponse(response, nav);
}

export const deleteExistingUser = async (userId: string, nav: NavigateFunction) => {
    if (!userId) return;

    const response = await fetch(`${import.meta.env.VITE_SERV}/api/users/${userId}`, {
        method: 'DELETE',
    });

    handleResponse(response, nav);
}

export const fetchUserSchedules = async (userId: string): Promise<TimeEntry[]> => {
    if (!userId) return [];
    try {
        const response = await fetch(`${import.meta.env.VITE_SERV}/api/users/${userId}/schedules`);
        
        if (!response.ok) { return []; }

        const contentLength = response.headers.get('content-length');
        if (contentLength && Number(contentLength) === 0) {
            console.log("User content not found");
            return [];
        }
        
        const data: TimeEntry[] = await response.json();

        if (Array.isArray(data) && data.length === 0) {
            console.log("No schedules found for the user.");
            return [];
        }

        return data;
        
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const fetchAllSchedules = async (nav: NavigateFunction): Promise<AllScheduleResponse> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_SERV}/api/schedules`);
        if (response.ok) {
            return response.json();
        }
        handleResponse(response, nav);
        return [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export type NewScheduleData = {
    day: string;
    clockIn: string;
    clockOut: string;
}
export const createNewSchedule = async (user_id: string, data: NewScheduleData, nav: NavigateFunction) => {
    const response = await fetch(`${import.meta.env.VITE_SERV}/api/users/${user_id}/schedules`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    handleResponse(response, nav);
}

export type UpdateScheduleData = {
    entryId: number;
    day: string;
    clockIn: string;
    clockOut: string;
}
export const updateExistingSchedule = async (data: UpdateScheduleData, nav: NavigateFunction) => {
    const response = await fetch(`${import.meta.env.VITE_SERV}/api/users/schedules`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    handleResponse(response, nav);
}

export const deleteExistingSchedule = async (entryId: number, nav: NavigateFunction) => {
    const response = await fetch(`${import.meta.env.VITE_SERV}/api/users/schedules/${entryId}`, {
        method: 'DELETE',
    });

    handleResponse(response, nav);
}

