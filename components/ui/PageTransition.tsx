"use client";

import React from "react";
import { usePathname } from "next/navigation";

export interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({
  children,
  className = "",
}: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      className={`animate-fade-in ${className}`}
    >
      {children}
    </div>
  );
}

export default PageTransition;
