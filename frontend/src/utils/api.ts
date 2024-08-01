import { UserResponse, WeekSchedule } from "./types";

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

export const fetchSchedules = async (user_id: string): Promise<WeekSchedule> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_SERV}/api/users/${user_id}/schedule`);
        if (response.ok) {
            return response.json();
        } return {};
    } catch (error) {
        console.error(error);
        return {}
    }
}

export type NewScheduleData = {
    weekStartDate: string;
    dayOfWeek: number;
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

export type UpdateWeekStartData = {
    oldWeekStartDate: string;
    newWeekStartDate?: string;
}
export const updateUserWeekStartDate = async (user_id: string, data: UpdateWeekStartData) => {
    const response = await fetch(`${import.meta.env.VITE_SERV}/api/users/${user_id}/weekstart`, {
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
    const response = await fetch(`${import.meta.env.VITE_SERV}/api/users/schedule`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    logResponse(response);
}

export type DeleteUserWeekStartDateData = {
    weekStartDate: string;
}
export const deleteUserWeekStartDate = async (user_id: string, data: DeleteUserWeekStartDateData) => {
    const response = await fetch(`${import.meta.env.VITE_SERV}/api/users/${user_id}/weekstart`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    logResponse(response);
}
