"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Fingerprint, Mail, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type StolenLog = {
  timestamp: string
  email: string
  ip: string
  fingerprint: string
  event: string
}

export function StolenAttemptsCard() {
  const [attempts, setAttempts] = useState<StolenLog[]>([])
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/auth/ws/stolen-attempts")
    ws.current.onmessage = (event) => {
      const log = JSON.parse(event.data)
      setAttempts(prev => [log, ...prev.slice(0, 4)]) // Keep only 5 latest
    }

    return () => {
      if (ws.current) ws.current.close()
    }
  }, [])

  return (
    <Card className="col-span-1 shadow-lg border-red-600 border-l-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          Stolen Credential Attempts
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {attempts.length === 0 ? (
          <p className="text-muted-foreground text-sm">No alerts yet.</p>
        ) : (
          <AnimatePresence mode="wait">
            {attempts.map((log, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="bg-red-50 border border-red-200 rounded-md p-3 text-sm space-y-1"
              >
                <div className="flex items-center gap-2 text-red-800">
                  <Mail className="h-4 w-4" />
                  <span>{log.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-700">
                  <Fingerprint className="h-4 w-4" />
                  <span className="font-mono">{log.fingerprint.slice(0, 10)}...</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-700">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <Badge variant="destructive" className="text-xs">
                  {log.event}
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  )
}
