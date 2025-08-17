'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCathiesArkSummary, CathiesArkSummary } from '@/lib/cathiesark-api';

interface UseTradesDataReturn {
  data: CathiesArkSummary;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  progress: number;
  status: string;
  refresh: () => void;
}

// Simple cache with timestamp
const CACHE_KEY = 'cathies_ark_trades_data';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CachedData {
  data: CathiesArkSummary;
  timestamp: number;
}

export const useTradesData = (): UseTradesDataReturn => {
  const [data, setData] = useState<CathiesArkSummary>(getCathiesArkSummary());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('就绪');

  const fetchData = useCallback(() => {
    setIsLoading(true);
    setStatus('更新数据...');
    
    // Simulate API call
    setTimeout(() => {
      try {
        const newData = getCathiesArkSummary();
        setData(newData);
        setLastUpdated(new Date());
        setError(null);
        setStatus('就绪');
      } catch (err) {
        setError(err instanceof Error ? err.message : '数据加载失败');
        setStatus('错误');
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  }, []);

  // Auto refresh every 5 minutes
  useEffect(() => {
    fetchData();
    
    const interval = setInterval(fetchData, CACHE_DURATION);
    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    lastUpdated,
    progress,
    status,
    refresh: fetchData
  };
};