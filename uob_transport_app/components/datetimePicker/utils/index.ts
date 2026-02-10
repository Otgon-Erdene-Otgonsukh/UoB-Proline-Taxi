/**
 * utils/index.ts
 *
 * @license MIT
 * @copyright 2025 김영진 (Kim Young Jin)
 * @author 김영진 (ehfuse@gmail.com)
 */

/** 주 정보 타입 */
export interface WeekInfo {
    weekOfMonth: number; // 해당 월의 몇 번째 주 (1-indexed)
    startDate: Date; // 주의 시작일 (일요일)
    endDate: Date; // 주의 종료일 (토요일)
}

/**
 * 주 정보 계산 (해당 월의 몇 번째 주, 주의 시작일, 종료일)
 * @param date - 계산할 날짜
 * @returns 주 정보 객체
 */
export const getWeekInfo = (date: Date): WeekInfo => {
    const dayOfWeek = date.getDay(); // 0(일) ~ 6(토)

    // 해당 주의 시작일 (일요일)
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - dayOfWeek);
    startDate.setHours(0, 0, 0, 0);

    // 해당 주의 종료일 (토요일)
    const endDate = new Date(date);
    endDate.setDate(date.getDate() + (6 - dayOfWeek));
    endDate.setHours(23, 59, 59, 999);

    // 해당 월의 몇 번째 주인지 계산 (해당 월 1일 기준)
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const weekOfMonth = Math.ceil((date.getDate() + firstDayOfWeek) / 7);

    return { weekOfMonth, startDate, endDate };
};

/**
 * 두 날짜가 같은 주인지 확인
 * @param date1 - 첫 번째 날짜
 * @param date2 - 두 번째 날짜
 * @returns 같은 주이면 true
 */
export const isSameWeek = (date1: Date, date2: Date): boolean => {
    const week1 = getWeekInfo(date1);
    const week2 = getWeekInfo(date2);
    return week1.startDate.getTime() === week2.startDate.getTime();
};

/**
 * 두 날짜가 같은 날인지 확인
 * @param d1 - 첫 번째 날짜
 * @param d2 - 두 번째 날짜
 * @returns 같은 날이면 true
 */
export const isSameDay = (d1: Date | null, d2: Date | null): boolean => {
    if (!d1 || !d2) return false;
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
};
