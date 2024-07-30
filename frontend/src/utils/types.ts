export type ScheduleRequest = {
    user_id?: string
    id?: number
    week_start_date?: string
    old_week_start_date?: string
    day_of_week?: number
    clock_in?: string
    clock_out?: string
}

export type UserResponse = {
    id: string
    name: string
    role: string
}

export type ScheduleData = {
    [date: string]: DaySchedule;
}

export type DaySchedule = {
    [key: string]: ScheduleEntry[];
}

export type ScheduleEntry = {
  ID: number;
  ClockIn: string;
  ClockOut: string;
}
