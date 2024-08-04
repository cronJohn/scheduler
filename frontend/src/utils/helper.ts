export const getDateISO = (): string => {
    const isoString = new Date().toISOString();
    return isoString.split('T')[0];
}

export const getDateWithOffset = (startDate: string, offset: number) => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + offset);
  return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
};
