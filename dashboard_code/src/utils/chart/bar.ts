import { getDatePart, getDayAndMonthAbbreviations } from "../miscellaneous/date";

interface usageDataObj {
    name: string;
    type: string;
    userId: string;
    date: string;
}

export const getSimpleSeries = (data: usageDataObj[]): { dayAbbreviations: string[], series: { name: string, data: number[] }[] } => {
    // Extract unique dates (only the date part) and sort them
    const uniqueDates = Array.from(new Set(data.map(item => getDatePart(item.date)))).sort();
    const dayAbbreviations = getDayAndMonthAbbreviations(uniqueDates);

    const counts: { [key: string]: number[] } = {};

    data.forEach(item => {
        const datePart = getDatePart(item.date);
        if (!counts[item.name]) {
            counts[item.name] = new Array(uniqueDates.length).fill(0);
        }
        const index = uniqueDates.indexOf(datePart);
        counts[item.name][index]++;
    });

    return {
        series: Object.keys(counts).map(name => ({
            name,
            data: counts[name]
        })),
        dayAbbreviations
    }
}
