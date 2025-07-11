// components/ActivityTrackerWrapper.tsx
"use client"

import { useUserActivityTracker } from "@/hooks/useUserActivityTracker";

export default function ActivityTrackerWrapper() {
  useUserActivityTracker();
  return null; // invisible component
}
