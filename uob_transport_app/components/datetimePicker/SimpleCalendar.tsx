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

const HEADER_HEIGHT = 48;
const FOOTER_HEIGHT = 48;

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

    monthOnly = false,
    yearOnly = false,

    onMonthChange,
    onYearChange,
    onWeekChange,

    showTimePicker = false,
    timeValue,
    onTimeChange,
    timeFormat = "HH:mm",
    minTime,
    maxTime,
    minuteStep = 1,
    secondStep = 1,
    hideDisabledTime = false,
    locale,
    texts,
}: SimpleCalendarProps) {

    const selectedColor = styles?.selectedColor ?? "primary.main";
    const todayBorderColor = styles?.todayBorderColor ?? selectedColor;
    const holidayColor = styles?.holidayColor ?? "error.main";
    const saturdayColor = styles?.saturdayColor ?? "primary.main";


    const resolvedLocale = resolveLocale(locale);
    const mergedLocale = useMemo(
        () => (texts ? { ...resolvedLocale, ...texts } : resolvedLocale),
        [resolvedLocale, texts],
    );


    const validHolidays = useMemo(
        () => holidays.filter((d) => d instanceof Date && !isNaN(d.getTime())),
        [holidays],
    );

    const today = new Date();
    const [viewDate, setViewDate] = useState(() => {
        if (selectedDate) return new Date(selectedDate);
        return new Date(today.getFullYear(), today.getMonth(), 1);
    });

    const [viewMode, setViewMode] = useState<ViewMode>(
        yearOnly ? "year" : monthOnly ? "month" : "calendar",
    );
    const [tempYear, setTempYear] = useState<number>(viewDate.getFullYear());

    const [tempMonth, setTempMonth] = useState<number | null>(null);

    const [tempSelectedYear, setTempSelectedYear] = useState<number | null>(
        null,
    );

    const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(
        selectedDate,
    );

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


    const yearScrollRef = useRef<OverlayScrollbarRef>(null);
    const contentRef = useRef<HTMLDivElement>(null);


    const calendarDays = useMemo(() => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startPadding = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        const days: Date[] = [];


        const prevMonth = new Date(year, month, 0);
        const prevMonthDays = prevMonth.getDate();
        for (let i = startPadding - 1; i >= 0; i--) {
            days.push(new Date(year, month - 1, prevMonthDays - i));
        }


        for (let d = 1; d <= daysInMonth; d++) {
            days.push(new Date(year, month, d));
        }


        let nextDay = 1;
        while (days.length < 42) {
            days.push(new Date(year, month + 1, nextDay++));
        }

        return days;
    }, [year, month]);


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


    const isYearChanged = (newYear: number): boolean => {
        const compareDate = selectedDate || today;
        return compareDate.getFullYear() !== newYear;
    };


    const isMonthChanged = (newYear: number, newMonth: number): boolean => {
        const compareDate = selectedDate || today;
        return (
            compareDate.getFullYear() !== newYear ||
            compareDate.getMonth() + 1 !== newMonth
        );
    };


    const isWeekChanged = (date: Date): boolean => {
        const compareDate = selectedDate || today;
        return !isSameWeek(date, compareDate);
    };

    const goToPrevMonth = () => {
        const newDate = new Date(year, month - 1, 1);
        setViewDate(newDate);
        setTempSelectedDate(null);

        onMonthChange?.(newDate.getFullYear(), newDate.getMonth() + 1);
    };

    const goToNextMonth = () => {
        const newDate = new Date(year, month + 1, 1);
        setViewDate(newDate);
        setTempSelectedDate(null);

        onMonthChange?.(newDate.getFullYear(), newDate.getMonth() + 1);
    };


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
        [goToNextMonth, goToPrevMonth, viewMode, year, month],
    );

    const handleDateClick = (date: Date) => {
        if (!isDateDisabled(date)) {
            if (autoApply) {


                if (!isSameDay(selectedDate, date)) {
                    onSelect(date);

                    if (isWeekChanged(date)) {
                        const weekInfo = getWeekInfo(date);
                        onWeekChange?.(
                            weekInfo.weekOfMonth,
                            weekInfo.startDate,
                            weekInfo.endDate,
                        );
                    }
                }

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


                if (year !== todayYear) {
                    onYearChange?.(todayYear);
                }
                if (year !== todayYear || month !== todayMonth) {
                    onMonthChange?.(todayYear, todayMonth + 1);
                }

                if (!isSameDay(selectedDate, today)) {
                    onSelect(today);
                }

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

            if (!isSameDay(selectedDate, tempSelectedDate)) {
                onSelect(tempSelectedDate);

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


        if (autoApply && onTimeChange && isTimeChanged(hour, minute, second)) {
            const hasSeconds =
                timeFormat === "HH:mm:ss" || timeFormat === "hh:mm:ss";
            onTimeChange(hour, minute, hasSeconds ? second : undefined);
        }
    };


    const handleTitleClick = () => {
        setTempYear(year);
        setViewMode("year");
    };


    const handleYearSelect = (selectedYear: number) => {
        if (yearOnly) {
            if (autoApply) {

                if (isYearChanged(selectedYear)) {
                    onYearChange?.(selectedYear);
                }
                onClose();
            } else {

                setTempSelectedYear(selectedYear);
            }
        } else if (monthOnly) {

            setTempYear(selectedYear);
            setViewMode("month");
        } else {

            if (year !== selectedYear) {
                onYearChange?.(selectedYear);
            }
            setTempYear(selectedYear);
            setViewMode("month");
        }
    };


    const handleYearConfirm = () => {
        if (tempSelectedYear !== null) {

            if (isYearChanged(tempSelectedYear)) {
                onYearChange?.(tempSelectedYear);
            }
        }
        onClose();
    };


    const handleMonthSelect = (selectedMonth: number) => {
        if (monthOnly) {
            if (autoApply) {

                if (isYearChanged(tempYear)) {
                    onYearChange?.(tempYear);
                }
                if (isMonthChanged(tempYear, selectedMonth + 1)) {
                    onMonthChange?.(tempYear, selectedMonth + 1);
                }
                onClose();
            } else {

                setTempMonth(selectedMonth);
            }
        } else {

            const newDate = new Date(tempYear, selectedMonth, 1);

            if (year !== tempYear || month !== selectedMonth) {
                onMonthChange?.(tempYear, selectedMonth + 1);
            }
            setViewDate(newDate);
            setViewMode("calendar");
            setTempSelectedDate(null);
        }
    };


    const handleMonthConfirm = () => {
        if (tempMonth !== null) {

            if (isYearChanged(tempYear)) {
                onYearChange?.(tempYear);
            }
            if (isMonthChanged(tempYear, tempMonth + 1)) {
                onMonthChange?.(tempYear, tempMonth + 1);
            }
        }
        onClose();
    };


    useEffect(() => {
        if (
            viewMode === "year" &&
            yearScrollRef.current &&
            contentRef.current
        ) {

            requestAnimationFrame(() => {
                if (!yearScrollRef.current || !contentRef.current) return;

                const currentYear = today.getFullYear();
                const yearIndex = yearList.findIndex((y) => y === currentYear);
                if (yearIndex < 0) return;


                const scrollContainer = contentRef.current.querySelector(
                    ".overlay-scrollbar-content",
                ) as HTMLElement;
                const gridElement = scrollContainer?.querySelector(
                    "[class*='MuiBox-root']",
                ) as HTMLElement;

                if (!gridElement) return;


                const firstYearItem = gridElement.children[0] as HTMLElement;
                if (!firstYearItem) return;

                const itemHeight = firstYearItem.offsetHeight;
                const gap = 4;
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


    const renderHeader = () => {
        if (viewMode === "year") {

            if (monthOnly || yearOnly) {
                return (
                    <Typography variant="body2" fontWeight={600}>
                        Choose Year
                    </Typography>
                );
            }

            return (
                <>
                    <IconButton
                        size="small"
                        onClick={() => {

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
                    <Box sx={{ width: 28 }} />
                </>
            );
        }
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


    const renderFooter = () => {

        if (yearOnly) {
            if (autoApply) {

                return null;
            }

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


        if (monthOnly) {
            if (autoApply) {

                return null;
            }

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


    const showFooter =
        showFooterProp &&
        (yearOnly
            ? !autoApply
            : monthOnly
                ? !autoApply
                : !(autoApply && !showToday) && viewMode === "calendar");


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

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                userSelect: "none",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flex: 1,
                    minHeight: 0,
                    overflow: "hidden",
                }}
            >
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

            {footerContent}
        </Box>
    );
}
