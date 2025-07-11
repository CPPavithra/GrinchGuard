"use client"

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function BotVsHumanChart() {
  const [data, setData] = useState([
    { time: "00:00", human: 0, bot: 0 },
  ]);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:8000/fraud/ws-fraud");

    wsRef.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const lastTime = new Date();
      const timeStr = lastTime.toTimeString().substring(0, 5);

      setData(prev => {
        const newPoint = {
          time: timeStr,
          human: msg.prediction === "human" ? 1 : 0,
          bot: msg.prediction === "bot" ? 1 : 0,
        };

        const merged = [...prev];
        const last = merged[merged.length - 1];

        if (last && last.time === newPoint.time) {
          last.human += newPoint.human;
          last.bot += newPoint.bot;
          return [...merged.slice(0, -1), last];
        } else {
          return [...merged.slice(-9), newPoint]; // keep last 10 entries
        }
      });
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bot vs Human Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="human" stroke="#00b894" strokeWidth={2} name="Human" dot={false} />
              <Line type="monotone" dataKey="bot" stroke="#d63031" strokeWidth={2} name="Bot" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

