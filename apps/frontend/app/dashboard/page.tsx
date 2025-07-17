'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Globe,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  ChevronDown,
  ChevronRight,
  Plus,
  Calendar,
  Zap,
  Eye,
  ExternalLink,
  WifiOff,
} from 'lucide-react';

interface Tick {
  timestamp: string;
  status: string;
  responseTime: number;
}

// interface Website {
//   id: number;
//   name: string;
//   url: string;
//   status: string;
//   uptime: number;
//   responseTime: number;
//   lastChecked: string;
//   ticks: Tick[];
// }

// Mock data - replace with real API calls
const mockWebsites = [
  {
    id: 1,
    name: 'My DeFi Protocol',
    url: 'https://mydefi.com',
    status: 'online',
    uptime: 99.95,
    responseTime: 245,
    lastChecked: '2 minutes ago',
    ticks: generateMockTicks(30, 'online'),
  },
  {
    id: 2,
    name: 'NFT Marketplace',
    url: 'https://mynftmarket.io',
    status: 'online',
    uptime: 99.12,
    responseTime: 189,
    lastChecked: '1 minute ago',
    ticks: generateMockTicks(30, 'online'),
  },
  {
    id: 3,
    name: 'API Gateway',
    url: 'https://api.myproject.com',
    status: 'degraded',
    uptime: 98.45,
    responseTime: 1250,
    lastChecked: '30 seconds ago',
    ticks: generateMockTicks(30, 'degraded'),
  },
  {
    id: 4,
    name: 'Smart Contract Interface',
    url: 'https://contract.mychain.eth',
    status: 'offline',
    uptime: 85.23,
    responseTime: 0,
    lastChecked: '5 minutes ago',
    ticks: generateMockTicks(30, 'offline'),
  },
];

function generateMockTicks(count: number, primaryStatus: string) {
  const ticks = [];
  for (let i = 0; i < count; i++) {
    let status = primaryStatus;
    // Add some randomness
    if (primaryStatus === 'online' && Math.random() < 0.05) status = 'degraded';
    if (primaryStatus === 'degraded' && Math.random() < 0.3)
      status = Math.random() < 0.5 ? 'online' : 'offline';
    if (primaryStatus === 'offline' && Math.random() < 0.1) status = 'degraded';

    ticks.push({
      timestamp: new Date(Date.now() - (count - i) * 60000).toLocaleTimeString(
        'en-US',
        {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        }
      ),
      status,
      responseTime:
        status === 'offline' ? 0 : Math.floor(Math.random() * 1000) + 100,
    });
  }
  return ticks;
}

