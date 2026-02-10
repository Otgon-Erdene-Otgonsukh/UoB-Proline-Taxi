/**
 * types.ts
 *
 * @license MIT
 * @copyright 2025 김영진 (Kim Young Jin)
 * @author 김영진 (ehfuse@gmail.com)
 */

import type { PopoverProps } from "@mui/material";
import type { RefObject } from "react";

/** 앵커 엘리먼트 타입 (ref 객체도 허용) */
export type AnchorElType =
    | PopoverProps["anchorEl"]
    | RefObject<HTMLElement | null>;

/** 뷰 모드 타입 */
export type ViewMode = "calendar" | "year" | "month";

/** 시간 포맷 타입 */
export type TimeFormat = "HH:mm" | "HH:mm:ss" | "hh:mm" | "hh:mm:ss";

/** 시간 값 타입 */
export interface TimeValue {
    hour: string; // 시 (00-23 또는 01-12)
    minute: string; // 분 (00-59)
    second?: string; // 초 (00-59, 선택적)
}

/** @deprecated DateTimePickerMode는 더 이상 사용되지 않습니다. DatePicker 또는 DateTimePicker를 직접 사용하세요. */
export type DateTimePickerMode = "date" | "time" | "datetime";

// locale 관련 타입은 locale.ts에서 re-export
export type { CalendarTexts, LocaleKey, LocaleProp } from "./locale";

import type { CalendarTexts, LocaleProp } from "./locale";

export {
    defaultLocale,
    locales,
    resolveLocale,
    koLocale,
    enLocale,
    jaLocale,
    zhCNLocale,
    zhTWLocale,
    esLocale,
    frLocale,
    deLocale,
    ptLocale,
    ruLocale,
    itLocale,
    arLocale,
    hiLocale,
    viLocale,
    thLocale,
    idLocale,
    nlLocale,
    plLocale,
    trLocale,
} from "./locale";

/** 캘린더 스타일 옵션 */
export interface CalendarStyles {
    selectedColor?: string; // 선택된 날짜 배경 색상 (기본값: 'primary.main')
    todayBorderColor?: string; // 오늘 날짜 테두리 색상 (기본값: selectedColor)
    holidayColor?: string; // 공휴일/일요일 텍스트 색상 (기본값: 'error.main')
    saturdayColor?: string; // 토요일 텍스트 색상 (기본값: 'primary.main')
}

/** SimpleCalendar 컴포넌트 Props */
export interface SimpleCalendarProps {
    selectedDate: Date | null; // 선택된 날짜
    onSelect: (date: Date) => void; // 날짜 선택 콜백
    minDate?: Date; // 선택 가능한 최소 날짜
    maxDate?: Date; // 선택 가능한 최대 날짜
    holidays?: Date[]; // 공휴일 배열
    styles?: CalendarStyles; // 스타일 옵션
    onClose: () => void; // 닫기 콜백
    showToday?: boolean; // 오늘 버튼 표시 여부
    showFooter?: boolean; // 푸터 표시 여부 (기본값: true)
    autoApply?: boolean; // 선택 즉시 적용 여부 (기본값: false)
    monthOnly?: boolean; // 년월만 선택 (기본값: false)
    yearOnly?: boolean; // 년도만 선택 (기본값: false)
    onMonthChange?: (year: number, month: number) => void; // 년월 변경 콜백
    onYearChange?: (year: number) => void; // 년도 변경 콜백
    onWeekChange?: (
        weekOfMonth: number,
        startDate: Date,
        endDate: Date
    ) => void; // 주 변경 콜백 (해당 월의 몇번째 주, 시작일, 종료일)
    showTimePicker?: boolean; // 시간 선택 표시 여부
    timeValue?: TimeValue; // 시간 값
    onTimeChange?: (hour: number, minute: number, second?: number) => void; // 시간 변경 콜백
    timeFormat?: TimeFormat; // 시간 포맷
    minTime?: string; // 선택 가능한 최소 시간 (HH:mm 또는 HH:mm:ss)
    maxTime?: string; // 선택 가능한 최대 시간 (HH:mm 또는 HH:mm:ss)
    minuteStep?: number; // 분 단위 간격 (기본값: 1)
    secondStep?: number; // 초 단위 간격 (기본값: 1)
    hideDisabledTime?: boolean; // 선택 불가 시간 숨김 여부
    locale?: LocaleProp; // 로케일 (기본값: 'ko')
    texts?: CalendarTexts; // 텍스트 부분 커스터마이징
}

