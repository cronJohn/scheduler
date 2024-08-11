export type UserResponse = {
    id: string;
    name: string;
    role: string;
};

export type AllScheduleResponse = {
    name: string;
    role: string;
    id: number;
    userId: string;
    day: string;
    clockIn: string;
    clockOut: string;
}[]

export type WeekSchedule = {
    [weekStartDate: string]: DaySchedule;
};

export type DaySchedule = {
    [dayOfWeek: number]: TimeEntry[];
};

export type TimeEntry = {
    id: number;
    day: string;
    clockIn: string;
    clockOut: string;
};

export type ActiveState = {
    userId: string | null;
    entryId: number;
    day: string;
    clockIn: string;
    clockOut: string;
};

// Define the type for the navigate options
interface NavigateOptions {
    resolve?: boolean;
    replace?: boolean;
    scroll?: boolean;
    state?: any;
}

// Define the type for the navigate function
export type NavigateFunction = (to: string, options?: NavigateOptions) => void;
