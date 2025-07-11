export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  dataAiHint: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  ip: string;
  path: string;
  threatScore: number;
  fingerprint: string;
  isBot: boolean;
  method: 'GET' | 'POST' | 'PUT';
  user: string;
}

export interface ChartDataItem {
  name: string;
  value: number;
}

export interface TrafficData {
  time: string;
  human: number;
  bot: number;
}

export interface FingerprintCluster {
  id: string;
  count: number;
}

export interface Alert {
  id: string;
  timestamp: string;
  ip: string;
  fingerprint: string;
  triggeredBy: string;
  type: 'High Threat Score' | 'Honeypot Access' | 'Automated Block';
}
