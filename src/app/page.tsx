'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, DollarSign, Calendar, Activity, Target, Zap, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';
import CathiesArkTradesChart from '@/components/charts/cathies-ark-trades-chart';
import { getAllFundsSummary, ARKFund, ARK_FUND_NAMES, CathiesArkTrade } from '@/lib/cathiesark-api';

interface FundCardProps {
  fund: ARKFund;
  title: string;
  description: string;
  color: string;
  trades: CathiesArkTrade[];
  index: number;
}

const FundCard: React.FC<FundCardProps> = ({ fund, title, description, color, trades, index }) => {
  const [isMounted, setIsMounted] = React.useState(false);
  const buyValue = trades.filter(t => t.direction === 'BUY').reduce((sum, t) => sum + t.marketValue, 0);
  const sellValue = trades.filter(t => t.direction === 'SELL').reduce((sum, t) => sum + t.marketValue, 0);
  const netFlow = buyValue - sellValue;

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const formatMillion = (value: number) => {
    if (!isMounted) return '0';
    return (value / 1000000).toFixed(1);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className={`hover:shadow-lg transition-all duration-300 border-l-4 ${color} group cursor-pointer`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">{fund}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{title}</p>
            </div>
            <Badge 
              variant={netFlow >= 0 ? 'default' : 'destructive'}
              className="px-2 py-1"
            >
              {netFlow >= 0 ? '净流入' : '净流出'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-700">买入</span>
              </div>
              <p className="text-sm font-semibold">${formatMillion(buyValue)}M</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <TrendingDown className="w-3 h-3 text-red-600" />
                <span className="text-xs text-red-700">卖出</span>
              </div>
              <p className="text-sm font-semibold">${formatMillion(sellValue)}M</p>
            </div>
          </div>
          
          <div className="border-t pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">净流向</span>
              <span className={`text-sm font-bold ${netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {netFlow >= 0 ? '+' : ''}${formatMillion(netFlow)}M
              </span>
            </div>
          </div>
          
          <div className="pt-2">
            <a 
              href={`/${fund.toLowerCase()}`}
              className={`inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md transition-colors group-hover:shadow-sm ${color.replace('border-l-', 'bg-').replace('-500', '-500/10').replace('-600', '-600/10')} hover:bg-opacity-80`}
            >
              <Eye className="w-3 h-3" />
              查看详情
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function Home() {
  const [allData, setAllData] = React.useState(() => getAllFundsSummary());
  const [isLoading, setIsLoading] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  const refreshData = React.useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setAllData(getAllFundsSummary());
      setIsLoading(false);
    }, 1000);
  }, []);

  React.useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(refreshData, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, [refreshData]);

  const funds: Array<{ fund: ARKFund; title: string; description: string; color: string }> = [
    { fund: 'ARKK', title: 'ARK Innovation ETF', description: '颠覆性创新技术', color: 'border-l-purple-500' },
    { fund: 'ARKW', title: 'ARK Next Generation Internet ETF', description: '下一代互联网', color: 'border-l-blue-500' },
    { fund: 'ARKG', title: 'ARK Genomic Revolution ETF', description: '基因组学革命', color: 'border-l-green-500' },
    { fund: 'ARKQ', title: 'ARK Autonomous Technology & Robotics ETF', description: '自动驾驶与机器人', color: 'border-l-orange-500' },
    { fund: 'ARKF', title: 'ARK Fintech Innovation ETF', description: '金融科技创新', color: 'border-l-yellow-500' },
    { fund: 'ARKX', title: 'ARK Space Exploration & Innovation ETF', description: '太空探索与创新', color: 'border-l-cyan-500' },
  ];

  const fundTradesMap = React.useMemo(() => {
    const map: Record<ARKFund, CathiesArkTrade[]> = {
      ARKK: allData.trades.filter(t => t.fund === 'ARKK'),
      ARKW: allData.trades.filter(t => t.fund === 'ARKW'),
      ARKG: allData.trades.filter(t => t.fund === 'ARKG'),
      ARKQ: allData.trades.filter(t => t.fund === 'ARKQ'),
      ARKF: allData.trades.filter(t => t.fund === 'ARKF'),
      ARKX: allData.trades.filter(t => t.fund === 'ARKX'),
    };
    return map;
  }, [allData.trades]);

  const topNetBuyStocks = React.useMemo(() => {
    return allData.groupedTrades
      .filter(g => g.netValue > 0)
      .slice(0, 5)
      .map(g => ({
        symbol: g.symbol,
        name: g.companyName.length > 20 ? g.companyName.substring(0, 17) + '...' : g.companyName,
        value: g.netValue
      }));
  }, [allData.groupedTrades]);

  const topNetSellStocks = React.useMemo(() => {
    return allData.groupedTrades
      .filter(g => g.netValue < 0)
      .slice(0, 5)
      .map(g => ({
        symbol: g.symbol,
        name: g.companyName.length > 20 ? g.companyName.substring(0, 17) + '...' : g.companyName,
        value: Math.abs(g.netValue)
      }));
  }, [allData.groupedTrades]);

  // 安全的数字格式化函数
  const formatMillion = React.useCallback((value: number) => {
    if (!isMounted) return '0';
    return (value / 1000000).toFixed(1);
  }, [isMounted]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
              ARK 基金交易追踪器
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            实时监控 Cathie Wood 的 ARK 投资基金组合交易动态
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              实时数据
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              6 只基金
            </Badge>
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              <Zap className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? '更新中...' : '刷新数据'}
            </button>
          </div>
        </motion.div>

        {/* Summary Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">总买入</p>
                  <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                    ${formatMillion(allData.totalBuyValue)}M
                  </p>
                </div>
                <div className="p-3 bg-green-500 rounded-full">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">总卖出</p>
                  <p className="text-2xl font-bold text-red-800 dark:text-red-200">
                    ${formatMillion(allData.totalSellValue)}M
                  </p>
                </div>
                <div className="p-3 bg-red-500 rounded-full">
                  <TrendingDown className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">净流向</p>
                  <p className={`text-2xl font-bold ${allData.netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {allData.netFlow >= 0 ? '+' : ''}${formatMillion(allData.netFlow)}M
                  </p>
                </div>
                <div className={`p-3 rounded-full ${allData.netFlow >= 0 ? 'bg-blue-500' : 'bg-orange-500'}`}>
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">活跃股票</p>
                  <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                    {allData.groupedTrades.length}
                  </p>
                </div>
                <div className="p-3 bg-purple-500 rounded-full">
                  <Activity className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Stocks Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <TrendingUp className="w-5 h-5" />
                热门买入股票 (Top 5)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topNetBuyStocks.map((stock, index) => (
                  <div key={stock.symbol} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div>
                      <p className="font-semibold text-sm">{stock.symbol}</p>
                      <p className="text-xs text-muted-foreground">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">+${formatMillion(stock.value)}M</p>
                      <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <TrendingDown className="w-5 h-5" />
                热门卖出股票 (Top 5)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topNetSellStocks.map((stock, index) => (
                  <div key={stock.symbol} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                    <div>
                      <p className="font-semibold text-sm">{stock.symbol}</p>
                      <p className="text-xs text-muted-foreground">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-600">-${formatMillion(stock.value)}M</p>
                      <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Individual Fund Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-center mb-6">基金概览</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {funds.map((fund, index) => (
              <FundCard
                key={fund.fund}
                fund={fund.fund}
                title={fund.title}
                description={fund.description}
                color={fund.color}
                trades={fundTradesMap[fund.fund]}
                index={index}
              />
            ))}
          </div>
        </motion.div>

        {/* Main Chart - All Funds Combined */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <CathiesArkTradesChart
            trades={allData.trades}
            showTop={20}
            fundName="全部基金汇总"
            className="w-full"
          />
        </motion.div>
      </div>
    </div>
  );
}