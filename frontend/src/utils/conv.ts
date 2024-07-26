// convert day index to day name
// itd: integer to day
export const itd = (dayIndex: number) => {
  return ["Sunday", "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dayIndex] || '';
}

// convert 24 hour time to 12 hour time string with am/pm
// mtr: military to regular
export const mtr = (time: string): string => {
    const [hours, minutes] = time.split(":");

    const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    };

    const formatter = new Intl.DateTimeFormat('en-US', options);

    return formatter.format((new Date()).setHours(parseInt(hours), parseInt(minutes)));
}

export const fmtMT = (hours: number) => {
  if (hours < 0 || hours > 23) {
    throw new Error('Invalid time values');
  }

  const formattedHours = String(hours).padStart(2, '0');

  return `${formattedHours}:00`;
}
