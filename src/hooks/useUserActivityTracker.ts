"use client"

import { useEffect, useRef } from "react"

export function useUserActivityTracker() {
  const startTimeRef = useRef(Date.now())
  const clickCountRef = useRef(0)
  const visitedPathsRef = useRef(new Set<string>())
  const lastRequestTimeRef = useRef(Date.now())
  const repeatedPathCountRef = useRef(0)

  useEffect(() => {
    const handleClick = () => {
      clickCountRef.current++
    }

    const track = () => {
      const now = Date.now()
      const duration = (now - startTimeRef.current) / 1000
      const timeSinceLastRequest = (now - lastRequestTimeRef.current) / 1000
      lastRequestTimeRef.current = now

      const path = window.location.pathname
      const visitedPaths = visitedPathsRef.current
      const wasVisited = visitedPaths.has(path)

      if (wasVisited) {
        repeatedPathCountRef.current++
      }
      visitedPaths.add(path)

      const repeatedRatio =
        repeatedPathCountRef.current / visitedPaths.size || 0

      const clickRate = clickCountRef.current / duration

      const entropy = (str: string) => {
        const map = new Map()
        for (let char of str) {
          map.set(char, (map.get(char) || 0) + 1)
        }
        return -[...map.values()]
          .map(f => f / str.length)
          .reduce((a, b) => a + b * Math.log2(b), 0)
      }

      const payload = {
        session_id: crypto.randomUUID(),
        clicks_per_session: clickCountRef.current,
        session_duration: duration,
        time_between_requests: timeSinceLastRequest,
        ua_entropy: entropy(navigator.userAgent),
        referer_entropy: entropy(document.referrer || ""),
        click_rate: clickRate,
        suspicious_ua: /bot|crawl|spider/i.test(navigator.userAgent) ? 1 : 0,
        cookies_enabled: navigator.cookieEnabled ? 1 : 0,
        time_of_day: new Date().getHours(),
        request_path_depth: path.split("/").filter(Boolean).length,
        num_unique_pages: visitedPaths.size,
        repeated_paths_ratio: repeatedRatio
      }

      fetch("http://localhost:8000/fraud/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).catch(console.error)
    }

    // Track clicks
    document.addEventListener("click", handleClick)

    // Track page visibility exit
    window.addEventListener("beforeunload", track)

    // Optional: periodic ping every 10s
    const interval = setInterval(track, 10000)

    return () => {
      document.removeEventListener("click", handleClick)
      window.removeEventListener("beforeunload", track)
      clearInterval(interval)
    }
  }, [])
}
