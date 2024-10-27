export type User = {
    userId: string;
    name: string;
}

export type Schedule = {
    scheduleId: number;
    userId: string;
    role: string;
    day: string;
    clockIn: string;
    clockOut: string;
}

export type WeekSchedule = {
    [weekStartDate: string]: DaySchedule;
};

export type DaySchedule = {
    [dayOfWeek: number]: Schedule[];
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
