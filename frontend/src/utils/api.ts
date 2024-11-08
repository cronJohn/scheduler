import { NavigateFunction, Schedule, User } from "./types";
import config from "../../../config.json";

const handleResponse = (response: Response, nav: NavigateFunction) => {
    if (response.status === 401) {
        console.error("Need to be logged in! Redirecting...");
        nav('/login');
    }
}

export const handleLogin = async (data: FormData): Promise<void | Error> => {
    const response = await fetch(`${config.frontend.URI}/api/v1/auth/login`, {
        method: 'POST',
        body: data,
        credentials: 'include', // need this for cookies to be set
    });

    if (!response.ok) {
        return new Error("Invalid username or password");
    }

    return;
}

export type CreateNewUserRequestData = {
    userId: string;
    name: string;
}
export const createNewUser = async (data: CreateNewUserRequestData, nav: NavigateFunction) => {
    const response = await fetch(`${config.frontend.URI}/api/v1/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    handleResponse(response, nav);
}

export const fetchUsers = async (nav: NavigateFunction): Promise<User[]> => {
    try {
        const response = await fetch(`${config.frontend.URI}/api/v1/users`);
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

export type UpdateUserRequestData = {
    userId: string;
    name: string;
}
export const updateExistingUser = async (data: UpdateUserRequestData, nav: NavigateFunction) => {
    if (!data.userId) return;

    const { userId, ...requestBodyData } = data;

    const response = await fetch(`${config.frontend.URI}/api/v1/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBodyData),
    });

    handleResponse(response, nav);
}

export const deleteExistingUser = async (userId: string, nav: NavigateFunction) => {
    if (!userId) return;

    const response = await fetch(`${config.frontend.URI}/api/v1/users/${userId}`, {
        method: 'DELETE',
    });

    handleResponse(response, nav);
}

export const fetchUserSchedules = async (userId: string): Promise<Schedule[]> => {
    if (!userId) return [];
    try {
        const response = await fetch(`${config.frontend.URI}/api/v1/users/${userId}/schedules`);
        
        if (!response.ok) { return []; }

        const contentLength = response.headers.get('content-length');
        if (contentLength && Number(contentLength) === 0) {
            console.log("User content not found");
            return [];
        }
        
        const data: Schedule[] = await response.json();

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

export const fetchAllSchedules = async (nav: NavigateFunction): Promise<Schedule[]> => {
    try {
        const response = await fetch(`${config.frontend.URI}/api/v1/schedules`);
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

export type CreateNewScheduleRequestData = {
    userId: string;
    role: string;
    day: string;
    clockIn: string;
    clockOut: string;
}
export const createNewSchedule = async (data: CreateNewScheduleRequestData, nav: NavigateFunction) => {
    const { userId, ...requestBodyData } = data;

    const response = await fetch(`${config.frontend.URI}/api/v1/users/${userId}/schedules`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBodyData),
    });

    handleResponse(response, nav);
}

export type UpdateScheduleRequestData = {
    scheduleId: number;
    day: string;
    role: string;
    clockIn: string;
    clockOut: string;
}
export const updateExistingSchedule = async (data: UpdateScheduleRequestData, nav: NavigateFunction) => {
    const { scheduleId, ...requestBodyData } = data;

    const response = await fetch(`${config.frontend.URI}/api/v1/users/schedules/${scheduleId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBodyData),
    });

    handleResponse(response, nav);
}

export const deleteExistingSchedule = async (scheduleId: number, nav: NavigateFunction) => {
    const response = await fetch(`${config.frontend.URI}/api/v1/users/schedules/${scheduleId}`, {
        method: 'DELETE',
    });

    handleResponse(response, nav);
}

export const deleteExistingSchedules = async (scheduleId: number[], nav: NavigateFunction) => {
    const response = await fetch(`${config.frontend.URI}/api/v1/users/schedules/list`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ scheduleIdList: scheduleId })
    });

    handleResponse(response, nav);
}


export type ScheduleShiftData = {
    scheduleIdList: number[];
    shiftAmount: string;
}

export const shiftSchedules = async (data: ScheduleShiftData, nav: NavigateFunction) => {
    const response = await fetch(`${config.frontend.URI}/api/v1/schedules/shift`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json' // Set the Content-Type header
        },
        body: JSON.stringify(data)
    })

    handleResponse(response, nav)
}
