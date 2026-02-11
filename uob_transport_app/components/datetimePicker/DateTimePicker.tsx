import { useState, useEffect } from "react";
import { Popover } from "@mui/material";
import type { PopoverProps } from "@mui/material/Popover";
import type { SxProps, Theme } from "@mui/material/styles";
import { SimpleCalendar } from "./SimpleCalendar";
import type { DateTimePickerProps, TimeValue, AnchorElType } from "./types";
import { defaultLocale } from "./locale";

function resolveAnchorEl(
    anchorEl: AnchorElType | undefined,
): PopoverProps["anchorEl"] {
    if (!anchorEl) return null;

    if (typeof anchorEl === "object" && "current" in anchorEl) {
        return anchorEl.current;
    }
    return anchorEl;
}

export function DateTimePicker({
    open,
    onClose,
    anchorEl,
    selectedDate,
    onDateChange,
    timeValue,
    onTimeChange,
    minDate,
    maxDate,
    holidays = [],
    styles,
    showToday = true,
    showFooter = true,
    autoApply = false,
    timeFormat = "HH:mm",
    minTime,
    maxTime,
    minuteStep = 1,
    secondStep = 1,
    hideDisabledTime = false,
    anchorOrigin = { vertical: "bottom", horizontal: "left" },
    transformOrigin = { vertical: "top", horizontal: "left" },
    slotProps,
    locale = defaultLocale,
    texts,
    onMonthChange,
    onYearChange,
    onWeekChange,
    ...popoverProps
}: DateTimePickerProps) {
    const hasSeconds = timeFormat === "HH:mm:ss" || timeFormat === "hh:mm:ss";


    const resolvedAnchorEl = resolveAnchorEl(anchorEl);


    const [tempDate, setTempDate] = useState<Date | null>(selectedDate ?? null);


    const [tempTime, setTempTime] = useState<TimeValue>(() => {
        if (timeValue) return timeValue;
        const now = new Date();
        return {
            hour: String(now.getHours()).padStart(2, "0"),
            minute: String(
                Math.floor(now.getMinutes() / minuteStep) * minuteStep,
            ).padStart(2, "0"),
            second: hasSeconds
                ? String(
                    Math.floor(now.getSeconds() / secondStep) * secondStep,
                ).padStart(2, "0")
                : undefined,
        };
    });


    useEffect(() => {
        if (open) {
            setTempDate(selectedDate ?? null);
            if (timeValue) {
                setTempTime(timeValue);
            } else {
                const now = new Date();
                setTempTime({
                    hour: String(now.getHours()).padStart(2, "0"),
                    minute: String(
                        Math.floor(now.getMinutes() / minuteStep) * minuteStep,
                    ).padStart(2, "0"),
                    second: hasSeconds
                        ? String(
                            Math.floor(now.getSeconds() / secondStep) *
                            secondStep,
                        ).padStart(2, "0")
                        : undefined,
                });
            }
        }
    }, [open, selectedDate, timeValue, minuteStep, secondStep, hasSeconds]);


    const prevYear = selectedDate?.getFullYear();
    const prevMonth = selectedDate?.getMonth();


    const handleDateSelect = (date: Date) => {
        setTempDate(date);

        onDateChange?.(date);


        const newYear = date.getFullYear();
        const newMonth = date.getMonth();
        if (prevYear !== newYear) {
            onYearChange?.(newYear);
        }
        if (prevYear !== newYear || prevMonth !== newMonth) {
            onMonthChange?.(newYear, newMonth + 1);
        }
    };


    const handleCalendarTimeChange = (
        hour: number,
        minute: number,
        second?: number,
    ) => {
        const newTime = {
            hour: String(hour).padStart(2, "0"),
            minute: String(minute).padStart(2, "0"),
            second:
                second !== undefined
                    ? String(second).padStart(2, "0")
                    : undefined,
        };
        setTempTime(newTime);


        onTimeChange?.(newTime.hour, newTime.minute, newTime.second);
    };


    const width = 300 + (hasSeconds ? 165 : 110);
    const height = showFooter ? 380 : 332;

    return (
        <Popover
            open={open}
            anchorEl={resolvedAnchorEl}
            onClose={onClose}
            anchorOrigin={anchorOrigin}
            transformOrigin={transformOrigin}
            {...popoverProps}
            slotProps={{
                ...slotProps,
                paper: {
                    ...slotProps?.paper,
                    sx: {
                        mt: 1,
                        borderRadius: 2,
                        boxShadow: 3,
                        width,
                        height,
                        overflow: "hidden",
                        userSelect: "none",
                        ...((slotProps?.paper as { sx?: SxProps<Theme> })?.sx ??
                            {}),
                    },
                },
            }}
        >
            <SimpleCalendar
                selectedDate={tempDate}
                onSelect={handleDateSelect}
                onClose={onClose}
                minDate={minDate}
                maxDate={maxDate}
                holidays={holidays}
                styles={styles}
                showToday={showToday}
                showFooter={showFooter}
                autoApply={autoApply}
                showTimePicker={true}
                timeValue={tempTime}
                onTimeChange={handleCalendarTimeChange}
                timeFormat={timeFormat}
                minTime={minTime}
                maxTime={maxTime}
                minuteStep={minuteStep}
                secondStep={secondStep}
                hideDisabledTime={hideDisabledTime}
                locale={locale}
                texts={texts}

                onWeekChange={onWeekChange}
            />
        </Popover>
    );
}
