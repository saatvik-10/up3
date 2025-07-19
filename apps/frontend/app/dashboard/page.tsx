'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Globe,
  TrendingUp,
  CheckCircle,
  Clock,
  Activity,
  ChevronDown,
  ChevronUp,
  Plus,
  Calendar,
  Zap,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { CreateWebsiteModal } from '@/components/CreateWebsiteModel';
import { API_BACKEND_URL } from '@/utils/config';
import axios from 'axios';
import { UserWebsites } from '@/hooks/userWebsites';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';

type UptimeStatus = 'good' | 'bad' | 'unknown';

function StatusCircle({ status }: { status: UptimeStatus }) {
  return (
    <div
      className={`w-3 h-3 rounded-full ${
        status === 'good'
          ? 'bg-gradient-to-r from-emerald-500 to-green-500'
          : status === 'bad'
            ? 'bg-gradient-to-r from-red-500 to-pink-500'
            : 'bg-gradient-to-r from-gray-500 to-gray-600'
      }`}
    />
  );
}

function UptimeTicks({ ticks }: { ticks: UptimeStatus[] }) {
  return (
    <div className='flex gap-1 mt-2'>
      {ticks.map((tick, index) => (
        <div
          key={index}
          className={`w-8 h-2 rounded ${
            tick === 'good'
              ? 'bg-gradient-to-r from-emerald-500 to-green-500'
              : tick === 'bad'
                ? 'bg-gradient-to-r from-red-500 to-pink-500'
                : 'bg-gradient-to-r from-gray-500 to-gray-600'
          }`}
        />
      ))}
    </div>
  );
}

interface ProcessedWebsite {
  id: number;
  url: string;
  status: UptimeStatus;
  uptimePercentage: number;
  lastChecked: string;
  uptimeTicks: UptimeStatus[];
}

