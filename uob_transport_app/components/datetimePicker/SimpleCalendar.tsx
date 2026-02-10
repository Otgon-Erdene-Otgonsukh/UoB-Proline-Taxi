/**
 * SimpleCalendar.tsx
 *
 * @license MIT
 * @copyright 2025 김영진 (Kim Young Jin)
 * @author 김영진 (ehfuse@gmail.com)
 */

import React, {
    useState,
    useMemo,
    useEffect,
    useRef,
    useCallback,
} from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { ChevronLeft, ChevronRight } from "./icons";
import { OverlayScrollbar } from "@ehfuse/overlay-scrollbar";
import type { OverlayScrollbarRef } from "@ehfuse/overlay-scrollbar";
import { TimeSelector } from "./TimeSelector";
import type { SimpleCalendarProps, ViewMode } from "./types";
import { resolveLocale } from "./locale";
import { getWeekInfo, isSameDay, isSameWeek } from "./utils";

// 상수
const HEADER_HEIGHT = 48;
const FOOTER_HEIGHT = 48;

/**
 * 간단한 MUI 스타일 달력 컴포넌트
 *
 * 구조:
 * calendar-root (flex column, 100% height)
 * ├── calendar-header (공통, 고정 높이 40px)
 * │   - viewMode에 따라 내용 변경
 * ├── calendar-content (flex: 1)
 * │   - [calendar] 요일 헤더 + 날짜 그리드
 * │   - [year] 연도 그리드 (OverlayScrollbar)
 * │   - [month] 월 그리드
 * └── calendar-footer (공통, 고정 높이 40px)
 *     - viewMode에 따라 버튼 변경
 */
