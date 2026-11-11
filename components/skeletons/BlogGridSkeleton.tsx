"use client";

import React from "react";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";

export default function BlogGridSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50/50 py-12 dark:bg-gray-950 animate-fade-in" role="status" aria-label="Loading blog posts...">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto flex flex-col items-center">
          <Skeleton className="h-6 w-44 rounded-full" />
          <Skeleton className="h-10 w-80 sm:w-96 rounded-xl" />
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>

        {/* Categories & Search */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-10 w-full sm:w-64 rounded-xl" />
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <Skeleton className="h-60 w-full rounded-none" />
              <div className="p-6 sm:p-8 space-y-4 flex flex-col justify-between flex-1">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3.5 w-24 rounded-md" />
                    <Skeleton className="h-3.5 w-16 rounded-md" />
                  </div>
                  <Skeleton className="h-7 w-5/6 rounded-lg" />
                  <SkeletonText lines={2} gap="gap-2" lastLineWidth="w-3/4" />
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-28 rounded-md" />
                  </div>
                  <Skeleton className="h-4 w-16 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
