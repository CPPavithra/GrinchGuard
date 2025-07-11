// lib/tracker.ts

let startTime = Date.now();
let clickCount = 0;
const visitedPaths = new Set<string>();
let lastRequestTime = Date.now();
let repeatedPaths = 0;

export function initActivityTracker() {
  document.addEventListener("click", () => {
    clickCount++;
  });

  window.addEventListener("beforeunload", () => {
    sendData();
  });

  visitedPaths.add(window.location.pathname);
}

async function sendData() {
  const now = Date.now();
  const duration = (now - startTime) / 1000;
  const timeSinceLastReq = (now - lastRequestTime) / 1000;
  lastRequestTime = now;

  const repeatedPathRatio = repeatedPaths / visitedPaths.size;
  const clickRate = clickCount / duration;

  // Get entropy (very basic version)
  function entropy(str: string): number {
    const map = new Map();
    for (let char of str) map.set(char, (map.get(char) || 0) + 1);
    return -[...map.values()]
      .map(f => f / str.length)
      .reduce((a, b) => a + b * Math.log2(b), 0);
  }

  const payload = {
    session_id: crypto.randomUUID(),
    clicks_per_session: clickCount,
    session_duration: duration,
    time_between_requests: timeSinceLastReq,
    ua_entropy: entropy(navigator.userAgent),
    referer_entropy: entropy(document.referrer || ""),
    click_rate: clickRate,
    suspicious_ua: /bot|crawl|spider/i.test(navigator.userAgent) ? 1 : 0,
    cookies_enabled: navigator.cookieEnabled ? 1 : 0,
    time_of_day: new Date().getHours(),
    request_path_depth: window.location.pathname.split("/").filter(Boolean).length,
    num_unique_pages: visitedPaths.size,
    repeated_paths_ratio: repeatedPathRatio,
  };

  try {
    await fetch("http://localhost:8000/fraud/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error("[Tracker] Failed to send activity data", err);
  }
}
