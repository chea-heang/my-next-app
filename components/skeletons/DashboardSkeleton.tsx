"use client";

import React from "react";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in" role="status" aria-label="Loading dashboard...">
      {/* 3 Metrics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-10 rounded-2xl" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="mt-4 h-8 w-28 rounded-lg" />
            <Skeleton className="mt-2 h-4 w-40 rounded-md" />
          </div>
        ))}
      </div>

      {/* Upcoming Ticket Shell */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        <div className="flex items-center justify-between border-b border-gray-100 pb-5 dark:border-gray-800">
          <div className="space-y-2">
            <Skeleton className="h-6 w-56 rounded-md" />
            <Skeleton className="h-4 w-40 rounded-md" />
          </div>
          <Skeleton className="h-4 w-20 rounded-md" />
        </div>

        <div className="mt-6 flex flex-col gap-6 rounded-2xl border border-gray-100 bg-gray-50/60 p-6 dark:border-gray-800 dark:bg-gray-900/60 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3 flex-1">
            <Skeleton className="h-5 w-24 rounded-lg" />
            <Skeleton className="h-7 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
            <div className="flex flex-wrap gap-3 pt-2">
              <Skeleton className="h-5 w-24 rounded-md" />
              <Skeleton className="h-5 w-20 rounded-md" />
              <Skeleton className="h-5 w-28 rounded-md" />
              <Skeleton className="h-5 w-20 rounded-md" />
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800">
            <Skeleton className="h-28 w-28 rounded-lg" />
            <Skeleton className="h-3 w-16 rounded-md" />
          </div>
        </div>
      </div>

      {/* Recent Bookings Placeholder */}
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-20 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>
              <Skeleton className="h-6 w-2/3 rounded-lg" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
            </div>
            <Skeleton className="h-16 w-16 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
