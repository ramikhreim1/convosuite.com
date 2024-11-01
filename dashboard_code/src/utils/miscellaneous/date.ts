const daysOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export const getDatePart = (dateString: string) => dateString.split('T')[0];

export const getDayAbbreviations = (dateStrings: string[]) => {
    return dateStrings.map(dateString => {
        const dayIndex = new Date(dateString).getDay();
        return daysOfWeek[dayIndex];
    });
}

export const getDayAndMonthAbbreviations = (dateStrings: string[]): string[] => {
    const monthsOfYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return dateStrings.map(dateString => {
        const date = new Date(dateString);
        const day = date.getDate();
        const monthAbbreviation = monthsOfYear[date.getMonth()];

        return `${day} ${monthAbbreviation}`;
    });
};
