"use client"

import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { fingerprintClusters } from "@/lib/data";
import { Button } from "@/components/ui/button";

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function FingerprintPage() {
  return (
    <AdminLayout pageTitle="Session Fingerprinting">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Fingerprint Clusters</CardTitle>
                    <CardDescription>Groups of sessions sharing similar fingerprints, likely indicating botnets.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-96 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={fingerprintClusters} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="id" tickFormatter={(value) => value.substring(0, 6)} stroke="hsl(var(--muted-foreground))"/>
                                <YAxis stroke="hsl(var(--muted-foreground))" />
                                <Tooltip
                                    cursor={{fill: 'hsl(var(--muted))'}}
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--background))",
                                        borderColor: "hsl(var(--border))"
                                    }}
                                />
                                <Bar dataKey="count" name="Sessions">
                                    {fingerprintClusters.map((entry, index) => (
                                        <Cell cursor="pointer" fill={COLORS[index % COLORS.length]} key={`cell-${index}`} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1">
            <Card>
                 <CardHeader>
                    <CardTitle>Top Clusters</CardTitle>
                    <CardDescription>Highest volume fingerprints.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Fingerprint Hash</TableHead>
                                <TableHead className="text-right">Sessions</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fingerprintClusters.map((cluster) => (
                                <TableRow key={cluster.id}>
                                    <TableCell className="font-mono text-xs">{cluster.id}</TableCell>
                                    <TableCell className="text-right font-medium">{cluster.count}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="destructive" size="sm">Block</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
