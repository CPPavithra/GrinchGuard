"use client"

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "../ui/button"
import { FileText, Wifi, WifiOff } from "lucide-react"

export function LogsTable() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const ws = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // Fetch initial logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('http://localhost:8000/merkel-logging/logs?limit=100');
        const data = await response.json();
        setLogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // WebSocket connection
  const connectWebSocket = () => {
    try {
      ws.current = new WebSocket('ws://localhost:8000/merkel-logging/ws-merkel');
      setConnectionStatus('connecting');

      ws.current.onopen = () => {
        console.log('WebSocket connected');
        setConnectionStatus('connected');
        
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const newLog = JSON.parse(event.data);
          setLogs(prev => [newLog, ...prev]);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.current.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setConnectionStatus('disconnected');
        
        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Attempting to reconnect...');
            connectWebSocket();
          }, 3000);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('disconnected');
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionStatus('disconnected');
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'connecting':
        return <Wifi className="h-4 w-4 text-yellow-500 animate-pulse" />;
      default:
        return <WifiOff className="h-4 w-4 text-red-500" />;
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      default:
        return 'Disconnected';
    }
  };

  if (loading) {
    return (
      <Card className="col-span-1 lg:col-span-2 xl:col-span-3">
        <CardHeader>
          <CardTitle>Immutable Request Logs</CardTitle>
          <CardDescription>Loading logs...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-1 lg:col-span-2 xl:col-span-3">
        <CardHeader>
          <CardTitle>Immutable Request Logs</CardTitle>
          <CardDescription>Error loading logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 lg:col-span-2 xl:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            Immutable Request Logs
            <div className="flex items-center gap-1 text-sm font-normal">
              {getConnectionIcon()}
              <span className="text-muted-foreground">{getConnectionText()}</span>
            </div>
          </CardTitle>
          <CardDescription>Real-time stream of security events with blockchain verification.</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Fingerprint</TableHead>
              <TableHead>Prediction</TableHead>
              <TableHead>Request Path</TableHead>
              <TableHead>Chain Hash</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.current_hash || log.id}>
                <TableCell>{log.timestamp}</TableCell>
                <TableCell className="font-mono text-xs">
                  <Link href="/fingerprint" className="hover:underline">
                    {log.fingerprint ? log.fingerprint.slice(0, 8) + '...' : 'N/A'}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={log.prediction === 'bot' ? "destructive" : "default"}>
                    {log.prediction ? log.prediction.toUpperCase() : 'UNKNOWN'}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono">{log.request_path || 'N/A'}</TableCell>
                <TableCell className="font-mono text-xs">
                  {log.current_hash ? log.current_hash.slice(0, 8) + '...' : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
