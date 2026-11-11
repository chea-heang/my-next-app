"use client";

import React from "react";
import { FadeIn } from "./FadeIn";

export interface StaggerListProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  staggerDelay?: number; // ms delay between items
  initialDelay?: number; // ms delay before first item
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  className?: string;
  itemClassName?: string;
  as?: React.ElementType;
}

export function StaggerList({
  children,
  staggerDelay = 70,
  initialDelay = 0,
  direction = "up",
  duration = 400,
  className = "",
  itemClassName = "",
  as: Component = "div",
  ...props
}: StaggerListProps) {
  const childrenArray = React.Children.toArray(children);

  return (
    <Component className={className} {...props}>
      {childrenArray.map((child, index) => {
        const itemDelay = initialDelay + index * staggerDelay;
        return (
          <FadeIn
            key={React.isValidElement(child) && child.key ? child.key : index}
            direction={direction}
            delay={itemDelay}
            duration={duration}
            className={itemClassName}
          >
            {child}
          </FadeIn>
        );
      })}
    </Component>
  );
}

export default StaggerList;
