'use client';

import { API_BACKEND_URL } from '@/utils/config';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Tick {
  id: number;
  createdAt: string;
  status: string;
  latency: number;
}

interface Website {
  id: number;
  url: string;
  ticks: Tick[];
}

export function UserWebsites() {
  const { getToken } = useAuth();
  const [websites, setWebsites] = useState<Website[]>([]);

  async function fetchWebsites() {
    const token = await getToken();

    const res = await axios.get(`${API_BACKEND_URL}/api/v1/websites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setWebsites(res.data.websites);
  }

  useEffect(() => {
    fetchWebsites();

    const interval = setInterval(
      () => {
        fetchWebsites();
      },
      1000 * 60 * 1
    );

    return () => clearInterval(interval);
  }, []);

  return {  websites, fetchWebsites };
}
