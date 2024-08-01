export const getDateISO = (): string => {
    const isoString = new Date().toISOString();
    return isoString.split('T')[0];
}
