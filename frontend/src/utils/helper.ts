import { Schedule, WeekSchedule } from "./types";

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
    const currentDayOfWeek = date.getUTCDay();

    let diff = targetDayOfWeek - currentDayOfWeek;

    if (diff > 0) { diff -= 7 }

    date.setUTCDate(date.getUTCDate() + diff);

    return date.toISOString().split('T')[0]; // Return the date in YYYY-MM-DD format
};

export const groupSchedulesByWeek = (schedules: Schedule[]): WeekSchedule => {
    const weekMap: WeekSchedule = {};

    schedules.forEach(schedule => {
        const weekStartDate = nearestStartOfWeek(schedule.day, Number(import.meta.env.VITE_WEEK_START) || 3);
        const dayOfWeek = new Date(schedule.day).getUTCDay();

        if (!weekMap[weekStartDate]) {
            weekMap[weekStartDate] = {};
        }

        if (!weekMap[weekStartDate][dayOfWeek]) {
            weekMap[weekStartDate][dayOfWeek] = [];
        }

        weekMap[weekStartDate][dayOfWeek].push({
            scheduleId: schedule.scheduleId,
            userId: schedule.userId,
            role: schedule.role,
            day: schedule.day,
            clockIn: schedule.clockIn,
            clockOut: schedule.clockOut
        });
    });

    return weekMap;
};

export function displayCurrentOrPrevWeek(weekStartDate: string): string {
    return nearestStartOfWeek(getDateISO(), Number(import.meta.env.VITE_WEEK_START) || 3) == weekStartDate ? 'This week' : 'Week of';
}

export function isUserAuthenticated(): boolean {
    return document.cookie.split(';').some(cookie => cookie.trim().startsWith(`auth=`));
}

export function getColorFromString(
    string: string, 
    saturation: number = 95, 
    lightness: number = 70, 
    defaultColor: string = '#000000'
): string {
    // Check if the string is empty or has less than 3 characters
    if (!string || string.trim().length < 3) {
        return defaultColor;
    }

    // Calculate the hue value based on the first three characters of the string
    const hue = string.charCodeAt(0) * string.charCodeAt(1) * string.charCodeAt(2);

    // Convert the saturation and lightness values from percentages to decimals between 0 and 1
    const s = saturation / 100;
    const l = lightness / 100;

    // Calculate the alpha value
    const a = s * Math.min(l, 1 - l);

    // Calculate the red, green, and blue values
    const f = (n: number) => {
        const k = (n + hue / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };

    // Return the hex color code
    return `#${f(0)}${f(8)}${f(4)}` || defaultColor;
}
