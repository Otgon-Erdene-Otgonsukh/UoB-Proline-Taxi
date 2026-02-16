export interface WeekInfo {
    weekOfMonth: number;
    startDate: Date;
    endDate: Date;
}

export const getWeekInfo = (date: Date): WeekInfo => {
    const dayOfWeek = date.getDay();

    const startDate = new Date(date);
    startDate.setDate(date.getDate() - dayOfWeek);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setDate(date.getDate() + (6 - dayOfWeek));
    endDate.setHours(23, 59, 59, 999);

    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const weekOfMonth = Math.ceil((date.getDate() + firstDayOfWeek) / 7);

    return { weekOfMonth, startDate, endDate };
};

export const isSameWeek = (date1: Date, date2: Date): boolean => {
    const week1 = getWeekInfo(date1);
    const week2 = getWeekInfo(date2);
    return week1.startDate.getTime() === week2.startDate.getTime();
};

export const isSameDay = (d1: Date | null, d2: Date | null): boolean => {
    if (!d1 || !d2) return false;
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
};
