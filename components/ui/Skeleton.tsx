"use client";

import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "text" | "card" | "avatar" | "badge" | "circle";
  animate?: boolean;
}

/**
 * Base Skeleton component with subtle shimmer and pulse effect.
 */
export function Skeleton({
  variant = "default",
  animate = true,
  className = "",
  children,
  ...props
}: SkeletonProps) {
  const variantStyles = {
    default: "rounded-xl",
    text: "h-4 rounded-md w-full",
    card: "rounded-3xl",
    avatar: "rounded-full aspect-square",
    circle: "rounded-full",
    badge: "h-6 rounded-full w-20",
  }[variant];

  const animationClass = animate ? "shimmer-mask animate-pulse" : "";

  return (
    <div
      role="status"
      aria-label="Loading..."
      className={`bg-gray-200/80 dark:bg-gray-800/80 transition-colors ${variantStyles} ${animationClass} ${className}`}
      {...props}
    >
      <span className="sr-only">កំពុងផ្ទុក... (Loading)</span>
      {children}
    </div>
  );
}

/**
 * Skeleton lines for typography paragraphs.
 */
export interface SkeletonTextProps {
  lines?: number;
  gap?: string;
  lastLineWidth?: string;
  className?: string;
  lineHeight?: string;
}

export function SkeletonText({
  lines = 3,
  gap = "gap-2.5",
  lastLineWidth = "w-3/5",
  className = "",
  lineHeight = "h-3.5",
}: SkeletonTextProps) {
  return (
    <div className={`flex flex-col ${gap} ${className}`} role="status">
      {Array.from({ length: lines }).map((_, idx) => {
        const isLast = idx === lines - 1;
        const width = isLast && lines > 1 ? lastLineWidth : "w-full";
        return (
          <Skeleton
            key={idx}
            variant="text"
            className={`${lineHeight} ${width}`}
          />
        );
      })}
    </div>
  );
}

/**
 * Skeleton avatar circle with preset sizes.
 */
export interface SkeletonAvatarProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function SkeletonAvatar({
  size = "md",
  className = "",
}: SkeletonAvatarProps) {
  const sizeMap = {
    xs: "h-6 w-6",
    sm: "h-8 w-8",
    md: "h-11 w-11",
    lg: "h-14 w-14",
    xl: "h-20 w-20",
  }[size];

  return (
    <Skeleton
      variant="avatar"
      className={`${sizeMap} ${className}`}
    />
  );
}

/**
 * Skeleton pill for tags, badges, and filters.
 */
export interface SkeletonBadgeProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SkeletonBadge({
  size = "md",
  className = "",
}: SkeletonBadgeProps) {
  const sizeMap = {
    sm: "h-5 w-14",
    md: "h-6 w-20",
    lg: "h-8 w-28",
  }[size];

  return (
    <Skeleton
      variant="badge"
      className={`${sizeMap} ${className}`}
    />
  );
}

/**
 * Skeleton card structure with image header, title, and lines.
 */
export interface SkeletonCardProps {
  coverHeight?: string;
  hasLines?: boolean;
  className?: string;
}

export function SkeletonCard({
  coverHeight = "h-48",
  hasLines = true,
  className = "",
}: SkeletonCardProps) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-3xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className}`}
      role="status"
    >
      <Skeleton className={`w-full rounded-2xl ${coverHeight}`} />
      <div className="mt-4 space-y-3">
        <Skeleton className="h-5 w-3/4 rounded-md" />
        {hasLines && (
          <SkeletonText lines={2} gap="gap-2" lastLineWidth="w-1/2" />
        )}
      </div>
    </div>
  );
}

Skeleton.Text = SkeletonText;
Skeleton.Avatar = SkeletonAvatar;
Skeleton.Badge = SkeletonBadge;
Skeleton.Card = SkeletonCard;

export default Skeleton;
