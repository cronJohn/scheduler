export type UserResponse = {
    id: string
    name: string
    role: string
}

export type WeekSchedule = {
    [week_start_date: string]: DaySchedule;
};

export type DaySchedule = {
    [day_of_week: number]: TimeEntry[];
};

export type TimeEntry = {
    id: number;
    clockIn: string;
    clockOut: string;
};

export type ActiveState = {
    userId: string | null;
    entryId: number;
    weekStartDate: string;
    dayOfWeek: number;
    clockIn: string;
    clockOut: string;
}
