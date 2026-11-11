"use client";

import React, { useEffect, useRef, useState } from "react";

export interface FadeInProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number; // milliseconds
  duration?: number; // milliseconds
  threshold?: number;
  once?: boolean;
  className?: string;
  as?: React.ElementType;
}

export function FadeIn({
  children,
  direction = "up",
  delay = 0,
  duration = 400,
  threshold = 0.1,
  once = true,
  className = "",
  as: Component = "div",
  ...props
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Check for reduced motion preference
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIsVisible(true);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && domRef.current) {
            observer.unobserve(domRef.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    const currentEl = domRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
      observer.disconnect();
    };
  }, [threshold, once]);

  const transformMap = {
    up: isVisible ? "translate3d(0, 0, 0)" : "translate3d(0, 20px, 0)",
    down: isVisible ? "translate3d(0, 0, 0)" : "translate3d(0, -20px, 0)",
    left: isVisible ? "translate3d(0, 0, 0)" : "translate3d(20px, 0, 0)",
    right: isVisible ? "translate3d(0, 0, 0)" : "translate3d(-20px, 0, 0)",
    none: "none",
  }[direction];

  return (
    <Component
      ref={domRef}
      className={`transition-all ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: transformMap,
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      {...props}
    >
      {children}
    </Component>
  );
}

export default FadeIn;
