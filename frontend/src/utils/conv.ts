// convert day index to day name
// itd: integer to day
const itd = (dayIndex: number) => {
  return ["Sunday", "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dayIndex] || '';
}

// convert 24 hour time to 12 hour time string with am/pm
// mtr: military to regular
const mtr = (time: number): string => {
    return ["12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM"][time] || '';
}

export {
  itd, mtr
}