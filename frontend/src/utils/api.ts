import { ScheduleData, ScheduleRequest, UserResponse } from "./types";

const logResponse = (response: Response) => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
}

export const fetchUsers = async (): Promise<UserResponse[]> => {
    return (await fetch(`${import.meta.env.VITE_SERV}/api/users`)).json();
}

export const fetchSchedules = async (id: string): Promise<ScheduleData> => {
    const response = await fetch(`${import.meta.env.VITE_SERV}/api/users/${id}/schedule`);
    return response.json();
}

export const createSchedule = async (input: ScheduleRequest) => {
    const response = await fetch(`${import.meta.env.VITE_SERV}/api/users/schedule`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });

    logResponse(response);
}

export const updateSchedule = async (input: ScheduleRequest) => {
    const response = await fetch(`${import.meta.env.VITE_SERV}/api/users/${input.user_id}/schedule`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });

    logResponse(response);
}

export const deleteSchedule = async (input: ScheduleRequest) => {
    const response = await fetch(`${import.meta.env.VITE_SERV}/api/users/${input.user_id}/schedule`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });

    logResponse(response);
}
