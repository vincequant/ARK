'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { 
  Bitcoin,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  BarChart3,
  RefreshCw,
  Clock,
  ArrowUp,
  ArrowDown,
  Activity,
  AlertCircle
} from 'lucide-react';

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Badge
} from '@/components/ui';
import { useBTCTraders } from '@/hooks/use-btc-traders';
import { calculateLongShortRatio, getPnLDistribution } from '@/lib/hyperdash-api';

export default function CryptoPage() {
  const { data, isLoading, error, lastUpdated, refresh } = useBTCTraders({
    autoRefresh: true,
    refreshInterval: 30000 // 30秒自动刷新
  });

  if (!data && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-100 dark:from-orange-900 dark:via-yellow-900 dark:to-amber-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-100 dark:from-orange-900 dark:via-yellow-900 dark:to-amber-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-100 dark:from-orange-900 dark:via-yellow-900 dark:to-amber-900">
      <div className="container mx-auto p-6 space-y-8">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-3xl shadow-lg mb-6">
            <Bitcoin className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            BTC 主仓位追踪
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-6">
            实时追踪 HyperDash 顶级交易者的 BTC 主仓位，分析交易方向和资金流向
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Badge variant="outline" className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              实时数据追踪
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {lastUpdated?.toLocaleTimeString('zh-CN') || '未更新'}
            </Badge>
            <button
              onClick={refresh}
              disabled={isLoading}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? '更新中...' : '刷新数据'}
            </button>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* 数据概览统计 */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl">
                  BTC 主仓位汇总概览
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  追踪顶级交易者的 BTC 主仓位数据和交易方向分析
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border border-orange-200 dark:border-orange-800 rounded-2xl">
                    <div className="text-3xl font-bold text-orange-700 dark:text-orange-300 mb-2">
                      ${(data.totalValue / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm text-orange-600 dark:text-orange-400 font-semibold">总仓位价值</div>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
                    <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 mb-2 flex items-center justify-center gap-1">
                      <ArrowUp className="w-6 h-6" />
                      ${(data.totalLongValue / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">做多仓位 ({data.longCount}人)</div>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900 border border-rose-200 dark:border-rose-800 rounded-2xl">
                    <div className="text-3xl font-bold text-rose-700 dark:text-rose-300 mb-2 flex items-center justify-center gap-1">
                      <ArrowDown className="w-6 h-6" />
                      ${(data.totalShortValue / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm text-rose-600 dark:text-rose-400 font-semibold">做空仓位 ({data.shortCount}人)</div>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-200 dark:border-blue-800 rounded-2xl">
                    <div className={`text-3xl font-bold mb-2 ${
                      data.totalPnL >= 0 
                        ? 'text-emerald-700 dark:text-emerald-300' 
                        : 'text-rose-700 dark:text-rose-300'
                    }`}>
                      {data.totalPnL >= 0 ? '+' : ''}
                      ${(data.totalPnL / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold">24h 总盈亏</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 做多做空比例图表 */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl">
                  多空方向分析
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  顶级交易者的仓位方向分布和资金占比
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* 资金分布 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">资金分布</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                          <span className="text-sm">做多仓位</span>
                        </div>
                        <div className="text-sm font-medium">
                          {((data.totalLongValue / data.totalValue) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${(data.totalLongValue / data.totalValue) * 100}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-rose-500 rounded"></div>
                          <span className="text-sm">做空仓位</span>
                        </div>
                        <div className="text-sm font-medium">
                          {((data.totalShortValue / data.totalValue) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-rose-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${(data.totalShortValue / data.totalValue) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* 交易者分布 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">交易者分布</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950 rounded-xl">
                        <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mb-1">
                          {data.longCount}
                        </div>
                        <div className="text-sm text-emerald-600 dark:text-emerald-400">做多交易者</div>
                      </div>
                      <div className="text-center p-4 bg-rose-50 dark:bg-rose-950 rounded-xl">
                        <div className="text-2xl font-bold text-rose-700 dark:text-rose-300 mb-1">
                          {data.shortCount}
                        </div>
                        <div className="text-sm text-rose-600 dark:text-rose-400">做空交易者</div>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-xl">
                      <div className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-1">
                        {data.avgLeverage.toFixed(1)}x
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">平均杠杆</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 交易者详细列表 */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl">
                  顶级交易者 BTC 仓位详情
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  按仓位价值排序的交易者详细信息
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.traders
                    .sort((a, b) => b.usdValue - a.usdValue)
                    .map((trader, index) => (
                      <div 
                        key={trader.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-lg font-bold text-gray-500">
                            #{index + 1}
                          </div>
                          <div>
                            <div className="font-semibold">{trader.username}</div>
                            <div className="text-sm text-gray-500">{trader.address}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="font-semibold">{trader.position.toFixed(2)} BTC</div>
                            <div className="text-sm text-gray-500">${(trader.usdValue / 1000000).toFixed(2)}M</div>
                          </div>
                          
                          <div className="text-center">
                            <Badge 
                              variant={trader.direction === 'long' ? 'default' : 'destructive'}
                              className="mb-1"
                            >
                              {trader.direction === 'long' ? '做多' : '做空'} {trader.leverage.toFixed(1)}x
                            </Badge>
                            <div className="text-sm text-gray-500">杠杆</div>
                          </div>
                          
                          <div className="text-right">
                            <div className={`font-semibold ${
                              trader.pnl >= 0 
                                ? 'text-emerald-600 dark:text-emerald-400' 
                                : 'text-rose-600 dark:text-rose-400'
                            }`}>
                              {trader.pnl >= 0 ? '+' : ''}${(trader.pnl / 1000).toFixed(0)}K
                            </div>
                            <div className={`text-sm ${
                              trader.pnlPercent >= 0 
                                ? 'text-emerald-600 dark:text-emerald-400' 
                                : 'text-rose-600 dark:text-rose-400'
                            }`}>
                              {trader.pnlPercent >= 0 ? '+' : ''}{trader.pnlPercent.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}