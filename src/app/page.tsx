'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, Timer, Users, Activity, Eye, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';
import CathiesArkTradesChart from '@/components/charts/cathies-ark-trades-chart';
import { getAllFundsSummary, ARKFund, CathiesArkTrade } from '@/lib/cathiesark-api';

export default function Home() {
  const [allData, setAllData] = React.useState(() => getAllFundsSummary());
  const [isLoading, setIsLoading] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      setAllData(getAllFundsSummary());
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = React.useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setAllData(getAllFundsSummary());
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatMillion = React.useCallback((value: number) => {
    if (!isMounted) return '0';
    return (value / 1000000).toFixed(1);
  }, [isMounted]);

  const fundCards = [
    { 
      fund: 'ARKK' as ARKFund, 
      name: 'ARKK', 
      description: 'ARK Innovation ETF',
      color: 'from-purple-500 to-purple-600',
      icon: '🚀'
    },
    { 
      fund: 'ARKW' as ARKFund, 
      name: 'ARKW', 
      description: 'ARK Next Generation Internet ETF',
      color: 'from-blue-500 to-blue-600',
      icon: '🌐'
    },
    { 
      fund: 'ARKG' as ARKFund, 
      name: 'ARKG', 
      description: 'ARK Genomic Revolution ETF',
      color: 'from-green-500 to-green-600',
      icon: '🧬'
    },
    { 
      fund: 'ARKQ' as ARKFund, 
      name: 'ARKQ', 
      description: 'ARK Autonomous Technology & Robotics ETF',
      color: 'from-orange-500 to-orange-600',
      icon: '🤖'
    },
    { 
      fund: 'ARKF' as ARKFund, 
      name: 'ARKF', 
      description: 'ARK Fintech Innovation ETF',
      color: 'from-yellow-500 to-yellow-600',
      icon: '💰'
    },
    { 
      fund: 'ARKX' as ARKFund, 
      name: 'ARKX', 
      description: 'ARK Space Exploration & Innovation ETF',
      color: 'from-cyan-500 to-cyan-600',
      icon: '🚀'
    }
  ];

  const topNetBuyStocks = React.useMemo(() => {
    if (!isMounted) return [];
    return allData.groupedTrades
      .filter(g => g.netValue > 0)
      .slice(0, 5);
  }, [allData.groupedTrades, isMounted]);

  const topNetSellStocks = React.useMemo(() => {
    if (!isMounted) return [];
    return allData.groupedTrades
      .filter(g => g.netValue < 0)
      .slice(0, 5);
  }, [allData.groupedTrades, isMounted]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">ARK 全基金汇总</h1>
          <p className="text-purple-200">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">ARK 全基金汇总</h1>
          <p className="text-xl text-purple-200 mb-6">
            汇总 Cathie Wood 的 ARK Invest 全系列 ETF 交易数据和投资策略
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Badge className="bg-white/10 text-white border-white/20 px-4 py-2">
              <Activity className="w-4 h-4 mr-2" />
              实时数据更新
            </Badge>
            <Badge className="bg-white/10 text-white border-white/20 px-4 py-2">
              <Timer className="w-4 h-4 mr-2" />
              11:04:30
            </Badge>
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-all"
            >
              刷新
            </button>
          </div>
        </motion.div>

        {/* Main Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card className="bg-gray-900/40 backdrop-blur-sm border-gray-700/50 text-white">
            <CardHeader>
              <CardTitle className="text-white text-lg">ARK 全基金交易数据概况</CardTitle>
              <p className="text-gray-300 text-sm">汇总 ARKK, ARKW, ARKG, ARKQ, ARKF, ARKX 六个基金交易数据</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-purple-500/20 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      {allData.groupedTrades.length}
                    </div>
                    <div className="text-purple-200 text-sm">总交易数量</div>
                  </div>
                </div>
                
                <div className="bg-green-500/20 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">
                      ${formatMillion(allData.totalBuyValue)}M
                    </div>
                    <div className="text-green-200 text-sm">总买入金额</div>
                  </div>
                </div>
                
                <div className="bg-red-500/20 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-400 mb-1">
                      ${formatMillion(allData.totalSellValue)}M
                    </div>
                    <div className="text-red-200 text-sm">总卖出金额</div>
                  </div>
                </div>
                
                <div className="bg-blue-500/20 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-center">
                    <div className={`text-3xl font-bold mb-1 ${allData.netFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {allData.netFlow >= 0 ? '+' : ''}${formatMillion(allData.netFlow)}M
                    </div>
                    <div className="text-blue-200 text-sm">净资金流向</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="bg-green-500/10 backdrop-blur-sm border-green-500/20 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-green-200 mb-1">总买入</div>
                  <div className="text-2xl font-bold text-green-400">
                    ${formatMillion(allData.totalBuyValue)}M
                  </div>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-500/10 backdrop-blur-sm border-red-500/20 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-red-200 mb-1">总卖出</div>
                  <div className="text-2xl font-bold text-red-400">
                    ${formatMillion(allData.totalSellValue)}M
                  </div>
                </div>
                <TrendingDown className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-500/10 backdrop-blur-sm border-blue-500/20 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-blue-200 mb-1">净流向</div>
                  <div className={`text-2xl font-bold ${allData.netFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {allData.netFlow >= 0 ? '+' : ''}${formatMillion(allData.netFlow)}M
                  </div>
                </div>
                <Activity className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
            <CathiesArkTradesChart
              trades={allData.trades}
              showTop={20}
              fundName="ARKK"
              className="w-full"
            />
          </div>
        </motion.div>

        {/* Individual Fund Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <Card className="bg-gray-900/40 backdrop-blur-sm border-gray-700/50 text-white">
            <CardHeader>
              <CardTitle className="text-white text-lg">查看单个基金详情</CardTitle>
              <p className="text-gray-300 text-sm">点击任意基金查看更详细的交易数据和分析</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {fundCards.map((fund, index) => (
                  <motion.a
                    key={fund.fund}
                    href={`/${fund.fund.toLowerCase()}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="block group"
                  >
                    <div className={`bg-gradient-to-br ${fund.color} p-6 rounded-2xl text-center transform transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg`}>
                      <div className="text-3xl mb-3">{fund.icon}</div>
                      <div className="text-white font-bold text-lg mb-1">{fund.name}</div>
                      <div className="text-white/80 text-xs mb-3">查看详情</div>
                      <div className="flex items-center justify-center text-white/60">
                        <Eye className="w-4 h-4 mr-1" />
                        <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}