export function SimpleCalendar({
    selectedDate,
    onSelect,
    minDate,
    maxDate,
    holidays = [],
    styles,
    onClose,
    showToday = true,
    showFooter: showFooterProp = true,
    autoApply = false,
    // 년월만 선택
    monthOnly = false,
    // 년도만 선택
    yearOnly = false,
    // 년월/년도 변경 콜백
    onMonthChange,
    onYearChange,
    onWeekChange,
    // 시간 선택 관련
    showTimePicker = false,
    timeValue,
    onTimeChange,
    timeFormat = "HH:mm",
    minTime,
    maxTime,
    minuteStep = 1,
    secondStep = 1,
    hideDisabledTime = false,
    // 로케일 관련
    locale,
    texts,
}: SimpleCalendarProps) {
    // 스타일 옵션 추출 (기본값 적용)
    const selectedColor = styles?.selectedColor ?? "primary.main";
    const todayBorderColor = styles?.todayBorderColor ?? selectedColor;
    const holidayColor = styles?.holidayColor ?? "error.main";
    const saturdayColor = styles?.saturdayColor ?? "primary.main";

    // 로케일 해석 및 병합 (texts가 있으면 부분 덮어쓰기)
    const resolvedLocale = resolveLocale(locale);
    const mergedLocale = useMemo(
        () => (texts ? { ...resolvedLocale, ...texts } : resolvedLocale),
        [resolvedLocale, texts],
    );

    // 유효하지 않은 Date 필터링
    const validHolidays = useMemo(
        () => holidays.filter((d) => d instanceof Date && !isNaN(d.getTime())),
        [holidays],
    );

    const today = new Date();
    const [viewDate, setViewDate] = useState(() => {
        if (selectedDate) return new Date(selectedDate);
        return new Date(today.getFullYear(), today.getMonth(), 1);
    });
    // yearOnly일 때는 year 뷰로, monthOnly일 때는 month 뷰로 시작
    const [viewMode, setViewMode] = useState<ViewMode>(
        yearOnly ? "year" : monthOnly ? "month" : "calendar",
    );
    const [tempYear, setTempYear] = useState<number>(viewDate.getFullYear());
    // monthOnly 모드에서 임시 월 상태 (autoApply가 false일 때 사용)
    const [tempMonth, setTempMonth] = useState<number | null>(null);
    // yearOnly 모드에서 임시 년도 상태 (autoApply가 false일 때 사용)
    const [tempSelectedYear, setTempSelectedYear] = useState<number | null>(
        null,
    );
    // 임시 선택 날짜 (확인 버튼 누르기 전까지 보관)
    const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(
        selectedDate,
    );
    // 임시 시간 (확인 버튼 누르기 전까지 보관)
    const [tempTime, setTempTime] = useState<{
        hour: number;
        minute: number;
        second: number;
    }>(() => {
        const h = timeValue ? parseInt(timeValue.hour, 10) : NaN;
        const m = timeValue ? parseInt(timeValue.minute, 10) : NaN;
        const s = timeValue?.second ? parseInt(timeValue.second, 10) : 0;
        const now = new Date();
        return {
            hour: isNaN(h) ? now.getHours() : h,
            minute: isNaN(m)
                ? Math.floor(now.getMinutes() / minuteStep) * minuteStep
                : m,
            second: isNaN(s)
                ? Math.floor(now.getSeconds() / secondStep) * secondStep
                : s,
        };
    });

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    // refs
    const yearScrollRef = useRef<OverlayScrollbarRef>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // 달력 날짜 생성 (항상 42칸 = 6주, 이전/다음 달 포함)
    const calendarDays = useMemo(() => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startPadding = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        const days: Date[] = [];

        // 이전 달 날짜
        const prevMonth = new Date(year, month, 0); // 이전 달 마지막 날
        const prevMonthDays = prevMonth.getDate();
        for (let i = startPadding - 1; i >= 0; i--) {
            days.push(new Date(year, month - 1, prevMonthDays - i));
        }

        // 현재 달
        for (let d = 1; d <= daysInMonth; d++) {
            days.push(new Date(year, month, d));
        }

        // 다음 달 날짜 (42칸 채우기)
        let nextDay = 1;
        while (days.length < 42) {
            days.push(new Date(year, month + 1, nextDay++));
        }

        return days;
    }, [year, month]);

    // 연도 목록 생성 (과거 50년 ~ 미래 50년)
    const yearList = useMemo(() => {
        const currentYear = today.getFullYear();
        const years: number[] = [];
        for (let y = currentYear - 50; y <= currentYear + 50; y++) {
            years.push(y);
        }
        return years;
    }, [today]);

    const isDateDisabled = (date: Date): boolean => {
        const dateOnly = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
        );

        if (minDate) {
            const min = new Date(
                minDate.getFullYear(),
                minDate.getMonth(),
                minDate.getDate(),
            );
            if (dateOnly.getTime() < min.getTime()) return true;
        }
        if (maxDate) {
            const max = new Date(
                maxDate.getFullYear(),
                maxDate.getMonth(),
                maxDate.getDate(),
            );
            if (dateOnly.getTime() > max.getTime()) return true;
        }
        return false;
    };

    // 시간이 변경되었는지 확인
    const isTimeChanged = (
        hour: number,
        minute: number,
        second?: number,
    ): boolean => {
        if (!timeValue) return true;
        const hasSeconds =
            timeFormat === "HH:mm:ss" || timeFormat === "hh:mm:ss";
        if (
            parseInt(timeValue.hour, 10) !== hour ||
            parseInt(timeValue.minute, 10) !== minute
        )
            return true;
        if (hasSeconds && parseInt(timeValue.second || "0", 10) !== second)
            return true;
        return false;
    };

    // 년도가 변경되었는지 확인 (selectedDate 또는 오늘 날짜 기준)
    const isYearChanged = (newYear: number): boolean => {
        const compareDate = selectedDate || today;
        return compareDate.getFullYear() !== newYear;
    };

    // 월이 변경되었는지 확인 (selectedDate 또는 오늘 날짜 기준, month는 1-indexed)
    const isMonthChanged = (newYear: number, newMonth: number): boolean => {
        const compareDate = selectedDate || today;
        return (
            compareDate.getFullYear() !== newYear ||
            compareDate.getMonth() + 1 !== newMonth
        );
    };

    // 주가 변경되었는지 확인
    const isWeekChanged = (date: Date): boolean => {
        const compareDate = selectedDate || today;
        return !isSameWeek(date, compareDate);
    };

    const goToPrevMonth = () => {
        const newDate = new Date(year, month - 1, 1);
        setViewDate(newDate);
        setTempSelectedDate(null);
        // 월 변경 콜백 호출
        onMonthChange?.(newDate.getFullYear(), newDate.getMonth() + 1);
    };

    const goToNextMonth = () => {
        const newDate = new Date(year, month + 1, 1);
        setViewDate(newDate);
        setTempSelectedDate(null);
        // 월 변경 콜백 호출
        onMonthChange?.(newDate.getFullYear(), newDate.getMonth() + 1);
    };

    // 휠 이벤트로 이전/다음 달 이동
    const handleWheel = useCallback(
        (e: React.WheelEvent) => {
            if (viewMode !== "calendar") return;
            e.preventDefault();
            if (e.deltaY > 0) {
                goToNextMonth();
            } else if (e.deltaY < 0) {
                goToPrevMonth();
            }
        },
        [viewMode, year, month],
    );

    const handleDateClick = (date: Date) => {
        if (!isDateDisabled(date)) {
            if (autoApply) {
                // autoApply가 true면 바로 적용 (닫지 않음)
                // 날짜가 변경되었을 때만 이벤트 발생
                if (!isSameDay(selectedDate, date)) {
                    onSelect(date);
                    // 주 변경 콜백 (변경되었을 때만)
                    if (isWeekChanged(date)) {
                        const weekInfo = getWeekInfo(date);
                        onWeekChange?.(
                            weekInfo.weekOfMonth,
                            weekInfo.startDate,
                            weekInfo.endDate,
                        );
                    }
                }
                // 시간 선택이 있으면 시간도 같이 적용 (변경되었을 때만)
                if (
                    showTimePicker &&
                    onTimeChange &&
                    isTimeChanged(
                        tempTime.hour,
                        tempTime.minute,
                        tempTime.second,
                    )
                ) {
                    const hasSeconds =
                        timeFormat === "HH:mm:ss" || timeFormat === "hh:mm:ss";
                    onTimeChange(
                        tempTime.hour,
                        tempTime.minute,
                        hasSeconds ? tempTime.second : undefined,
                    );
                }
            } else {
                setTempSelectedDate(date);
            }
        }
    };

    const handleTodayClick = () => {
        if (!isDateDisabled(today)) {
            const todayYear = today.getFullYear();
            const todayMonth = today.getMonth();

            if (autoApply) {
                // autoApply가 true면 바로 적용 (닫지 않음)
                // 현재 viewDate와 비교해서 년/월 이벤트 발생
                if (year !== todayYear) {
                    onYearChange?.(todayYear);
                }
                if (year !== todayYear || month !== todayMonth) {
                    onMonthChange?.(todayYear, todayMonth + 1);
                }
                // 날짜가 변경되었을 때만 onSelect 발생
                if (!isSameDay(selectedDate, today)) {
                    onSelect(today);
                }
                // 시간 선택이 있으면 시간도 같이 적용 (변경되었을 때만)
                if (
                    showTimePicker &&
                    onTimeChange &&
                    isTimeChanged(
                        tempTime.hour,
                        tempTime.minute,
                        tempTime.second,
                    )
                ) {
                    const hasSeconds =
                        timeFormat === "HH:mm:ss" || timeFormat === "hh:mm:ss";
                    onTimeChange(
                        tempTime.hour,
                        tempTime.minute,
                        hasSeconds ? tempTime.second : undefined,
                    );
                }
                setViewDate(new Date(todayYear, todayMonth, 1));
            } else {
                setTempSelectedDate(today);
                setViewDate(new Date(todayYear, todayMonth, 1));
            }
        }
    };

    const handleConfirm = () => {
        if (tempSelectedDate) {
            // 날짜가 변경되었을 때만 이벤트 발생
            if (!isSameDay(selectedDate, tempSelectedDate)) {
                onSelect(tempSelectedDate);
                // 주 변경 콜백 (변경되었을 때만)
                if (isWeekChanged(tempSelectedDate)) {
                    const weekInfo = getWeekInfo(tempSelectedDate);
                    onWeekChange?.(
                        weekInfo.weekOfMonth,
                        weekInfo.startDate,
                        weekInfo.endDate,
                    );
                }
            }
        }
        // 시간 선택이 있으면 시간도 적용 (변경되었을 때만)
        if (
            showTimePicker &&
            onTimeChange &&
            isTimeChanged(tempTime.hour, tempTime.minute, tempTime.second)
        ) {
            const hasSeconds =
                timeFormat === "HH:mm:ss" || timeFormat === "hh:mm:ss";
            onTimeChange(
                tempTime.hour,
                tempTime.minute,
                hasSeconds ? tempTime.second : undefined,
            );
        }
        onClose();
    };

    // 임시 시간 변경 핸들러
    const handleTempTimeChange = (
        hour: number,
        minute: number,
        second?: number,
    ) => {
        setTempTime({
            hour,
            minute,
            second: second ?? 0,
        });

        // autoApply면 바로 적용 (변경되었을 때만)
        if (autoApply && onTimeChange && isTimeChanged(hour, minute, second)) {
            const hasSeconds =
                timeFormat === "HH:mm:ss" || timeFormat === "hh:mm:ss";
            onTimeChange(hour, minute, hasSeconds ? second : undefined);
        }
    };

    // 년월 타이틀 클릭 → 연도 선택 모드
    const handleTitleClick = () => {
        setTempYear(year);
        setViewMode("year");
    };

    // 연도 선택
    const handleYearSelect = (selectedYear: number) => {
        if (yearOnly) {
            if (autoApply) {
                // autoApply가 true면 바로 적용하고 닫기 (변경되었을 때만)
                if (isYearChanged(selectedYear)) {
                    onYearChange?.(selectedYear);
                }
                onClose();
            } else {
                // autoApply가 false면 임시 저장만
                setTempSelectedYear(selectedYear);
            }
        } else if (monthOnly) {
            // monthOnly 모드: 월까지 선택해야 최종이므로 년도 선택 시에는 이벤트 발생 안함
            setTempYear(selectedYear);
            setViewMode("month");
        } else {
            // 일반 캘린더 모드: 년도 선택 시 onYearChange 호출 (현재 viewDate 기준)
            if (year !== selectedYear) {
                onYearChange?.(selectedYear);
            }
            setTempYear(selectedYear);
            setViewMode("month");
        }
    };

    // yearOnly 모드에서 확인 버튼 클릭
    const handleYearConfirm = () => {
        if (tempSelectedYear !== null) {
            // 년도가 변경되었을 때만 이벤트 발생
            if (isYearChanged(tempSelectedYear)) {
                onYearChange?.(tempSelectedYear);
            }
        }
        onClose();
    };

    // 월 선택
    const handleMonthSelect = (selectedMonth: number) => {
        if (monthOnly) {
            if (autoApply) {
                // autoApply가 true면 바로 적용하고 닫기 (변경되었을 때만)
                if (isYearChanged(tempYear)) {
                    onYearChange?.(tempYear);
                }
                if (isMonthChanged(tempYear, selectedMonth + 1)) {
                    onMonthChange?.(tempYear, selectedMonth + 1);
                }
                onClose();
            } else {
                // autoApply가 false면 임시 저장만
                setTempMonth(selectedMonth);
            }
        } else {
            // 일반 캘린더 모드: 년/월 선택 뷰에서 월을 선택하면 해당 월로 이동
            const newDate = new Date(tempYear, selectedMonth, 1);
            // 월 변경 콜백 호출 (현재 viewDate 기준으로 변경되었을 때만)
            if (year !== tempYear || month !== selectedMonth) {
                onMonthChange?.(tempYear, selectedMonth + 1);
            }
            setViewDate(newDate);
            setViewMode("calendar");
            setTempSelectedDate(null);
        }
    };

    // monthOnly 모드에서 확인 버튼 클릭
    const handleMonthConfirm = () => {
        if (tempMonth !== null) {
            // 년월이 변경되었을 때만 이벤트 발생
            if (isYearChanged(tempYear)) {
                onYearChange?.(tempYear);
            }
            if (isMonthChanged(tempYear, tempMonth + 1)) {
                onMonthChange?.(tempYear, tempMonth + 1);
            }
        }
        onClose();
    };

    // 연도 선택 뷰가 열릴 때 현재년도를 중앙에 위치
    useEffect(() => {
        if (
            viewMode === "year" &&
            yearScrollRef.current &&
            contentRef.current
        ) {
            // DOM이 렌더링된 후 실제 높이를 계산
            requestAnimationFrame(() => {
                if (!yearScrollRef.current || !contentRef.current) return;

                const currentYear = today.getFullYear();
                const yearIndex = yearList.findIndex((y) => y === currentYear);
                if (yearIndex < 0) return;

                // 실제 그리드 요소 찾기
                const scrollContainer = contentRef.current.querySelector(
                    ".overlay-scrollbar-content",
                ) as HTMLElement;
                const gridElement = scrollContainer?.querySelector(
                    "[class*='MuiBox-root']",
                ) as HTMLElement;

                if (!gridElement) return;

                // 첫 번째 연도 아이템의 실제 높이 가져오기
                const firstYearItem = gridElement.children[0] as HTMLElement;
                if (!firstYearItem) return;

                const itemHeight = firstYearItem.offsetHeight;
                const gap = 4; // gap: 0.5 = 4px
                const rowHeight = itemHeight + gap;

                const rowIndex = Math.floor(yearIndex / 4);
                const containerHeight = contentRef.current.clientHeight;
                const visibleRows = Math.floor(containerHeight / rowHeight);
                const centerRowOffset = Math.floor(visibleRows / 2);

                const scrollTop = (rowIndex - centerRowOffset) * rowHeight;
                yearScrollRef.current.scrollTo({
                    top: Math.max(0, scrollTop),
                });
            });
        }
    }, [viewMode, yearList, today]);

    // 헤더 렌더링 (viewMode에 따라 다름)
    const renderHeader = () => {
        if (viewMode === "year") {
            // monthOnly 또는 yearOnly 모드에서는 뒤로 갈 곳이 없으므로 < 버튼 숨김
            if (monthOnly || yearOnly) {
                return (
                    <Typography variant="body2" fontWeight={600}>
                        Choose Year
                    </Typography>
                );
            }
            // 일반 캘린더에서 년도 선택으로 왔을 때는 < 버튼 표시
            return (
                <>
                    <IconButton
                        size="small"
                        onClick={() => {
                            // 뒤로가기 시 tempYear가 현재 viewDate의 year와 다르면 onYearChange 발생
                            if (tempYear !== year) {
                                onYearChange?.(year);
                            }
                            setTempYear(year);
                            setViewMode("calendar");
                        }}
                    >
                        <ChevronLeft />
                    </IconButton>
                    <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{ flex: 1, textAlign: "center" }}
                    >
                        Choose Year
                    </Typography>
                    <Box sx={{ width: 28 }} />
                </>
            );
        }
        if (viewMode === "month") {
            return (
                <>
                    <IconButton
                        size="small"
                        onClick={() => setViewMode("year")}
                    >
                        <ChevronLeft />
                    </IconButton>
                    <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{ flex: 1, textAlign: "center" }}
                    >
                        {tempYear}
                    </Typography>
                    <Box sx={{ width: 28 }} /> {/* 균형을 위한 빈 공간 */}
                </>
            );
        }
        // calendar mode
        return (
            <>
                <IconButton size="small" onClick={goToPrevMonth}>
                    <ChevronLeft />
                </IconButton>
                <Typography
                    variant="body2"
                    fontWeight={600}
                    onClick={handleTitleClick}
                    sx={{
                        cursor: "pointer",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        "&:hover": {
                            bgcolor: "action.hover",
                        },
                        transition: "background-color 0.15s",
                    }}
                >
                    {year} {mergedLocale.months[month]}
                </Typography>
                <IconButton size="small" onClick={goToNextMonth}>
                    <ChevronRight />
                </IconButton>
            </>
        );
    };

    // 콘텐츠 렌더링 (viewMode에 따라 다름)
    const renderContent = () => {
        if (viewMode === "year") {
            return (
                <OverlayScrollbar
                    ref={yearScrollRef}
                    style={{ width: "100%", height: "100%" }}
                    containerStyle={{ padding: "12px" }}
                    thumb={{ width: 6, color: "rgba(100, 100, 100, 0.5)" }}
                    track={{ alignment: "outside", margin: 0 }}
                    autoHide={{ enabled: true, delay: 1000 }}
                >
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gap: 0.5,
                        }}
                    >
                        {yearList.map((y) => {
                            // yearOnly 모드에서는 tempSelectedYear를, 그 외에는 tempYear를 기준으로 선택 표시
                            const isSelected = yearOnly
                                ? tempSelectedYear === y
                                : y === tempYear;
                            const isCurrent = y === today.getFullYear();
                            return (
                                <Box
                                    key={y}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Box
                                        onClick={() => handleYearSelect(y)}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            py: 0.75,
                                            px: 1.5,
                                            borderRadius: 1,
                                            cursor: "pointer",
                                            bgcolor: isSelected
                                                ? selectedColor
                                                : "transparent",
                                            color: isSelected
                                                ? "primary.contrastText"
                                                : "text.primary",
                                            border:
                                                isCurrent && !isSelected
                                                    ? 1
                                                    : 0,
                                            borderColor: selectedColor,
                                            fontSize: "0.8rem",
                                            fontWeight:
                                                isSelected || isCurrent
                                                    ? 600
                                                    : 400,
                                            "&:hover": {
                                                bgcolor: isSelected
                                                    ? selectedColor
                                                    : "action.hover",
                                                transform: "scale(1.05)",
                                            },
                                            transition:
                                                "background-color 0.15s, transform 0.15s",
                                        }}
                                    >
                                        {y}
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </OverlayScrollbar>
            );
        }

        if (viewMode === "month") {
            return (
                <Box
                    className="month-grid"
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gridTemplateRows: "repeat(4, 1fr)",
                        gap: 1,
                        width: "100%",
                        height: "100%",
                        p: 2,
                        boxSizing: "border-box",
                    }}
                >
                    {mergedLocale.months.map(
                        (monthName: string, index: number) => {
                            // monthOnly 모드에서는 tempMonth를, 그 외에는 현재 viewDate의 month를 기준으로 선택 표시
                            const isSelected = monthOnly
                                ? tempMonth === index
                                : tempYear === year && index === month;
                            const isCurrent =
                                tempYear === today.getFullYear() &&
                                index === today.getMonth();
                            return (
                                <Box
                                    key={monthName}
                                    onClick={() => handleMonthSelect(index)}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: 1,
                                        cursor: "pointer",
                                        bgcolor: isSelected
                                            ? selectedColor
                                            : "transparent",
                                        color: isSelected
                                            ? "primary.contrastText"
                                            : "text.primary",
                                        border:
                                            isCurrent && !isSelected ? 1 : 0,
                                        borderColor: selectedColor,
                                        fontSize: "0.875rem",
                                        fontWeight:
                                            isSelected || isCurrent ? 600 : 400,
                                        "&:hover": {
                                            bgcolor: isSelected
                                                ? selectedColor
                                                : "action.hover",
                                            transform: "scale(1.05)",
                                        },
                                        transition:
                                            "background-color 0.15s, transform 0.15s",
                                    }}
                                >
                                    {monthName}
                                </Box>
                            );
                        },
                    )}
                </Box>
            );
        }

        // calendar mode
        return (
            <Box
                className="calendar-grid"
                onWheel={handleWheel}
                sx={{
                    width: "100%",
                    height: "100%",
                    px: 2,
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* 요일 헤더 */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(7, 1fr)",
                        gap: 0,
                        mb: 0.5,
                    }}
                >
                    {mergedLocale.weekdays.map((day: string, i: number) => (
                        <Box
                            key={day}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: 22,
                                fontSize: "0.7rem",
                                color:
                                    i === 0
                                        ? holidayColor
                                        : i === 6
                                            ? saturdayColor
                                            : "text.secondary",
                                fontWeight: 500,
                            }}
                        >
                            {day}
                        </Box>
                    ))}
                </Box>

                {/* 날짜 그리드 */}
                <Box
                    sx={{
                        flex: 1,
                        display: "grid",
                        gridTemplateColumns: "repeat(7, 1fr)",
                        gridTemplateRows: "repeat(6, 1fr)",
                        gap: 0,
                    }}
                >
                    {calendarDays.map((date, index) => {
                        // autoApply일 때는 selectedDate만, 아닐 때는 tempSelectedDate 우선
                        const isSelected = autoApply
                            ? isSameDay(date, selectedDate)
                            : isSameDay(date, tempSelectedDate ?? selectedDate);
                        const isToday = isSameDay(date, today);
                        const isDisabled = isDateDisabled(date);
                        const dayOfWeek = date.getDay();
                        const isCurrentMonth = date.getMonth() === month;
                        const isHoliday = validHolidays.some((h) =>
                            isSameDay(h, date),
                        );

                        return (
                            <Box
                                key={`${date.toISOString()}-${index}`}
                                onClick={() =>
                                    !isDisabled && handleDateClick(date)
                                }
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 32,
                                    height: 32,
                                    mx: "auto",
                                    borderRadius: "50%",
                                    cursor: isDisabled ? "default" : "pointer",
                                    bgcolor: isSelected
                                        ? selectedColor
                                        : "transparent",
                                    color: isDisabled
                                        ? "text.disabled"
                                        : isSelected
                                            ? "primary.contrastText"
                                            : !isCurrentMonth
                                                ? "text.disabled"
                                                : isHoliday || dayOfWeek === 0
                                                    ? holidayColor
                                                    : dayOfWeek === 6
                                                        ? saturdayColor
                                                        : "text.primary",
                                    opacity: isCurrentMonth ? 1 : 0.4,
                                    border: isToday ? 1 : 0,
                                    borderColor: todayBorderColor,
                                    "&:hover": {
                                        bgcolor: isDisabled
                                            ? "transparent"
                                            : isSelected
                                                ? selectedColor
                                                : "action.hover",
                                    },
                                    transition: "background-color 0.15s",
                                    fontSize: "0.75rem",
                                    fontWeight:
                                        isSelected || isToday ? 600 : 400,
                                }}
                            >
                                {date.getDate()}
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        );
    };

    // 푸터 렌더링 (viewMode에 따라 다름)
    const renderFooter = () => {
        // yearOnly 모드일 때
        if (yearOnly) {
            if (autoApply) {
                // autoApply가 true면 푸터 불필요
                return null;
            }
            // autoApply가 false면 확인/취소 버튼 표시
            return (
                <>
                    <Box sx={{ flex: 1 }} />
                    <Button size="small" onClick={onClose}>
                        {mergedLocale.cancel}
                    </Button>
                    <Button
                        size="small"
                        onClick={handleYearConfirm}
                        variant="contained"
                        disabled={tempSelectedYear === null}
                    >
                        {mergedLocale.confirm}
                    </Button>
                </>
            );
        }

        // monthOnly 모드일 때
        if (monthOnly) {
            if (autoApply) {
                // autoApply가 true면 푸터 불필요
                return null;
            }
            // autoApply가 false면 확인/취소 버튼 표시
            return (
                <>
                    <Box sx={{ flex: 1 }} />
                    <Button size="small" onClick={onClose}>
                        {mergedLocale.cancel}
                    </Button>
                    <Button
                        size="small"
                        onClick={handleMonthConfirm}
                        variant="contained"
                        disabled={tempMonth === null}
                    >
                        {mergedLocale.confirm}
                    </Button>
                </>
            );
        }

        if (viewMode === "year") {
            return (
                <Button size="small" onClick={() => setViewMode("calendar")}>
                    {mergedLocale.cancel}
                </Button>
            );
        }
        if (viewMode === "month") {
            return (
                <Button
                    size="small"
                    onClick={() => setViewMode("calendar")}
                    sx={{ px: 2 }}
                >
                    {mergedLocale.cancel}
                </Button>
            );
        }
        // calendar mode - autoApply면 닫기 버튼만 표시
        if (autoApply) {
            return (
                <>
                    {showToday && (
                        <Button
                            size="small"
                            onClick={handleTodayClick}
                            disabled={isDateDisabled(today)}
                        >
                            {mergedLocale.today}
                        </Button>
                    )}
                    <Box sx={{ flex: 1 }} />
                    <Button size="small" onClick={onClose}>
                        {mergedLocale.close}
                    </Button>
                </>
            );
        }
        return (
            <>
                {showToday && (
                    <Button
                        size="small"
                        onClick={handleTodayClick}
                        disabled={isDateDisabled(today)}
                    >
                        {mergedLocale.today}
                    </Button>
                )}
                <Box sx={{ flex: 1 }} />
                <Button size="small" onClick={onClose}>
                    {mergedLocale.cancel}
                </Button>
                <Button
                    size="small"
                    onClick={handleConfirm}
                    variant="contained"
                    disabled={tempSelectedDate === null}
                >
                    {mergedLocale.confirm}
                </Button>
            </>
        );
    };

    // 푸터 표시 여부 결정 (showFooterProp이 false면 무조건 숨김)
    const showFooter =
        showFooterProp &&
        (yearOnly
            ? !autoApply // yearOnly일 때는 autoApply가 false면 항상 표시
            : monthOnly
                ? !autoApply // monthOnly일 때는 autoApply가 false면 항상 표시 (year/month 뷰 모두)
                : !(autoApply && !showToday) && viewMode === "calendar"); // calendar 뷰일 때만 표시, year/month 뷰는 푸터 숨김

    // 통합된 구조로 렌더링
    const calendarContent = (
        <Box
            className={`calendar-root calendar-${viewMode}-view`}
            sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
            }}
        >
            {/* 공통 헤더 */}
            <Box
                className="calendar-header"
                sx={{
                    height: HEADER_HEIGHT,
                    minHeight: HEADER_HEIGHT,
                    px: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        viewMode === "calendar" ? "space-between" : "center",
                    ...(viewMode !== "calendar" && {
                        borderBottom: "1px solid",
                        borderColor: "divider",
                    }),
                }}
            >
                {renderHeader()}
            </Box>

            {/* 콘텐츠 영역 */}
            <Box
                ref={contentRef}
                className="calendar-content"
                sx={{
                    flex: "1 1 0",
                    minHeight: 0,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    pb: 1,
                }}
            >
                {renderContent()}
            </Box>
        </Box>
    );

    // 공통 푸터 컴포넌트
    const footerContent = showFooter ? (
        <Box
            className="calendar-footer"
            sx={{
                height: FOOTER_HEIGHT,
                minHeight: FOOTER_HEIGHT,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 1,
                px: 1,
                borderTop: "1px solid",
                borderColor: "divider",
            }}
        >
            {renderFooter()}
        </Box>
    ) : null;

    // 시간 선택이 없으면 달력 + 푸터
    if (!showTimePicker) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    userSelect: "none",
                }}
            >
                {calendarContent}
                {footerContent}
            </Box>
        );
    }

    // 시간 선택이 있으면 전체 column: 상단(달력+시간 row) + 하단(footer)
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                userSelect: "none",
            }}
        >
            {/* 상단: 달력 + 시간 (row) */}
            <Box
                sx={{
                    display: "flex",
                    flex: 1,
                    minHeight: 0,
                    overflow: "hidden",
                }}
            >
                {/* 달력 영역 - 고정 너비 300px */}
                <Box
                    sx={{
                        width: 300,
                        flex: "0 0 300px",
                        borderRight: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    {calendarContent}
                </Box>

                {/* 시간 선택 영역 */}
                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                    }}
                >
                    <TimeSelector
                        value={{
                            hour: String(tempTime.hour).padStart(2, "0"),
                            minute: String(tempTime.minute).padStart(2, "0"),
                            second: String(tempTime.second).padStart(2, "0"),
                        }}
                        onChange={handleTempTimeChange}
                        format={timeFormat}
                        minTime={minTime}
                        maxTime={maxTime}
                        minuteStep={minuteStep}
                        secondStep={secondStep}
                        showHeader={true}
                        hideDisabledTime={hideDisabledTime}
                    />
                </Box>
            </Box>

            {/* 하단: 푸터 (전체 너비) */}
            {footerContent}
        </Box>
    );
}
