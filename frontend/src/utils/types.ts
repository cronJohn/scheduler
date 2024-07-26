export type ScheduleRequest = {
    user_id?: string
    id?: number
    week_start_date?: string
    day_of_week?: number
    clock_in?: string
    clock_out?: string
}

export interface ScheduleEntry {
  ID: number;
  ClockIn: string;
  ClockOut: string;
}

export interface DaySchedule {
  [key: string]: ScheduleEntry[];
}

export interface ScheduleData {
  [date: string]: DaySchedule;
}
