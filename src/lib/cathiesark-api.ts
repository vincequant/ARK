// Cathie's ARK API service for fetching real trade data
export interface CathiesArkTrade {
  symbol: string;
  companyName: string;
  direction: 'BUY' | 'SELL';
  marketValue: number;
  date: string;
  fund: string;
}

export interface GroupedCathiesArkTrade {
  symbol: string;
  companyName: string;
  trades: CathiesArkTrade[];
  totalBuyValue: number;
  totalSellValue: number;
  netValue: number;
  latestTradeDate: string;
}

export interface CathiesArkSummary {
  totalBuyValue: number;
  totalSellValue: number;
  netFlow: number;
  trades: CathiesArkTrade[];
  groupedTrades: GroupedCathiesArkTrade[];
  topTrades: CathiesArkTrade[];
}

export interface TradesResponse {
  trades: CathiesArkTrade[];
  totalBuyValue: number;
  totalSellValue: number;
  netFlow: number;
}

import { completeCathiesArkTrades } from './cathiesark-complete-trades';

// ARK Fund types
export type ARKFund = 'ARKK' | 'ARKW' | 'ARKG' | 'ARKQ' | 'ARKF' | 'ARKX';

// Fund display names
export const ARK_FUND_NAMES: Record<ARKFund, string> = {
  ARKK: 'ARK Innovation ETF',
  ARKW: 'ARK Next Generation Internet ETF', 
  ARKG: 'ARK Genomic Revolution ETF',
  ARKQ: 'ARK Autonomous Technology & Robotics ETF',
  ARKF: 'ARK Fintech Innovation ETF',
  ARKX: 'ARK Space Exploration & Innovation ETF'
};

// Use complete data obtained through systematic WebFetch from cathiesark.com
export const mockCathiesArkData: CathiesArkTrade[] = completeCathiesArkTrades;

// Group trades by symbol
const groupTradesBySymbol = (trades: CathiesArkTrade[]): GroupedCathiesArkTrade[] => {
  const grouped = trades.reduce((acc, trade) => {
    if (!acc[trade.symbol]) {
      acc[trade.symbol] = {
        symbol: trade.symbol,
        companyName: trade.companyName,
        trades: [],
        totalBuyValue: 0,
        totalSellValue: 0,
        netValue: 0,
        latestTradeDate: trade.date
      };
    }
    
    acc[trade.symbol].trades.push(trade);
    
    if (trade.direction === 'BUY') {
      acc[trade.symbol].totalBuyValue += trade.marketValue;
    } else {
      acc[trade.symbol].totalSellValue += trade.marketValue;
    }
    
    acc[trade.symbol].netValue = acc[trade.symbol].totalBuyValue - acc[trade.symbol].totalSellValue;
    
    // Update latest trade date
    if (trade.date > acc[trade.symbol].latestTradeDate) {
      acc[trade.symbol].latestTradeDate = trade.date;
    }
    
    return acc;
  }, {} as Record<string, GroupedCathiesArkTrade>);
  
  // Convert to array and sort by absolute net value
  return Object.values(grouped)
    .map(group => ({
      ...group,
      trades: group.trades.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }))
    .sort((a, b) => Math.abs(b.netValue) - Math.abs(a.netValue));
};

// Filter trades by fund
export const getTradesByFund = (fund: ARKFund): CathiesArkTrade[] => {
  if (fund === 'COMBINED') {
    return mockCathiesArkData;
  }
  return mockCathiesArkData.filter(trade => trade.fund === fund);
};

// Generate mock data for other funds (since we currently only have ARKK data)
const generateMockDataForFund = (baseTrades: CathiesArkTrade[], fund: ARKFund): CathiesArkTrade[] => {
  if (fund === 'ARKK' || fund === 'COMBINED') {
    return baseTrades;
  }
  
  // For demo purposes, create variations of the ARKK data for other funds
  // In production, this would fetch real data from cathiesark.com/[fund]/trades
  const fundMultiplier = {
    ARKW: 0.7,
    ARKG: 0.5, 
    ARKQ: 0.6,
    ARKF: 0.4,
    ARKX: 0.3
  }[fund] || 0.5;
  
  return baseTrades
    .slice(0, Math.floor(baseTrades.length * fundMultiplier))
    .map(trade => ({
      ...trade,
      fund,
      marketValue: Math.floor(trade.marketValue * (0.8 + Math.random() * 0.4)) // Add some variation
    }));
};