function WebsiteCard({ website }: { website: ProcessedWebsite }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className='rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 backdrop-blur-sm overflow-hidden'>
      <div
        className='p-6 cursor-pointer hover:bg-gray-800/30 transition-all duration-200 flex items-center justify-between'
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-2'>
            {isExpanded ? (
              <ChevronDown className='w-5 h-5 text-gray-400' />
            ) : (
              <ChevronUp className='w-5 h-5 text-gray-400' />
            )}
            <div
              className={`p-3 rounded-xl ${
                website.status === 'good'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20'
                  : website.status === 'bad'
                    ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20'
                    : 'bg-gradient-to-r from-gray-500/20 to-gray-600/20'
              }`}
            >
              <Globe
                className={`w-5 h-5 ${
                  website.status === 'good'
                    ? 'text-emerald-400'
                    : website.status === 'bad'
                      ? 'text-red-400'
                      : 'text-gray-400'
                }`}
              />
            </div>
          </div>
          <div>
            <h3 className='text-lg font-semibold text-white mb-1'>
              {website.url}
            </h3>
            <div className='flex items-center space-x-2 text-gray-400 text-sm just'>
              <Link href={website.url} target='_blank'>
                <div className='flex items-center justify-center gap-2'>
                  <span>Visit Website</span>
                  <ExternalLink className='w-3 h-3' />
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className='flex items-center space-x-6'>
          <div className='text-right'>
            <div className='text-white font-semibold'>
              {website.uptimePercentage.toFixed(1)}%
            </div>
            <div className='text-gray-400 text-xs'>Uptime</div>
          </div>
          <div className='text-right'>
            <StatusCircle status={website.status} />
            <div className='text-gray-400 text-xs mt-1'>
              {website.lastChecked}
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className='border-t border-gray-700/50 p-6 bg-gray-900/30'>
          <div className='mt-3'>
            <div className='flex items-center justify-between mb-4'>
              <h4 className='text-sm font-medium text-gray-300'>
                Last 30 Minutes
              </h4>
              <div className='flex items-center space-x-2 text-xs text-gray-400'>
                <div className='flex items-center space-x-1'>
                  <div className='w-3 h-3 rounded-full bg-emerald-500'></div>
                  <span>Good</span>
                </div>
                <div className='flex items-center space-x-1'>
                  <div className='w-3 h-3 rounded-full bg-red-500'></div>
                  <span>Bad</span>
                </div>
                <div className='flex items-center space-x-1'>
                  <div className='w-3 h-3 rounded-full bg-gray-500'></div>
                  <span>Unknown</span>
                </div>
              </div>
            </div>
            <UptimeTicks ticks={website.uptimeTicks} />
          </div>

          <div className='mt-6 flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
            </div>
            <div className='text-xs text-gray-500'>
              Monitoring every 60 seconds from 5 global locations
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { websites, fetchWebsites } = UserWebsites();
  const { getToken } = useAuth();

  const processedWebsites = useMemo(() => {
    return websites.map((website) => {
      // Sort ticks by creation time
      const sortedTicks = [...website.ticks].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Get the most recent 30 minutes of ticks
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      const recentTicks = sortedTicks.filter(
        (tick) => new Date(tick.createdAt) > thirtyMinutesAgo
      );

      // Aggregate ticks into 3-minute windows (10 windows total)
      const windows: UptimeStatus[] = [];

      for (let i = 0; i < 10; i++) {
        const windowStart = new Date(Date.now() - (i + 1) * 3 * 60 * 1000);
        const windowEnd = new Date(Date.now() - i * 3 * 60 * 1000);

        const windowTicks = recentTicks.filter((tick) => {
          const tickTime = new Date(tick.createdAt);
          return tickTime >= windowStart && tickTime < windowEnd;
        });

        // Window is considered up if majority of ticks are up
        const upTicks = windowTicks.filter(
          (tick) => tick.status === 'Good'
        ).length;
        windows[9 - i] =
          windowTicks.length === 0
            ? 'unknown'
            : upTicks / windowTicks.length >= 0.5
              ? 'good'
              : 'bad';
      }

      // Calculate overall status and uptime percentage
      const totalTicks = sortedTicks.length;
      const upTicks = sortedTicks.filter(
        (tick) => tick.status === 'Good'
      ).length;
      const uptimePercentage =
        totalTicks === 0 ? 100 : (upTicks / totalTicks) * 100;

      // Get the most recent status
      const currentStatus = windows[windows.length - 1];

      // Format the last checked time
      const lastChecked = sortedTicks[0]
        ? new Date(sortedTicks[0].createdAt).toLocaleTimeString()
        : 'Never';

      return {
        id: website.id,
        url: website.url,
        status: currentStatus,
        uptimePercentage,
        lastChecked,
        uptimeTicks: windows,
      };
    });
  }, [websites]);

  const onlineCount = processedWebsites.filter(
    (w) => w.status === 'good'
  ).length;
  const totalCount = processedWebsites.length;
  const avgUptime =
    processedWebsites.length > 0
      ? processedWebsites.reduce((acc, w) => acc + w.uptimePercentage, 0) /
        totalCount
      : 0;

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
            <Button
              onClick={() => setIsModalOpen(true)}
              className='bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'
            >
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
              <div className='text-2xl font-bold text-white mb-1'>60s</div>
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

          <div className='space-y-4'>
            {processedWebsites.map((website) => (
              <WebsiteCard key={website.id} website={website} />
            ))}
          </div>
        </div>

        {processedWebsites.length === 0 && (
          <div className='text-center py-16'>
            <div className='p-6 rounded-full bg-gradient-to-r from-violet-500/20 to-cyan-500/20 w-24 h-24 mx-auto mb-6 flex items-center justify-center'>
              <Globe className='w-12 h-12 text-violet-400' />
            </div>
            <h3 className='text-2xl font-bold text-gray-300 mb-4'>
              No monitors yet
            </h3>
            <p className='text-gray-500 mb-8 mx-auto'>
              Start monitoring your infrastructure by adding your first monitor
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className='bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-white font-semibold px-8 py-3 rounded-xl'
            >
              <Plus className='w-4 h-4 mr-2' />
              Add Your First Monitor
            </Button>
          </div>
        )}
      </div>

      <CreateWebsiteModal
        isOpen={isModalOpen}
        onClose={async (url) => {
          if (url === null) {
            setIsModalOpen(false);
            return;
          }

          const token = await getToken();
          setIsModalOpen(false);
          axios
            .post(
              `${API_BACKEND_URL}/api/v1/website`,
              {
                url,
              },
              {
                headers: {
                  Authorization: token,
                },
              }
            )
            .then(() => {
              fetchWebsites();
            });
        }}
      />
    </div>
  );
}
