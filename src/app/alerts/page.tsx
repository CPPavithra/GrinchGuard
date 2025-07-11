"use client";

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

type RemediationEntry = {
  id: string
  timestamp: string
  type: string
  target: string
  reason: string
}

export default function RemediationLogPage() {
  const [logs, setLogs] = useState<RemediationEntry[]>([])

  useEffect(() => {
    fetch("http://localhost:8000/auth/remediation-log")
      .then(res => res.json())
      .then(setLogs)
  }, [])

  return (
    <AdminLayout pageTitle="Remediation Log">
      <Card>
        <CardHeader>
          <CardTitle>Auto-Remediation Actions</CardTitle>
          <CardDescription>Actions taken by the system to block malicious IPs and devices.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="destructive">{entry.type}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{entry.target}</TableCell>
                  <TableCell className="text-sm">{entry.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}