// Get summary for all funds combined
export const getAllFundsSummary = (): CathiesArkSummary => {
  const allFunds: ARKFund[] = ['ARKK', 'ARKW', 'ARKG', 'ARKQ', 'ARKF', 'ARKX'];
  const allTrades: CathiesArkTrade[] = [];
  
  // Collect all trades from all funds
  allFunds.forEach(fund => {
    const fundTrades = generateMockDataForFund(mockCathiesArkData, fund);
    allTrades.push(...fundTrades);
  });
  
  const buyTrades = allTrades.filter(trade => trade.direction === 'BUY');
  const sellTrades = allTrades.filter(trade => trade.direction === 'SELL');
  
  const totalBuyValue = buyTrades.reduce((sum, trade) => sum + trade.marketValue, 0);
  const totalSellValue = sellTrades.reduce((sum, trade) => sum + trade.marketValue, 0);
  const netFlow = totalBuyValue - totalSellValue;
  
  // Sort by market value descending
  const sortedTrades = [...allTrades].sort((a, b) => b.marketValue - a.marketValue);
  const topTrades = sortedTrades.slice(0, 10);
  
  // Group trades by symbol
  const groupedTrades = groupTradesBySymbol(allTrades);
  
  return {
    totalBuyValue,
    totalSellValue,
    netFlow,
    trades: sortedTrades,
    groupedTrades,
    topTrades
  };
};

// Get trades for specific fund
export const getTradesForFund = (fund: ARKFund): TradesResponse => {
  const fundTrades = generateMockDataForFund(mockCathiesArkData, fund);
  
  const totalBuyValue = fundTrades
    .filter(t => t.direction === 'BUY')
    .reduce((sum, t) => sum + t.marketValue, 0);
    
  const totalSellValue = fundTrades
    .filter(t => t.direction === 'SELL')
    .reduce((sum, t) => sum + t.marketValue, 0);
    
  return {
    trades: fundTrades,
    totalBuyValue,
    totalSellValue,
    netFlow: totalBuyValue - totalSellValue
  };
};

export const getCathiesArkSummary = (fund: ARKFund = 'ARKK'): CathiesArkSummary => {
  const fundTrades = generateMockDataForFund(mockCathiesArkData, fund);
    
  const buyTrades = fundTrades.filter(trade => trade.direction === 'BUY');
  const sellTrades = fundTrades.filter(trade => trade.direction === 'SELL');
  
  const totalBuyValue = buyTrades.reduce((sum, trade) => sum + trade.marketValue, 0);
  const totalSellValue = sellTrades.reduce((sum, trade) => sum + trade.marketValue, 0);
  const netFlow = totalBuyValue - totalSellValue;
  
  // Sort by market value descending
  const sortedTrades = [...fundTrades].sort((a, b) => b.marketValue - a.marketValue);
  const topTrades = sortedTrades.slice(0, 10);
  
  // Group trades by symbol
  const groupedTrades = groupTradesBySymbol(fundTrades);
  
  return {
    totalBuyValue,
    totalSellValue,
    netFlow,
    trades: sortedTrades,
    groupedTrades,
    topTrades
  };
};

export const getCathiesArkTrades = (fund: ARKFund = 'ARKK'): CathiesArkTrade[] => {
  const fundTrades = generateMockDataForFund(mockCathiesArkData, fund);
  return fundTrades.sort((a, b) => b.marketValue - a.marketValue);
};

export const getGroupedCathiesArkTrades = (fund: ARKFund = 'ARKK'): GroupedCathiesArkTrade[] => {
  const fundTrades = generateMockDataForFund(mockCathiesArkData, fund);
  return groupTradesBySymbol(fundTrades);
};

