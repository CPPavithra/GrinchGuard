"use client"

import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Cell,
  Legend,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]

type AttackTypeData = {
  name: string
  value: number
  attack_type: string
  count: number
}

export function AttackTypesChart() {
  const [data, setData] = useState<AttackTypeData[]>([])

  useEffect(() => {
    async function fetchAttackData() {
      try {
        const res = await fetch("http://localhost:8000/attack-simulator/logs")
        const logs = await res.json()

        // Count the types
        const counter: Record<string, number> = {}

        logs.forEach((log: any) => {
          const type = log.attack_type || "Unknown"
          counter[type] = (counter[type] || 0) + 1
        })

        const formatted = Object.entries(counter).map(([attack_type, count]) => ({
          name: attack_type,
          value: count,
          attack_type,
          count,
        }))

        setData(formatted)
      } catch (err) {
        console.error("Failed to fetch attack types:", err)
      }
    }

    fetchAttackData() // initial fetch
    const interval = setInterval(fetchAttackData, 5000) // refresh every 5 seconds
    return () => clearInterval(interval) // cleanup
  }, [])

  return (
    <Card className="w-full h-[400px]">
      <CardHeader>
        <CardTitle className="text-lg">Live Attack Types</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] flex justify-center items-center">
        {data.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No attacks detected yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                dataKey="value"
                nameKey="name"
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

