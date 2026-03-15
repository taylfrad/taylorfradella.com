import { useMemo } from "react";

/**
 * Determines device performance tier: "high", "medium", or "low".
 *
 * Uses navigator signals (hardwareConcurrency, deviceMemory) and
 * user-agent heuristics. Result is stable for the session lifetime.
 *
 * Usage:
 *   const tier = useDeviceCapability();
 *   if (tier === "low") skip heavy shader / spring / physics work.
 */
export default function useDeviceCapability() {
  return useMemo(() => {
    if (typeof navigator === "undefined") return "high";

    const cores = navigator.hardwareConcurrency || 4;
    // deviceMemory is Chrome-only; undefined elsewhere.
    const memory = navigator.deviceMemory;
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    // Low: ≤2 cores, or ≤2 GB RAM on mobile
    if (cores <= 2 || (isMobile && memory && memory <= 2)) return "low";
    // Medium: ≤4 cores, or ≤4 GB RAM
    if (cores <= 4 || (memory && memory <= 4)) return "medium";
    return "high";
  }, []);
}
