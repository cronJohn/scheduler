import { ScheduleData, ScheduleRequest, UserResponse } from "./types";

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
        } return [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const fetchSchedules = async (id: string): Promise<ScheduleData> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_SERV}/api/users/${id}/schedule`);
        if (response.ok) {
            return response.json();
        } return {};
    } catch (error) {
        console.error(error);
        return {}
    }
}

export const createNewSchedule = async (input: ScheduleRequest) => {
    const response = await fetch(`${import.meta.env.VITE_SERV}/api/users/schedule`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });

    logResponse(response);
}

export const updateExistingSchedule = async (input: ScheduleRequest) => {
    const response = await fetch(`${import.meta.env.VITE_SERV}/api/users/${input.user_id}/schedule`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });

    logResponse(response);
}

export const updateUserWeekStartDate = async (input: ScheduleRequest) => {
    const response = await fetch(`${import.meta.env.VITE_SERV}/api/users/${input.user_id}/weekstart`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });

    logResponse(response);
}

export const deleteExistingSchedule = async (input: ScheduleRequest) => {
    const response = await fetch(`${import.meta.env.VITE_SERV}/api/users/${input.user_id}/schedule`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });

    logResponse(response);
}

export const deleteUserWeekStartDate = async (input: ScheduleRequest) => {
    const response = await fetch(`${import.meta.env.VITE_SERV}/api/users/${input.user_id}/weekstart`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });

    logResponse(response);
}