const StatusBadge = ({ status }: { status: string }) => {
  const configs = {
    online: {
      bg: 'bg-gradient-to-r from-emerald-500/20 to-green-500/20',
      border: 'border-emerald-400/40',
      text: 'text-emerald-300',
      icon: <CheckCircle className='w-3 h-3' />,
    },
    degraded: {
      bg: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20',
      border: 'border-yellow-400/40',
      text: 'text-yellow-300',
      icon: <AlertTriangle className='w-3 h-3' />,
    },
    offline: {
      bg: 'bg-gradient-to-r from-red-500/20 to-pink-500/20',
      border: 'border-red-400/40',
      text: 'text-red-300',
      icon: <WifiOff className='w-3 h-3' />,
    },
  };

  const config = configs[status as keyof typeof configs];

  return (
    <div
      className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border ${config.bg} ${config.border}`}
    >
      {config.icon}
      <span className={`text-xs font-medium capitalize ${config.text}`}>
        {status}
      </span>
    </div>
  );
};

const UptimeTicks = ({ ticks }: { ticks: Tick[] }) => {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h4 className='text-sm font-medium text-gray-300'>Last 30 Minutes</h4>
        <div className='flex items-center space-x-2 text-xs text-gray-400'>
          <div className='flex items-center space-x-1'>
            <div className='w-3 h-3 rounded-full bg-emerald-500'></div>
            <span>Online</span>
          </div>
          <div className='flex items-center space-x-1'>
            <div className='w-3 h-3 rounded-full bg-yellow-500'></div>
            <span>Degraded</span>
          </div>
          <div className='flex items-center space-x-1'>
            <div className='w-3 h-3 rounded-full bg-red-500'></div>
            <span>Offline</span>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-10 gap-1'>
        {ticks.map((tick, index) => (
          <div key={index} className='group relative'>
            <div
              className={`h-8 rounded-sm cursor-pointer transition-all duration-200 hover:scale-110 ${
                tick.status === 'online'
                  ? 'bg-emerald-500 hover:bg-emerald-400'
                  : tick.status === 'degraded'
                    ? 'bg-yellow-500 hover:bg-yellow-400'
                    : 'bg-red-500 hover:bg-red-400'
              }`}
              title={`${tick.timestamp} - ${tick.status} (${tick.responseTime}ms)`}
            />
            <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10'>
              {tick.timestamp}
              <br />
              {tick.status} - {tick.responseTime}ms
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [expandedWebsite, setExpandedWebsite] = useState<number | null>(null);

  const toggleWebsite = (id: number) => {
    setExpandedWebsite(expandedWebsite === id ? null : id);
  };

  const onlineCount = mockWebsites.filter((w) => w.status === 'online').length;
  const totalCount = mockWebsites.length;
  const avgUptime =
    mockWebsites.reduce((acc, w) => acc + w.uptime, 0) / totalCount;

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white'>
      <div className='absolute inset-0 bg-gradient-to-r from-violet-600/5 via-blue-600/10 to-cyan-600/5'></div>
      <div className='absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl'></div>
      <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl'></div>

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h1 className='text-4xl font-bold bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2'>
                Dashboard
              </h1>
              <p className='text-gray-400 text-lg'>
                Monitor your infrastructure in real-time
              </p>
            </div>
            <Button className='bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'>
              <Plus className='w-4 h-4 mr-2' />
              Add Monitor
            </Button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
            <div className='p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-sm'>
              <div className='flex items-center justify-between mb-4'>
                <div className='p-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-green-500/20'>
                  <CheckCircle className='w-6 h-6 text-emerald-400' />
                </div>
              </div>
              <div className='text-2xl font-bold text-white mb-1'>
                {onlineCount}/{totalCount}
              </div>
              <div className='text-gray-400 text-sm'>Services Online</div>
            </div>

            <div className='p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-sm'>
              <div className='flex items-center justify-between mb-4'>
                <div className='p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20'>
                  <TrendingUp className='w-6 h-6 text-blue-400' />
                </div>
              </div>
              <div className='text-2xl font-bold text-white mb-1'>
                {avgUptime.toFixed(2)}%
              </div>
              <div className='text-gray-400 text-sm'>Average Uptime</div>
            </div>

            <div className='p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-sm'>
              <div className='flex items-center justify-between mb-4'>
                <div className='p-3 rounded-xl bg-gradient-to-r from-violet-500/20 to-purple-500/20'>
                  <Activity className='w-6 h-6 text-violet-400' />
                </div>
              </div>
              <div className='text-2xl font-bold text-white mb-1'>24/7</div>
              <div className='text-gray-400 text-sm'>Monitoring</div>
            </div>

            <div className='p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-sm'>
              <div className='flex items-center justify-between mb-4'>
                <div className='p-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-teal-500/20'>
                  <Clock className='w-6 h-6 text-cyan-400' />
                </div>
              </div>
              <div className='text-2xl font-bold text-white mb-1'>30s</div>
              <div className='text-gray-400 text-sm'>Check Interval</div>
            </div>
          </div>
        </div>

        <div className='space-y-4'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold text-gray-200'>Your Monitors</h2>
            <div className='flex items-center space-x-2 text-sm text-gray-400'>
              <Calendar className='w-4 h-4' />
              <span>Last updated: just now</span>
            </div>
          </div>

          {mockWebsites.map((website) => (
            <div
              key={website.id}
              className='rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 backdrop-blur-sm overflow-hidden'
            >
              <div
                className='p-6 cursor-pointer hover:bg-gray-800/30 transition-all duration-200'
                onClick={() => toggleWebsite(website.id)}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-4'>
                    <div className='flex items-center space-x-2'>
                      {expandedWebsite === website.id ? (
                        <ChevronDown className='w-5 h-5 text-gray-400' />
                      ) : (
                        <ChevronRight className='w-5 h-5 text-gray-400' />
                      )}
                      <div
                        className={`p-3 rounded-xl ${
                          website.status === 'online'
                            ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20'
                            : website.status === 'degraded'
                              ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20'
                              : 'bg-gradient-to-r from-red-500/20 to-pink-500/20'
                        }`}
                      >
                        <Globe
                          className={`w-5 h-5 ${
                            website.status === 'online'
                              ? 'text-emerald-400'
                              : website.status === 'degraded'
                                ? 'text-yellow-400'
                                : 'text-red-400'
                          }`}
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className='text-lg font-semibold text-white mb-1'>
                        {website.name}
                      </h3>
                      <div className='flex items-center space-x-2 text-gray-400 text-sm'>
                        <span>{website.url}</span>
                        <ExternalLink className='w-3 h-3' />
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center space-x-6'>
                    <div className='text-right'>
                      <div className='text-white font-semibold'>
                        {website.uptime}%
                      </div>
                      <div className='text-gray-400 text-xs'>Uptime</div>
                    </div>
                    <div className='text-right'>
                      <div className='text-white font-semibold'>
                        {website.responseTime}ms
                      </div>
                      <div className='text-gray-400 text-xs'>Response</div>
                    </div>
                    <div className='text-right'>
                      <StatusBadge status={website.status} />
                      <div className='text-gray-400 text-xs mt-1'>
                        {website.lastChecked}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {expandedWebsite === website.id && (
                <div className='border-t border-gray-700/50 p-6 bg-gray-900/30'>
                  <UptimeTicks ticks={website.ticks} />

                  <div className='mt-6 flex items-center justify-between'>
                    <div className='flex items-center space-x-4'>
                      <Button
                        variant='outline'
                        size='sm'
                        className='bg-gray-800/50 border-gray-600/50 text-gray-300 hover:text-white hover:border-cyan-500/50'
                      >
                        <Eye className='w-4 h-4 mr-2' />
                        View Details
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        className='bg-gray-800/50 border-gray-600/50 text-gray-300 hover:text-white hover:border-violet-500/50'
                      >
                        <Zap className='w-4 h-4 mr-2' />
                        Test Now
                      </Button>
                    </div>
                    <div className='text-xs text-gray-500'>
                      Monitoring every 30 seconds from 5 global locations
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {mockWebsites.length === 0 && (
          <div className='text-center py-16'>
            <div className='p-6 rounded-full bg-gradient-to-r from-violet-500/20 to-cyan-500/20 w-24 h-24 mx-auto mb-6 flex items-center justify-center'>
              <Globe className='w-12 h-12 text-violet-400' />
            </div>
            <h3 className='text-2xl font-bold text-gray-300 mb-4'>
              No monitors yet
            </h3>
            <p className='text-gray-500 mb-8 max-w-md mx-auto'>
              Start monitoring your Web3 infrastructure by adding your first
              monitor
            </p>
            <Button className='bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-white font-semibold px-8 py-3 rounded-xl'>
              <Plus className='w-4 h-4 mr-2' />
              Add Your First Monitor
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
