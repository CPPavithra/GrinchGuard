import { AdminLayout } from "@/components/admin-layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { BotVsHumanChart } from "@/components/dashboard/bot-vs-human-chart"
import { AttackTypesChart } from "@/components/dashboard/attack-types-chart"
import { TopThreatsChart } from "@/components/dashboard/top-threats-chart"
import { LogsTable } from "@/components/dashboard/logs-table"
import { ProxyAlertCard } from "@/components/dashboard/proxy-alert-card"
import { StolenAttemptsCard } from "@/components/dashboard/stolen-attempts-card"
import { DataBreachCard } from "@/components/dashboard/data-breach-card"
import { DeviceFingerprintAlertCard } from "@/components/dashboard/device-fingerprint-alert-card"

export default function AdminDashboardPage() {
  return (
    <AdminLayout pageTitle="ThreatOps Dashboard">
      <div className="space-y-8">
        {/* System Controls + Primary Charts */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>System Controls</CardTitle>
              <CardDescription>Manage automated security responses.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-ban-toggle" className="text-base">Auto-Ban High-Risk</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically block fingerprints that exceed the threat threshold.
                  </p>
                </div>
                <Switch id="auto-ban-toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="slack-alert-toggle" className="text-base">Slack Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Send alerts to the #security channel for critical events.
                  </p>
                </div>
                <Switch id="slack-alert-toggle" defaultChecked />
              </div>
            </CardContent>
          </Card>

          <BotVsHumanChart />
          <AttackTypesChart />
        </div>

        {/* Alert Cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-3">
            <ProxyAlertCard />
          </div>
        </div>

  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  <StolenAttemptsCard />
  <DataBreachCard />
  <DeviceFingerprintAlertCard />
  <LogsTable />
</div>
      </div>
    </AdminLayout>
  )
}

