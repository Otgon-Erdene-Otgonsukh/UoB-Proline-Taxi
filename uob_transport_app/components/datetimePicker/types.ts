import type { PopoverProps } from "@mui/material";
import type { RefObject } from "react";

export type AnchorElType =
    | PopoverProps["anchorEl"]
    | RefObject<HTMLElement | null>;

export type ViewMode = "calendar" | "year" | "month";

export type TimeFormat = "HH:mm" | "HH:mm:ss" | "hh:mm" | "hh:mm:ss";
export interface TimeValue {
    hour: string;
    minute: string;
    second?: string;
}

/** @deprecated DateTimePickerMode is not used any more. Please use DatePicker or DateTimePicker. */
export type DateTimePickerMode = "date" | "time" | "datetime";

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

export interface CalendarStyles {
    selectedColor?: string;
    todayBorderColor?: string;
    holidayColor?: string;
    saturdayColor?: string;
}

export interface SimpleCalendarProps {
    selectedDate: Date | null;
    onSelect: (date: Date) => void;
    minDate?: Date;
    maxDate?: Date;
    holidays?: Date[];
    styles?: CalendarStyles;
    onClose: () => void;
    showToday?: boolean;
    showFooter?: boolean;
    autoApply?: boolean;
    monthOnly?: boolean;
    yearOnly?: boolean;
    onMonthChange?: (year: number, month: number) => void;
    onYearChange?: (year: number) => void;
    onWeekChange?: (
        weekOfMonth: number,
        startDate: Date,
        endDate: Date
    ) => void;
    showTimePicker?: boolean;
    timeValue?: TimeValue;
    onTimeChange?: (hour: number, minute: number, second?: number) => void;
    timeFormat?: TimeFormat;
    minTime?: string;
    maxTime?: string;
    minuteStep?: number;
    secondStep?: number;
    hideDisabledTime?: boolean;
    locale?: LocaleProp;
    texts?: CalendarTexts;
}

export interface TimePickerProps {
    anchorEl?: AnchorElType;
    open: boolean;
    onClose: () => void;
    value: TimeValue;
    onChange: (hour: string, minute: string, second?: string) => void;
    format: TimeFormat;
    minTime?: string;
    maxTime?: string;
    minuteStep?: number;
    secondStep?: number;
    hideDisabledTime?: boolean;
    autoApply?: boolean;
    locale?: LocaleProp;
    texts?: CalendarTexts;
}

export interface TimeSelectorProps {
    value: TimeValue;
    onChange: (hour: number, minute: number, second?: number) => void;
    format: TimeFormat;
    minTime?: string;
    maxTime?: string;
    minuteStep?: number;
    secondStep?: number;
    showHeader?: boolean;
    hideDisabledTime?: boolean;
}

export interface DatePickerProps
    extends Omit<PopoverProps, "children" | "onClose" | "anchorEl"> {
    anchorEl?: AnchorElType;
    onClose: () => void;
    selectedDate?: Date | null;
    onDateChange?: (date: Date) => void;
    onMonthChange?: (year: number, month: number) => void;
    onYearChange?: (year: number) => void;
    onWeekChange?: (
        weekOfMonth: number,
        startDate: Date,
        endDate: Date
    ) => void;
    minDate?: Date;
    maxDate?: Date;
    holidays?: Date[];
    styles?: CalendarStyles;
    showToday?: boolean;
    showFooter?: boolean;
    autoApply?: boolean;
    locale?: LocaleProp;
    texts?: CalendarTexts;
    monthOnly?: boolean;
    yearOnly?: boolean;
}

export interface DateTimePickerProps
    extends Omit<PopoverProps, "children" | "onClose" | "anchorEl"> {
    anchorEl?: AnchorElType;
    onClose: () => void;
    selectedDate?: Date | null;
    onDateChange?: (date: Date) => void;
    onMonthChange?: (year: number, month: number) => void;
    onYearChange?: (year: number) => void;
    onTimeChange?: (hour: string, minute: string, second?: string) => void;
    onWeekChange?: (
        weekOfMonth: number,
        startDate: Date,
        endDate: Date
    ) => void;
    timeValue?: TimeValue;
    minDate?: Date;
    maxDate?: Date;
    holidays?: Date[];
    styles?: CalendarStyles;
    showToday?: boolean;
    showFooter?: boolean;
    autoApply?: boolean;
    timeFormat?: TimeFormat;
    minTime?: string;
    maxTime?: string;
    minuteStep?: number;
    secondStep?: number;
    hideDisabledTime?: boolean;
    locale?: LocaleProp;
    texts?: CalendarTexts;
}
