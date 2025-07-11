"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ShieldAlert,
  Fingerprint,
  Mail,
  UserCheck,
  AlertCircle,
  Loader2
} from "lucide-react"

type BreachData = {
  email: string
  breached: boolean
  linked_accounts: string[]
}

export function DataBreachCard() {
  const [data, setData] = useState<BreachData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const payload = {
      email: "victim@example.com",
      password: "wrong-password",
      fingerprint: "device-123-xyz"
    }

    fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success" || res.alert) {
          setData({
            email: payload.email,
            breached: res.breached || false,
            linked_accounts: res.linked_accounts || []
          })
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card className="shadow-lg border-blue-600 border-l-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-600">
          <ShieldAlert className="h-5 w-5" />
          Breach & Device Abuse Status
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="animate-spin h-4 w-4" />
            Checking breach status...
          </div>
        )}

        {!loading && data && (
          <>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4" />
              <span>{data.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <UserCheck className="h-4 w-4" />
              <span>{data.linked_accounts.length} linked account(s)</span>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              <Badge
                className={
                  data.breached
                    ? "bg-red-600 text-white"
                    : "bg-green-600 text-white"
                }
              >
                {data.breached ? "Breached" : "Safe"}
              </Badge>
              {data.linked_accounts.length >= 3 && (
                <Badge variant="destructive" className="text-xs">
                  Suspicious Device Usage
                </Badge>
              )}
            </div>
          </>
        )}

        {!loading && !data && (
          <div className="text-muted-foreground text-sm">
            No login data available.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

