/**
 * DateTimePicker.tsx
 * Popover 기반 날짜 + 시간 선택 컴포넌트
 *
 * @license MIT
 * @copyright 2025 김영진 (Kim Young Jin)
 * @author 김영진 (ehfuse@gmail.com)
 */

import { useState, useEffect } from "react";
import { Popover } from "@mui/material";
import type { PopoverProps } from "@mui/material/Popover";
import type { SxProps, Theme } from "@mui/material/styles";
import { SimpleCalendar } from "./SimpleCalendar";
import type { DateTimePickerProps, TimeValue, AnchorElType } from "./types";
import { defaultLocale } from "./locale";

// anchorEl이 RefObject인지 확인하고 실제 엘리먼트 반환
function resolveAnchorEl(
    anchorEl: AnchorElType | undefined,
): PopoverProps["anchorEl"] {
    if (!anchorEl) return null;
    // RefObject current 
    if (typeof anchorEl === "object" && "current" in anchorEl) {
        return anchorEl.current;
    }
    return anchorEl;
}

/**
 * DateTimePicker - Popover 기반 날짜 + 시간 선택 컴포넌트
 *
 * 날짜와 시간을 함께 선택할 때 사용합니다.
 * 날짜만 선택하려면 DatePicker를, 시간만 선택하려면 TimePicker를 사용하세요.
 */
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
    // 로케일 관련
    locale = defaultLocale,
    texts,
    // 년월/년도 변경 콜백
    onMonthChange,
    onYearChange,
    onWeekChange,
    ...popoverProps
}: DateTimePickerProps) {
    const hasSeconds = timeFormat === "HH:mm:ss" || timeFormat === "hh:mm:ss";

    // anchorEl 해석
    const resolvedAnchorEl = resolveAnchorEl(anchorEl);

    // 내부 임시 날짜 상태
    const [tempDate, setTempDate] = useState<Date | null>(selectedDate ?? null);

    // 내부 임시 시간 상태
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

    // open될 때 외부 값으로 초기화
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

    // 이전에 선택된 날짜의 년/월 추적 (이벤트 발생 여부 판단용)
    const prevYear = selectedDate?.getFullYear();
    const prevMonth = selectedDate?.getMonth();

    // 날짜 선택 핸들러 (SimpleCalendar에서 호출)
    const handleDateSelect = (date: Date) => {
        setTempDate(date);
        // 날짜가 선택되면 항상 콜백 호출 (확인 버튼에서도 호출됨)
        onDateChange?.(date);

        // 날짜 선택 시 년/월 변경 콜백 발생 (이전 날짜와 비교)
        const newYear = date.getFullYear();
        const newMonth = date.getMonth();
        if (prevYear !== newYear) {
            onYearChange?.(newYear);
        }
        if (prevYear !== newYear || prevMonth !== newMonth) {
            onMonthChange?.(newYear, newMonth + 1);
        }
    };

    // SimpleCalendar에서 시간 변경
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

        // 시간이 변경되면 항상 콜백 호출 (확인 버튼에서도 호출됨)
        onTimeChange?.(newTime.hour, newTime.minute, newTime.second);
    };

    // 팝오버 크기 결정 (datetime 전용)
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
                // DateTimePicker는 일반 모드만 있으므로 날짜 선택 시에만 년/월 이벤트 발생
                onWeekChange={onWeekChange}
            />
        </Popover>
    );
}
