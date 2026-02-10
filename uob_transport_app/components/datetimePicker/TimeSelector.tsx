/**
 * TimeSelector.tsx
 * 시간 선택 UI 컴포넌트 (재사용 가능)
 *
 * @license MIT
 * @copyright 2025 김영진 (Kim Young Jin)
 * @author 김영진 (ehfuse@gmail.com)
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { OverlayScrollbar } from "@ehfuse/overlay-scrollbar";
import type { OverlayScrollbarRef } from "@ehfuse/overlay-scrollbar";
import { ColonIcon } from "./icons";
import type { TimeSelectorProps } from "./types";

export function TimeSelector({
    value,
    onChange,
    format,
    minTime,
    maxTime,
    minuteStep = 1,
    secondStep = 1,
    showHeader = true,
    hideDisabledTime = false,
}: TimeSelectorProps) {
    const [selectedHour, setSelectedHour] = useState<number | null>(() => {
        const h = parseInt(value.hour, 10);
        if (!isNaN(h)) return h;
        return new Date().getHours();
    });
    const [selectedMinute, setSelectedMinute] = useState<number | null>(() => {
        const m = parseInt(value.minute, 10);
        if (!isNaN(m)) return Math.floor(m / minuteStep) * minuteStep;
        return Math.floor(new Date().getMinutes() / minuteStep) * minuteStep;
    });
    const [selectedSecond, setSelectedSecond] = useState<number | null>(() => {
        const s = value.second ? parseInt(value.second, 10) : 0;
        if (!isNaN(s)) return Math.floor(s / secondStep) * secondStep;
        return Math.floor(new Date().getSeconds() / secondStep) * secondStep;
    });
    const initialScrollDone = useRef(false);

    const hourRef = useRef<OverlayScrollbarRef>(null);
    const minuteRef = useRef<OverlayScrollbarRef>(null);
    const secondRef = useRef<OverlayScrollbarRef>(null);

    const hasSeconds = format === "HH:mm:ss" || format === "hh:mm:ss";
    const is12Hour = format.startsWith("hh");
    const maxHour = is12Hour ? 12 : 23;
    const minHourValue = is12Hour ? 1 : 0;

    // 시간 배열 생성
    const hours = Array.from(
        { length: maxHour - minHourValue + 1 },
        (_, i) => minHourValue + i,
    );
    const minutes = Array.from(
        { length: Math.ceil(60 / minuteStep) },
        (_, i) => i * minuteStep,
    );
    const seconds = hasSeconds
        ? Array.from(
              { length: Math.ceil(60 / secondStep) },
              (_, i) => i * secondStep,
          )
        : [];

    // 선택된 항목으로 스크롤 (세로 중앙에 오도록)
    const scrollToCenter = useCallback(
        (
            scrollbarRef: React.RefObject<OverlayScrollbarRef | null>,
            val: number,
        ) => {
            if (!scrollbarRef.current) return;

            const scrollContainer = scrollbarRef.current.getScrollContainer();
            if (!scrollContainer) return;

            const element = scrollContainer.querySelector(
                `[data-value="${val}"]`,
            ) as HTMLElement;
            if (!element) return;

            const containerHeight = scrollbarRef.current.clientHeight;
            const elementTop = element.offsetTop;
            const elementHeight = element.offsetHeight;

            const scrollTop =
                elementTop - containerHeight / 2 + elementHeight / 2;
            scrollbarRef.current.scrollTo({ top: Math.max(0, scrollTop) });
        },
        [],
    );

    // 초기 스크롤 (한 번만)
    useEffect(() => {
        if (initialScrollDone.current) return;
        if (selectedHour === null || selectedMinute === null) return;
        if (hasSeconds && selectedSecond === null) return;

        const timer = setTimeout(() => {
            scrollToCenter(hourRef, selectedHour);
            scrollToCenter(minuteRef, selectedMinute);
            if (hasSeconds && selectedSecond !== null) {
                scrollToCenter(secondRef, selectedSecond);
            }
            initialScrollDone.current = true;
        }, 50);
        return () => clearTimeout(timer);
    }, [
        selectedHour,
        selectedMinute,
        selectedSecond,
        hasSeconds,
        scrollToCenter,
    ]);

    // 시간 범위 체크
    const isTimeInRange = (h: number, m: number, s: number = 0): boolean => {
        const timeValue = h * 3600 + m * 60 + s;

        if (minTime) {
            const minParts = minTime.split(":");
            const minH = parseInt(minParts[0], 10) || 0;
            const minM = parseInt(minParts[1], 10) || 0;
            const minS = parseInt(minParts[2], 10) || 0;
            const minValue = minH * 3600 + minM * 60 + minS;
            if (timeValue < minValue) return false;
        }

        if (maxTime) {
            const maxParts = maxTime.split(":");
            const maxH = parseInt(maxParts[0], 10) || 0;
            const maxM = parseInt(maxParts[1], 10) || 0;
            const maxS = parseInt(maxParts[2], 10) || 0;
            const maxValue = maxH * 3600 + maxM * 60 + maxS;
            if (timeValue > maxValue) return false;
        }

        return true;
    };

    // 선택 핸들러 - 선택 시 바로 onChange 호출
    const handleHourSelect = (hour: number) => {
        setSelectedHour(hour);
        onChange(
            hour,
            selectedMinute ?? 0,
            hasSeconds ? (selectedSecond ?? 0) : undefined,
        );
    };

    const handleMinuteSelect = (minute: number) => {
        setSelectedMinute(minute);
        onChange(
            selectedHour ?? 0,
            minute,
            hasSeconds ? (selectedSecond ?? 0) : undefined,
        );
    };

    const handleSecondSelect = (second: number) => {
        setSelectedSecond(second);
        onChange(selectedHour ?? 0, selectedMinute ?? 0, second);
    };

    // 아이템 렌더링
    const renderItem = (
        val: number,
        selected: boolean,
        disabled: boolean,
        onClick: () => void,
    ) => (
        <Box
            key={val}
            data-value={val}
            onClick={disabled ? undefined : onClick}
            sx={{
                py: 0.5,
                px: 1,
                cursor: disabled ? "not-allowed" : "pointer",
                textAlign: "center",
                borderRadius: 1,
                backgroundColor: selected ? "primary.main" : "transparent",
                color: disabled
                    ? "text.disabled"
                    : selected
                      ? "primary.contrastText"
                      : "text.primary",
                opacity: disabled ? 0.4 : 1,
                transition: "background-color 0.15s, color 0.15s",
                "&:hover": {
                    backgroundColor: disabled
                        ? "transparent"
                        : selected
                          ? "primary.dark"
                          : "action.hover",
                },
                fontVariantNumeric: "tabular-nums",
                minWidth: 32,
            }}
        >
            <Typography
                variant="body2"
                sx={{ fontWeight: selected ? 600 : 400 }}
            >
                {String(val).padStart(2, "0")}
            </Typography>
        </Box>
    );

    // 열 렌더링
    const renderColumn = (
        ref: React.RefObject<OverlayScrollbarRef | null>,
        items: number[],
        selectedValue: number | null,
        onSelect: (val: number) => void,
        checkDisabled: (val: number) => boolean,
    ) => (
        <OverlayScrollbar
            ref={ref as React.RefObject<OverlayScrollbarRef>}
            style={{ height: "100%" }}
            thumb={{ width: 4 }}
            track={{ alignment: "right" }}
        >
            <div style={{ padding: "0.25rem" }}>
                {items.map((item) => {
                    const isDisabled = checkDisabled(item);
                    // hideDisabledTime이 true이고 disabled면 렌더링하지 않음
                    if (hideDisabledTime && isDisabled) return null;
                    return renderItem(
                        item,
                        selectedValue === item,
                        isDisabled,
                        () => onSelect(item),
                    );
                })}
            </div>
        </OverlayScrollbar>
    );

    // 시간 비활성화 체크
    const isHourDisabled = (hour: number): boolean => {
        for (const minute of minutes) {
            if (hasSeconds) {
                for (const second of seconds) {
                    if (isTimeInRange(hour, minute, second)) return false;
                }
            } else {
                if (isTimeInRange(hour, minute)) return false;
            }
        }
        return true;
    };

    const isMinuteDisabled = (minute: number): boolean => {
        if (selectedHour === null) return false;
        if (hasSeconds) {
            for (const second of seconds) {
                if (isTimeInRange(selectedHour, minute, second)) return false;
            }
            return true;
        }
        return !isTimeInRange(selectedHour, minute);
    };

    const isSecondDisabled = (second: number): boolean => {
        if (selectedHour === null || selectedMinute === null) return false;
        return !isTimeInRange(selectedHour, selectedMinute, second);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                userSelect: "none",
            }}
        >
            {/* 현재 선택된 시간 표시 */}
            {showHeader && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 48,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        gap: 0.5,
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 500,
                            fontVariantNumeric: "tabular-nums",
                        }}
                    >
                        {selectedHour !== null
                            ? String(selectedHour).padStart(2, "0")
                            : "--"}
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            ml: "1px",
                        }}
                    >
                        <ColonIcon size="small" />
                    </Box>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 500,
                            fontVariantNumeric: "tabular-nums",
                        }}
                    >
                        {selectedMinute !== null
                            ? String(selectedMinute).padStart(2, "0")
                            : "--"}
                    </Typography>
                    {hasSeconds && (
                        <>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    ml: "1px",
                                }}
                            >
                                <ColonIcon size="small" />
                            </Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 500,
                                    fontVariantNumeric: "tabular-nums",
                                }}
                            >
                                {selectedSecond !== null
                                    ? String(selectedSecond).padStart(2, "0")
                                    : "--"}
                            </Typography>
                        </>
                    )}
                </Box>
            )}

            {/* 시간 선택 컸럼 */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    flex: 1,
                    minHeight: 0,
                    overflow: "hidden",
                }}
            >
                {renderColumn(
                    hourRef,
                    hours,
                    selectedHour,
                    handleHourSelect,
                    isHourDisabled,
                )}

                <Box
                    sx={{
                        width: "1px",
                        backgroundColor: "divider",
                    }}
                />

                {renderColumn(
                    minuteRef,
                    minutes,
                    selectedMinute,
                    handleMinuteSelect,
                    isMinuteDisabled,
                )}

                {hasSeconds && (
                    <>
                        <Box
                            sx={{
                                width: "1px",
                                backgroundColor: "divider",
                                alignSelf: "stretch",
                            }}
                        />
                        {renderColumn(
                            secondRef,
                            seconds,
                            selectedSecond,
                            handleSecondSelect,
                            isSecondDisabled,
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
}
