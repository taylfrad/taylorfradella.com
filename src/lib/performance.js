function isMobileUserAgent(userAgent) {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent,
  );
}

export function isLikelyLowEndDevice() {
  if (typeof navigator === "undefined") return false;

  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = navigator.deviceMemory ?? 8;
  const mobile = isMobileUserAgent(navigator.userAgent ?? "");

  if (memory <= 3 || cores <= 2) return true;
  if (memory <= 4 && cores <= 4) return true;
  if (mobile && (memory <= 6 || cores <= 6)) return true;

  return false;
}

