"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { topFlaggedIPs as initialTopFlaggedIPs } from "@/lib/data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export function TopThreatsChart() {
    const [data, setData] = useState(initialTopFlaggedIPs);

    useEffect(() => {
        const interval = setInterval(() => {
            setData(currentData => {
                const newData = currentData.map(item => ({
                    ...item,
                    value: Math.max(50, Math.floor(item.value + (Math.random() - 0.5) * 100))
                }));
                // Sort to keep the "top" threats at the top
                newData.sort((a, b) => b.value - a.value);
                return newData;
            });
        }, 3500); // Update every 3.5 seconds

        return () => clearInterval(interval);
    }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Flagged IPs</CardTitle>
        <CardDescription>IP addresses with the most suspicious requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" width={80} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            borderColor: "hsl(var(--border))"
                        }}
                    />
                    <Bar dataKey="value" name="Requests" fill="hsl(var(--primary))">
                        {data.map((entry, index) => (
                            <Cell cursor="pointer" fill={COLORS[index % COLORS.length]} key={`cell-${index}`} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