/** TimePicker 컴포넌트 Props */
export interface TimePickerProps {
    anchorEl?: AnchorElType; // Popover 앵커 엘리먼트 (ref 객체도 가능)
    open: boolean; // 열림 상태
    onClose: () => void; // 닫기 콜백
    value: TimeValue; // 시간 값
    onChange: (hour: string, minute: string, second?: string) => void; // 시간 변경 콜백
    format: TimeFormat; // 시간 포맷
    minTime?: string; // 선택 가능한 최소 시간
    maxTime?: string; // 선택 가능한 최대 시간
    minuteStep?: number; // 분 단위 간격
    secondStep?: number; // 초 단위 간격
    hideDisabledTime?: boolean; // 선택 불가 시간 숨김 여부
    autoApply?: boolean; // 선택 즉시 적용 여부 (기본값: false)
    locale?: LocaleProp; // 로케일 (기본값: 'ko')
    texts?: CalendarTexts; // 텍스트 부분 커스터마이징
}

/** TimeSelector 컴포넌트 Props */
export interface TimeSelectorProps {
    value: TimeValue; // 시간 값
    onChange: (hour: number, minute: number, second?: number) => void; // 시간 변경 콜백
    format: TimeFormat; // 시간 포맷
    minTime?: string; // 선택 가능한 최소 시간
    maxTime?: string; // 선택 가능한 최대 시간
    minuteStep?: number; // 분 단위 간격 (기본값: 1)
    secondStep?: number; // 초 단위 간격 (기본값: 1)
    showHeader?: boolean; // 상단 시간 표시 헤더 (기본값: true)
    hideDisabledTime?: boolean; // 선택 불가 시간 숨김 여부 (기본값: false)
}

/** DatePicker 컴포넌트 Props (날짜만 선택) */
export interface DatePickerProps
    extends Omit<PopoverProps, "children" | "onClose" | "anchorEl"> {
    anchorEl?: AnchorElType; // Popover 앵커 엘리먼트 (ref 객체도 가능)
    onClose: () => void; // 닫기 콜백
    selectedDate?: Date | null; // 선택된 날짜
    onDateChange?: (date: Date) => void; // 날짜 변경 콜백
    onMonthChange?: (year: number, month: number) => void; // 년월 변경 콜백 (네비게이션 시)
    onYearChange?: (year: number) => void; // 년도 변경 콜백 (네비게이션 시)
    onWeekChange?: (
        weekOfMonth: number,
        startDate: Date,
        endDate: Date
    ) => void; // 주 변경 콜백
    minDate?: Date; // 선택 가능한 최소 날짜
    maxDate?: Date; // 선택 가능한 최대 날짜
    holidays?: Date[]; // 공휴일 배열
    styles?: CalendarStyles; // 스타일 옵션
    showToday?: boolean; // 오늘 버튼 표시 여부
    showFooter?: boolean; // 푸터 표시 여부 (기본값: true)
    autoApply?: boolean; // 선택 즉시 적용 여부 (기본값: false)
    locale?: LocaleProp; // 로케일 (기본값: 'ko')
    texts?: CalendarTexts; // 텍스트 부분 커스터마이징
    monthOnly?: boolean; // 년월만 선택 (기본값: false)
    yearOnly?: boolean; // 년도만 선택 (기본값: false)
}

/** DateTimePicker 컴포넌트 Props (날짜 + 시간 선택) */
export interface DateTimePickerProps
    extends Omit<PopoverProps, "children" | "onClose" | "anchorEl"> {
    anchorEl?: AnchorElType; // Popover 앵커 엘리먼트 (ref 객체도 가능)
    onClose: () => void; // 닫기 콜백
    selectedDate?: Date | null; // 선택된 날짜
    onDateChange?: (date: Date) => void; // 날짜 변경 콜백
    onMonthChange?: (year: number, month: number) => void; // 년월 변경 콜백 (네비게이션 시)
    onYearChange?: (year: number) => void; // 년도 변경 콜백 (네비게이션 시)
    onTimeChange?: (hour: string, minute: string, second?: string) => void; // 시간 변경 콜백
    onWeekChange?: (
        weekOfMonth: number,
        startDate: Date,
        endDate: Date
    ) => void; // 주 변경 콜백
    timeValue?: TimeValue; // 시간 값
    minDate?: Date; // 선택 가능한 최소 날짜
    maxDate?: Date; // 선택 가능한 최대 날짜
    holidays?: Date[]; // 공휴일 배열
    styles?: CalendarStyles; // 스타일 옵션
    showToday?: boolean; // 오늘 버튼 표시 여부
    showFooter?: boolean; // 푸터 표시 여부 (기본값: true)
    autoApply?: boolean; // 선택 즉시 적용 여부 (기본값: false)
    timeFormat?: TimeFormat; // 시간 포맷
    minTime?: string; // 선택 가능한 최소 시간
    maxTime?: string; // 선택 가능한 최대 시간
    minuteStep?: number; // 분 단위 간격
    secondStep?: number; // 초 단위 간격
    hideDisabledTime?: boolean; // 선택 불가 시간 숨김 여부
    locale?: LocaleProp; // 로케일 (기본값: 'ko')
    texts?: CalendarTexts; // 텍스트 부분 커스터마이징
}
