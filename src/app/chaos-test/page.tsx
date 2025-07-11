"use client"

import { useState } from 'react';
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { scoreSessionThreat } from "@/ai/flows/threat-scoring";
import type { ThreatScoreInput, ThreatScoreOutput } from "@/ai/flows/threat-scoring";
import { Bot } from "lucide-react";
import { ScrollArea } from '@/components/ui/scroll-area';

type SimulationResult = ThreatScoreOutput & {
  simulationType: string;
  timestamp: string;
};


export default function ChaosTestPage() {
  const [simulationType, setSimulationType] = useState("basic");
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const { toast } = useToast();

  const handleRunSimulation = async () => {
    setIsRunning(true);
    setProgress(0);

    const mockInput: ThreatScoreInput = {
        sessionId: `sim_${Date.now()}`,
        headers: { 'User-Agent': 'GrinchBot/1.0', 'X-Forwarded-For': '123.123.123.123' },
        behaviorVector: simulationType === 'basic' ? [0.1, 0.9, 0.2] : [0.9, 0.1, 0.8],
        ipEntropy: simulationType === 'advanced' ? 0.95 : 0.2,
        timeBetweenRequests: simulationType === 'grinchai' ? [10, 25, 15] : [100, 120, 110],
        resourceAccessed: '/checkout_fake',
    }

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 200);

    try {
        const score = await scoreSessionThreat(mockInput);
        setResults(prevResults => [{
            ...score,
            simulationType: simulationType,
            timestamp: new Date().toLocaleTimeString(),
        }, ...prevResults]);
        setProgress(100);
        toast({
            title: "Simulation Complete",
            description: `Threat score of ${score.threatScore} assigned.`,
        });
    } catch (error) {
        console.error("AI Scoring Error:", error);
        toast({
            title: "Simulation Failed",
            description: "Could not get a score from the AI model.",
            variant: "destructive",
        });
    } finally {
        clearInterval(progressInterval);
        setIsRunning(false);
        setProgress(0);
    }
  };

  const getBotTypeLabel = (type: string) => {
      switch(type) {
          case 'basic': return 'Basic Bot';
          case 'advanced': return 'Advanced Bot';
          case 'grinchai': return 'Grinch AI';
          default: return 'Bot';
      }
  }

  return (
    <AdminLayout pageTitle="Chaos Test: Bot Simulator">
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configure Simulation</CardTitle>
            <CardDescription>Select a bot type and run the simulation to test defenses.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup defaultValue="basic" onValueChange={setSimulationType} disabled={isRunning}>
              <Label className="text-lg">Bot Simulation Mode</Label>
              <div className="flex items-center space-x-2 rounded-md border p-4">
                <RadioGroupItem value="basic" id="basic" />
                <Label htmlFor="basic" className="flex-1">
                  <span className="font-semibold">Basic Bot</span>
                  <p className="text-sm text-muted-foreground">Fast requests, simple patterns.</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-4">
                <RadioGroupItem value="advanced" id="advanced" />
                <Label htmlFor="advanced" className="flex-1">
                  <span className="font-semibold">Advanced Bot</span>
                  <p className="text-sm text-muted-foreground">Header spoofing, randomized delays.</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-4">
                <RadioGroupItem value="grinchai" id="grinchai" />
                <Label htmlFor="grinchai" className="flex-1">
                  <span className="font-semibold">Grinch AI</span>
                  <p className="text-sm text-muted-foreground">Automated checkout, mimics human behavior.</p>
                </Label>
              </div>
            </RadioGroup>
            <Button onClick={handleRunSimulation} disabled={isRunning} className="w-full text-lg">
              {isRunning ? "Running Simulation..." : "Run Simulation"}
            </Button>
            {isRunning && <Progress value={progress} className="w-full" />}
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>AI Threat Score Analysis</CardTitle>
                <CardDescription>Results from the Genkit AI model.</CardDescription>
            </CardHeader>
            <CardContent className="h-[520px]">
                {isRunning && results.length === 0 && (
                     <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <Bot className="h-12 w-12 animate-pulse" />
                        <p className="mt-4">AI is analyzing the bot signature...</p>
                    </div>
                )}
                {results.length > 0 ? (
                    <ScrollArea className="h-full pr-4">
                        <div className="space-y-4">
                            {results.map((result, index) => (
                                <Card key={index} className="bg-muted/50">
                                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                                        <div className="space-y-1">
                                            <CardTitle className="text-xl">{getBotTypeLabel(result.simulationType)}</CardTitle>
                                            <p className="text-xs text-muted-foreground">{result.timestamp}</p>
                                        </div>
                                        <div className="text-4xl font-bold text-destructive">{result.threatScore}<span className="text-2xl text-muted-foreground">/100</span></div>
                                    </CardHeader>
                                    <CardContent>
                                        <Label>AI Explanation</Label>
                                        <p className="mt-1 rounded-md border bg-background p-3 text-sm">{result.explanation}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                ) : (
                    !isRunning && (
                         <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <p>Run a simulation to see the AI analysis.</p>
                        </div>
                    )
                )}
            </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
