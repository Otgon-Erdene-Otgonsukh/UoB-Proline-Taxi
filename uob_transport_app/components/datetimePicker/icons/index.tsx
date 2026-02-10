/**
 * icons/index.tsx
 *
 * @license MIT
 * @copyright 2025 김영진 (Kim Young Jin)
 * @author 김영진 (ehfuse@gmail.com)
 */

import React from "react";

interface IconProps {
    size?: "small" | "medium" | "large" | number;
    color?: string;
}

const getSizeValue = (size: IconProps["size"]) => {
    if (typeof size === "number") return size;
    switch (size) {
        case "small":
            return 16;
        case "large":
            return 28;
        case "medium":
        default:
            return 20;
    }
};

export const ChevronLeft: React.FC<IconProps> = ({
    size = "medium",
    color = "currentColor",
}) => {
    const s = getSizeValue(size);
    return (
        <svg
            width={s}
            height={s}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="15 18 9 12 15 6" />
        </svg>
    );
};

export const ChevronRight: React.FC<IconProps> = ({
    size = "medium",
    color = "currentColor",
}) => {
    const s = getSizeValue(size);
    return (
        <svg
            width={s}
            height={s}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="9 18 15 12 9 6" />
        </svg>
    );
};

export const ColonIcon: React.FC<IconProps> = ({
    size = "medium",
    color = "currentColor",
}) => {
    const s = getSizeValue(size);
    return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color}>
            <circle cx="12" cy="8" r="2" />
            <circle cx="12" cy="16" r="2" />
        </svg>
    );
};
