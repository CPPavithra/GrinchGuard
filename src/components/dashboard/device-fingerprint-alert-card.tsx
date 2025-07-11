"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Fingerprint, Users, Mail } from "lucide-react"

type AbuseEntry = {
  fingerprint: string
  emails: string[]
}

export function DeviceFingerprintAlertCard() {
  const [abuses, setAbuses] = useState<AbuseEntry[]>([])

  useEffect(() => {
    fetch("http://localhost:8000/auth/device-abuse")
      .then(res => res.json())
      .then((data: AbuseEntry[]) => {
        setAbuses(data.filter(entry => entry.emails.length >= 3))
      })
  }, [])

  return (
    <Card className="shadow-lg border-yellow-600 border-l-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-600">
          <Users className="h-5 w-5" />
          Suspicious Device Fingerprints
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {abuses.length === 0 ? (
          <p className="text-muted-foreground text-sm">No suspicious devices detected.</p>
        ) : (
          abuses.map((entry, idx) => (
            <div
              key={idx}
              className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm space-y-1"
            >
              <div className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4" />
                <span className="font-mono">{entry.fingerprint.slice(0, 16)}...</span>
              </div>
              <div className="text-xs text-gray-700">
                {entry.emails.length} linked accounts:
              </div>
              <div className="flex flex-wrap gap-1 text-xs text-gray-800">
                {entry.emails.map((email, i) => (
                  <Badge key={i} variant="outline">{email}</Badge>
                ))}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
