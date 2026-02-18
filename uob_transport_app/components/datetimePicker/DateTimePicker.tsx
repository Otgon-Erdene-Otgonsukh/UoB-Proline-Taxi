import { useState, useEffect } from "react";
import { Popover } from "@mui/material";
import type { PopoverProps } from "@mui/material/Popover";
import type { SxProps, Theme } from "@mui/material/styles";
import { SimpleCalendar } from "./SimpleCalendar";
import type { DateTimePickerProps, AnchorElType } from "./types";
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
    minDate,
    maxDate,
    holidays = [],
    styles,
    showToday = true,
    showFooter = true,
    autoApply = false,
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


    const resolvedAnchorEl = resolveAnchorEl(anchorEl);

    const [tempDate, setTempDate] = useState<Date | null>(selectedDate ?? null);

    useEffect(() => {
        if (open) {
            setTempDate(selectedDate ?? null);
        }
    }, [open, selectedDate]);


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

    const width = 300;
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
                showTimePicker={false}
                locale={locale}
                texts={texts}
                onWeekChange={onWeekChange}
            />
        </Popover>
    );
}
