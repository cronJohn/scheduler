import { AllScheduleResponse, TimeEntry, UserResponse } from "./types";

const logResponse = (response: Response) => {
    if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
    }
}

export const fetchUsers = async (): Promise<UserResponse[]> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_SERV}/api/users`);
        if (response.ok) {
            return response.json();
        }
        return [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const fetchUserSchedules = async (user_id: string): Promise<TimeEntry[]> => {
    if (!user_id) return [];
    try {
        const response = await fetch(`${import.meta.env.VITE_SERV}/api/users/${user_id}/schedule`);
        if (response.ok) {
            return response.json();
        }
        return [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const fetchAllSchedules = async (): Promise<AllScheduleResponse> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_SERV}/api/schedules`);
        if (response.ok) {
            return response.json();
        }
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
export const createNewSchedule = async (user_id: string, data: NewScheduleData) => {
    const response = await fetch(`${import.meta.env.VITE_SERV}/api/users/${user_id}/schedule`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    logResponse(response);
}

export type UpdateScheduleData = {
    entryId: number;
    day: string;
    clockIn: string;
    clockOut: string;
}
export const updateExistingSchedule = async (data: UpdateScheduleData) => {
    const response = await fetch(`${import.meta.env.VITE_SERV}/api/users/schedule`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    logResponse(response);
}

export type DeleteScheduleData = {
    entryId: number;
}
export const deleteExistingSchedule = async (data: DeleteScheduleData) => {
    const response = await fetch(`${import.meta.env.VITE_SERV}/api/users/schedule/${data.entryId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    logResponse(response);
}

