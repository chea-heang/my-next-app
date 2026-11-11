"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in" role="status" aria-label="Loading admin dashboard...">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48 rounded-full" />
          <Skeleton className="h-8 w-72 sm:w-96 rounded-lg" />
          <Skeleton className="h-4 w-60 rounded-md" />
        </div>
        <Skeleton className="h-10 w-36 rounded-2xl" />
      </div>

      {/* Metrics Row (4 cards) */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-3xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-24 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-xl" />
            </div>
            <Skeleton className="mt-4 h-8 w-28 rounded-lg" />
            <Skeleton className="mt-2 h-3 w-32 rounded-md" />
          </div>
        ))}
      </div>

      {/* Tabs Row */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32 rounded-2xl" />
          <Skeleton className="h-9 w-28 rounded-2xl" />
          <Skeleton className="h-9 w-28 rounded-2xl" />
        </div>
        <Skeleton className="h-8 w-28 rounded-xl hidden sm:block" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-3xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-4 w-20 rounded-md" />
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800 p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((row) => (
            <div
              key={row}
              className="flex items-center justify-between py-2 gap-4"
            >
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="h-8 w-8 rounded-xl" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-40 rounded-md" />
                  <Skeleton className="h-3 w-28 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-4 w-24 rounded-md hidden md:block" />
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-7 w-20 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
