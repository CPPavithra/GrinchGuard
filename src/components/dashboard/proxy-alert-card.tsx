"use client"

import { useEffect, useState, useRef } from "react"
import { AlertTriangle, Globe, WifiOff, ShieldAlert } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

type IPInfo = {
  ip: string
  isp: string
  city: string
  country: string
  org: string
  proxy: boolean
  hosting: boolean
  mobile: boolean
  countryCode?: string
  attack_type: string
  severity: string
  timestamp: string
}

export function ProxyAlertCard() {
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null)
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/attack-simulator/ws")
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data && data.headers) {
        // Simulated backend should attach geo & proxy metadata
        setIpInfo({
          ip: data.headers["X-Forwarded-For"] || "N/A",
          isp: data.isp || "Unknown ISP",
          city: data.city || "Unknown City",
          country: data.country || "Unknown Country",
          org: data.org || "",
          countryCode: data.country_code || "XX",
          proxy: data.proxy || false,
          mobile: data.mobile || false,
          hosting: data.hosting || false,
          attack_type: data.attack_type || "Unknown",
          severity: data.severity || "Low",
          timestamp: data.timestamp || new Date().toISOString(),
        })
      }
    }

    return () => {
      if (ws.current) ws.current.close()
    }
  }, [])

  return (
    <Card className="w-full shadow-lg border-red-500 border-l-4">
      <CardHeader>
        <CardTitle className="text-red-600 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5" />
          Suspicious Proxy Alert
        </CardTitle>
      </CardHeader>

      <CardContent>
        {ipInfo ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={ipInfo.ip}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">IP Address:</div>
                <div className="font-mono">{ipInfo.ip}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Location:</div>
                <div className="font-semibold">
                  🌍 {ipInfo.city}, {ipInfo.country}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">ISP:</div>
                <div className="truncate text-sm">{ipInfo.isp}</div>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {ipInfo.proxy && <Badge variant="destructive">Proxy</Badge>}
                {ipInfo.hosting && (
                  <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
                    Hosting Provider
                  </Badge>
                )}
                {ipInfo.mobile && (
                  <Badge className="bg-blue-500 text-white hover:bg-blue-600">
                    Mobile ISP
                  </Badge>
                )}
                <Badge variant="outline">{ipInfo.attack_type}</Badge>
                <Badge
                  className={`${
                    ipInfo.severity === "High"
                      ? "bg-red-600"
                      : ipInfo.severity === "Medium"
                      ? "bg-orange-500"
                      : "bg-gray-500"
                  } text-white`}
                >
                  {ipInfo.severity} Risk
                </Badge>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="text-muted-foreground text-sm">Waiting for activity...</div>
        )}
      </CardContent>
    </Card>
  )
}
