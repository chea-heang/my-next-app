"use client";

import React from "react";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";

export default function ArticleSkeleton() {
  return (
    <div className="min-h-screen bg-white py-12 dark:bg-gray-950 animate-fade-in" role="status" aria-label="Loading article...">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-8">
        {/* Back Link */}
        <Skeleton className="h-4 w-36 rounded-md" />

        {/* Title & Metadata */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-28 rounded-lg" />
          <Skeleton className="h-10 sm:h-12 w-4/5 rounded-xl" />
          <Skeleton className="h-10 sm:h-12 w-2/3 rounded-xl" />

          <div className="flex items-center gap-4 border-b border-gray-100 pb-6 dark:border-gray-800">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-3 w-44 rounded-md" />
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="overflow-hidden rounded-3xl">
          <Skeleton className="h-[360px] sm:h-[420px] w-full rounded-3xl" />
        </div>

        {/* Article Body Content */}
        <div className="space-y-6 pt-2">
          <SkeletonText lines={4} gap="gap-3" lastLineWidth="w-4/5" />
          <SkeletonText lines={5} gap="gap-3" lastLineWidth="w-3/5" />
          <SkeletonText lines={3} gap="gap-3" lastLineWidth="w-2/3" />
        </div>

        {/* Comments Section Skeleton */}
        <div className="border-t border-gray-100 pt-10 dark:border-gray-800 space-y-6">
          <Skeleton className="h-6 w-32 rounded-lg" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />

          <div className="space-y-4 pt-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-900/60 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-3 w-16 rounded-md" />
                </div>
                <Skeleton className="h-4 w-3/4 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
