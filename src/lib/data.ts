import type { Product, LogEntry, TrafficData, ChartDataItem, FingerprintCluster, Alert } from './types';

export const products: Product[] = [
  {
    id: '1',
    name: 'SuperStream Gaming Console',
    description: 'Next-generation gaming console with 8K support, ultra-fast SSD, and immersive haptic feedback. Experience gaming like never before.',
    price: 499.99,
    image: 'https://placehold.co/600x600.png',
    dataAiHint: 'gaming console'
  },
  {
    id: '2',
    name: 'AeroDrone Pro 4K',
    description: 'Capture stunning aerial footage with this professional-grade 4K drone. Features a 3-axis gimbal, 30-minute flight time, and advanced obstacle avoidance.',
    price: 799.0,
    image: 'https://placehold.co/600x600.png',
    dataAiHint: 'drone'
  },
  {
    id: '3',
    name: 'SmartHome Hub Central',
    description: 'The ultimate smart home controller. Unify all your smart devices into one simple-to-use interface. Voice control, automations, and more.',
    price: 129.5,
    image: 'https://placehold.co/600x600.png',
    dataAiHint: 'smart home'
  },
  {
    id: '4',
    name: 'Quantum VR Headset',
    description: 'Step into new realities with the Quantum VR Headset. High-resolution displays, inside-out tracking, and comfortable ergonomics for extended play.',
    price: 349.99,
    image: 'https://placehold.co/600x600.png',
    dataAiHint: 'vr headset'
  },
  {
    id: '5',
    name: 'EcoFresh Smart Refrigerator',
    description: 'A 25-cubic-foot smart refrigerator with a built-in touchscreen, internal cameras, and AI-powered food tracking to reduce waste.',
    price: 2499.99,
    image: 'https://placehold.co/600x600.png',
    dataAiHint: 'refrigerator'
  },
  {
    id: '6',
    name: 'Pro-Gamer Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with custom switches for lightning-fast response times. Fully programmable with durable aluminum frame.',
    price: 149.99,
    image: 'https://placehold.co/600x600.png',
    dataAiHint: 'gaming keyboard'
  },
    {
    id: '7',
    name: 'UltraWide 49" Curved Monitor',
    description: 'Immerse yourself in work or play with this 49-inch curved QLED monitor. Dual QHD resolution provides an expansive and vibrant display.',
    price: 1199.99,
    image: 'https://placehold.co/600x600.png',
    dataAiHint: 'curved monitor'
  },
  {
    id: '8',
    name: 'Noise-Cancelling Headphones',
    description: 'Tune out the world and tune into your music with industry-leading noise cancellation. 30-hour battery life and superior sound quality.',
    price: 349.99,
    image: 'https://placehold.co/600x600.png',
    dataAiHint: 'headphones'
  },
];

export const getProductById = (id: string): Product | undefined => products.find(p => p.id === id);

export const trafficData: TrafficData[] = [
    { time: '12:00', human: 420, bot: 15 },
    { time: '12:05', human: 450, bot: 90 },
    { time: '12:10', human: 510, bot: 120 },
    { time: '12:15', human: 480, bot: 280 },
    { time: '12:20', human: 550, bot: 190 },
    { time: '12:25', human: 600, bot: 40 },
    { time: '12:30', human: 580, bot: 30 },
];

export const attackTypesData: ChartDataItem[] = [
  { name: 'Honeypot Hits', value: 120 },
  { name: 'Header Spoofing', value: 350 },
  { name: 'Click Flooding', value: 280 },
  { name: 'Fake Checkout', value: 90 },
];

export const topFlaggedIPs: ChartDataItem[] = [
    { name: '192.168.1.101', value: 450 },
    { name: '10.0.0.5', value: 380 },
    { name: '172.16.31.54', value: 290 },
    { name: '203.0.113.12', value: 150 },
    { name: '198.51.100.8', value: 95 },
];

export const latestLogs: LogEntry[] = [
  { id: '1', timestamp: '2023-12-25 12:30:15', ip: '192.168.1.101', path: '/checkout_fake', threatScore: 95, fingerprint: 'a1b2c3d4', isBot: true, method: 'POST', user: 'bot_user_1' },
  { id: '2', timestamp: '2023-12-25 12:30:14', ip: '10.0.0.5', path: '/product/2', threatScore: 88, fingerprint: 'e5f6g7h8', isBot: true, method: 'GET', user: 'bot_user_2' },
  { id: '3', timestamp: '2023-12-25 12:30:12', ip: '192.168.1.101', path: '/product/4', threatScore: 76, fingerprint: 'a1b2c3d4', isBot: true, method: 'GET', user: 'bot_user_1' },
  { id: '4', timestamp: '2023-12-25 12:30:10', ip: '209.12.34.56', path: '/home', threatScore: 10, fingerprint: 'i9j0k1l2', isBot: false, method: 'GET', user: 'real_user_3' },
  { id: '5', timestamp: '2023-12-25 12:30:08', ip: '10.0.0.5', path: '/product/1', threatScore: 85, fingerprint: 'e5f6g7h8', isBot: true, method: 'GET', user: 'bot_user_2' },
  { id: '6', timestamp: '2023-12-25 12:30:05', ip: '78.90.12.34', path: '/product/5', threatScore: 5, fingerprint: 'm3n4o5p6', isBot: false, method: 'GET', user: 'real_user_10' },
];

export const fingerprintClusters: FingerprintCluster[] = [
  { id: 'a1b2c3d4e5f6', count: 1250 },
  { id: 'g7h8i9j0k1l2', count: 890 },
  { id: 'm3n4o5p6q7r8', count: 450 },
  { id: 's9t0u1v2w3x4', count: 210 },
  { id: 'y5z6a7b8c9d0', count: 95 },
];

export const alerts: Alert[] = [
  { id: '1', timestamp: '2023-12-25 12:30:15', ip: '192.168.1.101', fingerprint: 'a1b2c3d4', triggeredBy: 'Threat Score > 90', type: 'High Threat Score' },
  { id: '2', timestamp: '2023-12-25 12:28:45', ip: '10.0.0.5', fingerprint: 'e5f6g7h8', triggeredBy: 'Auto-ban logic', type: 'Automated Block' },
  { id: '3', timestamp: '2023-12-25 12:25:01', ip: '192.168.1.101', fingerprint: 'a1b2c3d4', triggeredBy: 'Honeypot Access (/checkout_fake)', type: 'Honeypot Access' },
  { id: '4', timestamp: '2023-12-25 12:22:19', ip: '172.16.31.54', fingerprint: 'm3n4o5p6', triggeredBy: 'Threat Score > 90', type: 'High Threat Score' },
];
