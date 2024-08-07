import { TimeEntry, WeekSchedule } from "./types";

export const getDateISO = (): string => {
    const isoString = new Date().toISOString();
    return isoString.split('T')[0];
}

export const getDateWithOffset = (startDate: string, offset: number) => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + offset);
  return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
};

export const nearestStartOfWeek = (dateString: string, targetDayOfWeek: number): string => {
    if (targetDayOfWeek < 0 || targetDayOfWeek > 6) {
        throw new Error('Invalid dayOfWeek: must be between 0 and 6');
    }

    const date = new Date(dateString);
    const currentDayOfWeek = date.getDay();

    const diff = targetDayOfWeek - currentDayOfWeek;
    let timeDelta: Number = 0;

    if (diff <= 0) {
        timeDelta = diff;
    } else {
        timeDelta = diff - 7;
    }

    date.setUTCDate(date.getUTCDate() + diff);
    return date.toISOString().split('T')[0]; // Return the date in YYYY-MM-DD format
};

export const groupSchedulesByWeek = (schedules: TimeEntry[]): WeekSchedule => {
    const weekMap: WeekSchedule = {};

    schedules.forEach(schedule => {
        const weekStartDate = nearestStartOfWeek(schedule.day, Number(import.meta.env.VITE_WEEK_START) || 0);
        const dayOfWeek = new Date(schedule.day).getDay();

        if (!weekMap[weekStartDate]) {
            weekMap[weekStartDate] = {};
        }

        if (!weekMap[weekStartDate][dayOfWeek]) {
            weekMap[weekStartDate][dayOfWeek] = [];
        }

        weekMap[weekStartDate][dayOfWeek].push({
            id: schedule.id,
            day: schedule.day,
            clockIn: schedule.clockIn,
            clockOut: schedule.clockOut
        });
    });

    return weekMap;
};

